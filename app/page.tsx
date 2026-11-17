"use client";

import Link from "next/link";
import { CapabilityRegistry } from "@/components/capability-registry";
import { StateBadge } from "@/components/state-badge";
import { caseFiles, evidence, investigation } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n/provider";

const launchers = [
  {
    number: "01",
    key: "observe",
    href: "/explore",
  },
  {
    number: "02",
    key: "investigate",
    href: "/investigations",
  },
  {
    number: "03",
    key: "reconstruct",
    href: "/cases",
  },
] as const;

export default function HomePage() {
  const { t, tc } = useLanguage();
  return (
    <div className="command-page command-page-v3">
      <section className="command-v3-hero">
        <div className="command-v3-copy">
          <span className="eyebrow">{t("command.eyebrow")}</span>
          <h1>
            {t("command.titleA")}
            <br />
            {t("command.titleB")}
          </h1>
          <p>{t("command.intro")}</p>

          <div className="command-v3-actions">
            <Link className="command-primary" href="/explore">
              {t("command.startAddress")} <span>↗</span>
            </Link>
            <Link className="command-quiet" href="/research">
              {t("command.readBrief")}
            </Link>
          </div>

          <div className="command-v3-proof">
            <div>
              <StateBadge state="OBSERVED" />
              <span>{t("command.proofFacts")}</span>
            </div>
            <i />
            <div>
              <StateBadge state="INFERRED" />
              <span>{t("command.proofHypotheses")}</span>
            </div>
            <i />
            <div>
              <StateBadge state="ATTRIBUTED" />
              <span>{t("command.proofAttribution")}</span>
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
            <span>{t("command.scene.seed")}</span>
          </div>
          <div className="scene-node node-a">
            <i />
            <span>{t("command.scene.flow")}</span>
          </div>
          <div className="scene-node node-b">
            <i />
            <span>{t("command.scene.bridge")}</span>
          </div>
          <div className="scene-node node-c">
            <i />
            <span>{t("command.scene.vasp")}</span>
          </div>

          <svg viewBox="0 0 600 500" preserveAspectRatio="none">
            <path d="M130 260 C210 210 280 210 350 160" />
            <path d="M135 272 C225 310 310 300 430 335" />
            <path d="M350 165 C405 205 442 242 462 316" />
          </svg>

          <div className="scene-caption caption-a">
            <span>{t("command.scene.observedCaption")}</span>
            <b>{t("command.scene.observedWord")}</b>
          </div>
          <div className="scene-caption caption-b">
            <span>{t("command.scene.inferredCaption")}</span>
            <b>{t("command.scene.inferredWord")}</b>
          </div>
        </div>
      </section>

      <section className="command-v3-launch">
        <div className="command-section-head">
          <div>
            <span className="eyebrow">{t("command.startHere")}</span>
            <h2>{t("command.oneJob")}</h2>
          </div>
          <p>{t("command.oneJobBody")}</p>
        </div>

        <div className="launcher-grid">
          {launchers.map((item) => (
            <Link className="launcher-card" href={item.href} key={item.number}>
              <span className="launcher-no">{item.number}</span>
              <div>
                <small>{t(`command.launchers.${item.key}.eyebrow`)}</small>
                <h3>{t(`command.launchers.${item.key}.title`)}</h3>
                <p>{t(`command.launchers.${item.key}.body`)}</p>
              </div>
              <strong>{t(`command.launchers.${item.key}.action`)} ↗</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="command-v3-status">
        <div className="status-case">
          <span className="eyebrow">{t("command.status.eyebrow")}</span>
          <h2>{investigation.id}</h2>
          <p>{tc(investigation.title)}</p>
        </div>

        <div className="status-metrics">
          <div>
            <span>{t("command.status.evidence")}</span>
            <b>{evidence.length}</b>
            <small>{t("command.status.evidenceUnit")}</small>
          </div>
          <div>
            <span>{t("command.status.completeness")}</span>
            <b>{investigation.evidenceCompleteness}%</b>
            <small>{t("command.status.completenessUnit")}</small>
          </div>
          <div>
            <span>{t("command.status.cases")}</span>
            <b>{caseFiles.length}</b>
            <small>{t("command.status.casesUnit")}</small>
          </div>
        </div>
      </section>

      <CapabilityRegistry />
    </div>
  );
}
