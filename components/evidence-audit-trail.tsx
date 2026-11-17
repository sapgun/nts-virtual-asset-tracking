"use client";

import { StateBadge } from "@/components/state-badge";
import type { EvidenceTransitionEvent } from "@/lib/evidence-audit";
import { useLanguage } from "@/lib/i18n/provider";

export function EvidenceAuditTrail({
  events,
}: {
  events: EvidenceTransitionEvent[];
}) {
  const { t, tc } = useLanguage();
  return (
    <section className="audit-trail">
      <div className="audit-head">
        <div>
          <span className="eyebrow">{t("evidence.audit.eyebrow")}</span>
          <h2>{t("evidence.audit.title")}</h2>
        </div>
        <span>{t("evidence.audit.recorded", { count: events.length })}</span>
      </div>

      <div className="audit-events">
        {events.map((event) => (
          <article key={event.id}>
            <div className="audit-id">
              <span>{event.id}</span>
              <small>{event.evidenceId}</small>
            </div>
            <div className="audit-transition">
              <StateBadge state={event.from} />
              <i>→</i>
              <StateBadge state={event.to} />
            </div>
            <div className="audit-detail">
              <strong>{tc(event.method)}</strong>
              <p>{tc(event.rationale)}</p>
              <small>{event.actor} · {event.createdAt}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
