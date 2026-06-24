import fs from 'fs';
import path from 'path';

export interface LeanGraphNode {
  leanId: string;
  matematikaId: string;
  kind: string;
  declaredDeps: string[];
  proofIds: string[];
  sourceFile?: string;
}

export interface LeanProofBlock {
  id: string;
  leanId: string;
  sourceFile: string;
  startLine: number;
  endLine: number;
  code: string;
}

export interface LeanGraph {
  generatedAt: string | null;
  nodes: LeanGraphNode[];
}

export interface ProofBlockRegistry {
  generatedAt: string | null;
  blocks: LeanProofBlock[];
}

export interface ContentMetadataEntry {
  id: string;
  filePath: string;
  metadata: Record<string, unknown>;
}

export interface LeanDiffIssue {
  code: 'missing-mdx' | 'lean-id-mismatch' | 'missing-proof-block' | 'dependency-divergence';
  matematikaId: string;
  leanId?: string;
  message: string;
}

const LEAN_DECL_RE =
  /--\s*@matematika-id\s+"([^"]+)"\s+@lean-id\s+"([^"]+)"\s+@kind\s+"([^"]+)"\s+@deps\s+(\[[^\]]*\])/;
const BLOCK_START_RE = /--\s*@tactic-block-start\s+"([^"]+)"/;
const BLOCK_END_RE = /--\s*@tactic-block-end\s+"([^"]+)"/;

export function getMdxFiles(dir: string, fileList: string[] = []): string[] {
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

export function getLeanFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.lake' || entry.name === 'lake-packages') continue;
      getLeanFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.lean')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function parseMetadata(content: string, filePath: string): Record<string, unknown> | null {
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
    entries.set(id, { id, filePath, metadata });
  }
  return entries;
}

function parseStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function parseLeanDeclaration(line: string, sourceFile: string): LeanGraphNode | null {
  const declaration = line.match(LEAN_DECL_RE);
  if (!declaration) return null;
  return {
    matematikaId: declaration[1],
    leanId: declaration[2],
    kind: declaration[3],
    declaredDeps: parseStringArray(declaration[4]),
    proofIds: [],
    sourceFile,
  };
}

function extractProofBlock(
  lines: string[],
  startIndex: number,
  blockId: string,
  leanId: string,
  sourceFile: string,
): LeanProofBlock {
  let endLineIndex = startIndex;
  for (let index = startIndex + 1; index < lines.length; index++) {
    endLineIndex = index;
    const endMatch = lines[index].match(BLOCK_END_RE);
    if (endMatch?.[1] === blockId) break;
  }
  return {
    id: blockId,
    leanId,
    sourceFile,
    startLine: startIndex + 1,
    endLine: endLineIndex + 1,
    code: lines.slice(startIndex, endLineIndex + 1).join('\n'),
  };
}

export function extractLeanArtifacts(leanRoot: string, cwd = process.cwd()): { graph: LeanGraph; proofBlocks: ProofBlockRegistry } {
  const nodes: LeanGraphNode[] = [];
  const blocks: LeanProofBlock[] = [];

  for (const filePath of getLeanFiles(leanRoot)) {
    const relativeFile = path.relative(cwd, filePath);
    const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
    let currentNode: LeanGraphNode | null = null;

    for (let i = 0; i < lines.length; i++) {
      const declaration = parseLeanDeclaration(lines[i], relativeFile);
      if (declaration) {
        nodes.push(declaration);
        currentNode = declaration;
        continue;
      }

      const startMatch = lines[i].match(BLOCK_START_RE);
      if (!startMatch || !currentNode) continue;

      const block = extractProofBlock(lines, i, startMatch[1], currentNode.leanId, relativeFile);
      blocks.push(block);
      if (!currentNode.proofIds.includes(block.id)) {
        currentNode.proofIds.push(block.id);
      }
    }
  }

  const generatedAt = new Date().toISOString();
  return {
    graph: { generatedAt, nodes },
    proofBlocks: { generatedAt, blocks },
  };
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function compareLeanNodeToContent(
  node: LeanGraphNode,
  content: Map<string, ContentMetadataEntry>,
): LeanDiffIssue[] {
  const entry = content.get(node.matematikaId);
  if (!entry) {
    return [{
      code: 'missing-mdx',
      matematikaId: node.matematikaId,
      leanId: node.leanId,
      message: `Lean declaration ${node.leanId} points to missing MDX id ${node.matematikaId}.`,
    }];
  }

  const issues: LeanDiffIssue[] = [];
  if (entry.metadata.leanId !== node.leanId) {
    issues.push({
      code: 'lean-id-mismatch',
      matematikaId: node.matematikaId,
      leanId: node.leanId,
      message: `MDX ${node.matematikaId} must declare leanId "${node.leanId}".`,
    });
  }

  const declaredDeps = new Set(node.declaredDeps);
  const metadataDeps = ['requires', 'dependencias', 'lemmas'].flatMap(key => asStringArray(entry.metadata[key]));
  const unexpectedDeps = metadataDeps.filter(dep => !declaredDeps.has(dep));
  if (unexpectedDeps.length > 0) {
    issues.push({
      code: 'dependency-divergence',
      matematikaId: node.matematikaId,
      leanId: node.leanId,
      message: `MDX ${node.matematikaId} declares dependencies not exported by Lean: ${unexpectedDeps.join(', ')}.`,
    });
  }
  return issues;
}

function validateContentLeanId(entry: ContentMetadataEntry, leanIds: Set<string>): LeanDiffIssue | null {
  const leanId = typeof entry.metadata.leanId === 'string' ? entry.metadata.leanId : undefined;
  if (!leanId || leanIds.has(leanId)) return null;
  return {
    code: 'lean-id-mismatch',
    matematikaId: entry.id,
    leanId,
    message: `MDX ${entry.id} declares Lean id "${leanId}", but it is absent from lean_graph.json.`,
  };
}

function validateStepTacticMap(
  entry: ContentMetadataEntry,
  proofBlockMap: Map<string, LeanProofBlock>,
): LeanDiffIssue[] {
  const stepTacticMap = entry.metadata.stepTacticMap;
  if (!stepTacticMap || typeof stepTacticMap !== 'object' || Array.isArray(stepTacticMap)) return [];

  const leanId = typeof entry.metadata.leanId === 'string' ? entry.metadata.leanId : undefined;
  const issues: LeanDiffIssue[] = [];
  for (const [step, ids] of Object.entries(stepTacticMap as Record<string, unknown>)) {
    for (const blockId of asStringArray(ids)) {
      const block = proofBlockMap.get(blockId);
      if (block && (!leanId || block.leanId === leanId)) continue;
      issues.push({
        code: 'missing-proof-block',
        matematikaId: entry.id,
        leanId,
        message: `MDX ${entry.id} maps step ${step} to missing Lean proof block "${blockId}".`,
      });
    }
  }
  return issues;
}

export function compareLeanGraphToContent(
  leanGraph: LeanGraph,
  content: Map<string, ContentMetadataEntry>,
  proofBlocks: ProofBlockRegistry = { generatedAt: null, blocks: [] },
): LeanDiffIssue[] {
  const leanIds = new Set(leanGraph.nodes.map(node => node.leanId));
  const proofBlockMap = new Map(proofBlocks.blocks.map(block => [block.id, block]));
  const issues = leanGraph.nodes.flatMap(node => compareLeanNodeToContent(node, content));

  for (const entry of content.values()) {
    const leanIdIssue = validateContentLeanId(entry, leanIds);
    if (leanIdIssue) issues.push(leanIdIssue);
    issues.push(...validateStepTacticMap(entry, proofBlockMap));
  }

  return issues;
}

export function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}
