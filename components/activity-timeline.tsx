import type { EvidenceState } from "@/lib/domain";

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
  return (
    <section className="activity-timeline">
      <div className="activity-head">
        <span className="eyebrow">ACTIVITY TIMELINE</span>
        <small>{items.length} events</small>
      </div>

      <div className="activity-list">
        {items.length === 0 ? (
          <p>No activity recorded in this session.</p>
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
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              </article>
            ))
        )}
      </div>
    </section>
  );
}
