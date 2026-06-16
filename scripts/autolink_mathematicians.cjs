#!/usr/bin/env node
/**
 * autolink_mathematicians.cjs
 *
 * Escanea todos los archivos MDX de src/content/ (excepto mathematicians/)
 * y aplica dos transformaciones:
 *
 * 1. Convierte links Markdown a matemáticos en ConceptLink:
 *    [Bayes](/bio/bayes) → <ConceptLink targetId="bayes">Bayes</ConceptLink>
 *
 * 2. En texto libre, detecta nombres de matemáticos conocidos y los envuelve
 *    en ConceptLink si no están ya dentro de un componente JSX o tag.
 *    "Teorema de Euclides" → "Teorema de <ConceptLink targetId="euclides">Euclides</ConceptLink>"
 *
 * 3. Si se detecta un matemático no existente en mathematicians/, crea un stub.
 *
 * Uso: node scripts/autolink_mathematicians.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const CONTENT_DIR = path.join(__dirname, '../src/content');
const MATH_DIR = path.join(CONTENT_DIR, 'mathematicians');

// ── Tabla canónica de matemáticos ─────────────────────────────────────────────
// Formato: { nombreMostrado: slug }
// Los nombres que aparecen aquí se detectarán en el texto.
// El orden importa: los nombres más largos van primero para evitar solapamientos.

const MATHEMATICIAN_MAP = {
  // Nombres completos primero
  'Ferdinand Georg Frobenius': 'frobenius',
  'Carl Friedrich Gauss':      'gauss',
  'Leonhard Euler':            'euler',
  'Isaac Newton':              'newton',
  'Gottfried Wilhelm Leibniz': 'leibniz',
  'Pierre-Simon Laplace':      'laplace',
  'Augustin-Louis Cauchy':     'cauchy',
  'William Rowan Hamilton':    'hamilton',
  'Karl Weierstrass':          'weierstrass',
  'Bernhard Riemann':          'riemann',
  'Gabriel Cramer':            'cramer',
  'Thomas Bayes':              'bayes',
  'Tales de Mileto':           'tales',
  'Josiah Willard Gibbs':      'gibbs',
  'Pierre Frédéric Sarrus':    'sarrus',
  'Eugène Rouché':             'rouche',
  'Isaac Barrow':              'barrow',
  'Ferdinand Frobenius':       'frobenius',
  'Arquímedes de Siracusa':    'arquimedes',
  // Apellidos solos (van después para no ocultar coincidencias de nombre completo)
  'Frobenius':    'frobenius',
  'Rouché':       'rouche',
  'Gauss':        'gauss',
  'Euler':        'euler',
  'Leibniz':      'leibniz',
  'Newton':       'newton',
  'Laplace':      'laplace',
  'Cauchy':       'cauchy',
  'Hamilton':     'hamilton',
  'Weierstrass':  'weierstrass',
  'Riemann':      'riemann',
  'Cramer':       'cramer',
  'Bayes':        'bayes',
  'Tales':        'tales',
  'Gibbs':        'gibbs',
  'Sarrus':       'sarrus',
  'Barrow':       'barrow',
  'Arquímedes':   'arquimedes',
  'Pitagoras':    'pitagoras',
  'Pitágoras':    'pitagoras',
  'Euclides':     'euclides',
  'Hipatia':      'hipatia',
};

// Slugs de matemáticos que existen en nuestro directorio
const existingMathematicians = new Set(
  fs.readdirSync(MATH_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', '').toLowerCase())
);

// ── Template para stubs nuevos ────────────────────────────────────────────────

function makeStub(displayName, slug) {
  const initial = displayName.charAt(0);
  return `export const metadata = {
  id: '${slug}',
  name: '${displayName}',
  fullName: '${displayName}',
  era: '',
  description: 'Matemático referenciado en el Jardín Digital. Pendiente de completar.',
  image: '',
  year: 0,
  birth: '',
  death: ''
};

<Capitular letra="${initial}" />

*Esta página está pendiente de completar.*
`;
}

// ── Funciones de transformación ───────────────────────────────────────────────

/**
 * Convierte [Nombre](/bio/slug) → <ConceptLink targetId="slug">Nombre</ConceptLink>
 * Solo dentro del cuerpo MDX (no dentro del bloque `export const metadata`).
 */
function convertMarkdownLinks(content) {
  // Regex: [texto](/bio/slug) — solo rutas /bio/
  const mdLinkRe = /\[([^\]]+)\]\(\/bio\/([a-z0-9_-]+)\)/g;
  return content.replace(mdLinkRe, (match, text, slug) => {
    return `<ConceptLink targetId="${slug}">${text}</ConceptLink>`;
  });
}

/**
 * En el cuerpo MDX (fuera del bloque metadata), envuelve menciones de
 * matemáticos en ConceptLink, si no están ya dentro de una etiqueta JSX.
 *
 * Para evitar dobles conversiones, no toca texto que ya contenga
 * 'ConceptLink' inmediatamente alrededor.
 */
function autolinkNames(content) {
  // Separar el bloque de metadata del resto
  const metaEnd = content.indexOf('\n}\n');
  if (metaEnd === -1) return content;

  const metaBlock = content.slice(0, metaEnd + 3);
  let body = content.slice(metaEnd + 3);

  for (const [name, slug] of Object.entries(MATHEMATICIAN_MAP)) {
    // No procesar si es una cadena de 1 carácter o menos
    if (name.length <= 2) continue;

    // Escapar el nombre para usarlo en regex
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Regex: coincide con el nombre que:
    // - NO está precedido por targetId=" o > (ya dentro de JSX)
    // - NO está dentro de backticks `...`
    // - Es una palabra delimitada (no parte de otra palabra más larga)
    const nameRe = new RegExp(
      `(?<!targetId=["'][^"']{0,50})(?<![>])\\b(${escaped})\\b(?![^<]*>)`,
      'g'
    );

    // Solo reemplazamos si el resultado no ya tiene ConceptLink con ese targetId
    const conceptLinkMarker = `targetId="${slug}"`;
    if (!body.includes(conceptLinkMarker)) {
      // Reemplazar solo la primera ocurrencia para no ser intrusivos
      let replaced = false;
      body = body.replace(nameRe, (match) => {
        if (replaced) return match;
        replaced = true;
        return `<ConceptLink targetId="${slug}">${match}</ConceptLink>`;
      });
    }
  }

  return metaBlock + body;
}

/**
 * Registra un slug necesario y crea el stub si no existe.
 */
function ensureStubExists(displayName, slug) {
  if (existingMathematicians.has(slug)) return false;

  const stubPath = path.join(MATH_DIR, `${slug.charAt(0).toUpperCase() + slug.slice(1)}.mdx`);
  if (fs.existsSync(stubPath)) {
    existingMathematicians.add(slug);
    return false;
  }

  if (!DRY_RUN) {
    fs.writeFileSync(stubPath, makeStub(displayName, slug), 'utf-8');
    existingMathematicians.add(slug);
  }
  console.log(`  📝 Stub creado: ${path.basename(stubPath)}`);
  return true;
}

// ── Proceso principal ─────────────────────────────────────────────────────────

const SKIP_DIRS = ['mathematicians', 'plans'];

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      processDir(fullPath);
    } else if (entry.name.endsWith('.mdx')) {
      processFile(fullPath);
    }
  }
}

let filesModified = 0;
let stubsCreated = 0;

function processFile(filepath) {
  const original = fs.readFileSync(filepath, 'utf-8');
  let content = original;

  // Paso 1: convertir links Markdown [Nombre](/bio/slug)
  content = convertMarkdownLinks(content);

  // Paso 2: autolink nombres en texto libre
  content = autolinkNames(content);

  // Recoger todos los slugs usados en ConceptLink con prefijo bio-conocido
  const usedSlugs = [...content.matchAll(/targetId="([a-z0-9_-]+)"/g)]
    .map(m => m[1])
    .filter(slug => Object.values(MATHEMATICIAN_MAP).includes(slug));

  // Paso 3: asegurarse de que existe el MDX de cada matemático referenciado
  for (const slug of new Set(usedSlugs)) {
    const displayName = Object.entries(MATHEMATICIAN_MAP).find(([, s]) => s === slug)?.[0] || slug;
    if (ensureStubExists(displayName, slug)) stubsCreated++;
  }

  if (content !== original) {
    if (!DRY_RUN) {
      fs.writeFileSync(filepath, content, 'utf-8');
    }
    const rel = path.relative(CONTENT_DIR, filepath);
    console.log(`  ✅ Modificado: ${rel}`);
    filesModified++;
  }
}

// ── Ejecución ─────────────────────────────────────────────────────────────────

console.log(`\n🔍 Escaneando contenido MDX${DRY_RUN ? ' (DRY RUN — sin cambios)' : ''}…\n`);
processDir(CONTENT_DIR);
console.log(`\n📊 Resumen:`);
console.log(`   ${filesModified} archivos modificados`);
console.log(`   ${stubsCreated} stubs creados`);
if (DRY_RUN) console.log(`\n⚠️  Modo dry-run: ningún archivo fue escrito.`);
