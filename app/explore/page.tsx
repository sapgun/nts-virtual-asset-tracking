import { PublicAddressExplorer } from "@/components/public-address-explorer";

export default function ExplorePage() {
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">GRAPH EXPLORER · PUBLIC DATA</span>
        <h1>Observe first. Infer later.</h1>
        <p>
          Load public Ethereum transaction facts through the normalized chain adapter.
          This surface intentionally stops before entity or natural-person attribution.
        </p>
      </header>
      <PublicAddressExplorer />
    </div>
  );
}
