import type {
  InvestigatorAdapter,
  InvestigatorCitation,
  InvestigatorRequest,
  InvestigatorResponse,
} from "@/lib/adapters/investigator-adapter";
import type { EvidenceItem } from "@/lib/domain";
import { format, t } from "../i18n";
import { DEFAULT_LOCALE, type Locale } from "../i18n/locales";

function citationsFor(
  refs: string[],
  evidence: EvidenceItem[],
): InvestigatorCitation[] {
  const wanted = new Set(refs);

  return evidence
    .filter((item) => wanted.has(item.id))
    .map((item) => ({
      evidenceId: item.id,
      title: item.title,
      state: item.state,
      sourceType: item.sourceType,
      source: item.source,
    }));
}

export class RuleBasedInvestigatorAdapter implements InvestigatorAdapter {
  async answer(
    request: InvestigatorRequest,
  ): Promise<InvestigatorResponse> {
    const { node, hypothesis, evidence } = request.context;
    const locale: Locale = request.locale ?? DEFAULT_LOCALE;

    const observed = evidence.filter((item) => item.state === "OBSERVED");
    const attributed = evidence.filter((item) => item.state === "ATTRIBUTED");
    const unverified = evidence.filter((item) => item.state === "UNVERIFIED");

    const supportingRefs = hypothesis.supportingEvidence.slice(0, 12);
    const base = {
      evidenceRefs: supportingRefs,
      citations: citationsFor(supportingRefs, evidence),
      cautions: [
        t(locale, "evidence.copilot.answers.cautionIdentity"),
        t(locale, "evidence.copilot.answers.cautionConfidence"),
      ],
      generatedBy: "rule-based-investigator-v1-cited",
    };

    switch (request.question) {
      case "EXPLAIN_NODE":
        return {
          ...base,
          answer: format(
            t(locale, "evidence.copilot.answers.explainNode"),
            {
              label: node.label,
              state: node.state,
              confidence: Math.round(node.confidence * 100),
              description: node.description,
              claim: hypothesis.claim,
            },
          ),
        };

      case "EXPLAIN_CONFIDENCE":
        return {
          ...base,
          answer: format(
            t(locale, "evidence.copilot.answers.explainConfidence"),
            {
              observed: observed.length,
              attributed: attributed.length,
              confidence: Math.round(hypothesis.confidence * 100),
            },
          ),
        };

      case "MISSING_EVIDENCE": {
        const refs = unverified.map((item) => item.id).slice(0, 12);

        return {
          ...base,
          evidenceRefs: refs,
          citations: citationsFor(refs, evidence),
          answer:
            unverified.length > 0
              ? format(
                  t(locale, "evidence.copilot.answers.missingWithGaps"),
                  {
                    titles: unverified
                      .map((item) => item.title)
                      .join(", "),
                  },
                )
              : t(locale, "evidence.copilot.answers.missingNone"),
        };
      }

      case "NEXT_STEP":
        return {
          ...base,
          answer:
            node.kind === "exchange"
              ? t(locale, "evidence.copilot.answers.nextExchange")
              : node.state === "OBSERVED"
                ? t(locale, "evidence.copilot.answers.nextObserved")
                : t(locale, "evidence.copilot.answers.nextDefault"),
        };
    }
  }
}
