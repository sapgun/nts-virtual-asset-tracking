# Database migration drafts

These files define the intended durable PostgreSQL data model but are **not executed** by the current branch.

## Current runtime

The application still uses `EphemeralInvestigationRepository`.

## Approval-gated migration

When durable persistence is approved:

1. provision PostgreSQL/Supabase,
2. review privacy/RLS requirements,
3. apply `001_initial.sql`,
4. implement `PostgresInvestigationRepository`,
5. configure secrets in the deployment environment,
6. migrate only non-sensitive synthetic/public investigation data first.

The schema deliberately omits a natural-person identity table from the public MVP.
