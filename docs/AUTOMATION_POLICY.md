# Build automation and approval gates

## Default: auto-execute

The following are safe to perform without approval inside feature branches:

- create or modify application code,
- refactor components and internal APIs,
- add tests and static analysis,
- create reversible Git branches and commits,
- create/update preview deployments,
- add synthetic fixtures and curated public-case data,
- fix build/type/runtime errors,
- improve responsive/accessibility behavior,
- update non-sensitive architecture documentation,
- open pull requests without merging them.

## Approval gate

Stop and request explicit approval before:

1. **Production merge or destructive production mutation**
   - merge to main when it changes the live app architecture,
   - delete production data/resources,
   - change production domains or DNS.

2. **Sensitive permissions or secrets**
   - request wallet keys, private API keys, KYC/identity datasets,
   - grant broad database or cloud permissions,
   - connect private investigative datasets.

3. **Legal / privacy boundary**
   - enable natural-person attribution,
   - process non-public personal data,
   - introduce surveillance or private identity correlation.

4. **Material spend**
   - provision infrastructure or services with meaningful recurring cost,
   - especially any action approaching or exceeding the existing high-cost escalation threshold.

5. **Brand / public claims**
   - publish claims that could imply official NTS affiliation,
   - market the system as having capabilities not demonstrated by the product.

6. **Scope / priority escalation**
   - pivot the project away from the agreed investigation-workbench direction,
   - begin a substantially new workstream that would consume more than a normal implementation cycle.

## Current product safety boundary

Until explicitly approved, the app operates on:
- synthetic investigation data,
- public blockchain data,
- public protocol/entity labels,
- publicly documented cases.

It must not present inference as legal identity attribution.
