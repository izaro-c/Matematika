import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { generateContentIndex } from './generate-content-index';
import { SUPPORTED_LANGUAGES } from '../../src/i18n/config';

const PUBLIC_DIR = path.resolve('./public');
const DIST_DIR = path.resolve('./dist');

// Fuente única de verdad: los segmentos de ruta salen de src/i18n, igual que
// los usa AppRouter.tsx en tiempo de ejecución. Así el sitemap nunca puede
// desincronizarse de las URLs reales de la app, y añadir un idioma nuevo en
// src/i18n/languages/ lo propaga aquí automáticamente sin tocar este archivo.
const LANG_CODES = SUPPORTED_LANGUAGES.map((l) => l.code);

const routeSegments: Record<string, Record<string, string>> = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l.routeSegments as Record<string, string>])
);

const contentTypeToCanonical: Record<string, string> = {
  matematico: 'bio',
  mathematicians: 'bio',
  teorema: 'teorema',
  theorems: 'teorema',
  metodo: 'metodo',
  methods: 'metodo',
  demostracion: 'demo',
  demonstrations: 'demo',
  definicion: 'definicion',
  definitions: 'definicion',
  ejemplo: 'ejemplo',
  examples: 'ejemplo',
  ejercicio: 'ejercicio',
  exercises: 'ejercicio',
  'caso-de-uso': 'caso',
  usecases: 'caso',
  'plan-de-estudio': 'plan',
  plans: 'plan',
  axioma: 'axioma',
  axioms: 'axioma',
  modelo: 'modelo',
  models: 'modelo',
  'sistema-axiomatico': 'sistema',
  'axiomatic-systems': 'sistema',
};

export function getSiteUrl(): string {
  const envUrl = process.env.VITE_SITE_URL || process.env.SITE_URL;
  const defaultUrl = 'https://izaro-c.github.io/Matematika';
  const url = envUrl || defaultUrl;
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

/** Idioma por defecto para x-default y como fallback de contenido no traducido. */
const DEFAULT_LANG = 'es';

/** Última fecha de commit real de un archivo fuente (YYYY-MM-DD), o `undefined` si no se puede determinar. */
function gitLastModified(filePath: string): string | undefined {
  try {
    // eslint-disable-next-line sonarjs/os-command -- ruta viene del índice de contenido interno, no de input externo
    const out = execSync(`git log -1 --format=%cs -- "${filePath}"`, { encoding: 'utf-8' }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

export interface SitemapRoute {
  /** Ruta absoluta, ej. "/es/definicion/triangulo" */
  path: string;
  lastmod: string;
  changefreq: 'weekly' | 'monthly';
  priority: string;
  alternates: { hreflang: string; path: string }[];
}

/**
 * Calcula la lista completa de rutas del sitio (páginas estáticas + contenido MDX),
 * en todos los idiomas soportados. Es la ÚNICA fuente de verdad de "qué rutas existen":
 * la usa tanto el generador de sitemap.xml como el script de prerenderizado, para que
 * nunca puedan desincronizarse entre sí ni respecto a src/i18n/AppRouter.tsx.
 */
export function getAllRoutes(): SitemapRoute[] {
  const contentIndex = generateContentIndex();
  const today = new Date().toISOString().split('T')[0];
  const routes: SitemapRoute[] = [];

  // 1. Páginas estáticas principales, una por idioma soportado
  const staticPages: { canonicalKey: string; priority: string }[] = [
    { canonicalKey: 'root', priority: '1.0' },
    { canonicalKey: 'diccionario', priority: '0.8' },
    { canonicalKey: 'historia', priority: '0.8' },
    { canonicalKey: 'grafo', priority: '0.8' },
    { canonicalKey: 'axiomas', priority: '0.8' },
    { canonicalKey: 'metodo', priority: '0.8' },
  ];

  for (const page of staticPages) {
    const pathFor = (lang: string) =>
      page.canonicalKey === 'root' ? `/${lang}` : `/${lang}/${routeSegments[lang]?.[page.canonicalKey] || page.canonicalKey}`;

    for (const lang of LANG_CODES) {
      routes.push({
        path: pathFor(lang),
        lastmod: today,
        changefreq: 'weekly',
        priority: page.priority,
        alternates: [
          ...LANG_CODES.map((l) => ({ hreflang: l, path: pathFor(l) })),
          { hreflang: 'x-default', path: pathFor(DEFAULT_LANG) },
        ],
      });
    }
  }

  // 2. Artículos MDX del índice de contenido
  const processedKeys = new Set<string>();

  for (const entry of Object.values(contentIndex)) {
    const { id, lang, contentType, availableLangs = [lang], filePath } = entry;
    const entryKey = `${lang}:${id}`;
    if (processedKeys.has(entryKey)) continue;
    processedKeys.add(entryKey);

    const canonicalType = contentTypeToCanonical[contentType] || contentType;
    const segFor = (l: string) => routeSegments[l]?.[canonicalType] || canonicalType;
    const itemPath = `/${lang}/${segFor(lang)}/${id}`;

    const alternates = LANG_CODES
      .filter((l) => availableLangs.includes(l))
      .map((l) => ({ hreflang: l, path: `/${l}/${segFor(l)}/${id}` }));

    const defaultLang = availableLangs.includes(DEFAULT_LANG) ? DEFAULT_LANG : lang;
    alternates.push({ hreflang: 'x-default', path: `/${defaultLang}/${segFor(defaultLang)}/${id}` });

    routes.push({
      path: itemPath,
      lastmod: gitLastModified(path.join('content/mdx', filePath)) || today,
      changefreq: 'monthly',
      priority: '0.7',
      alternates,
    });
  }

  return routes;
}

export function generateSitemapAndRobots() {
  const baseUrl = getSiteUrl();
  console.log(`📡 Generando sitemap.xml y robots.txt usando URL base: ${baseUrl}`);

  const routes = getAllRoutes();

  const xmlEntries = routes.map((r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
${r.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${baseUrl}${a.path}" />`).join('\n')}
  </url>`);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries.join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Disallow: /editor
Disallow: /*/editor

Sitemap: ${baseUrl}/sitemap.xml
`;

  // Escribir en public/
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('  ✓ Escritos public/sitemap.xml y public/robots.txt');

  // Si dist/ existe (después de build), escribir en dist/ también
  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8');
    console.log('  ✓ Escritos dist/sitemap.xml y dist/robots.txt');
  }

  console.log(`✅ Sitemap generado con éxito (${xmlEntries.length} URLs).`);
}

if (process.argv[1] && process.argv[1].endsWith('generate-sitemap-and-robots.ts')) {
  generateSitemapAndRobots();
}
