/**
 * Prerenderizado post-build: visita cada ruta real del sitio con un navegador
 * headless (Puppeteer) y guarda el HTML ya pintado como `dist/<ruta>/index.html`.
 *
 * Por qué hace falta: la app es una SPA (Wouter) sin SSR. GitHub Pages solo
 * sabe servir archivos estáticos, así que una petición HTTP directa a
 * `/es/definicion/triangulo` (la que hacen los buscadores, un link
 * compartido, o un refresco de página) no encuentra ningún archivo en esa
 * ruta y responde 404 real — aunque la navegación por clic dentro de la app
 * funcione perfectamente. Este script elimina esa dependencia: tras el
 * build, cada URL del sitemap pasa a existir como archivo HTML real con su
 * contenido, su <title> y sus meta tags ya insertados por SeoHead.
 *
 * Se usa un navegador real (no `renderToString` en Node) a propósito: hay
 * componentes que dependen de canvas/WebGL reales (jsxgraph, three.js,
 * react-force-graph) y que romperían en un entorno SSR de Node.
 *
 * Requiere que `dist/` ya exista (se ejecuta después de `vite build`).
 */
import { spawn, type ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';
import puppeteer, { type Browser } from 'puppeteer';
import { getAllRoutes } from './generate-sitemap-and-robots';

const DIST_DIR = path.resolve('./dist');
const BASE_PATH = '/Matematika/'; // debe coincidir con `base` en vite.config.ts
const PORT = 4174; // puerto dedicado para no chocar con `vite preview` en desarrollo
const HOST = `http://localhost:${PORT}`;
const CONCURRENCY = 5;
const NAV_TIMEOUT_MS = 60_000; // subido de 30s: hay páginas con jsxgraph/three.js que tardan más en montar

async function waitForServer(url: string, timeoutMs = 20_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return; // el server ya responde, aunque sea 404 (SPA fallback)
    } catch {
      // servidor aún no arriba, seguimos intentando
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`El preview server no respondió en ${timeoutMs}ms (${url})`);
}

function startPreviewServer(): ChildProcess {
  const proc = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { stdio: 'pipe' }
  );
  proc.stderr?.on('data', (d) => {
    const msg = d.toString();
    if (/error/i.test(msg)) console.error('[vite preview]', msg.trim());
  });
  return proc;
}

/** Convierte una ruta absoluta ("/es/definicion/triangulo" o "/") al archivo dist/ correspondiente. */
function outputFileFor(routePath: string): string {
  if (routePath === '/') return path.join(DIST_DIR, 'index.html');
  const clean = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(DIST_DIR, clean, 'index.html');
}

async function prerenderRoute(browser: Browser, routePath: string, attempt = 1): Promise<{ path: string; ok: boolean; error?: string }> {
  const page = await browser.newPage();
  try {
    const url = `${HOST}${BASE_PATH.slice(0, -1)}${routePath}`;
    // 'domcontentloaded' en vez de 'networkidle0': no dependemos de que TODAS las
    // peticiones de red terminen (p. ej. Google Fonts externas), solo de que el
    // HTML inicial llegue. La señal real de "la app ya está pintada" es la
    // comprobación de #root + .page-loading de abajo.
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });

    // Esperar a que React haya montado contenido real Y a que ya no esté la
    // pantalla de carga. Ojo: NO basta con esperar a que .page-loading
    // desaparezca por sí solo — waitForSelector(hidden:true) se cumple también
    // si el elemento nunca llegó a existir, y justo tras domcontentloaded
    // #root todavía puede estar vacío (React aún no montó). Por eso exigimos
    // ambas condiciones a la vez.
    try {
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          if (!root || root.children.length === 0) return false;
          return !document.querySelector('.page-loading');
        },
        { timeout: 20_000 }
      );
    } catch {
      console.warn(`  ⚠ ${routePath}: no se confirmó el render completo a tiempo, se captura igualmente`);
    }

    // Pequeño margen extra para efectos posteriores al primer paint (SeoHead, KaTeX, etc.)
    await new Promise((r) => setTimeout(r, 150));

    const html = await page.content();
    const outFile = outputFileFor(routePath);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, 'utf-8');
    return { path: routePath, ok: true };
  } catch (err) {
    if (attempt < 2) {
      // Reintento único: cubre timeouts puntuales por contención de red/CPU
      // entre las páginas headless concurrentes, no fallos reales de la ruta.
      await page.close();
      return prerenderRoute(browser, routePath, attempt + 1);
    }
    return { path: routePath, ok: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    await page.close().catch(() => {});
  }
}

async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let index = 0;
  async function next(): Promise<void> {
    const current = index++;
    if (current >= items.length) return;
    await worker(items[current]);
    return next();
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
}

async function prerender() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist/ no existe todavía — ejecuta `vite build` antes que este script.');
  }

  const routes = ['/', ...getAllRoutes().map((r) => r.path)];
  console.log(`🖨️  Prerenderizando ${routes.length} rutas (concurrencia: ${CONCURRENCY})...`);

  const server = startPreviewServer();
  let browser: Browser | undefined;
  const failures: { path: string; error?: string }[] = [];

  try {
    await waitForServer(`${HOST}${BASE_PATH}`);
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // three.js / react-three-fiber necesitan WebGL real, no solo canvas 2D.
        // Sin estas flags, el contexto WebGL puede fallar o degradarse en headless
        // y esos componentes se quedan colgados intentando reintentar.
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-webgl',
        '--ignore-gpu-blocklist',
      ],
    });

    let done = 0;
    await runWithConcurrency(routes, CONCURRENCY, async (routePath) => {
      const result = await prerenderRoute(browser!, routePath);
      done++;
      if (!result.ok) {
        failures.push(result);
        console.error(`  ✗ [${done}/${routes.length}] ${routePath} → ${result.error}`);
      } else if (done % 25 === 0 || done === routes.length) {
        console.log(`  ✓ [${done}/${routes.length}] rutas prerenderizadas`);
      }
    });
  } finally {
    await browser?.close();
    server.kill();
  }

  if (failures.length > 0) {
    // No bloqueamos el deploy por rutas puntuales que fallen (p. ej. un diagrama
    // pesado que se cuelga en el navegador headless): esas páginas simplemente
    // se quedan sin HTML prerenderizado y caen al 404.html/redirección JS de
    // siempre, que sigue funcionando como red de seguridad. Si prefieres que
    // el build falle duro ante cualquier fallo, cambia esto por process.exitCode = 1.
    console.warn(`\n⚠️  ${failures.length} ruta(s) no se pudieron prerenderizar (seguirán funcionando vía redirección JS, pero sin HTML real para crawlers):`);
    failures.forEach((f) => console.warn(`   - ${f.path}: ${f.error}`));
  } else {
    console.log(`\n✅ Prerenderizado completo: ${routes.length} páginas HTML reales generadas en dist/`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('prerender.ts')) {
  prerender();
}
