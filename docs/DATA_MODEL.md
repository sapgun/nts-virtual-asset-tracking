# Data model

## Why relational first

The first production persistence layer should use PostgreSQL. It is enough for investigations, evidence, hypotheses, sources, user access and reproducible audit history. A graph database should be added only when multi-hop traversal volume or interactive graph exploration becomes a real bottleneck.

## Core tables

### investigations

- id
- title
- seed
- chain
- status
- created_by
- created_at
- updated_at

### graph_nodes

- id
- investigation_id
- external_id
- kind
- label
- evidence_state
- confidence
- metadata_json
- provenance_json
- created_at

### graph_edges

- id
- investigation_id
- source_node_id
- target_node_id
- relationship_type
- asset
- amount
- tx_hash
- evidence_state
- confidence
- metadata_json
- provenance_json
- created_at

### evidence

- id
- investigation_id
- title
- evidence_state
- source_type
- confidence
- detail
- source_uri
- content_hash
- metadata_json
- created_at

### hypotheses

- id
- investigation_id
- claim
- method
- confidence
- status
- supporting_evidence_ids
- counter_evidence_json
- created_at
- reviewed_at

### sources

- id
- source_type
- uri
- publisher
- retrieved_at
- content_hash
- metadata_json

## Evidence invariant

No persistence write may silently promote a value across this sequence:

```
OBSERVED -> INFERRED -> ATTRIBUTED
```

Promotion requires an explicit event containing:
- previous state,
- next state,
- actor or adapter,
- method,
- provenance,
- timestamp.

`UNVERIFIED` is not a lower numerical confidence score. It means the required corroborating evidence class is missing.

## Graph projection

The application may later project relational rows into Memgraph or Neo4j:

```
(Address)-[:TRANSFERRED_TO]->(Address)
(Address)-[:INTERACTED_WITH]->(Contract)
(Address)-[:ATTRIBUTED_TO]->(Entity)
(Evidence)-[:SUPPORTS]->(Hypothesis)
(Evidence)-[:CONTRADICTS]->(Hypothesis)
```

PostgreSQL remains the source of truth for provenance and auditability.
