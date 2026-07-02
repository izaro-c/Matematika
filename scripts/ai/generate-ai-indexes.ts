import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

type JsonPrimitive = boolean | number | string | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type JsonRecord = { [key: string]: JsonValue };

interface WarningEntry {
  scope: string;
  message: string;
}

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

interface FileMetric {
  path: string;
  bytes: number;
  lines: number;
}

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, 'ai/indexes');
const SOURCE_EXTENSIONS = new Set([
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
const IGNORED_DIRECTORY_NAMES = new Set(['.git', '.lake', '.vite', 'coverage', 'dist', 'node_modules']);
const IGNORED_PREFIXES = ['ai/indexes/', 'docs/api/'];
const LARGE_FILE_LINES = 300;
const LARGE_FILE_BYTES = 20_000;
const HEX_COLOR_PATTERN = /#[\da-fA-F]{8}\b|#[\da-fA-F]{6}\b|#[\da-fA-F]{3}\b/g;
const OUTPUT_NAMES = [
  'project-map.json',
  'content-map.json',
  'graph-map.json',
  'component-map.json',
  'design-token-map.json',
  'lean-map.json',
  'command-map.json',
  'debt-map.json',
] as const;

const warnings: WarningEntry[] = [];

function relative(filePath: string): string {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function warn(scope: string, message: string): void {
  const entry = { scope, message };
  warnings.push(entry);
  console.warn(`[ai:index] WARN [${scope}] ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stableValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, stableValue(child)]),
    );
  }
  return value;
}

function writeCompactJson(fileName: string, value: JsonRecord): void {
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), `${JSON.stringify(stableValue(value))}\n`, 'utf8');
}

function readText(filePath: string, scope: string, expected = true): string | null {
  if (!fs.existsSync(filePath)) {
    if (expected) warn(scope, `Missing expected file: ${relative(filePath)}`);
    return null;
  }
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    warn(scope, `Could not read ${relative(filePath)}: ${detail}`);
    return null;
  }
}

function readJson(filePath: string, scope: string, expected = true): unknown {
  const text = readText(filePath, scope, expected);
  if (text === null) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    warn(scope, `Invalid JSON in ${relative(filePath)}: ${detail}`);
    return null;
  }
}

function shouldIgnore(filePath: string): boolean {
  const relPath = relative(filePath);
  return IGNORED_PREFIXES.some(prefix => relPath.startsWith(prefix));
}

function walkFiles(directory: string, scope: string, expected = false): string[] {
  if (!fs.existsSync(directory)) {
    if (expected) warn(scope, `Missing expected directory: ${relative(directory)}`);
    return [];
  }

  const files: string[] = [];
  const visit = (current: string): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true })
        .sort((left, right) => left.name.localeCompare(right.name));
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      warn(scope, `Could not list ${relative(current)}: ${detail}`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORY_NAMES.has(entry.name) && !shouldIgnore(`${fullPath}/`)) visit(fullPath);
      } else if (entry.isFile() && !shouldIgnore(fullPath)) {
        files.push(fullPath);
      }
    }
  };

  visit(directory);
  return files.sort((left, right) => relative(left).localeCompare(relative(right)));
}

function existingPaths(paths: string[]): string[] {
  return paths.filter(candidate => fs.existsSync(path.join(ROOT, candidate))).sort();
}

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

function lineCount(text: string): number {
  if (text.length === 0) return 0;
  const count = text.split(/\r?\n/).length;
  return text.endsWith('\n') ? count - 1 : count;
}

function fileMetric(filePath: string): FileMetric | null {
  const text = readText(filePath, 'metrics');
  if (text === null) return null;
  return {
    path: relative(filePath),
    bytes: Buffer.byteLength(text),
    lines: lineCount(text),
  };
}

function metricRecord(metric: FileMetric): JsonRecord {
  return { path: metric.path, lines: metric.lines, bytes: metric.bytes };
}

function compareMetrics(left: FileMetric, right: FileMetric): number {
  return right.lines - left.lines || right.bytes - left.bytes || left.path.localeCompare(right.path);
}

function warningValues(scope: string): JsonValue[] {
  return warnings
    .filter(entry => entry.scope === scope)
    .map(entry => entry.message)
    .sort()
    .map(message => message);
}

const packagePath = path.join(ROOT, 'package.json');
const packageValue = readJson(packagePath, 'project');
const packageJson: PackageJson = isRecord(packageValue) ? packageValue as PackageJson : {};
const packageScripts = isRecord(packageJson.scripts) ? packageJson.scripts as Record<string, string> : {};
const dependencies = {
  ...(isRecord(packageJson.dependencies) ? packageJson.dependencies as Record<string, string> : {}),
  ...(isRecord(packageJson.devDependencies) ? packageJson.devDependencies as Record<string, string> : {}),
};
const allProjectFiles = walkFiles(ROOT, 'project', true);
const sourceFiles = walkFiles(path.join(ROOT, 'src'), 'components', true);

function detectStack(): JsonValue[] {
  const candidates: Array<[string, string[]]> = [
    ['React', ['react']],
    ['TypeScript', ['typescript']],
    ['Vite', ['vite']],
    ['Wouter', ['wouter']],
    ['MDX', ['@mdx-js/react', '@mdx-js/rollup']],
    ['Zod', ['zod']],
    ['Tailwind CSS', ['tailwindcss', '@tailwindcss/vite']],
    ['Zustand', ['zustand']],
    ['JSXGraph', ['jsxgraph']],
    ['React Force Graph', ['react-force-graph-2d']],
    ['Vitest', ['vitest']],
    ['Dependency Cruiser', ['dependency-cruiser']],
  ];

  const detected = candidates.flatMap(([name, packages]) => {
    const installed = packages.filter(packageName => dependencies[packageName] !== undefined);
    if (installed.length === 0) return [];
    return [{
      name,
      packages: installed.map(packageName => `${packageName}@${dependencies[packageName]}`).sort(),
    }];
  });
  if (fs.existsSync(path.join(ROOT, 'lean'))) detected.push({ name: 'Lean 4', packages: [] });
  return detected.sort((left, right) => left.name.localeCompare(right.name));
}

function buildProjectMap(): JsonRecord {
  const excludedTopLevel = new Set(['.git', '.vite', 'dist', 'node_modules']);
  const topLevelDirectories = fs.existsSync(ROOT)
    ? fs.readdirSync(ROOT, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && !excludedTopLevel.has(entry.name))
      .map(entry => entry.name)
      .sort()
    : [];
  const architectureLayers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared', 'database']
    .filter(layer => fs.existsSync(path.join(ROOT, 'src', layer)));
  const mainScriptNames = ['dev', 'build', 'full-check', 'typecheck', 'test', 'ai:index'];

  return {
    schemaVersion: 1,
    project: {
      name: packageJson.name ?? path.basename(ROOT),
      description: 'Enciclopedia matemática interactiva organizada como jardín digital semántico',
    },
    stack: detectStack(),
    topLevelDirectories,
    architecture: {
      style: architectureLayers.length >= 5 ? 'Feature-Sliced Design' : 'undetermined',
      layers: architectureLayers,
      ruleFile: fs.existsSync(path.join(ROOT, '.dependency-cruiser.js')) ? '.dependency-cruiser.js' : null,
    },
    aiSourcesOfTruth: [
      { path: 'AGENTS.md', role: 'global rules and reading order' },
      { path: 'docs/ai/', role: 'multi-AI governance and formal protocol' },
      { path: 'ai/', role: 'daily operational state, goals and generated indexes' },
      { path: '.agents/skills/', role: 'reusable procedures loaded on demand' },
      { path: '.opencode/', role: 'official OpenCode adapter, not common policy' },
    ].filter(entry => fs.existsSync(path.join(ROOT, entry.path))),
    mainScripts: Object.fromEntries(
      mainScriptNames
        .filter(name => packageScripts[name] !== undefined)
        .sort()
        .map(name => [name, packageScripts[name]]),
    ),
    relevantWarnings: [
      '.auxiliary/ is historical or duplicated material and is not a source of truth.',
      'Generated/build artefacts should not be loaded as AI context unless directly required.',
      'Content, graph and Lean indexes can be stale until their owning generators or validators run.',
    ],
    warnings: warningValues('project'),
  };
}

function buildContentMap(): JsonRecord {
  const contentRoot = path.join(ROOT, 'src/database/content');
  const mdxFiles = walkFiles(contentRoot, 'content', true)
    .filter(filePath => path.extname(filePath) === '.mdx');
  const contentDirectories = fs.existsSync(contentRoot)
    ? fs.readdirSync(contentRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => {
        const directoryPath = path.join(contentRoot, entry.name);
        return {
          path: relative(directoryPath),
          mdxFiles: walkFiles(directoryPath, 'content').filter(filePath => path.extname(filePath) === '.mdx').length,
        };
      })
      .sort((left, right) => left.path.localeCompare(right.path))
    : [];

  const contentIndexPath = path.join(ROOT, 'src/entities/content/contentIndex.json');
  const contentIndex = readJson(contentIndexPath, 'content');
  const indexEntries = isRecord(contentIndex) ? Object.values(contentIndex) : [];
  const indexedFilePaths = new Set(
    indexEntries
      .filter(isRecord)
      .map(entry => entry.filePath)
      .filter((filePath): filePath is string => typeof filePath === 'string'),
  );
  if (isRecord(contentIndex) && indexedFilePaths.size !== mdxFiles.length) {
    warn(
      'content',
      `contentIndex.json references ${indexedFilePaths.size} unique content files but ${mdxFiles.length} MDX files were found.`,
    );
  }

  const schemasPath = path.join(ROOT, 'src/entities/content/schemas.ts');
  const schemasText = readText(schemasPath, 'content');
  const schemaNames = schemasText === null
    ? []
    : [...schemasText.matchAll(/export\s+const\s+([A-Za-z0-9]+Schema)\s*=/g)]
      .map(match => match[1])
      .sort();

  return {
    schemaVersion: 1,
    contentSources: contentDirectories,
    existingIndexes: existingPaths([
      'src/entities/content/contentIndex.json',
      'src/entities/content/contentCoverage.json',
      'src/entities/content/model_badges_registry.json',
    ]),
    relevantSchemasAndTypes: existingPaths([
      'src/entities/content/schemas.ts',
      'src/entities/content/types.ts',
      'src/entities/content/msc2020.ts',
      'src/entities/content/ContentStore.ts',
    ]),
    detectedSchemas: schemaNames,
    approximateMdxFileCount: mdxFiles.length,
    contentIndex: {
      entryCount: isRecord(contentIndex) ? Object.keys(contentIndex).length : null,
      uniqueIndexedFileCount: isRecord(contentIndex) ? indexedFilePaths.size : null,
      note: 'Entry count may exceed file count when an entry is indexed by both id and slug.',
    },
    notes: [
      'MDX metadata authority: src/entities/content/schemas.ts.',
      'Counts describe files and existing indexes; MDX metadata is not evaluated by this generator.',
    ],
    warnings: warningValues('content'),
  };
}

function stringItems(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function graphNodeDependencies(value: unknown): string[] {
  if (!isRecord(value)) return [];
  const proofDependencies = Array.isArray(value.proofs)
    ? value.proofs.flatMap(proof => isRecord(proof) ? stringItems(proof.dependencies) : [])
    : [];
  return [...stringItems(value.directDependencies), ...proofDependencies];
}

function deriveGraphCounts(structure: unknown): JsonRecord | null {
  if (!isRecord(structure) || !isRecord(structure.nodes)) return null;
  const edges = new Set(
    Object.entries(structure.nodes).flatMap(([target, node]) =>
      graphNodeDependencies(node).map(source => `${source}\u0000${target}`),
    ),
  );
  return {
    nodes: Object.keys(structure.nodes).length,
    uniqueDependencyEdges: edges.size,
    topologicalOrderEntries: Array.isArray(structure.topologicalOrder) ? structure.topologicalOrder.length : null,
  };
}

function buildGraphMap(): JsonRecord {
  const graphRoot = path.join(ROOT, 'src/entities/graph');
  const graphFiles = walkFiles(graphRoot, 'graph', true).map(relative);
  const structurePath = path.join(graphRoot, 'graph_structure.json');
  const structure = readJson(structurePath, 'graph');
  const graphCounts = deriveGraphCounts(structure);
  if (graphCounts === null && structure !== null) {
    warn('graph', 'graph_structure.json does not contain the expected nodes object.');
  }

  return {
    schemaVersion: 1,
    graphFiles,
    safelyDerivedCounts: graphCounts ?? {
      nodes: null,
      uniqueDependencyEdges: null,
      topologicalOrderEntries: null,
    },
    leanRelatedFiles: existingPaths([
      'src/entities/graph/lean_graph.json',
      'src/entities/graph/proof_blocks.json',
      'scripts/core/generate-lean-graph.ts',
      'scripts/core/lean-graph-utils.ts',
    ]),
    relatedValidators: Object.fromEntries(
      Object.entries(packageScripts)
        .filter(([name]) => name.includes('graph') || name === 'validate-references')
        .sort(([left], [right]) => left.localeCompare(right)),
    ),
    countingMethod: 'Unique source-to-target pairs from directDependencies and proof dependencies in graph_structure.json.',
    warnings: warningValues('graph'),
  };
}

function layerSummary(layer: string): JsonRecord {
  const layerRoot = path.join(ROOT, 'src', layer);
  const files = walkFiles(layerRoot, 'components');
  const modules = fs.existsSync(layerRoot)
    ? fs.readdirSync(layerRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()
    : [];
  return { files: files.length, modules };
}

function buildComponentMap(): JsonRecord {
  const tsxFiles = sourceFiles.filter(filePath => path.extname(filePath) === '.tsx');
  const metrics = tsxFiles
    .map(fileMetric)
    .filter((metric): metric is FileMetric => metric !== null)
    .sort(compareMetrics);
  const pages = tsxFiles
    .filter(filePath => relative(filePath).startsWith('src/pages/'))
    .map(relative)
    .sort();
  const srcLayers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared', 'database']
    .filter(layer => fs.existsSync(path.join(ROOT, 'src', layer)));

  return {
    schemaVersion: 1,
    srcStructure: Object.fromEntries(srcLayers.map(layer => [layer, layerSummary(layer)])),
    pages,
    detectedLayers: Object.fromEntries(
      ['widgets', 'features', 'entities', 'shared']
        .filter(layer => fs.existsSync(path.join(ROOT, 'src', layer)))
        .map(layer => [layer, layerSummary(layer)]),
    ),
    tsxComponentCount: tsxFiles.length,
    principalTsxComponents: metrics.slice(0, 25).map(metricRecord),
    approximateLargeTsxFiles: metrics
      .filter(metric => metric.lines >= LARGE_FILE_LINES || metric.bytes >= LARGE_FILE_BYTES)
      .map(metricRecord),
    selectionMethod: {
      principal: '25 largest TSX files by line count, then bytes.',
      large: `At least ${LARGE_FILE_LINES} lines or ${LARGE_FILE_BYTES} bytes.`,
    },
    warnings: warningValues('components'),
  };
}

function hexMatches(text: string): string[] {
  return text.match(HEX_COLOR_PATTERN) ?? [];
}

function buildDesignTokenMap(): JsonRecord {
  const styleFiles = allProjectFiles
    .filter(filePath => {
      const relPath = relative(filePath);
      return path.extname(filePath) === '.css'
        || /(^|\/)(tailwind|postcss)\.config\.[^/]+$/.test(relPath)
        || relPath === 'src/shared/lib/theme.ts'
        || relPath === 'src/shared/lib/constants.ts';
    })
    .map(relative)
    .sort();
  const visualConstantsPath = path.join(ROOT, 'src/shared/lib/constants.ts');
  const constantsText = readText(visualConstantsPath, 'design');
  const visualConstants = constantsText === null
    ? []
    : [...constantsText.matchAll(/export\s+const\s+([A-Z][A-Z0-9_]*)/g)]
      .map(match => match[1])
      .filter(name => /(COLOR|STYLE|THEME|TYPE|DIFF)/.test(name))
      .sort();

  const colorFiles: Array<{ path: string; count: number; values: string[] }> = [];
  let totalHexColors = 0;
  for (const filePath of sourceFiles.filter(file => SOURCE_EXTENSIONS.has(path.extname(file)))) {
    const text = readText(filePath, 'design');
    if (text === null) continue;
    const matches = hexMatches(text);
    if (matches.length === 0) continue;
    totalHexColors += matches.length;
    colorFiles.push({
      path: relative(filePath),
      count: matches.length,
      values: [...new Set(matches.map(value => value.toLowerCase()))].sort(),
    });
  }
  colorFiles.sort((left, right) => right.count - left.count || left.path.localeCompare(right.path));

  const tokenTexts = existingPaths([
    'src/app/index.css',
    'src/shared/lib/constants.ts',
    'src/shared/lib/theme.ts',
  ]).map(filePath => readText(path.join(ROOT, filePath), 'design') ?? '').join('\n');
  const detectedThemeTokens = [...new Set(
    [...tokenTexts.matchAll(/--theme-([a-z0-9-]+)/g)].map(match => match[1]),
  )].sort();

  return {
    schemaVersion: 1,
    styleFiles,
    visualConstantFiles: existingPaths([
      'src/shared/lib/constants.ts',
      'src/shared/lib/theme.ts',
      'src/app/index.css',
    ]),
    visualConstants,
    allowedArtsAndCraftsPalette: ['carbon', 'granada', 'lienzo', 'musgo', 'ocre', 'pavo', 'pizarra', 'salvia', 'terracota'],
    detectedThemeTokens,
    approximateHexColorOccurrencesInSrc: totalHexColors,
    possibleVisualHardcodingPoints: colorFiles,
    countingMethod: 'Lexical #RGB, #RRGGBB or #RRGGBBAA occurrences; CSS token definitions and fallbacks are included.',
    warnings: warningValues('design'),
  };
}

function countLeanDeclarations(text: string): number {
  const declarationPattern = /^(?:axiom|class|def|inductive|lemma|structure|theorem)\b/;
  return text.split(/\r?\n/).filter(line => declarationPattern.test(line.trimStart())).length;
}

function buildLeanMap(): JsonRecord {
  const leanRoot = path.join(ROOT, 'lean');
  const leanFiles = walkFiles(leanRoot, 'lean', true)
    .filter(filePath => path.extname(filePath) === '.lean');
  const leanFileSummaries = leanFiles.map(filePath => {
    const text = readText(filePath, 'lean');
    return {
      path: relative(filePath),
      approximateDeclarations: text === null ? null : countLeanDeclarations(text),
    };
  });
  const leanGraph = readJson(path.join(ROOT, 'src/entities/graph/lean_graph.json'), 'lean');
  const leanNodes = isRecord(leanGraph) && Array.isArray(leanGraph.nodes) ? leanGraph.nodes : null;
  const statusCounts: Record<string, number> = {};
  const foundationCounts: Record<string, number> = {};
  if (leanNodes !== null) {
    for (const rawNode of leanNodes) {
      if (!isRecord(rawNode)) continue;
      const status = typeof rawNode.verificationStatus === 'string' ? rawNode.verificationStatus : 'unknown';
      const foundation = typeof rawNode.foundation === 'string' ? rawNode.foundation : 'unknown';
      statusCounts[status] = (statusCounts[status] ?? 0) + 1;
      foundationCounts[foundation] = (foundationCounts[foundation] ?? 0) + 1;
    }
  }

  return {
    schemaVersion: 1,
    leanDirectoryExists: fs.existsSync(leanRoot),
    leanFiles: leanFileSummaries,
    projectFiles: existingPaths([
      'lean/lakefile.lean',
      'lean/lean-toolchain',
      'lean/lake-manifest.json',
    ]),
    detectedLeanScripts: Object.fromEntries(
      Object.entries(packageScripts)
        .filter(([name, command]) => name.includes('lean') || name.startsWith('bridge:') || command.includes('lean'))
        .sort(([left], [right]) => left.localeCompare(right)),
    ),
    existingLeanIndexes: existingPaths([
      'src/entities/graph/lean_graph.json',
      'src/entities/graph/proof_blocks.json',
      'docs/lean/bridge-debt.json',
    ]),
    existingIndexSummary: {
      leanGraphNodes: leanNodes?.length ?? null,
      verificationStatuses: statusCounts,
      foundations: foundationCounts,
    },
    status: 'Static inventory only; Lean was not executed and existing generated indexes may be stale.',
    warnings: warningValues('lean'),
  };
}

type CommandCategory = 'ai' | 'build' | 'content' | 'dev' | 'graph' | 'lean' | 'other' | 'test' | 'validation';

function commandCategory(name: string): CommandCategory {
  if (name === 'ai:index' || name.startsWith('ai:')) return 'ai';
  if (name === 'test' || name.startsWith('test:')) return 'test';
  if (name.includes('lean') || name.startsWith('bridge:')) return 'lean';
  if (name.includes('graph')) return 'graph';
  if (name === 'dev' || name === 'preview') return 'dev';
  if (name === 'build' || name === 'prebuild' || name === 'predeploy' || name === 'deploy') return 'build';
  if (name.includes('content') || name === 'generate-index') return 'content';
  if (name.startsWith('validate') || name === 'lint' || name === 'typecheck' || name.startsWith('depcruise') || name === 'full-check') {
    return 'validation';
  }
  return 'other';
}

function buildCommandMap(): JsonRecord {
  const categories: Record<CommandCategory, Record<string, string>> = {
    dev: {},
    build: {},
    test: {},
    validation: {},
    content: {},
    graph: {},
    lean: {},
    ai: {},
    other: {},
  };
  for (const [name, command] of Object.entries(packageScripts).sort(([left], [right]) => left.localeCompare(right))) {
    categories[commandCategory(name)][name] = command;
  }
  return {
    schemaVersion: 1,
    source: 'package.json#scripts',
    scriptCount: Object.keys(packageScripts).length,
    categories,
    warnings: warningValues('commands'),
  };
}

function scanDebtFiles(): string[] {
  return allProjectFiles.filter(filePath => SOURCE_EXTENSIONS.has(path.extname(filePath)));
}

function repeatedBasenames(layerFiles: Record<string, string[]>): JsonValue[] {
  const pathsByName = new Map<string, string[]>();
  for (const files of Object.values(layerFiles)) {
    for (const filePath of files) {
      const name = path.basename(filePath);
      const paths = pathsByName.get(name) ?? [];
      paths.push(filePath);
      pathsByName.set(name, paths);
    }
  }
  return [...pathsByName.entries()]
    .filter(([, paths]) => new Set(paths.map(filePath => filePath.split('/')[0])).size > 1)
    .map(([name, paths]) => ({ name, paths: paths.sort() }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function exactContentDuplicates(layerFiles: Record<string, string[]>): JsonValue[] {
  const pathsByDigest = new Map<string, string[]>();
  for (const files of Object.values(layerFiles)) {
    for (const relPath of files) {
      const fullPath = path.join(ROOT, relPath);
      const text = readText(fullPath, 'debt');
      if (text === null || text.length === 0 || Buffer.byteLength(text) > 1_000_000) continue;
      const digest = createHash('sha256').update(text).digest('hex');
      const paths = pathsByDigest.get(digest) ?? [];
      paths.push(relPath);
      pathsByDigest.set(digest, paths);
    }
  }
  return [...pathsByDigest.values()]
    .filter(paths => new Set(paths.map(filePath => filePath.split('/')[0])).size > 1)
    .map(paths => ({ paths: paths.sort() }))
    .sort((left, right) => left.paths[0].localeCompare(right.paths[0]));
}

function buildDebtMap(): JsonRecord {
  const debtFiles = scanDebtFiles();
  const anyByFile: Array<{ path: string; count: number }> = [];
  const hexByFile: Array<{ path: string; count: number }> = [];
  const todoFixmeByFile: Array<{ path: string; count: number }> = [];
  const largeTsFiles: FileMetric[] = [];

  for (const filePath of debtFiles) {
    const extension = path.extname(filePath);
    const text = readText(filePath, 'debt');
    if (text === null) continue;
    const relPath = relative(filePath);
    if (TS_EXTENSIONS.has(extension)) {
      const anyCount = countMatches(text, /\bany\b/g);
      if (anyCount > 0) anyByFile.push({ path: relPath, count: anyCount });
      const metric: FileMetric = { path: relPath, bytes: Buffer.byteLength(text), lines: lineCount(text) };
      if (metric.lines >= LARGE_FILE_LINES || metric.bytes >= LARGE_FILE_BYTES) largeTsFiles.push(metric);
    }
    const hexCount = hexMatches(text).length;
    if (hexCount > 0) hexByFile.push({ path: relPath, count: hexCount });
    const todoCount = countMatches(text, /\b(?:TODO|FIXME)\b/g);
    if (todoCount > 0) todoFixmeByFile.push({ path: relPath, count: todoCount });
  }

  const byCountThenPath = (left: { path: string; count: number }, right: { path: string; count: number }): number =>
    right.count - left.count || left.path.localeCompare(right.path);
  anyByFile.sort(byCountThenPath);
  hexByFile.sort(byCountThenPath);
  todoFixmeByFile.sort(byCountThenPath);
  largeTsFiles.sort(compareMetrics);

  const artefactCandidates: Array<[string, string]> = [
    ['node_modules', 'installed dependencies'],
    ['.opencode/node_modules', 'adapter-local installed dependencies'],
    ['dist', 'build output'],
    ['coverage', 'test coverage output'],
    ['.vite', 'Vite cache'],
    ['lean/.lake', 'Lean build cache'],
    ['docs/api', 'generated API documentation'],
    ['scripts/plantuml.jar', 'binary tooling asset'],
    ['package-lock.json', 'large dependency lockfile'],
  ];
  const contextArtefacts = artefactCandidates
    .filter(([candidate]) => fs.existsSync(path.join(ROOT, candidate)))
    .map(([candidate, reason]) => ({ path: candidate, reason }));

  const duplicationRoots = ['ai', 'docs/ai', '.agents', '.opencode', '.auxiliary'];
  const layerFiles = Object.fromEntries(
    duplicationRoots.map(root => [
      root,
      walkFiles(path.join(ROOT, root), 'debt')
        .filter(filePath => SOURCE_EXTENSIONS.has(path.extname(filePath)))
        .map(relative),
    ]),
  );

  return {
    schemaVersion: 1,
    scanScope: 'Repository text/code files excluding .git, node_modules, dist, coverage, .vite, .lake, docs/api and ai/indexes.',
    approximateAnyOccurrencesByFile: anyByFile,
    approximateHexColorOccurrencesByFile: hexByFile,
    todoOrFixmeOccurrencesByFile: todoFixmeByFile,
    approximateLargeTsOrTsxFiles: largeTsFiles.map(metricRecord),
    possibleContextArtefacts: contextArtefacts,
    potentialAiLayerDuplication: {
      method: 'Repeated basenames and byte-identical files across ai/, docs/ai/, .agents/, .opencode/ and .auxiliary/; semantic duplication is not inferred.',
      layerFileCounts: Object.fromEntries(
        Object.entries(layerFiles).map(([root, files]) => [root, files.length]),
      ),
      repeatedBasenames: repeatedBasenames(layerFiles),
      exactContentDuplicates: exactContentDuplicates(layerFiles),
    },
    heuristicThresholds: {
      largeFileLines: LARGE_FILE_LINES,
      largeFileBytes: LARGE_FILE_BYTES,
      any: 'Lexical whole-word occurrences in TS/TSX, including comments and strings.',
      colors: 'Lexical #RGB, #RRGGBB or #RRGGBBAA occurrences.',
      todos: 'Lexical whole-word TODO or FIXME occurrences.',
    },
    warnings: warningValues('debt'),
  };
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const maps: Record<(typeof OUTPUT_NAMES)[number], JsonRecord> = {
  'project-map.json': buildProjectMap(),
  'content-map.json': buildContentMap(),
  'graph-map.json': buildGraphMap(),
  'component-map.json': buildComponentMap(),
  'design-token-map.json': buildDesignTokenMap(),
  'lean-map.json': buildLeanMap(),
  'command-map.json': buildCommandMap(),
  'debt-map.json': buildDebtMap(),
};

for (const outputName of OUTPUT_NAMES) {
  writeCompactJson(outputName, maps[outputName]);
}

console.log(`[ai:index] Generated ${OUTPUT_NAMES.length} deterministic indexes:`);
for (const outputName of OUTPUT_NAMES) console.log(`- ai/indexes/${outputName}`);
console.log(`[ai:index] Warnings: ${warnings.length}`);
