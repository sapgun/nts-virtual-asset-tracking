"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { StateBadge } from "@/components/state-badge";
import {
  PUBLIC_IMPORT_STORAGE_KEY,
  type ImportedInvestigationDraft,
} from "@/lib/imported-investigation";
import { useLanguage } from "@/lib/i18n/provider";

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
  const { locale, t } = useLanguage();
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
      setError(t("explorer.errorInvalidAddress"));
      setState("error");
      return;
    }

    setState("loading");
    setError("");

    try {
      const response = await fetch(
        "/api/chain/ethereum/addresses/" +
          encodeURIComponent(normalized) +
          "/transactions?lang=" +
          locale,
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || t("explorer.errorLoad"));
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
      setError(caught instanceof Error ? caught.message : t("explorer.errorGeneric"));
      setState("error");
    }
  }


  function promoteToInvestigation() {
    if (!loadedAddress || transactions.length === 0) return;

    const draft: ImportedInvestigationDraft = {
      id: "INV-PUBLIC-" + Date.now().toString(36).toUpperCase(),
      title: t("explorer.draftTitle"),
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
          <span className="eyebrow">{t("explorer.searchEyebrow")}</span>
          <h2>{t("explorer.searchTitle")}</h2>
        </div>
        <div className="address-search-row">
          <input
            aria-label={t("explorer.inputAria")}
            placeholder="0x..."
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            spellCheck={false}
          />
          <button type="submit" disabled={state === "loading"}>
            {state === "loading" ? t("explorer.loading") : t("explorer.load")}
          </button>
        </div>
        <p>{t("explorer.note")}</p>
      </form>

      {state === "error" && (
        <div className="explorer-message error">{error}</div>
      )}

      {state === "done" && (
        <section className="transaction-results">
          <div className="results-head">
            <div>
              <span className="eyebrow">{t("explorer.resultsEyebrow")}</span>
              <strong>{t("explorer.transactionsLoaded", { count: transactions.length })}</strong>
            </div>
            <div className="results-actions">
              <StateBadge state="OBSERVED" />
              {transactions.length > 0 && (
                <button onClick={promoteToInvestigation}>
                  {t("explorer.promote")} ↗
                </button>
              )}
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="explorer-message">{t("explorer.empty")}</div>
          ) : (
            <div className="tx-list">
              {transactions.map((tx) => (
                <article key={tx.hash}>
                  <div className="tx-primary">
                    <b>{short(tx.hash)}</b>
                    <span>{tx.method || t("explorer.methodFallback")}</span>
                  </div>
                  <div>
                    <small>{t("explorer.colFrom")}</small>
                    <span title={tx.from || undefined}>{short(tx.from)}</span>
                  </div>
                  <div>
                    <small>{t("explorer.colTo")}</small>
                    <span title={tx.to || undefined}>{short(tx.to)}</span>
                  </div>
                  <div>
                    <small>{t("explorer.colValue")}</small>
                    <span>{ethFromWei(tx.valueWei)}</span>
                  </div>
                  <div>
                    <small>{t("explorer.colBlock")}</small>
                    <span>{tx.blockNumber ?? "—"}</span>
                  </div>
                  <div>
                    <small>{t("explorer.colTime")}</small>
                    <span>{tx.timestamp ? new Date(tx.timestamp).toLocaleString(locale === "ko" ? "ko-KR" : "en-US") : "—"}</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {sourceUrl && (
            <p className="provenance-note">
              {t("explorer.provenance")} <a href={sourceUrl} target="_blank" rel="noreferrer">{t("explorer.provenanceSource")} ↗</a>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
