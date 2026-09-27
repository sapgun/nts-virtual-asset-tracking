# Graph-first visual implementation

## Delivery scope

Implements the approved visual direction as React components and a scoped CSS module.
This is not an image background or an additional image-generation pass.

Based on app/app-mvp-workbench at 85df93bea485818dbbb0609b232f95bbbfdd9ac0.
Production main is not modified by this implementation commit.

### Real controls

- Compact navigation with current-page state, all-page mobile menu and Ctrl/Cmd+K workspace search.
- Circular SVG nodes, clipped directional edges, selected-node glow, a source-data popover, decorative globe and perspective grid.
- Drag-to-pan, zoom in/out, reset view, keyboard zoom/pan, background-layer toggle.
- Previous/play/pause/next step, step slider and browser fullscreen with failure feedback.
- Closable Node / Evidence / Analysis / Activity inspector, keyboard-operated tabs and mobile focus handling.
- Existing hypothesis builder, evidence-quality panel and rule-based investigator remain connected.
- Newly created hypotheses remain in the active session and are included in exports.
- Packet export includes nodes, edges, visible edges, evidence, hypotheses and session activity.

### Content / evidence boundary

The existing research, case source copy, mock data and public-chain adapters are not edited.
The approved visual uses fictitious balances and risk labels. These are NOT copied into the app.
The graph displays only nodes and edges in its dataset; it does not invent satellite addresses,
financial totals, sanctions labels, identity matches or laundering allegations to fill the screen.

Metrics shown by this pass are incoming links, outgoing links and case-level evidence count.
Synthetic mode is visibly identified, including on small screens. Numerical support levels are
explicitly not calibrated identity or guilt probabilities. Case-level evidence is not silently
relabelled as proof about an individual selected node.

The layout is a presentation projection: source coordinates and evidence metadata are not mutated.
Only visible edge endpoints and the seed are revealed by playback. Incoming-only and reverse-flow
visibility and arrow attachment bugs are covered by tests.

### Files

- components/app-shell.tsx
- components/investigation-workbench.tsx
- components/workspace/icons.tsx
- components/workspace/topology-canvas.tsx
- components/workspace/inspector.tsx
- components/workspace/workspace.module.css
- lib/scene-graph.ts
- tests/scene-graph.test.cjs

### Checks

Run after installing the repository's existing development dependencies:

```sh
node --test tests/scene-graph.test.cjs
npm run typecheck
npm run build
```

The first command covers 9 pure-function checks, 5 TypeScript/JSX syntax checks and
1 CSS-module reference check. It is not a substitute for the final two commands or a
hydrated end-to-end browser test.

Local delivery validation: all 15 checks pass. A static Chromium layout harness was also
used to inspect desktop/mobile geometry; it does not validate React hydration or API calls.

Full Next.js build and live preview must be confirmed from the new commit's deployment status.
The local environment could not install the project's dependencies because outbound DNS is
unavailable. An earlier deployment had both rate-limit and generic build-failure reports;
this document does not attribute the new deployment's status to either without new evidence.

### Accessibility / motion

Visible focus outlines; native dialog search; keyboard tabs and node activation; mobile
inspector focus containment and Escape close. Reduced-motion preference disables decorative
motion. Edge particles and playback stop when the document is hidden. Small screens retain
access to every route in an explicit menu rather than silently removing navigation.
