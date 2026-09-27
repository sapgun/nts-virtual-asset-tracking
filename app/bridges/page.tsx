import { BridgeMatchingLab } from "@/components/bridge-matching-lab";

export default function BridgesPage() {
  return (
    <div className="content-page">
      <header className="page-header">
        <span className="eyebrow">BRIDGE INTELLIGENCE LAB</span>
        <h1>Message-key evidence and heuristic correlation are not the same thing.</h1>
        <p>
          Compare a deterministic protocol-message correspondence with a
          time/value-only candidate match. Both can be useful, but they must
          enter the evidence model differently.
        </p>
      </header>

      <BridgeMatchingLab />
    </div>
  );
}
