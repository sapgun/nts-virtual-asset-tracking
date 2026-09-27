"use client";

import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import type { GraphEdge, GraphNode } from "@/lib/domain";
import { edgeGeometry, globePoints, layoutScene, nodeConnections, starField } from "@/lib/scene-graph";
import { Icon, type IconName } from "./icons";
import s from "./workspace.module.css";

const kindIcons: Record<GraphNode["kind"], IconName> = {
  wallet: "wallet", exchange: "bank", bridge: "bridge", mixer: "mixer", contract: "contract",
};
export function TopologyCanvas({ nodes, allNodes, edges, seedId, selectedId, onSelect }: {
  nodes: GraphNode[]; allNodes: GraphNode[]; edges: GraphEdge[]; seedId: string; selectedId: string;
  onSelect: (node: GraphNode) => void;
}) {
  const id = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; ox: number; oy: number } | null>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [depth, setDepth] = useState(true);
  const [motion, setMotion] = useState(false);
  const positioned = useMemo(() => {
    const visibleIds = new Set(nodes.map((node) => node.id));
    return layoutScene(allNodes, seedId).filter((node) => visibleIds.has(node.id));
  }, [allNodes, nodes, seedId]);
  const byId = useMemo(() => new Map(positioned.map((node) => [node.id, node])), [positioned]);
  const stars = useMemo(() => starField(), []);
  const globe = useMemo(() => globePoints(), []);
  const selected = byId.get(selectedId);
  const counts = nodeConnections(selectedId, edges);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!preference.matches && document.visibilityState !== "hidden");
    update(); preference.addEventListener("change", update); document.addEventListener("visibilitychange", update);
    return () => { preference.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); };
  }, []);
  function zoom(delta: number) {
    setCamera((value) => ({ ...value, zoom: Math.max(.55, Math.min(2.5, value.zoom + delta)) }));
  }
  function local(event: PointerEvent<SVGSVGElement>) {
    const matrix = svg.current?.getScreenCTM();
    return matrix ? new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()) : null;
  }
  function startPan(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0 || (event.target as Element).closest("[data-node]")) return;
    const point = local(event); if (!point) return;
    drag.current = { id: event.pointerId, x: point.x, y: point.y, ox: camera.x, oy: camera.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pan(event: PointerEvent<SVGSVGElement>) {
    if (drag.current?.id !== event.pointerId) return;
    const point = local(event); if (!point) return;
    const { x, y, ox, oy } = drag.current;
    setCamera((value) => ({ ...value, x: ox + point.x - x, y: oy + point.y - y }));
  }
  function stopPan(event: PointerEvent<SVGSVGElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
  }
  return <div className={s.canvas}>
    <div className={s.graphHeading}><span className={s.targetMark}><Icon name="target" /></span>
      <div><h2>Transaction Topology</h2><p>{nodes.length} nodes · {edges.length} visible relationships</p></div>
    </div>
    <div className={s.graphTools} role="toolbar" aria-label="Graph controls">
      <button title="Zoom in (+)" aria-label="Zoom in" onClick={() => zoom(.15)} disabled={camera.zoom >= 2.5}><Icon name="plus" /></button>
      <button title="Zoom out (-)" aria-label="Zoom out" onClick={() => zoom(-.15)} disabled={camera.zoom <= .55}><Icon name="minus" /></button>
      <button title="Reset view (0)" aria-label="Reset graph view" onClick={() => setCamera({ x: 0, y: 0, zoom: 1 })}><Icon name="fit" /></button>
      <button title="Toggle spatial background" aria-label="Spatial background" aria-pressed={depth} onClick={() => setDepth((value) => !value)}><Icon name="layers" /></button>
    </div>
    <svg ref={svg} className={s.graphSvg} viewBox="0 0 1080 690" role="group" aria-label="Interactive transaction graph" tabIndex={0}
      onPointerDown={startPan} onPointerMove={pan} onPointerUp={stopPan} onPointerCancel={stopPan} onLostPointerCapture={() => { drag.current = null; }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (["+", "=", "-", "0", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) event.preventDefault();
        if (event.key === "+" || event.key === "=") zoom(.15);
        if (event.key === "-") zoom(-.15);
        if (event.key === "0") setCamera({ x: 0, y: 0, zoom: 1 });
        if (event.key.startsWith("Arrow")) setCamera((value) => ({ ...value,
          x: value.x + (event.key === "ArrowRight" ? 25 : event.key === "ArrowLeft" ? -25 : 0),
          y: value.y + (event.key === "ArrowDown" ? 25 : event.key === "ArrowUp" ? -25 : 0) }));
      }}>
      <defs>
        <radialGradient id={`${id}-node`}><stop stopColor="#214464" /><stop offset="1" stopColor="#0a1726" /></radialGradient>
        <radialGradient id={`${id}-seed`}><stop stopColor="#116ba8" /><stop offset="1" stopColor="#072a46" /></radialGradient>
        <radialGradient id={`${id}-ambient`}><stop stopColor="#0a3350" stopOpacity=".55" /><stop offset="1" stopColor="#030a13" stopOpacity="0" /></radialGradient>
        <filter id={`${id}-glow`} x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="6" /></filter>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 9 5 0 9" fill="none" stroke="#79b0d0" strokeWidth="1.6" /></marker>
      </defs>
      <g aria-hidden="true" pointerEvents="none">
        <ellipse cx="475" cy="355" rx="430" ry="330" fill={`url(#${id}-ambient)`} />
        {stars.map((star, i) => <circle key={i} cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} fill="#57bdf8" />)}
        {depth && <g className={s.depthDecor}>
          {globe.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r=".85" fill="#278cc5" opacity=".28" />)}
          <ellipse cx="970" cy="146" rx="215" ry="215" fill="none" stroke="#278cc5" strokeOpacity=".14" />
          <ellipse cx="970" cy="146" rx="115" ry="215" fill="none" stroke="#278cc5" strokeOpacity=".14" />
          {Array.from({ length: 15 }, (_, i) => <path key={i} d={`M ${540 + (i - 7) * 24} 270 L ${540 + (i - 7) * 205} 750`} stroke="#195076" strokeOpacity=".3" />)}
          {[310, 335, 368, 412, 470, 542, 630].map((y) => <path key={y} d={`M 0 ${y + 65} Q 540 ${y - 65} 1080 ${y + 65}`} fill="none" stroke="#195076" strokeOpacity=".3" />)}
        </g>}
      </g>
      <g transform={`translate(${camera.x} ${camera.y}) translate(540 330) scale(${camera.zoom}) translate(-540 -330)`}>
        {edges.map((edge, index) => {
          const source = byId.get(edge.source), target = byId.get(edge.target);
          if (!source || !target) return null;
          const samePair = edges.filter((item) => item.source === edge.source && item.target === edge.target);
          const offset = samePair.length > 1 ? (samePair.indexOf(edge) - (samePair.length - 1) / 2) * 48 : 18;
          const geometry = edgeGeometry(source, target, offset);
          const active = edge.source === selectedId || edge.target === selectedId;
          return <g key={edge.id} className={`${s.edge} ${active ? s.activeEdge : ""}`} data-state={edge.state}>
            <path d={geometry.path} markerEnd={`url(#${id}-arrow)`} />
            {motion && active && <circle r="2.3" className={s.flowParticle}><animateMotion path={geometry.path} dur={`${3.4 + index % 3}s`} repeatCount="indefinite" /></circle>}
            {active && <text x={geometry.label.x} y={geometry.label.y}>{edge.label}</text>}
          </g>;
        })}
        {positioned.map((node) => {
          const active = node.id === selectedId;
          const isSeed = node.id === seedId;
          return <g key={node.id} data-node={node.id} data-kind={node.kind} data-state={node.state}
            className={`${s.sceneNode} ${active ? s.selectedNode : ""}`} transform={`translate(${node.x} ${node.y})`}
            role="button" tabIndex={0} aria-pressed={active} aria-label={`${node.label}, ${node.state}. Inspect node.`}
            onClick={() => onSelect(node)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(node); } }}>
            {active && <><circle className={s.halo} r={node.radius + 7} filter={`url(#${id}-glow)`} /><circle className={s.orbitRing} r={node.radius + 10} /></>}
            <circle className={s.nodeFace} r={node.radius} fill={`url(#${id}-${isSeed ? "seed" : "node"})`} />
            <Icon name={isSeed ? "eth" : kindIcons[node.kind]} x={-13} y={-13} width={26} height={26} />
            <text className={s.nodeLabel} x="0" y={node.radius + 26}>{node.label}</text>
            <text className={s.nodeSublabel} x="0" y={node.radius + 45}>{isSeed ? "Seed address" : node.kind} · {node.state.toLowerCase()}</text>
          </g>;
        })}
        {selected && <foreignObject x={Math.min(795, selected.x + 53)} y={Math.max(78, selected.y - 110)} width="246" height="163" pointerEvents="none" aria-hidden="true">
          <div className={s.nodePopover}><strong><Icon name={selected.id === seedId ? "eth" : kindIcons[selected.kind]} />{selected.label}</strong>
            <span className={s.badge} data-state={selected.state}>{selected.state}</span>
            <dl><div><dt>Incoming links</dt><dd>{counts.incoming}</dd></div><div><dt>Outgoing links</dt><dd>{counts.outgoing}</dd></div><div><dt>Identity attribution</dt><dd>Not established</dd></div></dl>
          </div>
        </foreignObject>}
      </g>
    </svg>
    <div className={s.graphSignature}>TRACE. CONNECT. VERIFY.<small>Relationships are not identities.</small></div>
    <div className={s.zoomReadout}>{Math.round(camera.zoom * 100)}%<small>Drag to pan · + / − to zoom</small></div>
  </div>;
}
