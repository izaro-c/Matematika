import path from 'path';
import { pathToFileURL } from 'url';
import {
  readJsonFile,
  type VerificationStatus,
  type LeanGraph,
} from './lean-graph-utils.ts';

const LEAN_GRAPH_PATH = path.resolve('./src/entities/graph/lean_graph.json');
const CONTENT_COVERAGE_PATH = path.resolve('./src/entities/content/contentCoverage.json');
const BRIDGE_DEBT_PATH = path.resolve('./docs/lean/bridge-debt.json');

type BridgeTargetStatus = Exclude<VerificationStatus, 'none'>;
type BridgePriority = 'P0' | 'P1' | 'P2' | 'P3';

interface BridgeDebtEntry {
  matematikaId: string;
  leanId: string;
  targetStatus: BridgeTargetStatus;
  priority: BridgePriority;
  strategy: string;
  blockedBy: string[];
}

interface BridgeDebtManifest {
  version: number;
  policy: string;
  entries: BridgeDebtEntry[];
}

interface ContentCoverage {
  summary: {
    theoremLike: {
      total: number;
      leanLinked: number;
    };
    demonstrations: {
      total: number;
      leanLinked: number;
      withMappedProofSteps: number;
    };
  };
}

interface BridgePhaseIssue {
  code:
    | 'missing-coverage'
    | 'incomplete-theorem-coverage'
    | 'incomplete-demo-coverage'
    | 'incomplete-proof-step-map'
    | 'missing-bridge-debt'
    | 'stale-bridge-debt'
    | 'invalid-bridge-debt'
    | 'remaining-bridge';
  message: string;
}

interface ValidateBridgePhaseOptions {
  leanGraphPath?: string;
  contentCoveragePath?: string;
  bridgeDebtPath?: string;
  requireClosed?: boolean;
}

function hasCoverageShape(value: unknown): value is ContentCoverage {
  if (!value || typeof value !== 'object') return false;
  const summary = (value as { summary?: unknown }).summary;
  if (!summary || typeof summary !== 'object') return false;
  const theoremLike = (summary as { theoremLike?: unknown }).theoremLike;
  const demonstrations = (summary as { demonstrations?: unknown }).demonstrations;
  return Boolean(theoremLike && demonstrations);
}

function isValidDebtEntry(entry: BridgeDebtEntry): boolean {
  return typeof entry.matematikaId === 'string' &&
    typeof entry.leanId === 'string' &&
    ['human-proof', 'lean-checked', 'lean-audited'].includes(entry.targetStatus) &&
    ['P0', 'P1', 'P2', 'P3'].includes(entry.priority) &&
    typeof entry.strategy === 'string' &&
    entry.strategy.trim().length > 0 &&
    Array.isArray(entry.blockedBy) &&
    entry.blockedBy.every(item => typeof item === 'string');
}

function validateCoverage(coverage: ContentCoverage | null): BridgePhaseIssue[] {
  if (!coverage) {
    return [{
      code: 'missing-coverage',
      message: 'contentCoverage.json is missing or has an invalid shape. Run npm run content:coverage.',
    }];
  }

  const issues: BridgePhaseIssue[] = [];
  const { theoremLike, demonstrations } = coverage.summary;
  if (theoremLike.leanLinked !== theoremLike.total) {
    issues.push({
      code: 'incomplete-theorem-coverage',
      message: `Lean-linked theorem/lemma/corollary pages: ${theoremLike.leanLinked}/${theoremLike.total}.`,
    });
  }
  if (demonstrations.leanLinked !== demonstrations.total) {
    issues.push({
      code: 'incomplete-demo-coverage',
      message: `Lean-linked demonstrations: ${demonstrations.leanLinked}/${demonstrations.total}.`,
    });
  }
  if (demonstrations.withMappedProofSteps !== demonstrations.total) {
    issues.push({
      code: 'incomplete-proof-step-map',
      message: `Demonstrations with mapped Lean proof steps: ${demonstrations.withMappedProofSteps}/${demonstrations.total}.`,
    });
  }
  return issues;
}

function validateBridgeDebt(
  graph: LeanGraph,
  manifest: BridgeDebtManifest,
  requireClosed: boolean,
): BridgePhaseIssue[] {
  const issues: BridgePhaseIssue[] = [];
  const bridgeNodes = graph.nodes.filter(node => node.foundation === 'bridge');
  const bridgeIds = new Set(bridgeNodes.map(node => node.leanId));
  const debtByLeanId = new Map(manifest.entries.map(entry => [entry.leanId, entry]));

  for (const node of bridgeNodes) {
    const debt = debtByLeanId.get(node.leanId);
    if (!debt) {
      issues.push({
        code: 'missing-bridge-debt',
        message: `Bridge declaration ${node.leanId} (${node.matematikaId}) has no debt entry in bridge-debt.json.`,
      });
      continue;
    }
    if (debt.matematikaId !== node.matematikaId || !isValidDebtEntry(debt)) {
      issues.push({
        code: 'invalid-bridge-debt',
        message: `Bridge debt entry for ${node.leanId} is incomplete or points to the wrong Matematika id.`,
      });
    }
  }

  for (const entry of manifest.entries) {
    if (!bridgeIds.has(entry.leanId)) {
      issues.push({
        code: 'stale-bridge-debt',
        message: `Bridge debt entry ${entry.leanId} is stale; no current Lean bridge declaration uses it.`,
      });
    }
  }

  if (requireClosed && bridgeNodes.length > 0) {
    issues.push({
      code: 'remaining-bridge',
      message: `${bridgeNodes.length} bridge declaration(s) remain. Convert them to lean-checked before closing the bridge phase.`,
    });
  }

  return issues;
}

export function validateBridgePhase(options: ValidateBridgePhaseOptions = {}): BridgePhaseIssue[] {
  const leanGraphPath = options.leanGraphPath ?? LEAN_GRAPH_PATH;
  const contentCoveragePath = options.contentCoveragePath ?? CONTENT_COVERAGE_PATH;
  const bridgeDebtPath = options.bridgeDebtPath ?? BRIDGE_DEBT_PATH;
  const graph = readJsonFile<LeanGraph>(leanGraphPath, { generatedAt: null, nodes: [] });
  const rawCoverage = readJsonFile<unknown>(contentCoveragePath, null);
  const coverage = hasCoverageShape(rawCoverage) ? rawCoverage : null;
  const manifest = readJsonFile<BridgeDebtManifest>(bridgeDebtPath, {
    version: 1,
    policy: '',
    entries: [],
  });

  return [
    ...validateCoverage(coverage),
    ...validateBridgeDebt(graph, manifest, options.requireClosed === true),
  ];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const requireClosed = process.argv.includes('--closed');
  const issues = validateBridgePhase({ requireClosed });

  if (issues.length > 0) {
    console.error(`\n[BRIDGE PHASE] ${issues.length} issue(s) found:`);
    for (const issue of issues) {
      console.error(`- ${issue.code}: ${issue.message}`);
    }
    process.exit(1);
  }

  console.log(requireClosed
    ? '✅ Bridge phase is closed: no bridge declarations remain'
    : '✅ Bridge phase audit passed: coverage is complete and bridge debt is explicit');
}
