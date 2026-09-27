-- NTS Virtual Asset Intelligence Workbench
-- Migration draft only. Not executed by this branch.

create extension if not exists pgcrypto;

create table if not exists investigations (
  id text primary key,
  title text not null,
  seed text not null,
  chain text not null,
  status text not null check (status in ('ACTIVE','REVIEW','CLOSED')),
  evidence_completeness integer not null default 0 check (evidence_completeness between 0 and 100),
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists graph_nodes (
  id uuid primary key default gen_random_uuid(),
  investigation_id text not null references investigations(id) on delete cascade,
  external_id text not null,
  kind text not null,
  label text not null,
  evidence_state text not null check (evidence_state in ('OBSERVED','INFERRED','ATTRIBUTED','UNVERIFIED')),
  confidence numeric(5,4) not null default 0 check (confidence between 0 and 1),
  metadata_json jsonb not null default '{}'::jsonb,
  provenance_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (investigation_id, external_id)
);

create table if not exists graph_edges (
  id uuid primary key default gen_random_uuid(),
  investigation_id text not null references investigations(id) on delete cascade,
  source_node_id uuid not null references graph_nodes(id) on delete cascade,
  target_node_id uuid not null references graph_nodes(id) on delete cascade,
  relationship_type text not null,
  asset text,
  amount text,
  tx_hash text,
  evidence_state text not null check (evidence_state in ('OBSERVED','INFERRED','ATTRIBUTED','UNVERIFIED')),
  confidence numeric(5,4) not null default 0 check (confidence between 0 and 1),
  metadata_json jsonb not null default '{}'::jsonb,
  provenance_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists evidence (
  id text primary key,
  investigation_id text not null references investigations(id) on delete cascade,
  title text not null,
  evidence_state text not null check (evidence_state in ('OBSERVED','INFERRED','ATTRIBUTED','UNVERIFIED')),
  source_type text not null check (source_type in ('ONCHAIN','PUBLIC_SOURCE','ANALYST_NOTE','OFFCHAIN')),
  confidence numeric(5,4) not null default 0 check (confidence between 0 and 1),
  detail text not null,
  source_uri text,
  content_hash text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists hypotheses (
  id text primary key,
  investigation_id text not null references investigations(id) on delete cascade,
  claim text not null,
  method text not null,
  confidence numeric(5,4) not null default 0 check (confidence between 0 and 1),
  state text not null check (state in ('INFERRED','UNVERIFIED')),
  supporting_evidence_ids text[] not null default '{}',
  counter_evidence_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  uri text not null,
  publisher text,
  retrieved_at timestamptz not null default now(),
  content_hash text,
  metadata_json jsonb not null default '{}'::jsonb,
  unique (uri, content_hash)
);

create table if not exists evidence_transition_events (
  id uuid primary key default gen_random_uuid(),
  investigation_id text not null references investigations(id) on delete cascade,
  evidence_id text not null references evidence(id) on delete cascade,
  from_state text not null check (from_state in ('OBSERVED','INFERRED','ATTRIBUTED','UNVERIFIED')),
  to_state text not null check (to_state in ('OBSERVED','INFERRED','ATTRIBUTED','UNVERIFIED')),
  actor text not null,
  method text not null,
  rationale text not null,
  provenance_uri text,
  created_at timestamptz not null default now(),
  check (from_state <> to_state),
  check (to_state <> 'ATTRIBUTED' or provenance_uri is not null)
);

create table if not exists investigation_activity (
  id uuid primary key default gen_random_uuid(),
  investigation_id text not null references investigations(id) on delete cascade,
  activity_type text not null,
  actor text,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_graph_nodes_investigation
  on graph_nodes(investigation_id);

create index if not exists idx_graph_edges_investigation
  on graph_edges(investigation_id);

create index if not exists idx_graph_edges_tx_hash
  on graph_edges(tx_hash)
  where tx_hash is not null;

create index if not exists idx_evidence_investigation
  on evidence(investigation_id);

create index if not exists idx_transition_events_evidence
  on evidence_transition_events(evidence_id, created_at desc);

create index if not exists idx_activity_investigation
  on investigation_activity(investigation_id, created_at desc);

-- Intentionally no natural-person identity table in the public MVP schema.
-- Such a capability requires separate privacy/legal governance and explicit approval.
