import fs from 'node:fs';
import path from 'node:path';

interface Rule {
  name: string;
  roots: string[];
  pattern: RegExp;
  allowed?: RegExp[];
}

const root = process.cwd();
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

const rules: Rule[] = [
  {
    name: 'editor-ui-no-fetch',
    roots: ['src/features/editor/ui', 'src/features/editor/diagrams/ui'],
    pattern: /\bfetch\s*\(/,
  },
  {
    name: 'editor-no-dynamic-code-execution',
    roots: ['src/features/editor'],
    pattern: /\b(?:eval|Function)\s*\(/,
  },
  {
    name: 'editor-no-browser-blocking-dialogs',
    roots: ['src/features/editor'],
    pattern: /\b(?:prompt|alert|confirm)\s*\(/,
  },
  {
    name: 'editor-no-ts-suppression',
    roots: ['src/features/editor', 'tests/features/editor', 'scripts/editor'],
    pattern: /@ts-(?:ignore|nocheck)/,
  },
];

function walk(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function relative(filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join('/');
}

let failures = 0;

for (const rule of rules) {
  for (const rootPath of rule.roots) {
    for (const filePath of walk(path.join(root, rootPath))) {
      const relPath = relative(filePath);
      if (rule.allowed?.some(allowed => allowed.test(relPath))) continue;
      const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
      lines.forEach((line, index) => {
        if (rule.pattern.test(line)) {
          console.error(`[${rule.name}] ${relPath}:${index + 1}: ${line.trim()}`);
          failures += 1;
        }
      });
    }
  }
}

if (failures > 0) {
  console.error(`[editor:safety] Found ${failures} unsafe editor pattern(s).`);
  process.exit(1);
}

console.log('[editor:safety] No unsafe editor patterns found.');
