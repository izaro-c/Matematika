import fs from 'node:fs';
import path from 'node:path';
import { parseDiagramSourceAST } from './parseDiagramSourceAST';

const ROOT = process.cwd();
const DIAGRAMS_DIR = path.join(ROOT, 'src/widgets/diagrams');

function walk(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      callback(fullPath);
    }
  }
}

const unsupported: string[] = [];
const supported: string[] = [];
const legacyJsxGraph: string[] = [];
const customRuntime: string[] = [];
const placeholders: string[] = [];
let total = 0;

walk(DIAGRAMS_DIR, (filePath) => {
  if (filePath.endsWith('index.tsx') || filePath.endsWith('index.ts')) return;
  total++;
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = parseDiagramSourceAST(content);
  const relPath = path.relative(ROOT, filePath);
  
  if (result.status === 'supported') {
    supported.push(relPath);
  } else if (content.includes('Diagrama en construcción') || content.includes('Placeholder')) {
    placeholders.push(relPath);
    console.log(`⚪ Placeholder: ${relPath}`);
  } else if (content.includes('JXG.JSXGraph.initBoard')) {
    legacyJsxGraph.push(relPath);
    console.log(`🟡 Legacy JSXGraph: ${relPath} (requires MathBoard rewrite)`);
  } else if (
    content.includes('@react-three/fiber') ||
    content.includes('<Canvas') ||
    content.includes('<svg') ||
    content.includes('const STEPS =') ||
    content.includes('useState') ||
    content.includes('requestAnimationFrame')
  ) {
    customRuntime.push(relPath);
    console.log(`🔵 Custom runtime: ${relPath} (not handled by visual geometry editor)`);
  } else {
    unsupported.push(relPath);
    console.log(`❌ Unsupported: ${relPath} (Points: ${result.model?.points?.length || 0}, Elements: ${result.model?.elements?.length || 0})`);
    if (result.diagnostics && result.diagnostics.length > 0) {
      console.log('   Diagnostics:', result.diagnostics);
    }
  }
});

console.log('\n--- DIAGRAM SUPPORT REPORT ---');
console.log(`Total diagrams: ${total}`);
console.log(`Supported:      ${supported.length}`);
console.log(`Legacy JSXGraph:${legacyJsxGraph.length.toString().padStart(7)}`);
console.log(`Custom runtime: ${customRuntime.length}`);
console.log(`Placeholders:   ${placeholders.length}`);
console.log(`Unsupported:    ${unsupported.length}`);
