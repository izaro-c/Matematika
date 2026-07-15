import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import puppeteer, { type Page } from 'puppeteer';

const PORT = Number(process.env.MATEMATIKA_PHASE5_E2E_PORT || 5178);
const BASE_URL = `http://127.0.0.1:${PORT}/Matematika`;

const CASES = [
  { name: 'Pitágoras', route: '/teorema/teorema-pitagoras', minObjects: 100, texts: ['a² =', 'b² =', 'c² ='], advanceSteps: 1 },
  { name: 'Poincaré', route: '/modelo/modelo-poincare', minObjects: 40, texts: ['L₁', 'L₂'], advanceSteps: 0 },
  { name: 'Congruencia ALA', route: '/teorema/teorema-congruencia-ala', minObjects: 100, texts: ['AB =', '∠A ='], advanceSteps: 0 },
  { name: 'Paralelogramo', route: '/definicion/paralelogramo', minObjects: 90, texts: ['Clasificación', 'AM =', 'MC ='], advanceSteps: 2 },
] as const;

function startVite(): ChildProcess {
  return spawn(process.execPath, [path.resolve('node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

async function waitForServer(server: ChildProcess) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Vite terminó antes de tiempo (${server.exitCode}).`);
    try {
      if ((await fetch(`${BASE_URL}/`)).ok) return;
    } catch {
      // Vite todavía está arrancando.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('Vite no quedó disponible para la aceptación de Fase 5.');
}

function collectBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  return errors;
}

async function verifySynchronizedElementLabelHover(page: Page, caseName: string) {
  const pair = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'var(--theme-ocre)';
    document.body.appendChild(probe);
    const emphasisColor = getComputedStyle(probe).color;
    probe.remove();
    const labels = [...document.querySelectorAll<HTMLElement>('[data-diagram-label-for]')]
      .filter(candidate => candidate.getBoundingClientRect().width > 0 && candidate.getBoundingClientRect().height > 0);
    const pairs = labels.map(label => {
      const objectId = label.dataset.diagramLabelFor;
      const object = objectId
        ? [...document.querySelectorAll<HTMLElement>(`[data-diagram-object-id="${objectId}"]`)]
          .find(candidate => candidate !== label
            && !candidate.dataset.diagramLabelFor
            && candidate.getBoundingClientRect().width > 0
            && candidate.getBoundingClientRect().height > 0)
        : undefined;
      return objectId && object ? { label, objectId, object } : null;
    }).filter(pair => pair !== null);
    const selected = pairs.find(pair => pair.label.dataset.diagramPreserveColor === 'true')
      ?? pairs.find(pair => getComputedStyle(pair.label).color !== emphasisColor)
      ?? pairs[0];
    const objectBounds = selected?.object.getBoundingClientRect();
    return selected ? {
      objectId: selected.objectId,
      objectDomId: selected.object.id,
      labelDomId: selected.label.id,
      labelColor: getComputedStyle(selected.label).color,
      labelFontFamily: getComputedStyle(selected.label).fontFamily,
      labelFontSize: getComputedStyle(selected.label).fontSize,
      labelFontWeight: getComputedStyle(selected.label).fontWeight,
      labelTransform: getComputedStyle(selected.label).transform,
      preserveColor: selected.label.dataset.diagramPreserveColor === 'true',
      objectVisual: `${getComputedStyle(selected.object).fill}|${getComputedStyle(selected.object).stroke}|${getComputedStyle(selected.object).strokeWidth}`,
      objectBounds: objectBounds ? `${objectBounds.width}|${objectBounds.height}` : '',
    } : null;
  });
  assert.ok(pair, `${caseName}: no se encontró un par elemento-etiqueta enlazado`);
  assert.match(pair.labelFontFamily, /Cormorant Garamond/, `${caseName}: la etiqueta no usa la tipografía editorial de diagramas`);
  assert.equal(pair.labelFontSize, '19px', `${caseName}: la etiqueta no usa el tamaño reforzado`);
  assert.equal(pair.labelFontWeight, '700', `${caseName}: la etiqueta no usa el peso reforzado`);

  await page.hover(`[id="${pair.objectDomId}"]`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const labelAfterElementHover = await page.$eval(
    `[id="${pair.labelDomId}"]`,
    label => ({ color: getComputedStyle(label).color, transform: getComputedStyle(label).transform }),
  );
  if (pair.preserveColor) {
    assert.equal(labelAfterElementHover.color, pair.labelColor, `${caseName}: la etiqueta ignoró preserveColorOnHighlight`);
  } else {
    assert.notEqual(labelAfterElementHover.color, pair.labelColor, `${caseName}: la etiqueta no cambió de color con el elemento`);
  }
  assert.notEqual(labelAfterElementHover.transform, pair.labelTransform, `${caseName}: la etiqueta no aumentó de escala con el elemento`);

  await page.mouse.move(0, 0);
  await page.hover(`[id="${pair.labelDomId}"]`);
  await new Promise(resolve => setTimeout(resolve, 50));
  const objectAfterLabelHover = await page.$eval(
    `[id="${pair.objectDomId}"]`,
    object => {
      const bounds = object.getBoundingClientRect();
      return {
        visual: `${getComputedStyle(object).fill}|${getComputedStyle(object).stroke}|${getComputedStyle(object).strokeWidth}`,
        bounds: `${bounds.width}|${bounds.height}`,
      };
    },
  );
  if (pair.preserveColor) {
    assert.equal(objectAfterLabelHover.visual, pair.objectVisual, `${caseName}: el elemento ignoró preserveColorOnHighlight`);
  }
  assert.notEqual(objectAfterLabelHover.bounds, pair.objectBounds, `${caseName}: el elemento no creció con el hover de la etiqueta`);
}

async function verifyPublishedCase(page: Page, acceptanceCase: typeof CASES[number]) {
  const errors = collectBrowserErrors(page);
  await page.goto(`${BASE_URL}${acceptanceCase.route}`, { waitUntil: 'networkidle0', timeout: 30_000 });
  for (let index = 0; index < acceptanceCase.advanceSteps; index += 1) {
    await page.click('[aria-label="Paso siguiente"]');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const result = await page.evaluate((expectedTexts) => {
    const renderer = document.querySelector<HTMLElement>('[data-diagram-renderer]');
    const board = renderer?.querySelector<HTMLElement>('.jxgbox');
    const rendererBox = renderer?.getBoundingClientRect();
    const boardBox = board?.getBoundingClientRect();
    const visibleTexts = expectedTexts.map(expected => {
      const node = [...(renderer?.querySelectorAll<HTMLElement>('div') ?? [])]
        .find(element => element.textContent?.includes(expected));
      const bounds = node?.getBoundingClientRect();
      return { expected, visible: Boolean(bounds && bounds.width > 0 && bounds.height > 0) };
    });
    const boundary = board?.querySelector<SVGElement>('ellipse[id*="C"]');
    return {
      renderer: rendererBox ? [rendererBox.width, rendererBox.height] : null,
      board: boardBox ? [boardBox.width, boardBox.height] : null,
      objects: board?.querySelectorAll('svg *').length ?? 0,
      visibleTexts,
      boundaryFillOpacity: boundary?.getAttribute('fill-opacity') ?? null,
    };
  }, acceptanceCase.texts);

  assert.ok(result.renderer && result.renderer[0] >= 360 && result.renderer[1] >= 360, `${acceptanceCase.name}: renderer colapsado`);
  assert.ok(result.board && result.board[0] >= 350 && result.board[1] >= 350, `${acceptanceCase.name}: board colapsado`);
  assert.ok(result.objects >= acceptanceCase.minObjects, `${acceptanceCase.name}: escena JSXGraph incompleta`);
  result.visibleTexts.forEach(text => assert.ok(text.visible, `${acceptanceCase.name}: texto no visible (${text.expected})`));
  if (acceptanceCase.name === 'Poincaré') {
    assert.ok(Number(result.boundaryFillOpacity) <= 0.1, 'Poincaré: el disco oculta las geodésicas');
  }
  const renderer = await page.$('[data-diagram-renderer]');
  assert.ok(renderer, `${acceptanceCase.name}: renderer ausente para la regresión visual`);
  const lightScreenshot = await renderer.screenshot({ encoding: 'binary' });
  assert.ok(lightScreenshot.length > 5_000, `${acceptanceCase.name}: captura visual vacía`);
  if (acceptanceCase.name === 'Pitágoras') await verifySynchronizedElementLabelHover(page, acceptanceCase.name);
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await new Promise(resolve => setTimeout(resolve, 100));
  const darkScreenshot = await renderer.screenshot({ encoding: 'binary' });
  const digest = (value: Uint8Array) => createHash('sha256').update(value).digest('hex');
  assert.notEqual(digest(lightScreenshot), digest(darkScreenshot), `${acceptanceCase.name}: el tema oscuro no alteró el renderer compartido`);
  assert.deepEqual(errors, [], `${acceptanceCase.name}: errores de navegador`);
}

async function clickButton(page: Page, label: string, startsWith = false) {
  const clicked = await page.evaluate(({ expected, usePrefix }) => {
    const button = [...document.querySelectorAll<HTMLButtonElement>('button')]
      .find(candidate => usePrefix
        ? candidate.textContent?.trim().startsWith(expected)
        : candidate.textContent?.includes(expected));
    button?.click();
    return Boolean(button);
  }, { expected: label, usePrefix: startsWith });
  assert.ok(clicked, 'No se encontró el control esperado del editor.');
}

async function verifyPitagorasEditor(page: Page) {
  const errors = collectBrowserErrors(page);
  await page.goto(`${BASE_URL}/editor`, { waitUntil: 'networkidle0', timeout: 30_000 });
  await clickButton(page, 'Diagramas');
  const search = await page.waitForSelector('input');
  await search.type('Pitagoras');
  await clickButton(page, 'PitagorasEdición', true);
  await page.waitForFunction(() => document.body.textContent?.includes('Abrir edición visual exacta'));
  await clickButton(page, 'Abrir edición visual exacta');
  await page.waitForSelector('[data-diagram-renderer][data-diagram-mode="editor"]');
  await new Promise(resolve => setTimeout(resolve, 1_000));

  const state = await page.evaluate(() => {
    const renderer = document.querySelector<HTMLElement>('[data-diagram-renderer][data-diagram-mode="editor"]');
    const bounds = renderer?.getBoundingClientRect();
    const bodyText = document.body.textContent?.toLocaleLowerCase() ?? '';
    return {
      error: bodyText.includes('error de renderizado'),
      synced: bodyText.includes('modelo y fuente sincronizados'),
      modified: bodyText.includes('modificado visualmente'),
      size: bounds ? [bounds.width, bounds.height] : null,
      objects: renderer?.querySelectorAll('svg *').length ?? 0,
    };
  });
  assert.equal(state.error, false, 'Pitágoras: el editor cayó en ErrorBoundary');
  assert.equal(state.synced, true, 'Pitágoras: modelo y fuente no quedaron sincronizados');
  assert.equal(state.modified, false, 'Pitágoras: abrir el editor mutó el viewport');
  assert.ok(state.size && state.size[0] >= 700 && state.size[1] >= 360, 'Pitágoras: lienzo visual recortado');
  assert.ok(state.objects >= 100, 'Pitágoras: escena incompleta en el editor');
  assert.deepEqual(errors, [], 'Pitágoras: errores de consola al abrir edición visual');
}

async function main() {
  const server = startVite();
  try {
    await waitForServer(server);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    try {
      for (const acceptanceCase of CASES) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
        await verifyPublishedCase(page, acceptanceCase);
        await page.close();
      }
      const editor = await browser.newPage();
      await editor.setViewport({ width: 1600, height: 1100, deviceScaleFactor: 1 });
      await verifyPitagorasEditor(editor);
      await editor.close();
    } finally {
      await browser.close();
    }
    console.log('✅ Fase 5 E2E: 4 páginas reales y editor visual de Pitágoras verificados.');
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
