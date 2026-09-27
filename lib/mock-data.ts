import type {
  CaseFile,
  EvidenceItem,
  GraphEdge,
  GraphNode,
  Hypothesis,
  Investigation,
} from "@/lib/domain";

export const investigation: Investigation = {
  id: "INV-2026-001",
  title: "Synthetic VASP Attribution",
  seed: "0xA7...19F2",
  chain: "ethereum",
  status: "ACTIVE",
  createdAt: "2026-09-27T10:00:00Z",
  evidenceCompleteness: 63,
};

export const graphNodes: GraphNode[] = [
  {
    id: "seed",
    label: "Seed Wallet",
    kind: "wallet",
    state: "OBSERVED",
    confidence: 1,
    x: 90,
    y: 210,
    description: "Investigation seed loaded from a synthetic public-chain transaction.",
    tags: ["seed", "wallet"],
  },
  {
    id: "pass",
    label: "Pass-through",
    kind: "wallet",
    state: "INFERRED",
    confidence: 0.78,
    x: 300,
    y: 110,
    description: "Short holding time and near-total balance depletion suggest pass-through behavior.",
    tags: ["short-hold", "depletion"],
  },
  {
    id: "bridge",
    label: "Bridge Router",
    kind: "bridge",
    state: "ATTRIBUTED",
    confidence: 0.96,
    x: 300,
    y: 310,
    description: "Publicly attributable bridge contract used as a cross-chain leverage point.",
    tags: ["bridge", "contract"],
  },
  {
    id: "cluster",
    label: "Cluster Candidate",
    kind: "wallet",
    state: "INFERRED",
    confidence: 0.71,
    x: 520,
    y: 210,
    description: "Behavioral overlap indicates a candidate relationship, not common ownership.",
    tags: ["cluster", "hypothesis"],
  },
  {
    id: "exchange",
    label: "VASP Deposit",
    kind: "exchange",
    state: "ATTRIBUTED",
    confidence: 0.93,
    x: 750,
    y: 210,
    description: "Synthetic VASP deposit cluster. Natural-person attribution requires off-chain legal process.",
    tags: ["vasp", "leverage-point"],
  },
];

export const graphEdges: GraphEdge[] = [
  { id: "e1", source: "seed", target: "pass", label: "1.20 ETH", state: "OBSERVED", confidence: 1, step: 1 },
  { id: "e2", source: "seed", target: "bridge", label: "0.80 ETH", state: "OBSERVED", confidence: 1, step: 1 },
  { id: "e3", source: "pass", target: "cluster", label: "1.18 ETH", state: "INFERRED", confidence: 0.78, step: 2 },
  { id: "e4", source: "bridge", target: "cluster", label: "message match", state: "ATTRIBUTED", confidence: 0.96, step: 3 },
  { id: "e5", source: "cluster", target: "exchange", label: "1.94 ETH", state: "OBSERVED", confidence: 1, step: 4 },
];

export const evidence: EvidenceItem[] = [
  {
    id: "EV-01",
    title: "Seed transaction",
    state: "OBSERVED",
    sourceType: "ONCHAIN",
    confidence: 1,
    detail: "Transaction hash, timestamp and transfer values are directly reproducible on-chain.",
  },
  {
    id: "EV-02",
    title: "Pass-through behavior",
    state: "INFERRED",
    sourceType: "ANALYST_NOTE",
    confidence: 0.78,
    detail: "98.7% balance depletion within a short holding window supports a pass-through hypothesis.",
  },
  {
    id: "EV-03",
    title: "Bridge contract attribution",
    state: "ATTRIBUTED",
    sourceType: "PUBLIC_SOURCE",
    confidence: 0.96,
    detail: "Contract identity is attributable from public protocol documentation and known deployment records.",
  },
  {
    id: "EV-04",
    title: "Natural-person identity",
    state: "UNVERIFIED",
    sourceType: "OFFCHAIN",
    confidence: 0.18,
    detail: "No KYC, server, device or legally obtained account records are present in this synthetic dataset.",
  },
];

export const hypotheses: Hypothesis[] = [
  {
    id: "HYP-01",
    claim: "Pass-through and cluster candidate may share control.",
    method: "temporal + depletion + convergence heuristic",
    confidence: 0.71,
    state: "INFERRED",
    supportingEvidence: ["EV-01", "EV-02"],
    counterEvidence: ["No independent off-chain corroboration", "Service routing may produce similar behavior"],
  },
];

export const caseFiles: CaseFile[] = [
  {
    id: "bitcoin-fog",
    title: "Bitcoin Fog",
    category: "Mixer Investigation",
    difficulty: "ADVANCED",
    concepts: ["Mixer", "Peel chain", "Cross-validation", "Court evidence"],
    evidenceState: "ATTRIBUTED",
    summary: "Reconstruct how on-chain tracing was combined with independent evidence and contested methodology.",
  },
  {
    id: "tornado-cash",
    title: "Tornado Cash · Lazarus",
    category: "Sanctions & Mixer",
    difficulty: "INTERMEDIATE",
    concepts: ["Mixer boundary", "Sanctions", "Infrastructure", "Attribution"],
    evidenceState: "ATTRIBUTED",
    summary: "Separate observable mixer boundary flows from operator and actor attribution evidence.",
  },
  {
    id: "chipmixer",
    title: "ChipMixer",
    category: "Infrastructure Takedown",
    difficulty: "INTERMEDIATE",
    concepts: ["Mixer", "Server seizure", "Domain", "Operational evidence"],
    evidenceState: "ATTRIBUTED",
    summary: "Study how blockchain intelligence connects to operational infrastructure and enforcement.",
  },
  {
    id: "silk-road",
    title: "Silk Road",
    category: "Wallet & Server Evidence",
    difficulty: "FOUNDATION",
    concepts: ["Wallet", "Server", "Device", "Private key"],
    evidenceState: "UNVERIFIED",
    summary: "Explore why direct wallet flows become stronger when paired with seized-device evidence.",
  },
];
