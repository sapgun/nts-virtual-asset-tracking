"use client";

import Link from "next/link";
import { StateBadge } from "@/components/state-badge";
import { caseFiles } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n/provider";

export default function CasesPage() {
  const { t, tc } = useLanguage();
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">{t("cases.eyebrow")}</span>
        <h1>{t("cases.title")}</h1>
        <p>{t("cases.intro")}</p>
      </header>

      <div className="case-library">
        {caseFiles.map((caseFile, index) => (
          <article className="case-file" key={caseFile.id}>
            <div className="case-index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <span className="case-category">{tc(caseFile.category)}</span>
              <h2>{caseFile.title}</h2>
              <p>{tc(caseFile.summary)}</p>
              <div className="tag-list">
                {caseFile.concepts.map((concept) => <span key={concept}>{tc(concept)}</span>)}
              </div>
            </div>
            <div className="case-side">
              <StateBadge state={caseFile.evidenceState} />
              <small>{caseFile.difficulty}</small>
              <Link className="case-start-link" href={"/cases/" + caseFile.id}>
                {t("cases.start")} ↗
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
