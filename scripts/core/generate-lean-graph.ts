import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { spawnSync } from 'child_process';
import { extractLeanArtifacts, validateLeanDeclarationNames } from './lean-graph-utils.ts';

const LEAN_ROOT = path.resolve(process.cwd(), 'lean');
const GRAPH_OUTPUT = path.resolve(process.cwd(), 'src/entities/graph/lean_graph.json');
const PROOF_BLOCKS_OUTPUT = path.resolve(process.cwd(), 'src/entities/graph/proof_blocks.json');
const LEAN_QUERY = path.resolve(process.cwd(), 'scripts/lean/lean-query.lean');

interface LeanQueryResult {
  module: string;
  declarations: string[];
}

function queryLeanEnvironment(): LeanQueryResult {
  // eslint-disable-next-line sonarjs/no-os-command-from-path -- Lake is the Lean project's configured toolchain command.
  const result = spawnSync('lake', ['env', 'lean', LEAN_QUERY], {
    cwd: LEAN_ROOT,
    encoding: 'utf-8',
  });
  const output = result.stdout ?? '';
  if (result.status !== 0 && output.trim().length === 0) {
    const message = result.stderr || result.error?.message || 'lake env lean failed without output';
    throw new Error(message);
  }
  const jsonLine = output
    .trim()
    .split('\n')
    .find(line => line.trim().startsWith('{'));

  if (!jsonLine) {
    throw new Error('lean-query.lean no produjo la consulta JSON esperada.');
  }

  const query = JSON.parse(jsonLine) as LeanQueryResult;
  if (!Array.isArray(query.declarations)) {
    throw new Error('lean-query.lean produjo una lista de declaraciones invalida.');
  }

  return query;
}

export function generateLeanGraph() {
  const artifacts = extractLeanArtifacts(LEAN_ROOT);
  const query = queryLeanEnvironment();
  const missingDeclarations = validateLeanDeclarationNames(
    artifacts.graph.nodes,
    new Set(query.declarations),
  );

  if (missingDeclarations.length > 0) {
    throw new Error(
      `Los leanId anotados no existen en el entorno compilado: ${missingDeclarations.join(', ')}`,
    );
  }

  fs.mkdirSync(path.dirname(GRAPH_OUTPUT), { recursive: true });
  fs.writeFileSync(GRAPH_OUTPUT, JSON.stringify(artifacts.graph, null, 2), 'utf-8');
  fs.writeFileSync(PROOF_BLOCKS_OUTPUT, JSON.stringify(artifacts.proofBlocks, null, 2), 'utf-8');
  return { ...artifacts, environmentModule: query.module };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const artifacts = generateLeanGraph();
  console.log(`✅ Generated Lean graph: ${artifacts.graph.nodes.length} nodes verified in ${artifacts.environmentModule}`);
  console.log(`✅ Generated proof blocks: ${artifacts.proofBlocks.blocks.length} blocks`);
}
