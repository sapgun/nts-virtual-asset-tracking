import { NextResponse } from "next/server";
import { investigationService } from "@/lib/services/investigation-service";
import {
  investigationRepository,
  investigationRepositoryMeta,
} from "@/lib/repositories/repository-registry";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const stored = await investigationRepository.get(id);

  if (stored) {
    return NextResponse.json({
      data: stored,
      meta: {
        source: "repository",
        repository: investigationRepositoryMeta,
      },
    });
  }

  const sandbox = await investigationService.get(id);

  if (!sandbox) {
    return NextResponse.json(
      { error: "investigation not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: sandbox,
    meta: {
      source: "curated-sandbox",
      synthetic: true,
    },
  });
}
