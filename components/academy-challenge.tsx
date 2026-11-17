"use client";

import { useMemo, useState } from "react";
import { StateBadge } from "@/components/state-badge";
import { challenges } from "@/lib/academy-data";
import { useLanguage } from "@/lib/i18n/provider";

export function AcademyChallenge() {
  const { t, tc } = useLanguage();
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
          <span>{t("academy.challenge.exercise")}</span>
          <b>{String(index + 1).padStart(2, "0")} / {String(challenges.length).padStart(2, "0")}</b>
        </div>
        <i>
          <em style={{ width: progress + "%" }} />
        </i>
      </div>

      <div className="academy-stage">
        <div className="academy-question">
          <span className="eyebrow">{tc(challenge.concept)}</span>
          <h2>{tc(challenge.title)}</h2>
          <p>{tc(challenge.prompt)}</p>

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
                  <span>{tc(option.label)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="academy-feedback">
          {!selectedOption ? (
            <>
              <span className="eyebrow">{t("academy.challenge.whyMatters")}</span>
              <h3>{t("academy.challenge.classifyTitle")}</h3>
              <p>
                {t("academy.challenge.classifyBody")}
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow">
                {selectedOption.correct ? t("academy.challenge.correct") : t("academy.challenge.review")}
              </span>
              <h3>
                {selectedOption.correct
                  ? t("academy.challenge.correctTitle")
                  : t("academy.challenge.reviewTitle")}
              </h3>
              <p>{tc(selectedOption.explanation)}</p>
              <div className="academy-score">
                <span>{t("academy.challenge.sessionScore")}</span>
                <b>{score} / {challenges.length}</b>
              </div>
              <button onClick={next}>
                {index === challenges.length - 1 ? t("academy.challenge.restart") : `${t("academy.challenge.next")} →`}
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
