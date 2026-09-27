"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StateBadge } from "@/components/state-badge";
import type { CasePlayback } from "@/lib/case-playback-data";

export function CasePlaybackPlayer({ playback }: { playback: CasePlayback }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = playback.steps[stepIndex];

  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= playback.steps.length - 1) {
      setPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((current) => Math.min(playback.steps.length - 1, current + 1));
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, playback.steps.length]);

  const progress = ((stepIndex + 1) / playback.steps.length) * 100;

  const visibleArtifacts = useMemo(
    () => playback.steps.slice(0, stepIndex + 1).flatMap((item) => item.artifacts),
    [playback.steps, stepIndex],
  );

  return (
    <div className="playback-page">
      <header className="playback-header">
        <div>
          <Link className="back-link" href="/cases">← Case Files</Link>
          <span className="eyebrow">CASE RECONSTRUCTION</span>
          <h1>{playback.title}</h1>
          <p>{playback.subtitle}</p>
        </div>
        <div className="playback-source-boundary">
          <span>SOURCE BOUNDARY</span>
          <p>{playback.sourceBoundary}</p>
        </div>
      </header>

      <div className="playback-shell">
        <aside className="playback-timeline">
          <div className="timeline-progress">
            <i style={{ height: progress + "%" }} />
          </div>
          {playback.steps.map((item, index) => (
            <button
              className={[
                "timeline-step",
                index === stepIndex ? "active" : "",
                index < stepIndex ? "complete" : "",
              ].join(" ")}
              key={item.id}
              onClick={() => {
                setStepIndex(index);
                setPlaying(false);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <small>{item.phase}</small>
                <b>{item.title}</b>
              </div>
            </button>
          ))}
        </aside>

        <main className="playback-stage">
          <div className="stage-topline">
            <div>
              <span className="eyebrow">STEP {String(stepIndex + 1).padStart(2, "0")} · {step.phase}</span>
              <h2>{step.title}</h2>
            </div>
            <StateBadge state={step.state} />
          </div>

          <div className="case-visual">
            <div className="case-visual-grid" />
            <div className="case-signal core">
              <span>CASE</span>
              <b>{playback.title}</b>
            </div>
            {playback.steps.slice(0, stepIndex + 1).map((item, index) => {
              const angle = (index / Math.max(1, playback.steps.length - 1)) * Math.PI * 1.45 - Math.PI * .75;
              const x = 50 + Math.cos(angle) * 35;
              const y = 52 + Math.sin(angle) * 33;
              return (
                <div
                  className={"case-signal satellite state-ring-" + item.state.toLowerCase()}
                  key={item.id}
                  style={{ left: x + "%", top: y + "%" }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{item.phase}</b>
                </div>
              );
            })}
            <svg className="case-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {playback.steps.slice(0, stepIndex + 1).map((item, index) => {
                const angle = (index / Math.max(1, playback.steps.length - 1)) * Math.PI * 1.45 - Math.PI * .75;
                const x = 50 + Math.cos(angle) * 35;
                const y = 52 + Math.sin(angle) * 33;
                return <line key={item.id} x1="50" y1="50" x2={x} y2={y} />;
              })}
            </svg>
          </div>

          <section className="playback-analysis">
            <article>
              <span>SUMMARY</span>
              <p>{step.summary}</p>
            </article>
            <article>
              <span>WHAT THIS SUPPORTS</span>
              <p>{step.observation}</p>
            </article>
            <article className="caution">
              <span>LIMITATION</span>
              <p>{step.limitation}</p>
            </article>
          </section>

          <div className="playback-confidence">
            <div>
              <span>Step confidence</span>
              <b>{Math.round(step.confidence * 100)}%</b>
            </div>
            <div className="confidence-track">
              <i style={{ width: Math.round(step.confidence * 100) + "%" }} />
            </div>
          </div>

          <div className="playback-controls">
            <button
              onClick={() => {
                setPlaying(false);
                setStepIndex((current) => Math.max(0, current - 1));
              }}
              disabled={stepIndex === 0}
            >
              Previous
            </button>
            <button className="play-button" onClick={() => setPlaying((value) => !value)}>
              {playing ? "Pause" : stepIndex === playback.steps.length - 1 ? "Replay from here" : "Auto play"}
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                setStepIndex((current) => Math.min(playback.steps.length - 1, current + 1));
              }}
              disabled={stepIndex === playback.steps.length - 1}
            >
              Next evidence
            </button>
          </div>
        </main>

        <aside className="playback-evidence">
          <span className="eyebrow">EVIDENCE ARTIFACTS</span>
          <div className="artifact-list">
            {visibleArtifacts.map((artifact, index) => (
              <div key={artifact + index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{artifact}</b>
              </div>
            ))}
          </div>
          <div className="playback-rule">
            <span>RULE</span>
            <p>An evidence state describes the support class. It is not a probability of guilt or identity.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
