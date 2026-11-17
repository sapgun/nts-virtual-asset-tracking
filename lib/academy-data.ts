import type { EvidenceState } from "@/lib/domain";

export interface Challenge {
  id: string;
  title: string;
  concept: string;
  prompt: string;
  options: Array<{
    label: string;
    state: EvidenceState;
    correct: boolean;
    explanation: string;
  }>;
}

export const challenges: Challenge[] = [
  {
    id: "wallet-link",
    title: "Address A paid Address B.",
    concept: "Address ≠ person",
    prompt: "What is the strongest statement the evidence currently supports?",
    options: [
      {
        label: "A and B are controlled by the same person.",
        state: "ATTRIBUTED",
        correct: false,
        explanation: "A direct transfer shows a transaction relationship, not common control.",
      },
      {
        label: "A sent value to B on-chain.",
        state: "OBSERVED",
        correct: true,
        explanation: "This is directly reproducible from the ledger and does not overstate identity.",
      },
      {
        label: "A and B probably belong to the same entity.",
        state: "INFERRED",
        correct: false,
        explanation: "That inference needs additional signals and a documented method.",
      },
    ],
  },
  {
    id: "bridge-key",
    title: "A bridge message key matches on both chains.",
    concept: "Deterministic bridge correspondence",
    prompt: "How should the cross-chain relationship be represented?",
    options: [
      {
        label: "Observed protocol correspondence.",
        state: "OBSERVED",
        correct: true,
        explanation: "The matching protocol message identifier supports the bridge-event link itself.",
      },
      {
        label: "Attributed wallet ownership.",
        state: "ATTRIBUTED",
        correct: false,
        explanation: "A message correspondence does not identify the wallet controller.",
      },
      {
        label: "Unverified coincidence.",
        state: "UNVERIFIED",
        correct: false,
        explanation: "A deterministic message identifier is stronger than a time/value-only coincidence.",
      },
    ],
  },
  {
    id: "mixer-candidates",
    title: "Timing and value reduce 120 mixer outputs to 6 candidates.",
    concept: "Candidate reduction ≠ deanonymization",
    prompt: "What is the appropriate evidence state?",
    options: [
      {
        label: "Attributed",
        state: "ATTRIBUTED",
        correct: false,
        explanation: "Candidate reduction does not prove a deposit-withdrawal identity.",
      },
      {
        label: "Inferred",
        state: "INFERRED",
        correct: true,
        explanation: "The analytical signals narrow possibilities but remain heuristic.",
      },
      {
        label: "Observed",
        state: "OBSERVED",
        correct: false,
        explanation: "The candidate link itself is not directly visible on-chain.",
      },
    ],
  },
];
