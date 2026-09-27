import type { InvestigationSnapshot } from "@/lib/adapters/investigation-adapter";
import type { InvestigationRepository } from "@/lib/repositories/investigation-repository";

declare global {
  // eslint-disable-next-line no-var
  var __ntsInvestigationStore:
    | Map<string, InvestigationSnapshot>
    | undefined;
}

function store() {
  if (!globalThis.__ntsInvestigationStore) {
    globalThis.__ntsInvestigationStore =
      new Map<string, InvestigationSnapshot>();
  }

  return globalThis.__ntsInvestigationStore;
}

export class EphemeralInvestigationRepository
  implements InvestigationRepository
{
  async get(id: string) {
    return store().get(id) ?? null;
  }

  async put(snapshot: InvestigationSnapshot) {
    store().set(snapshot.investigation.id, snapshot);
  }

  async list() {
    return Array.from(store().values()).sort((a, b) =>
      b.investigation.createdAt.localeCompare(
        a.investigation.createdAt,
      ),
    );
  }
}
