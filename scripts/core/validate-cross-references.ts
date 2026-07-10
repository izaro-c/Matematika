import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('./src/database/content');
const INDEX_PATH = path.resolve('./src/entities/content/contentIndex.json');
let errors = 0;

interface ContentIndex {
  id: string;
  type: string;
  filePath: string;
}

const allContent: Map<string, ContentIndex> = new Map();

function parseMetadata(content: string, filePath: string) {
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  if (!match) return null;
  try {
    // eslint-disable-next-line sonarjs/code-eval -- internal script, trusted MDX content
    const fn = new Function(`return ${match[1]}`);
    return fn();
  } catch {
    console.error(`[ERROR] Sintaxis inválida en metadatos: ${filePath}`);
    errors++;
    return null;
  }
}

function extractTargetIds(content: string, tag: string, attr: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`, 'g');
  const ids = new Set<string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return Array.from(ids);
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

function error(msg: string) {
  console.error(`  [ERROR] ${msg}`);
  errors++;
}

// Build mathematician slug lookup for fuzzy author matching
const mathematicianSlugs = new Set<string>();
const mathematicianDir = path.join(CONTENT_DIR, 'mathematicians');
if (fs.existsSync(mathematicianDir)) {
  for (const entry of fs.readdirSync(mathematicianDir)) {
    if (entry.endsWith('.mdx')) {
      mathematicianSlugs.add(path.basename(entry, '.mdx').toLowerCase());
    }
  }
}

function findMathematician(authorName: string): string | null {
  const normalized = authorName.toLowerCase().trim();
  // 1. Exact match (lowercase)
  if (mathematicianSlugs.has(normalized)) return normalized;

  // 2. Check each word of author name against slugs
  const words = normalized.split(/\s+/);
  for (const word of words) {
    if (mathematicianSlugs.has(word)) return word;
  }

  // 3. Check if any slug is contained within the full name
  for (const slug of mathematicianSlugs) {
    if (normalized.includes(slug)) return slug;
  }

  // 4. Remove diacritics and try again
  const noAccent = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (mathematicianSlugs.has(noAccent)) return noAccent;
  const noAccentWords = noAccent.split(/\s+/);
  for (const word of noAccentWords) {
    if (mathematicianSlugs.has(word)) return word;
  }

  return null;
}

const allFiles = getMdxFiles(CONTENT_DIR);

// Pass 1: Build content index
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const meta = parseMetadata(content, file);
  if (!meta) continue;

  const id = meta.id || path.basename(file, '.mdx');
  allContent.set(id, { id, type: meta.type || 'unknown', filePath: file });

  // Also index by slug for files that just have export const metadata = { ... } without explicit id
  const slug = path.basename(file, '.mdx');
  if (!allContent.has(slug)) {
    allContent.set(slug, { id: slug, type: meta.type || 'unknown', filePath: file });
  }
}

console.log(`\n📋 Index: ${allContent.size} contenidos indexados de ${allFiles.length} archivos\n`);

// Pass 2: Validate references
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const meta = parseMetadata(content, file);
  if (!meta) continue;

  const relPath = path.relative(CONTENT_DIR, file);

  const checkId = (field: string, refId: string) => {
    if (field === 'requiredNodes' && refId.startsWith('checkpoint-')) {
      return; // Checkpoints lógicos autogestionados
    }
    if (!allContent.has(refId)) {
      error(`${relPath}: '${field}' apunta a '${refId}' que no existe`);
    }
  };

  const checkIds = (field: string, refs: string[] | undefined) => {
    if (!refs) return;
    for (const refId of refs) {
      checkId(field, refId);
    }
  };

  // 1. links → any existing content
  checkIds('links', meta.links);

  // 2. parentTheorem → existing theorem/demo
  if (meta.parentTheorem) {
    checkId('parentTheorem', meta.parentTheorem);
  }

  // 3. relatedTheorem (examples, exercises) → existing content
  if (meta.relatedTheorem) {
    checkId('relatedTheorem', meta.relatedTheorem);
  }

  // 4. concept (usecases) → existing theorem/concept
  if (meta.concept) {
    checkId('concept', meta.concept);
  }

  // 5. authors → existing mathematician biographies (fuzzy match by name)
  if (meta.authors) {
    for (const author of meta.authors) {
      const match = findMathematician(author);
      if (!match) {
        error(`${relPath}: 'authors' apunta a '${author}' pero no existe biografía en mathematicians/`);
      }
    }
  }

  // 6. demos → existing demonstrations
  if (meta.demos) {
    for (const demoId of meta.demos) {
      if (!allContent.has(demoId)) {
        // Check demonstrations directory as fallback
        const demoFile = path.join(CONTENT_DIR, 'demonstrations', `${demoId}.mdx`);
        if (!fs.existsSync(demoFile)) {
          error(`${relPath}: 'demos' apunta a '${demoId}' que no existe en demonstrations/`);
        }
      }
    }
  }

  // 7. corollaries → existing theorems
  checkIds('corollaries', meta.corollaries);

  // 8. examples → existing examples
  checkIds('examples', meta.examples);

  // 9. exercises → existing exercises
  checkIds('exercises', meta.exercises);

  // 9b. seeAlso → existing content (non-graph references)
  checkIds('seeAlso', meta.seeAlso);

  // 10. requires → existing content
  checkIds('requires', meta.requires);

  // 11. lemmas → existing lemmas
  checkIds('lemmas', meta.lemmas);

  // 12. usedBy (definitions) → existing content
  checkIds('usedBy', meta.usedBy);

  // 13. axiomas (models) → existing axioms
  if (meta.axiomas) {
    for (const axiomId of meta.axiomas) {
      const axiomFile = path.join(CONTENT_DIR, 'axioms', `${axiomId}.mdx`);
      if (!fs.existsSync(axiomFile) && !allContent.has(axiomId)) {
        error(`${relPath}: 'axiomas' apunta a '${axiomId}' que no existe en axioms/`);
      }
    }
  }

  // 14. requiredNodes (study plans) → existing content
  checkIds('requiredNodes', meta.requiredNodes);

  // 15. <ConceptLink targetId=""> → existing content
  const conceptLinkTargets = extractTargetIds(content, 'ConceptLink', 'targetId');
  for (const targetId of conceptLinkTargets) {
    if (!allContent.has(targetId)) {
      console.warn(`  [WARN] ${relPath}: <ConceptLink targetId="${targetId}"> apunta a ID inexistente (Generará página 'En construcción')`);
    }
  }

  // 16. <InteractiveElement target=""> — allow diagram element names, validated elsewhere
}

if (errors === 0) {
  console.log(`✅ Validación de referencias cruzadas superada. ${allFiles.length} archivos, ${allContent.size} IDs únicos.`);
} else {
  console.error(`\n❌ ${errors} error(es) de referencia encontrados. Revisa los mensajes anteriores.\n`);
  process.exit(1);
}
