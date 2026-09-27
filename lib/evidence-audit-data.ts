import type { EvidenceTransitionEvent } from "@/lib/evidence-audit";

export const evidenceTransitionLedger: EvidenceTransitionEvent[] = [
  {
    id: "EVT-DEMO-001",
    evidenceId: "EV-03",
    from: "UNVERIFIED",
    to: "ATTRIBUTED",
    actor: "public-source-adapter",
    method: "protocol deployment record cross-check",
    rationale: "The bridge contract identity is supported by public protocol documentation and a matching deployment record.",
    provenanceUri: "public://protocol-deployment-record",
    createdAt: "2026-09-27T10:00:00Z",
  },
  {
    id: "EVT-DEMO-002",
    evidenceId: "EV-02",
    from: "UNVERIFIED",
    to: "INFERRED",
    actor: "analyst-demo",
    method: "temporal + balance depletion heuristic",
    rationale: "Observed timing and near-total balance movement support a pass-through hypothesis while preserving alternative explanations.",
    createdAt: "2026-09-27T10:02:00Z",
  },
];
