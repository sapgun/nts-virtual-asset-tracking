import type {
  EvidenceItem,
  GraphEdge,
  GraphNode,
  Hypothesis,
  Investigation,
} from "@/lib/domain";
import type { NormalizedChainTransaction } from "@/lib/adapters/chain-data-adapter";
import { format, t } from "./i18n";
import { DEFAULT_LOCALE, type Locale } from "./i18n/locales";

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
  locale: Locale = DEFAULT_LOCALE,
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
    label: t(locale, "imported.seedLabel"),
    kind: "wallet",
    state: "OBSERVED",
    confidence: 1,
    x: 105,
    y: 210,
    description: t(locale, "imported.seedDescription"),
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
      description: t(locale, "imported.counterpartyDescription"),
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
        label: tx.method || t(locale, "explorer.methodFallback"),
        state: "OBSERVED",
        confidence: 1,
        step: Math.min(index + 1, 4),
      });
    }
  });

  const evidence: EvidenceItem[] = txs.slice(0, 8).map((tx, index) => ({
    id: "PUB-" + String(index + 1).padStart(2, "0"),
    title: format(t(locale, "imported.txTitle"), { hash: shortAddress(tx.hash) }),
    state: "OBSERVED",
    sourceType: "ONCHAIN",
    confidence: 1,
    detail: format(t(locale, "imported.txDetail"), {
      provider: tx.provenance.provider,
      from: tx.from ? shortAddress(tx.from) : t(locale, "imported.unknown"),
      to: tx.to
        ? shortAddress(tx.to)
        : t(locale, "imported.contractCreation"),
    }),
    source: tx.provenance.sourceUrl,
  }));

  const hypothesis: Hypothesis = {
    id: "HYP-IMPORT-01",
    claim: t(locale, "imported.hypothesisClaim"),
    method: t(locale, "imported.hypothesisMethod"),
    confidence: 0,
    state: "UNVERIFIED",
    supportingEvidence: evidence.map((item) => item.id),
    counterEvidence: [
      t(locale, "imported.counter1"),
      t(locale, "imported.counter2"),
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
