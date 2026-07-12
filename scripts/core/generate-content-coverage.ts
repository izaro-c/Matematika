import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import {
  loadContentMetadata,
  readJsonFile,
  type ContentMetadataEntry,
  type LeanGraph,
} from './lean-graph-utils.ts';

const CONTENT_DIR = path.resolve('./src/database/content');
const LEAN_GRAPH_PATH = path.resolve('./src/entities/graph/lean_graph.json');
const OUTPUT_PATH = path.resolve('./src/entities/content/contentCoverage.json');

type DiagramStatus = 'exported' | 'declared-missing-export' | 'exported-undeclared' | 'none';
type CoverageStatus = 'none' | 'human-proof' | 'lean-checked' | 'lean-audited';

interface ContentCoverageEntry {
  id: string;
  type: string;
  title: string;
  filePath: string;
  hasDeclaredDiagram: boolean;
  diagramExports: string[];
  diagramStatus: DiagramStatus;
  leanId: string | null;
  leanVerified: boolean;
  verificationStatus: CoverageStatus;
  foundation: string;
  sourcesCount: number;
  proofSteps: number;
  mappedProofSteps: string[];
  parentTheorem: string | null;
  demos: string[];
}

interface ContentCoverage {
  generatedAt: string;
  summary: {
    total: number;
    byType: Record<string, number>;
    diagrams: Record<DiagramStatus, number>;
    lean: Record<CoverageStatus, number>;
    theoremLike: {
      total: number;
      leanLinked: number;
      leanChecked: number;
      humanProof: number;
      withDeclaredDiagram: number;
    };
    demonstrations: {
      total: number;
      leanLinked: number;
      withMappedProofSteps: number;
    };
  };
  items: ContentCoverageEntry[];
}

interface GenerateContentCoverageOptions {
  contentDir?: string;
  leanGraphPath?: string;
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

function mappedProofSteps(value: unknown): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.keys(value).sort((a, b) => Number(a) - Number(b));
}

function createLeanStatusMap(leanGraphPath: string): Map<string, CoverageStatus> {
  const graph = readJsonFile<LeanGraph>(leanGraphPath, { generatedAt: null, nodes: [] });
  return new Map(graph.nodes.map(node => [node.leanId, node.verificationStatus]));
}

function toCoverageEntry(
  entry: ContentMetadataEntry,
  contentDir: string,
  leanStatusById: Map<string, CoverageStatus>,
): ContentCoverageEntry {
  const content = entry.content ?? '';
  const metadata = entry.metadata;
  const type = asString(metadata.type, 'unknown');
  const declaredDiagram = metadata.hasSimulation === true || metadata.hasDiagram === true;
  const diagramExports = getDiagramExports(content);
  const leanId = asString(metadata.leanId) || null;
  const verificationStatus = leanId ? leanStatusById.get(leanId) ?? 'none' : 'none';
  const foundation = asString(metadata.foundation) || 'pending';
  const sources = Array.isArray(metadata.sources) ? metadata.sources : [];

  return {
    id: entry.id,
    type,
    title: asString(metadata.title, entry.id),
    filePath: path.relative(contentDir, entry.filePath),
    hasDeclaredDiagram: declaredDiagram,
    diagramExports,
    diagramStatus: getDiagramStatus(declaredDiagram, diagramExports),
    leanId,
    leanVerified: leanId !== null && leanStatusById.has(leanId),
    verificationStatus,
    foundation,
    sourcesCount: sources.length,
    proofSteps: countProofSteps(content),
    mappedProofSteps: mappedProofSteps(metadata.stepTacticMap),
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
    lean: countBy(items.map(item => item.verificationStatus)),
    theoremLike: {
      total: theoremLike.length,
      leanLinked: theoremLike.filter(item => item.leanId !== null).length,
      leanChecked: theoremLike.filter(item => item.verificationStatus === 'lean-checked').length,
      humanProof: theoremLike.filter(item => item.verificationStatus === 'human-proof').length,
      withDeclaredDiagram: theoremLike.filter(item => item.hasDeclaredDiagram).length,
    },
    demonstrations: {
      total: demonstrations.length,
      leanLinked: demonstrations.filter(item => item.leanId !== null).length,
      withMappedProofSteps: demonstrations.filter(item => item.mappedProofSteps.length > 0).length,
    },
  };
}

export function generateContentCoverage(options: GenerateContentCoverageOptions = {}): ContentCoverage {
  const contentDir = options.contentDir ?? CONTENT_DIR;
  const leanGraphPath = options.leanGraphPath ?? LEAN_GRAPH_PATH;
  const outputPath = options.outputPath ?? OUTPUT_PATH;
  const leanStatusById = createLeanStatusMap(leanGraphPath);
  const content = loadContentMetadata(contentDir);
  const items = [...content.values()]
    .map(entry => toCoverageEntry(entry, contentDir, leanStatusById))
    .sort((a, b) => a.filePath.localeCompare(b.filePath));

  let generatedAt = new Date().toISOString();
  try {
    if (fs.existsSync(outputPath)) {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      if (existing && existing.generatedAt) {
        generatedAt = existing.generatedAt;
      }
    }
  } catch (err) {
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
  console.log(`   Lean-linked theorem/lemma/corollary pages: ${coverage.summary.theoremLike.leanLinked}/${coverage.summary.theoremLike.total}`);
  console.log(`   Lean-linked demonstrations: ${coverage.summary.demonstrations.leanLinked}/${coverage.summary.demonstrations.total}`);
}
