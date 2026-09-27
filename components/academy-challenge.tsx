"use client";

import { useMemo, useState } from "react";
import { StateBadge } from "@/components/state-badge";
import type { EvidenceState } from "@/lib/domain";

interface Challenge {
  id: string;
  title: string;
  concept: string;
  prompt: string;
  options: Array<{
    label: string;
    state: EvidenceState;
    correct: boolean;
    explanation: string;
  }>;
}

const challenges: Challenge[] = [
  {
    id: "wallet-link",
    title: "Address A paid Address B.",
    concept: "Address ≠ person",
    prompt: "What is the strongest statement the evidence currently supports?",
    options: [
      {
        label: "A and B are controlled by the same person.",
        state: "ATTRIBUTED",
        correct: false,
        explanation: "A direct transfer shows a transaction relationship, not common control.",
      },
      {
        label: "A sent value to B on-chain.",
        state: "OBSERVED",
        correct: true,
        explanation: "This is directly reproducible from the ledger and does not overstate identity.",
      },
      {
        label: "A and B probably belong to the same entity.",
        state: "INFERRED",
        correct: false,
        explanation: "That inference needs additional signals and a documented method.",
      },
    ],
  },
  {
    id: "bridge-key",
    title: "A bridge message key matches on both chains.",
    concept: "Deterministic bridge correspondence",
    prompt: "How should the cross-chain relationship be represented?",
    options: [
      {
        label: "Observed protocol correspondence.",
        state: "OBSERVED",
        correct: true,
        explanation: "The matching protocol message identifier supports the bridge-event link itself.",
      },
      {
        label: "Attributed wallet ownership.",
        state: "ATTRIBUTED",
        correct: false,
        explanation: "A message correspondence does not identify the wallet controller.",
      },
      {
        label: "Unverified coincidence.",
        state: "UNVERIFIED",
        correct: false,
        explanation: "A deterministic message identifier is stronger than a time/value-only coincidence.",
      },
    ],
  },
  {
    id: "mixer-candidates",
    title: "Timing and value reduce 120 mixer outputs to 6 candidates.",
    concept: "Candidate reduction ≠ deanonymization",
    prompt: "What is the appropriate evidence state?",
    options: [
      {
        label: "Attributed",
        state: "ATTRIBUTED",
        correct: false,
        explanation: "Candidate reduction does not prove a deposit-withdrawal identity.",
      },
      {
        label: "Inferred",
        state: "INFERRED",
        correct: true,
        explanation: "The analytical signals narrow possibilities but remain heuristic.",
      },
      {
        label: "Observed",
        state: "OBSERVED",
        correct: false,
        explanation: "The candidate link itself is not directly visible on-chain.",
      },
    ],
  },
];

export function AcademyChallenge() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const challenge = challenges[index];
  const complete = selected !== null;
  const selectedOption =
    selected === null ? null : challenge.options[selected];

  const progress = useMemo(
    () => ((index + 1) / challenges.length) * 100,
    [index],
  );

  function choose(optionIndex: number) {
    if (complete) return;

    setSelected(optionIndex);

    if (challenge.options[optionIndex].correct) {
      setScore((value) => value + 1);
    }
  }

  function next() {
    if (index >= challenges.length - 1) {
      setIndex(0);
      setSelected(null);
      setScore(0);
      return;
    }

    setIndex((value) => value + 1);
    setSelected(null);
  }

  return (
    <section className="academy-challenge">
      <div className="academy-progress">
        <div>
          <span>FIELD EXERCISE</span>
          <b>{String(index + 1).padStart(2, "0")} / {String(challenges.length).padStart(2, "0")}</b>
        </div>
        <i>
          <em style={{ width: progress + "%" }} />
        </i>
      </div>

      <div className="academy-stage">
        <div className="academy-question">
          <span className="eyebrow">{challenge.concept}</span>
          <h2>{challenge.title}</h2>
          <p>{challenge.prompt}</p>

          <div className="academy-options">
            {challenge.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const revealCorrect = complete && option.correct;

              return (
                <button
                  key={option.label}
                  className={[
                    isSelected ? "selected" : "",
                    revealCorrect ? "correct" : "",
                    complete && isSelected && !option.correct ? "wrong" : "",
                  ].join(" ")}
                  onClick={() => choose(optionIndex)}
                  disabled={complete}
                >
                  <StateBadge state={option.state} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="academy-feedback">
          {!selectedOption ? (
            <>
              <span className="eyebrow">WHY THIS MATTERS</span>
              <h3>Classify the claim before acting on it.</h3>
              <p>
                The training loop uses the same evidence states as the investigation workspace.
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow">
                {selectedOption.correct ? "CORRECT" : "REVIEW"}
              </span>
              <h3>
                {selectedOption.correct
                  ? "You kept the evidence boundary intact."
                  : "The claim jumped an evidence layer."}
              </h3>
              <p>{selectedOption.explanation}</p>
              <div className="academy-score">
                <span>Session score</span>
                <b>{score} / {challenges.length}</b>
              </div>
              <button onClick={next}>
                {index === challenges.length - 1 ? "Restart session" : "Next exercise →"}
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
