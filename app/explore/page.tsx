"use client";

import { PublicAddressExplorer } from "@/components/public-address-explorer";
import { useLanguage } from "@/lib/i18n/provider";

export default function ExplorePage() {
  const { t } = useLanguage();
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">{t("explorer.eyebrow")}</span>
        <h1>{t("explorer.title")}</h1>
        <p>{t("explorer.intro")}</p>
      </header>
      <PublicAddressExplorer />
    </div>
  );
}
