import path from 'path';
import { pathToFileURL } from 'url';
import {
  compareLeanGraphToContent,
  loadContentMetadata,
  readJsonFile,
  type LeanGraph,
  type LogicalGraphStructure,
  type ProofBlockRegistry,
} from './lean-graph-utils.ts';

const CONTENT_DIR = path.resolve(process.cwd(), 'src/database/content');
const LEAN_GRAPH_PATH = path.resolve(process.cwd(), 'src/entities/graph/lean_graph.json');
const PROOF_BLOCKS_PATH = path.resolve(process.cwd(), 'src/entities/graph/proof_blocks.json');
const LOGICAL_GRAPH_PATH = path.resolve(process.cwd(), 'src/entities/graph/graph_structure.json');

const LEAN_ENABLED = process.env.ENABLE_LEAN === 'true';

export function validateLeanDiff() {
  if (!LEAN_ENABLED) {
    console.log('ℹ️ Validación Lean deshabilitada por ahora.');
    return [];
  }
  const leanGraph = readJsonFile<LeanGraph>(LEAN_GRAPH_PATH, { generatedAt: null, nodes: [] });
  const proofBlocks = readJsonFile<ProofBlockRegistry>(PROOF_BLOCKS_PATH, { generatedAt: null, blocks: [] });
  const logicalGraph = readJsonFile<LogicalGraphStructure>(LOGICAL_GRAPH_PATH, { nodes: {} });
  const content = loadContentMetadata(CONTENT_DIR);
  return compareLeanGraphToContent(leanGraph, content, proofBlocks, logicalGraph);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const issues = validateLeanDiff();
  if (issues.length > 0) {
    console.error(`\n[LEAN DIFF] ${issues.length} divergence(s) found:`);
    for (const issue of issues) {
      console.error(`- ${issue.code}: ${issue.message}`);
    }
    process.exit(1);
  }

  console.log('✅ Lean diff validation passed');
}
