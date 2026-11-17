import { en } from "./en";
import { ko, contentKo } from "./ko";
import type { Locale } from "./locales";

export type { Locale } from "./locales";
export type Dict = typeof en;

export const dictionaries: Record<Locale, Dict> = { en, ko };

function getByPath(dict: unknown, path: string): unknown {
  let current: unknown = dict;
  for (const part of path.split(".")) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/**
 * Structured UI string lookup by dot path, e.g. t("ko", "shell.nav.cases.label").
 * Falls back to English, then to the key itself so a missing entry never
 * renders blank.
 */
export function t(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const value =
    getByPath(dictionaries[locale], key) ?? getByPath(dictionaries.en, key);
  if (typeof value !== "string") return key;
  return format(value, vars);
}

/**
 * Content-string lookup: data modules keep English as the source language,
 * so the Korean map is keyed by the exact English string. Falls back to the
 * English string itself when no translation exists.
 */
export function tc(locale: Locale, text: string): string {
  if (locale !== "ko") return text;
  return contentKo[text] ?? text;
}

/** Node kind labels (wallet / exchange / bridge / mixer / contract). */
export function kindLabel(locale: Locale, kind: string): string {
  const key =
    kind === "wallet"
      ? "inspector.kindWallet"
      : kind === "exchange"
        ? "inspector.kindExchange"
        : kind === "bridge"
          ? "inspector.kindBridge"
          : kind === "mixer"
            ? "inspector.kindMixer"
            : "inspector.kindContract";
  return t(locale, key);
}
