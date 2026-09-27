import type {
  InvestigatorAdapter,
  InvestigatorCitation,
  InvestigatorRequest,
  InvestigatorResponse,
} from "@/lib/adapters/investigator-adapter";
import type { EvidenceItem } from "@/lib/domain";

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

    const observed = evidence.filter((item) => item.state === "OBSERVED");
    const attributed = evidence.filter((item) => item.state === "ATTRIBUTED");
    const unverified = evidence.filter((item) => item.state === "UNVERIFIED");

    const supportingRefs = hypothesis.supportingEvidence.slice(0, 12);
    const base = {
      evidenceRefs: supportingRefs,
      citations: citationsFor(supportingRefs, evidence),
      cautions: [
        "Transaction relationships do not establish natural-person identity.",
        "Confidence is an analytical support level, not a probability of guilt.",
      ],
      generatedBy: "rule-based-investigator-v1-cited",
    };

    switch (request.question) {
      case "EXPLAIN_NODE":
        return {
          ...base,
          answer:
            `${node.label} is currently classified as ${node.state} at ${Math.round(
              node.confidence * 100,
            )}% confidence. ${node.description} The current hypothesis is: "${hypothesis.claim}"`,
        };

      case "EXPLAIN_CONFIDENCE":
        return {
          ...base,
          answer:
            `The confidence reflects the evidence class and current analytical support, not identity certainty. This context contains ${observed.length} observed item(s), ${attributed.length} attributed item(s), and the active hypothesis is at ${Math.round(
              hypothesis.confidence * 100,
            )}%. Confidence should increase only when independent evidence reduces plausible alternatives.`,
        };

      case "MISSING_EVIDENCE": {
        const refs = unverified.map((item) => item.id).slice(0, 12);

        return {
          ...base,
          evidenceRefs: refs,
          citations: citationsFor(refs, evidence),
          answer:
            unverified.length > 0
              ? `The largest explicit gap is represented by ${unverified
                  .map((item) => item.title)
                  .join(
                    ", ",
                  )}. Preserve it as UNVERIFIED until the required evidence class is independently obtained.`
              : "No explicit UNVERIFIED evidence item is registered. Review counter-evidence, provenance diversity, and whether an independent evidence class is still missing before promoting any claim.",
        };
      }

      case "NEXT_STEP":
        return {
          ...base,
          answer:
            node.kind === "exchange"
              ? "The next useful step is not automatically another graph hop. Identify what independently obtainable account-level evidence would be required before moving from service attribution toward account attribution."
              : node.state === "OBSERVED"
                ? "Keep the next step observation-first: inspect the next public-chain hop, preserve source provenance, then create a separate hypothesis only if a reproducible analytical signal appears."
                : "Compare the current inference against an independent source and record at least one competing explanation before changing the evidence state.",
        };
    }
  }
}
