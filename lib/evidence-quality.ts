import type {
  EvidenceItem,
  Hypothesis,
} from "@/lib/domain";

export interface EvidenceQualityScore {
  overall: number;
  reproducibility: number;
  sourceDiversity: number;
  attributionSupport: number;
  counterEvidenceDiscipline: number;
  unresolvedGapBurden: number;
  summary: string;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateEvidenceQuality(
  evidence: EvidenceItem[],
  hypothesis: Hypothesis,
): EvidenceQualityScore {
  const total = Math.max(1, evidence.length);

  const reproducible = evidence.filter(
    (item) =>
      item.state === "OBSERVED" ||
      item.sourceType === "PUBLIC_SOURCE" ||
      Boolean(item.source),
  ).length;

  const sourceTypes = new Set(
    evidence.map((item) => item.sourceType),
  ).size;

  const attributed = evidence.filter(
    (item) => item.state === "ATTRIBUTED",
  ).length;

  const unresolved = evidence.filter(
    (item) => item.state === "UNVERIFIED",
  ).length;

  const reproducibility = clamp(
    (reproducible / total) * 100,
  );
  const sourceDiversity = clamp(
    (sourceTypes / 4) * 100,
  );
  const attributionSupport = clamp(
    (attributed / total) * 100,
  );
  const counterEvidenceDiscipline = clamp(
    Math.min(1, hypothesis.counterEvidence.length / 2) * 100,
  );

  const hypothesisGap =
    hypothesis.state === "UNVERIFIED" ? 0.35 : 0;
  const unresolvedGapBurden = clamp(
    Math.min(
      1,
      unresolved / total + hypothesisGap,
    ) * 100,
  );

  const raw =
    reproducibility * 0.36 +
    sourceDiversity * 0.2 +
    attributionSupport * 0.18 +
    counterEvidenceDiscipline * 0.26 -
    unresolvedGapBurden * 0.18;

  const overall = clamp(raw);

  const summary =
    attributionSupport < 25
      ? "Strongest as an observation set; attribution remains limited."
      : unresolvedGapBurden > 35
        ? "Useful evidence exists, but unresolved corroboration gaps remain material."
        : "Evidence is comparatively balanced across observation, provenance, and review discipline.";

  return {
    overall,
    reproducibility,
    sourceDiversity,
    attributionSupport,
    counterEvidenceDiscipline,
    unresolvedGapBurden,
    summary,
  };
}
