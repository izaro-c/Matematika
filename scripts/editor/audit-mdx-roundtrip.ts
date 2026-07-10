import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parseMDX, stringifyMDX } from '../../src/shared/lib/mdxParser';
import { parseBodyToBlocks, stringifyBlocksToBody } from '../../src/features/editor/core/parser';

// --- Types ---
type RoundTripClassification =
  | 'exact'
  | 'format-only'
  | 'semantic-risk'
  | 'non-idempotent'
  | 'parse-error'
  | 'unknown';

type ChangedRegion = 'metadata' | 'imports' | 'body' | 'exports' | 'unknown';

interface RoundTripFileResult {
  path: string;
  classification: RoundTripClassification;
  originalHash: string;
  cycle1Hash?: string;
  cycle2Hash?: string;
  cycle3Hash?: string;
  changedOnFirstCycle: boolean;
  idempotentAfterFirstCycle: boolean;
  changedRegions?: ChangedRegion[];
  signals: string[];
  error?: {
    stage: string;
    name: string;
    message: string;
  };
}

interface RoundTripReport {
  schemaVersion: number;
  toolVersion: number;
  corpusRoot: string;
  totalFiles: number;
  counts: Record<RoundTripClassification, number>;
  files: RoundTripFileResult[];
}

const SCHEMA_VERSION = 1;
const TOOL_VERSION = 1;

// --- Helper Functions ---
function getRepositoryRoot(): string {
  return process.cwd();
}

function computeHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function isFormatOnlyDiff(a: string, b: string): boolean {
  const cleanA = a.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
  const cleanB = b.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
  return cleanA === cleanB;
}

function discoverMdxFiles(dir: string, baseDir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      // Exclude build, dependency, coverage, fixtures or git folders
      if (
        file === 'node_modules' ||
        file === '.git' ||
        file === 'dist' ||
        file === 'coverage' ||
        file === 'fixtures'
      ) {
        continue;
      }
      results = results.concat(discoverMdxFiles(filePath, baseDir));
    } else if (file.endsWith('.mdx')) {
      // Make path relative to baseDir (repository root)
      const relativePath = path.relative(baseDir, filePath);
      results.push(relativePath);
    }
  }
  return results;
}

function classifyResult(
  original: string,
  cycle1: string,
  cycle2: string,
  cycle3: string,
  originalParsed: any,
  cycle1Parsed: any
): { classification: RoundTripClassification; changedRegions: ChangedRegion[]; signals: string[] } {
  const signals: string[] = [];
  const changedRegions: ChangedRegion[] = [];

  if (cycle1 !== cycle2 || cycle2 !== cycle3) {
    signals.push('non-idempotent-derivation');
    return { classification: 'non-idempotent', changedRegions: ['unknown'], signals };
  }

  if (original === cycle1) {
    return { classification: 'exact', changedRegions: [], signals };
  }

  if (isFormatOnlyDiff(original, cycle1)) {
    return { classification: 'format-only', changedRegions: [], signals };
  }

  // Real changes detected
  const metaChanged = JSON.stringify(originalParsed.metadata) !== JSON.stringify(cycle1Parsed.metadata);
  const importsChanged = originalParsed.imports.trim() !== cycle1Parsed.imports.trim();
  const exportsChanged = originalParsed.exports.trim() !== cycle1Parsed.exports.trim();
  const bodyChanged = originalParsed.body.trim() !== cycle1Parsed.body.trim();

  if (metaChanged) {
    changedRegions.push('metadata');
    signals.push('metadata-changed');
  }
  if (importsChanged) {
    changedRegions.push('imports');
    signals.push('imports-changed');
  }
  if (exportsChanged) {
    changedRegions.push('exports');
    signals.push('exports-changed');
  }
  if (bodyChanged) {
    changedRegions.push('body');
    signals.push('body-changed');

    try {
      const origBlocks = parseBodyToBlocks(originalParsed.body);
      const c1Blocks = parseBodyToBlocks(cycle1Parsed.body);

      if (origBlocks.length !== c1Blocks.length) {
        signals.push('block-count-mismatch');
      } else {
        let typeMismatch = false;
        let contentMismatch = false;
        for (let i = 0; i < origBlocks.length; i++) {
          if (origBlocks[i].type !== c1Blocks[i].type) {
            typeMismatch = true;
          }
          if (origBlocks[i].content !== c1Blocks[i].content) {
            contentMismatch = true;
          }
        }
        if (typeMismatch) signals.push('block-type-mismatch');
        if (contentMismatch) signals.push('jsx-content-changed');
      }
    } catch {
      signals.push('block-parse-failed');
    }
  }

  if (changedRegions.length === 0) {
    changedRegions.push('unknown');
  }

  // If we have explicit signals of semantic changes, classify as semantic-risk
  const hasSemanticSignal =
    metaChanged ||
    importsChanged ||
    exportsChanged ||
    signals.includes('block-count-mismatch') ||
    signals.includes('block-type-mismatch') ||
    signals.includes('jsx-content-changed');

  const classification: RoundTripClassification = hasSemanticSignal ? 'semantic-risk' : 'unknown';

  return { classification, changedRegions, signals };
}

// --- Main Runner ---
export function runAudit(): RoundTripReport {
  const repoRoot = getRepositoryRoot();
  const corpusDir = path.join(repoRoot, 'src/database/content');
  
  // Discover corpus files (excluding tests/fixtures/etc. because they are outside src/database/content)
  const files = discoverMdxFiles(corpusDir, repoRoot).sort();

  const fileResults: RoundTripFileResult[] = [];
  const counts: Record<RoundTripClassification, number> = {
    exact: 0,
    'format-only': 0,
    'semantic-risk': 0,
    'non-idempotent': 0,
    'parse-error': 0,
    unknown: 0,
  };

  for (const relativePath of files) {
    const absolutePath = path.join(repoRoot, relativePath);
    const originalContent = fs.readFileSync(absolutePath, 'utf8');
    const originalHash = computeHash(originalContent);

    try {
      // Cycle 1
      const parsed1 = parseMDX(originalContent);
      const blocks1 = parseBodyToBlocks(parsed1.body);
      const body1 = stringifyBlocksToBody(blocks1);
      const cycle1 = stringifyMDX(parsed1.metadata, parsed1.imports, body1, parsed1.exports);
      const cycle1Hash = computeHash(cycle1);

      // Cycle 2
      const parsed2 = parseMDX(cycle1);
      const blocks2 = parseBodyToBlocks(parsed2.body);
      const body2 = stringifyBlocksToBody(blocks2);
      const cycle2 = stringifyMDX(parsed2.metadata, parsed2.imports, body2, parsed2.exports);
      const cycle2Hash = computeHash(cycle2);

      // Cycle 3
      const parsed3 = parseMDX(cycle2);
      const blocks3 = parseBodyToBlocks(parsed3.body);
      const body3 = stringifyBlocksToBody(blocks3);
      const cycle3 = stringifyMDX(parsed3.metadata, parsed3.imports, body3, parsed3.exports);
      const cycle3Hash = computeHash(cycle3);

      const parsedCycle1 = parseMDX(cycle1);
      const { classification, changedRegions, signals } = classifyResult(
        originalContent,
        cycle1,
        cycle2,
        cycle3,
        parsed1,
        parsedCycle1
      );

      counts[classification] += 1;

      fileResults.push({
        path: relativePath,
        classification,
        originalHash,
        cycle1Hash,
        cycle2Hash,
        cycle3Hash,
        changedOnFirstCycle: originalContent !== cycle1,
        idempotentAfterFirstCycle: cycle1 === cycle2 && cycle2 === cycle3,
        changedRegions,
        signals,
      });
    } catch (e: any) {
      counts['parse-error'] += 1;
      fileResults.push({
        path: relativePath,
        classification: 'parse-error',
        originalHash,
        changedOnFirstCycle: true,
        idempotentAfterFirstCycle: false,
        signals: ['parse-exception'],
        error: {
          stage: 'analysis',
          name: e.name || 'Error',
          message: e.message || String(e),
        },
      });
    }
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    toolVersion: TOOL_VERSION,
    corpusRoot: 'src/database/content',
    totalFiles: files.length,
    counts,
    files: fileResults,
  };
}

function generateMarkdownReport(report: RoundTripReport): string {
  const exactPercentage = ((report.counts.exact / report.totalFiles) * 100).toFixed(2);
  const modifiedInFirstCycle = report.files.filter(f => f.changedOnFirstCycle).length;

  let md = `# Reporte de Oráculo de Round-Trip del Editor\n\n`;
  md += `## Resumen del Corpus\n\n`;
  md += `* **Total de archivos descubiertos:** ${report.totalFiles}\n`;
  md += `* **Porcentaje de documentos exactos (sin cambios):** ${exactPercentage}%\n`;
  md += `* **Documentos modificados en el primer ciclo:** ${modifiedInFirstCycle}\n`;
  md += `* **Documentos no idempotentes:** ${report.counts['non-idempotent']}\n`;
  md += `* **Documentos con errores de parseo:** ${report.counts['parse-error']}\n\n`;

  md += `## Resumen por Clasificación\n\n`;
  md += `| Clasificación | Cantidad | Descripción |\n`;
  md += `| :--- | :---: | :--- |\n`;
  md += `| **exact** | ${report.counts.exact} | Identidad textual exacta entre todos los ciclos. |\n`;
  md += `| **format-only** | ${report.counts['format-only']} | Cambios limitados a BOM, saltos de línea LF/CRLF o espacios finales. |\n`;
  md += `| **semantic-risk** | ${report.counts['semantic-risk']} | Cambios estructurales relevantes en bloques, metadatos, JSX o fórmulas. |\n`;
  md += `| **non-idempotent** | ${report.counts['non-idempotent']} | Deriva acumulativa (el archivo sigue cambiando tras el ciclo 1). |\n`;
  md += `| **parse-error** | ${report.counts['parse-error']} | Excepción crítica durante el parseo/serialización. |\n`;
  md += `| **unknown** | ${report.counts.unknown} | Cambios en el cuerpo que el auditor no puede asegurar como inocuos. |\n\n`;

  md += `## Detalle de Archivos por Clasificación\n\n`;

  const groups: Record<RoundTripClassification, RoundTripFileResult[]> = {
    exact: [],
    'format-only': [],
    'semantic-risk': [],
    'non-idempotent': [],
    'parse-error': [],
    unknown: [],
  };

  for (const file of report.files) {
    groups[file.classification].push(file);
  }

  for (const classification of [
    'parse-error',
    'non-idempotent',
    'semantic-risk',
    'unknown',
    'format-only',
    'exact',
  ] as RoundTripClassification[]) {
    const list = groups[classification];
    if (list.length === 0) continue;

    md += `### Clasificación: \`${classification}\` (${list.length} archivos)\n\n`;
    md += `| Archivo | Regiones Afectadas | Señales | Info Adicional |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    for (const item of list) {
      const regions = item.changedRegions ? item.changedRegions.join(', ') : '-';
      const signals = item.signals.length > 0 ? item.signals.join(', ') : '-';
      const extra = item.error
        ? `Error: [${item.error.stage}] ${item.error.message}`
        : `Idempotente: ${item.idempotentAfterFirstCycle ? 'Sí' : 'No'}`;
      md += `| \`${item.path}\` | ${regions} | ${signals} | ${extra} |\n`;
    }
    md += `\n`;
  }

  md += `## Limitaciones del Análisis\n\n`;
  md += `* Este auditor evalúa el comportamiento del parser regex actual. El parser carece de un modelo AST completo, por lo que ciertos anidamientos complejos de JSX (ej. componentes dentro de propiedades o bloques indentados dentro de etiquetas) pueden perderse o corromperse.\n`;
  md += `* La clasificación \`format-only\` se aplica con extrema precaución, requiriendo correspondencia exacta después de normalizar el BOM y los saltos de línea extremos.\n\n`;

  md += `## Puerta de Calidad Estricta (Fase 3)\n\n`;
  md += `* En la Fase 3 se exigirá que no exista ningún archivo catalogado como \`semantic-risk\`, \`non-idempotent\`, \`parse-error\` o \`unknown\`. Actualmente, esta puerta fallará debido a las deficiencias conocidas del parser de producción.\n`;

  return md;
}

function severityScore(c: RoundTripClassification): number {
  switch (c) {
    case 'exact':
      return 1;
    case 'format-only':
      return 2;
    case 'unknown':
      return 3;
    case 'semantic-risk':
      return 4;
    case 'non-idempotent':
      return 5;
    case 'parse-error':
      return 6;
  }
}

function runCheck(): void {
  const repoRoot = getRepositoryRoot();
  const baselinePath = path.join(repoRoot, 'ai/reports/editor-roundtrip-baseline.json');

  if (!fs.existsSync(baselinePath)) {
    console.error(`[ERROR] No se encuentra el archivo de baseline: ${baselinePath}`);
    console.error(`Por favor, ejecute la auditoría primero para generar el baseline.`);
    process.exit(1);
  }

  let baseline: RoundTripReport;
  try {
    baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  } catch (e) {
    console.error(`[ERROR] No se pudo parsear el archivo de baseline JSON:`, e);
    process.exit(1);
  }

  if (baseline.schemaVersion !== SCHEMA_VERSION) {
    console.error(`[ERROR] Versión de esquema incompatible. Esperada: ${SCHEMA_VERSION}, Encontrada: ${baseline.schemaVersion}`);
    process.exit(1);
  }

  console.log(`[INFO] Cargado baseline con ${baseline.totalFiles} archivos.`);
  
  const current = runAudit();
  
  const baselineMap = new Map<string, RoundTripFileResult>();
  for (const file of baseline.files) {
    baselineMap.set(file.path, file);
  }

  let regressions = 0;
  let improvements = 0;

  for (const currentFile of current.files) {
    const baselineFile = baselineMap.get(currentFile.path);

    if (!baselineFile) {
      console.error(`[REGRESION] Archivo nuevo sin clasificar en el baseline: \`${currentFile.path}\``);
      regressions += 1;
      continue;
    }

    const baselineScore = severityScore(baselineFile.classification);
    const currentScore = severityScore(currentFile.classification);

    if (currentScore > baselineScore) {
      console.error(
        `[REGRESION] Clasificación empeoró para \`${currentFile.path}\`: ${baselineFile.classification} -> ${currentFile.classification}`
      );
      regressions += 1;
    } else if (currentScore < baselineScore) {
      console.log(
        `[MEJORA] Clasificación mejoró para \`${currentFile.path}\`: ${baselineFile.classification} -> ${currentFile.classification}`
      );
      improvements += 1;
    }

    // Check if the result of an insecure file changed within the same classification
    if (
      currentFile.classification === baselineFile.classification &&
      currentFile.classification !== 'exact' &&
      currentFile.classification !== 'format-only'
    ) {
      if (
        currentFile.originalHash !== baselineFile.originalHash ||
        currentFile.cycle1Hash !== baselineFile.cycle1Hash
      ) {
        console.error(
          `[REGRESION] Cambió el contenido o la salida del ciclo para el archivo inseguro \`${currentFile.path}\` bajo la misma clasificación \`${currentFile.classification}\``
        );
        regressions += 1;
      }
    }
  }

  // Check for deleted files
  const currentPaths = new Set(current.files.map(f => f.path));
  for (const file of baseline.files) {
    if (!currentPaths.has(file.path)) {
      console.error(`[REGRESION] Archivo desaparecido del corpus: \`${file.path}\``);
      regressions += 1;
    }
  }

  if (regressions > 0) {
    console.error(`[FAIL] Puerta de no-regresión fallida con ${regressions} regresiones encontradas.`);
    process.exit(1);
  }

  console.log(`[SUCCESS] Puerta de no-regresión superada.` + (improvements > 0 ? ` Se registraron ${improvements} mejoras.` : ''));
  process.exit(0);
}

function runStrict(): void {
  const current = runAudit();
  let failed = 0;

  for (const file of current.files) {
    if (file.classification !== 'exact' && file.classification !== 'format-only') {
      console.error(
        `[STRICT] Archivo no seguro: \`${file.path}\` (${file.classification})`
      );
      failed += 1;
    }
  }

  if (failed > 0) {
    console.error(`[FAIL] Puerta estricta fallida: hay ${failed} archivos con riesgo de round-trip.`);
    process.exit(1);
  }

  console.log(`[SUCCESS] Puerta estricta superada. Todo el corpus es seguro.`);
  process.exit(0);
}

// --- CLI Runner Argument Handling ---
if (!process.env.VITEST) {
  const args = process.argv.slice(2);
  const mode = args[0] || '--audit';

  if (mode === '--audit' || mode === '--write') {
    console.log('[INFO] Ejecutando auditoría de round-trip en el corpus...');
    const report = runAudit();

    const repoRoot = getRepositoryRoot();
    const jsonPath = path.join(repoRoot, 'ai/reports/editor-roundtrip-baseline.json');
    const mdPath = path.join(repoRoot, 'ai/reports/editor-roundtrip-baseline.md');

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });

    // Stable JSON output:
    const jsonContent = JSON.stringify(report, null, 2) + '\n';
    fs.writeFileSync(jsonPath, jsonContent, 'utf8');
    console.log(`[SUCCESS] Escrito informe JSON en: ${jsonPath}`);

    // Markdown output:
    const mdContent = generateMarkdownReport(report);
    fs.writeFileSync(mdPath, mdContent, 'utf8');
    console.log(`[SUCCESS] Escrito informe Markdown en: ${mdPath}`);

    process.exit(0);
  } else if (mode === '--check') {
    runCheck();
  } else if (mode === '--strict') {
    runStrict();
  } else {
    console.error(`[ERROR] Modo no reconocido: ${mode}`);
    console.error(`Modos soportados: --audit, --check, --strict`);
    process.exit(1);
  }
}
