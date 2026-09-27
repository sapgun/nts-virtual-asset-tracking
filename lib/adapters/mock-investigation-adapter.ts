import type {
  ExpansionRequest,
  ExpansionResult,
  InvestigationAdapter,
  InvestigationSnapshot,
} from "@/lib/adapters/investigation-adapter";
import {
  evidence,
  graphEdges,
  graphNodes,
  hypotheses,
  investigation,
} from "@/lib/mock-data";

export class MockInvestigationAdapter implements InvestigationAdapter {
  async getInvestigation(id: string): Promise<InvestigationSnapshot | null> {
    if (id !== investigation.id) return null;

    return {
      investigation,
      nodes: graphNodes,
      edges: graphEdges,
      evidence,
      hypotheses,
    };
  }

  async expand(request: ExpansionRequest): Promise<ExpansionResult> {
    const depth = Math.max(1, Math.min(request.depth ?? 1, 4));
    const visibleEdges = graphEdges.filter((edge) => edge.step <= depth);
    const visibleNodeIds = new Set<string>(["seed"]);

    for (const edge of visibleEdges) {
      visibleNodeIds.add(edge.source);
      visibleNodeIds.add(edge.target);
    }

    return {
      nodes: graphNodes.filter((node) => visibleNodeIds.has(node.id)),
      edges: visibleEdges,
      provenance: {
        adapter: "mock-investigation-adapter",
        generatedAt: new Date().toISOString(),
        synthetic: true,
      },
    };
  }
}
