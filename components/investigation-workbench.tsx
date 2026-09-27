"use client";

import { useEffect, useMemo, useState } from "react";
import { EvidencePanel } from "@/components/evidence-panel";
import { GraphCanvas } from "@/components/graph-canvas";
import { StateBadge } from "@/components/state-badge";
import type { GraphNode } from "@/lib/domain";
import { buildEvidencePacket } from "@/lib/evidence-packet";
import {
  buildImportedInvestigation,
  PUBLIC_IMPORT_STORAGE_KEY,
  type ImportedInvestigationDraft,
  type ImportedInvestigationModel,
} from "@/lib/imported-investigation";
import {
  evidence as syntheticEvidence,
  graphEdges as syntheticEdges,
  graphNodes as syntheticNodes,
  hypotheses as syntheticHypotheses,
  investigation as syntheticInvestigation,
} from "@/lib/mock-data";

export function InvestigationWorkbench({
  importedMode = false,
}: {
  importedMode?: boolean;
}) {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState("seed");
  const [importedModel, setImportedModel] =
    useState<ImportedInvestigationModel | null>(null);
  const [importError, setImportError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!importedMode) return;

    try {
      const raw = sessionStorage.getItem(PUBLIC_IMPORT_STORAGE_KEY);

      if (!raw) {
        throw new Error(
          "No public-data draft found. Return to Graph Explorer and promote an address first.",
        );
      }

      const draft = JSON.parse(raw) as ImportedInvestigationDraft;
      const model = buildImportedInvestigation(draft);

      setImportedModel(model);
      setSelectedId(model.nodes[0]?.id ?? "");
      setStep(1);
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "Unable to load imported investigation.",
      );
    }
  }, [importedMode]);

  const model = useMemo(() => {
    if (importedMode) return importedModel;

    return {
      investigation: syntheticInvestigation,
      nodes: syntheticNodes,
      edges: syntheticEdges,
      evidence: syntheticEvidence,
      hypothesis: syntheticHypotheses[0],
    };
  }, [importedMode, importedModel]);

  if (importedMode && !model) {
    return (
      <div className="import-state-page">
        <div className={importError ? "import-state-card error" : "import-state-card"}>
          <span className="eyebrow">PUBLIC DATA IMPORT</span>
          <h1>{importError ? "Draft unavailable" : "Building observed graph…"}</h1>
          <p>
            {importError ||
              "Normalizing the promoted address transactions into an observation-only investigation."}
          </p>
          {importError && <a href="/explore">Return to Graph Explorer ↗</a>}
        </div>
      </div>
    );
  }

  if (!model || model.nodes.length === 0) return null;

  const selected =
    model.nodes.find((node) => node.id === selectedId) ?? model.nodes[0];
  const maxStep = Math.max(
    1,
    ...model.edges.map((edge) => edge.step),
  );

  const exportEvidence = async () => {
    setExporting(true);

    const payload = {
      notice: importedMode
        ? "Public-chain observation packet — no ownership or natural-person attribution."
        : "Synthetic training data — not investigative evidence",
      mode: importedMode ? "PUBLIC_IMPORT" : "SYNTHETIC_SANDBOX",
      investigation: model.investigation,
      visibleEdges: model.edges.filter((edge) => edge.step <= step),
      selectedNode: selected,
      evidence: model.evidence,
      hypotheses: [model.hypothesis],
      capture: {
        step,
        maxStep,
      },
    };

    const packet = await buildEvidencePacket(payload);

    const blob = new Blob([JSON.stringify(packet, null, 2)], {
      type: "application/json",
    });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download =
      model.investigation.id.toLowerCase() + "-evidence.json";
    anchor.click();
    URL.revokeObjectURL(href);
    setExporting(false);
  };

  return (
    <div className="workbench">
      <aside className="control-panel">
        <div>
          <span className="eyebrow">INVESTIGATION</span>
          <h1>{model.investigation.id}</h1>
          <p>{model.investigation.title}</p>
          {importedMode && (
            <span className="import-mode-badge">PUBLIC OBSERVATION MODE</span>
          )}
        </div>

        <div className="control-group">
          <label>Seed</label>
          <div className="seed-box">{model.investigation.seed}</div>
        </div>

        <div className="control-group">
          <label>Network</label>
          <button className="select-button">
            Ethereum <span>⌄</span>
          </button>
        </div>

        <div className="control-group">
          <label>Playback</label>
          <div className="step-readout">
            STEP {step} / {maxStep}
          </div>
          <input
            aria-label="Investigation step"
            type="range"
            min="1"
            max={maxStep}
            value={Math.min(step, maxStep)}
            onChange={(event) => setStep(Number(event.target.value))}
          />
          <div className="button-row">
            <button
              onClick={() =>
                setStep((current) => Math.max(1, current - 1))
              }
            >
              Back
            </button>
            <button
              onClick={() =>
                setStep((current) => Math.min(maxStep, current + 1))
              }
            >
              Next hop
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Evidence rule</label>
          <div className="rule-stack">
            <div>
              <StateBadge state="OBSERVED" />
              <span>Direct chain fact</span>
            </div>
            <div>
              <StateBadge state="INFERRED" />
              <span>Analytical hypothesis</span>
            </div>
            <div>
              <StateBadge state="ATTRIBUTED" />
              <span>Entity-supported</span>
            </div>
            <div>
              <StateBadge state="UNVERIFIED" />
              <span>Requires corroboration</span>
            </div>
          </div>
        </div>

        <button
          className="primary-action"
          onClick={exportEvidence}
          disabled={exporting}
        >
          {exporting ? "Hashing packet…" : "Export evidence packet"}
        </button>
      </aside>

      <GraphCanvas
        nodes={model.nodes}
        edges={model.edges}
        step={step}
        selectedId={selected.id}
        onSelect={(node: GraphNode) => setSelectedId(node.id)}
      />

      <EvidencePanel
        selected={selected}
        evidence={model.evidence}
        hypothesis={model.hypothesis}
      />
    </div>
  );
}
