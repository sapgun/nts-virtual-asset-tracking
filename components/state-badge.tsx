import type { EvidenceState } from "@/lib/domain";

export function StateBadge({ state }: { state: EvidenceState }) {
  return <span className={"state-badge state-" + state.toLowerCase()}>{state}</span>;
}
