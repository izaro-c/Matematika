import fs from 'node:fs';
import path from 'node:path';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';

const file = process.argv[2];
if (!file) {
  console.error('Uso: npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts <ruta-al-diagrama.tsx>');
  process.exit(1);
}

const fullPath = path.resolve(process.cwd(), file);
if (!fs.existsSync(fullPath)) {
  console.error(`Archivo no encontrado: ${fullPath}`);
  process.exit(1);
}

const source = fs.readFileSync(fullPath, 'utf8');
const parsed = parseDiagramSourceAST(source);

console.log(`--- Verificación de Diagrama: ${path.basename(fullPath)} ---`);
console.log(`Estado en el Editor: ${parsed.status}`);

if (parsed.status === 'invalid') {
  console.error('Diagnósticos de error:', parsed.diagnostics);
  process.exit(1);
}

if (parsed.status === 'code-preview') {
  console.warn('Aviso: El diagrama se visualiza pero no alcanza edición exacta (visual-exact).');
  console.warn(parsed.diagnostics);
} else {
  console.log('✓ Compatible al 100% con edición visual exacta (visual-exact).');
}

process.exit(parsed.status === 'invalid' ? 1 : 0);
