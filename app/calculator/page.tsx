"use client";

import { TaxCalculator } from "@/components/tax-calculator";
import { useLanguage } from "@/lib/i18n/provider";

export default function CalculatorPage() {
  const { t } = useLanguage();
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">{t("calculator.eyebrow")}</span>
        <h1>{t("calculator.title")}</h1>
        <p>{t("calculator.intro")}</p>
      </header>

      <TaxCalculator />
    </div>
  );
}
