import fs from 'fs';
import path from 'path';

export type VerificationStatus = 'none' | 'human-proof' | 'lean-checked' | 'lean-audited';
export type Foundation = 'matematika-axioms' | 'bridge' | 'pending';

export interface LeanGraphNode {
  leanId: string;
  matematikaId: string;
  kind: string;
  verificationStatus: VerificationStatus;
  foundation: Foundation;
  declaredDeps: string[];
  proofIds: string[];
  sourceFile?: string;
}

export function validateLeanDeclarationNames(
  nodes: LeanGraphNode[],
  declarationNames: ReadonlySet<string>,
): string[] {
  return nodes
    .filter(node => !declarationNames.has(node.leanId))
    .map(node => node.leanId);
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

export interface LogicalGraphNode {
  directDependencies: string[];
  proofs: { id: string; dependencies: string[] }[];
}

export interface LogicalGraphStructure {
  nodes: Record<string, LogicalGraphNode>;
}

export interface ProofBlockRegistry {
  generatedAt: string | null;
  blocks: LeanProofBlock[];
}

export interface ContentMetadataEntry {
  id: string;
  filePath: string;
  metadata: Record<string, unknown>;
  content?: string;
}

export interface LeanDiffIssue {
  code:
    | 'missing-mdx'
    | 'lean-id-mismatch'
    | 'missing-proof-block'
    | 'dependency-divergence'
    | 'missing-source'
    | 'missing-axiom-system'
    | 'mixed-statement-formula'
    | 'missing-step-tactic-binding';
  matematikaId: string;
  leanId?: string;
  message: string;
}


const BLOCK_START_RE = /--\s*@tactic-block-start\s+"([^"]+)"/;
const BLOCK_END_RE = /--\s*@tactic-block-end\s+"([^"]+)"/;
const VERIFICATION_STATUSES = new Set<VerificationStatus>(['none', 'human-proof', 'lean-checked', 'lean-audited']);
const FOUNDATIONS = new Set<Foundation>(['matematika-axioms', 'bridge', 'pending']);

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
    entries.set(id, { id, filePath, metadata, content });
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
  if (!line.startsWith('--') || !line.includes('@matematika-id')) return null;

  const matId = line.match(/@matematika-id\s+"([^"]+)"/)?.[1];
  const leanId = line.match(/@lean-id\s+"([^"]+)"/)?.[1];
  const kind = line.match(/@kind\s+"([^"]+)"/)?.[1];
  const verStat = line.match(/@verificationStatus\s+"([^"]+)"/)?.[1] as VerificationStatus | undefined;
  const found = line.match(/@foundation\s+"([^"]+)"/)?.[1] as Foundation | undefined;
  const depsStr = line.match(/@deps\s+(\[[^\]]*\])/)?.[1];

  if (!matId || !leanId || !kind || !verStat || !found || !depsStr) return null;
  if (!VERIFICATION_STATUSES.has(verStat) || !FOUNDATIONS.has(found)) return null;

  return {
    matematikaId: matId,
    leanId: leanId,
    kind: kind,
    verificationStatus: verStat,
    foundation: found,
    declaredDeps: parseStringArray(depsStr),
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

function validateLogicalDependencies(
  node: LeanGraphNode,
  logicalGraph: LogicalGraphStructure | undefined,
): LeanDiffIssue[] {
  if (node.kind === 'axiom' || !logicalGraph) return [];

  const logicalNode = logicalGraph.nodes[node.matematikaId];
  if (!logicalNode) return [];

  const requiredDependencies = new Set([
    ...logicalNode.directDependencies,
    ...logicalNode.proofs.flatMap(proof => proof.dependencies),
  ]);
  const declaredDependencies = new Set(node.declaredDeps);
  const missingDependencies = [...requiredDependencies].filter(dep => !declaredDependencies.has(dep));
  if (missingDependencies.length === 0) return [];

  return [{
    code: 'dependency-divergence',
    matematikaId: node.matematikaId,
    leanId: node.leanId,
    message: `Lean declaration ${node.leanId} omits MDX logical dependencies: ${missingDependencies.join(', ')}.`,
  }];
}

function hasSources(metadata: Record<string, unknown>): boolean {
  const sources = metadata.sources;
  return Array.isArray(sources) && sources.some(source =>
    typeof source === 'object' && source !== null && typeof (source as Record<string, unknown>).title === 'string',
  );
}

function hasMixedInitialStatementFormula(entry: ContentMetadataEntry): boolean {
  if (!entry.content || !['teorema', 'lema', 'corolario', 'demostracion'].includes(String(entry.metadata.type))) {
    return false;
  }

  const initialFormula = entry.content.match(/<Formula(?:\s[^>]*)?>\s*\$\$([\s\S]*?)\$\$/);
  return initialFormula !== null && /\\text\{(?:Sean|tales que|Entonces)/.test(initialFormula[1]);
}

function contentIssue(
  entry: ContentMetadataEntry,
  leanId: string,
  code: LeanDiffIssue['code'],
  message: string,
): LeanDiffIssue {
  return { code, matematikaId: entry.id, leanId, message };
}

function validateProofStepBindings(entry: ContentMetadataEntry, leanId: string): LeanDiffIssue[] {
  const stepTacticMap = entry.metadata.stepTacticMap;
  if (entry.metadata.type !== 'demostracion' || !stepTacticMap || typeof stepTacticMap !== 'object' || Array.isArray(stepTacticMap)) {
    return [];
  }

  const taggedSteps = new Map(
    [...(entry.content ?? '').matchAll(/<ProofStep\b([^>]*)>/g)]
      .map(tag => [tag[1].match(/\bnumber=\{(\d+)\}/)?.[1], tag[0]] as const)
      .filter((step): step is readonly [string, string] => step[0] !== undefined),
  );

  return Object.keys(stepTacticMap as Record<string, unknown>).flatMap(step => {
    const expectedBinding = `leanBlocks={metadata.stepTacticMap["${step}"]}`;
    if (taggedSteps.get(step)?.includes(expectedBinding)) return [];
    return [contentIssue(
      entry,
      leanId,
      'missing-step-tactic-binding',
      `MDX ${entry.id} maps step ${step} to Lean blocks but does not pass them to ProofStep.`,
    )];
  });
}

function validateLeanContentEntry(entry: ContentMetadataEntry): LeanDiffIssue[] {
  const leanId = typeof entry.metadata.leanId === 'string' ? entry.metadata.leanId : undefined;
  if (!leanId) return [];

  const issues: LeanDiffIssue[] = [];
  if (!hasSources(entry.metadata)) {
    issues.push(contentIssue(entry, leanId, 'missing-source', `MDX ${entry.id} links Lean but does not declare a mathematical source.`));
  }
  if (entry.metadata.type === 'axioma' && typeof entry.metadata.axiomSystem !== 'string') {
    issues.push(contentIssue(entry, leanId, 'missing-axiom-system', `Lean-linked axiom ${entry.id} must declare axiomSystem.`));
  }
  if (hasMixedInitialStatementFormula(entry)) {
    issues.push(contentIssue(entry, leanId, 'mixed-statement-formula', `MDX ${entry.id} must keep hypotheses outside its initial Formula block.`));
  }
  return [...issues, ...validateProofStepBindings(entry, leanId)];
}

function validateLeanContentQuality(content: Map<string, ContentMetadataEntry>): LeanDiffIssue[] {
  return [...content.values()].flatMap(validateLeanContentEntry);
}

export function compareLeanGraphToContent(
  leanGraph: LeanGraph,
  content: Map<string, ContentMetadataEntry>,
  proofBlocks: ProofBlockRegistry = { generatedAt: null, blocks: [] },
  logicalGraph?: LogicalGraphStructure,
): LeanDiffIssue[] {
  const leanIds = new Set(leanGraph.nodes.map(node => node.leanId));
  const proofBlockMap = new Map(proofBlocks.blocks.map(block => [block.id, block]));
  const issues = leanGraph.nodes.flatMap(node => [
    ...compareLeanNodeToContent(node, content),
    ...validateLogicalDependencies(node, logicalGraph),
  ]);

  for (const entry of content.values()) {
    const leanIdIssue = validateContentLeanId(entry, leanIds);
    if (leanIdIssue) issues.push(leanIdIssue);
    issues.push(...validateStepTacticMap(entry, proofBlockMap));
  }

  issues.push(...validateLeanContentQuality(content));

  return issues;
}

export function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}
