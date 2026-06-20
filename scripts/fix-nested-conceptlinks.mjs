#!/usr/bin/env node
/**
 * fix-nested-conceptlinks.mjs
 *
 * Arregla los <ConceptLink> anidados repetidos en el contenido MDX.
 * Patrón: <ConceptLink targetId="X"><ConceptLink targetId="X">text</ConceptLink></ConceptLink>
 * Resultado: <ConceptLink targetId="X">text</ConceptLink>
 *
 * Maneja anidamientos de 2, 3 o más niveles con el mismo targetId.
 * NO toca anidamientos con targetIds diferentes (esos son legítimos).
 */

import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('src/content');

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

function fixNestedConceptLinks(content) {
  // Patrón: <ConceptLink targetId="X"><ConceptLink targetId="X">...</ConceptLink></ConceptLink>
  // Repetir hasta que no haya más anidamientos (para casos de 3+ niveles)
  const pattern = /<ConceptLink targetId="([^"]+)"><ConceptLink targetId="\1">([\s\S]*?)<\/ConceptLink><\/ConceptLink>/g;

  let previous;
  let current = content;
  let iterations = 0;
  do {
    previous = current;
    current = current.replace(pattern, '<ConceptLink targetId="$1">$2</ConceptLink>');
    iterations++;
  } while (current !== previous && iterations < 10);

  return { content: current, changed: current !== content };
}

const files = findMdxFiles(CONTENT_DIR);
let totalFixed = 0;
let filesFixed = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const { content: fixed, changed } = fixNestedConceptLinks(content);
  if (changed) {
    fs.writeFileSync(file, fixed, 'utf-8');
    const relPath = path.relative(CONTENT_DIR, file);
    const matches = content.match(/<ConceptLink targetId="([^"]+)"><ConceptLink targetId="\1">/g) || [];
    console.log(`Fixed ${matches.length} nested links in ${relPath}`);
    totalFixed += matches.length;
    filesFixed++;
  }
}

console.log(`\n=== Resultado ===`);
console.log(`Archivos revisados: ${files.length}`);
console.log(`Archivos arreglados: ${filesFixed}`);
console.log(`Links anidados eliminados: ${totalFixed}`);
