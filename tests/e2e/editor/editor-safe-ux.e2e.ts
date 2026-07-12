import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn, type ChildProcess } from 'node:child_process';
import puppeteer, { type Browser, type HTTPRequest, type Page } from 'puppeteer';

interface E2EResult {
  name: string;
  status: 'PASS' | 'FAIL';
  detail: string;
}

type MonacoWindow = Window & {
  __MATEMATIKA_EDITOR_SET_SOURCE__?: (source: string) => void;
  monaco?: {
    editor?: {
      getModels?: () => Array<{
        setValue(value: string): void;
        getValue(): string;
      }>;
    };
  };
};

const PORT = Number(process.env.MATEMATIKA_E2E_PORT || 5177);
const BASE_URL = `http://127.0.0.1:${PORT}`;
let currentDebugPage: Page | undefined;

async function writeFixture(root: string, relative: string, source: string) {
  const target = path.join(root, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, source, 'utf8');
}

async function seedFixtures(root: string) {
  await writeFixture(root, 'database/content/definitions/compatible.mdx', [
    '## Documento compatible',
    '',
    'Texto inicial.',
  ].join('\n'));
  await writeFixture(root, 'database/content/definitions/parcial.mdx', [
    '## Documento parcial',
    '',
    '<Formula>{String.raw`a^2+b^2=c^2`}</Formula>',
    '',
    'Texto seguro.',
  ].join('\n'));
  await writeFixture(root, 'database/content/definitions/no-soportado.mdx', 'Texto { un syntax error here } y cierre.');
  await writeFixture(root, 'shared/diagrams/Seguro.tsx', [
    'export function Seguro() {',
    '  return null;',
    '}',
  ].join('\n'));
  await fs.mkdir(path.join(root, 'widgets/diagrams'), { recursive: true });
}

function startVite(root: string, storageRoot: string): ChildProcess {
  const viteBin = path.resolve('node_modules/vite/bin/vite.js');
  console.log(`[${new Date().toISOString()}] Spawning Vite process: bin=${viteBin}, root=${root}, storage=${storageRoot}`);
  const child = spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
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

async function expectText(page: Page, text: string) {
  await page.waitForFunction(
    expected => document.body.textContent?.includes(expected),
    { timeout: 20_000 },
    text,
  );
}

async function setMonacoValue(page: Page, source: string) {
  await page.waitForFunction(() => typeof (window as MonacoWindow).__MATEMATIKA_EDITOR_SET_SOURCE__ === 'function', { timeout: 15_000 });
  await page.evaluate((nextSource) => {
    (window as MonacoWindow).__MATEMATIKA_EDITOR_SET_SOURCE__?.(nextSource);
  }, source);
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
  await page.goto(`${BASE_URL}/Matematika/editor`, { waitUntil: 'domcontentloaded' });
  await expectText(page, 'Documentos');
  await page.waitForSelector('[aria-label="Estado de seguridad del editor"]', { timeout: 10_000 });
}

async function runTest(results: E2EResult[], name: string, evidenceDir: string, fn: () => Promise<void>) {
  try {
    await Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`E2E flow timed out: ${name}`)), 25_000);
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
    const page = await browser.newPage();
    console.log(`[${new Date().toISOString()}] Page created. Setting timeout...`);
    currentDebugPage = page;
    page.setDefaultTimeout(15_000);

    // Register dialog listener to auto-accept native alerts/confirms/beforeunload prompts
    page.on('dialog', async (dialog) => {
      console.log(`[${new Date().toISOString()}] [CDP Dialog] Intercepted: type=${dialog.type()} message=${dialog.message()}`);
      await dialog.accept();
    });

    page.on('console', msg => {
      console.log(`[${new Date().toISOString()}] [Browser Console] ${msg.text()}`);
    });

    console.log(`[${new Date().toISOString()}] Starting E2E test flows...`);

    await runTest(results, '1 MDX compatible', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 1: MDX compatible - Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 1: Editor opened, clicking Compatible...`);
      await clickByText(page, 'Compatible');
      await expectText(page, 'Documento completamente editable');
      const next = '## Documento compatible\n\nTexto editado desde E2E.';
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
      await expectText(page, 'Documento parcialmente editable');
      console.log(`[${new Date().toISOString()}] FLOW 2: Document loaded. Reading content...`);
      const before = await readContent('database/content/definitions/parcial.mdx');
      console.log(`[${new Date().toISOString()}] FLOW 2: Setting Monaco value...`);
      await setMonacoValue(page, before.source.replace('Texto seguro.', 'Texto seguro editado.'));
      console.log(`[${new Date().toISOString()}] FLOW 2: Clicking Revisar diff...`);
      await clickByText(page, 'Revisar diff');
      console.log(`[${new Date().toISOString()}] FLOW 2: Clicking Aplicar archivo...`);
      await clickByText(page, 'Aplicar archivo');
      await expectText(page, 'Archivo guardado');
      console.log(`[${new Date().toISOString()}] FLOW 2: Checking persistence...`);
      const saved = await readContent('database/content/definitions/parcial.mdx');
      if (!saved.source.includes('<Formula>{String.raw`a^2+b^2=c^2`}</Formula>')) throw new Error('Opaque block was not preserved');
      console.log(`[${new Date().toISOString()}] FLOW 2: Completed`);
    });

    await runTest(results, '3 MDX no soportado', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 3: Starting`);
      await openEditor(page);
      console.log(`[${new Date().toISOString()}] FLOW 3: Editor opened, clicking No Soportado...`);
      await clickByText(page, 'No Soportado');
      await expectText(page, 'Documento no soportado en visual');
      console.log(`[${new Date().toISOString()}] FLOW 3: Clicking Modo Visual...`);
      await clickByText(page, 'Modo Visual');
      await expectText(page, 'Documento no soportado en visual');
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
        console.log(`[${new Date().toISOString()}] FLOW 4: Clicking Revisar diff...`);
        await clickByText(page, 'Revisar diff');
        console.log(`[${new Date().toISOString()}] FLOW 4: Clicking Aplicar archivo (should fail)...`);
        await clickByText(page, 'Aplicar archivo');
        await expectText(page, 'Error al guardar');
      } finally {
        console.log(`[${new Date().toISOString()}] FLOW 4: Removing request interception...`);
        page.off('request', intercept);
        await page.setRequestInterception(false).catch(() => undefined);
      }

      console.log(`[${new Date().toISOString()}] FLOW 4: Clicking Revisar diff again...`);
      await clickByText(page, 'Revisar diff');
      console.log(`[${new Date().toISOString()}] FLOW 4: Clicking Aplicar archivo again...`);
      await clickByText(page, 'Aplicar archivo');
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
      console.log(`[${new Date().toISOString()}] FLOW 8: Clicking Componentes y Diagramas...`);
      await clickByText(page, 'Componentes y Diagramas');
      console.log(`[${new Date().toISOString()}] FLOW 8: Clicking Seguro...`);
      await clickByText(page, 'Seguro');
      await expectText(page, 'Diagrama TSX abierto');
      console.log(`[${new Date().toISOString()}] FLOW 8: Clicking Editar visualmente...`);
      await clickByText(page, 'Editar visualmente');
      await expectText(page, 'Fuente TSX autoritativa');
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
      await expectText(page, 'Documento parcialmente editable');
      // Cambiar a Modo Visual
      await clickByText(page, 'Modo Visual (Experimental)');
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
      await expectText(page, 'Documento parcialmente editable');
      // Ya estamos en modo código por defecto, editar el bloque opaco para que sea inesperado/bloqueante
      await setMonacoValue(page, '## Documento parcial\n\n<Formula>corrupto</Formula>\n\nTexto editado.');
      await clickByText(page, 'Revisar diff');
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
      await clickByText(page, 'Componentes y Diagramas');
      await clickByText(page, 'Seguro');
      await expectText(page, 'Diagrama TSX abierto');
      // Cambiar valor a sintaxis rota para forzar parse-failed / invalid-source
      await setMonacoValue(page, 'export function Seguro() { return (');
      console.log(`[${new Date().toISOString()}] FLOW 12: Opening visual workbench...`);
      await clickByText(page, 'Editar visualmente');
      await expectText(page, 'sync:invalid-source');
      console.log(`[${new Date().toISOString()}] FLOW 12: Closing visual workbench...`);
      await clickByText(page, 'Cerrar');
      console.log(`[${new Date().toISOString()}] FLOW 12: Completed`);
    });

    await runTest(results, '13 Diagrama divergente', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 13: Starting`);
      await openEditor(page);
      await clickByText(page, 'Componentes y Diagramas');
      await clickByText(page, 'Seguro');
      await expectText(page, 'Diagrama TSX abierto');
      await clickByText(page, 'Editar visualmente');
      await expectText(page, 'Fuente TSX autoritativa');
      // Usar el hook de window expuesto en DEV para disparar edits contradictorios
      await page.evaluate(() => {
        const win = window as any;
        if (win.__MATEMATIKA_DIAGRAM_STATE__) {
          win.__MATEMATIKA_DIAGRAM_STATE__.dispatch({ type: 'VISUAL_EDIT', model: { elements: [] } });
          win.__MATEMATIKA_DIAGRAM_STATE__.dispatch({ type: 'SOURCE_EDIT', source: 'export function Seguro() {}' });
        }
      });
      await expectText(page, 'sync:diverged');
      console.log(`[${new Date().toISOString()}] FLOW 13: Closing visual workbench...`);
      await clickByText(page, 'Cerrar');
      console.log(`[${new Date().toISOString()}] FLOW 13: Completed`);
    });

    await runTest(results, '14 Conflicto de diagrama', evidenceDir, async () => {
      console.log(`[${new Date().toISOString()}] FLOW 14: Starting`);
      await openEditor(page);
      await clickByText(page, 'Componentes y Diagramas');
      await clickByText(page, 'Seguro');
      await expectText(page, 'Diagrama TSX abierto');
      // Hacer un cambio local en el diagrama
      await setMonacoValue(page, 'export function Seguro() { return "cambio-local"; }');
      // Cambiar el archivo en disco por detrás
      await writeFixture(tempRoot, 'shared/diagrams/Seguro.tsx', 'export function Seguro() { return "cambio-externo"; }');
      // Intentar guardar y esperar que detecte conflicto
      await clickByText(page, 'Guardar TSX');
      await expectText(page, 'conflict');
      console.log(`[${new Date().toISOString()}] FLOW 14: Completed`);
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
