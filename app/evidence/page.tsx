"use client";

import { useState } from "react";
import { EvidenceAuditTrail } from "@/components/evidence-audit-trail";
import { EvidenceQualityCard } from "@/components/evidence-quality-card";
import { StateBadge } from "@/components/state-badge";
import { evidenceTransitionLedger } from "@/lib/evidence-audit-data";
import { evidence, hypotheses, investigation } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n/provider";

export default function EvidencePage() {
  const { t, tc } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = evidence.find((item) => item.id === selectedId) ?? null;
  const stateWord = selected
    ? selected.state === "OBSERVED"
      ? t("evidence.stateWordObserved")
      : selected.state === "INFERRED"
        ? t("evidence.stateWordInferred")
        : selected.state === "ATTRIBUTED"
          ? t("evidence.stateWordAttributed")
          : t("evidence.stateWordUnverified")
    : "";

  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">{t("evidence.eyebrow")}</span>
        <h1>{t("evidence.title")}</h1>
        <p>{t("evidence.intro")}</p>
      </header>

      <section className="evidence-overview">
        <div>
          <span>{t("evidence.case")}</span>
          <b>{investigation.id}</b>
        </div>
        <div>
          <span>{t("evidence.completeness")}</span>
          <b>{investigation.evidenceCompleteness}%</b>
        </div>
        <div>
          <span>{t("evidence.hypotheses")}</span>
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
              <strong>{tc(item.title)}</strong>
              <p>{tc(item.detail)}</p>
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
              <span className="eyebrow">{t("evidence.detailEyebrow")}</span>
              <strong>{selected.id} · {tc(selected.title)}</strong>
            </div>
            <button aria-label={t("evidence.closeDetailAria")} onClick={() => setSelectedId(null)}>×</button>
          </div>
          <div className="inspector-body">
            <div className="inspector-section node-focus">
              <div className="node-focus-top">
                <StateBadge state={selected.state} />
                <b>{Math.round(selected.confidence * 100)}%</b>
              </div>
              <h2>{tc(selected.title)}</h2>
              <p>{tc(selected.detail)}</p>
              <div className="confidence-track">
                <i style={{ width: Math.round(selected.confidence * 100) + "%" }} />
              </div>
              <div className="tag-list">
                <span>#{selected.sourceType}</span>
                <span>#{selected.state}</span>
              </div>
              <p className="evidence-detail-note">
                {t("evidence.detailNote", { state: selected.state, stateWord })}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="hypothesis-card">
        <span className="eyebrow">{t("evidence.hypothesisRegister")}</span>
        {hypotheses.map((item) => (
          <div key={item.id}>
            <div>
              <h2>{tc(item.claim)}</h2>
              <p>{tc(item.method)}</p>
            </div>
            <div className="hypothesis-score">{Math.round(item.confidence * 100)}%</div>
          </div>
        ))}
      </section>

      <EvidenceAuditTrail events={evidenceTransitionLedger} />
    </div>
  );
}
