import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { extractLeanArtifacts } from './lean-graph-utils.ts';

const LEAN_ROOT = path.resolve(process.cwd(), 'lean');
const GRAPH_OUTPUT = path.resolve(process.cwd(), 'src/entities/graph/lean_graph.json');
const PROOF_BLOCKS_OUTPUT = path.resolve(process.cwd(), 'src/entities/graph/proof_blocks.json');

export function generateLeanGraph() {
  const artifacts = extractLeanArtifacts(LEAN_ROOT);
  fs.mkdirSync(path.dirname(GRAPH_OUTPUT), { recursive: true });
  fs.writeFileSync(GRAPH_OUTPUT, JSON.stringify(artifacts.graph, null, 2), 'utf-8');
  fs.writeFileSync(PROOF_BLOCKS_OUTPUT, JSON.stringify(artifacts.proofBlocks, null, 2), 'utf-8');
  return artifacts;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const artifacts = generateLeanGraph();
  console.log(`✅ Generated Lean graph: ${artifacts.graph.nodes.length} nodes`);
  console.log(`✅ Generated proof blocks: ${artifacts.proofBlocks.blocks.length} blocks`);
}
