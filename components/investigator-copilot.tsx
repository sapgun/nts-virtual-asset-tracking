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

const prompts: Array<[InvestigatorQuestion, string]> = [
  ["EXPLAIN_NODE", "Explain this node"],
  ["EXPLAIN_CONFIDENCE", "Why this confidence?"],
  ["MISSING_EVIDENCE", "What evidence is missing?"],
  ["NEXT_STEP", "What should I inspect next?"],
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
  const [response, setResponse] =
    useState<InvestigatorResponse | null>(null);
  const [loading, setLoading] =
    useState<InvestigatorQuestion | null>(null);
  const [error, setError] = useState("");

  async function ask(question: InvestigatorQuestion) {
    setLoading(question);
    setError("");

    try {
      const result = await fetch("/api/investigator/ask", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question,
          context: {
            node,
            hypothesis,
            evidence,
          },
        }),
      });

      const payload = await result.json();

      if (!result.ok) {
        throw new Error(
          payload?.error || "Investigator request failed",
        );
      }

      setResponse(payload.data as InvestigatorResponse);
    } catch (caught) {
      setResponse(null);
      setError(
        caught instanceof Error ? caught.message : "Request failed",
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="copilot">
      <div className="copilot-head">
        <div>
          <span className="eyebrow">INVESTIGATOR COPILOT</span>
          <small>Deterministic cited-context MVP · no external model</small>
        </div>
        <span className="copilot-status">LOCAL</span>
      </div>

      <div className="copilot-prompts">
        {prompts.map(([question, label]) => (
          <button
            key={question}
            onClick={() => ask(question)}
            disabled={loading !== null}
          >
            {loading === question ? "Analyzing…" : label}
          </button>
        ))}
      </div>

      {error && <p className="copilot-error">{error}</p>}

      {response && (
        <div className="copilot-response">
          <p>{response.answer}</p>

          {response.citations.length > 0 && (
            <div className="copilot-citations">
              <span>CITED CONTEXT</span>
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
                      source ↗
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
