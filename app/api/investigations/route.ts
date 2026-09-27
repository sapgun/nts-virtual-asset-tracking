import { NextResponse } from "next/server";
import { investigation } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    data: [investigation],
    meta: {
      adapter: "mock",
      synthetic: true,
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    seed?: string;
    chain?: string;
    title?: string;
  };

  if (!body.seed) {
    return NextResponse.json(
      { error: "seed is required" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      data: {
        ...investigation,
        id: "INV-DRAFT",
        title: body.title || "Draft Investigation",
        seed: body.seed,
        chain: body.chain || "ethereum",
        status: "ACTIVE",
      },
      meta: {
        persisted: false,
        synthetic: true,
      },
    },
    { status: 201 },
  );
}
