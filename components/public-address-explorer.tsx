"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { StateBadge } from "@/components/state-badge";
import {
  PUBLIC_IMPORT_STORAGE_KEY,
  type ImportedInvestigationDraft,
} from "@/lib/imported-investigation";

interface PublicTx {
  hash: string;
  blockNumber: number | null;
  timestamp: string | null;
  from: string | null;
  to: string | null;
  valueWei: string | null;
  method: string | null;
  status: string | null;
  provenance: {
    provider: string;
    sourceUrl: string;
    observedAt: string;
  };
}

function short(value: string | null) {
  if (!value) return "—";
  return value.length > 18 ? value.slice(0, 10) + "…" + value.slice(-6) : value;
}

function ethFromWei(value: string | null) {
  if (!value || !/^\d+$/.test(value)) return "—";
  const padded = value.padStart(19, "0");
  const whole = padded.slice(0, -18) || "0";
  const decimals = padded.slice(-18, -12).replace(/0+$/, "");
  return decimals ? whole + "." + decimals + " ETH" : whole + " ETH";
}

export function PublicAddressExplorer() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loadedAddress, setLoadedAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<PublicTx[]>([]);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = address.trim();

    if (!/^0x[a-fA-F0-9]{40}$/.test(normalized)) {
      setError("Enter a valid 0x-prefixed Ethereum address.");
      setState("error");
      return;
    }

    setState("loading");
    setError("");

    try {
      const response = await fetch(
        "/api/chain/ethereum/addresses/" +
          encodeURIComponent(normalized) +
          "/transactions",
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to load public transactions.");
      }

      const items = (payload?.data?.items || []) as PublicTx[];
      setTransactions(items.slice(0, 25));
      setLoadedAddress(normalized);
      setSourceUrl(items[0]?.provenance?.sourceUrl || null);
      setState("done");
    } catch (caught) {
      setTransactions([]);
      setLoadedAddress(null);
      setSourceUrl(null);
      setError(caught instanceof Error ? caught.message : "Request failed.");
      setState("error");
    }
  }


  function promoteToInvestigation() {
    if (!loadedAddress || transactions.length === 0) return;

    const draft: ImportedInvestigationDraft = {
      id: "INV-PUBLIC-" + Date.now().toString(36).toUpperCase(),
      title: "Public Ethereum Observation",
      seed: loadedAddress,
      chain: "ethereum",
      createdAt: new Date().toISOString(),
      source: "public-explorer",
      transactions,
    };

    sessionStorage.setItem(
      PUBLIC_IMPORT_STORAGE_KEY,
      JSON.stringify(draft),
    );

    router.push("/investigations?import=public");
  }

  return (
    <div className="public-explorer">
      <form className="address-search" onSubmit={submit}>
        <div>
          <span className="eyebrow">PUBLIC CHAIN OBSERVATION</span>
          <h2>Ethereum address</h2>
        </div>
        <div className="address-search-row">
          <input
            aria-label="Ethereum address"
            placeholder="0x..."
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            spellCheck={false}
          />
          <button type="submit" disabled={state === "loading"}>
            {state === "loading" ? "Loading…" : "Load transactions"}
          </button>
        </div>
        <p>
          This view reads public ledger data only. Transaction proximity does not establish common ownership or a natural-person identity.
        </p>
      </form>

      {state === "error" && (
        <div className="explorer-message error">{error}</div>
      )}

      {state === "done" && (
        <section className="transaction-results">
          <div className="results-head">
            <div>
              <span className="eyebrow">NORMALIZED TRANSACTIONS</span>
              <strong>{transactions.length} transactions loaded</strong>
            </div>
            <div className="results-actions">
              <StateBadge state="OBSERVED" />
              {transactions.length > 0 && (
                <button onClick={promoteToInvestigation}>
                  Promote to investigation ↗
                </button>
              )}
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="explorer-message">No transactions returned for this address.</div>
          ) : (
            <div className="tx-list">
              {transactions.map((tx) => (
                <article key={tx.hash}>
                  <div className="tx-primary">
                    <b>{short(tx.hash)}</b>
                    <span>{tx.method || "transaction"}</span>
                  </div>
                  <div>
                    <small>FROM</small>
                    <span title={tx.from || undefined}>{short(tx.from)}</span>
                  </div>
                  <div>
                    <small>TO</small>
                    <span title={tx.to || undefined}>{short(tx.to)}</span>
                  </div>
                  <div>
                    <small>VALUE</small>
                    <span>{ethFromWei(tx.valueWei)}</span>
                  </div>
                  <div>
                    <small>BLOCK</small>
                    <span>{tx.blockNumber ?? "—"}</span>
                  </div>
                  <div>
                    <small>TIME</small>
                    <span>{tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "—"}</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {sourceUrl && (
            <p className="provenance-note">
              Provider provenance: <a href={sourceUrl} target="_blank" rel="noreferrer">Blockscout API source ↗</a>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
