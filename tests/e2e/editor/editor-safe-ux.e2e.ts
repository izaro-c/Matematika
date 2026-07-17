import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn, type ChildProcess } from 'node:child_process';
import puppeteer, { type Browser, type HTTPRequest, type Page } from 'puppeteer';
import { createTemplateModel } from '../../../src/features/editor/diagrams/model/commands';
import { buildTargets } from '../../../src/features/editor/diagrams/model/selectors';
import { generateDiagramSource } from '../../../src/features/editor/diagrams/source/generator';

interface E2EResult {
  name: string;
  status: 'PASS' | 'FAIL';
  detail: string;
}

const PORT = Number(process.env.MATEMATIKA_E2E_PORT || 5177);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SAFE_DIAGRAM_SOURCE = [
  'export function Seguro() {',
  '  return null;',
  '}',
].join('\n');
const COMPLEX_DIAGRAM_MODEL = createTemplateModel('triangulo-deformable', 'Complejo', 'definicion');
const COMPLEX_DIAGRAM_TARGET = buildTargets(COMPLEX_DIAGRAM_MODEL)[0];
const COMPLEX_DIAGRAM_RESULT = generateDiagramSource(COMPLEX_DIAGRAM_MODEL, 'Complejo');
if (!COMPLEX_DIAGRAM_TARGET || !COMPLEX_DIAGRAM_RESULT.ok) {
  throw new Error('The complex E2E diagram fixture could not be generated');
}
const COMPLEX_DIAGRAM_SOURCE = COMPLEX_DIAGRAM_RESULT.source;
let currentDebugPage: Page | undefined;

async function writeFixture(root: string, relative: string, source: string) {
  const target = path.join(root, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, source, 'utf8');
}

async function seedFixtures(root: string) {
  await writeFixture(root, 'database/content/definitions/compatible.mdx', [
    'export const metadata = {',
    '  "id": "compatible",',
    '  "type": "definicion",',
    '  "title": "Documento compatible",',
    '  "description": "Fixture E2E compatible.",',
    '  "subtype": "nominal"',
    '};',
    '',
    '## Documento compatible',
    '',
    'Texto inicial.',
  ].join('\n'));
  await writeFixture(root, 'database/content/definitions/parcial.mdx', [
    'export const metadata = {',
    '  "id": "parcial",',
    '  "type": "definicion",',
    '  "title": "Documento parcial",',
    '  "description": "Fixture E2E parcial.",',
    '  "subtype": "nominal"',
    '};',
    '',
    '## Documento parcial',
    '',
    '<Formula>{String.raw`a^2+b^2=c^2`}</Formula>',
    '',
    '<FutureWidget keep={{ nested: true }} />',
    '',
    'Texto seguro.',
  ].join('\n'));
  await writeFixture(root, 'database/content/definitions/no-soportado.mdx', [
    'export const metadata = {',
    '  "id": "no-soportado",',
    '  "type": "definicion",',
    '  "title": "Documento no soportado",',
    '  "description": "Fixture E2E inválido.",',
    '  "subtype": "nominal"',
    '};',
    '',
    'Texto { un syntax error here } y cierre.',
  ].join('\n'));
  await writeFixture(root, 'database/content/definitions/enlace-anidado.mdx', [
    'export const metadata = {',
    '  "id": "enlace-anidado",',
    '  "type": "definicion",',
    '  "title": "Enlace anidado",',
    '  "description": "Fixture E2E para editar y guardar enlaces heredados.",',
    '  "subtype": "nominal"',
    '};',
    '',
    '## Enlace anidado',
    '',
    '<InteractiveElement target="target-obsoleto" color="terracota"><ConceptLink targetId="compatible" highlightTarget="target-vigente" highlightColor="ocre">Documento compatible</ConceptLink></InteractiveElement>.',
  ].join('\n'));
  await writeFixture(root, 'widgets/diagrams/Definitions/Seguro.tsx', SAFE_DIAGRAM_SOURCE);
  await writeFixture(root, 'widgets/diagrams/Definitions/Complejo.tsx', COMPLEX_DIAGRAM_SOURCE);
}

function startVite(root: string, storageRoot: string): ChildProcess {
  const viteBin = path.resolve('node_modules/vite/bin/vite.js');
  console.log(`[${new Date().toISOString()}] Spawning Vite process: bin=${viteBin}, root=${root}, storage=${storageRoot}`);
  const child = spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', String(PORT), '--strictPort', '--mode', 'e2e'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      MATEMATIKA_EDITOR_SRC_ROOT: root,
      MATEMATIKA_EDITOR_STORAGE_ROOT: storageRoot,
    },
  });

  child.stdout?.on('data', (data) => {
    console.log(`[Vite STDOUT] ${data.toString().trim()}`);
  });

  child.stderr?.on('data', (data) => {
    console.error(`[Vite STDERR] ${data.toString().trim()}`);
  });

  child.on('error', (err) => {
    console.error(`[Vite ERROR] Process error:`, err);
  });

  child.on('exit', (code, signal) => {
    console.log(`[Vite EXIT] code=${code}, signal=${signal}`);
  });

  return child;
}

async function waitForServer(child: ChildProcess) {
  console.log(`[${new Date().toISOString()}] Waiting for Vite server at ${BASE_URL}...`);
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Vite exited early with code ${child.exitCode}`);
    }
    try {
      const response = await fetch(`${BASE_URL}/api/list-content`);
      if (response.ok) {
        console.log(`[${new Date().toISOString()}] Vite server is ready!`);
        return;
      }
    } catch {
      // Ignore network errors while booting
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error('Vite did not become ready');
}


async function clickByText(page: Page, text: string) {
  const clicked = await page.evaluate((label) => {
    const candidates = [...document.querySelectorAll('button, a')];
    const target = candidates.find(element => element.textContent?.includes(label));
    if (!(target instanceof HTMLElement)) return false;
    target.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`No clickable element contains: ${text}`);
}

async function clickByExactText(page: Page, text: string) {
  const clicked = await page.evaluate((label) => {
    const target = [...document.querySelectorAll('button, a')]
      .find(element => element.textContent?.trim() === label);
    if (!(target instanceof HTMLElement)) return false;
    target.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`No clickable element equals: ${text}`);
}

async function waitForEnabledButton(page: Page, text: string) {
  await page.waitForFunction(label => [...document.querySelectorAll('button')].some(
    element => element.textContent?.trim() === label && !element.disabled
  ), { timeout: 20_000 }, text);
}

async function expectText(page: Page, text: string) {
  await page.waitForFunction(
    expected => document.body.textContent?.includes(expected),
    { timeout: 20_000 },
    text,
  );
}

async function setMonacoValue(page: Page, source: string) {
  await page.waitForSelector('.monaco-editor textarea', { timeout: 15_000 });
  await page.click('.monaco-editor textarea');
  const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
  await page.keyboard.down(modifier);
  await page.keyboard.press('A');
  await page.keyboard.up(modifier);
  const pasted = await page.evaluate(text => {
    const target = document.querySelector('.monaco-editor textarea');
    if (!(target instanceof HTMLTextAreaElement)) return false;
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', text);
    return target.dispatchEvent(new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData,
    }));
  }, source);
  // Monaco cancels the native event after consuming the exact clipboard text.
  if (pasted) throw new Error('Monaco did not consume the synthetic paste event');
}

function sourceDifference(expected: string, actual: string): string {
  const limit = Math.min(expected.length, actual.length);
  let index = 0;
  while (index < limit && expected[index] === actual[index]) index += 1;
  if (index === limit && expected.length === actual.length) return 'sin divergencia';
  const excerpt = (value: string) => JSON.stringify(value.slice(Math.max(0, index - 20), index + 40));
  return `primera divergencia en byte ${index}; esperado=${excerpt(expected)} actual=${excerpt(actual)}; longitudes=${expected.length}/${actual.length}`;
}

async function readContent(relativePath: string) {
  const response = await fetch(`${BASE_URL}/api/content?path=${encodeURIComponent(relativePath)}`);
  if (!response.ok) throw new Error(`Cannot read ${relativePath}: ${response.status}`);
  return await response.json() as { source: string; version: string; sourceHash: string };
}

async function applyContent(relativePath: string, source: string, expectedVersion: string, localRevision: number) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
  const sourceHash = [...new Uint8Array(hashBuffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  const response = await fetch(`${BASE_URL}/api/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: relativePath, source, sourceHash, expectedVersion, localRevision }),
  });
  return { response, body: await response.json() as unknown };
}

async function openEditor(page: Page) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto(`${BASE_URL}/Matematika/editor`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
      await expectText(page, 'Documentos');
      await page.waitForSelector('[aria-label="Estado de seguridad del editor"]', { timeout: 15_000 });
      await page.waitForFunction(() => !document.body.textContent?.includes('Comprobando el catálogo seguro…'));
      return;
    } catch (error) {
      lastError = error;
      await page.evaluate(() => window.stop()).catch(() => undefined);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Editor did not finish loading its safe catalog');
}

async function runTest(results: E2EResult[], name: string, evidenceDir: string, fn: () => Promise<void>) {
  const onlyFlow = process.env.MATEMATIKA_E2E_ONLY_FLOW;
  if (onlyFlow && !name.startsWith(`${onlyFlow} `)) return;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`E2E flow timed out: ${name}`)), 45_000);
      }),
    ]);
    results.push({ name, status: 'PASS', detail: 'ok' });
  } catch (error) {
    results.push({ name, status: 'FAIL', detail: error instanceof Error ? error.message : String(error) });
    await fs.writeFile(path.join(evidenceDir, `${name.replace(/\W+/g, '-').toLowerCase()}.txt`), String(error), 'utf8');
    if (currentDebugPage) {
      const text = await currentDebugPage.evaluate(() => document.body.textContent || '');
      await fs.writeFile(path.join(evidenceDir, `${name.replace(/\W+/g, '-').toLowerCase()}.body.txt`), text, 'utf8');
    }
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'matematika-e2e-src-'));
  const storageRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'matematika-e2e-storage-'));
  const evidenceDir = await fs.mkdtemp(path.join(os.tmpdir(), 'matematika-e2e-evidence-'));
  await seedFixtures(tempRoot);

  const server = startVite(tempRoot, storageRoot);
  const results: E2EResult[] = [];
  let browser: Browser | undefined;

  try {
    await waitForServer(server);
    console.log(`[${new Date().toISOString()}] Launching Puppeteer...`);
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    console.log(`[${new Date().toISOString()}] Puppeteer launched. Creating new page...`);
    let page = await browser.newPage();
    const configurePage = async (target: Page) => {
      await target.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      currentDebugPage = target;
      target.setDefaultTimeout(30_000);
      // Auto-accept native alerts/confirms/beforeunload prompts while retaining
      // an observable Puppeteer event for the dedicated data-loss flow.
      target.on('dialog', async (dialog) => {
        console.log(`[${new Date().toISOString()}] [CDP Dialog] Intercepted: type=${dialog.type()} message=${dialog.message()}`);
        await dialog.accept();
      });
      target.on('console', msg => {
        console.log(`[${new Date().toISOString()}] [Browser Console] ${msg.text()}`);
      });
    };
    const resetPage = async () => {
      currentDebugPage = undefined;
      await page.close();
      page = await browser!.newPage();
      await configurePage(page);
    };
    console.log(`[${new Date().toISOString()}] Page created. Setting timeout...`);
    await configurePage(page);

    console.log(`[${new Date().toISOString()}] Starting E2E test flows...`);

    await runTest(results, '1 MDX compatible', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 1: MDX compatible - Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 1: Editor opened, clicking Compatible...`);
      await clickByText(page, 'Compatible');
      await expectText(page, 'Edición visual exacta');
      const current = await readContent('database/content/definitions/compatible.mdx');
      const next = current.source.replace('Texto inicial.', 'Texto editado desde E2E.');
      await setMonacoValue(page, next);
      await expectText(page, 'Cambios locales');
      await clickByText(page, 'Revisar diff');
      await expectText(page, 'Diff listo para aplicar');
      await clickByText(page, 'Aplicar archivo');
      await expectText(page, 'Archivo guardado');
      const saved = await readContent('database/content/definitions/compatible.mdx');
      if (!saved.source.includes('Texto editado desde E2E.')) throw new Error('Edited source was not persisted');
      console.log(`[${new Date().toISOString()}] FLOW 1: Completed`);
    });


    await runTest(results, '2 MDX parcialmente compatible', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 2: Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 2: Editor opened, clicking Parcial...`);
      await clickByText(page, 'Parcial');
      await expectText(page, 'Edición visual exacta por rangos');
      console.log(`[${new Date().toISOString()}] FLOW 2: Document loaded. Reading content...`);
      const before = await readContent('database/content/definitions/parcial.mdx');
      console.log(`[${new Date().toISOString()}] FLOW 2: Setting Monaco value...`);
      await setMonacoValue(page, before.source.replace('Texto seguro.', 'Texto seguro editado.'));
      await waitForEnabledButton(page, 'Revisar diff');
      console.log(`[${new Date().toISOString()}] FLOW 2: Clicking Revisar diff...`);
      await clickByExactText(page, 'Revisar diff');
      await expectText(page, 'Diff con cambios bloqueantes');
      const applyDisabled = await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Aplicar archivo'));
        return btn ? btn.disabled : true;
      });
      if (!applyDisabled) throw new Error('Partial document code edit was not blocked without operation ranges');
      console.log(`[${new Date().toISOString()}] FLOW 2: Checking blocked persistence...`);
      const saved = await readContent('database/content/definitions/parcial.mdx');
      if (saved.source !== before.source) throw new Error('Blocked partial source edit was persisted');
      console.log(`[${new Date().toISOString()}] FLOW 2: Completed`);
    });

    await runTest(results, '3 MDX no soportado', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 3: Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 3: Editor opened, clicking No Soportado...`);
      await clickByText(page, 'No Soportado');
      await expectText(page, 'Recurso MDX inválido');
      console.log(`[${new Date().toISOString()}] FLOW 3: Clicking Edición visual exacta...`);
      await clickByText(page, 'Edición visual exacta');
      await expectText(page, 'Recurso MDX inválido');
      console.log(`[${new Date().toISOString()}] FLOW 3: Reading content...`);
      const saved = await readContent('database/content/definitions/no-soportado.mdx');
      if (!saved.source.includes('syntax error')) throw new Error('Unsupported source changed unexpectedly');
      console.log(`[${new Date().toISOString()}] FLOW 3: Completed`);
    });

    await runTest(results, '4 Error de red', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 4: Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 4: Editor opened, clicking Compatible...`);
      await clickByText(page, 'Compatible');
      console.log(`[${new Date().toISOString()}] FLOW 4: Reading content...`);
      const current = await readContent('database/content/definitions/compatible.mdx');
      console.log(`[${new Date().toISOString()}] FLOW 4: Setting Monaco value...`);
      await setMonacoValue(page, `${current.source}\n\nError de red recuperado.`);
      console.log(`[${new Date().toISOString()}] FLOW 4: Setting request interception...`);

      let aborted = false;
      const intercept = (request: HTTPRequest) => {
        if (!aborted && request.url().endsWith('/api/content') && request.method() === 'POST') {
          aborted = true;
          console.log(`[${new Date().toISOString()}] FLOW 4: Intercepted and aborting save request`);
          request.abort().catch(() => undefined);
          return;
        }
        request.continue().catch(() => undefined);
      };

      try {
        await page.setRequestInterception(true);
        page.on('request', intercept);
        await waitForEnabledButton(page, 'Revisar diff');
        console.log(`[${new Date().toISOString()}] FLOW 4: Clicking Revisar diff...`);
        await clickByExactText(page, 'Revisar diff');
        await waitForEnabledButton(page, 'Aplicar archivo');
        console.log(`[${new Date().toISOString()}] FLOW 4: Clicking Aplicar archivo (should fail)...`);
        await clickByExactText(page, 'Aplicar archivo');
        await expectText(page, 'Error al guardar');
      } finally {
        console.log(`[${new Date().toISOString()}] FLOW 4: Removing request interception...`);
        page.off('request', intercept);
        await page.setRequestInterception(false).catch(() => undefined);
      }

      console.log(`[${new Date().toISOString()}] FLOW 4: Clicking Revisar diff again...`);
      await clickByExactText(page, 'Revisar diff');
      await waitForEnabledButton(page, 'Aplicar archivo');
      console.log(`[${new Date().toISOString()}] FLOW 4: Clicking Aplicar archivo again...`);
      await clickByExactText(page, 'Aplicar archivo');
      await expectText(page, 'Archivo guardado');
      console.log(`[${new Date().toISOString()}] FLOW 4: Completed`);
    });

    await runTest(results, '5 Conflicto externo', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 5: Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 5: Editor opened, clicking Compatible...`);
      await clickByText(page, 'Compatible');
      console.log(`[${new Date().toISOString()}] FLOW 5: Reading content...`);
      const opened = await readContent('database/content/definitions/compatible.mdx');
      console.log(`[${new Date().toISOString()}] FLOW 5: Setting Monaco value...`);
      await setMonacoValue(page, `${opened.source}\n\nCambio local en conflicto.`);
      console.log(`[${new Date().toISOString()}] FLOW 5: Applying external change behind the scenes...`);
      const external = await applyContent('database/content/definitions/compatible.mdx', `${opened.source}\n\nCambio externo.`, opened.version, 99);
      if (!external.response.ok) throw new Error('Could not create external change');
      console.log(`[${new Date().toISOString()}] FLOW 5: Clicking Revisar diff...`);
      await clickByText(page, 'Revisar diff');
      console.log(`[${new Date().toISOString()}] FLOW 5: Clicking Aplicar archivo (should detect conflict)...`);
      await clickByText(page, 'Aplicar archivo');
      await expectText(page, 'Conflicto con una versión externa');
      console.log(`[${new Date().toISOString()}] FLOW 5: Completed`);
    });

    await runTest(results, '6 Restauración de backup', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 6: Starting`);
      console.log(`[${new Date().toISOString()}] FLOW 6: Reading content...`);
      const current = await readContent('database/content/definitions/parcial.mdx');
      console.log(`[${new Date().toISOString()}] FLOW 6: Applying temporal change and triggering backup...`);
      const applied = await applyContent('database/content/definitions/parcial.mdx', `${current.source}\n\nVersión temporal.`, current.version, 101);
      const body = applied.body as { backupId?: string; version?: string };
      if (!applied.response.ok || !body.backupId || !body.version) throw new Error('Could not create backup');
      console.log(`[${new Date().toISOString()}] FLOW 6: Calling API content restore...`);
      const restore = await fetch(`${BASE_URL}/api/content/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: 'database/content/definitions/parcial.mdx', backupId: body.backupId, expectedVersion: body.version }),
      });
      if (!restore.ok) throw new Error(`Restore failed: ${restore.status}`);
      console.log(`[${new Date().toISOString()}] FLOW 6: Completed`);
    });

    await runTest(results, '7 Navegación con cambios pendientes', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 7: Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 7: Editor opened, clicking Parcial...`);
      await clickByText(page, 'Parcial');
      console.log(`[${new Date().toISOString()}] FLOW 7: Reading content...`);
      const current = await readContent('database/content/definitions/parcial.mdx');
      console.log(`[${new Date().toISOString()}] FLOW 7: Setting Monaco value...`);
      await setMonacoValue(page, `${current.source}\n\nPendiente.`);
      await waitForEnabledButton(page, 'Revisar diff');
      console.log(`[${new Date().toISOString()}] FLOW 7: Clicking Compatible (navigation trigger)...`);
      await clickByText(page, 'Compatible');
      await expectText(page, 'Hay cambios locales');
      console.log(`[${new Date().toISOString()}] FLOW 7: Clicking Permanecer...`);
      await clickByText(page, 'Permanecer');
      await page.waitForSelector('[role="dialog"]', { hidden: true, timeout: 5000 });
      await expectText(page, 'Cambios locales');
      console.log(`[${new Date().toISOString()}] FLOW 7: Completed`);
    });

    await runTest(results, '8 Autoridad de diagrama', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 8: Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 8: Clicking Diagramas...`);
      await clickByText(page, 'Diagramas');
      console.log(`[${new Date().toISOString()}] FLOW 8: Clicking Seguro...`);
      await clickByText(page, 'Seguro');
      await expectText(page, 'Diagrama TSX abierto');
      console.log(`[${new Date().toISOString()}] FLOW 8: Clicking Abrir código y vista previa...`);
      await clickByText(page, 'Abrir código y vista previa');
      await expectText(page, 'sync:source-authoritative');
      console.log(`[${new Date().toISOString()}] FLOW 8: Closing visual workbench...`);
      await clickByText(page, 'Cerrar');
      console.log(`[${new Date().toISOString()}] FLOW 8: Completed`);
    });

    await runTest(results, '9 Teclado', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 9: Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 9: Pressing Tabs and Enter...`);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForSelector('[aria-label="Estado de seguridad del editor"]', { timeout: 10_000 });
      console.log(`[${new Date().toISOString()}] FLOW 9: Completed`);
    });

    await runTest(results, '10 Documento parcial guardar sin diff', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 10: Starting`);
      await openEditor(page);
      await clickByText(page, 'Parcial');
      await expectText(page, 'Edición visual exacta por rangos');
      // Cambiar a la proyección visual exacta
      await clickByText(page, 'Edición visual exacta');
      // En modo visual en MDX, el botón guardar debe estar desactivado/bloqueado
      const isDisabled = await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Guardar'));
        return btn ? btn.disabled : true;
      });
      if (!isDisabled) throw new Error('Guardar button was not disabled in visual mode on partial doc');
      console.log(`[${new Date().toISOString()}] FLOW 10: Completed`);
    });

    await runTest(results, '11 Hunk inesperado bloqueante', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 11: Starting`);
      await openEditor(page);
      await clickByText(page, 'Parcial');
      await expectText(page, 'Edición visual exacta por rangos');
      const before = await readContent('database/content/definitions/parcial.mdx');
      await clickByExactText(page, 'Edición visual exacta');
      const openedParagraph = await page.evaluate(() => {
        const target = [...document.querySelectorAll('div.cursor-text')]
          .find(element => element.textContent?.trim() === 'Texto seguro.');
        if (!(target instanceof HTMLElement)) return false;
        target.click();
        return true;
      });
      if (!openedParagraph) throw new Error('The safe visual paragraph could not be opened');
      await page.waitForFunction(() => [...document.querySelectorAll('textarea')].some(element => element.value === 'Texto seguro.'));
      const changedParagraph = await page.evaluate(() => {
        const target = [...document.querySelectorAll('textarea')].find(element => element.value === 'Texto seguro.');
        if (!target) return false;
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        setter?.call(target, 'Texto seguro editado visualmente.');
        target.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      });
      if (!changedParagraph) throw new Error('The safe visual paragraph could not be changed');
      await expectText(page, 'Cambio localizado aplicado');
      await clickByText(page, 'Visual + código');
      const unexpectedSource = before.source
        .replace('## Documento parcial', '## Encabezado inesperado')
        .replace('Texto seguro.', 'Texto seguro editado visualmente.');
      await setMonacoValue(page, unexpectedSource);
      await page.waitForFunction(() => !document.body.textContent?.includes('Cambio localizado aplicado.'));
      await waitForEnabledButton(page, 'Revisar diff');
      await clickByExactText(page, 'Revisar diff');
      await expectText(page, 'Hunk inesperado (bloqueante)');
      // Verificar que el botón de aplicar archivo esté deshabilitado
      const applyDisabled = await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Aplicar archivo'));
        return btn ? btn.disabled : true;
      });
      if (!applyDisabled) throw new Error('Apply button was not disabled with unexpected hunks');
      console.log(`[${new Date().toISOString()}] FLOW 11: Completed`);
    });

    await runTest(results, '12 Diagrama no convertible', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 12: Starting`);
      await openEditor(page);
      await clickByText(page, 'Diagramas');
      await clickByText(page, 'Seguro');
      await expectText(page, 'Diagrama TSX abierto');
      // Cambiar la fuente persistida para forzar parse-failed / invalid-source en modo file.
      await writeFixture(tempRoot, 'widgets/diagrams/Definitions/Seguro.tsx', 'export function Seguro() { return (');
      console.log(`[${new Date().toISOString()}] FLOW 12: Opening visual workbench...`);
      await clickByText(page, 'Abrir código y vista previa');
      await expectText(page, 'sync:invalid-source');
      console.log(`[${new Date().toISOString()}] FLOW 12: Closing visual workbench...`);
      await clickByText(page, 'Cerrar');
      console.log(`[${new Date().toISOString()}] FLOW 12: Completed`);
    });

    await runTest(results, '13 Diagrama fuente autoritativa', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 13: Starting`);
      await writeFixture(tempRoot, 'widgets/diagrams/Definitions/Seguro.tsx', SAFE_DIAGRAM_SOURCE);
      await openEditor(page);
      await clickByText(page, 'Diagramas');
      await clickByText(page, 'Seguro');
      await expectText(page, 'Diagrama TSX abierto');
      await clickByText(page, 'Abrir código y vista previa');
      await expectText(page, 'sync:source-authoritative');
      const textarea = await page.$('textarea');
      if (!textarea) throw new Error('Diagram source textarea not found');
      const hasVisualTools = await page.evaluate(() => document.body.textContent?.includes('Añadir rápido') ?? false);
      if (hasVisualTools) throw new Error('Source-authoritative diagram exposed visual editing tools');
      console.log(`[${new Date().toISOString()}] FLOW 13: Closing visual workbench...`);
      await clickByText(page, 'Cerrar');
      console.log(`[${new Date().toISOString()}] FLOW 13: Completed`);
    });

    await runTest(results, '14 Conflicto de diagrama', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 14: Starting`);
      await openEditor(page);
      await clickByText(page, 'Diagramas');
      await clickByText(page, 'Seguro');
      await expectText(page, 'Diagrama TSX abierto');
      // Hacer un cambio local en el diagrama
      await setMonacoValue(page, 'export function Seguro() { return "cambio-local"; }');
      await expectText(page, 'Cambios locales');
      // Cambiar el archivo en disco por detrás
      await writeFixture(tempRoot, 'widgets/diagrams/Definitions/Seguro.tsx', 'export function Seguro() { return "cambio-externo"; }');
      // Intentar guardar y esperar que detecte conflicto
      await clickByExactText(page, 'Guardar TSX');
      await expectText(page, 'Conflicto');
      console.log(`[${new Date().toISOString()}] FLOW 14: Completed`);
    });

    // El fixture TSX provoca HMR y el conflicto deja una sesión dirty. Los
    // flujos de cierre son independientes y arrancan en páginas limpias.
    await resetPage();
    await runTest(results, '15 Navegación y filtros de Fase 1', evidenceDir, async () => {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      await openEditor(page);
      const search = await page.$('input[type="search"]');
      if (!search) throw new Error('Resource search was not found');
      await search.type('compatible');
      await expectText(page, 'Compatible');
      const hasUnrelatedResource = await page.evaluate(() => document.body.textContent?.includes('No Soportado') ?? false);
      if (hasUnrelatedResource) throw new Error('Search did not filter unrelated resources');
      await search.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await clickByText(page, 'Diagramas');
      await expectText(page, 'Código + vista previa');
      await clickByText(page, 'Seguro');
      await expectText(page, 'El TSX completo es autoritativo');
    });

    await resetPage();
    await runTest(results, '16 Paneles, teclado y responsive de Fase 1', evidenceDir, async () => {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      await openEditor(page);
      await clickByText(page, 'Compatible');
      await page.keyboard.down('Control');
      await page.keyboard.down('Shift');
      await page.keyboard.press('I');
      await page.keyboard.up('Shift');
      await page.keyboard.up('Control');
      const inspectorVisible = await page.$('[aria-label="Inspector contextual"]');
      if (inspectorVisible) throw new Error('Inspector keyboard shortcut did not collapse the panel');
      await page.keyboard.down('Control');
      await page.keyboard.press('J');
      await page.keyboard.up('Control');
      await expectText(page, 'Diagnósticos y actividad');

      await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 1 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expectText(page, 'Ningún recurso abierto');
      const laptopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (laptopOverflow) throw new Error('The laptop editor introduced horizontal page overflow');
      await page.screenshot({ path: path.join(evidenceDir, 'fase-1-laptop-1024x768.png'), fullPage: false });

      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expectText(page, 'Ningún recurso abierto');
      await clickByText(page, 'Recursos');
      await expectText(page, 'Recursos matemáticos');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (overflow) throw new Error('The mobile editor introduced horizontal page overflow');
      await page.screenshot({ path: path.join(evidenceDir, 'fase-1-mobile-390x844.png'), fullPage: false });
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    });

    await resetPage();
    await runTest(results, '17 Enlace anidado se edita y persiste desde la vista visual', evidenceDir, async () => {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      await openEditor(page);
      await clickByText(page, 'Enlace Anidado');
      await expectText(page, 'Edición visual exacta');

      const linkSelector = '[role="button"][aria-label*="Documento compatible. Concepto: compatible"]';
      await page.waitForSelector(linkSelector);
      await page.click(linkSelector);
      await page.waitForSelector('[aria-label="Conectar texto con contenido o diagrama"]');
      await clickByExactText(page, 'Concepto');
      await waitForEnabledButton(page, 'Guardar Cambios');
      await clickByExactText(page, 'Guardar Cambios');

      await expectText(page, 'Cambios locales');
      await clickByText(page, 'Revisar y guardar');
      await expectText(page, 'Diff listo para aplicar');
      await clickByText(page, 'Aplicar archivo');
      await expectText(page, 'El archivo real fue aplicado.');

      const saved = await readContent('database/content/definitions/enlace-anidado.mdx');
      const expected = '<ConceptLink targetId="compatible" isDependency={false}>Documento compatible</ConceptLink>.';
      if (!saved.source.includes(expected)) throw new Error('The edited semantic link was not persisted');
      if (saved.source.includes('<InteractiveElement')) throw new Error('The stale outer interactive wrapper survived the edit');
    });

    await resetPage();
    await runTest(results, '18 Autoría visual compleja, diagrama y roundtrip de Fase 7', evidenceDir, async () => {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      await openEditor(page);
      await clickByText(page, 'Nueva');
      await page.waitForSelector('[aria-label="Crear página matemática"]');

      const dialogInputs = await page.$$('[aria-label="Crear página matemática"] input');
      if (dialogInputs.length < 2) throw new Error('The structured creation form is incomplete');
      await dialogInputs[0].type('definicion-e2e-compleja');
      await dialogInputs[1].type('Definición E2E compleja');
      const description = await page.$('[aria-label="Crear página matemática"] textarea');
      if (!description) throw new Error('The motivational description field is missing');
      await description.type('Una definición compleja creada y reabierta sin pérdida.');
      await clickByText(page, 'Crear y abrir');
      await expectText(page, 'definicion-e2e-compleja.mdx');
      await expectText(page, 'Edición visual exacta');

      const targetId = COMPLEX_DIAGRAM_TARGET.id;
      const complexSource = [
        'export const metadata = {',
        '  "id": "definicion-e2e-compleja",',
        '  "type": "definicion",',
        '  "title": "Definición E2E compleja",',
        '  "description": "Una definición compleja creada y reabierta sin pérdida.",',
        '  "subtype": "nominal",',
        '  "hasSimulation": true',
        '};',
        '',
        "import { Complejo } from '@/widgets/diagrams/Definitions/Complejo';",
        'export const Simulation = Complejo;',
        '',
        '<Capitular letra="U" />na definición visual conserva estructura y conexiones.',
        '',
        '<Separador />',
        '',
        '### Definición formal',
        '',
        '<Definicion title="Objeto complejo">',
        `Un objeto complejo referencia <ConceptLink targetId="compatible" highlightTarget="${targetId}" highlightColor="terracota">un punto publicado</ConceptLink> del diagrama.`,
        '</Definicion>',
        '',
        '<Nota>',
        'La conclusión se obtiene de las condiciones declaradas, no de la apariencia visual.',
        '</Nota>',
        '',
        '### Referencia',
        '',
        '<RefLink targetId="compatible">Documento compatible</RefLink>.',
        '',
      ].join('\n');

      await clickByText(page, 'Visual + código');
      await setMonacoValue(page, complexSource);
      await expectText(page, 'Cambios locales');
      await clickByText(page, 'Revisar y guardar');
      await expectText(page, 'Diff listo para aplicar');
      await clickByText(page, 'Aplicar archivo');
      await expectText(page, 'Archivo guardado');

      const saved = await readContent('database/content/definitions/definicion-e2e-compleja.mdx');
      if (saved.source !== complexSource) {
        throw new Error(`The first complex save was not lossless: ${sourceDifference(complexSource, saved.source)}`);
      }

      await clickByText(page, 'Parcial');
      await expectText(page, 'database/content/definitions/parcial.mdx');
      await page.waitForFunction(() => document.body.textContent?.includes('No hay cambios locales pendientes.')
        && !document.body.textContent?.includes('Cargando archivo'));
      await clickByText(page, 'E2e Compleja');
      await expectText(page, 'Edición visual exacta');
      await expectText(page, COMPLEX_DIAGRAM_TARGET.label);
      const reopened = await readContent('database/content/definitions/definicion-e2e-compleja.mdx');
      if (reopened.source !== complexSource) throw new Error('Reopening changed the complex MDX source');

      await clickByText(page, 'Vista publicada');
      await expectText(page, 'Runtime publicado compartido');
      await clickByText(page, 'Volver al editor');

      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
      await expectText(page, 'Nueva');
      await expectText(page, 'Revisar y guardar');
      await expectText(page, 'Una vista');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (overflow) throw new Error('The Phase 7 mobile authoring UI introduced horizontal page overflow');
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    });

    await resetPage();
    await runTest(results, '19 Cierre con cambios pendientes', evidenceDir, async () => {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      await openEditor(page);
      await clickByText(page, 'Compatible');
      const current = await readContent('database/content/definitions/compatible.mdx');
      await setMonacoValue(page, `${current.source}\n\nCambio no guardado antes del cierre.`);
      await expectText(page, 'Cambios locales');
      // Esperar dos frames garantiza que el efecto que registra beforeunload
      // corresponde al estado dirty que ya se muestra en pantalla.
      await page.evaluate(() => new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }));
      let resolveBeforeUnload: (() => void) | undefined;
      const beforeUnloadObserved = new Promise<void>(resolve => {
        resolveBeforeUnload = resolve;
      });
      const observeBeforeUnload = (dialog: import('puppeteer').Dialog) => {
        if (dialog.type() === 'beforeunload') resolveBeforeUnload?.();
      };
      page.on('dialog', observeBeforeUnload);
      try {
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 30_000 });
        await Promise.race([
          beforeUnloadObserved,
          new Promise<never>((_, reject) => setTimeout(
            () => reject(new Error('Reload did not trigger native beforeunload protection for pending changes')),
            3_000,
          )),
        ]);
      } finally {
        page.off('dialog', observeBeforeUnload);
      }
      const persisted = await readContent('database/content/definitions/compatible.mdx');
      if (persisted.source.includes('Cambio no guardado antes del cierre.')) {
        throw new Error('Pending source was persisted without an explicit review and apply');
      }
    });

  } finally {
    await browser?.close();
    server.kill();
    await fs.rm(tempRoot, { recursive: true, force: true });
    await fs.rm(storageRoot, { recursive: true, force: true });
  }

  for (const result of results) {
    console.log(`${result.status} ${result.name} - ${result.detail}`);
  }

  const failed = results.filter(result => result.status === 'FAIL');
  if (failed.length > 0) {
    console.error(`Evidence written to ${evidenceDir}`);
    process.exitCode = 1;
  } else {
    await fs.rm(evidenceDir, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
