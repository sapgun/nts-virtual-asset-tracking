"use client";

import {
  capabilitySummary,
  systemCapabilities,
} from "@/lib/capabilities";
import { useLanguage } from "@/lib/i18n/provider";

export function CapabilityRegistry() {
  const { t, tc } = useLanguage();
  const summary = capabilitySummary();

  return (
    <section className="capability-registry">
      <div className="capability-head">
        <div>
          <span className="eyebrow">{t("capability.eyebrow")}</span>
          <h2>{t("capability.title")}</h2>
        </div>
        <div className="capability-counts">
          <span><b>{summary.active}</b> {t("capability.active")}</span>
          <span><b>{summary.limited}</b> {t("capability.limited")}</span>
          <span><b>{summary.disabled}</b> {t("capability.disabled")}</span>
        </div>
      </div>

      <div className="capability-list">
        {systemCapabilities.map((capability) => (
          <article key={capability.id}>
            <span className={"cap-state cap-" + capability.state.toLowerCase()}>
              {capability.state}
            </span>
            <div>
              <strong>{tc(capability.label)}</strong>
              <p>{tc(capability.detail)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
