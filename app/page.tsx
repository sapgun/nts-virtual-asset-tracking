import Link from "next/link";
import { StateBadge } from "@/components/state-badge";
import { caseFiles, evidence, investigation } from "@/lib/mock-data";

const modules = [
  ["Investigation Lab", "Trace flows, test hypotheses and preserve evidence states.", "/investigations", "01"],
  ["Case Reconstruction", "Replay public cases as evidence-driven investigation sequences.", "/cases", "02"],
  ["Evidence Room", "Separate direct facts, analytical inference and external attribution.", "/evidence", "03"],
  ["Academy", "Learn blockchain investigation through interactive modules and cases.", "/academy", "04"],
];

export default function HomePage() {
  return (
    <div className="command-page">
      <section className="command-hero">
        <div className="hero-copy">
          <span className="eyebrow">VIRTUAL ASSET INTELLIGENCE WORKBENCH</span>
          <h1>Trace the flow.<br />Separate evidence from inference.</h1>
          <p>
            A research-first investigation environment for reconstructing virtual-asset flows,
            testing attribution hypotheses, and documenting what is observed, inferred, attributed,
            or still unknown.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" href="/investigations">Open investigation lab</Link>
            <Link className="secondary-link" href="/research">Read preserved research</Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-core">
            <span />
            <span />
            <span />
            <i />
          </div>
          <div className="hero-orbit orbit-a" />
          <div className="hero-orbit orbit-b" />
          <div className="hero-orbit orbit-c" />
        </div>
      </section>

      <section className="command-stats">
        <article>
          <span>ACTIVE CASE</span>
          <b>{investigation.id}</b>
          <small>{investigation.title}</small>
        </article>
        <article>
          <span>EVIDENCE COMPLETENESS</span>
          <b>{investigation.evidenceCompleteness}%</b>
          <small>On-chain strong · off-chain incomplete</small>
        </article>
        <article>
          <span>EVIDENCE ITEMS</span>
          <b>{evidence.length}</b>
          <small>Each item carries an explicit evidence state</small>
        </article>
        <article>
          <span>CASE LIBRARY</span>
          <b>{caseFiles.length}</b>
          <small>Curated public-case reconstructions</small>
        </article>
      </section>

      <section className="module-grid">
        {modules.map(([title, body, href, number]) => (
          <Link className="module-card" href={href} key={title}>
            <span className="module-number">{number}</span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
            <span className="module-arrow">↗</span>
          </Link>
        ))}
      </section>

      <section className="evidence-principle">
        <div>
          <span className="eyebrow">SYSTEM PRINCIPLE</span>
          <h2>A graph edge is not a person.</h2>
          <p>
            The system deliberately prevents transaction relationships from becoming natural-person
            attribution without an explicit evidence transition.
          </p>
        </div>
        <div className="principle-flow">
          <div><StateBadge state="OBSERVED" /><span>Transaction</span></div>
          <i>→</i>
          <div><StateBadge state="INFERRED" /><span>Hypothesis</span></div>
          <i>→</i>
          <div><StateBadge state="ATTRIBUTED" /><span>Entity</span></div>
          <i>→</i>
          <div><StateBadge state="UNVERIFIED" /><span>Natural person</span></div>
        </div>
      </section>
    </div>
  );
}
