export type EvidenceState = "OBSERVED" | "INFERRED" | "ATTRIBUTED" | "UNVERIFIED";

export type ChainId = "ethereum" | "bitcoin" | "solana" | "arbitrum" | "base";

export interface Investigation {
  id: string;
  title: string;
  seed: string;
  chain: ChainId;
  status: "ACTIVE" | "REVIEW" | "CLOSED";
  createdAt: string;
  evidenceCompleteness: number;
}

export interface GraphNode {
  id: string;
  label: string;
  kind: "wallet" | "exchange" | "mixer" | "bridge" | "contract";
  state: EvidenceState;
  confidence: number;
  x: number;
  y: number;
  description: string;
  tags?: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  state: EvidenceState;
  confidence: number;
  step: number;
}

export interface EvidenceItem {
  id: string;
  title: string;
  state: EvidenceState;
  sourceType: "ONCHAIN" | "PUBLIC_SOURCE" | "ANALYST_NOTE" | "OFFCHAIN";
  confidence: number;
  detail: string;
  source?: string;
}

export interface Hypothesis {
  id: string;
  claim: string;
  method: string;
  confidence: number;
  state: Extract<EvidenceState, "INFERRED" | "UNVERIFIED">;
  supportingEvidence: string[];
  counterEvidence: string[];
}

export interface CaseFile {
  id: string;
  title: string;
  category: string;
  difficulty: "FOUNDATION" | "INTERMEDIATE" | "ADVANCED";
  concepts: string[];
  evidenceState: EvidenceState;
  summary: string;
}
