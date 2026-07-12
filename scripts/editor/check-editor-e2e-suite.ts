import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const candidates = [
  'tests/e2e/editor',
  'tests/e2e/editor.spec.ts',
  'tests/e2e/editor.spec.tsx',
];

const expectedFlows = [
  'MDX compatible',
  'MDX partially compatible',
  'MDX unsupported',
  'network error',
  'external conflict',
  'backup restore',
  'pending changes navigation',
  'diagram authority',
  'keyboard navigation',
];

const found = candidates.some(candidate => fs.existsSync(path.join(root, candidate)));

if (!found) {
  console.error('[editor:e2e] Missing the Phase 7 critical E2E suite.');
  console.error('[editor:e2e] Expected one of:');
  for (const candidate of candidates) console.error(`- ${candidate}`);
  console.error('[editor:e2e] Required flows:');
  for (const flow of expectedFlows) console.error(`- ${flow}`);
  process.exit(1);
}

console.log('[editor:e2e] Editor E2E suite entry point exists.');
