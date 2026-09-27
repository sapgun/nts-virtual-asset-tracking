import type {
  AddressTransactionsResult,
  ChainDataAdapter,
  NormalizedChainTransaction,
  SupportedEvmChain,
} from "@/lib/adapters/chain-data-adapter";

type BlockscoutAddressLike =
  | string
  | {
      hash?: string;
    }
  | null;

interface BlockscoutTransactionLike {
  hash?: string;
  block_number?: number;
  timestamp?: string;
  from?: BlockscoutAddressLike;
  to?: BlockscoutAddressLike;
  value?: string;
  method?: string;
  status?: string;
}

interface BlockscoutTransactionResponse {
  items?: BlockscoutTransactionLike[];
  next_page_params?: Record<string, string | number | null>;
}

function normalizeAddress(value: BlockscoutAddressLike): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.hash ?? null;
}

function assertEvmAddress(address: string) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("invalid EVM address");
  }
}

export class BlockscoutV2Adapter implements ChainDataAdapter {
  constructor(
    private readonly baseUrls: Partial<Record<SupportedEvmChain, string>>,
  ) {}

  async getAddressTransactions(
    chain: SupportedEvmChain,
    address: string,
  ): Promise<AddressTransactionsResult> {
    assertEvmAddress(address);

    const configuredBaseUrl = this.baseUrls[chain];

    if (!configuredBaseUrl) {
      throw new Error(`Blockscout base URL is not configured for ${chain}`);
    }

    const baseUrl = configuredBaseUrl.replace(/\/$/, "");
    const sourceUrl =
      baseUrl + "/api/v2/addresses/" + encodeURIComponent(address) + "/transactions";

    const response = await fetch(sourceUrl, {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(
        `Blockscout request failed: ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as BlockscoutTransactionResponse;
    const observedAt = new Date().toISOString();

    const items: NormalizedChainTransaction[] = (payload.items ?? [])
      .filter((item): item is BlockscoutTransactionLike & { hash: string } =>
        typeof item.hash === "string" && item.hash.length > 0,
      )
      .map((item) => ({
        hash: item.hash,
        blockNumber:
          typeof item.block_number === "number" ? item.block_number : null,
        timestamp: typeof item.timestamp === "string" ? item.timestamp : null,
        from: normalizeAddress(item.from ?? null),
        to: normalizeAddress(item.to ?? null),
        valueWei: typeof item.value === "string" ? item.value : null,
        method: typeof item.method === "string" ? item.method : null,
        status: typeof item.status === "string" ? item.status : null,
        provenance: {
          provider: "blockscout-v2",
          sourceUrl,
          observedAt,
        },
      }));

    return {
      address,
      chain,
      items,
      nextPageParams: payload.next_page_params,
    };
  }
}
