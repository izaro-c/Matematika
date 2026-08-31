import fs from 'node:fs';
import path from 'node:path';

type MetricName = 'lines' | 'branches' | 'functions';

interface CoverageMetric {
  total: number;
  covered: number;
  pct: number;
}

interface FileCoverage {
  lines: CoverageMetric;
  branches: CoverageMetric;
  functions: CoverageMetric;
}

interface Area {
  name: string;
  patterns: RegExp[];
  thresholds: Record<MetricName, number>;
}

interface FileTarget {
  name: string;
  pathSuffix: string;
  thresholds: Partial<Record<MetricName, number>>;
}

const summaryPath = path.join(process.cwd(), 'coverage/coverage-summary.json');

const areas: Area[] = [
  {
    name: 'Motor MDX y compatibilidad',
    patterns: [/src\/fixed-pages\/editor\/document\//],
    thresholds: { lines: 85, branches: 63, functions: 85 },
  },
  {
    name: 'Parches y diff',
    patterns: [/src\/fixed-pages\/editor\/document\/applySourceEdits\.ts$/, /src\/fixed-pages\/editor\/document\/editorTransitions\.ts$/],
    thresholds: { lines: 95, branches: 87, functions: 95 },
  },
  {
    name: 'Persistencia y coordinación',
    patterns: [/src\/fixed-pages\/editor\/save\//],
    thresholds: { lines: 70, branches: 55, functions: 80 },
  },
  {
    name: 'Reducers y máquinas de estado',
    patterns: [/src\/fixed-pages\/editor\/save\/editorPersistenceState\.ts$/, /src\/fixed-pages\/editor\/diagrams\/history\/reducer\.ts$/],
    thresholds: { lines: 85, branches: 75, functions: 90 },
  },
  {
    name: 'Validación',
    patterns: [/src\/fixed-pages\/editor\/session\/validation\.ts$/, /src\/fixed-pages\/editor\/document\/parseEditorDocument\.ts$/],
    thresholds: { lines: 84, branches: 60, functions: 90 },
  },
  {
    name: 'Transformaciones de diagramas e índice inverso',
    patterns: [/src\/fixed-pages\/editor\/diagrams\/model\//, /src\/fixed-pages\/editor\/diagrams\/source\//, /src\/fixed-pages\/editor\/diagrams\/references\//],
    thresholds: { lines: 70, branches: 55, functions: 70 },
  },
];

const criticalFiles: FileTarget[] = [
  {
    name: 'Registro estructural de bloques',
    pathSuffix: 'src/fixed-pages/editor/document/blockRegistry.ts',
    thresholds: { lines: 88, branches: 61, functions: 90 },
  },
  {
    name: 'Proyección lossless de metadatos',
    pathSuffix: 'src/fixed-pages/editor/document/metadataProjection.ts',
    thresholds: { lines: 87, branches: 66, functions: 100 },
  },
  {
    name: 'Operaciones estructurales lossless',
    pathSuffix: 'src/fixed-pages/editor/document/structuralOperations.ts',
    thresholds: { lines: 75, branches: 50, functions: 78 },
  },
  {
    name: 'Reducer de diagramas',
    pathSuffix: 'src/fixed-pages/editor/diagrams/history/reducer.ts',
    thresholds: { lines: 95, branches: 89, functions: 90 },
  },
  {
    name: 'Hook/coordinador de diagramas',
    pathSuffix: 'src/fixed-pages/editor/diagrams/history/useDiagramState.ts',
    thresholds: { lines: 80, branches: 50, functions: 75 },
  },
  {
    name: 'Repositorio de diagramas',
    pathSuffix: 'src/fixed-pages/editor/diagrams/save/repository.ts',
    thresholds: { lines: 90, branches: 87, functions: 90 },
  },
  {
    name: 'Parser de diagramas',
    pathSuffix: 'src/fixed-pages/editor/diagrams/source/parser.ts',
    thresholds: { lines: 90, branches: 77, functions: 88 },
  },
  {
    name: 'Generador de diagramas',
    pathSuffix: 'src/fixed-pages/editor/diagrams/source/generator.ts',
    thresholds: { lines: 90, branches: 80, functions: 90 },
  },
  {
    name: 'Guardas de guardado del editor',
    pathSuffix: 'src/fixed-pages/editor/session/useEditorCore.ts',
    thresholds: { lines: 60, branches: 50, functions: 70 },
  },
  {
    name: 'Coordinación de guardado',
    pathSuffix: 'src/fixed-pages/editor/save/saveCoordinator.ts',
    thresholds: { lines: 95, branches: 80, functions: 90 },
  },
];

function readSummary(): Record<string, FileCoverage> {
  if (!fs.existsSync(summaryPath)) {
    throw new Error(`Coverage summary not found: ${summaryPath}`);
  }
  return JSON.parse(fs.readFileSync(summaryPath, 'utf8')) as Record<string, FileCoverage>;
}

function normalize(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function percent(covered: number, total: number): number {
  return total === 0 ? 100 : Number(((covered / total) * 100).toFixed(2));
}

function areaCoverage(files: FileCoverage[]): Record<MetricName, CoverageMetric> {
  const result = {} as Record<MetricName, CoverageMetric>;
  for (const metric of ['lines', 'branches', 'functions'] as const) {
    const total = files.reduce((sum, file) => sum + file[metric].total, 0);
    const covered = files.reduce((sum, file) => sum + file[metric].covered, 0);
    result[metric] = { total, covered, pct: percent(covered, total) };
  }
  return result;
}

const summary = readSummary();
const entries = Object.entries(summary)
  .filter(([filePath]) => filePath !== 'total')
  .map(([filePath, coverage]) => [normalize(filePath), coverage] as const);

let failures = 0;

for (const area of areas) {
  const files = entries
    .filter(([filePath]) => area.patterns.some(pattern => pattern.test(filePath)))
    .map(([, coverage]) => coverage);

  if (files.length === 0) {
    console.error(`[coverage] ${area.name}: no covered files matched the configured area.`);
    failures += 1;
    continue;
  }

  const coverage = areaCoverage(files);
  for (const metric of ['lines', 'branches', 'functions'] as const) {
    const actual = coverage[metric].pct;
    const expected = area.thresholds[metric];
    const status = actual >= expected ? 'PASS' : 'FAIL';
    console.log(`[coverage] ${status} ${area.name} ${metric}: ${actual}% >= ${expected}%`);
    if (actual < expected) failures += 1;
  }
}

for (const target of criticalFiles) {
  const entry = entries.find(([filePath]) => filePath.endsWith(target.pathSuffix));
  if (!entry) {
    console.error(`[coverage] ${target.name}: missing covered file ${target.pathSuffix}.`);
    failures += 1;
    continue;
  }

  const [, coverage] = entry;
  for (const metric of ['lines', 'branches', 'functions'] as const) {
    const expected = target.thresholds[metric];
    if (expected === undefined) continue;
    const actual = coverage[metric].pct;
    const status = actual >= expected ? 'PASS' : 'FAIL';
    console.log(`[coverage] ${status} ${target.name} ${metric}: ${actual}% >= ${expected}%`);
    if (actual < expected) failures += 1;
  }
}

if (failures > 0) {
  console.error(`[coverage] ${failures} risk-based coverage threshold(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('[coverage] Risk-based editor coverage thresholds passed.');
}
