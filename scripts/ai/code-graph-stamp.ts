import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MEMORY_DIR = path.join(ROOT, '.codebase-memory');
const STAMP_PATH = path.join(MEMORY_DIR, 'stamp.json');

const SOURCE_TREE_PATHS = ['src', 'scripts', 'tests'] as const;

interface CodeGraphStamp {
  indexedAt: string;
  gitHead: string;
  sourceFingerprint: string;
  mode: 'fast' | 'full' | 'moderate';
  project?: string;
  nodes?: number;
  edges?: number;
  reindexRequested?: boolean;
}

function runGit(command: string): string {
  return execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function getGitHead(): string {
  return runGit('git rev-parse HEAD');
}

function getSourceFingerprint(): string {
  const parts = SOURCE_TREE_PATHS.map((treePath) => {
    try {
      return runGit(`git rev-parse HEAD:${treePath}`);
    } catch {
      return `${treePath}:missing`;
    }
  });
  return createHash('sha256').update(parts.join('\n')).digest('hex').slice(0, 16);
}

function readStamp(): CodeGraphStamp | null {
  if (!fs.existsSync(STAMP_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(STAMP_PATH, 'utf8')) as CodeGraphStamp;
  } catch {
    return null;
  }
}

function writeStamp(stamp: CodeGraphStamp): void {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
  fs.writeFileSync(STAMP_PATH, `${JSON.stringify(stamp, null, 2)}\n`);
}

function currentSnapshot(): Pick<CodeGraphStamp, 'gitHead' | 'sourceFingerprint'> {
  return {
    gitHead: getGitHead(),
    sourceFingerprint: getSourceFingerprint(),
  };
}

function isStale(stamp: CodeGraphStamp | null): boolean {
  if (!stamp) return true;
  if (stamp.reindexRequested) return true;
  const current = currentSnapshot();
  return (
    stamp.gitHead !== current.gitHead ||
    stamp.sourceFingerprint !== current.sourceFingerprint
  );
}

function printStatus(stamp: CodeGraphStamp | null, stale: boolean): void {
  const current = currentSnapshot();
  if (!stamp) {
    console.log('code-graph: no stamp found — reindex required');
    console.log(`  gitHead: ${current.gitHead}`);
    console.log(`  sourceFingerprint: ${current.sourceFingerprint}`);
    return;
  }

  console.log(`code-graph: ${stale ? 'STALE — reindex required' : 'fresh'}`);
  console.log(`  indexedAt: ${stamp.indexedAt}`);
  console.log(`  project: ${stamp.project ?? '(unknown)'}`);
  console.log(`  mode: ${stamp.mode}`);
  if (stamp.nodes != null && stamp.edges != null) {
    console.log(`  nodes: ${stamp.nodes}, edges: ${stamp.edges}`);
  }
  if (stamp.reindexRequested) {
    console.log('  reindexRequested: true');
  }
  if (stale) {
    if (stamp.gitHead !== current.gitHead) {
      console.log(`  gitHead: ${stamp.gitHead} → ${current.gitHead}`);
    }
    if (stamp.sourceFingerprint !== current.sourceFingerprint) {
      console.log(
        `  sourceFingerprint: ${stamp.sourceFingerprint} → ${current.sourceFingerprint}`,
      );
    }
  }
}

interface ParsedArgs {
  command: 'check' | 'request' | 'stamp';
  mode: CodeGraphStamp['mode'];
  project?: string;
  nodes?: number;
  edges?: number;
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const command = args.find((arg) => ['--check', '--stamp', '--request'].includes(arg));
  const readArg = (prefix: string): string | undefined =>
    args.find((arg) => arg.startsWith(`${prefix}=`))?.split('=').slice(1).join('=');
  const mode = (readArg('--mode') ?? 'full') as CodeGraphStamp['mode'];
  const nodesRaw = readArg('--nodes');
  const edgesRaw = readArg('--edges');
  const base = {
    mode,
    project: readArg('--project'),
    nodes: nodesRaw ? Number(nodesRaw) : undefined,
    edges: edgesRaw ? Number(edgesRaw) : undefined,
  };
  if (command === '--stamp') return { command: 'stamp', ...base };
  if (command === '--request') return { command: 'request', ...base };
  return { command: 'check', ...base };
}

function main(): void {
  const { command, mode, project, nodes, edges } = parseArgs();
  const stamp = readStamp();

  if (command === 'check') {
    const stale = isStale(stamp);
    printStatus(stamp, stale);
    process.exit(stale ? 1 : 0);
  }

  if (command === 'request') {
    const current = currentSnapshot();
    writeStamp({
      indexedAt: stamp?.indexedAt ?? new Date(0).toISOString(),
      gitHead: current.gitHead,
      sourceFingerprint: current.sourceFingerprint,
      mode: stamp?.mode ?? mode,
      project: stamp?.project,
      nodes: stamp?.nodes,
      edges: stamp?.edges,
      reindexRequested: true,
    });
    console.log('code-graph: reindex requested for next agent session');
    return;
  }

  const current = currentSnapshot();
  writeStamp({
    indexedAt: new Date().toISOString(),
    gitHead: current.gitHead,
    sourceFingerprint: current.sourceFingerprint,
    mode,
    project: project ?? stamp?.project,
    nodes: nodes ?? stamp?.nodes,
    edges: edges ?? stamp?.edges,
    reindexRequested: false,
  });
  console.log('code-graph: stamp updated');
}

main();
