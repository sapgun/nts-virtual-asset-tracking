import type {
  InvestigatorAdapter,
  InvestigatorRequest,
  InvestigatorResponse,
} from "@/lib/adapters/investigator-adapter";

export class RuleBasedInvestigatorAdapter implements InvestigatorAdapter {
  async answer(
    request: InvestigatorRequest,
  ): Promise<InvestigatorResponse> {
    const { node, hypothesis, evidence } = request.context;

    const observed = evidence.filter((item) => item.state === "OBSERVED");
    const attributed = evidence.filter((item) => item.state === "ATTRIBUTED");
    const unverified = evidence.filter((item) => item.state === "UNVERIFIED");

    const base = {
      evidenceRefs: hypothesis.supportingEvidence,
      cautions: [
        "Transaction relationships do not establish natural-person identity.",
        "Confidence is an analytical support level, not a probability of guilt.",
      ],
      generatedBy: "rule-based-investigator-v0",
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
            `The confidence reflects the evidence class and the current analytical signals. The case has ${observed.length} observed item(s), ${attributed.length} attributed item(s), and the active hypothesis is at ${Math.round(
              hypothesis.confidence * 100,
            )}%. It should increase only when new independent evidence reduces plausible alternatives.`,
        };

      case "MISSING_EVIDENCE":
        return {
          ...base,
          evidenceRefs: unverified.map((item) => item.id),
          answer:
            unverified.length > 0
              ? `The largest gap is represented by ${unverified
                  .map((item) => item.title)
                  .join(
                    ", ",
                  )}. The system should preserve this as UNVERIFIED until the required evidence class is independently obtained.`
              : "No explicit UNVERIFIED item is registered, but counter-evidence and independent corroboration should still be reviewed.",
        };

      case "NEXT_STEP":
        return {
          ...base,
          answer:
            node.kind === "exchange"
              ? "The next useful step is not another graph hop. Review what legally obtainable account or KYC evidence would be required to move from service attribution to account attribution."
              : "Inspect the next public-chain hop, compare the result against an independent source, and record any competing explanation before changing the evidence state.",
        };
    }
  }
}
