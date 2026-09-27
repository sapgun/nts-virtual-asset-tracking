export type CapabilityState = "ACTIVE" | "LIMITED" | "DISABLED";

export interface Capability {
  id: string;
  label: string;
  state: CapabilityState;
  detail: string;
}

export const systemCapabilities: Capability[] = [
  {
    id: "public-chain",
    label: "Public chain observation",
    state: "ACTIVE",
    detail: "Ethereum address transactions through normalized Blockscout adapter.",
  },
  {
    id: "investigation-repository",
    label: "Investigation persistence",
    state: "LIMITED",
    detail: "Ephemeral repository contract is active; durable PostgreSQL storage is not provisioned.",
  },
  {
    id: "copilot",
    label: "Investigator Copilot",
    state: "ACTIVE",
    detail: "Deterministic cited-context adapter; no external model or API key.",
  },
  {
    id: "bridge-lab",
    label: "Bridge correlation",
    state: "ACTIVE",
    detail: "Deterministic message-key and heuristic matching are separated by evidence state.",
  },
  {
    id: "external-ai",
    label: "External AI provider",
    state: "DISABLED",
    detail: "No OpenAI or third-party model connection is enabled.",
  },
  {
    id: "person-attribution",
    label: "Natural-person attribution",
    state: "DISABLED",
    detail: "Public product does not automate natural-person identity attribution.",
  },
];

export function capabilitySummary() {
  return {
    active: systemCapabilities.filter((item) => item.state === "ACTIVE").length,
    limited: systemCapabilities.filter((item) => item.state === "LIMITED").length,
    disabled: systemCapabilities.filter((item) => item.state === "DISABLED").length,
  };
}
