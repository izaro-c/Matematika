import fs from 'fs';
import path from 'path';
import { generateContentIndex, type ContentEntry } from './generate-content-index';

const PUBLIC_DIR = path.resolve('./public');
const DIST_DIR = path.resolve('./dist');

const routeSegments: Record<string, Record<string, string>> = {
  es: {
    teorema: 'teorema',
    definicion: 'definicion',
    ejemplo: 'ejemplo',
    ejercicio: 'ejercicio',
    axioma: 'axioma',
    modelo: 'modelo',
    sistema: 'sistema',
    metodo: 'metodo',
    demo: 'demo',
    bio: 'bio',
    rama: 'rama',
    plan: 'plan',
    caso: 'caso',
    historia: 'historia',
    diccionario: 'diccionario',
    grafo: 'grafo',
    axiomas: 'axiomas',
  },
  eu: {
    teorema: 'teorema',
    definicion: 'definizioa',
    ejemplo: 'adibidea',
    ejercicio: 'ariketa',
    axioma: 'axioma',
    modelo: 'eredua',
    sistema: 'sistema',
    metodo: 'metodoa',
    demo: 'frogapena',
    bio: 'bio',
    rama: 'adarra',
    plan: 'plana',
    caso: 'erabilera-kasua',
    historia: 'historia',
    diccionario: 'hiztegia',
    grafo: 'grafoa',
    axiomas: 'axiomak',
  },
};

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

export function generateSitemapAndRobots() {
  const baseUrl = getSiteUrl();
  console.log(`📡 Generando sitemap.xml y robots.txt usando URL base: ${baseUrl}`);

  // Asegurar que el índice de contenido está actualizado
  const contentIndex = generateContentIndex();

  const today = new Date().toISOString().split('T')[0];

  // 1. Páginas estáticas principales por idioma
  const staticPages = [
    { canonicalKey: 'root', pathEs: '/es', pathEu: '/eu' },
    { canonicalKey: 'diccionario', pathEs: '/es/diccionario', pathEu: '/eu/hiztegia' },
    { canonicalKey: 'historia', pathEs: '/es/historia', pathEu: '/eu/historia' },
    { canonicalKey: 'grafo', pathEs: '/es/grafo', pathEu: '/eu/grafoa' },
    { canonicalKey: 'axiomas', pathEs: '/es/axiomas', pathEu: '/eu/axiomak' },
    { canonicalKey: 'metodos', pathEs: '/es/metodo', pathEu: '/eu/metodoak' },
  ];

  const xmlEntries: string[] = [];

  // Agregar páginas estáticas al sitemap
  for (const page of staticPages) {
    for (const lang of ['es', 'eu']) {
      const pagePath = lang === 'es' ? page.pathEs : page.pathEu;
      const altLang = lang === 'es' ? 'eu' : 'es';
      const altPath = lang === 'es' ? page.pathEu : page.pathEs;

      xmlEntries.push(`  <url>
    <loc>${baseUrl}${pagePath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.canonicalKey === 'root' ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}${pagePath}" />
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}${altPath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.pathEs}" />
  </url>`);
    }
  }

  // 2. Procesar artículos MDX del índice de contenido
  const processedKeys = new Set<string>();

  for (const entry of Object.values(contentIndex)) {
    const { id, lang, contentType, availableLangs = [lang] } = entry;
    const entryKey = `${lang}:${id}`;

    if (processedKeys.has(entryKey)) continue;
    processedKeys.add(entryKey);

    const canonicalType = contentTypeToCanonical[contentType] || contentType;
    const seg = routeSegments[lang]?.[canonicalType] || canonicalType;
    const itemPath = `/${lang}/${seg}/${id}`;

    const alternateLinks: string[] = [];

    // hreflang SOLO si el artículo realmente existe en ambos idiomas
    for (const l of ['es', 'eu']) {
      if (availableLangs.includes(l)) {
        const altSeg = routeSegments[l]?.[canonicalType] || canonicalType;
        const altPath = `/${l}/${altSeg}/${id}`;
        alternateLinks.push(`    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}${altPath}" />`);
      }
    }

    // x-default siempre apunta a la versión en español si existe, o al idioma actual
    const defaultLang = availableLangs.includes('es') ? 'es' : lang;
    const defaultSeg = routeSegments[defaultLang]?.[canonicalType] || canonicalType;
    const defaultPath = `/${defaultLang}/${defaultSeg}/${id}`;
    alternateLinks.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${defaultPath}" />`);

    xmlEntries.push(`  <url>
    <loc>${baseUrl}${itemPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${alternateLinks.join('\n')}
  </url>`);
  }

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
