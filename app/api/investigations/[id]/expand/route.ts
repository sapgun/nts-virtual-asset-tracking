import { NextResponse } from "next/server";
import { investigationService } from "@/lib/services/investigation-service";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    nodeId?: string;
    depth?: number;
  };

  if (!body.nodeId) {
    return NextResponse.json(
      { error: "nodeId is required" },
      { status: 400 },
    );
  }

  const result = await investigationService.expand({
    investigationId: id,
    nodeId: body.nodeId,
    depth: body.depth,
  });

  return NextResponse.json({ data: result });
}
