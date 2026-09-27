import Link from "next/link";
import { CapabilityRegistry } from "@/components/capability-registry";
import { StateBadge } from "@/components/state-badge";
import { caseFiles, evidence, investigation } from "@/lib/mock-data";

const launchers = [
  {
    number: "01",
    eyebrow: "OBSERVE",
    title: "Start from an address",
    body: "Load public Ethereum transactions first. Create hypotheses only after the observations are visible.",
    href: "/explore",
    action: "Open explorer",
  },
  {
    number: "02",
    eyebrow: "INVESTIGATE",
    title: "Open the workbench",
    body: "Trace a flow, inspect evidence state, draft hypotheses and export an integrity-hashed evidence packet.",
    href: "/investigations",
    action: "Open investigation",
  },
  {
    number: "03",
    eyebrow: "RECONSTRUCT",
    title: "Replay a public case",
    body: "Walk through a curated case one evidence transition at a time instead of reading the conclusion first.",
    href: "/cases",
    action: "Choose a case",
  },
];

export default function HomePage() {
  return (
    <div className="command-page command-page-v3">
      <section className="command-v3-hero">
        <div className="command-v3-copy">
          <span className="eyebrow">VIRTUAL ASSET INTELLIGENCE WORKBENCH</span>
          <h1>
            Follow the money.
            <br />
            Keep the uncertainty.
          </h1>
          <p>
            Explore public blockchain flows without collapsing an address,
            entity and natural person into the same claim.
          </p>

          <div className="command-v3-actions">
            <Link className="command-primary" href="/explore">
              Start with an address <span>↗</span>
            </Link>
            <Link className="command-quiet" href="/research">
              Read the technical brief
            </Link>
          </div>

          <div className="command-v3-proof">
            <div>
              <StateBadge state="OBSERVED" />
              <span>Facts remain facts</span>
            </div>
            <i />
            <div>
              <StateBadge state="INFERRED" />
              <span>Hypotheses stay explicit</span>
            </div>
            <i />
            <div>
              <StateBadge state="ATTRIBUTED" />
              <span>Attribution needs provenance</span>
            </div>
          </div>
        </div>

        <div className="command-scene" aria-hidden="true">
          <div className="scene-plane plane-a" />
          <div className="scene-plane plane-b" />
          <div className="scene-orbit orbit-one" />
          <div className="scene-orbit orbit-two" />

          <div className="scene-node node-main">
            <i />
            <span>SEED</span>
          </div>
          <div className="scene-node node-a">
            <i />
            <span>FLOW</span>
          </div>
          <div className="scene-node node-b">
            <i />
            <span>BRIDGE</span>
          </div>
          <div className="scene-node node-c">
            <i />
            <span>VASP</span>
          </div>

          <svg viewBox="0 0 600 500" preserveAspectRatio="none">
            <path d="M130 260 C210 210 280 210 350 160" />
            <path d="M135 272 C225 310 310 300 430 335" />
            <path d="M350 165 C405 205 442 242 462 316" />
          </svg>

          <div className="scene-caption caption-a">
            <span>OBSERVED</span>
            <b>transaction</b>
          </div>
          <div className="scene-caption caption-b">
            <span>INFERRED</span>
            <b>relationship</b>
          </div>
        </div>
      </section>

      <section className="command-v3-launch">
        <div className="command-section-head">
          <div>
            <span className="eyebrow">START HERE</span>
            <h2>One job at a time.</h2>
          </div>
          <p>
            The interface now separates observation, investigation and
            reconstruction instead of exposing every tool at once.
          </p>
        </div>

        <div className="launcher-grid">
          {launchers.map((item) => (
            <Link className="launcher-card" href={item.href} key={item.number}>
              <span className="launcher-no">{item.number}</span>
              <div>
                <small>{item.eyebrow}</small>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <strong>{item.action} ↗</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="command-v3-status">
        <div className="status-case">
          <span className="eyebrow">SANDBOX SNAPSHOT</span>
          <h2>{investigation.id}</h2>
          <p>{investigation.title}</p>
        </div>

        <div className="status-metrics">
          <div>
            <span>EVIDENCE</span>
            <b>{evidence.length}</b>
            <small>typed items</small>
          </div>
          <div>
            <span>COMPLETENESS</span>
            <b>{investigation.evidenceCompleteness}%</b>
            <small>evidence quality context</small>
          </div>
          <div>
            <span>CASES</span>
            <b>{caseFiles.length}</b>
            <small>reconstruction packs</small>
          </div>
        </div>
      </section>

      <CapabilityRegistry />
    </div>
  );
}
