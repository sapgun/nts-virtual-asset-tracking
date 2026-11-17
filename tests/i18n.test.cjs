const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');

const root = path.join(__dirname, '..');

// Transpile the TS modules into a temp dir mirroring the repo layout so
// relative imports resolve, then require the compiled output.
const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-test-'));
const sources = [
  'lib/i18n/locales.ts',
  'lib/i18n/en.ts',
  'lib/i18n/ko.ts',
  'lib/i18n/index.ts',
  'lib/mock-data.ts',
  'lib/capabilities.ts',
  'lib/case-playback-data.ts',
  'lib/evidence-audit-data.ts',
  'lib/academy-data.ts',
  'lib/bridge-matching.ts',
  'lib/bridge-matching-data.ts',
  'lib/evidence-quality.ts',
  'lib/imported-investigation.ts',
  'lib/adapters/rule-based-investigator-adapter.ts',
];
for (const rel of sources) {
  const src = fs.readFileSync(path.join(root, rel), 'utf8');
  const compiled = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const out = path.join(buildDir, rel.replace(/\.ts$/, '.js'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, compiled.outputText);
}
const req = (rel) => require(path.join(buildDir, rel));
const i18n = req('lib/i18n/index.js');
const locales = req('lib/i18n/locales.js');
const { en } = req('lib/i18n/en.js');
const { ko, contentKo } = req('lib/i18n/ko.js');
const mockData = req('lib/mock-data.js');
const { systemCapabilities } = req('lib/capabilities.js');
const { casePlaybacks } = req('lib/case-playback-data.js');
const { evidenceTransitionLedger } = req('lib/evidence-audit-data.js');
const { challenges } = req('lib/academy-data.js');
const bridgeMatching = req('lib/bridge-matching.js');
const bridgeData = req('lib/bridge-matching-data.js');
const { calculateEvidenceQuality } = req('lib/evidence-quality.js');
const { buildImportedInvestigation } = req('lib/imported-investigation.js');
const { RuleBasedInvestigatorAdapter } = req('lib/adapters/rule-based-investigator-adapter.js');

// ---- helpers ----

function keyPaths(obj, prefix = '') {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    const p = prefix ? prefix + '.' + key : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      out.push(...keyPaths(value, p));
    } else {
      out.push(p);
    }
  }
  return out.sort();
}

function collectStrings(value, into) {
  if (typeof value === 'string') { into.push(value); return; }
  if (Array.isArray(value)) { for (const item of value) collectStrings(item, into); return; }
  if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, into);
  }
}

// Strings that are identifiers, codes, proper names or machine values and
// are intentionally left in English in both locales.
const ALLOW_EXACT = new Set([
  'Ethereum', 'Arbitrum', 'Base', 'ethereum',
  'Synthetic Message Bridge', 'Synthetic Liquidity Bridge',
  'msg:eth:731:synthetic-emitter',
  'public-explorer', 'public-source-adapter', 'analyst-demo',
  'rule-based-investigator-v1-cited',
  'seed', 'wallet', 'short-hold', 'depletion', 'bridge', 'contract',
  'cluster', 'hypothesis', 'vasp', 'leverage-point', 'public-data',
  'counterparty',
  // Internal ids (graph nodes/edges, capability ids, challenge ids) —
  // never rendered as prose.
  'pass', 'exchange', 'mixer', 'e1', 'e2', 'e3', 'e4', 'e5',
  'public-chain', 'investigation-repository', 'copilot', 'bridge-lab',
  'external-ai', 'person-attribution',
  'wallet-link', 'bridge-key', 'mixer-candidates',
  'Bitcoin Fog', 'Tornado Cash · Lazarus', 'ChipMixer', 'Silk Road',
  'bitcoin-fog', 'tornado-cash', 'chipmixer', 'silk-road',
  'Blockscout',
]);
const ALLOW_RE = [
  /^[A-Z][A-Z0-9 _-]*$/, // state codes, enums, IDs (EV-01, INV-2026-001, SHA-256)
  /^0x[\w.]+$/, // addresses, hashes, truncated seeds (0xA7...19F2)
  /^\d+(\.\d+)?$/, // bare numbers
  /^[\d.]+ (ETH|USDC)$/, // amount labels (1.20 ETH)
  /^[a-z]+-\d+$/, // step ids (bf-01, tc-02, cm-03, sr-04)
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO timestamps
  /^https?:\/\//,
  /^public:\/\//,
];

function isAllowed(text) {
  if (ALLOW_EXACT.has(text)) return true;
  return ALLOW_RE.some((re) => re.test(text));
}

// ---- tests ----

test('EN and KO dictionaries have identical key sets', () => {
  assert.deepEqual(keyPaths(ko), keyPaths(en));
});

test('every KO string is non-empty', () => {
  const walk = (obj, path = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const p = path ? path + '.' + key : key;
      if (value !== null && typeof value === 'object') walk(value, p);
      else assert.ok(typeof value === 'string' && value.trim().length > 0, `empty KO string at ${p}`);
    }
  };
  walk(ko);
});

test('every data-module string is translated or explicitly allowed', () => {
  const strings = [];
  collectStrings(mockData, strings);
  collectStrings(systemCapabilities, strings);
  collectStrings(casePlaybacks, strings);
  collectStrings(evidenceTransitionLedger, strings);
  collectStrings(challenges, strings);
  // Bridge reasons/limitations are generated, not stored: call the matcher.
  for (const pair of [bridgeData.deterministicBridgePair, bridgeData.heuristicBridgePair]) {
    const result = bridgeMatching.matchBridgeObservations(pair[0], pair[1]);
    collectStrings(result.reasons, strings);
    collectStrings(result.limitations, strings);
  }
  // Evidence-quality summaries: drive all three branches.
  const ev = (state) => ({ id: 'X', title: 't', state, sourceType: 'ONCHAIN', confidence: 1, detail: 'd' });
  const hyp = (state, counter) => ({ id: 'H', claim: 'c', method: 'm', confidence: 0.5, state, supportingEvidence: [], counterEvidence: counter });
  collectStrings([
    calculateEvidenceQuality([ev('OBSERVED')], hyp('INFERRED', ['a', 'b'])).summary,
    calculateEvidenceQuality([ev('UNVERIFIED'), ev('UNVERIFIED')], hyp('UNVERIFIED', [])).summary,
    calculateEvidenceQuality([ev('OBSERVED'), ev('ATTRIBUTED'), ev('OBSERVED')], hyp('INFERRED', ['a', 'b'])).summary,
  ], strings);

  const missing = [...new Set(strings)].filter(
    (text) => !isAllowed(text) && !(text in contentKo),
  );
  assert.deepEqual(missing, [], `untranslated content strings: ${JSON.stringify(missing)}`);
});

test('locale resolution order: ?lang= > cookie > storage > default', () => {
  const { resolveLocale } = locales;
  assert.equal(resolveLocale({}), 'en');
  assert.equal(resolveLocale({ stored: 'ko' }), 'ko');
  assert.equal(resolveLocale({ cookie: 'ko', stored: 'en' }), 'ko');
  assert.equal(resolveLocale({ param: 'en', cookie: 'ko', stored: 'ko' }), 'en');
  assert.equal(resolveLocale({ param: 'xx', cookie: 'ko' }), 'ko');
  assert.equal(resolveLocale({ stored: 'xx' }), 'en');
});

test('t() interpolates and falls back to English, then to the key', () => {
  assert.equal(i18n.t('en', 'shell.nav.cases.label'), 'Cases');
  assert.equal(i18n.t('ko', 'shell.nav.cases.label'), '사건');
  assert.equal(i18n.t('ko', 'evidence.audit.recorded', { count: 3 }), '3건 기록됨');
  assert.equal(i18n.t('ko', 'no.such.key'), 'no.such.key');
});

test('tc() translates known content and passes unknown strings through', () => {
  assert.equal(i18n.tc('en', 'Seed Wallet'), 'Seed Wallet');
  assert.equal(i18n.tc('ko', 'Seed Wallet'), '시드 지갑');
  assert.equal(i18n.tc('ko', '0xA7...19F2'), '0xA7...19F2');
});

test('imported investigation builds localized strings for both locales', async () => {
  const draft = {
    id: 'INV-PUBLIC-TEST',
    title: 'Public Ethereum Observation',
    seed: '0xA700000000000000000000000000000000000001',
    chain: 'ethereum',
    createdAt: '2026-11-17T00:00:00Z',
    source: 'public-explorer',
    transactions: [{
      hash: '0xabc0000000000000000000000000000000000000000000000000000000000001',
      blockNumber: 1,
      timestamp: '2026-11-17T00:00:00Z',
      from: '0xA700000000000000000000000000000000000001',
      to: '0xB200000000000000000000000000000000000002',
      valueWei: '1000000000000000000',
      method: null,
      status: 'ok',
      provenance: { provider: 'Blockscout', sourceUrl: 'https://example.com', observedAt: '2026-11-17T00:00:00Z' },
    }],
  };
  const enModel = buildImportedInvestigation(draft, 'en');
  const koModel = buildImportedInvestigation(draft, 'ko');
  assert.equal(enModel.nodes[0].label, 'Imported Seed');
  assert.equal(koModel.nodes[0].label, '가져온 시드');
  assert.match(koModel.nodes[0].description, /그래프 탐색기/);
  assert.match(koModel.evidence[0].title, /관찰된 트랜잭션/);
  assert.match(koModel.hypothesis.claim, /가설이 아직 없습니다/);
});

test('investigator adapter answers in the requested locale', async () => {
  const adapter = new RuleBasedInvestigatorAdapter();
  const context = {
    node: mockData.graphNodes[0],
    hypothesis: mockData.hypotheses[0],
    evidence: mockData.evidence,
  };
  for (const question of ['EXPLAIN_NODE', 'EXPLAIN_CONFIDENCE', 'MISSING_EVIDENCE', 'NEXT_STEP']) {
    const enAns = await adapter.answer({ question, context, locale: 'en' });
    const koAns = await adapter.answer({ question, context, locale: 'ko' });
    assert.notEqual(koAns.answer, enAns.answer, question);
    assert.match(koAns.answer, /[가-힣]/, `${question} KO answer has no Hangul`);
    assert.ok(koAns.cautions.every((c) => /[가-힣]/.test(c)), `${question} KO cautions`);
  }
});
