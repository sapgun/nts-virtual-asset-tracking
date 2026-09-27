"use client";

import { FormEvent, useMemo, useState } from "react";
import { StateBadge } from "@/components/state-badge";
import type { EvidenceItem, Hypothesis } from "@/lib/domain";

export interface HypothesisDraftEvent {
  hypothesis: Hypothesis;
  createdAt: string;
}

export function HypothesisBuilder({
  evidence,
  onCreate,
}: {
  evidence: EvidenceItem[];
  onCreate?: (event: HypothesisDraftEvent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [claim, setClaim] = useState("");
  const [method, setMethod] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [counterEvidence, setCounterEvidence] = useState("");
  const [drafts, setDrafts] = useState<Hypothesis[]>([]);

  const selectedEvidence = useMemo(
    () => evidence.filter((item) => selected.includes(item.id)),
    [evidence, selected],
  );

  const inferredReady =
    claim.trim().length >= 12 &&
    method.trim().length >= 8 &&
    selectedEvidence.length > 0;

  const proposedState: Hypothesis["state"] =
    inferredReady ? "INFERRED" : "UNVERIFIED";

  const proposedConfidence = useMemo(() => {
    if (!inferredReady) return 0;

    const avg =
      selectedEvidence.reduce(
        (sum, item) => sum + item.confidence,
        0,
      ) / selectedEvidence.length;

    const diversity =
      new Set(selectedEvidence.map((item) => item.sourceType)).size / 4;

    const counterBonus = counterEvidence.trim().length >= 12 ? 0.05 : 0;

    return Math.min(
      0.85,
      Number((avg * 0.6 + diversity * 0.2 + counterBonus).toFixed(2)),
    );
  }, [counterEvidence, inferredReady, selectedEvidence]);

  function toggleEvidence(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();

    const hypothesis: Hypothesis = {
      id: "HYP-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
      claim: claim.trim() || "Unspecified hypothesis",
      method: method.trim() || "method not documented",
      confidence: proposedConfidence,
      state: proposedState,
      supportingEvidence: selected,
      counterEvidence: counterEvidence.trim()
        ? [counterEvidence.trim()]
        : ["No counter-evidence documented yet"],
    };

    const createdAt = new Date().toISOString();

    setDrafts((current) => [hypothesis, ...current]);
    onCreate?.({ hypothesis, createdAt });

    setClaim("");
    setMethod("");
    setSelected([]);
    setCounterEvidence("");
    setOpen(false);
  }

  return (
    <div className="hypothesis-builder">
      <div className="hypothesis-builder-head">
        <div>
          <span className="eyebrow">HYPOTHESIS BUILDER</span>
          <small>Evidence-linked analyst draft</small>
        </div>
        <button onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "New hypothesis +"}
        </button>
      </div>

      {open && (
        <form className="hypothesis-form" onSubmit={submit}>
          <label>
            <span>Claim</span>
            <textarea
              value={claim}
              onChange={(event) => setClaim(event.target.value)}
              placeholder="What relationship or explanation are you testing?"
            />
          </label>

          <label>
            <span>Method</span>
            <input
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              placeholder="e.g. temporal + convergence heuristic"
            />
          </label>

          <div className="hypothesis-evidence-select">
            <span>Supporting evidence</span>
            <div>
              {evidence.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={selected.includes(item.id) ? "active" : ""}
                  onClick={() => toggleEvidence(item.id)}
                >
                  <b>{item.id}</b>
                  <small>{item.title}</small>
                </button>
              ))}
            </div>
          </div>

          <label>
            <span>Counter-evidence / alternative explanation</span>
            <textarea
              value={counterEvidence}
              onChange={(event) => setCounterEvidence(event.target.value)}
              placeholder="What else could explain the same pattern?"
            />
          </label>

          <div className="hypothesis-preview">
            <StateBadge state={proposedState} />
            <span>
              Draft confidence
              <b>{Math.round(proposedConfidence * 100)}%</b>
            </span>
          </div>

          <button className="hypothesis-create" type="submit">
            Save analyst draft
          </button>
        </form>
      )}

      {drafts.length > 0 && (
        <div className="hypothesis-drafts">
          {drafts.map((item) => (
            <article key={item.id}>
              <div>
                <StateBadge state={item.state} />
                <b>{Math.round(item.confidence * 100)}%</b>
              </div>
              <strong>{item.claim}</strong>
              <small>{item.method}</small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
