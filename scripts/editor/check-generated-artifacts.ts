import { spawnSync } from 'node:child_process';

interface GateCommand {
  label: string;
  command: string;
  args: string[];
}

const generatedPaths = [
  'ai/indexes',
  'ai/reports/debt-report.md',
  'src/entities/content/contentCoverage.json',
  'src/entities/content/contentIndex.json',
  'src/entities/content/diagramUsageIndex.json',
  'src/entities/graph/lean_graph.json',
  'src/entities/graph/proof_blocks.json',
];

const commands: GateCommand[] = [
  { label: 'content index', command: 'npm', args: ['run', 'generate-index'] },
  { label: 'content coverage', command: 'npm', args: ['run', 'content:coverage'] },
  { label: 'diagram usage index', command: 'npm', args: ['run', 'diagram-usages:index'] },
  { label: 'AI indexes', command: 'npm', args: ['run', 'ai:index'] },
  { label: 'AI debt report', command: 'npm', args: ['run', 'ai:debt'] },
];

function run(command: GateCommand): void {
  console.log(`[generated] ${command.label}: ${command.command} ${command.args.join(' ')}`);
  const result = spawnSync(command.command, command.args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

for (const command of commands) run(command);

const diff = spawnSync('git', ['diff', '--name-only', '--', ...generatedPaths], {
  encoding: 'utf8',
});

if (diff.status !== 0) {
  process.stderr.write(diff.stderr);
  process.exit(diff.status ?? 1);
}

const changed = diff.stdout.trim().split('\n').filter(Boolean);
if (changed.length > 0) {
  console.error('[generated] Generated artifacts are out of date:');
  for (const file of changed) console.error(`- ${file}`);
  console.error('[generated] Regenerate with the official commands, review the diff, and commit the artifacts.');
  process.exit(1);
}

console.log('[generated] All checked generated artifacts are up to date.');
