"use client";

import { useMemo } from "react";
import type { GraphEdge, GraphNode } from "@/lib/domain";
import { StateBadge } from "@/components/state-badge";

const nodeClass: Record<GraphNode["kind"], string> = {
  wallet: "node-wallet",
  exchange: "node-exchange",
  mixer: "node-mixer",
  bridge: "node-bridge",
  contract: "node-contract",
};

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
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  return (
    <section className="graph-panel">
      <div className="panel-toolbar">
        <div>
          <span className="eyebrow">GRAPH EXPLORER</span>
          <strong>Flow reconstruction</strong>
        </div>
        <div className="legend-inline">
          <StateBadge state="OBSERVED" />
          <StateBadge state="INFERRED" />
          <StateBadge state="ATTRIBUTED" />
        </div>
      </div>

      <div className="graph-stage">
        <svg viewBox="0 0 840 420" role="img" aria-label="Synthetic transaction graph">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-head" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;
            const visible = edge.step <= step;
            return (
              <g key={edge.id} className={visible ? "graph-edge visible" : "graph-edge"}>
                <line
                  x1={source.x + 54}
                  y1={source.y}
                  x2={target.x - 54}
                  y2={target.y}
                  markerEnd="url(#arrow)"
                />
                <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 10}>
                  {edge.label}
                </text>
              </g>
            );
          })}

          {nodes.map((node) => {
            const incoming = edges.filter((edge) => edge.target === node.id);
            const visible = node.id === "seed" || incoming.some((edge) => edge.step <= step);
            return (
              <g
                key={node.id}
                className={[
                  "graph-node",
                  nodeClass[node.kind],
                  visible ? "visible" : "",
                  selectedId === node.id ? "selected" : "",
                ].join(" ")}
                transform={`translate(${node.x - 54} ${node.y - 34})`}
                role="button"
                tabIndex={visible ? 0 : -1}
                onClick={() => visible && onSelect(node)}
                onKeyDown={(event) => {
                  if (visible && (event.key === "Enter" || event.key === " ")) onSelect(node);
                }}
              >
                <rect width="108" height="68" rx="16" />
                <text className="node-title" x="54" y="29">
                  {node.label}
                </text>
                <text className="node-meta" x="54" y="48">
                  {Math.round(node.confidence * 100)}% · {node.state}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="graph-grid" />
      </div>
    </section>
  );
}
