import type {
  ChainDataAdapter,
  SupportedEvmChain,
} from "@/lib/adapters/chain-data-adapter";
import { BlockscoutV2Adapter } from "@/lib/adapters/blockscout-v2-adapter";

const baseUrls: Partial<Record<SupportedEvmChain, string>> = {
  ethereum:
    process.env.BLOCKSCOUT_ETHEREUM_BASE_URL || "https://eth.blockscout.com",
};

export const chainDataAdapter: ChainDataAdapter =
  new BlockscoutV2Adapter(baseUrls);
