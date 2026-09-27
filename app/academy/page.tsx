import { AcademyChallenge } from "@/components/academy-challenge";

const tracks = [
  ["Foundation", "Facts, provenance and evidence states"],
  ["Tracing", "UTXO, EVM and flow reconstruction"],
  ["Privacy", "Mixers, privacy systems and uncertainty"],
  ["Cross-chain", "Bridge events and correlation"],
];

export default function AcademyPage() {
  return (
    <div className="content-page academy-page-v3">
      <header className="page-header academy-header-v3">
        <span className="eyebrow">ACADEMY</span>
        <h1>Learn the boundary, not just the tool.</h1>
        <p>
          One short field exercise at a time. The same evidence model used in the workbench is used here.
        </p>
      </header>

      <AcademyChallenge />

      <section className="academy-track-strip">
        {tracks.map(([title, body], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
