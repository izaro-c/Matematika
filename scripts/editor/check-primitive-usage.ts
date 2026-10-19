import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

/**
 * Fails when the editor UI builds its own buttons, form controls or modal
 * overlays with hand-written classes instead of the primitives in
 * `ui/primitives` (`Button`, `IconButton`, `RowButton`, `Field`, `Modal`…).
 *
 * Existing offenders live in `primitive-usage-baseline.json` (file -> count).
 * The baseline only shrinks, as in `check-hardcoded-strings.ts`.
 */

const root = process.cwd();
const roots = ['src/fixed-pages/editor/ui', 'src/fixed-pages/editor/diagrams/ui'];
const skipDirs = ['src/fixed-pages/editor/ui/primitives/', 'src/fixed-pages/editor/diagrams/ui/primitives/'];
const baselinePath = path.join(root, 'scripts/editor/primitive-usage-baseline.json');
const nativeTypes = /checkbox|radio|range|color|file|hidden|submit|reset/;

export interface Finding {
  line: number;
  kind: 'raw-button' | 'raw-control' | 'custom-overlay';
  text: string;
}

function classText(attr: ts.JsxAttribute | undefined): { literal: boolean; text: string } {
  const init = attr?.initializer;
  if (!init) return { literal: false, text: '' };
  if (ts.isStringLiteral(init)) return { literal: true, text: init.text };
  if (ts.isJsxExpression(init) && init.expression) {
    const expr = init.expression;
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return { literal: true, text: expr.text };
    if (ts.isTemplateExpression(expr)) return { literal: true, text: [expr.head.text, ...expr.templateSpans.map(s => s.literal.text)].join(' ') };
  }
  return { literal: false, text: '' };
}

/** A solid box: `border`/`rounded` without a variant prefix and not a one-sided border (an underline). */
function hasBoxChrome(classes: string): boolean {
  return classes
    .split(/\s+/)
    .filter(token => !token.includes(':'))
    .some(token => /^rounded(-.+)?$/.test(token) || /^border(-(?![tblrxyse]-|[tblrxyse]$).+)?$/.test(token));
}

export function findRawControls(fileName: string, source: string): Finding[] {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const findings: Finding[] = [];
  const add = (node: ts.Node, kind: Finding['kind'], text: string) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    findings.push({ line: line + 1, kind, text });
  };

  const check = (node: ts.JsxOpeningElement | ts.JsxSelfClosingElement) => {
    const tag = node.tagName.getText(sf);
    const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
    const attr = (name: string) => attrs.find(a => a.name.getText(sf) === name);
    const cls = classText(attr('className'));
    if (tag === 'button') {
      // `ed-*` classes are the skin of a primitive-shaped control (palette, drag handle…).
      if (!/\bed-/.test(cls.text)) add(node, 'raw-button', '<button>');
    } else if (tag === 'input' || tag === 'select' || tag === 'textarea') {
      const type = attr('type')?.initializer;
      const typeText = type && ts.isStringLiteral(type) ? type.text : '';
      if (nativeTypes.test(typeText)) return;
      if (cls.literal && hasBoxChrome(cls.text) && !/\bed-/.test(cls.text)) add(node, 'raw-control', `<${tag}>`);
    } else if (cls.literal && /\bfixed\b/.test(cls.text) && /\binset-0\b/.test(cls.text)) {
      add(node, 'custom-overlay', `<${tag}> fixed inset-0`);
    }
  };

  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) check(node);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return findings;
}

function walk(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else if (entry.isFile() && fullPath.endsWith('.tsx')) files.push(fullPath);
  }
  return files;
}

function main() {
  const update = process.argv.includes('--update');
  const baseline: Record<string, number> = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : {};
  const current: Record<string, number> = {};
  const details: Record<string, Finding[]> = {};

  for (const rootPath of roots) {
    for (const filePath of walk(path.join(root, rootPath))) {
      const rel = path.relative(root, filePath).split(path.sep).join('/');
      if (skipDirs.some(dir => rel.startsWith(dir))) continue;
      const findings = findRawControls(rel, fs.readFileSync(filePath, 'utf8'));
      if (findings.length > 0) {
        current[rel] = findings.length;
        details[rel] = findings;
      }
    }
  }

  if (update) {
    const grown = Object.keys(current).filter(file => current[file] > (baseline[file] ?? 0));
    if (grown.length > 0 && !process.argv.includes('--allow-growth')) {
      console.error('Refusing to raise the baseline (it only shrinks). Use the primitives or pass --allow-growth:');
      for (const file of grown) console.error(`  ${file}: ${baseline[file] ?? 0} -> ${current[file]}`);
      process.exit(1);
    }
    const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(baselinePath, `${JSON.stringify(sorted, null, 2)}\n`);
    console.log(`Baseline updated: ${Object.keys(sorted).length} files, ${Object.values(sorted).reduce((a, b) => a + b, 0)} raw controls.`);
    return;
  }

  let failures = 0;
  for (const [file, count] of Object.entries(current)) {
    const allowed = baseline[file] ?? 0;
    if (count <= allowed) continue;
    failures += 1;
    console.error(`${file}: ${count} hand-built controls (allowed ${allowed}). Use Button, IconButton, RowButton, Field or Modal from ui/primitives.`);
    for (const f of details[file]) console.error(`  ${file}:${f.line}  ${f.kind} ${f.text}`);
  }

  const shrunk = Object.keys(baseline).filter(file => (current[file] ?? 0) < baseline[file]);
  if (shrunk.length > 0) console.log(`Baseline can shrink (${shrunk.length} files). Run: npm run editor:ui:baseline`);

  const total = Object.values(current).reduce((a, b) => a + b, 0);
  if (failures > 0) {
    console.error(`\nPrimitive usage check failed in ${failures} file(s).`);
    process.exit(1);
  }
  console.log(`Primitive usage check passed (${total} hand-built controls pending in baseline).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
