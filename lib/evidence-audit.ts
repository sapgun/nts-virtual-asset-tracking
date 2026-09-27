import type { EvidenceState } from "@/lib/domain";

export interface EvidenceTransitionInput {
  evidenceId: string;
  from: EvidenceState;
  to: EvidenceState;
  actor: string;
  method: string;
  rationale: string;
  provenanceUri?: string;
}

export interface EvidenceTransitionEvent extends EvidenceTransitionInput {
  id: string;
  createdAt: string;
}

export interface TransitionValidation {
  ok: boolean;
  errors: string[];
}

export function validateEvidenceTransition(
  input: EvidenceTransitionInput,
): TransitionValidation {
  const errors: string[] = [];

  if (input.from === input.to) {
    errors.push("from and to states must differ");
  }

  if (!input.actor.trim()) {
    errors.push("actor is required");
  }

  if (!input.method.trim()) {
    errors.push("method is required");
  }

  if (input.rationale.trim().length < 12) {
    errors.push("rationale must explain the evidence change");
  }

  if (input.to === "ATTRIBUTED" && !input.provenanceUri?.trim()) {
    errors.push("ATTRIBUTED transitions require a provenanceUri");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function createEvidenceTransition(
  input: EvidenceTransitionInput,
): EvidenceTransitionEvent {
  const validation = validateEvidenceTransition(input);

  if (!validation.ok) {
    throw new Error(validation.errors.join("; "));
  }

  return {
    ...input,
    id: "EVT-" + crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}
