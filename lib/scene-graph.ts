import type { GraphEdge, GraphNode } from "./domain";

export interface Point { x: number; y: number }
export interface SceneNode extends GraphNode { radius: number }

/** Presentation only: never change evidence, confidence, addresses or source objects. */
export function layoutScene(nodes: GraphNode[], seedId: string): SceneNode[] {
  const peers = nodes.filter((node) => node.id !== seedId);
  return nodes.map((node) => {
    if (node.id === seedId) return { ...node, x: 435, y: 360, radius: 31 };
    const index = peers.findIndex((peer) => peer.id === node.id);
    // A deterministic radial layout supports either the training fixture or imported records.
    const angle = (-146 + index * (360 / Math.max(peers.length, 1))) * Math.PI / 180;
    const ring = peers.length > 10 ? 0.7 + (index % 2) * 0.3 : 1;
    return {
      ...node,
      x: 505 + Math.cos(angle) * 320 * ring,
      y: 330 + Math.sin(angle) * 205 * ring,
      radius: peers.length > 16 ? 18 : 24,
    };
  });
}

/** An incoming-only rule hides source nodes; visibility must include BOTH edge endpoints. */
export function visibleScene(
  nodes: GraphNode[], edges: GraphEdge[], step: number, seedId: string,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const known = new Set(nodes.map((node) => node.id));
  const visibleEdges = edges.filter((edge) => Number.isFinite(edge.step) &&
    edge.step <= step && known.has(edge.source) && known.has(edge.target));
  const ids = new Set([seedId]);
  visibleEdges.forEach((edge) => { ids.add(edge.source); ids.add(edge.target); });
  return { nodes: nodes.filter((node) => ids.has(node.id)), edges: visibleEdges };
}

/** Clip arrow endpoints to circles, including reverse-direction and self transactions. */
export function edgeGeometry(source: SceneNode, target: SceneNode, offset = 0) {
  if (source.id === target.id) {
    const r = source.radius;
    return { path: `M ${source.x - r * .6} ${source.y - r * .8} C ${source.x - 65} ${source.y - 100}, ${source.x + 65} ${source.y - 100}, ${source.x + r * .6} ${source.y - r * .8}`,
      label: { x: source.x, y: source.y - 76 } };
  }
  const dx = target.x - source.x, dy = target.y - source.y;
  const distance = Math.hypot(dx, dy) || 1;
  const ux = dx / distance, uy = dy / distance;
  const start = { x: source.x + ux * (source.radius + 3), y: source.y + uy * (source.radius + 3) };
  const end = { x: target.x - ux * (target.radius + 9), y: target.y - uy * (target.radius + 9) };
  const bend = offset || 20;
  const control = { x: (start.x + end.x) / 2 - uy * bend, y: (start.y + end.y) / 2 + ux * bend };
  return { path: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`,
    label: { x: .25 * start.x + .5 * control.x + .25 * end.x, y: .25 * start.y + .5 * control.y + .25 * end.y - 12 } };
}

export function nodeConnections(nodeId: string, edges: GraphEdge[]) {
  return { incoming: edges.filter((edge) => edge.target === nodeId).length,
    outgoing: edges.filter((edge) => edge.source === nodeId).length,
    total: edges.filter((edge) => edge.target === nodeId || edge.source === nodeId).length };
}

/** Display-safe URL check. A citation is never implicitly a trusted identity attribution. */
export function safeSourceUrl(value?: string): string | null {
  if (!value) return null;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}

/** Deterministic decorative geometry, explicitly NOT transaction data. */
export function starField(count = 130): Array<Point & { radius: number; opacity: number }> {
  let seed = 7129;
  const next = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  return Array.from({ length: count }, () => ({ x: next() * 1080, y: next() * 690,
    radius: .4 + next() * 1.2, opacity: .14 + next() * .44 }));
}

export function globePoints(): Point[] {
  const points: Point[] = [];
  for (let lat = -78; lat <= 78; lat += 9) {
    for (let lon = -90; lon <= 90; lon += 9) {
      const a = lat * Math.PI / 180, b = lon * Math.PI / 180;
      points.push({ x: 970 + 215 * Math.cos(a) * Math.sin(b), y: 146 + 215 * Math.sin(a) });
    }
  }
  return points;
}
