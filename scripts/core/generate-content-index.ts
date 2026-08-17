import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const CONTENT_DIR = path.resolve('./content/mdx');
const OUTPUT_PATH = path.resolve('./src/data/content/contentIndex.json');
const LEAN_GRAPH_PATH = path.resolve('./src/data/graph/lean_graph.json');

export interface ContentEntry {
  id: string;
  slug: string;
  lang: string;
  filePath: string;
  contentType: string;
  availableLangs?: string[];
  metadata: Record<string, unknown>;
}

interface LeanGraph {
  nodes?: { leanId: string; matematikaId: string; status?: string }[];
}

function parseMetadata(content: string, filePath: string): Record<string, unknown> | null {
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  if (!match) {
    console.warn(`  [WARN] No metadata export found: ${filePath}`);
    return null;
  }
  try {
    // eslint-disable-next-line sonarjs/code-eval -- internal script, trusted MDX content
    const fn = new Function(`return ${match[1]}`);
    return fn();
  } catch {
    console.warn(`  [WARN] Invalid metadata syntax: ${filePath}`);
    return null;
  }
}

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(full));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(full);
    }
  }
  return files;
}

export function getLeanNodeStatus(leanGraphPath = LEAN_GRAPH_PATH): Map<string, string> {
  if (!fs.existsSync(leanGraphPath)) return new Map();
  try {
    const graph = JSON.parse(fs.readFileSync(leanGraphPath, 'utf-8')) as LeanGraph;
    return new Map((graph.nodes ?? []).map(node => [node.leanId, node.verificationStatus ?? 'human-proof']));
  } catch {
    console.warn(`  [WARN] Invalid Lean graph JSON: ${leanGraphPath}`);
    return new Map();
  }
}

const contentTypes: Record<string, string> = {
  mathematicians: 'matematico',
  theorems: 'teorema',
  methods: 'metodo',
  demonstrations: 'demostracion',
  definitions: 'definicion',
  examples: 'ejemplo',
  exercises: 'ejercicio',
  usecases: 'caso-de-uso',
  plans: 'plan-de-estudio',
  axioms: 'axioma',
  models: 'modelo',
  'axiomatic-systems': 'sistema-axiomatico',
};

interface GenerateContentIndexOptions {
  contentDir?: string;
  outputPath?: string;
  leanGraphPath?: string;
}

export function generateContentIndex(options: GenerateContentIndexOptions = {}): Record<string, ContentEntry> {
  const contentDir = options.contentDir ?? CONTENT_DIR;
  const outputPath = options.outputPath ?? OUTPUT_PATH;
  const leanGraphPath = options.leanGraphPath ?? LEAN_GRAPH_PATH;
  const allFiles = getMdxFiles(contentDir);
  const leanNodeStatus = getLeanNodeStatus(leanGraphPath);

  const availableLangsById: Record<string, string[]> = {};
  const rawEntries: ContentEntry[] = [];
  const index: Record<string, ContentEntry> = {};

  // First pass: collect entries and identify available languages per ID
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const meta = parseMetadata(content, file);
    if (!meta) continue;

    const relPath = path.relative(contentDir, file);
    const pathParts = relPath.split(path.sep);

    let lang = 'es';
    let dirName = pathParts[0];

    if (pathParts.length > 2 && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathParts[0])) {
      lang = pathParts[0];
      dirName = pathParts[1];
    } else if (meta.lang && typeof meta.lang === 'string') {
      lang = meta.lang;
    }

    meta.lang = lang;

    const contentType = contentTypes[dirName] || (meta.type as string) || 'unknown';
    const slug = path.basename(file, '.mdx').toLowerCase();
    const id = (meta.id as string) || slug;

    if (typeof meta.leanId === 'string') {
      const status = leanNodeStatus.get(meta.leanId);
      meta.leanVerified = status !== undefined;
      meta.verificationStatus = status ?? 'human-proof';
    }

    if (!availableLangsById[id]) {
      availableLangsById[id] = [];
    }
    if (!availableLangsById[id].includes(lang)) {
      availableLangsById[id].push(lang);
    }

    rawEntries.push({
      id,
      slug,
      lang,
      filePath: relPath,
      contentType,
      metadata: meta,
    });
  }

  // Second pass: assign availableLangs and index by id, slug, and lang
  for (const entry of rawEntries) {
    entry.availableLangs = availableLangsById[entry.id] || [entry.lang];
    entry.metadata.availableLangs = entry.availableLangs;

    // Index by lang-qualified keys
    index[`${entry.lang}:${entry.id}`] = entry;
    index[`${entry.lang}:${entry.slug}`] = entry;

    // Default lookup by id and slug (prefer 'es' or first occurrence)
    if (!index[entry.id] || entry.lang === 'es') {
      index[entry.id] = entry;
    }
    if (entry.slug !== entry.id && (!index[entry.slug] || entry.lang === 'es')) {
      index[entry.slug] = entry;
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf-8');
  return index;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const index = generateContentIndex();
  console.log(`✅ Generated content index: ${Object.keys(index).length} entries from ${getMdxFiles(CONTENT_DIR).length} files`);
}
