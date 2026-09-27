import type { EvidenceState } from "@/lib/domain";

export interface CaseStep {
  id: string;
  phase: string;
  title: string;
  state: EvidenceState;
  summary: string;
  observation: string;
  limitation: string;
  artifacts: string[];
  confidence: number;
}

export interface CasePlayback {
  id: string;
  title: string;
  subtitle: string;
  sourceBoundary: string;
  steps: CaseStep[];
}

export const casePlaybacks: Record<string, CasePlayback> = {
  "bitcoin-fog": {
    id: "bitcoin-fog",
    title: "Bitcoin Fog",
    subtitle: "Mixer tracing, cross-validation and evidence limits",
    sourceBoundary: "Public-case reconstruction. Methodological claims remain separated from natural-person attribution.",
    steps: [
      {
        id: "bf-01",
        phase: "SEED",
        title: "Anchor the known transactions",
        state: "OBSERVED",
        summary: "Start from transactions and addresses already identified in the public case record.",
        observation: "Transaction existence, amounts, timestamps and direct blockchain relationships can be reproduced from the public ledger.",
        limitation: "A transaction path does not by itself establish who controlled the wallet.",
        artifacts: ["transaction hash", "block time", "input/output set"],
        confidence: 1,
      },
      {
        id: "bf-02",
        phase: "TRACE",
        title: "Construct candidate flows",
        state: "INFERRED",
        summary: "Apply tracing methodology to follow candidate paths through mixer-related activity.",
        observation: "A candidate flow can be scored from transaction structure, temporal behavior and other reproducible signals.",
        limitation: "Mixer-related heuristics may produce competing explanations and require explicit false-positive analysis.",
        artifacts: ["candidate path", "heuristic result", "alternative path"],
        confidence: 0.74,
      },
      {
        id: "bf-03",
        phase: "CROSS-VALIDATE",
        title: "Compare independent analysis",
        state: "INFERRED",
        summary: "Compare tool outputs and manually inspect a subset instead of treating one system as authoritative.",
        observation: "Agreement across independent methods increases confidence in a transaction-level interpretation.",
        limitation: "Cross-tool agreement is not the same as independent off-chain identity evidence.",
        artifacts: ["tool A result", "tool B result", "manual check"],
        confidence: 0.82,
      },
      {
        id: "bf-04",
        phase: "CORROBORATE",
        title: "Combine non-chain evidence",
        state: "ATTRIBUTED",
        summary: "Evaluate blockchain analysis together with other evidence described in the public case record.",
        observation: "Attribution becomes materially stronger when transaction analysis is corroborated by independent operational or device evidence.",
        limitation: "This reconstruction does not expose private case data and does not recreate the evidentiary record in full.",
        artifacts: ["public court record", "device/operational evidence class", "corroboration map"],
        confidence: 0.9,
      },
      {
        id: "bf-05",
        phase: "REVIEW",
        title: "Preserve methodological dispute",
        state: "UNVERIFIED",
        summary: "Keep contested assumptions and known methodological criticisms visible in the final case view.",
        observation: "A defensible investigation records both supporting evidence and the limits of the tracing methodology.",
        limitation: "The workbench does not convert a disputed heuristic into a verified identity claim.",
        artifacts: ["counter-evidence", "method caveat", "review note"],
        confidence: 0.58,
      },
    ],
  },
  "tornado-cash": {
    id: "tornado-cash",
    title: "Tornado Cash · Lazarus",
    subtitle: "Boundary observation versus actor attribution",
    sourceBoundary: "Public sanctions and government-source reconstruction. Mixer internals are not presented as directly observable links.",
    steps: [
      {
        id: "tc-01",
        phase: "BOUNDARY",
        title: "Observe the deposit boundary",
        state: "OBSERVED",
        summary: "Record the public-chain deposit event and the address that reached the mixer boundary.",
        observation: "Deposit address, transaction, time and amount are directly observable.",
        limitation: "The encrypted/private mixer relationship inside the anonymity set is not reconstructed as a direct edge.",
        artifacts: ["deposit tx", "mixer contract", "timestamp"],
        confidence: 1,
      },
      {
        id: "tc-02",
        phase: "CANDIDATES",
        title: "Model withdrawal candidates",
        state: "INFERRED",
        summary: "Represent possible post-mixer candidates without claiming a deterministic deposit-withdrawal link.",
        observation: "Timing, value and downstream behavior can narrow an analytical candidate set.",
        limitation: "Candidate reduction is not cryptographic deanonymization.",
        artifacts: ["candidate set", "timing signal", "value signal"],
        confidence: 0.66,
      },
      {
        id: "tc-03",
        phase: "EXPOSURE",
        title: "Follow observable downstream flow",
        state: "OBSERVED",
        summary: "Once a candidate leaves the mixer boundary, subsequent public-chain transfers can again be directly observed.",
        observation: "Post-withdrawal transaction paths are reproducible on-chain.",
        limitation: "The identity of the controller remains separate from the transaction path.",
        artifacts: ["withdrawal-side tx", "downstream transfer", "destination"],
        confidence: 1,
      },
      {
        id: "tc-04",
        phase: "ATTRIBUTION",
        title: "Attach external attribution evidence",
        state: "ATTRIBUTED",
        summary: "Add public sanctions designations and other government-source attribution as a distinct evidence class.",
        observation: "External attribution can identify known entities or designated actors independently of mixer heuristics.",
        limitation: "The workbench shows the attribution source; it does not infer motive or identity beyond the cited public material.",
        artifacts: ["designation source", "public attribution", "entity link"],
        confidence: 0.94,
      },
    ],
  },
  "chipmixer": {
    id: "chipmixer",
    title: "ChipMixer",
    subtitle: "Blockchain intelligence to operational infrastructure",
    sourceBoundary: "Public government-source reconstruction focused on the transition from chain analysis to infrastructure evidence.",
    steps: [
      {
        id: "cm-01",
        phase: "FLOW",
        title: "Map service-related flows",
        state: "OBSERVED",
        summary: "Reconstruct public-chain flows associated with the service and known counterparties.",
        observation: "Transactions and service-facing addresses can be represented as observed graph objects.",
        limitation: "Service-level attribution does not automatically identify a human operator.",
        artifacts: ["service-facing address", "flow graph", "counterparty"],
        confidence: 1,
      },
      {
        id: "cm-02",
        phase: "ENTITY",
        title: "Separate service from operator",
        state: "INFERRED",
        summary: "Model operational relationships as hypotheses until external evidence supports attribution.",
        observation: "Infrastructure reuse and operational patterns can motivate an investigative hypothesis.",
        limitation: "Operational similarity alone is insufficient for natural-person attribution.",
        artifacts: ["infrastructure hypothesis", "domain relationship", "account relationship"],
        confidence: 0.7,
      },
      {
        id: "cm-03",
        phase: "SEIZURE",
        title: "Corroborate with seized infrastructure",
        state: "ATTRIBUTED",
        summary: "Represent public reports of domain, account and backend-server seizure as independent evidence.",
        observation: "Operational infrastructure evidence can connect a service graph to a legal enforcement action.",
        limitation: "Private forensic contents remain outside this public reconstruction.",
        artifacts: ["domain seizure", "backend server", "public enforcement record"],
        confidence: 0.93,
      },
    ],
  },
  "silk-road": {
    id: "silk-road",
    title: "Silk Road",
    subtitle: "Wallet flow strengthened by server and device evidence",
    sourceBoundary: "Educational reconstruction using the evidence categories described in the preserved research. Some details remain source-limited.",
    steps: [
      {
        id: "sr-01",
        phase: "SERVER",
        title: "Anchor server-side wallet material",
        state: "ATTRIBUTED",
        summary: "Treat wallet information recovered from operational infrastructure as a separate attribution source.",
        observation: "Server-side wallet artifacts can connect infrastructure to identifiable blockchain addresses.",
        limitation: "This public reconstruction does not contain the original forensic image.",
        artifacts: ["server wallet record", "address list", "public case source"],
        confidence: 0.86,
      },
      {
        id: "sr-02",
        phase: "CHAIN",
        title: "Reproduce direct wallet flow",
        state: "OBSERVED",
        summary: "Compare server-associated addresses with public blockchain transfers.",
        observation: "Direct address-to-address movement can be independently reproduced from the ledger.",
        limitation: "Control of an address still requires corroboration beyond the ledger.",
        artifacts: ["wallet address", "direct transaction", "block record"],
        confidence: 1,
      },
      {
        id: "sr-03",
        phase: "DEVICE",
        title: "Corroborate with seized-device evidence",
        state: "ATTRIBUTED",
        summary: "Represent device-held wallet evidence as the attribution layer that strengthens the chain relationship.",
        observation: "Possession of relevant wallet material on a seized device is a materially different evidence class from graph proximity.",
        limitation: "The app does not reproduce or infer private keys.",
        artifacts: ["device evidence class", "wallet association", "cross-check"],
        confidence: 0.92,
      },
      {
        id: "sr-04",
        phase: "BOUNDARY",
        title: "Mark remaining source limitations",
        state: "UNVERIFIED",
        summary: "Keep source-limited details explicitly unverified instead of filling them with assumptions.",
        observation: "The reconstruction remains useful even when some legal-record detail is unavailable.",
        limitation: "Missing primary-source material should remain missing, not be completed by inference.",
        artifacts: ["source gap", "verification note", "open question"],
        confidence: 0.42,
      },
    ],
  },
};

export function getCasePlayback(id: string) {
  return casePlaybacks[id] ?? null;
}
