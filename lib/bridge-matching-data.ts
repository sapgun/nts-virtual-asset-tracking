import type { BridgeObservation } from "@/lib/bridge-matching";

export const deterministicBridgePair: [
  BridgeObservation,
  BridgeObservation,
] = [
  {
    id: "bridge-source-01",
    protocol: "Synthetic Message Bridge",
    chain: "Ethereum",
    direction: "SOURCE",
    txHash: "0xsource01",
    timestampMs: Date.parse("2026-09-27T09:10:00Z"),
    asset: "USDC",
    amountBaseUnits: "25000000000",
    messageKey: "msg:eth:731:synthetic-emitter",
    account: "0xA100000000000000000000000000000000000001",
  },
  {
    id: "bridge-destination-01",
    protocol: "Synthetic Message Bridge",
    chain: "Arbitrum",
    direction: "DESTINATION",
    txHash: "0xdestination01",
    timestampMs: Date.parse("2026-09-27T09:14:00Z"),
    asset: "USDC",
    amountBaseUnits: "24998000000",
    messageKey: "msg:eth:731:synthetic-emitter",
    account: "0xB200000000000000000000000000000000000002",
  },
];

export const heuristicBridgePair: [
  BridgeObservation,
  BridgeObservation,
] = [
  {
    id: "bridge-source-02",
    protocol: "Synthetic Liquidity Bridge",
    chain: "Ethereum",
    direction: "SOURCE",
    txHash: "0xsource02",
    timestampMs: Date.parse("2026-09-27T08:00:00Z"),
    asset: "ETH",
    amountBaseUnits: "5000000000000000000",
    account: "0xC300000000000000000000000000000000000003",
  },
  {
    id: "bridge-destination-02",
    protocol: "Synthetic Liquidity Bridge",
    chain: "Base",
    direction: "DESTINATION",
    txHash: "0xdestination02",
    timestampMs: Date.parse("2026-09-27T08:18:00Z"),
    asset: "ETH",
    amountBaseUnits: "4985000000000000000",
    account: "0xD400000000000000000000000000000000000004",
  },
];
