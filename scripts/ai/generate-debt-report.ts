import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

interface ScannedFile {
  path: string;
  fullPath: string;
  extension: string;
  text: string;
  lines: number;
  bytes: number;
}

interface CountByFile {
  path: string;
  count: number;
}

interface PackageJson {
  scripts?: Record<string, string>;
}

interface BridgeDebt {
  entries?: unknown[];
}

interface ContentCoverage {
  summary?: {
    total?: number;
    diagrams?: Record<string, number>;
    lean?: Record<string, number>;
  };
}

type FsdLayer = 'app' | 'database' | 'entities' | 'features' | 'pages' | 'shared' | 'widgets';

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, 'ai/reports/debt-report.md');
const TEXT_EXTENSIONS = new Set([
  '.cjs',
  '.css',
  '.js',
  '.json',
  '.lean',
  '.md',
  '.mdx',
  '.mjs',
  '.py',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);
const TS_EXTENSIONS = new Set(['.ts', '.tsx']);
const IGNORED_DIRECTORY_NAMES = new Set([
  '.git',
  '.lake',
  '.vite',
  'coverage',
  'dist',
  'node_modules',
]);
const IGNORED_PREFIXES = ['ai/indexes/', 'ai/reports/', 'docs/api/'];
const AI_ROOTS = ['ai', 'docs/ai', '.agents', '.opencode', '.auxiliary'];
const FSD_LAYERS: FsdLayer[] = ['app', 'pages', 'widgets', 'features', 'entities', 'shared', 'database'];
const LARGE_FILE_LINES = 300;
const LARGE_FILE_BYTES = 20_000;
const RESPONSIBILITY_LINES = 250;
const HEX_PATTERN = /#[\da-fA-F]{8}\b|#[\da-fA-F]{6}\b|#[\da-fA-F]{3}\b/g;
const TODO_PATTERN = /\b(?:TODO|FIXME)\b/g;
const ANY_PATTERN = /\bany\b/g;
const warnings: string[] = [];

function toRelative(filePath: string): string {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right);
}

function lineCount(text: string): number {
  if (text.length === 0) return 0;
  const count = text.split(/\r?\n/).length;
  return text.endsWith('\n') ? count - 1 : count;
}

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

function isIgnored(filePath: string): boolean {
  const relativePath = toRelative(filePath);
  return IGNORED_PREFIXES.some(prefix => relativePath.startsWith(prefix));
}

function walkTextFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  const files: string[] = [];

  const visit = (current: string): void => {
    const entries = fs.readdirSync(current, { withFileTypes: true })
      .sort((left, right) => compareText(left.name, right.name));
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORY_NAMES.has(entry.name) && !isIgnored(`${fullPath}/`)) visit(fullPath);
      } else if (
        entry.isFile()
        && TEXT_EXTENSIONS.has(path.extname(entry.name))
        && !isIgnored(fullPath)
      ) {
        files.push(fullPath);
      }
    }
  };

  visit(directory);
  return files.sort((left, right) => compareText(toRelative(left), toRelative(right)));
}

function scanFile(filePath: string): ScannedFile {
  const text = fs.readFileSync(filePath, 'utf8');
  return {
    path: toRelative(filePath),
    fullPath: filePath,
    extension: path.extname(filePath),
    text,
    lines: lineCount(text),
    bytes: Buffer.byteLength(text),
  };
}

function readJson<T>(relativePath: string): T | null {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as T;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    warnings.push(`${relativePath}: JSON ilegible (${detail}).`);
    return null;
  }
}

function countByFile(files: ScannedFile[], pattern: RegExp): CountByFile[] {
  return files
    .map(file => ({ path: file.path, count: countMatches(file.text, pattern) }))
    .filter(entry => entry.count > 0)
    .sort((left, right) => right.count - left.count || compareText(left.path, right.path));
}

function sumCounts(entries: CountByFile[]): number {
  return entries.reduce((total, entry) => total + entry.count, 0);
}

function escapeCell(value: string | number): string {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function markdownTable(headers: string[], rows: Array<Array<string | number>>): string {
  if (rows.length === 0) return '_Ninguno detectado._';
  const header = `| ${headers.map(escapeCell).join(' | ')} |`;
  const separator = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map(row => `| ${row.map(escapeCell).join(' | ')} |`);
  return [header, separator, ...body].join('\n');
}

function metricTable(entries: CountByFile[]): string {
  return markdownTable(
    ['Archivo', 'Apariciones'],
    entries.map(entry => [`\`${entry.path}\``, entry.count]),
  );
}

function fsdLayer(filePath: string): FsdLayer | null {
  const match = /^src\/([^/]+)\//.exec(filePath);
  return match !== null && FSD_LAYERS.includes(match[1] as FsdLayer)
    ? match[1] as FsdLayer
    : null;
}

function importSpecifiers(text: string): string[] {
  const fromImports = [...text.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map(match => match[1]);
  const dynamicImports = [...text.matchAll(/\bimport\(["']([^"']+)["']\)/g)].map(match => match[1]);
  const sideEffectImports = text.split(/\r?\n/)
    .map(line => /^\s*import\s+["']([^"']+)["']/.exec(line)?.[1])
    .filter((specifier): specifier is string => specifier !== undefined);
  return [...fromImports, ...dynamicImports, ...sideEffectImports]
    .filter(specifier => !specifier.startsWith('node:'));
}

function resolveImport(source: ScannedFile, specifier: string): string | null {
  if (specifier.startsWith('@/')) return `src/${specifier.slice(2)}`;
  if (!specifier.startsWith('.')) return null;
  const absolute = path.resolve(path.dirname(source.fullPath), specifier);
  const relativePath = toRelative(absolute);
  return relativePath.startsWith('src/') ? relativePath : null;
}

function fsdViolation(source: FsdLayer, target: FsdLayer): string | null {
  if (source === 'shared' && ['pages', 'widgets', 'features', 'entities'].includes(target)) {
    return 'shared → capa superior';
  }
  if (source === 'entities' && ['pages', 'widgets', 'features', 'app'].includes(target)) {
    return 'entities → UI/estado superior';
  }
  if (source === 'features' && ['pages', 'app'].includes(target)) return 'features → pages/app';
  if (source === 'widgets' && ['pages', 'features'].includes(target)) return 'widgets → pages/features';
  if (source === 'pages' && target === 'pages') return 'pages → pages';
  return null;
}

function possibleFsdViolations(files: ScannedFile[]): Array<{
  source: string;
  target: string;
  rule: string;
}> {
  const results: Array<{ source: string; target: string; rule: string }> = [];
  for (const file of files.filter(candidate => candidate.path.startsWith('src/'))) {
    const sourceLayer = fsdLayer(file.path);
    if (sourceLayer === null) continue;
    for (const specifier of importSpecifiers(file.text)) {
      const targetPath = resolveImport(file, specifier);
      const targetLayer = targetPath === null ? null : fsdLayer(`${targetPath}/`);
      if (targetPath === null || targetLayer === null) continue;
      const rule = fsdViolation(sourceLayer, targetLayer);
      if (rule !== null) results.push({ source: file.path, target: specifier, rule });
    }
  }
  return results.sort((left, right) =>
    compareText(left.source, right.source)
    || compareText(left.target, right.target)
    || compareText(left.rule, right.rule));
}

function testFiles(files: ScannedFile[]): ScannedFile[] {
  return files.filter(file =>
    file.path.startsWith('tests/')
    || /(?:^|\/)[^/]+\.(?:spec|test)\.[cm]?[jt]sx?$/.test(file.path));
}

function testDebtByZone(files: ScannedFile[]): Array<{
  zone: FsdLayer;
  sourceFiles: number;
  directTestFiles: number;
}> {
  const sourceFiles = files.filter(file => file.path.startsWith('src/') && TS_EXTENSIONS.has(file.extension));
  const tests = testFiles(files);
  return FSD_LAYERS.map(zone => {
    const referencedBy = new Set<string>();
    for (const test of tests) {
      const hasDirectReference = importSpecifiers(test.text).some(specifier => {
        const resolved = resolveImport(test, specifier);
        return resolved?.startsWith(`src/${zone}/`) ?? false;
      });
      if (hasDirectReference) referencedBy.add(test.path);
    }
    return {
      zone,
      sourceFiles: sourceFiles.filter(file => fsdLayer(file.path) === zone).length,
      directTestFiles: referencedBy.size,
    };
  });
}

function configuredFsdRules(): { errors: number; warnings: number } {
  const configPath = path.join(ROOT, '.dependency-cruiser.js');
  if (!fs.existsSync(configPath)) return { errors: 0, warnings: 0 };
  const text = fs.readFileSync(configPath, 'utf8');
  return {
    errors: countMatches(text, /severity:\s*['"]error['"]/g),
    warnings: countMatches(text, /severity:\s*['"]warn['"]/g),
  };
}

function componentCandidates(files: ScannedFile[]): Array<{
  path: string;
  lines: number;
  imports: number;
  hooks: number;
  handlers: number;
}> {
  return files
    .filter(file => file.extension === '.tsx' && file.path.startsWith('src/'))
    .map(file => ({
      path: file.path,
      lines: file.lines,
      imports: countMatches(file.text, /^import\b/gm),
      hooks: countMatches(file.text, /\buse[A-Z][A-Za-z0-9]*\s*\(/g),
      handlers: countMatches(file.text, /\b(?:handle|on)[A-Z][A-Za-z0-9]*\b/g),
    }))
    .filter(metric =>
      metric.lines >= RESPONSIBILITY_LINES
      || (metric.imports >= 15 && metric.hooks >= 5)
      || metric.handlers >= 12)
    .sort((left, right) =>
      right.lines - left.lines
      || right.hooks - left.hooks
      || compareText(left.path, right.path));
}

function countValues(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function analyzeMdxFile(file: ScannedFile): {
  path: string;
  zone: string;
  missingFields: string[];
  missingRequires: boolean;
  idMismatch: string | null;
  rawAnchors: number;
  proofStepsWithoutJustification: number;
  lacksInteractiveCue: boolean;
} {
  const zone = file.path.split('/')[3] ?? 'sin-zona';
  const type = /["']?type["']?\s*:\s*["']([^"']+)["']/.exec(file.text)?.[1];
  const titleField = type === 'matematico' ? 'name' : 'title';
  const missingFields = ['id', 'type', titleField, 'description']
    .filter(field => !new RegExp(`["']?${field}["']?\\s*:`).test(file.text));
  if (!/export\s+const\s+metadata\s*=/.test(file.text)) missingFields.unshift('export metadata');
  const id = /["']?id["']?\s*:\s*["']([^"']+)["']/.exec(file.text)?.[1];
  const rawAnchors = file.text.split(/\r?\n/)
    .filter(line => /<a\b/i.test(line) && /\bhref\s*=/i.test(line))
    .length;
  const proofSteps = [...file.text.matchAll(/<ProofStep\b[^>]*>/g)];
  const proofStepsWithoutJustification = proofSteps
    .filter(match => !/\bjustificacion\s*=/.test(match[0]))
    .length;
  const interactiveType = /\/(?:axioms|definitions|theorems)\//.test(file.path);
  const interactiveCue = /\b(?:hasSimulation|Simulation|diagram|Diagrama)\b/.test(file.text);

  return {
    path: file.path,
    zone,
    missingFields,
    missingRequires: !/["']?requires["']?\s*:/.test(file.text),
    idMismatch: id !== undefined && path.basename(file.path, '.mdx') !== id ? id : null,
    rawAnchors,
    proofStepsWithoutJustification,
    lacksInteractiveCue: interactiveType && !interactiveCue,
  };
}

function mdxAnalysis(files: ScannedFile[]): {
  byZone: Array<{ zone: string; count: number }>;
  missingMetadata: Array<{ path: string; fields: string[] }>;
  missingRequiresByZone: Array<{ zone: string; count: number }>;
  idMismatches: Array<{ path: string; id: string }>;
  rawAnchors: CountByFile[];
  proofStepsWithoutJustification: CountByFile[];
  noInteractiveCue: string[];
} {
  const mdxFiles = files.filter(file => file.path.startsWith('src/database/content/') && file.extension === '.mdx');
  const analyses = mdxFiles.map(analyzeMdxFile);
  const zoneCounts = countValues(analyses.map(analysis => analysis.zone));
  const missingRequiresCounts = countValues(
    analyses.filter(analysis => analysis.missingRequires).map(analysis => analysis.zone),
  );

  return {
    byZone: [...zoneCounts.entries()]
      .map(([zone, count]) => ({ zone, count }))
      .sort((left, right) => compareText(left.zone, right.zone)),
    missingMetadata: analyses
      .filter(analysis => analysis.missingFields.length > 0)
      .map(analysis => ({ path: analysis.path, fields: analysis.missingFields }))
      .sort((left, right) => compareText(left.path, right.path)),
    missingRequiresByZone: [...missingRequiresCounts.entries()]
      .map(([zone, count]) => ({ zone, count }))
      .sort((left, right) => compareText(left.zone, right.zone)),
    idMismatches: analyses
      .filter(analysis => analysis.idMismatch !== null)
      .map(analysis => ({ path: analysis.path, id: analysis.idMismatch ?? '' }))
      .sort((left, right) => compareText(left.path, right.path)),
    rawAnchors: analyses
      .filter(analysis => analysis.rawAnchors > 0)
      .map(analysis => ({ path: analysis.path, count: analysis.rawAnchors }))
      .sort((left, right) => right.count - left.count || compareText(left.path, right.path)),
    proofStepsWithoutJustification: analyses
      .filter(analysis => analysis.proofStepsWithoutJustification > 0)
      .map(analysis => ({ path: analysis.path, count: analysis.proofStepsWithoutJustification }))
      .sort((left, right) => right.count - left.count || compareText(left.path, right.path)),
    noInteractiveCue: analyses
      .filter(analysis => analysis.lacksInteractiveCue)
      .map(analysis => analysis.path)
      .sort(compareText),
  };
}

function leanAnalysis(files: ScannedFile[]): {
  fileCount: number;
  declarations: number;
  incomplete: CountByFile[];
  mathlibImports: CountByFile[];
  todoFixme: CountByFile[];
  bridgeEntries: number | null;
} {
  const leanFiles = files.filter(file => file.path.startsWith('lean/') && file.extension === '.lean');
  const bridgeDebt = readJson<BridgeDebt>('docs/lean/bridge-debt.json');
  return {
    fileCount: leanFiles.length,
    declarations: leanFiles.reduce(
      (total, file) => total + countMatches(
        file.text,
        /^(?:axiom|class|def|inductive|lemma|structure|theorem)\b/gm,
      ),
      0,
    ),
    incomplete: countByFile(leanFiles, /\b(?:sorry|admit)\b/g),
    mathlibImports: leanFiles
      .map(file => ({
        path: file.path,
        count: file.text.split(/\r?\n/)
          .filter(line => line.trimStart().startsWith('import Mathlib'))
          .length,
      }))
      .filter(entry => entry.count > 0),
    todoFixme: countByFile(leanFiles, TODO_PATTERN),
    bridgeEntries: Array.isArray(bridgeDebt?.entries) ? bridgeDebt.entries.length : null,
  };
}

function repeatedBasenames(layerFiles: Record<string, ScannedFile[]>): Array<{
  name: string;
  paths: string[];
}> {
  const byName = new Map<string, string[]>();
  for (const files of Object.values(layerFiles)) {
    for (const file of files) {
      const name = path.basename(file.path);
      byName.set(name, [...(byName.get(name) ?? []), file.path]);
    }
  }
  return [...byName.entries()]
    .filter(([, paths]) => new Set(paths.map(filePath => AI_ROOTS.find(root => filePath.startsWith(`${root}/`)))).size > 1)
    .map(([name, paths]) => ({ name, paths: paths.sort(compareText) }))
    .sort((left, right) => compareText(left.name, right.name));
}

function exactDuplicates(layerFiles: Record<string, ScannedFile[]>): string[][] {
  const byDigest = new Map<string, string[]>();
  for (const files of Object.values(layerFiles)) {
    for (const file of files) {
      if (file.text.length === 0 || file.bytes > 1_000_000) continue;
      const digest = createHash('sha256').update(file.text).digest('hex');
      byDigest.set(digest, [...(byDigest.get(digest) ?? []), file.path]);
    }
  }
  return [...byDigest.values()]
    .filter(paths => new Set(paths.map(filePath => AI_ROOTS.find(root => filePath.startsWith(`${root}/`)))).size > 1)
    .map(paths => paths.sort(compareText))
    .sort((left, right) => compareText(left[0], right[0]));
}

function aiAnalysis(files: ScannedFile[], packageJson: PackageJson): {
  expected: Array<{ path: string; present: boolean }>;
  layerCounts: Array<{ root: string; count: number }>;
  repeated: Array<{ name: string; paths: string[] }>;
  duplicates: string[][];
  commands: Array<{ name: string; present: boolean }>;
} {
  const expectedPaths = [
    'AGENTS.md',
    'docs/ai/README.md',
    'docs/ai/protocol.md',
    'ai/README.md',
    'ai/current-state.md',
    'scripts/ai/generate-ai-indexes.ts',
    'scripts/ai/review-working-tree.ts',
  ];
  const layerFiles = Object.fromEntries(
    AI_ROOTS.map(root => [root, files.filter(file => file.path.startsWith(`${root}/`))]),
  );
  const scripts = packageJson.scripts ?? {};
  return {
    expected: expectedPaths.map(relativePath => ({
      path: relativePath,
      present: fs.existsSync(path.join(ROOT, relativePath)),
    })),
    layerCounts: AI_ROOTS.map(root => ({ root, count: layerFiles[root]?.length ?? 0 })),
    repeated: repeatedBasenames(layerFiles),
    duplicates: exactDuplicates(layerFiles),
    commands: ['ai:index', 'ai:review', 'ai:debt'].map(name => ({ name, present: scripts[name] !== undefined })),
  };
}

function contextArtefacts(): Array<{ path: string; reason: string; ignored: boolean }> {
  const candidates: Array<[string, string]> = [
    ['node_modules', 'dependencias instaladas'],
    ['.opencode/node_modules', 'dependencias locales del adaptador'],
    ['dist', 'salida de build'],
    ['coverage', 'cobertura generada'],
    ['.vite', 'caché de Vite'],
    ['lean/.lake', 'caché y build de Lean'],
    ['docs/api', 'documentación API generada'],
    ['scripts/plantuml.jar', 'binario de tooling'],
    ['package-lock.json', 'lockfile voluminoso'],
    ['src/entities/content/contentIndex.json', 'índice generado'],
    ['src/entities/content/contentCoverage.json', 'cobertura de contenido generada'],
    ['src/entities/graph/graph_structure.json', 'grafo generado'],
    ['src/entities/graph/lean_graph.json', 'grafo Lean generado'],
    ['src/entities/graph/proof_blocks.json', 'bloques de prueba generados'],
  ];
  const gitignore = fs.existsSync(path.join(ROOT, '.gitignore'))
    ? fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8')
    : '';
  return candidates
    .filter(([relativePath]) => fs.existsSync(path.join(ROOT, relativePath)))
    .map(([relativePath, reason]) => ({
      path: relativePath,
      reason,
      ignored: gitignore.split(/\r?\n/).some(line => {
        const normalized = line.trim().replace(/\/$/, '');
        return normalized.length > 0 && relativePath.startsWith(normalized);
      }),
    }));
}

function section(title: string, content: string[]): string {
  return [`## ${title}`, '', ...content, ''].join('\n');
}

function buildReport(files: ScannedFile[], packageJson: PackageJson): {
  markdown: string;
  summary: { any: number; hex: number; todos: number; large: number; fsd: number };
} {
  const tsFiles = files.filter(file => TS_EXTENSIONS.has(file.extension));
  const anyByFile = countByFile(tsFiles, ANY_PATTERN);
  const tsSuppressions = countByFile(tsFiles, /@ts-(?:ignore|expect-error|nocheck)\b/g);
  const hexByFile = countByFile(files, HEX_PATTERN);
  const todosByFile = countByFile(files, TODO_PATTERN);
  const largeTsFiles = tsFiles
    .filter(file => file.lines >= LARGE_FILE_LINES || file.bytes >= LARGE_FILE_BYTES)
    .sort((left, right) => right.lines - left.lines || right.bytes - left.bytes || compareText(left.path, right.path));
  const components = componentCandidates(files);
  const tests = testFiles(files);
  const testZones = testDebtByZone(files);
  const fsdRules = configuredFsdRules();
  const fsdFindings = possibleFsdViolations(tsFiles);
  const mdx = mdxAnalysis(files);
  const lean = leanAnalysis(files);
  const ai = aiAnalysis(files, packageJson);
  const artefacts = contextArtefacts();
  const coverage = readJson<ContentCoverage>('src/entities/content/contentCoverage.json');
  const missingAi = ai.expected.filter(entry => !entry.present).length;

  const summary = {
    any: sumCounts(anyByFile),
    hex: sumCounts(hexByFile),
    todos: sumCounts(todosByFile),
    large: largeTsFiles.length,
    fsd: fsdFindings.length,
  };

  const report = [
    '# Informe de deuda técnica de Matematika',
    '',
    '> Informe determinista generado por `npm run ai:debt`. No ejecuta validadores ni modifica código de producto.',
    '',
    '## Cómo leer este informe',
    '',
    '- **Hallazgo objetivo:** dato reproducible mediante lectura de archivos o configuración.',
    '- **Heurística aproximada:** señal léxica o estructural que necesita revisión humana; no equivale a un defecto confirmado.',
    '- **Recomendación:** acción propuesta; no se ejecuta automáticamente.',
    '',
    section('Resumen ejecutivo', [
      `**Hallazgos objetivos.** Se inspeccionaron ${files.length} archivos de texto, `
        + `${tsFiles.length} archivos TS/TSX, ${tests.length} archivos de test y `
        + `${mdx.byZone.reduce((total, zone) => total + zone.count, 0)} archivos MDX.`,
      '',
      `**Heurísticas aproximadas.** Se localizaron ${summary.any} apariciones léxicas de \`any\`, `
        + `${summary.hex} colores hex, ${summary.todos} marcas TODO/FIXME, `
        + `${summary.large} archivos TS/TSX grandes y ${summary.fsd} rutas de importación potencialmente incompatibles con FSD.`,
      '',
      `**Recomendación.** Empezar por las rutas FSD y supresiones TypeScript, continuar con hex fuera de tokens, `
        + 'descomponer puntos de alta responsabilidad y cerrar después cobertura, contenido, Lean y duplicación IA.',
    ]),
    section('Deuda TypeScript', [
      `**Hallazgo objetivo.** Hay ${tsFiles.length} archivos TS/TSX en el alcance; `
        + `${tsSuppressions.length} archivo(s) contienen ${sumCounts(tsSuppressions)} supresiones \`@ts-*\`.`,
      '',
      markdownTable(
        ['Archivo', 'Supresiones `@ts-*`'],
        tsSuppressions.map(entry => [`\`${entry.path}\``, entry.count]),
      ),
      '',
      '**Heurística aproximada.** `any` se cuenta léxicamente, también dentro de comentarios, cadenas, documentación y nombres de reglas.',
      '',
      '**Recomendación.** Revisar primero supresiones y usos reales de `any` en código ejecutable; no convertir automáticamente coincidencias textuales.',
    ]),
    section('Apariciones aproximadas de any por archivo', [
      '**Heurística aproximada.** Coincidencias de palabra completa `any` en TS/TSX.',
      '',
      metricTable(anyByFile),
      '',
      `**Recomendación.** Priorizar los archivos con más coincidencias y confirmar cada una con TypeScript/ESLint.`,
    ]),
    section('Colores hex hardcodeados por archivo', [
      '**Heurística aproximada.** Coincidencias `#RGB`, `#RRGGBB` o `#RRGGBBAA`; incluye definiciones legítimas de tokens, ejemplos y cadenas.',
      '',
      metricTable(hexByFile),
      '',
      '**Recomendación.** Conservar únicamente definiciones canónicas de la paleta Arts & Crafts y sustituir usos visuales arbitrarios por `--theme-*` o tokens del proyecto.',
    ]),
    section('TODO/FIXME por archivo', [
      '**Heurística aproximada.** Coincidencias de palabra completa y en mayúsculas; pueden aparecer en documentación o en el propio tooling.',
      '',
      metricTable(todosByFile),
      '',
      '**Recomendación.** Convertir deuda vigente en objetivos con responsable/criterio de cierre y retirar comentarios obsoletos.',
    ]),
    section('Archivos TS/TSX grandes', [
      `**Heurística aproximada.** Umbral: al menos ${LARGE_FILE_LINES} líneas o ${LARGE_FILE_BYTES.toLocaleString('es-ES')} bytes.`,
      '',
      markdownTable(
        ['Archivo', 'Líneas', 'Bytes'],
        largeTsFiles.map(file => [`\`${file.path}\``, file.lines, file.bytes]),
      ),
      '',
      '**Recomendación.** Revisar cohesión antes de dividir: tamaño alto es una señal, no una prueba de mal diseño.',
    ]),
    section('Posibles componentes con demasiadas responsabilidades', [
      `**Heurística aproximada.** TSX de al menos ${RESPONSIBILITY_LINES} líneas, o combinación alta de imports/hooks, o 12+ handlers.`,
      '',
      markdownTable(
        ['Componente', 'Líneas', 'Imports', 'Hooks', 'Handlers'],
        components.map(component => [
          `\`${component.path}\``,
          component.lines,
          component.imports,
          component.hooks,
          component.handlers,
        ]),
      ),
      '',
      '**Recomendación.** Separar coordinación, estado y presentación solo cuando la revisión confirme más de una razón de cambio.',
    ]),
    section('Deuda de tests por zona', [
      `**Hallazgo objetivo.** Se detectaron ${tests.length} archivos de test. La tabla cuenta archivos fuente y tests que importan directamente cada zona.`,
      '',
      markdownTable(
        ['Zona', 'TS/TSX fuente', 'Tests con import directo'],
        testZones.map(zone => [zone.zone, zone.sourceFiles, zone.directTestFiles]),
      ),
      '',
      '**Heurística aproximada.** Cero imports directos no significa cero cobertura: una prueba puede cubrir una zona de forma transitiva. La tabla no usa instrumentación.',
      '',
      '**Recomendación.** Ejecutar `npm run test:coverage` y usar cobertura por rama como evidencia antes de crear tests.',
    ]),
    section('Deuda de arquitectura/FSD', [
      `**Hallazgo objetivo.** \`.dependency-cruiser.js\` declara ${fsdRules.errors} reglas con severidad error y ${fsdRules.warnings} con severidad warning.`,
      '',
      '**Heurística aproximada.** Las rutas siguientes se deducen de imports estáticos y las invariantes globales; no aplican todas las excepciones de Dependency Cruiser.',
      '',
      markdownTable(
        ['Origen', 'Import', 'Señal'],
        fsdFindings.map(finding => [
          `\`${finding.source}\``,
          `\`${finding.target}\``,
          finding.rule,
        ]),
      ),
      '',
      '**Recomendación.** Confirmar cada ruta con `npm run depcruise`; la configuración ejecutable es la autoridad técnica.',
    ]),
    section('Deuda de contenido/MDX', [
      `**Hallazgo objetivo.** Inventario léxico por carpeta:`,
      '',
      markdownTable(
        ['Zona de contenido', 'Archivos MDX'],
        mdx.byZone.map(zone => [zone.zone, zone.count]),
      ),
      '',
      `El índice de cobertura existente declara ${coverage?.summary?.total ?? 'N/D'} entradas, `
        + `${coverage?.summary?.diagrams?.none ?? 'N/D'} sin diagrama y `
        + `${coverage?.summary?.lean?.none ?? 'N/D'} sin formalización Lean. Puede estar desactualizado hasta regenerarse.`,
      '',
      `**Heurísticas aproximadas.** ${mdx.missingMetadata.length} archivos carecen de una o más claves base; `
        + `${mdx.missingRequiresByZone.reduce((total, zone) => total + zone.count, 0)} no declaran \`requires\` (opcional en Zod, exigido por la política topológica); `
        + `${mdx.idMismatches.length} IDs no coinciden con el nombre de archivo; `
        + `${sumCounts(mdx.rawAnchors)} anchors HTML con \`href\`; `
        + `${sumCounts(mdx.proofStepsWithoutJustification)} \`ProofStep\` sin atributo \`justificacion\`; `
        + `${mdx.noInteractiveCue.length} axiomas/definiciones/teoremas sin señal léxica de interactividad.`,
      '',
      markdownTable(
        ['Archivo', 'Claves base ausentes'],
        mdx.missingMetadata.map(entry => [`\`${entry.path}\``, entry.fields.join(', ')]),
      ),
      '',
      markdownTable(
        ['Zona', 'Archivos sin `requires`'],
        mdx.missingRequiresByZone.map(entry => [entry.zone, entry.count]),
      ),
      '',
      markdownTable(
        ['Archivo', 'ID detectado distinto del basename'],
        mdx.idMismatches.map(entry => [`\`${entry.path}\``, entry.id]),
      ),
      '',
      markdownTable(
        ['Archivo', 'Anchors HTML con `href`'],
        mdx.rawAnchors.map(entry => [`\`${entry.path}\``, entry.count]),
      ),
      '',
      markdownTable(
        ['Archivo', '`ProofStep` sin `justificacion`'],
        mdx.proofStepsWithoutJustification.map(entry => [`\`${entry.path}\``, entry.count]),
      ),
      '',
      markdownTable(
        ['Archivo', 'Señal léxica'],
        mdx.noInteractiveCue.map(filePath => [`\`${filePath}\``, 'sin señal de interactividad']),
      ),
      '',
      '**Recomendación.** Verificar con los validadores de contenido y revisión editorial; no corregir en masa desde estas coincidencias.',
    ]),
    section('Deuda de Lean', [
      `**Hallazgo objetivo.** ${lean.fileCount} archivos Lean y ${lean.declarations} declaraciones aproximadas; `
        + `deuda bridge registrada: ${lean.bridgeEntries ?? 'N/D'} entradas.`,
      '',
      `**Heurísticas aproximadas.** ${sumCounts(lean.incomplete)} apariciones de \`sorry\`/\`admit\`, `
        + `${sumCounts(lean.mathlibImports)} imports de Mathlib y ${sumCounts(lean.todoFixme)} TODO/FIXME.`,
      '',
      markdownTable(
        ['Archivo', '`sorry`/`admit`'],
        lean.incomplete.map(entry => [`\`${entry.path}\``, entry.count]),
      ),
      '',
      markdownTable(
        ['Archivo', 'Imports de Mathlib'],
        lean.mathlibImports.map(entry => [`\`${entry.path}\``, entry.count]),
      ),
      '',
      markdownTable(
        ['Archivo', 'TODO/FIXME'],
        lean.todoFixme.map(entry => [`\`${entry.path}\``, entry.count]),
      ),
      '',
      '**Recomendación.** Confirmar con `npm run validate-no-mathlib`, `npm run validate-lean` y `npm run bridge:audit`; este informe no compila Lean.',
    ]),
    section('Deuda de infraestructura IA', [
      '**Hallazgo objetivo.** Presencia de piezas operativas esperadas:',
      '',
      markdownTable(
        ['Ruta', 'Estado'],
        ai.expected.map(entry => [`\`${entry.path}\``, entry.present ? 'presente' : 'ausente']),
      ),
      '',
      markdownTable(
        ['Comando', 'Estado'],
        ai.commands.map(command => [`npm run ${command.name}`, command.present ? 'presente' : 'ausente']),
      ),
      '',
      `**Heurística aproximada.** ${missingAi} piezas esperadas ausentes y ${warnings.length} warnings de lectura durante el análisis.`,
      '',
      '**Recomendación.** Mantener gobierno, operación, skills y adaptadores en sus capas de autoridad; regenerar índices al cambiar estructura o comandos.',
    ]),
    section('Artefactos generados o archivos que no deberían entrar en contexto', [
      '**Hallazgo objetivo.** Rutas presentes que conviene excluir del contexto habitual:',
      '',
      markdownTable(
        ['Ruta', 'Motivo', 'Ignorada por `.gitignore`'],
        artefacts.map(artefact => [
          `\`${artefact.path}\``,
          artefact.reason,
          artefact.ignored ? 'sí' : 'no/no inferido',
        ]),
      ),
      '',
      '**Recomendación.** Cargar estos artefactos solo cuando sean la fuente concreta de una comprobación; no usar generados como autoridad editable.',
    ]),
    section('Duplicación potencial entre capas IA', [
      '**Hallazgo objetivo.** Archivos de texto por capa:',
      '',
      markdownTable(
        ['Capa', 'Archivos'],
        ai.layerCounts.map(layer => [`\`${layer.root}/\``, layer.count]),
      ),
      '',
      `**Heurísticas aproximadas.** ${ai.repeated.length} basenames repetidos entre capas y `
        + `${ai.duplicates.length} grupos de contenido byte-a-byte idéntico. Un basename repetido no implica duplicación semántica.`,
      '',
      markdownTable(
        ['Nombre repetido', 'Rutas'],
        ai.repeated.map(entry => [entry.name, entry.paths.map(filePath => `\`${filePath}\``).join('<br>')]),
      ),
      '',
      markdownTable(
        ['Grupo idéntico', 'Rutas'],
        ai.duplicates.map((paths, index) => [
          index + 1,
          paths.map(filePath => `\`${filePath}\``).join('<br>'),
        ]),
      ),
      '',
      '**Recomendación.** Auditar primero `.auxiliary/`; conservar duplicaciones solo cuando sean adaptadores deliberados y documentados.',
    ]),
    section('Orden recomendado de refactor', [
      '1. **Restaurar señales de seguridad:** confirmar rutas FSD, supresiones TypeScript y usos ejecutables de `any`.',
      '2. **Limpiar deuda visual:** separar tokens canónicos de hex arbitrarios y migrar los usos confirmados a la paleta.',
      '3. **Reducir concentración estructural:** revisar archivos grandes y componentes candidatos por razones de cambio.',
      '4. **Cerrar huecos de tests:** obtener cobertura instrumentada y priorizar zonas críticas, no ratios léxicos.',
      '5. **Resolver deuda editorial y formal:** validar MDX, referencias, grafo, Lean y bridge con sus comandos propios.',
      '6. **Podar contexto IA:** retirar duplicación histórica confirmada y mantener índices/reportes regenerables.',
    ]),
    section('Limitaciones del análisis', [
      '- Los conteos son léxicos y aproximados; incluyen comentarios, cadenas y documentación cuando coincide el patrón.',
      '- No se ejecutan TypeScript, ESLint, Vitest, Dependency Cruiser, validadores MDX ni Lean.',
      '- La cobertura de tests se aproxima por imports directos, no por instrumentación ni comportamiento.',
      '- La cohesión de componentes y la interactividad MDX requieren revisión humana.',
      '- Los JSON generados existentes pueden estar desactualizados respecto a sus fuentes.',
      ...(warnings.length > 0
        ? [`- Warnings de lectura: ${warnings.join(' ')}`]
        : []),
    ]),
  ].join('\n');

  return { markdown: `${report.trimEnd()}\n`, summary };
}

function main(): void {
  const files = walkTextFiles(ROOT).map(scanFile);
  const packageJson = readJson<PackageJson>('package.json') ?? {};
  const { markdown, summary } = buildReport(files, packageJson);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8');

  console.log('[ai:debt] Informe generado: ai/reports/debt-report.md');
  console.log(`[ai:debt] Archivos de texto analizados: ${files.length}`);
  console.log(`[ai:debt] any (aprox.): ${summary.any}`);
  console.log(`[ai:debt] colores hex (aprox.): ${summary.hex}`);
  console.log(`[ai:debt] TODO/FIXME (aprox.): ${summary.todos}`);
  console.log(`[ai:debt] TS/TSX grandes: ${summary.large}`);
  console.log(`[ai:debt] rutas FSD potenciales: ${summary.fsd}`);
  console.log(`[ai:debt] Warnings de lectura: ${warnings.length}`);
}

try {
  main();
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[ai:debt] ERROR: ${detail}`);
  process.exitCode = 1;
}
