"use client";

import { useState } from "react";
import { EvidencePanel } from "@/components/evidence-panel";
import { GraphCanvas } from "@/components/graph-canvas";
import { StateBadge } from "@/components/state-badge";
import { evidence, graphEdges, graphNodes, hypotheses, investigation } from "@/lib/mock-data";
import type { GraphNode } from "@/lib/domain";

export function InvestigationWorkbench() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<GraphNode>(graphNodes[0]);

  const exportEvidence = () => {
    const payload = {
      notice: "Synthetic training data — not investigative evidence",
      investigation,
      visibleEdges: graphEdges.filter((edge) => edge.step <= step),
      selectedNode: selected,
      evidence,
      hypotheses,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = investigation.id.toLowerCase() + "-evidence.json";
    anchor.click();
    URL.revokeObjectURL(href);
  };

  return (
    <div className="workbench">
      <aside className="control-panel">
        <div>
          <span className="eyebrow">INVESTIGATION</span>
          <h1>{investigation.id}</h1>
          <p>{investigation.title}</p>
        </div>

        <div className="control-group">
          <label>Seed</label>
          <div className="seed-box">{investigation.seed}</div>
        </div>

        <div className="control-group">
          <label>Network</label>
          <button className="select-button">Ethereum <span>⌄</span></button>
        </div>

        <div className="control-group">
          <label>Playback</label>
          <div className="step-readout">STEP {step} / 4</div>
          <input
            aria-label="Investigation step"
            type="range"
            min="1"
            max="4"
            value={step}
            onChange={(event) => setStep(Number(event.target.value))}
          />
          <div className="button-row">
            <button onClick={() => setStep((current) => Math.max(1, current - 1))}>Back</button>
            <button onClick={() => setStep((current) => Math.min(4, current + 1))}>Next hop</button>
          </div>
        </div>

        <div className="control-group">
          <label>Evidence rule</label>
          <div className="rule-stack">
            <div><StateBadge state="OBSERVED" /><span>Direct chain fact</span></div>
            <div><StateBadge state="INFERRED" /><span>Analytical hypothesis</span></div>
            <div><StateBadge state="ATTRIBUTED" /><span>Entity-supported</span></div>
            <div><StateBadge state="UNVERIFIED" /><span>Requires corroboration</span></div>
          </div>
        </div>

        <button className="primary-action" onClick={exportEvidence}>Export evidence packet</button>
      </aside>

      <GraphCanvas
        nodes={graphNodes}
        edges={graphEdges}
        step={step}
        selectedId={selected.id}
        onSelect={setSelected}
      />

      <EvidencePanel selected={selected} evidence={evidence} hypothesis={hypotheses[0]} />
    </div>
  );
}
