const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');

const root = path.join(__dirname, '..');

// Transpile the TS modules into a temp dir mirroring the repo layout so
// relative imports resolve, then require the compiled output.
const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tax-calc-test-'));
const sources = [
  'lib/tax-calculator.ts',
  'lib/i18n/locales.ts',
  'lib/i18n/en.ts',
  'lib/i18n/ko.ts',
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
const calc = req('lib/tax-calculator.js');
const { en } = req('lib/i18n/en.js');
const { ko } = req('lib/i18n/ko.js');

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

test('zero gains produce zero tax', () => {
  assert.deepEqual(calc.calcTax({ gainsKrw: 0, carryLossKrw: 0, carryforward: false, effectiveYear: 2027 }), {
    taxableBaseKrw: 0,
    nationalTaxKrw: 0,
    localTaxKrw: 0,
    totalTaxKrw: 0,
    afterTaxKrw: 0,
    firstFiling: '2028-05',
  });
});

test('gains exactly at the KRW 2.5M basic deduction are not taxed', () => {
  const r = calc.calcTax({ gainsKrw: 2_500_000, carryLossKrw: 0, carryforward: false, effectiveYear: 2027 });
  assert.equal(r.taxableBaseKrw, 0);
  assert.equal(r.totalTaxKrw, 0);
  assert.equal(r.afterTaxKrw, 2_500_000);
});

test('gains just above the deduction leave a KRW 1 base', () => {
  const r = calc.calcTax({ gainsKrw: 2_500_001, carryLossKrw: 0, carryforward: false, effectiveYear: 2027 });
  assert.equal(r.taxableBaseKrw, 1);
  assert.equal(r.totalTaxKrw, 0);
});

test('KRW 30M gains: base 27.5M, tax 6.05M, after-tax 23.95M', () => {
  const r = calc.calcTax({ gainsKrw: 30_000_000, carryLossKrw: 0, carryforward: false, effectiveYear: 2027 });
  assert.equal(r.taxableBaseKrw, 27_500_000);
  assert.equal(r.nationalTaxKrw, 5_500_000);
  assert.equal(r.localTaxKrw, 550_000);
  assert.equal(r.totalTaxKrw, 6_050_000);
  assert.equal(r.afterTaxKrw, 23_950_000);
});

test('carryforward on deducts the prior loss', () => {
  const r = calc.calcTax({ gainsKrw: 30_000_000, carryLossKrw: 10_000_000, carryforward: true, effectiveYear: 2027 });
  assert.equal(r.taxableBaseKrw, 17_500_000);
  assert.equal(r.nationalTaxKrw, 3_500_000);
  assert.equal(r.localTaxKrw, 350_000);
  assert.equal(r.totalTaxKrw, 3_850_000);
  assert.equal(r.afterTaxKrw, 26_150_000);
});

test('carryforward off ignores the loss', () => {
  const r = calc.calcTax({ gainsKrw: 30_000_000, carryLossKrw: 10_000_000, carryforward: false, effectiveYear: 2027 });
  assert.equal(r.taxableBaseKrw, 27_500_000);
  assert.equal(r.totalTaxKrw, 6_050_000);
});

test('loss larger than gains floors the base at zero', () => {
  const r = calc.calcTax({ gainsKrw: 5_000_000, carryLossKrw: 50_000_000, carryforward: true, effectiveYear: 2027 });
  assert.equal(r.taxableBaseKrw, 0);
  assert.equal(r.totalTaxKrw, 0);
  assert.equal(r.afterTaxKrw, 5_000_000);
});

test('negative inputs clamp to zero', () => {
  const r = calc.calcTax({ gainsKrw: -100, carryLossKrw: -50, carryforward: true, effectiveYear: 2027 });
  assert.equal(r.taxableBaseKrw, 0);
  assert.equal(r.totalTaxKrw, 0);
  assert.equal(r.afterTaxKrw, 0);
});

test('2029 deferral moves the first filing to May 2030', () => {
  assert.equal(
    calc.calcTax({ gainsKrw: 30_000_000, carryLossKrw: 0, carryforward: false, effectiveYear: 2029 }).firstFiling,
    '2030-05',
  );
  assert.equal(
    calc.calcTax({ gainsKrw: 30_000_000, carryLossKrw: 0, carryforward: false, effectiveYear: 2027 }).firstFiling,
    '2028-05',
  );
});

test('formatKrw renders per locale', () => {
  assert.equal(calc.formatKrw(27_500_000, 'ko'), '27,500,000원');
  assert.equal(calc.formatKrw(27_500_000, 'en'), 'KRW 27,500,000');
  assert.equal(calc.formatKrw(0, 'ko'), '0원');
  assert.equal(calc.formatKrw(0, 'en'), 'KRW 0');
});

test('formatManwon renders the Korean compact unit', () => {
  assert.equal(calc.formatManwon(30_000_000), '3,000만 원');
  assert.equal(calc.formatManwon(2_500_000), '250만 원');
  assert.equal(calc.formatManwon(1_234_567), '123.5만 원');
  assert.equal(calc.formatManwon(0), '0만 원');
});

test('calculator dictionary keys match in both locales', () => {
  assert.deepEqual(keyPaths(ko.calculator), keyPaths(en.calculator));
  assert.equal(en.shell.nav.calculator.label, 'Calculator');
  assert.equal(ko.shell.nav.calculator.label, '세액 계산기');
  assert.ok(en.calculator.disclaimer.includes('2026-11-18'));
  assert.ok(ko.calculator.disclaimer.includes('2026-11-18'));
});
