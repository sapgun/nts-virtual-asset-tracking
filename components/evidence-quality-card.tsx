import type {
  EvidenceItem,
  Hypothesis,
} from "@/lib/domain";
import { calculateEvidenceQuality } from "@/lib/evidence-quality";

const metrics = [
  ["reproducibility", "Reproducibility"],
  ["sourceDiversity", "Source diversity"],
  ["attributionSupport", "Attribution support"],
  ["counterEvidenceDiscipline", "Counter-evidence"],
] as const;

export function EvidenceQualityCard({
  evidence,
  hypothesis,
  compact = false,
}: {
  evidence: EvidenceItem[];
  hypothesis: Hypothesis;
  compact?: boolean;
}) {
  const score = calculateEvidenceQuality(
    evidence,
    hypothesis,
  );

  return (
    <section className={compact ? "quality-card compact" : "quality-card"}>
      <div className="quality-head">
        <div>
          <span className="eyebrow">EVIDENCE QUALITY</span>
          <strong>{score.overall}</strong>
          <small>/ 100</small>
        </div>
        <p>{score.summary}</p>
      </div>

      <div className="quality-metrics">
        {metrics.map(([key, label]) => (
          <div key={key}>
            <span>
              {label}
              <b>{score[key]}%</b>
            </span>
            <i>
              <em style={{ width: score[key] + "%" }} />
            </i>
          </div>
        ))}
      </div>

      <div className="quality-gap">
        <span>Unresolved gap burden</span>
        <b>{score.unresolvedGapBurden}%</b>
      </div>

      {!compact && (
        <p className="quality-note">
          This score measures evidence completeness and review discipline. It is not a guilt, identity, or enforcement score.
        </p>
      )}
    </section>
  );
}
