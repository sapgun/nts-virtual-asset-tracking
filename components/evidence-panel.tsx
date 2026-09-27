"use client";

import { useState } from "react";
import { ActivityTimeline, type InvestigationActivity } from "@/components/activity-timeline";
import { EvidenceQualityCard } from "@/components/evidence-quality-card";
import { HypothesisBuilder, type HypothesisDraftEvent } from "@/components/hypothesis-builder";
import { InvestigatorCopilot } from "@/components/investigator-copilot";
import { StateBadge } from "@/components/state-badge";
import type { EvidenceItem, GraphNode, Hypothesis } from "@/lib/domain";

type InspectorTab = "NODE" | "EVIDENCE" | "ANALYSIS" | "ACTIVITY";

export function EvidencePanel({
  selected,
  evidence,
  hypothesis,
  activity,
  onHypothesisCreate,
  onClose,
}: {
  selected: GraphNode;
  evidence: EvidenceItem[];
  hypothesis: Hypothesis;
  activity: InvestigationActivity[];
  onHypothesisCreate?: (event: HypothesisDraftEvent) => void;
  onClose?: () => void;
}) {
  const [tab, setTab] = useState<InspectorTab>("NODE");

  return (
    <aside className="inspector-panel">
      <div className="inspector-head">
        <div>
          <span className="eyebrow">INSPECTOR</span>
          <strong>{selected.label}</strong>
        </div>
        <button aria-label="Close inspector" onClick={onClose}>×</button>
      </div>

      <div className="inspector-tabs">
        {([
          ["NODE", "Node"],
          ["EVIDENCE", "Evidence"],
          ["ANALYSIS", "Analysis"],
          ["ACTIVITY", "Activity"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            className={tab === value ? "active" : ""}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="inspector-body">
        {tab === "NODE" && (
          <section className="inspector-section node-focus">
            <div className="node-focus-top">
              <StateBadge state={selected.state} />
              <b>{Math.round(selected.confidence * 100)}%</b>
            </div>
            <h2>{selected.label}</h2>
            <p>{selected.description}</p>
            <div className="confidence-track">
              <i style={{ width: Math.round(selected.confidence * 100) + "%" }} />
            </div>
            <div className="tag-list">
              {selected.tags?.map((tag) => <span key={tag}>#{tag}</span>)}
            </div>

            <div className="node-hypothesis-summary">
              <span>ACTIVE HYPOTHESIS</span>
              <strong>{hypothesis.claim}</strong>
              <small>{hypothesis.method}</small>
              <StateBadge state={hypothesis.state} />
            </div>
          </section>
        )}

        {tab === "EVIDENCE" && (
          <section className="inspector-section">
            <div className="section-kicker">
              <span>Evidence stack</span>
              <b>{evidence.length}</b>
            </div>
            <div className="evidence-stack evidence-stack-v2">
              {evidence.map((item) => (
                <article key={item.id}>
                  <div>
                    <b>{item.id}</b>
                    <StateBadge state={item.state} />
                  </div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                  <small>{item.sourceType}</small>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "ANALYSIS" && (
          <section className="inspector-section analysis-stack">
            <EvidenceQualityCard
              evidence={evidence}
              hypothesis={hypothesis}
              compact
            />
            <HypothesisBuilder
              evidence={evidence}
              onCreate={onHypothesisCreate}
            />
            <InvestigatorCopilot
              node={selected}
              hypothesis={hypothesis}
              evidence={evidence}
            />
          </section>
        )}

        {tab === "ACTIVITY" && (
          <section className="inspector-section">
            <ActivityTimeline items={activity} />
          </section>
        )}
      </div>
    </aside>
  );
}
