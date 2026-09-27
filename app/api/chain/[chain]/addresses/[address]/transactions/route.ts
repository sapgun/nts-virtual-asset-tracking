import { NextResponse } from "next/server";
import { chainDataAdapter } from "@/lib/adapters/chain-provider-registry";
import type { SupportedEvmChain } from "@/lib/adapters/chain-data-adapter";

const supportedChains = new Set<SupportedEvmChain>(["ethereum"]);

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      chain: string;
      address: string;
    }>;
  },
) {
  const { chain, address } = await context.params;

  if (!supportedChains.has(chain as SupportedEvmChain)) {
    return NextResponse.json(
      {
        error: "unsupported chain",
        supported: Array.from(supportedChains),
      },
      { status: 400 },
    );
  }

  try {
    const data = await chainDataAdapter.getAddressTransactions(
      chain as SupportedEvmChain,
      address,
    );

    return NextResponse.json({
      data,
      meta: {
        evidenceState: "OBSERVED",
        naturalPersonAttribution: false,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "chain adapter failed";

    const status = message.includes("invalid EVM address") ? 400 : 502;

    return NextResponse.json(
      {
        error: message,
      },
      { status },
    );
  }
}
