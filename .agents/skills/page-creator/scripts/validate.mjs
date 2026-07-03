#!/usr/bin/env node
/**
 * validate.mjs — Script de validación de contenido MDX para Matematika
 *
 * Verifica:
 * 1. IDs en kebab-case (sin snake_case)
 * 2. Claves de metadata entre comillas dobles
 * 3. Nombre de archivo coincide con metadata.id
 * 4. El campo type usa kebab-case (no snake_case)
 * 5. No hay enlaces Markdown internos [texto](url)
 * 6. No hay \sen (debe ser \sin)
 * 7. No hay --- como separador (debe ser <Separador />)
 * 8. <Capitular> está presente
 *
 * Uso: node .opencode/skills/antigravity/scripts/validate.mjs [ruta]
 * Si no se pasa ruta, valida todo src/content/
 */

import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve(process.argv[2] || 'src/database/content');
let errors = 0;
let warnings = 0;

function findMdxFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findMdxFiles(fullPath));
    } else if (entry.name.endsWith('.mdx')) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseMetadata(content) {
  const match = content.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/);
  if (!match) return null;
  try {
    return new Function(`return ${match[1]}`)();
  } catch {
    return null;
  }
}

function isKebabCase(str) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.mdx');
  const relPath = path.relative(CONTENT_DIR, filePath);
  const fileErrors = [];

  // 1. Parsear metadata
  const meta = parseMetadata(content);
  if (!meta) {
    console.error(`[ERROR] ${relPath}: No se pudo parsear metadata`);
    errors++;
    return;
  }

  // 2. ID en kebab-case
  if (meta.id && !isKebabCase(meta.id)) {
    fileErrors.push(`ID "${meta.id}" no está en kebab-case (contiene _ o mayúsculas)`);
  }

  // 3. Nombre de archivo = ID
  if (meta.id && meta.id !== fileName) {
    fileErrors.push(`Nombre de archivo "${fileName}" != metadata.id "${meta.id}"`);
  }

  // 4. type en kebab-case (no snake_case)
  if (meta.type && meta.type.includes('_')) {
    fileErrors.push(`type "${meta.type}" usa snake_case; debe ser kebab-case: "${meta.type.replace(/_/g, '-')}"`);
  }

  // 5. Claves sin comillas o con comillas simples
  const metaBlock = content.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/);
  if (metaBlock) {
    const lines = metaBlock[1].split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '{' || trimmed === '}' || trimmed.startsWith('//')) continue;
      // Buscar claves sin comillas: id: o 'id':
      const unquoted = trimmed.match(/^([a-zA-Z_]\w*)\s*:/);
      const singleQuoted = trimmed.match(/^'([^']+)'\s*:/);
      if (unquoted) {
        fileErrors.push(`Clave "${unquoted[1]}" sin comillas dobles (usa "${unquoted[1]}")`);
      } else if (singleQuoted) {
        fileErrors.push(`Clave "${singleQuoted[1]}" con comillas simples (usa comillas dobles)`);
      }
    }
  }

  // 6. Enlaces Markdown internos [texto](/ruta)
  const mdLinks = content.match(/\[[^\]]+\]\(\/[^)]+\)/g);
  if (mdLinks) {
    fileErrors.push(`Enlaces Markdown internos encontrados (usar <ConceptLink> o <RefLink>): ${mdLinks.length}`);
  }

  // 7. \sen en LaTeX
  if (content.includes('\\sen')) {
    fileErrors.push(`\\sen encontrado en LaTeX (usar \\sin)`);
  }

  // 8. --- como separador (no <Separador />)
  if (content.includes('\n---\n') && !content.includes('<Separador')) {
    warnings++;
    console.warn(`[WARN] ${relPath}: Separador "---" encontrado (usar <Separador />)`);
  }

  // 9. <Capitular> presente
  if (!content.includes('<Capitular')) {
    warnings++;
    console.warn(`[WARN] ${relPath}: <Capitular> no encontrado al inicio`);
  }

  // 10. InteractiveElement importado desde VisualBind (no MDXBlocks)
  if (content.includes('InteractiveElement') && content.includes('from.*MDXBlocks')) {
    fileErrors.push(`InteractiveElement importado desde MDXBlocks (debe ser desde VisualBind)`);
  }

  // Reportar errores
  for (const e of fileErrors) {
    console.error(`[ERROR] ${relPath}: ${e}`);
    errors++;
  }
}

// Main
console.log('=== Validación de Contenido Matematika ===\n');

if (!fs.existsSync(CONTENT_DIR)) {
  console.error(`Directorio no encontrado: ${CONTENT_DIR}`);
  process.exit(1);
}

const files = findMdxFiles(CONTENT_DIR);
console.log(`Validando ${files.length} archivos MDX...\n`);

for (const file of files) {
  validateFile(file);
}

console.log(`\n=== Resultado ===`);
console.log(`Archivos validados: ${files.length}`);
console.log(`Errores: ${errors}`);
console.log(`Warnings: ${warnings}`);

process.exit(errors > 0 ? 1 : 0);
