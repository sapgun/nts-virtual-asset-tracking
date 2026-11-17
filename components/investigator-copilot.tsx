"use client";

import { useState } from "react";
import type {
  EvidenceItem,
  GraphNode,
  Hypothesis,
} from "@/lib/domain";
import type {
  InvestigatorQuestion,
  InvestigatorResponse,
} from "@/lib/adapters/investigator-adapter";
import { useLanguage } from "@/lib/i18n/provider";

const prompts: Array<[InvestigatorQuestion, string]> = [
  ["EXPLAIN_NODE", "evidence.copilot.promptExplainNode"],
  ["EXPLAIN_CONFIDENCE", "evidence.copilot.promptConfidence"],
  ["MISSING_EVIDENCE", "evidence.copilot.promptMissing"],
  ["NEXT_STEP", "evidence.copilot.promptNext"],
];

export function InvestigatorCopilot({
  node,
  hypothesis,
  evidence,
}: {
  node: GraphNode;
  hypothesis: Hypothesis;
  evidence: EvidenceItem[];
}) {
  const { locale, t, tc } = useLanguage();
  const [response, setResponse] =
    useState<InvestigatorResponse | null>(null);
  const [loading, setLoading] =
    useState<InvestigatorQuestion | null>(null);
  const [error, setError] = useState("");

  async function ask(question: InvestigatorQuestion) {
    setLoading(question);
    setError("");

    try {
      // Localize the context before sending: the rule-based adapter
      // interpolates node / hypothesis / evidence text into its answer.
      const localizedNode: GraphNode = {
        ...node,
        label: tc(node.label),
        description: tc(node.description),
      };
      const localizedHypothesis: Hypothesis = {
        ...hypothesis,
        claim: tc(hypothesis.claim),
        method: tc(hypothesis.method),
        counterEvidence: hypothesis.counterEvidence.map((item) => tc(item)),
      };
      const localizedEvidence: EvidenceItem[] = evidence.map((item) => ({
        ...item,
        title: tc(item.title),
        detail: tc(item.detail),
      }));

      const result = await fetch("/api/investigator/ask", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question,
          lang: locale,
          context: {
            node: localizedNode,
            hypothesis: localizedHypothesis,
            evidence: localizedEvidence,
          },
        }),
      });

      const payload = await result.json();

      if (!result.ok) {
        throw new Error(
          payload?.error || t("evidence.copilot.requestFailed"),
        );
      }

      setResponse(payload.data as InvestigatorResponse);
    } catch (caught) {
      setResponse(null);
      setError(
        caught instanceof Error ? caught.message : t("evidence.copilot.genericFailed"),
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="copilot">
      <div className="copilot-head">
        <div>
          <span className="eyebrow">{t("evidence.copilot.eyebrow")}</span>
          <small>{t("evidence.copilot.subtitle")}</small>
        </div>
        <span className="copilot-status">{t("evidence.copilot.status")}</span>
      </div>

      <div className="copilot-prompts">
        {prompts.map(([question, labelKey]) => (
          <button
            key={question}
            onClick={() => ask(question)}
            disabled={loading !== null}
          >
            {loading === question ? t("evidence.copilot.analyzing") : t(labelKey)}
          </button>
        ))}
      </div>

      {error && <p className="copilot-error">{error}</p>}

      {response && (
        <div className="copilot-response">
          <p>{response.answer}</p>

          {response.citations.length > 0 && (
            <div className="copilot-citations">
              <span>{t("evidence.copilot.citedContext")}</span>
              {response.citations.map((citation) => (
                <div key={citation.evidenceId}>
                  <b>{citation.evidenceId}</b>
                  <small>{citation.title}</small>
                  {citation.source?.startsWith("http") && (
                    <a
                      href={citation.source}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("evidence.copilot.sourceLink")} ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="copilot-caution">
            {response.cautions.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
