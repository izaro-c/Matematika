import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const CONTENT_DIR = path.resolve('./src/database/content');
const OUTPUT_PATH = path.resolve('./src/entities/content/contentIndex.json');
const LEAN_GRAPH_PATH = path.resolve('./src/entities/graph/lean_graph.json');

interface ContentEntry {
  id: string;
  slug: string;
  filePath: string;
  contentType: string;
  metadata: Record<string, unknown>;
}

interface LeanGraph {
  nodes?: { leanId: string; matematikaId: string }[];
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

export function getVerifiedLeanIds(leanGraphPath = LEAN_GRAPH_PATH): Set<string> {
  if (!fs.existsSync(leanGraphPath)) return new Set();
  try {
    const graph = JSON.parse(fs.readFileSync(leanGraphPath, 'utf-8')) as LeanGraph;
    return new Set((graph.nodes ?? []).map(node => node.leanId));
  } catch {
    console.warn(`  [WARN] Invalid Lean graph JSON: ${leanGraphPath}`);
    return new Set();
  }
}

const contentTypes: Record<string, string> = {
  mathematicians: 'matematico',
  theorems: 'teorema',
  lessons: 'leccion',
  demonstrations: 'demostracion',
  definitions: 'definicion',
  examples: 'ejemplo',
  exercises: 'ejercicio',
  usecases: 'caso_de_uso',
  plans: 'plan_de_estudio',
  axioms: 'axioma',
  models: 'modelo',
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
  const index: Record<string, ContentEntry> = {};
  const verifiedLeanIds = getVerifiedLeanIds(leanGraphPath);

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const meta = parseMetadata(content, file);
    if (!meta) continue;

    const relPath = path.relative(contentDir, file);
    const dirName = path.dirname(relPath).split(path.sep)[0];
    const contentType = contentTypes[dirName] || meta.type as string || 'unknown';
    const slug = path.basename(file, '.mdx').toLowerCase();
    const id = (meta.id as string) || slug;
    if (typeof meta.leanId === 'string') {
      meta.leanVerified = verifiedLeanIds.has(meta.leanId);
    }

    const entry: ContentEntry = {
      id,
      slug,
      filePath: relPath,
      contentType,
      metadata: meta,
    };

    index[id] = entry;

    // Also index by slug if different from id
    if (slug !== id && !index[slug]) {
      index[slug] = entry;
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
