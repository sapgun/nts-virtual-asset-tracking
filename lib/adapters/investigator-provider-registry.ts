import type { InvestigatorAdapter } from "@/lib/adapters/investigator-adapter";
import { RuleBasedInvestigatorAdapter } from "@/lib/adapters/rule-based-investigator-adapter";

export const investigatorAdapter: InvestigatorAdapter =
  new RuleBasedInvestigatorAdapter();
