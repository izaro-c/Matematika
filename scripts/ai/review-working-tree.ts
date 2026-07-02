import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

type ChangeSource = 'staged' | 'unstaged' | 'untracked';

type Category =
  | 'docs only'
  | 'multi-ai governance'
  | 'ai indexes/reports/tooling'
  | 'package/config'
  | 'src app code'
  | 'shared/ui/design/theme'
  | 'content schemas/types'
  | 'MDX content'
  | 'graph data'
  | 'Lean'
  | 'tests'
  | 'core scripts'
  | 'generated artifacts';

interface PackageJson {
  scripts?: Record<string, string>;
}

const ROOT = process.cwd();
const CATEGORY_ORDER: Category[] = [
  'docs only',
  'multi-ai governance',
  'ai indexes/reports/tooling',
  'package/config',
  'src app code',
  'shared/ui/design/theme',
  'content schemas/types',
  'MDX content',
  'graph data',
  'Lean',
  'tests',
  'core scripts',
  'generated artifacts',
];
const COMMAND_ORDER = [
  'typecheck',
  'lint',
  'test',
  'depcruise',
  'generate-index',
  'validate-references',
  'validate-graph',
  'validate-lean',
  'content:coverage',
  'ai:index',
] as const;
type RecommendedCommand = (typeof COMMAND_ORDER)[number];

const SOURCE_ORDER: ChangeSource[] = ['unstaged', 'staged', 'untracked'];
const GENERATED_FILES = new Set([
  'src/entities/content/contentCoverage.json',
  'src/entities/content/contentIndex.json',
  'src/entities/graph/graph_structure.json',
  'src/entities/graph/lean_graph.json',
  'src/entities/graph/proof_blocks.json',
  'docs/uml/dependency_graph.svg',
]);

function compareText(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function readGitPaths(args: string[]): string[] {
  // eslint-disable-next-line sonarjs/no-os-command-from-path -- git is a repository prerequisite and its installation path is platform-specific.
  const output = execFileSync('git', [...args, '-z'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output.split('\0').filter(Boolean);
}

function collectChanges(): Map<string, Set<ChangeSource>> {
  const changes = new Map<string, Set<ChangeSource>>();
  const inputs: Array<[ChangeSource, string[]]> = [
    ['unstaged', readGitPaths(['diff', '--name-only'])],
    ['staged', readGitPaths(['diff', '--cached', '--name-only'])],
    ['untracked', readGitPaths(['ls-files', '--others', '--exclude-standard'])],
  ];

  for (const [source, files] of inputs) {
    for (const file of files) {
      const sources = changes.get(file) ?? new Set<ChangeSource>();
      sources.add(source);
      changes.set(file, sources);
    }
  }
  return changes;
}

function readPackageScripts(): Set<string> {
  const packagePath = path.join(ROOT, 'package.json');
  if (!fs.existsSync(packagePath)) return new Set();
  const parsed = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as PackageJson;
  return new Set(Object.keys(parsed.scripts ?? {}));
}

function isDocumentation(file: string): boolean {
  return file === 'AGENTS.md'
    || file === 'README.md'
    || file.endsWith('.md')
    || file.startsWith('docs/');
}

function isMultiAiGovernance(file: string): boolean {
  return file === 'AGENTS.md'
    || file.startsWith('docs/ai/')
    || file.startsWith('.agents/')
    || file.startsWith('.opencode/');
}

function isAiTooling(file: string): boolean {
  return file.startsWith('ai/') || file.startsWith('scripts/ai/');
}

function isPackageOrConfig(file: string): boolean {
  const base = path.posix.basename(file);
  return /^package(?:-lock)?\.json$/.test(base)
    || /^(?:bun\.lockb?|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(base)
    || /^tsconfig(?:\.[^.]+)?\.json$/.test(base)
    || /(?:^|\.)(?:config)\.(?:cjs|js|mjs|ts)$/.test(base)
    || file === '.dependency-cruiser.js'
    || file === '.gitignore'
    || file === '.npmrc'
    || file.startsWith('.github/');
}

function isSrcAppCode(file: string): boolean {
  return file.startsWith('src/')
    && !file.endsWith('.mdx')
    && !file.endsWith('.json');
}

function isSharedUiDesign(file: string): boolean {
  return file.startsWith('src/shared/')
    || file.startsWith('src/widgets/')
    || file === 'src/app/index.css'
    || /(?:theme|tailwind|postcss)/i.test(file);
}

function isContentSchemaOrType(file: string): boolean {
  return file === 'src/entities/content/schemas.ts'
    || file === 'src/entities/content/types.ts'
    || file === 'src/entities/content/msc2020.ts';
}

function isGraphData(file: string): boolean {
  return /^src\/entities\/graph\/[^/]+\.json$/.test(file);
}

function isLean(file: string): boolean {
  return file.startsWith('lean/')
    || file.startsWith('scripts/lean/')
    || file.endsWith('.lean');
}

function isTest(file: string): boolean {
  return file.startsWith('tests/')
    || /(?:^|\/)[^/]+\.(?:spec|test)\.[cm]?[jt]sx?$/.test(file);
}

function isCoreScript(file: string): boolean {
  return file.startsWith('scripts/core/') || file.startsWith('scripts/utils/');
}

function isGenerated(file: string): boolean {
  return GENERATED_FILES.has(file)
    || file.startsWith('ai/indexes/')
    || file.startsWith('docs/api/')
    || file.startsWith('coverage/')
    || file.startsWith('dist/')
    || file.endsWith('.tsbuildinfo');
}

const FILE_CATEGORY_RULES: Array<[Category, (file: string) => boolean]> = [
  ['multi-ai governance', isMultiAiGovernance],
  ['ai indexes/reports/tooling', isAiTooling],
  ['package/config', isPackageOrConfig],
  ['src app code', isSrcAppCode],
  ['shared/ui/design/theme', isSharedUiDesign],
  ['content schemas/types', isContentSchemaOrType],
  ['MDX content', file => file.endsWith('.mdx')],
  ['graph data', isGraphData],
  ['Lean', isLean],
  ['tests', isTest],
  ['core scripts', isCoreScript],
  ['generated artifacts', isGenerated],
];

function classify(files: string[]): Category[] {
  const detected = new Set<Category>();
  if (files.length > 0 && files.every(isDocumentation)) detected.add('docs only');

  for (const file of files) {
    for (const [category, matches] of FILE_CATEGORY_RULES) {
      if (matches(file)) detected.add(category);
    }
  }

  return CATEGORY_ORDER.filter(category => detected.has(category));
}

const CATEGORY_COMMANDS: Partial<Record<Category, RecommendedCommand[]>> = {
  'multi-ai governance': ['ai:index'],
  'ai indexes/reports/tooling': ['ai:index'],
  'package/config': ['typecheck', 'lint'],
  'src app code': ['typecheck', 'lint', 'test', 'depcruise'],
  'shared/ui/design/theme': ['typecheck', 'lint', 'test', 'depcruise'],
  'content schemas/types': [
    'typecheck',
    'lint',
    'test',
    'generate-index',
    'validate-references',
    'validate-graph',
    'validate-lean',
    'content:coverage',
  ],
  'MDX content': [
    'generate-index',
    'validate-references',
    'validate-graph',
    'validate-lean',
    'content:coverage',
  ],
  'graph data': ['validate-graph'],
  Lean: ['validate-lean'],
  tests: ['typecheck', 'lint', 'test'],
  'core scripts': ['typecheck', 'lint', 'test'],
};

const FILE_COMMAND_RULES: Array<[(file: string) => boolean, RecommendedCommand[]]> = [
  [file => file.startsWith('scripts/ai/'), ['typecheck', 'lint']],
  [file => file.startsWith('.opencode/') && /\.[cm]?[jt]sx?$/.test(file), ['typecheck', 'lint']],
  [file => file === '.dependency-cruiser.js', ['depcruise']],
  [file => /vitest/i.test(file), ['test']],
  [file => /eslint/i.test(file), ['lint']],
  [file => /tsconfig/i.test(file), ['typecheck']],
  [file => file === 'src/entities/content/contentIndex.json', ['generate-index']],
  [file => file === 'src/entities/content/contentCoverage.json', ['content:coverage']],
  [file => file === 'src/entities/graph/graph_structure.json', ['validate-graph']],
  [
    file => file === 'src/entities/graph/lean_graph.json'
      || file === 'src/entities/graph/proof_blocks.json',
    ['validate-lean'],
  ],
  [file => file.startsWith('ai/indexes/'), ['ai:index']],
  [file => file.includes('reference'), ['validate-references']],
  [file => file.includes('logical-graph'), ['validate-graph']],
  [file => file.includes('content-index'), ['generate-index']],
  [file => file.includes('content-coverage'), ['content:coverage']],
  [file => file.includes('lean') || file.includes('bridge'), ['validate-lean']],
];

function recommendCommands(
  files: string[],
  categories: Category[],
  availableScripts: Set<string>,
): string[] {
  const requested = new Set<RecommendedCommand>();
  const add = (commands: RecommendedCommand[]): void =>
    commands.forEach(command => requested.add(command));

  for (const category of categories) add(CATEGORY_COMMANDS[category] ?? []);
  for (const file of files) {
    for (const [matches, commands] of FILE_COMMAND_RULES) {
      if (matches(file)) add(commands);
    }
  }

  return COMMAND_ORDER
    .filter(command => requested.has(command) && availableScripts.has(command))
    .map(command => `npm run ${command}`);
}

function buildWarnings(files: string[]): string[] {
  const warnings: string[] = [];
  if (files.some(isGraphData)) {
    warnings.push('Hay JSON bajo src/entities/graph/: comprobar su generador y la coherencia del grafo.');
  }
  if (files.some(isGenerated)) {
    warnings.push('Hay artefactos generados: no deben editarse a mano; hay que regenerarlos desde su fuente.');
  }
  if (files.some(file => file === 'package.json' || /(?:^|\/)(?:bun\.lockb?|package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(file))) {
    warnings.push('Cambió package.json o un lockfile: confirmar que scripts, dependencias y lockfile siguen sincronizados.');
  }
  if (files.some(file => isMultiAiGovernance(file) || file.startsWith('ai/'))) {
    warnings.push('Cambió la infraestructura multi-IA: revisar autoridad, duplicación y vigencia de los índices.');
  }
  if (files.some(file => file.endsWith('.mdx'))) {
    warnings.push('Hay MDX modificado: requiere revisión humana de rigor, metadatos y dependencias semánticas.');
  }
  if (files.some(isLean)) {
    warnings.push('Hay cambios Lean: revisar la prueba y la correspondencia Lean–MDX además de compilar.');
  }
  return warnings;
}

function printList(items: string[], emptyMessage: string): void {
  if (items.length === 0) {
    console.log(`- ${emptyMessage}`);
    return;
  }
  for (const item of items) console.log(`- ${item}`);
}

function humanAction(files: string[], commands: string[], warnings: string[]): string {
  if (files.length === 0) return 'No hay cambios pendientes; no se requiere validación.';
  if (warnings.some(warning => warning.startsWith('Hay artefactos generados'))) {
    return 'Verificar primero el origen de los artefactos generados; después ejecutar los comandos y revisar el diff.';
  }
  if (commands.length > 0) return 'Ejecutar los comandos recomendados en orden y revisar el diff antes de aprobar.';
  return 'Revisar el diff documental y confirmar que el alcance y la redacción son correctos.';
}

function main(): void {
  const changes = collectChanges();
  const files = [...changes.keys()].sort(compareText);
  const categories = classify(files);
  const commands = recommendCommands(files, categories, readPackageScripts());
  const warnings = buildWarnings(files);

  console.log('[ai:review] Working tree');
  console.log('\nArchivos detectados:');
  if (files.length === 0) {
    console.log('- ninguno');
  } else {
    for (const file of files) {
      const sources = SOURCE_ORDER.filter(source => changes.get(file)?.has(source));
      console.log(`- ${file} [${sources.join(', ')}]`);
    }
  }
  console.log('\nCategorías detectadas:');
  printList(categories, 'ninguna');
  console.log('\nComandos recomendados:');
  printList(commands, 'ninguno');
  console.log('\nWarnings:');
  printList(warnings, 'ninguno');
  console.log('\nSiguiente acción humana sugerida:');
  console.log(`- ${humanAction(files, commands, warnings)}`);
}

try {
  main();
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[ai:review] ERROR: ${detail}`);
  process.exitCode = 1;
}
