import { NextResponse } from "next/server";
import {
  capabilitySummary,
  systemCapabilities,
} from "@/lib/capabilities";
import { investigationRepositoryMeta } from "@/lib/repositories/repository-registry";

export async function GET() {
  return NextResponse.json({
    data: systemCapabilities,
    summary: capabilitySummary(),
    runtime: {
      repository: investigationRepositoryMeta,
      externalAiEnabled: false,
      naturalPersonAttributionEnabled: false,
    },
  });
}
