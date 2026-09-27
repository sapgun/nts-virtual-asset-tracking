const modules = [
  ["01", "Blockchain evidence", "Observed transaction facts and reproducibility"],
  ["02", "Wallet attribution", "Why address, entity and natural person are different layers"],
  ["03", "UTXO heuristics", "Cluster methods, CoinJoin and failure modes"],
  ["04", "EVM tracing", "Calls, logs, token transfers and contract routing"],
  ["05", "Mixers", "Candidate-set reduction without false certainty"],
  ["06", "Bridges", "Message-key matching versus time/value inference"],
  ["07", "Privacy systems", "What remains observable when fields are hidden"],
  ["08", "Evidence standards", "Cross-validation, provenance and counter-evidence"],
];

export default function AcademyPage() {
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">ACADEMY</span>
        <h1>Learn → simulate → investigate → explain.</h1>
        <p>The curriculum reuses the same evidence model as the analyst workspace so learning transfers directly into investigation practice.</p>
      </header>

      <div className="academy-grid">
        {modules.map(([number, title, body]) => (
          <article key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{body}</p>
            <button disabled>Module scaffold</button>
          </article>
        ))}
      </div>
    </div>
  );
}
