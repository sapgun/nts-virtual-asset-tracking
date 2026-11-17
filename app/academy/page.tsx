"use client";

import { AcademyChallenge } from "@/components/academy-challenge";
import { useLanguage } from "@/lib/i18n/provider";

const trackKeys = ["foundation", "tracing", "privacy", "crosschain"] as const;

export default function AcademyPage() {
  const { t } = useLanguage();
  return (
    <div className="content-page academy-page-v3">
      <header className="page-header academy-header-v3">
        <span className="eyebrow">{t("academy.eyebrow")}</span>
        <h1>{t("academy.title")}</h1>
        <p>{t("academy.intro")}</p>
      </header>

      <AcademyChallenge />

      <section className="academy-track-strip">
        {trackKeys.map((key, index) => (
          <article key={key}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{t(`academy.tracks.${key}.title`)}</strong>
              <p>{t(`academy.tracks.${key}.body`)}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
