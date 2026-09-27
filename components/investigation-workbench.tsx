"use client";

import { useEffect, useMemo, useState } from "react";
import { EvidencePanel } from "@/components/evidence-panel";
import { GraphCanvas } from "@/components/graph-canvas";
import type { InvestigationActivity } from "@/components/activity-timeline";
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
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [activity, setActivity] = useState<InvestigationActivity[]>([]);

  function logActivity(item: Omit<InvestigationActivity, "id" | "timestamp">) {
    setActivity((current) => [
      ...current,
      {
        ...item,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
    ].slice(-40));
  }

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
      setActivity([
        {
          id: crypto.randomUUID(),
          type: "IMPORT",
          title: "Public observation promoted",
          detail: model.investigation.seed + " imported from Graph Explorer.",
          timestamp: new Date().toISOString(),
          state: "OBSERVED",
        },
      ]);
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
  const maxStep = Math.max(1, ...model.edges.map((edge) => edge.step));

  const moveStep = (next: number, title: string) => {
    const value = Math.max(1, Math.min(maxStep, next));
    setStep(value);
    logActivity({
      type: "STEP",
      title,
      detail: "Graph timeline moved to step " + value + ".",
    });
  };

  const exportEvidence = async () => {
    setExporting(true);
    try {
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
        capture: { step, maxStep },
      };

      const packet = await buildEvidencePacket(payload);
      const blob = new Blob([JSON.stringify(packet, null, 2)], {
        type: "application/json",
      });
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = model.investigation.id.toLowerCase() + "-evidence.json";
      anchor.click();
      URL.revokeObjectURL(href);

      logActivity({
        type: "EXPORT",
        title: "Evidence packet exported",
        detail: "Canonical SHA-256 integrity packet generated.",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="investigation-screen">
      <header className="case-commandbar">
        <div className="case-identity">
          <div className="case-orb"><i /></div>
          <div>
            <span className="eyebrow">LIVE INVESTIGATION</span>
            <h1>{model.investigation.title}</h1>
            <div className="case-meta-line">
              <span>{model.investigation.id}</span>
              <i />
              <span>Ethereum</span>
              <i />
              <code>{model.investigation.seed}</code>
            </div>
          </div>
        </div>

        <div className="case-command-actions">
          <span className={importedMode ? "mode-pill public" : "mode-pill sandbox"}>
            {importedMode ? "PUBLIC OBSERVATION" : "SANDBOX"}
          </span>
          <button
            className="ghost-action"
            onClick={() => setInspectorOpen((value) => !value)}
          >
            {inspectorOpen ? "Hide inspector" : "Open inspector"}
          </button>
          <button
            className="export-action"
            onClick={exportEvidence}
            disabled={exporting}
          >
            {exporting ? "Hashing…" : "Export packet"}
          </button>
        </div>
      </header>

      <div className={inspectorOpen ? "investigation-stage inspector-open" : "investigation-stage"}>
        <div className="graph-spotlight">
          <GraphCanvas
            nodes={model.nodes}
            edges={model.edges}
            step={step}
            selectedId={selected.id}
            onSelect={(node: GraphNode) => {
              setSelectedId(node.id);
              setInspectorOpen(true);
              logActivity({
                type: "NODE_SELECT",
                title: "Node selected",
                detail: node.label + " · " + node.state,
                state: node.state,
              });
            }}
          />

          <div className="graph-context-card">
            <span>SELECTED</span>
            <strong>{selected.label}</strong>
            <small>{selected.state} · {Math.round(selected.confidence * 100)}%</small>
          </div>

          <div className="playback-dock">
            <button onClick={() => moveStep(step - 1, "Playback moved")} disabled={step <= 1}>
              ←
            </button>
            <div className="playback-track">
              <div>
                <span>TRACE DEPTH</span>
                <b>{String(step).padStart(2, "0")} / {String(maxStep).padStart(2, "0")}</b>
              </div>
              <input
                aria-label="Investigation trace depth"
                type="range"
                min="1"
                max={maxStep}
                value={Math.min(step, maxStep)}
                onChange={(event) => moveStep(Number(event.target.value), "Playback scrubbed")}
              />
            </div>
            <button onClick={() => moveStep(step + 1, "Next hop revealed")} disabled={step >= maxStep}>
              →
            </button>
          </div>
        </div>

        {inspectorOpen && (
          <EvidencePanel
            selected={selected}
            evidence={model.evidence}
            hypothesis={model.hypothesis}
            activity={activity}
            onClose={() => setInspectorOpen(false)}
            onHypothesisCreate={({ hypothesis, createdAt }) => {
              setActivity((current) => [
                ...current,
                {
                  id: crypto.randomUUID(),
                  type: "HYPOTHESIS",
                  title: "Hypothesis drafted",
                  detail:
                    hypothesis.claim +
                    " · " +
                    Math.round(hypothesis.confidence * 100) +
                    "% · " +
                    hypothesis.state,
                  timestamp: createdAt,
                  state: hypothesis.state,
                },
              ].slice(-40));
            }}
          />
        )}
      </div>
    </div>
  );
}
