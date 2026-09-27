import type {
  EvidenceItem,
  GraphEdge,
  GraphNode,
  Hypothesis,
  Investigation,
} from "@/lib/domain";

export interface InvestigationSnapshot {
  investigation: Investigation;
  nodes: GraphNode[];
  edges: GraphEdge[];
  evidence: EvidenceItem[];
  hypotheses: Hypothesis[];
}

export interface ExpansionRequest {
  investigationId: string;
  nodeId: string;
  depth?: number;
}

export interface ExpansionResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  provenance: {
    adapter: string;
    generatedAt: string;
    synthetic: boolean;
  };
}

export interface InvestigationAdapter {
  getInvestigation(id: string): Promise<InvestigationSnapshot | null>;
  expand(request: ExpansionRequest): Promise<ExpansionResult>;
}
