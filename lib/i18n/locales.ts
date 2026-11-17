export type Locale = "en" | "ko";

export const LOCALES: Locale[] = ["en", "ko"];
export const DEFAULT_LOCALE: Locale = "en";
export const LANG_STORAGE_KEY = "nts-workbench-lang";
export const LANG_COOKIE = "nts-lang";
export const LANG_PARAM = "lang";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ko";
}

/**
 * Resolution order: ?lang= URL parameter wins, then the cookie, then the
 * stored localStorage preference, then the default (English). The default
 * stays English so existing visitors see no change until they switch.
 */
export function resolveLocale(input: {
  param?: string | null;
  cookie?: string | null;
  stored?: string | null;
}): Locale {
  if (isLocale(input.param)) return input.param;
  if (isLocale(input.cookie)) return input.cookie;
  if (isLocale(input.stored)) return input.stored;
  return DEFAULT_LOCALE;
}
