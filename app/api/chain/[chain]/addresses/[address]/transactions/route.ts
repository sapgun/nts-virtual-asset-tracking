import { NextResponse } from "next/server";
import { chainDataAdapter } from "@/lib/adapters/chain-provider-registry";
import type { SupportedEvmChain } from "@/lib/adapters/chain-data-adapter";
import { t } from "@/lib/i18n";
import { isLocale, type Locale } from "@/lib/i18n/locales";

const supportedChains = new Set<SupportedEvmChain>(["ethereum"]);

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      chain: string;
      address: string;
    }>;
  },
) {
  const { chain, address } = await context.params;
  const langParam = new URL(request.url).searchParams.get("lang");
  const locale: Locale = isLocale(langParam) ? langParam : "en";

  if (!supportedChains.has(chain as SupportedEvmChain)) {
    return NextResponse.json(
      {
        error: t(locale, "api.chain.unsupported"),
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

    // Known adapter errors get a localized message; unknown upstream
    // errors keep their original text for debuggability.
    const localized =
      message.includes("invalid EVM address")
        ? t(locale, "api.chain.invalidAddress")
        : message.startsWith("Blockscout base URL is not configured")
          ? t(locale, "api.chain.baseUrlMissing")
          : message.startsWith("Blockscout request failed")
            ? t(locale, "api.chain.adapterFailed")
            : message;

    return NextResponse.json(
      {
        error: localized,
      },
      { status },
    );
  }
}
