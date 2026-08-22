import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const CONTENT_DIR = path.resolve('./content/mdx');
const OUTPUT_PATH = path.resolve('./src/data/content/contentCoverage.json');

type DiagramStatus = 'exported' | 'declared-missing-export' | 'exported-undeclared' | 'none';

export interface ContentMetadataEntry {
  id: string;
  filePath: string;
  metadata: Record<string, unknown>;
  content?: string;
}

export interface ContentCoverageEntry {
  id: string;
  type: string;
  title: string;
  filePath: string;
  hasDeclaredDiagram: boolean;
  diagramExports: string[];
  diagramStatus: DiagramStatus;
  sourcesCount: number;
  proofSteps: number;
  parentTheorem: string | null;
  demos: string[];
}

export interface ContentCoverage {
  generatedAt: string;
  summary: {
    total: number;
    byType: Record<string, number>;
    diagrams: Record<DiagramStatus, number>;
    theoremLike: {
      total: number;
      withDeclaredDiagram: number;
    };
    demonstrations: {
      total: number;
    };
  };
  items: ContentCoverageEntry[];
}

interface GenerateContentCoverageOptions {
  contentDir?: string;
  outputPath?: string;
}

function countBy<T extends string>(values: T[]): Record<T, number> {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function getDiagramExports(content: string): string[] {
  return ['Simulation', 'Diagram'].filter(name =>
    new RegExp(`export\\s+const\\s+${name}\\b`).test(content),
  );
}

function getDiagramStatus(hasDeclaredDiagram: boolean, diagramExports: string[]): DiagramStatus {
  if (hasDeclaredDiagram && diagramExports.length > 0) return 'exported';
  if (hasDeclaredDiagram) return 'declared-missing-export';
  if (diagramExports.length > 0) return 'exported-undeclared';
  return 'none';
}

function countProofSteps(content: string): number {
  return [...content.matchAll(/<ProofStep\b/g)].length;
}

function getMdxFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getMdxFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.mdx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function parseMetadata(content: string, filePath: string): Record<string, unknown> | null {
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  if (!match) return null;
  try {
    // eslint-disable-next-line sonarjs/code-eval -- internal script, trusted MDX content
    const fn = new Function(`return ${match[1]}`);
    return fn();
  } catch (error) {
    console.warn(`[WARN] Invalid metadata syntax in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export function loadContentMetadata(contentDir: string): Map<string, ContentMetadataEntry> {
  const entries = new Map<string, ContentMetadataEntry>();
  for (const filePath of getMdxFiles(contentDir)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const metadata = parseMetadata(content, filePath);
    if (!metadata) continue;
    const id = typeof metadata.id === 'string' ? metadata.id : path.basename(filePath, '.mdx');
    entries.set(id, { id, filePath, metadata, content });
  }
  return entries;
}

function toCoverageEntry(
  entry: ContentMetadataEntry,
  contentDir: string,
): ContentCoverageEntry {
  const content = entry.content ?? '';
  const metadata = entry.metadata;
  const type = asString(metadata.type, 'unknown');
  const declaredDiagram = metadata.hasSimulation === true || metadata.hasDiagram === true;
  const diagramExports = getDiagramExports(content);
  const sources = Array.isArray(metadata.sources) ? metadata.sources : [];

  return {
    id: entry.id,
    type,
    title: asString(metadata.title, entry.id),
    filePath: path.relative(contentDir, entry.filePath),
    hasDeclaredDiagram: declaredDiagram,
    diagramExports,
    diagramStatus: getDiagramStatus(declaredDiagram, diagramExports),
    sourcesCount: sources.length,
    proofSteps: countProofSteps(content),
    parentTheorem: asString(metadata.parentTheorem) || null,
    demos: asStringArray(metadata.demos),
  };
}

function summarize(items: ContentCoverageEntry[]): ContentCoverage['summary'] {
  const theoremTypes = new Set(['teorema', 'lema', 'corolario']);
  const theoremLike = items.filter(item => theoremTypes.has(item.type));
  const demonstrations = items.filter(item => item.type === 'demostracion');

  return {
    total: items.length,
    byType: countBy(items.map(item => item.type)),
    diagrams: countBy(items.map(item => item.diagramStatus)),
    theoremLike: {
      total: theoremLike.length,
      withDeclaredDiagram: theoremLike.filter(item => item.hasDeclaredDiagram).length,
    },
    demonstrations: {
      total: demonstrations.length,
    },
  };
}

export function generateContentCoverage(options: GenerateContentCoverageOptions = {}): ContentCoverage {
  const contentDir = options.contentDir ?? CONTENT_DIR;
  const outputPath = options.outputPath ?? OUTPUT_PATH;
  const content = loadContentMetadata(contentDir);
  const items = [...content.values()]
    .map(entry => toCoverageEntry(entry, contentDir))
    .sort((a, b) => a.filePath.localeCompare(b.filePath));

  let generatedAt = new Date().toISOString();
  try {
    if (fs.existsSync(outputPath)) {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      if (existing && existing.generatedAt) {
        generatedAt = existing.generatedAt;
      }
    }
  } catch {
    // Ignore read errors
  }

  const coverage: ContentCoverage = {
    generatedAt,
    summary: summarize(items),
    items,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(coverage, null, 2), 'utf-8');
  return coverage;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const coverage = generateContentCoverage();
  console.log(`✅ Generated content coverage: ${coverage.summary.total} entries`);
  console.log(`   Theorem-like with declared diagrams: ${coverage.summary.theoremLike.withDeclaredDiagram}/${coverage.summary.theoremLike.total}`);
}
