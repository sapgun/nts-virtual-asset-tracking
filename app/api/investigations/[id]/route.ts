import { NextResponse } from "next/server";
import { investigationService } from "@/lib/services/investigation-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const snapshot = await investigationService.get(id);

  if (!snapshot) {
    return NextResponse.json(
      { error: "investigation not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: snapshot,
    meta: {
      adapter: "mock",
      synthetic: true,
    },
  });
}
