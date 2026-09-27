import { StateBadge } from "@/components/state-badge";
import type { EvidenceTransitionEvent } from "@/lib/evidence-audit";

export function EvidenceAuditTrail({
  events,
}: {
  events: EvidenceTransitionEvent[];
}) {
  return (
    <section className="audit-trail">
      <div className="audit-head">
        <div>
          <span className="eyebrow">TRANSITION LEDGER</span>
          <h2>Evidence state changes are explicit events.</h2>
        </div>
        <span>{events.length} recorded</span>
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
              <strong>{event.method}</strong>
              <p>{event.rationale}</p>
              <small>{event.actor} · {event.createdAt}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
