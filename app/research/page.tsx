"use client";

import { useState } from "react";

type ReportLang = "ko" | "en";

const reportFiles: Record<ReportLang, string> = {
  ko: "/research-legacy.html",
  en: "/research-legacy-en.html",
};

export default function ResearchPage() {
  const [lang, setLang] = useState<ReportLang>("ko");
  const src = reportFiles[lang];
  return (
    <div className="research-frame-page">
      <header className="research-bar">
        <div>
          <span className="eyebrow">PRESERVED SOURCE</span>
          <strong>Original technical intelligence brief · KR / EN</strong>
        </div>
        <div className="research-bar-actions">
          <div className="research-lang-toggle" role="group" aria-label="Report language">
            <button
              type="button"
              aria-pressed={lang === "ko"}
              onClick={() => setLang("ko")}
            >
              KR · 한국어
            </button>
            <button
              type="button"
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
            >
              EN · English
            </button>
          </div>
          <a href={src} target="_blank" rel="noreferrer">Open standalone ↗</a>
        </div>
      </header>
      <iframe
        className="research-frame"
        title="Preserved NTS virtual asset tracking research"
        src={src}
      />
    </div>
  );
}
