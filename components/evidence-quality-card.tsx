"use client";

import type {
  EvidenceItem,
  Hypothesis,
} from "@/lib/domain";
import { calculateEvidenceQuality } from "@/lib/evidence-quality";
import { useLanguage } from "@/lib/i18n/provider";

const metrics = [
  ["reproducibility", "evidence.quality.reproducibility"],
  ["sourceDiversity", "evidence.quality.sourceDiversity"],
  ["attributionSupport", "evidence.quality.attributionSupport"],
  ["counterEvidenceDiscipline", "evidence.quality.counterEvidence"],
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
  const { t, tc } = useLanguage();
  const score = calculateEvidenceQuality(
    evidence,
    hypothesis,
  );

  return (
    <section className={compact ? "quality-card compact" : "quality-card"}>
      <div className="quality-head">
        <div>
          <span className="eyebrow">{t("evidence.quality.eyebrow")}</span>
          <strong>{score.overall}</strong>
          <small>/ 100</small>
        </div>
        <p>{tc(score.summary)}</p>
      </div>

      <div className="quality-metrics">
        {metrics.map(([key, labelKey]) => (
          <div key={key}>
            <span>
              {t(labelKey)}
              <b>{score[key]}%</b>
            </span>
            <i>
              <em style={{ width: score[key] + "%" }} />
            </i>
          </div>
        ))}
      </div>

      <div className="quality-gap">
        <span>{t("evidence.quality.gapBurden")}</span>
        <b>{score.unresolvedGapBurden}%</b>
      </div>

      {!compact && (
        <p className="quality-note">
          {t("evidence.quality.note")}
        </p>
      )}
    </section>
  );
}
