"use client";

import { useMemo, useState } from "react";
import { StateBadge } from "@/components/state-badge";
import {
  matchBridgeObservations,
  type BridgeObservation,
} from "@/lib/bridge-matching";
import {
  deterministicBridgePair,
  heuristicBridgePair,
} from "@/lib/bridge-matching-data";
import { useLanguage } from "@/lib/i18n/provider";

type Scenario = "KEY" | "HEURISTIC";

function short(value: string) {
  return value.length > 18
    ? value.slice(0, 9) + "…" + value.slice(-6)
    : value;
}

function ObservationCard({
  observation,
}: {
  observation: BridgeObservation;
}) {
  const { t } = useLanguage();
  return (
    <article className="bridge-observation">
      <div className="bridge-direction">
        <span>{t(observation.direction === "SOURCE" ? "bridge.directionSource" : "bridge.directionDestination")}</span>
        <b>{observation.chain}</b>
      </div>
      <div className="bridge-fields">
        <div>
          <small>{t("bridge.protocol")}</small>
          <span>{observation.protocol}</span>
        </div>
        <div>
          <small>{t("bridge.tx")}</small>
          <span>{short(observation.txHash)}</span>
        </div>
        <div>
          <small>{t("bridge.asset")}</small>
          <span>{observation.asset}</span>
        </div>
        <div>
          <small>{t("bridge.messageKey")}</small>
          <span>{observation.messageKey || t("bridge.notExposed")}</span>
        </div>
      </div>
    </article>
  );
}

export function BridgeMatchingLab() {
  const { t, tc } = useLanguage();
  const [scenario, setScenario] = useState<Scenario>("KEY");

  const pair =
    scenario === "KEY"
      ? deterministicBridgePair
      : heuristicBridgePair;

  const result = useMemo(
    () => matchBridgeObservations(pair[0], pair[1]),
    [pair],
  );

  const modeLabel =
    result.mode === "DETERMINISTIC_KEY"
      ? t("bridge.modeDeterministic")
      : result.mode === "HEURISTIC"
        ? t("bridge.modeHeuristic")
        : t("bridge.modeNoMatch");

  return (
    <div className="bridge-lab">
      <div className="bridge-scenario-tabs">
        <button
          className={scenario === "KEY" ? "active" : ""}
          onClick={() => setScenario("KEY")}
        >
          {t("bridge.tabDeterministic")}
        </button>
        <button
          className={scenario === "HEURISTIC" ? "active" : ""}
          onClick={() => setScenario("HEURISTIC")}
        >
          {t("bridge.tabHeuristic")}
        </button>
      </div>

      <div className="bridge-stage">
        <ObservationCard observation={pair[0]} />

        <div className="bridge-link">
          <div className={"bridge-pulse mode-" + result.mode.toLowerCase()}>
            <i />
          </div>
          <StateBadge state={result.state} />
          <strong>{Math.round(result.confidence * 100)}%</strong>
          <small>{modeLabel}</small>
        </div>

        <ObservationCard observation={pair[1]} />
      </div>

      <div className="bridge-analysis">
        <article>
          <span className="eyebrow">{t("bridge.whyMatch")}</span>
          <ul>
            {result.reasons.map((reason) => (
              <li key={reason}>{tc(reason)}</li>
            ))}
          </ul>
        </article>
        <article className="bridge-caution">
          <span className="eyebrow">{t("bridge.notProve")}</span>
          <ul>
            {result.limitations.map((item) => (
              <li key={item}>{tc(item)}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
