import type {
  EvidenceItem,
  GraphEdge,
  GraphNode,
  Hypothesis,
  Investigation,
} from "@/lib/domain";
import type { NormalizedChainTransaction } from "@/lib/adapters/chain-data-adapter";

export const PUBLIC_IMPORT_STORAGE_KEY = "nts-intel:public-import:v1";

export interface ImportedInvestigationDraft {
  id: string;
  title: string;
  seed: string;
  chain: "ethereum";
  createdAt: string;
  source: "public-explorer";
  transactions: NormalizedChainTransaction[];
}

export interface ImportedInvestigationModel {
  investigation: Investigation;
  nodes: GraphNode[];
  edges: GraphEdge[];
  evidence: EvidenceItem[];
  hypothesis: Hypothesis;
}

function shortAddress(value: string) {
  return value.slice(0, 8) + "…" + value.slice(-5);
}

export function buildImportedInvestigation(
  draft: ImportedInvestigationDraft,
): ImportedInvestigationModel {
  const seed = draft.seed.toLowerCase();
  const txs = draft.transactions.slice(0, 8);
  const counterparties: string[] = [];

  for (const tx of txs) {
    const from = tx.from?.toLowerCase() ?? null;
    const to = tx.to?.toLowerCase() ?? null;
    const counterparty =
      from === seed ? to :
      to === seed ? from :
      to ?? from;

    if (counterparty && !counterparties.includes(counterparty)) {
      counterparties.push(counterparty);
    }
  }

  const seedNode: GraphNode = {
    id: "import-seed",
    label: "Imported Seed",
    kind: "wallet",
    state: "OBSERVED",
    confidence: 1,
    x: 105,
    y: 210,
    description:
      "Public Ethereum address imported from Graph Explorer. Address ownership is not inferred.",
    tags: ["public-data", "seed"],
  };

  const nodes: GraphNode[] = [seedNode];
  const edges: GraphEdge[] = [];

  counterparties.slice(0, 6).forEach((address, index) => {
    const column = index < 3 ? 330 : 590;
    const row = index % 3;
    const y = 90 + row * 120;
    const id = "cp-" + index;

    nodes.push({
      id,
      label: shortAddress(address),
      kind: "wallet",
      state: "OBSERVED",
      confidence: 1,
      x: column,
      y,
      description:
        "Counterparty address directly observed in the imported public transaction set. No entity or person attribution is attached.",
      tags: ["counterparty", "public-data"],
    });

    const tx = txs.find((item) => {
      const from = item.from?.toLowerCase() ?? "";
      const to = item.to?.toLowerCase() ?? "";
      return from === address || to === address;
    });

    if (tx) {
      const fromSeed = tx.from?.toLowerCase() === seed;
      edges.push({
        id: "import-edge-" + index,
        source: fromSeed ? "import-seed" : id,
        target: fromSeed ? id : "import-seed",
        label: tx.method || "transaction",
        state: "OBSERVED",
        confidence: 1,
        step: Math.min(index + 1, 4),
      });
    }
  });

  const evidence: EvidenceItem[] = txs.slice(0, 8).map((tx, index) => ({
    id: "PUB-" + String(index + 1).padStart(2, "0"),
    title: "Observed transaction " + shortAddress(tx.hash),
    state: "OBSERVED",
    sourceType: "ONCHAIN",
    confidence: 1,
    detail:
      "Public-chain transaction normalized by " +
      tx.provenance.provider +
      ". From " +
      (tx.from ? shortAddress(tx.from) : "unknown") +
      " to " +
      (tx.to ? shortAddress(tx.to) : "contract creation/unknown") +
      ".",
    source: tx.provenance.sourceUrl,
  }));

  const hypothesis: Hypothesis = {
    id: "HYP-IMPORT-01",
    claim: "No ownership or entity hypothesis has been created for this imported dataset.",
    method: "observation-only import",
    confidence: 0,
    state: "UNVERIFIED",
    supportingEvidence: evidence.map((item) => item.id),
    counterEvidence: [
      "Counterparty relationships may represent services, contracts, routers, or unrelated controllers.",
      "Public transactions alone do not establish natural-person identity.",
    ],
  };

  return {
    investigation: {
      id: draft.id,
      title: draft.title,
      seed: draft.seed,
      chain: "ethereum",
      status: "ACTIVE",
      createdAt: draft.createdAt,
      evidenceCompleteness: Math.min(45, 12 + evidence.length * 4),
    },
    nodes,
    edges,
    evidence,
    hypothesis,
  };
}
