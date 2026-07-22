import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { classifyEmbeddedDiagramSource, parseDiagramSourceLocally } from '../../src/features/editor/diagrams/source/parser';
import { generateDiagramSource, SPEC_START } from '../../src/features/editor/diagrams/source/generator';

const ROOT = path.resolve('src/widgets/diagrams');
const writeVerified = process.argv.includes('--write-verified');
const fromGitPath = process.argv.find(argument => argument.startsWith('--from-git='))?.slice('--from-git='.length);
const fromGit = Boolean(fromGitPath);
const fromEveryGitSource = fromGitPath === 'all';

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(absolute);
    return entry.isFile() && entry.name.endsWith('.tsx') ? [absolute] : [];
  });
}

function componentName(source: string): string | null {
  const names = [...source.matchAll(/export\s+(?:const|function)\s+([A-Z]\w*)\b/g)].map(match => match[1]);
  return names.find(name => !name.endsWith('Spec')) ?? null;
}

let embedded = 0;
let migrated = 0;
const failures: string[] = [];
const changedFiles: string[] = [];
const unsafeFiles: string[] = [];

function visualFingerprint(source: string): string | null {
  const model = parseDiagramSourceLocally(source);
  if (!model) return null;
  const semantic = structuredClone(model) as unknown as Record<string, unknown>;
  delete semantic.version;
  delete semantic.renderer;
  delete semantic.dependencies;
  delete semantic.extensions;
  return JSON.stringify(semantic);
}

for (const file of sourceFiles(ROOT)) {
  const relativeFile = path.relative(process.cwd(), file);
  if (fromGitPath && !fromEveryGitSource && relativeFile !== fromGitPath) continue;
  const source = fromGit
    ? execFileSync('/usr/bin/git', ['show', `HEAD:${relativeFile}`], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
    : fs.readFileSync(file, 'utf8');
  if (!source.includes(SPEC_START)) continue;
  embedded += 1;
  const name = componentName(source);
  const model = parseDiagramSourceLocally(source);
  if (!name || !model) {
    const classification = classifyEmbeddedDiagramSource(source);
    failures.push(`${path.relative(process.cwd(), file)}: ${classification?.diagnostics.map(item => item.message).join(' | ') || 'no se pudo recuperar componente y modelo.'}`);
    continue;
  }
  const generated = generateDiagramSource(model, name);
  if (!generated.ok) {
    failures.push(`${path.relative(process.cwd(), file)}: ${generated.diagnostics.map(item => item.message).join(' | ')}`);
    continue;
  }
  if (generated.source === source) continue;
  migrated += 1;
  const relative = relativeFile;
  changedFiles.push(relative);
  if (visualFingerprint(source) !== visualFingerprint(generated.source)) {
    unsafeFiles.push(relative);
    continue;
  }
  if (writeVerified) fs.writeFileSync(file, generated.source, 'utf8');
}

if (failures.length > 0) throw new Error(failures.join('\n'));
if (unsafeFiles.length > 0) throw new Error(`La migración cambiaría el fingerprint semántico de:\n${unsafeFiles.join('\n')}`);
if (!writeVerified && migrated > 0) throw new Error(`${migrated} DiagramSpec requieren canonicalización verificada (fingerprint estable):\n${changedFiles.join('\n')}`);

if (writeVerified) console.log(`${embedded} DiagramSpec embebidos; ${migrated} migrados y verificados.`);
else console.log(`${embedded} DiagramSpec embebidos; ${embedded - migrated} canónicos; ${migrated} requieren cambios.`);

if (writeVerified) {
  const invalid = sourceFiles(ROOT).flatMap(file => {
    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes(SPEC_START)) return [];
    const classification = classifyEmbeddedDiagramSource(source);
    return classification?.status === 'visual-exact' ? [] : [`${path.relative(process.cwd(), file)}: ${classification?.status ?? 'sin clasificación'}`];
  });
  if (invalid.length > 0) throw new Error(`Roundtrip no exacto después de migrar:\n${invalid.join('\n')}`);
}
