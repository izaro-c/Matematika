import path from 'node:path';
import { buildEditorResourceCatalog } from './buildEditorResourceCatalog';

const srcRoot = path.join(process.cwd(), 'src');
const catalog = buildEditorResourceCatalog({ srcRoot });
const diagrams = catalog.filter(entry => entry.kind === 'diagram');
const exact = diagrams.filter(entry => entry.capability === 'visual-exact');
const codePreview = diagrams.filter(entry => entry.capability === 'code-preview');
const invalid = diagrams.filter(entry => entry.capability === 'invalid');
const internal = catalog.filter(entry => entry.capability === 'internal');

console.log('--- CATÁLOGO SEGURO DE DIAGRAMAS ---');
console.log(`Diagramas finales:                 ${diagrams.length}`);
console.log(`Edición visual exacta:             ${exact.length}`);
console.log(`Edición de código con vista previa:${codePreview.length.toString().padStart(3)}`);
console.log(`Recursos internos excluidos:       ${internal.length}`);
console.log(`Recursos inválidos:                ${invalid.length}`);

for (const entry of invalid) {
  console.error(`RECURSO INVÁLIDO: ${entry.path}: ${entry.reason}`);
}

if (invalid.length > 0) process.exitCode = 1;
