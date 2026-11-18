"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/provider";
import {
  calcTax,
  formatKrw,
  formatManwon,
  type EffectiveYear,
} from "@/lib/tax-calculator";

function parseKrw(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "").slice(0, 15);
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

export function TaxCalculator() {
  const { locale, t } = useLanguage();
  const [gainsRaw, setGainsRaw] = useState("30000000");
  const [lossRaw, setLossRaw] = useState("");
  const [effectiveYear, setEffectiveYear] = useState<EffectiveYear>(2027);
  const [carryforward, setCarryforward] = useState(false);

  const gains = parseKrw(gainsRaw);
  const loss = parseKrw(lossRaw);
  const result = calcTax({
    gainsKrw: gains,
    carryLossKrw: loss,
    carryforward,
    effectiveYear,
  });
  const gainsHint =
    locale === "ko" ? formatManwon(gains) : formatKrw(gains, "en");
  const money = (amount: number) => formatKrw(amount, locale);

  return (
    <div className="calc-grid">
      <div className="calc-panel">
        <div className="control-group">
          <label htmlFor="calc-gains">{t("calculator.gainsLabel")}</label>
          <input
            id="calc-gains"
            className="calc-input"
            inputMode="numeric"
            autoComplete="off"
            value={gainsRaw}
            placeholder={t("calculator.gainsPlaceholder")}
            onChange={(event) =>
              setGainsRaw(event.target.value.replace(/[^\d]/g, ""))
            }
          />
          <span className="calc-hint">
            {t("calculator.gainsHint", { amount: gainsHint })}
          </span>
        </div>

        <div className="control-group">
          <span className="calc-field-label">
            {t("calculator.scenarioTitle")}
          </span>
          <span className="calc-field-label">
            {t("calculator.effectiveLabel")}
          </span>
          <div className="button-row calc-toggle">
            <button
              type="button"
              aria-pressed={effectiveYear === 2027}
              onClick={() => setEffectiveYear(2027)}
            >
              {t("calculator.effective2027")}
            </button>
            <button
              type="button"
              aria-pressed={effectiveYear === 2029}
              onClick={() => setEffectiveYear(2029)}
            >
              {t("calculator.effective2029")}
            </button>
          </div>
          <span className="calc-field-label">
            {t("calculator.carryforwardLabel")}
          </span>
          <div className="button-row calc-toggle">
            <button
              type="button"
              aria-pressed={!carryforward}
              onClick={() => setCarryforward(false)}
            >
              {t("calculator.carryforwardOff")}
            </button>
            <button
              type="button"
              aria-pressed={carryforward}
              onClick={() => setCarryforward(true)}
            >
              {t("calculator.carryforwardOn")}
            </button>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="calc-loss">{t("calculator.carryLossLabel")}</label>
          <input
            id="calc-loss"
            className="calc-input"
            inputMode="numeric"
            autoComplete="off"
            disabled={!carryforward}
            value={lossRaw}
            onChange={(event) =>
              setLossRaw(event.target.value.replace(/[^\d]/g, ""))
            }
          />
          <span className="calc-hint">
            {carryforward
              ? t("calculator.carryLossHint")
              : t("calculator.carryLossDisabled")}
          </span>
        </div>
      </div>

      <div className="calc-panel">
        <h2>{t("calculator.resultsTitle")}</h2>
        <div>
          <div className="calc-row">
            <span>{t("calculator.baseLabel")}</span>
            <span>{money(result.taxableBaseKrw)}</span>
          </div>
          <div className="calc-row">
            <span>{t("calculator.nationalLabel")}</span>
            <span>{money(result.nationalTaxKrw)}</span>
          </div>
          <div className="calc-row">
            <span>{t("calculator.localLabel")}</span>
            <span>{money(result.localTaxKrw)}</span>
          </div>
          <div className="calc-row total">
            <span>{t("calculator.totalLabel")}</span>
            <span>{money(result.totalTaxKrw)}</span>
          </div>
          <div className="calc-row">
            <span>{t("calculator.afterTaxLabel")}</span>
            <span>{money(result.afterTaxKrw)}</span>
          </div>
          <div className="calc-row">
            <span>{t("calculator.filingLabel")}</span>
            <span>
              {effectiveYear === 2029
                ? t("calculator.filing2030")
                : t("calculator.filing2028")}
            </span>
          </div>
        </div>
        <p className="calc-note">{t("calculator.disclaimer")}</p>
        <p className="calc-note">{t("calculator.note50m")}</p>
      </div>
    </div>
  );
}
