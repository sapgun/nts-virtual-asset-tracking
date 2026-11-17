"use client";

import { useRef } from "react";
import { useLanguage } from "@/lib/i18n/provider";

const reportFiles = {
  ko: "/research-legacy.html",
  en: "/research-legacy-en.html",
} as const;

export default function ResearchPage() {
  const { locale, setLocale, t } = useLanguage();
  const frame = useRef<HTMLIFrameElement>(null);
  const src = reportFiles[locale];

  // The report's own masthead toggle navigates the iframe (location.href).
  // Same-origin, so the parent can read the new file name on load and
  // follow the report's language instead of fighting it.
  function syncFromFrame() {
    const path = frame.current?.contentWindow?.location.pathname ?? "";
    const next = path.endsWith("-en.html") ? "en" : "ko";
    if (next !== locale) setLocale(next);
  }

  return (
    <div className="research-frame-page">
      <header className="research-bar">
        <div>
          <span className="eyebrow">{t("research.eyebrow")}</span>
          <strong>{t("research.title")}</strong>
        </div>
        <div className="research-bar-actions">
          <div className="research-lang-toggle" role="group" aria-label={t("research.langAria")}>
            <button
              type="button"
              aria-pressed={locale === "ko"}
              onClick={() => setLocale("ko")}
            >
              KR · 한국어
            </button>
            <button
              type="button"
              aria-pressed={locale === "en"}
              onClick={() => setLocale("en")}
            >
              EN · English
            </button>
          </div>
          <a href={src} target="_blank" rel="noreferrer">{t("research.openStandalone")} ↗</a>
        </div>
      </header>
      <iframe
        ref={frame}
        className="research-frame"
        title="Preserved NTS virtual asset tracking research"
        src={src}
        onLoad={syncFromFrame}
      />
    </div>
  );
}
