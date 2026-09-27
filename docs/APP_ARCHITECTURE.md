# Virtual Asset Intelligence Workbench — App Architecture

## Product boundary

This repository evolves from a long-form technical intelligence brief into an evidence-aware investigation and learning workbench.

The original report is preserved unchanged as `public/research-legacy.html`. The application layer does not rewrite or reinterpret the source copy.

## Core product principles

1. **Observed is not inferred.**
2. **Attributed entity is not a natural person.**
3. **Every analytical claim has provenance, confidence, supporting evidence and counter-evidence.**
4. **The graph is an exploration surface, not a verdict engine.**
5. **Synthetic and curated public data are the default until data adapters are explicitly enabled.**

## Architecture

```
app/
  page.tsx                  Command / product overview
  investigations/          Investigation workspace
  cases/                   Public case reconstruction
  evidence/                Evidence register
  academy/                 Training modules
  research/                Preserved report viewer

components/
  app-shell.tsx             Navigation + global shell
  investigation-workbench  Analyst workspace
  graph-canvas.tsx          Visualization adapter v0 (SVG)
  evidence-panel.tsx        Node/hypothesis/evidence context
  state-badge.tsx           Evidence-state primitive

lib/
  domain.ts                 Domain contracts
  mock-data.ts              Synthetic / curated development data
```

## Domain model

```
Investigation
  ├── Seed
  ├── GraphNode
  │    ├── Address
  │    ├── Entity
  │    ├── Contract
  │    └── Service
  ├── GraphEdge
  │    └── Transaction / relationship
  ├── Hypothesis
  ├── Evidence
  └── Source
```

All graph and evidence objects use one of:

- `OBSERVED`
- `INFERRED`
- `ATTRIBUTED`
- `UNVERIFIED`

## Adapter roadmap

### DataAdapter

Future adapters can provide normalized transactions without changing UI/domain components.

Candidates:
- Blockscout
- chain RPC providers
- protocol-specific bridge event adapters
- curated public datasets

### GraphAdapter

v0: SVG React component.

Future:
- Sigma.js / Cytoscape for large 2D graphs
- React Three Fiber / WebGPU for chain-space and cinematic playback

### IntelligenceAdapter

Future AI investigator receives only normalized graph context, evidence state and cited sources. It should explain and propose next investigative steps, never silently upgrade inference into attribution.

### PersistenceAdapter

v0: in-memory mock data.

Future:
- PostgreSQL for investigations, evidence, users and case metadata
- graph database (Memgraph / Neo4j) when relationship traversal becomes operationally necessary
- ClickHouse only when event volume justifies analytical storage

## API boundary proposal

```
POST /api/investigations
GET  /api/investigations/:id
POST /api/investigations/:id/expand
POST /api/investigations/:id/hypotheses
POST /api/investigations/:id/evidence
GET  /api/investigations/:id/export
```

Expansion responses should always return provenance metadata and an evidence state.

## Security / governance boundary

The public product should default to:
- synthetic cases,
- public protocol addresses,
- publicly documented incident addresses,
- educational reconstructions.

Production connectors, private datasets, sensitive identity data, or automated natural-person attribution require a separate governance review and permission model.

## Delivery phases

### Phase 1 — current branch
- App Router shell
- domain contracts
- investigation workspace
- graph playback
- evidence model
- JSON evidence export
- case/evidence/academy scaffolds
- preserved legacy research

### Phase 2
- case playback engine
- persisted investigations
- searchable evidence room
- graph expansion actions
- protocol/chain adapters

### Phase 3
- AI Investigator with cited graph context
- entity intelligence
- bridge message matching
- mixer candidate-set lab

### Phase 4
- collaborative analyst workspace
- signed evidence bundles
- role-based access control
- production-grade indexing
