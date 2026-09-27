export default function ResearchPage() {
  return (
    <div className="research-frame-page">
      <header className="research-bar">
        <div>
          <span className="eyebrow">PRESERVED SOURCE</span>
          <strong>Original technical intelligence brief</strong>
        </div>
        <a href="/research-legacy.html" target="_blank" rel="noreferrer">Open standalone ↗</a>
      </header>
      <iframe
        className="research-frame"
        title="Preserved NTS virtual asset tracking research"
        src="/research-legacy.html"
      />
    </div>
  );
}
