"use client";

import type { EvidenceState } from "@/lib/domain";
import { useLanguage } from "@/lib/i18n/provider";

export interface InvestigationActivity {
  id: string;
  type:
    | "IMPORT"
    | "STEP"
    | "NODE_SELECT"
    | "HYPOTHESIS"
    | "EXPORT";
  title: string;
  detail: string;
  timestamp: string;
  state?: EvidenceState;
}

export function ActivityTimeline({
  items,
}: {
  items: InvestigationActivity[];
}) {
  const { locale, t } = useLanguage();
  return (
    <section className="activity-timeline">
      <div className="activity-head">
        <span className="eyebrow">{t("evidence.activity.eyebrow")}</span>
        <small>{t("evidence.activity.events", { count: items.length })}</small>
      </div>

      <div className="activity-list">
        {items.length === 0 ? (
          <p>{t("evidence.activity.empty")}</p>
        ) : (
          items
            .slice()
            .reverse()
            .map((item) => (
              <article key={item.id}>
                <i />
                <div>
                  <span>{item.type}</span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                  <small>
                    {new Date(item.timestamp).toLocaleTimeString(locale === "ko" ? "ko-KR" : "en-US")}
                  </small>
                </div>
              </article>
            ))
        )}
      </div>
    </section>
  );
}
