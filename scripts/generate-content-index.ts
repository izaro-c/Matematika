import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('./src/content');
const OUTPUT_PATH = path.resolve('./src/store/contentIndex.json');

interface ContentEntry {
  id: string;
  slug: string;
  filePath: string;
  contentType: string;
  metadata: Record<string, unknown>;
}

function parseMetadata(content: string, filePath: string): Record<string, unknown> | null {
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  if (!match) {
    console.warn(`  [WARN] No metadata export found: ${filePath}`);
    return null;
  }
  try {
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

const allFiles = getMdxFiles(CONTENT_DIR);
const index: Record<string, ContentEntry> = {};

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const meta = parseMetadata(content, file);
  if (!meta) continue;

  const relPath = path.relative(CONTENT_DIR, file);
  const dirName = path.dirname(relPath).split(path.sep)[0];
  const contentType = contentTypes[dirName] || meta.type as string || 'unknown';
  const slug = path.basename(file, '.mdx').toLowerCase();
  const id = (meta.id as string) || slug;

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

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), 'utf-8');

console.log(`✅ Generated content index: ${Object.keys(index).length} entries from ${allFiles.length} files`);
