import type {
  ExpansionRequest,
  InvestigationAdapter,
} from "@/lib/adapters/investigation-adapter";
import { MockInvestigationAdapter } from "@/lib/adapters/mock-investigation-adapter";

const defaultAdapter: InvestigationAdapter = new MockInvestigationAdapter();

export class InvestigationService {
  constructor(private readonly adapter: InvestigationAdapter = defaultAdapter) {}

  async get(id: string) {
    return this.adapter.getInvestigation(id);
  }

  async expand(request: ExpansionRequest) {
    return this.adapter.expand(request);
  }
}

export const investigationService = new InvestigationService();
