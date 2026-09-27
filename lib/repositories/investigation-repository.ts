import type { InvestigationSnapshot } from "@/lib/adapters/investigation-adapter";

export interface InvestigationRepository {
  get(id: string): Promise<InvestigationSnapshot | null>;
  put(snapshot: InvestigationSnapshot): Promise<void>;
  list(): Promise<InvestigationSnapshot[]>;
}

export interface RepositoryMeta {
  kind: string;
  durable: boolean;
}
