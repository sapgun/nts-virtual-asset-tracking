# Production deployment runbook

This repository contains both:

- a preserved root `index.html` copy of the original research brief, and
- the current Next.js application under `app/`.

The root HTML is intentionally preserved and must not be used as evidence that the latest Next.js application is the active production deployment.

## Deployment contract

Vercel is explicitly configured as a Next.js project through `vercel.json`.

Before promoting a deployment to production, verify the exact deployment URL:

1. `GET /` returns the Next.js Command Center.
2. `GET /investigations` renders the graph-first workbench.
3. `GET /api/health` returns JSON with `ok: true`.
4. The health response commit matches the intended Git commit.
5. Only after all four checks pass, promote that exact deployment to Production.

## Rollback

If production is unhealthy, use a Vercel deployment rollback / instant rollback first.
Do not revert Git history merely to restore the production alias unless the code itself is known to be faulty.

After a Vercel-only rollback, GitHub `main` may still contain newer application code. Treat Git history and the production alias as separate states.

## Preserved research

The original research brief remains available at:

- `/research` through the Next.js viewer
- `/research-legacy.html` as the preserved static copy

The root `index.html` remains in the repository for preservation and historical compatibility.
