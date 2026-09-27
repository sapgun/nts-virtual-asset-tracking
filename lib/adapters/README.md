# Adapter boundary

The application UI consumes normalized investigation-domain objects and should never depend directly on a chain vendor or indexing provider.

## Current

- `MockInvestigationAdapter`: synthetic deterministic dataset for UI and workflow development.

## Planned

- `BlockscoutAdapter`: EVM transactions, transfers, contracts and traces.
- `RpcAdapter`: protocol-native event reads where explorer APIs are insufficient.
- `BridgeAdapter`: protocol-specific message identifiers and source/destination event matching.
- `EntityAdapter`: curated public-service labels with provenance.
- `AiInvestigatorAdapter`: explanation/recommendation layer over normalized evidence, never a source of silent attribution.

Every adapter response must include provenance and whether the data is synthetic.
