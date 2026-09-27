export const EVIDENCE_PACKET_SCHEMA = "nts-intel/evidence-packet@1";

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(
      value as Record<string, unknown>,
    ).sort(([a], [b]) => a.localeCompare(b));

    return Object.fromEntries(
      entries.map(([key, item]) => [
        key,
        stableValue(item),
      ]),
    );
  }

  return value;
}

export function stableStringify(value: unknown) {
  return JSON.stringify(stableValue(value));
}

export async function sha256Hex(value: unknown) {
  const data = new TextEncoder().encode(
    stableStringify(value),
  );
  const digest = await crypto.subtle.digest(
    "SHA-256",
    data,
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function buildEvidencePacket<T extends object>(
  payload: T,
) {
  const manifest = {
    schema: EVIDENCE_PACKET_SCHEMA,
    hashAlgorithm: "SHA-256",
    generatedAt: new Date().toISOString(),
  };

  const canonicalPayload = {
    manifest,
    payload,
  };

  const contentHash = await sha256Hex(
    canonicalPayload,
  );

  return {
    ...canonicalPayload,
    integrity: {
      contentHash,
      signed: false,
      note:
        "Hash provides tamper detection for this exported packet. It is not a digital signature or legal certification.",
    },
  };
}
