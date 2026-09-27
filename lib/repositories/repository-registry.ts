import type {
  InvestigationRepository,
  RepositoryMeta,
} from "@/lib/repositories/investigation-repository";
import { EphemeralInvestigationRepository } from "@/lib/repositories/ephemeral-investigation-repository";

export const investigationRepository: InvestigationRepository =
  new EphemeralInvestigationRepository();

export const investigationRepositoryMeta: RepositoryMeta = {
  kind: "ephemeral-memory",
  durable: false,
};
