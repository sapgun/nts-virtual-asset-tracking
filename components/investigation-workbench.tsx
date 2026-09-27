"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GraphNode, Hypothesis } from "@/lib/domain";
import type { InvestigationActivity } from "@/components/activity-timeline";
import { buildEvidencePacket } from "@/lib/evidence-packet";
import { buildImportedInvestigation, PUBLIC_IMPORT_STORAGE_KEY, type ImportedInvestigationDraft, type ImportedInvestigationModel } from "@/lib/imported-investigation";
import { evidence, graphEdges, graphNodes, hypotheses, investigation } from "@/lib/mock-data";
import { visibleScene } from "@/lib/scene-graph";
import { TopologyCanvas } from "@/components/workspace/topology-canvas";
import { Inspector } from "@/components/workspace/inspector";
import { Icon } from "@/components/workspace/icons";
import s from "@/components/workspace/workspace.module.css";

export function InvestigationWorkbench({ importedMode = false }: { importedMode?: boolean }) {
  const [imported, setImported] = useState<ImportedInvestigationModel | null>(null);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState("seed");
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [drafts, setDrafts] = useState<Hypothesis[]>([]);
  const [activity, setActivity] = useState<InvestigationActivity[]>([]);
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const closeInspector = useCallback(() => setInspectorOpen(false), []);
  const log = useCallback((type: InvestigationActivity["type"], title: string, detail: string) => {
    const item: InvestigationActivity = { id: crypto.randomUUID(), type, title, detail, timestamp: new Date().toISOString() };
    setActivity((items) => [...items, item].slice(-60));
  }, []);
  useEffect(() => { setInspectorOpen(window.innerWidth > 960); }, []);
  useEffect(() => {
    setLoadError(""); setImported(null); setDrafts([]); setActivity([]); setPlaying(false);
    if (!importedMode) { setSelectedId("seed"); setStep(4); return; }
    try {
      const raw = sessionStorage.getItem(PUBLIC_IMPORT_STORAGE_KEY);
      if (!raw) throw new Error("No imported observation is available in this browser tab. Start from Explorer.");
      const value: unknown = JSON.parse(raw);
      if (!value || typeof value !== "object") throw new Error("Invalid imported observation.");
      const candidate = value as Partial<ImportedInvestigationDraft>;
      if (typeof candidate.seed !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(candidate.seed) || !Array.isArray(candidate.transactions) || candidate.chain !== "ethereum") {
        throw new Error("The imported draft does not contain a valid Ethereum observation.");
      }
      const model = buildImportedInvestigation(candidate as ImportedInvestigationDraft);
      setImported(model); setSelectedId(model.nodes[0]?.id ?? "");
      setStep(Math.max(1, ...model.edges.map((edge) => edge.step)));
      log("IMPORT", "Public observation opened", "Session-scoped dataset. No identity attribution was added.");
    } catch (error) { setLoadError(error instanceof Error ? error.message : "Unable to load this observation."); }
  }, [importedMode, log]);
  const model = useMemo(() => importedMode ? imported : ({ investigation, nodes: graphNodes, edges: graphEdges, evidence, hypothesis: hypotheses[0] }), [importedMode, imported]);
  const maxStep = Math.max(1, ...(model?.edges.map((edge) => edge.step) ?? []));
  const currentStep = Math.min(step, maxStep);
  const seedId = model?.nodes[0]?.id ?? "seed";
  const visible = useMemo(() => visibleScene(model?.nodes ?? [], model?.edges ?? [], currentStep, seedId), [model, currentStep, seedId]);
  const selected = visible.nodes.find((node) => node.id === selectedId) ?? visible.nodes[0];
  const activeHypothesis = drafts[0] ?? model?.hypothesis;
  useEffect(() => {
    if (!playing || !model) return;
    if (step >= maxStep) { setPlaying(false); return; }
    const timer = window.setTimeout(() => { setStep((value) => Math.min(maxStep, value + 1)); }, 1700);
    return () => window.clearTimeout(timer);
  }, [playing, step, maxStep, model]);
  useEffect(() => {
    const stopWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => document.removeEventListener("visibilitychange", stopWhenHidden);
  }, []);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(""), 4500); return () => window.clearTimeout(timer); }, [notice]);

  async function exportPacket() {
    if (!model || !selected || exporting) return;
    setExporting(true);
    try {
      const packet = await buildEvidencePacket({
        notice: importedMode ? "Public explorer observations. Not an identity attribution or legal certification." : "Synthetic training data. Not real investigative evidence.",
        mode: importedMode ? "PUBLIC_IMPORT" : "SYNTHETIC_SANDBOX",
        investigation: model.investigation,
        nodes: model.nodes, edges: model.edges, visibleEdges: visible.edges,
        selectedNode: selected, evidence: model.evidence,
        hypotheses: [...drafts, model.hypothesis], activity,
        capture: { step: currentStep, maxStep },
      });
      const url = URL.createObjectURL(new Blob([JSON.stringify(packet, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${model.investigation.id.toLowerCase()}-evidence.json`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      log("EXPORT", "Evidence packet exported", "Graph, hypotheses and session activity included. SHA-256 checksum; not a digital signature.");
      setNotice("Evidence packet exported. The checksum is not a digital signature.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Export failed. Please retry."); }
    finally { setExporting(false); }
  }
  function selectNode(node: GraphNode) { setSelectedId(node.id); setInspectorOpen(true); log("NODE_SELECT", "Node inspected", `${node.label} · ${node.state}`); }
  function moveStep(value: number) { setPlaying(false); setStep(Math.max(1, Math.min(maxStep, value))); log("STEP", "Playback moved", `Step ${value} of ${maxStep}`); }
  function play() { if (playing) { setPlaying(false); return; } if (currentStep >= maxStep) setStep(1); setPlaying(true); log("STEP", "Playback started", "User-controlled reconstruction, not live chain streaming."); }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await frame.current?.requestFullscreen(); }
    catch { setNotice("Fullscreen is unavailable in this browser. The graph can still be panned and zoomed."); }
  }
  if (!model || !selected || !activeHypothesis) return <div className={s.loading} role="status"><Icon name="target" /><h1>{loadError ? "Observation unavailable" : "Loading observation…"}</h1>
    <p>{loadError || "Preparing the graph without adding identity claims."}</p><Link href="/explore">Open Explorer ↗</Link></div>;
  return <div ref={frame} className={s.screen}>
    <header className={s.caseBar}>
      <Link href="/cases" className={s.backButton}><Icon name="arrow" width={16} height={16} />Back to cases</Link>
      <div className={s.caseTitle}><span className={s.caseIcon}><Icon name="case" /></span><div><h1>{model.investigation.title}</h1><p>{model.investigation.id} · {importedMode ? "Public snapshot" : "Synthetic demo"}</p></div></div>
      <div className={s.caseField}><span>Seed address</span><strong title={model.investigation.seed}>{model.investigation.seed.length > 24 ? `${model.investigation.seed.slice(0, 9)}…${model.investigation.seed.slice(-6)}` : model.investigation.seed}</strong></div>
      <div className={s.caseField}><span>Network</span><strong><Icon name="eth" width={17} height={17} />Ethereum</strong></div>
      <div className={s.caseField}><span>Mode</span><b className={s.mode} data-synthetic={!importedMode}>{importedMode ? "PUBLIC OBSERVATION" : "SYNTHETIC TRAINING"}</b></div>
      <div className={s.caseActions}><button className={s.quietButton} aria-expanded={inspectorOpen} onClick={() => setInspectorOpen((value) => !value)}>{inspectorOpen ? "Hide details" : "Inspector"}</button>
        <button className={s.exportButton} onClick={exportPacket} disabled={exporting} aria-label="Export evidence packet"><Icon name="export" width={17} height={17} /><span>{exporting ? "Exporting…" : "Export"}</span></button></div>
    </header>
    <div className={s.workarea} data-open={inspectorOpen}>
      <section className={s.graphFrame} aria-label={importedMode ? "Imported public observation" : "Synthetic training graph"}>
        <TopologyCanvas nodes={visible.nodes} allNodes={model.nodes} edges={visible.edges} seedId={seedId} selectedId={selected.id} onSelect={selectNode} />
        <div className={s.playback} role="group" aria-label="Investigation playback">
          <button aria-label="Previous step" onClick={() => moveStep(currentStep - 1)} disabled={currentStep <= 1}><Icon name="previous" width={17} height={17} /></button>
          <button className={s.playButton} aria-label={playing ? "Pause playback" : "Play reconstruction"} aria-pressed={playing} onClick={play} disabled={maxStep <= 1}><Icon name={playing ? "pause" : "play"} width={21} height={21} /></button>
          <button aria-label="Next step" onClick={() => moveStep(currentStep + 1)} disabled={currentStep >= maxStep}><Icon name="next" width={17} height={17} /></button>
          <label><span>Trace playback <b>{currentStep} / {maxStep}</b></span><input aria-label="Playback step" type="range" min="1" max={maxStep} value={currentStep} onChange={(event) => moveStep(Number(event.target.value))} /></label>
          <div className={s.playbackMeta}><Icon name="clock" width={15} height={15} />{importedMode ? "Imported snapshot" : "Training snapshot"}</div>
          <button aria-label="Toggle fullscreen" onClick={fullscreen}><Icon name="fit" width={17} height={17} /></button>
        </div>
      </section>
      {inspectorOpen && <button className={s.scrim} tabIndex={-1} aria-label="Dismiss inspector" onClick={closeInspector} />}
      <Inspector open={inspectorOpen} selected={selected} edges={visible.edges} evidence={model.evidence} hypothesis={activeHypothesis} activity={activity} synthetic={!importedMode} onClose={closeInspector}
        onHypothesisCreate={({ hypothesis }) => { setDrafts((items) => [hypothesis, ...items]); log("HYPOTHESIS", "Analyst draft created", hypothesis.claim); setNotice("Hypothesis added to this session and the next export."); }} />
    </div>
    {notice && <div className={s.notice} role="status">{notice}</div>}
  </div>;
}
