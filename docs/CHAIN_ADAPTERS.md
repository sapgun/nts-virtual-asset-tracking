# Chain data adapters

The first real-data adapter uses Blockscout API v2 for public Ethereum transaction observations.

## Endpoint

The server-side adapter calls:

`GET {BASE_URL}/api/v2/addresses/{address}/transactions`

The UI does not call Blockscout directly. External responses are normalized into the application's domain boundary first.

## Current network registry

- Ethereum
  - default public explorer: `https://eth.blockscout.com`
  - override: `BLOCKSCOUT_ETHEREUM_BASE_URL`

## Safety invariant

Data returned by this adapter is marked `OBSERVED` only for transaction-level facts exposed by the explorer.

It does **not**:
- infer common ownership,
- identify a natural person,
- create an entity attribution,
- turn a public address label into legal identity evidence.

Those transitions belong to separate hypothesis/entity/evidence adapters and require provenance.

## Application endpoint

`GET /api/chain/ethereum/addresses/{address}/transactions`

The response includes normalized transaction records and source provenance.
