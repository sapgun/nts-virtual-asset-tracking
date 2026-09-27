import type {
  EvidenceItem,
  GraphNode,
  Hypothesis,
} from "@/lib/domain";

export type InvestigatorQuestion =
  | "EXPLAIN_NODE"
  | "EXPLAIN_CONFIDENCE"
  | "MISSING_EVIDENCE"
  | "NEXT_STEP";

export interface InvestigatorContext {
  node: GraphNode;
  hypothesis: Hypothesis;
  evidence: EvidenceItem[];
}

export interface InvestigatorRequest {
  question: InvestigatorQuestion;
  context: InvestigatorContext;
}

export interface InvestigatorResponse {
  answer: string;
  evidenceRefs: string[];
  cautions: string[];
  generatedBy: string;
}

export interface InvestigatorAdapter {
  answer(request: InvestigatorRequest): Promise<InvestigatorResponse>;
}
