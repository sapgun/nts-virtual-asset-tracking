/**
 * Virtual-asset tax estimate — pure calculation, no UI.
 *
 * Current law as of 2026-11-18 (Income Tax Act):
 * - Separate taxation as other income: KRW 2,500,000 annual basic deduction,
 *   20% national tax + 2% local tax = 22% on the amount above the deduction.
 * - First filing: May 2028 for the 2027 effective date; May 2030 if the
 *   proposed 2-year deferral to 2029 is enacted.
 * - Loss carryforward (3 years) is a proposal, not law. It is modelled only
 *   as an optional scenario toggle; the proposed KRW 50,000,000 basic
 *   deduction increase is NOT modelled — it is mentioned in the UI only.
 * - This is an estimate, not tax advice. Tax amounts are rounded to the
 *   nearest won; national + local are rounded separately so the displayed
 *   total always equals their sum.
 */

export const BASIC_DEDUCTION_KRW = 2_500_000;
export const TAX_RATE_NATIONAL = 0.2;
export const TAX_RATE_LOCAL = 0.02;

export type EffectiveYear = 2027 | 2029;

export interface TaxCalcInput {
  /** Annual virtual-asset transfer gains, KRW. Negative values clamp to 0. */
  gainsKrw: number;
  /** Prior loss available to carry forward, KRW. Only used when carryforward is on. */
  carryLossKrw: number;
  /** Proposed 3-year loss carryforward scenario. Default off. */
  carryforward: boolean;
  /** Taxation start year: 2027 = current law, 2029 = proposed deferral. */
  effectiveYear: EffectiveYear;
}

export interface TaxCalcResult {
  taxableBaseKrw: number;
  nationalTaxKrw: number;
  localTaxKrw: number;
  totalTaxKrw: number;
  afterTaxKrw: number;
  /** First filing month, "2028-05" (2027 start) or "2030-05" (2029 start). */
  firstFiling: "2028-05" | "2030-05";
}

export function calcTax(input: TaxCalcInput): TaxCalcResult {
  const gains = Math.max(0, Math.floor(input.gainsKrw) || 0);
  const carried = input.carryforward
    ? Math.max(0, Math.floor(input.carryLossKrw) || 0)
    : 0;
  const taxableBaseKrw = Math.max(0, gains - BASIC_DEDUCTION_KRW - carried);
  const nationalTaxKrw = Math.round(taxableBaseKrw * TAX_RATE_NATIONAL);
  const localTaxKrw = Math.round(taxableBaseKrw * TAX_RATE_LOCAL);
  const totalTaxKrw = nationalTaxKrw + localTaxKrw;
  return {
    taxableBaseKrw,
    nationalTaxKrw,
    localTaxKrw,
    totalTaxKrw,
    afterTaxKrw: gains - totalTaxKrw,
    firstFiling: input.effectiveYear === 2029 ? "2030-05" : "2028-05",
  };
}

/** Exact amount: "27,500,000원" (ko) / "KRW 27,500,000" (en). */
export function formatKrw(amountKrw: number, locale: "ko" | "en"): string {
  const grouped = new Intl.NumberFormat(
    locale === "ko" ? "ko-KR" : "en-US",
  ).format(Math.round(amountKrw));
  return locale === "ko" ? `${grouped}원` : `KRW ${grouped}`;
}

/**
 * Korean compact hint: "3,000만 원", "123.5만 원".
 * One decimal only when the amount is not a whole number of 만원.
 */
export function formatManwon(amountKrw: number): string {
  const manwon = amountKrw / 10_000;
  const text = Number.isInteger(manwon)
    ? manwon.toLocaleString("ko-KR")
    : manwon.toLocaleString("ko-KR", { maximumFractionDigits: 1 });
  return `${text}만 원`;
}
