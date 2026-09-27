import type { EvidenceState } from "@/lib/domain";

export interface BridgeObservation {
  id: string;
  protocol: string;
  chain: string;
  direction: "SOURCE" | "DESTINATION";
  txHash: string;
  timestampMs: number;
  asset: string;
  amountBaseUnits: string;
  messageKey?: string;
  account?: string;
}

export interface BridgeMatchResult {
  state: Extract<EvidenceState, "OBSERVED" | "INFERRED" | "UNVERIFIED">;
  mode: "DETERMINISTIC_KEY" | "HEURISTIC" | "NO_MATCH";
  confidence: number;
  reasons: string[];
  limitations: string[];
}

function differenceBps(a: string, b: string) {
  try {
    const av = BigInt(a);
    const bv = BigInt(b);
    const high = av > bv ? av : bv;
    const diff = av > bv ? av - bv : bv - av;

    if (high === 0n) return 0;

    return Number((diff * 10000n) / high);
  } catch {
    return 10000;
  }
}

export function matchBridgeObservations(
  source: BridgeObservation,
  destination: BridgeObservation,
): BridgeMatchResult {
  if (
    source.protocol === destination.protocol &&
    source.messageKey &&
    destination.messageKey &&
    source.messageKey === destination.messageKey
  ) {
    return {
      state: "OBSERVED",
      mode: "DETERMINISTIC_KEY",
      confidence: 1,
      reasons: [
        "Both observations expose the same protocol message key.",
        "Source and destination observations belong to the same protocol.",
        "The link is represented as a protocol-event correspondence, not a person attribution.",
      ],
      limitations: [
        "A deterministic bridge-message link does not establish who controlled either wallet.",
        "Entity attribution still requires a separate evidence transition.",
      ],
    };
  }

  let score = 0;
  const reasons: string[] = [];

  if (source.protocol === destination.protocol) {
    score += 0.12;
    reasons.push("same protocol");
  }

  if (source.asset === destination.asset) {
    score += 0.24;
    reasons.push("same asset");
  }

  const amountBps = differenceBps(
    source.amountBaseUnits,
    destination.amountBaseUnits,
  );

  if (amountBps <= 10) {
    score += 0.28;
    reasons.push("amount difference <= 0.10%");
  } else if (amountBps <= 100) {
    score += 0.18;
    reasons.push("amount difference <= 1%");
  }

  const timeDeltaMinutes =
    Math.abs(source.timestampMs - destination.timestampMs) / 60000;

  if (timeDeltaMinutes <= 10) {
    score += 0.26;
    reasons.push("time delta <= 10 minutes");
  } else if (timeDeltaMinutes <= 60) {
    score += 0.14;
    reasons.push("time delta <= 60 minutes");
  }

  if (
    source.account &&
    destination.account &&
    source.account.toLowerCase() === destination.account.toLowerCase()
  ) {
    score += 0.1;
    reasons.push("same public account identifier");
  }

  const confidence = Math.min(0.85, Number(score.toFixed(2)));

  if (confidence < 0.35) {
    return {
      state: "UNVERIFIED",
      mode: "NO_MATCH",
      confidence,
      reasons:
        reasons.length > 0
          ? reasons
          : ["No strong deterministic or heuristic signals overlap."],
      limitations: [
        "No protocol message key is available.",
        "Time and value similarity alone are insufficient to assert a bridge correspondence.",
      ],
    };
  }

  return {
    state: "INFERRED",
    mode: "HEURISTIC",
    confidence,
    reasons,
    limitations: [
      "No deterministic protocol message key was matched.",
      "Time/value correlation can collide across unrelated users and routes.",
      "This result must not be promoted to ATTRIBUTED without independent provenance.",
    ],
  };
}
