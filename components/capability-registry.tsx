import {
  capabilitySummary,
  systemCapabilities,
} from "@/lib/capabilities";

export function CapabilityRegistry() {
  const summary = capabilitySummary();

  return (
    <section className="capability-registry">
      <div className="capability-head">
        <div>
          <span className="eyebrow">CAPABILITY REGISTRY</span>
          <h2>Know exactly what the system can and cannot do.</h2>
        </div>
        <div className="capability-counts">
          <span><b>{summary.active}</b> active</span>
          <span><b>{summary.limited}</b> limited</span>
          <span><b>{summary.disabled}</b> disabled</span>
        </div>
      </div>

      <div className="capability-list">
        {systemCapabilities.map((capability) => (
          <article key={capability.id}>
            <span className={"cap-state cap-" + capability.state.toLowerCase()}>
              {capability.state}
            </span>
            <div>
              <strong>{capability.label}</strong>
              <p>{capability.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
