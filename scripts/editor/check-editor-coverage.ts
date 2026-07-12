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

const summaryPath = path.join(process.cwd(), 'coverage/coverage-summary.json');

const areas: Area[] = [
  {
    name: 'Motor MDX y compatibilidad',
    patterns: [/src\/features\/editor\/document\//],
    thresholds: { lines: 94, branches: 84, functions: 95 },
  },
  {
    name: 'Parches y diff',
    patterns: [/src\/features\/editor\/document\/applySourceEdits\.ts$/, /src\/features\/editor\/document\/editorTransitions\.ts$/],
    thresholds: { lines: 95, branches: 87, functions: 95 },
  },
  {
    name: 'Persistencia y coordinación',
    patterns: [/src\/features\/editor\/persistence\//],
    thresholds: { lines: 85, branches: 72, functions: 83 },
  },
  {
    name: 'Reducers y máquinas de estado',
    patterns: [/src\/features\/editor\/state\//, /src\/features\/editor\/diagrams\/state\//],
    thresholds: { lines: 53, branches: 43, functions: 65 },
  },
  {
    name: 'Validación',
    patterns: [/src\/features\/editor\/core\/validation\.ts$/, /src\/features\/editor\/document\/parseEditorDocument\.ts$/],
    thresholds: { lines: 84, branches: 64, functions: 90 },
  },
  {
    name: 'Transformaciones de diagramas e índice inverso',
    patterns: [/src\/features\/editor\/diagrams\/model\//, /src\/features\/editor\/diagrams\/source\//, /src\/features\/editor\/diagrams\/references\//],
    thresholds: { lines: 47, branches: 33, functions: 43 },
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

if (failures > 0) {
  console.error(`[coverage] ${failures} risk-based coverage threshold(s) failed.`);
  process.exit(1);
}

console.log('[coverage] Risk-based editor coverage thresholds passed.');
