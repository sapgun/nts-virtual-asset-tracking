import { NextResponse } from "next/server";
import type {
  GraphNode,
  Investigation,
} from "@/lib/domain";
import { investigation as syntheticInvestigation } from "@/lib/mock-data";
import {
  investigationRepository,
  investigationRepositoryMeta,
} from "@/lib/repositories/repository-registry";

export async function GET() {
  const stored = await investigationRepository.list();

  return NextResponse.json({
    data: [
      syntheticInvestigation,
      ...stored.map((item) => item.investigation),
    ],
    meta: {
      repository: investigationRepositoryMeta,
      syntheticSandboxIncluded: true,
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

  if (body.chain && body.chain !== "ethereum") {
    return NextResponse.json(
      {
        error: "MVP draft persistence currently supports ethereum only",
      },
      { status: 400 },
    );
  }

  const createdAt = new Date().toISOString();
  const id =
    "INV-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    crypto.randomUUID().slice(0, 6).toUpperCase();

  const investigation: Investigation = {
    id,
    title: body.title || "Draft Investigation",
    seed: body.seed,
    chain: "ethereum",
    status: "ACTIVE",
    createdAt,
    evidenceCompleteness: 0,
  };

  const seedNode: GraphNode = {
    id: "seed",
    label: "Seed",
    kind: "wallet",
    state: "OBSERVED",
    confidence: 1,
    x: 100,
    y: 210,
    description:
      "Investigation seed created without ownership or identity attribution.",
    tags: ["seed"],
  };

  const snapshot = {
    investigation,
    nodes: [seedNode],
    edges: [],
    evidence: [],
    hypotheses: [],
  };

  await investigationRepository.put(snapshot);

  return NextResponse.json(
    {
      data: snapshot,
      meta: {
        repository: investigationRepositoryMeta,
        warning: investigationRepositoryMeta.durable
          ? null
          : "Current MVP repository is ephemeral and may reset between server instances.",
      },
    },
    { status: 201 },
  );
}
