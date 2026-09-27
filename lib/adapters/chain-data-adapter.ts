export type SupportedEvmChain = "ethereum";

export interface NormalizedChainTransaction {
  hash: string;
  blockNumber: number | null;
  timestamp: string | null;
  from: string | null;
  to: string | null;
  valueWei: string | null;
  method: string | null;
  status: string | null;
  provenance: {
    provider: string;
    sourceUrl: string;
    observedAt: string;
  };
}

export interface AddressTransactionsResult {
  address: string;
  chain: SupportedEvmChain;
  items: NormalizedChainTransaction[];
  nextPageParams?: Record<string, string | number | null>;
}

export interface ChainDataAdapter {
  getAddressTransactions(
    chain: SupportedEvmChain,
    address: string,
  ): Promise<AddressTransactionsResult>;
}
