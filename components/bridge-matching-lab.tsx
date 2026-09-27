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
  return (
    <article className="bridge-observation">
      <div className="bridge-direction">
        <span>{observation.direction}</span>
        <b>{observation.chain}</b>
      </div>
      <div className="bridge-fields">
        <div>
          <small>PROTOCOL</small>
          <span>{observation.protocol}</span>
        </div>
        <div>
          <small>TX</small>
          <span>{short(observation.txHash)}</span>
        </div>
        <div>
          <small>ASSET</small>
          <span>{observation.asset}</span>
        </div>
        <div>
          <small>MESSAGE KEY</small>
          <span>{observation.messageKey || "not exposed"}</span>
        </div>
      </div>
    </article>
  );
}

export function BridgeMatchingLab() {
  const [scenario, setScenario] = useState<Scenario>("KEY");

  const pair =
    scenario === "KEY"
      ? deterministicBridgePair
      : heuristicBridgePair;

  const result = useMemo(
    () => matchBridgeObservations(pair[0], pair[1]),
    [pair],
  );

  return (
    <div className="bridge-lab">
      <div className="bridge-scenario-tabs">
        <button
          className={scenario === "KEY" ? "active" : ""}
          onClick={() => setScenario("KEY")}
        >
          Deterministic message key
        </button>
        <button
          className={scenario === "HEURISTIC" ? "active" : ""}
          onClick={() => setScenario("HEURISTIC")}
        >
          Time / value heuristic
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
          <small>{result.mode.replaceAll("_", " ")}</small>
        </div>

        <ObservationCard observation={pair[1]} />
      </div>

      <div className="bridge-analysis">
        <article>
          <span className="eyebrow">WHY THIS MATCH</span>
          <ul>
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </article>
        <article className="bridge-caution">
          <span className="eyebrow">WHAT IT DOES NOT PROVE</span>
          <ul>
            {result.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
