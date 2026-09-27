import Link from "next/link";
import { StateBadge } from "@/components/state-badge";
import { caseFiles } from "@/lib/mock-data";

export default function CasesPage() {
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">CASE FILES</span>
        <h1>Reconstruct investigations, not just outcomes.</h1>
        <p>Curated public cases become playable sequences that preserve the difference between chain facts and attribution evidence.</p>
      </header>

      <div className="case-library">
        {caseFiles.map((caseFile, index) => (
          <article className="case-file" key={caseFile.id}>
            <div className="case-index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <span className="case-category">{caseFile.category}</span>
              <h2>{caseFile.title}</h2>
              <p>{caseFile.summary}</p>
              <div className="tag-list">
                {caseFile.concepts.map((concept) => <span key={concept}>{concept}</span>)}
              </div>
            </div>
            <div className="case-side">
              <StateBadge state={caseFile.evidenceState} />
              <small>{caseFile.difficulty}</small>
              <Link className="case-start-link" href={"/cases/" + caseFile.id}>
                Start reconstruction ↗
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
