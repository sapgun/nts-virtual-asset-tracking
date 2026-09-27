"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { EvidenceItem, GraphEdge, GraphNode, Hypothesis } from "@/lib/domain";
import { ActivityTimeline, type InvestigationActivity } from "@/components/activity-timeline";
import { EvidenceQualityCard } from "@/components/evidence-quality-card";
import { HypothesisBuilder, type HypothesisDraftEvent } from "@/components/hypothesis-builder";
import { InvestigatorCopilot } from "@/components/investigator-copilot";
import { nodeConnections, safeSourceUrl } from "@/lib/scene-graph";
import { Icon } from "./icons";
import s from "./workspace.module.css";

const tabs = ["Node", "Evidence", "Analysis", "Activity"] as const;
type Tab = typeof tabs[number];
export function Inspector({ open, selected, edges, evidence, hypothesis, activity, synthetic, onClose, onHypothesisCreate }: {
  open: boolean; selected: GraphNode; edges: GraphEdge[]; evidence: EvidenceItem[]; hypothesis: Hypothesis;
  activity: InvestigationActivity[]; synthetic: boolean; onClose: () => void;
  onHypothesisCreate: (event: HypothesisDraftEvent) => void;
}) {
  const [tab, setTab] = useState<Tab>("Node");
  const [mobile, setMobile] = useState(false);
  const [copyState, setCopyState] = useState("");
  const root = useRef<HTMLElement>(null);
  const id = useId().replace(/:/g, "");
  const counts = nodeConnections(selected.id, edges);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 960px)");
    const update = () => setMobile(media.matches); update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => { setCopyState(""); }, [selected.id]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    if (mobile) root.current?.querySelector<HTMLButtonElement>("button")?.focus();
    function keys(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab" || !mobile) return;
      const focusables = Array.from(root.current?.querySelectorAll<HTMLElement>("button:not(:disabled),a[href],input,textarea,[tabindex='0']") ?? [])
        .filter((element) => element.getClientRects().length > 0);
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener("keydown", keys);
    return () => { document.removeEventListener("keydown", keys); if (mobile && previous?.isConnected) previous.focus(); };
  }, [mobile, open, onClose]);
  async function copyIdentifier() {
    try { await navigator.clipboard.writeText(selected.id); setCopyState("Node identifier copied"); }
    catch { setCopyState("Clipboard unavailable. Select and copy the identifier below."); }
  }
  return <aside ref={root} className={s.inspector} hidden={!open} role={mobile ? "dialog" : "complementary"}
    aria-modal={mobile && open ? true : undefined} aria-labelledby={`${id}-title`}>
    <header className={s.inspectorHeader}><div><h2 id={`${id}-title`}>Inspector</h2><p>Node details, evidence and intelligence</p></div>
      <button className={s.iconButton} aria-label="Close inspector" onClick={onClose}><Icon name="close" /></button>
    </header>
    <div className={s.tabs} role="tablist" aria-label="Inspector sections">
      {tabs.map((name, index) => <button key={name} id={`${id}-tab-${name}`} role="tab" aria-selected={tab === name}
        aria-controls={`${id}-panel-${name}`} tabIndex={tab === name ? 0 : -1} onClick={() => setTab(name)}
        onKeyDown={(event) => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
          else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = tabs.length - 1;
          else return;
          event.preventDefault(); setTab(tabs[next]); document.getElementById(`${id}-tab-${tabs[next]}`)?.focus();
        }}>{name}{name === "Evidence" && <small>{evidence.length}</small>}</button>)}
    </div>
    <div className={s.inspectorScroll}>
      <section id={`${id}-panel-Node`} role="tabpanel" aria-labelledby={`${id}-tab-Node`} hidden={tab !== "Node"} className={s.tabPanel}>
        <div className={s.selectedSummary}><span className={s.entityIcon}><Icon name={selected.kind === "wallet" ? "eth" : selected.kind === "exchange" ? "bank" : selected.kind === "bridge" ? "bridge" : "contract"} width={30} height={30} /></span>
          <div><div className={s.selectedName}><h3>{selected.label}</h3><button className={s.copyButton} aria-label="Copy node identifier" onClick={copyIdentifier}><Icon name="copy" width={15} height={15} /></button></div>
            <p>{selected.kind} · {synthetic ? "training fixture" : "imported observation"}</p>
            <span className={s.badge} data-state={selected.state}>{selected.state}</span>
          </div>
        </div>
        {copyState && <p className={s.inlineStatus} role="status">{copyState}</p>}
        <div className={s.confidence}><span>{synthetic ? "Demo support" : "Source support"}</span><i><b style={{ width: `${Math.max(0, Math.min(100, selected.confidence * 100))}%` }} /></i><strong>{Math.round(selected.confidence * 100)}%</strong></div>
        <p className={s.finePrint}>Not a calibrated identity or guilt probability.</p>
        <div className={s.metricRow}><div><span>Incoming links</span><strong>{counts.incoming}</strong></div><div><span>Outgoing links</span><strong>{counts.outgoing}</strong></div><div><span>Case evidence</span><strong>{evidence.length}</strong></div></div>
        <section className={s.detailBlock}><h4>Description</h4><p>{selected.description}</p></section>
        <section className={s.detailBlock}><h4>Tags</h4><div className={s.tags}>{(selected.tags ?? []).map((tag) => <span key={tag}>{tag}</span>)}{!selected.tags?.length && <span>No tags</span>}</div></section>
        <section className={s.hypothesisBlock}><h4><Icon name="target" />Active hypothesis</h4>
          <span className={s.badge} data-state={hypothesis.state}>{hypothesis.state}</span><p>{hypothesis.claim}</p>
          <small>{hypothesis.method}</small>
          <details><summary>Alternative explanations ({hypothesis.counterEvidence.length})</summary><ul>{hypothesis.counterEvidence.map((item) => <li key={item}>{item}</li>)}</ul></details>
        </section>
        <button className={s.wideButton} onClick={() => { setTab("Evidence"); document.getElementById(`${id}-tab-Evidence`)?.focus(); }}><Icon name="evidence" />View case evidence<Icon name="arrow" /></button>
      </section>
      <section id={`${id}-panel-Evidence`} role="tabpanel" aria-labelledby={`${id}-tab-Evidence`} hidden={tab !== "Evidence"} className={s.tabPanel}>
        <p className={s.finePrint}>Case-level evidence. These items are not automatically proof about the selected node.</p>
        {evidence.map((item) => <article className={s.evidenceCard} key={item.id}><div><code>{item.id}</code><span className={s.badge} data-state={item.state}>{item.state}</span></div>
          <h3>{item.title}</h3><p>{item.detail}</p><small>{item.sourceType}</small>
          {safeSourceUrl(item.source) && <a href={safeSourceUrl(item.source)!} target="_blank" rel="noopener noreferrer">Open source ↗</a>}
        </article>)}
        {!evidence.length && <p>No evidence registered for this observation.</p>}
      </section>
      <section id={`${id}-panel-Analysis`} role="tabpanel" aria-labelledby={`${id}-tab-Analysis`} hidden={tab !== "Analysis"} className={`${s.tabPanel} ${s.analysis}`}>
        <p className={s.finePrint}>Rule-based assistance. No external language model is connected.</p>
        <InvestigatorCopilot key={`${selected.id}:${hypothesis.id}`} node={selected} hypothesis={hypothesis} evidence={evidence} />
        <HypothesisBuilder evidence={evidence} onCreate={onHypothesisCreate} />
        <details><summary>Evidence quality breakdown</summary><EvidenceQualityCard evidence={evidence} hypothesis={hypothesis} compact /></details>
      </section>
      <section id={`${id}-panel-Activity`} role="tabpanel" aria-labelledby={`${id}-tab-Activity`} hidden={tab !== "Activity"} className={`${s.tabPanel} ${s.analysis}`}>
        <p className={s.finePrint}>Session activity only; not a durable audit log.</p><ActivityTimeline items={activity} />
      </section>
    </div>
  </aside>;
}
