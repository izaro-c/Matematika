import fs from 'fs';
import path from 'path';

function parseMetadata(content: string) {
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  if (match) {
    try {
      const fn = new Function(`return ${match[1]}`);
      return fn();
    } catch (e) {
      return null;
    }
  }
  return null;
}

function stringifyMetadata(metadata: any) {
  return JSON.stringify(metadata, null, 2);
}

function updateFileMetadata(filePath: string, updater: (meta: any) => void) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const metadata = parseMetadata(content);
  if (!metadata) return;

  updater(metadata);

  const newMetaStr = stringifyMetadata(metadata);
  const newContent = content.replace(metadataRegex, `export const metadata = ${newMetaStr};`);
  fs.writeFileSync(filePath, newContent, 'utf-8');
}

function getMdxFiles(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getMdxFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.mdx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const contentDir = path.resolve(process.cwd(), 'src/content');
const files = getMdxFiles(contentDir);

const parents: Record<string, string> = {};
const related: Record<string, string> = {};

// Pass 1: Determinar relaciones
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const metadata = parseMetadata(content);
  if (!metadata) return;

  const slug = path.basename(file, '.mdx');
  const id = metadata.id || slug;

  const type = metadata.type || '';
  const isTheoremLike = file.includes('/theorems/') || file.includes('/definitions/');

  if (isTheoremLike) {
    (metadata.demos || []).forEach((d: string) => parents[d] = id);
    (metadata.demostraciones || []).forEach((d: string) => parents[d] = id);
    (metadata.lemmas || []).forEach((l: string) => parents[l] = id);
    (metadata.corollaries || []).forEach((c: string) => parents[c] = id);
    (metadata.examples || []).forEach((e: string) => related[e] = id);
    (metadata.exercises || []).forEach((e: string) => related[e] = id);
  }
});

// Pass 2: Actualizar archivos
let updatedCount = 0;
files.forEach(file => {
  updateFileMetadata(file, (meta) => {
    const slug = path.basename(file, '.mdx');
    const id = meta.id || slug;

    // Set type based on folder
    if (file.includes('/axioms/')) meta.type = 'axioma';
    else if (file.includes('/definitions/')) meta.type = 'definicion';
    else if (file.includes('/demonstrations/')) meta.type = 'demostracion';
    else if (file.includes('/examples/')) meta.type = 'ejemplo';
    else if (file.includes('/exercises/')) meta.type = 'ejercicio';
    else if (file.includes('/lessons/')) meta.type = 'leccion';
    else if (file.includes('/mathematicians/')) meta.type = 'matematico';
    else if (file.includes('/models/')) meta.type = 'modelo';
    else if (file.includes('/plans/')) meta.type = 'plan_de_estudio';
    else if (file.includes('/usecases/')) meta.type = 'caso_de_uso';
    else if (file.includes('/theorems/')) {
      if (slug.startsWith('lema') || id.startsWith('lema')) meta.type = 'lema';
      else if (slug.startsWith('corolario') || id.startsWith('corolario')) meta.type = 'corolario';
      else meta.type = 'teorema';
    }

    // Set parentTheorem and relatedTheorem
    if (parents[id]) {
      meta.parentTheorem = parents[id];
    }
    if (related[id]) {
      meta.relatedTheorem = related[id];
    }

    // Remove old properties if needed
    if (meta.type === 'demostracion' && !meta.proofMethod) {
      // Just keep it or default to something
    }
    
    updatedCount++;
  });
});

console.log(`Metadatos actualizados en ${updatedCount} archivos.`);
