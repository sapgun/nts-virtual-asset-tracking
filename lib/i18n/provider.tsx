"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LANG_COOKIE,
  LANG_PARAM,
  LANG_STORAGE_KEY,
  isLocale,
  resolveLocale,
  type Locale,
} from "./locales";
import { dictionaries, t as translate, tc as translateContent } from "./index";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Structured UI string by dot path, e.g. t("shell.nav.cases.label", { count: 3 }) */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Data-content string (English source) translated for the current locale. */
  tc: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persistStorage(locale: Locale) {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, locale);
  } catch {
    /* storage unavailable (private mode) — cookie still carries it */
  }
  document.cookie = `${LANG_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = locale;
}

/** Write ?lang= so the current page URL is shareable in this language.
 * Only called on an explicit user switch — the mount resolution below
 * must not dirty the URL for visitors who never switched. */
function persistUrlParam(locale: Locale) {
  const url = new URL(window.location.href);
  if (url.searchParams.get(LANG_PARAM) !== locale) {
    url.searchParams.set(LANG_PARAM, locale);
    window.history.replaceState(null, "", url.toString());
  }
}

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState((current) => {
      if (current === next) return current;
      return next;
    });
    persistUrlParam(next);
  }, []);

  // First paint uses the server-provided locale (cookie). After mount,
  // ?lang= wins over the cookie, then the stored preference.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get(LANG_PARAM);
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      stored = null;
    }
    const resolved = resolveLocale({
      param,
      cookie: initialLocale,
      stored,
    });
    if (resolved !== locale) setLocaleState(resolved);
    // Only the mount pass resolves from URL / storage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist every locale change (cookie + localStorage + <html lang>).
  // The document title must follow too: generateMetadata only runs on the
  // server, so without this a client-side toggle leaves a stale <title>
  // until the next navigation.
  useEffect(() => {
    persistStorage(locale);
    document.title = dictionaries[locale].meta.title;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
      tc: (text) => translateContent(locale, text),
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Rendered outside the provider (e.g. standalone tests): fall back to
    // English instead of crashing.
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key, vars) => translate(DEFAULT_LOCALE, key, vars),
      tc: (text) => translateContent(DEFAULT_LOCALE, text),
    };
  }
  return context;
}

export function isLocaleValue(value: unknown): value is Locale {
  return isLocale(value);
}
