import { NextResponse } from "next/server";
import type {
  InvestigatorContext,
  InvestigatorQuestion,
} from "@/lib/adapters/investigator-adapter";
import { investigatorAdapter } from "@/lib/adapters/investigator-provider-registry";
import { evidence, graphNodes, hypotheses } from "@/lib/mock-data";

const allowedQuestions = new Set<InvestigatorQuestion>([
  "EXPLAIN_NODE",
  "EXPLAIN_CONFIDENCE",
  "MISSING_EVIDENCE",
  "NEXT_STEP",
]);

function looksLikeContext(
  value: unknown,
): value is InvestigatorContext {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<InvestigatorContext>;

  return Boolean(
    candidate.node &&
      typeof candidate.node.id === "string" &&
      typeof candidate.node.state === "string" &&
      candidate.hypothesis &&
      typeof candidate.hypothesis.id === "string" &&
      Array.isArray(candidate.evidence),
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    question?: InvestigatorQuestion;
    nodeId?: string;
    context?: InvestigatorContext;
  } | null;

  if (!body?.question || !allowedQuestions.has(body.question)) {
    return NextResponse.json(
      { error: "a supported question is required" },
      { status: 400 },
    );
  }

  let context: InvestigatorContext | null = null;
  let contextOrigin = "curated-sandbox";

  if (looksLikeContext(body.context)) {
    context = {
      node: body.context.node,
      hypothesis: body.context.hypothesis,
      evidence: body.context.evidence.slice(0, 24),
    };
    contextOrigin = "client-normalized";
  } else if (body.nodeId) {
    const node = graphNodes.find((item) => item.id === body.nodeId);

    if (node) {
      context = {
        node,
        evidence,
        hypothesis: hypotheses[0],
      };
    }
  }

  if (!context) {
    return NextResponse.json(
      { error: "valid investigator context is required" },
      { status: 400 },
    );
  }

  const response = await investigatorAdapter.answer({
    question: body.question,
    context,
  });

  return NextResponse.json({
    data: response,
    meta: {
      externalModelUsed: false,
      contextOrigin,
    },
  });
}
