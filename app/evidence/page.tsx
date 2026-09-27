import { EvidenceAuditTrail } from "@/components/evidence-audit-trail";
import { EvidenceQualityCard } from "@/components/evidence-quality-card";
import { StateBadge } from "@/components/state-badge";
import { evidenceTransitionLedger } from "@/lib/evidence-audit-data";
import { evidence, hypotheses, investigation } from "@/lib/mock-data";

export default function EvidencePage() {
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">EVIDENCE ROOM</span>
        <h1>Build the case without collapsing uncertainty.</h1>
        <p>Every claim carries provenance, confidence and an explicit evidence state.</p>
      </header>

      <section className="evidence-overview">
        <div>
          <span>Case</span>
          <b>{investigation.id}</b>
        </div>
        <div>
          <span>Completeness</span>
          <b>{investigation.evidenceCompleteness}%</b>
        </div>
        <div>
          <span>Hypotheses</span>
          <b>{hypotheses.length}</b>
        </div>
      </section>

      <EvidenceQualityCard
        evidence={evidence}
        hypothesis={hypotheses[0]}
      />

      <div className="evidence-table">
        {evidence.map((item) => (
          <article key={item.id}>
            <div className="evidence-id">{item.id}</div>
            <div>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
            <div><StateBadge state={item.state} /></div>
            <div className="evidence-confidence">{Math.round(item.confidence * 100)}%</div>
          </article>
        ))}
      </div>

      <section className="hypothesis-card">
        <span className="eyebrow">HYPOTHESIS REGISTER</span>
        {hypotheses.map((item) => (
          <div key={item.id}>
            <div>
              <h2>{item.claim}</h2>
              <p>{item.method}</p>
            </div>
            <div className="hypothesis-score">{Math.round(item.confidence * 100)}%</div>
          </div>
        ))}
      </section>

      <EvidenceAuditTrail events={evidenceTransitionLedger} />
    </div>
  );
}
