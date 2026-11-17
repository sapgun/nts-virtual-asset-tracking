"use client";

import { useState } from "react";
import { EvidenceAuditTrail } from "@/components/evidence-audit-trail";
import { EvidenceQualityCard } from "@/components/evidence-quality-card";
import { StateBadge } from "@/components/state-badge";
import { evidenceTransitionLedger } from "@/lib/evidence-audit-data";
import { evidence, hypotheses, investigation } from "@/lib/mock-data";

export default function EvidencePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = evidence.find((item) => item.id === selectedId) ?? null;

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
          <article
            key={item.id}
            role="button"
            tabIndex={0}
            aria-expanded={selectedId === item.id}
            className={selectedId === item.id ? "selected" : ""}
            onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedId(selectedId === item.id ? null : item.id);
              }
            }}
          >
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

      {selected && (
        <section className="evidence-detail" aria-live="polite">
          <div className="inspector-head">
            <div>
              <span className="eyebrow">EVIDENCE DETAIL</span>
              <strong>{selected.id} · {selected.title}</strong>
            </div>
            <button aria-label="Close evidence detail" onClick={() => setSelectedId(null)}>×</button>
          </div>
          <div className="inspector-body">
            <div className="inspector-section node-focus">
              <div className="node-focus-top">
                <StateBadge state={selected.state} />
                <b>{Math.round(selected.confidence * 100)}%</b>
              </div>
              <h2>{selected.title}</h2>
              <p>{selected.detail}</p>
              <div className="confidence-track">
                <i style={{ width: Math.round(selected.confidence * 100) + "%" }} />
              </div>
              <div className="tag-list">
                <span>#{selected.sourceType}</span>
                <span>#{selected.state}</span>
              </div>
              <p className="evidence-detail-note">
                Confidence is an analyst judgment on this synthetic dataset, not a
                measurement of ground truth. State {selected.state} means this item is
                treated as {selected.state === "OBSERVED" ? "directly observed" : selected.state === "INFERRED" ? "inferred from a pattern" : selected.state === "ATTRIBUTED" ? "attributed from a public source" : "not yet verified"} — it does not
                upgrade the rest of the case on its own.
              </p>
            </div>
          </div>
        </section>
      )}

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
