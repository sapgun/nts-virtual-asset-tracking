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
import { useLanguage } from "@/lib/i18n/provider";

export function InvestigationWorkbench({ importedMode = false }: { importedMode?: boolean }) {
  const { locale, t, tc } = useLanguage();
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
      if (!raw) throw new Error(t("investigate.errorNoImport"));
      const value: unknown = JSON.parse(raw);
      if (!value || typeof value !== "object") throw new Error(t("investigate.errorInvalidImport"));
      const candidate = value as Partial<ImportedInvestigationDraft>;
      if (typeof candidate.seed !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(candidate.seed) || !Array.isArray(candidate.transactions) || candidate.chain !== "ethereum") {
        throw new Error(t("investigate.errorInvalidDraft"));
      }
      const model = buildImportedInvestigation(candidate as ImportedInvestigationDraft, locale);
      setImported(model); setSelectedId(model.nodes[0]?.id ?? "");
      setStep(Math.max(1, ...model.edges.map((edge) => edge.step)));
      log("IMPORT", t("investigate.logImportTitle"), t("investigate.logImportDetail"));
    } catch (error) { setLoadError(error instanceof Error ? error.message : t("investigate.errorLoadObservation")); }
  }, [importedMode, locale, log, t]);
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
        notice: importedMode ? t("investigate.packetNoticePublic") : t("investigate.packetNoticeSynthetic"),
        mode: importedMode ? "PUBLIC_IMPORT" : "SYNTHETIC_SANDBOX",
        investigation: model.investigation,
        nodes: model.nodes, edges: model.edges, visibleEdges: visible.edges,
        selectedNode: selected, evidence: model.evidence,
        hypotheses: [...drafts, model.hypothesis], activity,
        capture: { step: currentStep, maxStep },
      }, locale);
      const url = URL.createObjectURL(new Blob([JSON.stringify(packet, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${model.investigation.id.toLowerCase()}-evidence.json`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      log("EXPORT", t("investigate.logExportTitle"), t("investigate.logExportDetail"));
      setNotice(t("investigate.noticeExported"));
    } catch (error) { setNotice(error instanceof Error ? error.message : t("investigate.noticeExportFailed")); }
    finally { setExporting(false); }
  }
  function selectNode(node: GraphNode) { setSelectedId(node.id); setInspectorOpen(true); log("NODE_SELECT", t("investigate.logNodeTitle"), `${tc(node.label)} · ${node.state}`); }
  function moveStep(value: number) { setPlaying(false); setStep(Math.max(1, Math.min(maxStep, value))); log("STEP", t("investigate.logStepTitle"), t("investigate.logStepDetail", { value, max: maxStep })); }
  function play() { if (playing) { setPlaying(false); return; } if (currentStep >= maxStep) setStep(1); setPlaying(true); log("STEP", t("investigate.logPlayTitle"), t("investigate.logPlayDetail")); }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await frame.current?.requestFullscreen(); }
    catch { setNotice(t("investigate.noticeFullscreen")); }
  }
  if (!model || !selected || !activeHypothesis) return <div className={s.loading} role="status"><Icon name="target" /><h1>{loadError ? t("investigate.unavailableTitle") : t("investigate.loadingTitle")}</h1>
    <p>{loadError || t("investigate.loadingBody")}</p><Link href="/explore">{t("investigate.openExplorer")} ↗</Link></div>;
  return <div ref={frame} className={s.screen}>
    <header className={s.caseBar}>
      <Link href="/cases" className={s.backButton}><Icon name="arrow" width={16} height={16} />{t("investigate.backToCases")}</Link>
      <div className={s.caseTitle}><span className={s.caseIcon}><Icon name="case" /></span><div><h1>{tc(model.investigation.title)}</h1><p>{model.investigation.id} · {importedMode ? t("investigate.publicObservation") : t("investigate.syntheticDemo")}</p></div></div>
      <div className={s.caseField}><span>{t("investigate.seedAddress")}</span><strong title={model.investigation.seed}>{model.investigation.seed.length > 24 ? `${model.investigation.seed.slice(0, 9)}…${model.investigation.seed.slice(-6)}` : model.investigation.seed}</strong></div>
      <div className={s.caseField}><span>{t("investigate.network")}</span><strong><Icon name="eth" width={17} height={17} />Ethereum</strong></div>
      <div className={s.caseField}><span>{t("investigate.mode")}</span><b className={s.mode} data-synthetic={!importedMode}>{importedMode ? t("investigate.publicMode") : t("investigate.syntheticMode")}</b></div>
      <div className={s.caseActions}><button className={s.quietButton} aria-expanded={inspectorOpen} onClick={() => setInspectorOpen((value) => !value)}>{inspectorOpen ? t("investigate.hideDetails") : t("investigate.inspector")}</button>
        <button className={s.exportButton} onClick={exportPacket} disabled={exporting} aria-label={t("investigate.exportAria")}><Icon name="export" width={17} height={17} /><span>{exporting ? t("investigate.exporting") : t("investigate.export")}</span></button></div>
    </header>
    <div className={s.workarea} data-open={inspectorOpen}>
      <section className={s.graphFrame} aria-label={importedMode ? t("investigate.graphAriaPublic") : t("investigate.graphAriaSynthetic")}>
        <TopologyCanvas nodes={visible.nodes} allNodes={model.nodes} edges={visible.edges} seedId={seedId} selectedId={selected.id} onSelect={selectNode} />
        <div className={s.playback} role="group" aria-label={t("investigate.playbackLabel")}>
          <button aria-label={t("investigate.prevStepAria")} onClick={() => moveStep(currentStep - 1)} disabled={currentStep <= 1}><Icon name="previous" width={17} height={17} /></button>
          <button className={s.playButton} aria-label={playing ? t("investigate.pauseAria") : t("investigate.playAria")} aria-pressed={playing} onClick={play} disabled={maxStep <= 1}><Icon name={playing ? "pause" : "play"} width={21} height={21} /></button>
          <button aria-label={t("investigate.nextStepAria")} onClick={() => moveStep(currentStep + 1)} disabled={currentStep >= maxStep}><Icon name="next" width={17} height={17} /></button>
          <label><span>{t("investigate.playbackLabel")} <b>{currentStep} / {maxStep}</b></span><input aria-label={t("investigate.playbackLabel")} type="range" min="1" max={maxStep} value={currentStep} onChange={(event) => moveStep(Number(event.target.value))} /></label>
          <div className={s.playbackMeta}><Icon name="clock" width={15} height={15} />{importedMode ? t("investigate.importedSnapshot") : t("investigate.trainingSnapshot")}</div>
          <button aria-label={t("investigate.fullscreenAria")} onClick={fullscreen}><Icon name="fit" width={17} height={17} /></button>
        </div>
      </section>
      {inspectorOpen && <button className={s.scrim} tabIndex={-1} aria-label={t("inspector.closeAria")} onClick={closeInspector} />}
      <Inspector open={inspectorOpen} selected={selected} edges={visible.edges} evidence={model.evidence} hypothesis={activeHypothesis} activity={activity} synthetic={!importedMode} onClose={closeInspector}
        onHypothesisCreate={({ hypothesis }) => { setDrafts((items) => [hypothesis, ...items]); log("HYPOTHESIS", t("investigate.logHypothesisTitle"), hypothesis.claim); setNotice(t("investigate.noticeHypothesis")); }} />
    </div>
    {notice && <div className={s.notice} role="status">{notice}</div>}
  </div>;
}
