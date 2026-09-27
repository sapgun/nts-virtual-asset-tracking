"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { GraphEdge, GraphNode } from "@/lib/domain";

const nodeClass: Record<GraphNode["kind"], string> = {
  wallet: "node-wallet",
  exchange: "node-exchange",
  mixer: "node-mixer",
  bridge: "node-bridge",
  contract: "node-contract",
};

const stateShort = {
  OBSERVED: "OBS",
  INFERRED: "INF",
  ATTRIBUTED: "ATR",
  UNVERIFIED: "UNV",
} as const;

export function GraphCanvas({
  nodes,
  edges,
  step,
  selectedId,
  onSelect,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  step: number;
  selectedId: string;
  onSelect: (node: GraphNode) => void;
}) {
  const nodeMap = useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  );

  const visibleEdges = edges.filter((edge) => edge.step <= step);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <section className="graph-panel graph-panel-v3">
      <div className="graph-hud">
        <div>
          <span className="eyebrow">TRANSACTION TOPOLOGY</span>
          <strong>{nodes.length} nodes · {visibleEdges.length} visible links</strong>
        </div>
        <div className="graph-mini-legend">
          <span className="observed"><i />Observed</span>
          <span className="inferred"><i />Inferred</span>
          <span className="attributed"><i />Attributed</span>
        </div>
      </div>

      <div
        className="graph-stage graph-stage-v3"
        style={{
          "--graph-rx": tilt.y + "deg",
          "--graph-ry": tilt.x + "deg",
        } as CSSProperties}
        onPointerMove={(event) => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          setTilt({
            x: Number((px * 1.8).toFixed(2)),
            y: Number((-py * 1.3).toFixed(2)),
          });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div className="graph-depth-plane depth-plane-a" />
        <div className="graph-depth-plane depth-plane-b" />
        <svg viewBox="0 0 900 520" role="img" aria-label="Investigation transaction graph">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-head" />
            </marker>
            <filter id="selectedGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {edges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const visible = edge.step <= step;

            return (
              <g
                key={edge.id}
                className={[
                  "graph-edge",
                  "edge-" + edge.state.toLowerCase(),
                  visible ? "visible" : "",
                ].join(" ")}
              >
                <line
                  x1={source.x + 54}
                  y1={source.y}
                  x2={target.x - 54}
                  y2={target.y}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2 - 10}
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {nodes.map((node) => {
            const incoming = edges.filter((edge) => edge.target === node.id);
            const visible =
              incoming.length === 0 ||
              incoming.some((edge) => edge.step <= step);
            const selected = selectedId === node.id;

            return (
              <g
                key={node.id}
                className={[
                  "graph-node",
                  nodeClass[node.kind],
                  "node-" + node.state.toLowerCase(),
                  visible ? "visible" : "",
                  selected ? "selected" : "",
                ].join(" ")}
                transform={`translate(${node.x - 54} ${node.y - 34})`}
                role="button"
                tabIndex={visible ? 0 : -1}
                onClick={() => visible && onSelect(node)}
                onKeyDown={(event) => {
                  if (
                    visible &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    onSelect(node);
                  }
                }}
              >
                {selected && (
                  <circle
                    className="node-halo"
                    cx="54"
                    cy="34"
                    r="48"
                    filter="url(#selectedGlow)"
                  />
                )}
                <rect width="108" height="68" rx="18" />
                <circle className="node-state-dot" cx="15" cy="15" r="3" />
                <text className="node-title" x="54" y="31">
                  {node.label}
                </text>
                <text className="node-meta" x="54" y="49">
                  {selected
                    ? Math.round(node.confidence * 100) + "% · " + node.state
                    : stateShort[node.state]}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="graph-grid" />
        <div className="graph-vignette" />
      </div>
    </section>
  );
}
