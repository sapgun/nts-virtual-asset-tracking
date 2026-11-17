"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/provider";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">404</span>
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.body")}</p>
        <p>
          <Link href="/">{t("notFound.back")} ↗</Link>
        </p>
      </header>
    </div>
  );
}
