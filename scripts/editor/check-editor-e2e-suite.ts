import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const suitePath = 'tests/e2e/editor/editor-safe-ux.e2e.ts';
const absoluteSuitePath = path.join(root, suitePath);

const expectedFlows = [
  'MDX compatible',
  'MDX parcialmente compatible',
  'MDX no soportado',
  'Error de red',
  'Conflicto externo',
  'Restauración de backup',
  'Navegación con cambios pendientes',
  'Autoridad de diagrama',
  'Teclado',
  'Documento parcial guardar sin diff',
  'Hunk inesperado bloqueante',
  'Diagrama no convertible',
  'Diagrama fuente autoritativa',
  'Conflicto de diagrama',
  'Autoría visual compleja, diagrama y roundtrip de Fase 7',
];

if (!fs.existsSync(absoluteSuitePath)) {
  console.error(`[editor:e2e] Missing E2E suite: ${suitePath}`);
  process.exitCode = 1;
} else {
  const source = fs.readFileSync(absoluteSuitePath, 'utf8');
  let failures = 0;

  for (const snippet of [
    'startVite(',
    'waitForServer(',
    'puppeteer.launch',
    'runTest(results,',
  ]) {
    if (!source.includes(snippet)) {
      console.error(`[editor:e2e] Suite does not contain required runtime evidence: ${snippet}`);
      failures += 1;
    }
  }

  for (const flow of expectedFlows) {
    if (!source.includes(flow)) {
      console.error(`[editor:e2e] Missing required flow: ${flow}`);
      failures += 1;
    }
  }

  const flowCount = source.match(/runTest\(results,/g)?.length ?? 0;
  if (flowCount < expectedFlows.length) {
    console.error(`[editor:e2e] Expected at least ${expectedFlows.length} runTest flows, found ${flowCount}.`);
    failures += 1;
  }

  if (source.includes('__MATEMATIKA_')) {
    console.error('[editor:e2e] E2E suite must not use internal __MATEMATIKA_ globals.');
    failures += 1;
  }

  if (failures > 0) {
    process.exitCode = 1;
  } else {
    console.log(`[editor:e2e] Real editor E2E suite declares ${flowCount} flows and required runtime gates.`);
  }
}
