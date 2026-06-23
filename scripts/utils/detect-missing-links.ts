import fs from 'fs';
import path from 'path';

const INDEX_PATH = path.resolve('./src/store/contentIndex.json');
const CONTENT_DIR = path.resolve('./src/database/content');

if (!fs.existsSync(INDEX_PATH)) {
  console.error("No se encuentra contentIndex.json. Ejecuta 'npm run generate-index' primero.");
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
const terms = new Map<string, string>(); // name/title -> id

// Palabras muy comunes que ignoramos para evitar falsos positivos
const IGNORE_TERMS = new Set([
  'punto', 'puntos', 'recta', 'rectas', 'plano', 'planos',
  'espacio', 'incidencia', 'orden', 'congruencia', 'modelo',
  'sistema', 'matemática', 'demostración', 'axioma', 'lema',
  'teorema', 'corolario', 'definición', 'geometría', 'teoría',
  'conjunto', 'elemento', 'elementos', 'relación', 'ángulo'
]);

// Recopilamos todos los términos enlazables
Object.values(index).forEach((entry: any) => {
  if (entry.metadata?.title) {
    const title = entry.metadata.title.toLowerCase().replace(/[^\wáéíóúüñ\s-]/g, '').trim();
    if (title.length > 4 && !IGNORE_TERMS.has(title)) {
      terms.set(title, entry.id);
    }
  }
  if (entry.metadata?.name) {
    const name = entry.metadata.name.toLowerCase().replace(/[^\wáéíóúüñ\s-]/g, '').trim();
    if (name.length > 4 && !IGNORE_TERMS.has(name)) {
      terms.set(name, entry.id);
    }
  }
});

// Leemos todos los archivos MDX
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

const allFiles = getMdxFiles(CONTENT_DIR);
let totalMissing = 0;

console.log("🔍 Detectando ConceptLinks faltantes...\n");

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  // Removemos el bloque de metadata para no buscar ahí
  const body = content.replace(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\n\};?/, '');

  const missingInFile = new Set<string>();
  const bodyLower = body.toLowerCase();

  for (const [term, id] of terms.entries()) {
    // Si el término aparece en el texto
    if (bodyLower.includes(term)) {
      if (!body.includes(`targetId="${id}"`)) {
        // Para evitar casos donde una palabra grande incluye a una chica
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        if (regex.test(body)) {
          missingInFile.add(`${term} (ID: ${id})`);
        }
      }
    }
  }

  if (missingInFile.size > 0) {
    console.log(`📄 ${path.relative(CONTENT_DIR, file)}:`);
    for (const missing of missingInFile) {
      console.log(`   - Posible enlace faltante: ${missing}`);
      totalMissing++;
    }
  }
}

console.log(`\n✅ Detección finalizada. Encontrados ${totalMissing} posibles enlaces faltantes.`);
