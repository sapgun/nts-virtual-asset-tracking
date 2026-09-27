import { NextResponse } from "next/server";
import {
  createEvidenceTransition,
  validateEvidenceTransition,
  type EvidenceTransitionInput,
} from "@/lib/evidence-audit";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as EvidenceTransitionInput | null;

  if (!body) {
    return NextResponse.json(
      { error: "invalid JSON body" },
      { status: 400 },
    );
  }

  const validation = validateEvidenceTransition(body);

  if (!validation.ok) {
    return NextResponse.json(
      {
        error: "evidence transition rejected",
        details: validation.errors,
      },
      { status: 422 },
    );
  }

  const event = createEvidenceTransition(body);

  return NextResponse.json(
    {
      data: event,
      meta: {
        persisted: false,
        note: "MVP audit event. Persistence adapter is not enabled.",
      },
    },
    { status: 201 },
  );
}
