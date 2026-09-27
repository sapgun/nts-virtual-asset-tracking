import { NextResponse } from "next/server";
import type { InvestigatorQuestion } from "@/lib/adapters/investigator-adapter";
import { investigatorAdapter } from "@/lib/adapters/investigator-provider-registry";
import { evidence, graphNodes, hypotheses } from "@/lib/mock-data";

const allowedQuestions = new Set<InvestigatorQuestion>([
  "EXPLAIN_NODE",
  "EXPLAIN_CONFIDENCE",
  "MISSING_EVIDENCE",
  "NEXT_STEP",
]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    question?: InvestigatorQuestion;
    nodeId?: string;
  } | null;

  if (
    !body?.question ||
    !allowedQuestions.has(body.question) ||
    !body.nodeId
  ) {
    return NextResponse.json(
      { error: "question and nodeId are required" },
      { status: 400 },
    );
  }

  const node = graphNodes.find((item) => item.id === body.nodeId);

  if (!node) {
    return NextResponse.json(
      { error: "node not found" },
      { status: 404 },
    );
  }

  const response = await investigatorAdapter.answer({
    question: body.question,
    context: {
      node,
      evidence,
      hypothesis: hypotheses[0],
    },
  });

  return NextResponse.json({
    data: response,
    meta: {
      externalModelUsed: false,
      syntheticContext: true,
    },
  });
}
