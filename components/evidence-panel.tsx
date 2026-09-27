import { StateBadge } from "@/components/state-badge";
import type { EvidenceItem, GraphNode, Hypothesis } from "@/lib/domain";

export function EvidencePanel({
  selected,
  evidence,
  hypothesis,
}: {
  selected: GraphNode;
  evidence: EvidenceItem[];
  hypothesis: Hypothesis;
}) {
  return (
    <aside className="intel-panel">
      <div className="intel-block">
        <span className="eyebrow">SELECTED NODE</span>
        <h2>{selected.label}</h2>
        <StateBadge state={selected.state} />
        <div className="confidence-row">
          <span>Confidence</span>
          <b>{Math.round(selected.confidence * 100)}%</b>
        </div>
        <div className="confidence-track">
          <i style={{ width: Math.round(selected.confidence * 100) + "%" }} />
        </div>
        <p>{selected.description}</p>
        <div className="tag-list">
          {selected.tags?.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
      </div>

      <div className="intel-block">
        <span className="eyebrow">ACTIVE HYPOTHESIS</span>
        <h3>{hypothesis.claim}</h3>
        <StateBadge state={hypothesis.state} />
        <p className="mono-line">{hypothesis.method}</p>
        <div className="confidence-row">
          <span>Hypothesis confidence</span>
          <b>{Math.round(hypothesis.confidence * 100)}%</b>
        </div>
      </div>

      <div className="intel-block">
        <span className="eyebrow">EVIDENCE STACK</span>
        <div className="evidence-stack">
          {evidence.map((item) => (
            <article key={item.id}>
              <div>
                <b>{item.id}</b>
                <StateBadge state={item.state} />
              </div>
              <strong>{item.title}</strong>
              <small>{item.sourceType}</small>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
