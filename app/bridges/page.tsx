"use client";

import { BridgeMatchingLab } from "@/components/bridge-matching-lab";
import { useLanguage } from "@/lib/i18n/provider";

export default function BridgesPage() {
  const { t } = useLanguage();
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">{t("bridge.eyebrow")}</span>
        <h1>{t("bridge.title")}</h1>
        <p>{t("bridge.intro")}</p>
      </header>

      <BridgeMatchingLab />
    </div>
  );
}
