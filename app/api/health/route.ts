import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      app: "nts-virtual-asset-intelligence",
      framework: "nextjs",
      routes: [
        "/",
        "/investigations",
        "/explore",
        "/bridges",
        "/cases",
        "/evidence",
        "/academy",
        "/research"
      ],
      build: {
        commit:
          process.env.VERCEL_GIT_COMMIT_SHA ||
          process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
          null,
        environment: process.env.VERCEL_ENV || null
      }
    },
    {
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}
