import { NextResponse } from "next/server";
import type {
  InvestigatorContext,
  InvestigatorQuestion,
} from "@/lib/adapters/investigator-adapter";
import { investigatorAdapter } from "@/lib/adapters/investigator-provider-registry";
import { evidence, graphNodes, hypotheses } from "@/lib/mock-data";
import { t, tc } from "@/lib/i18n";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import type { EvidenceItem, GraphNode, Hypothesis } from "@/lib/domain";

/** Localize server-side fallback context (nodeId path) the same way the
 * client localizes the context it sends. */
function localizeNode(node: GraphNode, locale: Locale): GraphNode {
  return { ...node, label: tc(locale, node.label), description: tc(locale, node.description) };
}
function localizeEvidence(item: EvidenceItem, locale: Locale): EvidenceItem {
  return { ...item, title: tc(locale, item.title), detail: tc(locale, item.detail) };
}
function localizeHypothesis(item: Hypothesis, locale: Locale): Hypothesis {
  return {
    ...item,
    claim: tc(locale, item.claim),
    method: tc(locale, item.method),
    counterEvidence: item.counterEvidence.map((entry) => tc(locale, entry)),
  };
}

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
    lang?: string;
    context?: InvestigatorContext;
  } | null;

  const locale: Locale = isLocale(body?.lang) ? body.lang : "en";

  if (!body?.question || !allowedQuestions.has(body.question)) {
    return NextResponse.json(
      { error: t(locale, "api.investigator.questionRequired") },
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
        node: localizeNode(node, locale),
        evidence: evidence.map((item) => localizeEvidence(item, locale)),
        hypothesis: localizeHypothesis(hypotheses[0], locale),
      };
    }
  }

  if (!context) {
    return NextResponse.json(
      { error: t(locale, "api.investigator.contextRequired") },
      { status: 400 },
    );
  }

  const response = await investigatorAdapter.answer({
    question: body.question,
    context,
    locale,
  });

  return NextResponse.json({
    data: response,
    meta: {
      externalModelUsed: false,
      contextOrigin,
    },
  });
}
