const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'lib/scene-graph.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
const mod = new Module(path.join(root, 'lib/scene-graph.test-runtime.cjs'), module);
mod._compile(compiled.outputText, path.join(root, 'lib/scene-graph.test-runtime.cjs'));
const { layoutScene, visibleScene, edgeGeometry, nodeConnections, safeSourceUrl, starField, globePoints } = mod.exports;
const node = (id) => ({ id, label: id, kind: 'wallet', state: 'OBSERVED', confidence: 1, x: 1, y: 2, description: 'Test fixture' });
const edge = (id, from, to, step) => ({ id, source: from, target: to, step, state: 'OBSERVED', confidence: 1, label: id });

test('incoming transfers reveal both endpoints, including a nonstandard imported seed', () => {
  const result = visibleScene([node('import-seed'), node('sender')], [edge('e1', 'sender', 'import-seed', 1)], 1, 'import-seed');
  assert.deepEqual(result.nodes.map((n) => n.id), ['import-seed', 'sender']);
});
test('future source-only nodes are not leaked before their step', () => {
  const result = visibleScene([node('seed'), node('a'), node('future')], [edge('a', 'seed', 'a', 1), edge('f', 'future', 'seed', 3)], 1, 'seed');
  assert.deepEqual(result.nodes.map((n) => n.id), ['seed', 'a']);
});
test('an empty graph still shows the seed; dangling edges are rejected', () => {
  assert.equal(visibleScene([node('s')], [edge('bad', 's', 'missing', 1)], 1, 's').edges.length, 0);
  assert.equal(visibleScene([node('s')], [], 1, 's').nodes.length, 1);
});
test('layout is deterministic, bounded and does not mutate source facts', () => {
  const nodes = [node('seed'), node('a'), node('b'), node('c')];
  const before = JSON.stringify(nodes);
  const result = layoutScene(nodes, 'seed');
  assert.equal(JSON.stringify(nodes), before);
  assert.deepEqual(result, layoutScene(nodes, 'seed'));
  for (const n of result) { assert.ok(n.x > 0 && n.x < 1080 && n.y > 0 && n.y < 690); assert.equal(n.state, 'OBSERVED'); }
});
test('reverse arrows attach to the correct side of each circular node', () => {
  const a = { ...node('a'), x: 800, y: 200, radius: 20 };
  const b = { ...node('b'), x: 100, y: 200, radius: 20 };
  assert.match(edgeGeometry(a, b).path, /^M 777 200/);
  assert.match(edgeGeometry(a, b).path, /129 200$/);
});
test('self transactions use an explicit loop without NaN coordinates', () => {
  const a = { ...node('a'), radius: 20 };
  assert.match(edgeGeometry(a, a).path, / C /);
  assert.ok(!edgeGeometry(a, a).path.includes('NaN'));
});
test('connection counts report relations, never fabricated transaction amounts', () => {
  const result = nodeConnections('s', [edge('in', 'a', 's', 1), edge('out', 's', 'b', 1), edge('self', 's', 's', 1)]);
  assert.deepEqual(result, { incoming: 2, outgoing: 2, total: 3 });
  assert.ok(!('totalUsd' in result));
});
test('source links reject script, data and malformed URI schemes', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', '/relative', 'file:///etc/passwd', 'not a url']) assert.equal(safeSourceUrl(url), null);
  assert.equal(safeSourceUrl('https://example.org/evidence'), 'https://example.org/evidence');
});
test('decorative star/globe geometry is finite and deterministic', () => {
  assert.deepEqual(starField(), starField());
  assert.equal(starField(20).length, 20);
  assert.ok(globePoints().every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)));
});
const uiPaths = ['components/app-shell.tsx', 'components/investigation-workbench.tsx', 'components/workspace/icons.tsx', 'components/workspace/topology-canvas.tsx', 'components/workspace/inspector.tsx'];
for (const file of uiPaths) test(`${file}: TypeScript/JSX syntax`, () => {
  const input = fs.readFileSync(path.join(root, file), 'utf8');
  const result = ts.transpileModule(input, { fileName: file, reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  assert.deepEqual(result.diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error) ?? [], []);
});
test('every module-scoped class used by the new UI exists', () => {
  const css = fs.readFileSync(path.join(root, 'components/workspace/workspace.module.css'), 'utf8');
  for (const file of uiPaths) {
    const input = fs.readFileSync(path.join(root, file), 'utf8');
    for (const [, name] of input.matchAll(/\bs\.([A-Za-z][A-Za-z0-9]*)/g)) assert.ok(css.includes(`.${name}`), `${file}: missing .${name}`);
  }
});
