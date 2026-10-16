import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

/**
 * Fails when the editor UI contains visible literals written by hand in JSX
 * (text nodes and user-facing attributes) instead of `t('editor.<area>.<key>')`.
 *
 * Existing offenders live in `hardcoded-strings-baseline.json` (file -> count).
 * The baseline only shrinks: a file may never exceed its recorded count, and
 * files not listed must have zero. Run with `--update` after migrating a batch.
 */

const root = process.cwd();
const roots = ['src/fixed-pages/editor/ui', 'src/fixed-pages/editor/diagrams/ui'];
const baselinePath = path.join(root, 'scripts/editor/hardcoded-strings-baseline.json');
const visibleAttributes = new Set(['title', 'placeholder', 'aria-label', 'aria-description', 'alt', 'label', 'description', 'tooltip']);

export interface Finding {
  line: number;
  text: string;
}

const hasLetters = (text: string) => /\p{L}{2,}/u.test(text);

function isVisibleString(text: string): boolean {
  const trimmed = text.trim();
  if (!hasLetters(trimmed)) return false;
  // Identifiers, class names, urls, paths and ids are not prose: prose has a space or a capital + lowercase.
  return /\s/.test(trimmed) || /^\p{Lu}\p{Ll}+[.!?:]?$/u.test(trimmed);
}

export function findHardcodedStrings(fileName: string, source: string): Finding[] {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const findings: Finding[] = [];
  const add = (node: ts.Node, text: string) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    findings.push({ line: line + 1, text: text.trim().replace(/\s+/g, ' ').slice(0, 60) });
  };

  // {'literal'}, {cond ? 'a b' : 'c d'}, {x || 'a b'}, `texto ${x}`
  const checkExpression = (expr: ts.Expression): void => {
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
      if (isVisibleString(expr.text)) add(expr, expr.text);
    } else if (ts.isTemplateExpression(expr)) {
      const text = [expr.head.text, ...expr.templateSpans.map(span => span.literal.text)].join(' ');
      if (isVisibleString(text)) add(expr, text);
    } else if (ts.isConditionalExpression(expr)) {
      checkExpression(expr.whenTrue);
      checkExpression(expr.whenFalse);
    } else if (ts.isParenthesizedExpression(expr)) checkExpression(expr.expression);
    else if (ts.isBinaryExpression(expr) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(expr.operatorToken.kind)) checkExpression(expr.right);
  };

  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) {
      const text = node.getText(sf);
      if (hasLetters(text)) add(node, text);
    } else if (ts.isJsxAttribute(node) && visibleAttributes.has(node.name.getText(sf)) && node.initializer) {
      const init = node.initializer;
      if (ts.isStringLiteral(init)) {
        if (isVisibleString(init.text)) add(init, init.text);
      } else if (ts.isJsxExpression(init) && init.expression) checkExpression(init.expression);
    } else if (ts.isJsxExpression(node) && node.expression && !ts.isJsxAttribute(node.parent)) {
      checkExpression(node.expression);
    }
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
      const findings = findHardcodedStrings(rel, fs.readFileSync(filePath, 'utf8'));
      if (findings.length > 0) {
        current[rel] = findings.length;
        details[rel] = findings;
      }
    }
  }

  if (update) {
    const grown = Object.keys(current).filter(file => current[file] > (baseline[file] ?? 0));
    if (grown.length > 0 && !process.argv.includes('--allow-growth')) {
      console.error('Refusing to raise the baseline (it only shrinks). Migrate these files or pass --allow-growth:');
      for (const file of grown) console.error(`  ${file}: ${baseline[file] ?? 0} -> ${current[file]}`);
      process.exit(1);
    }
    const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(baselinePath, `${JSON.stringify(sorted, null, 2)}\n`);
    console.log(`Baseline updated: ${Object.keys(sorted).length} files, ${Object.values(sorted).reduce((a, b) => a + b, 0)} literals.`);
    return;
  }

  let failures = 0;
  for (const [file, count] of Object.entries(current)) {
    const allowed = baseline[file] ?? 0;
    if (count <= allowed) continue;
    failures += 1;
    console.error(`${file}: ${count} hardcoded visible strings (allowed ${allowed}). Use t('editor.<area>.<key>').`);
    for (const f of details[file]) console.error(`  ${file}:${f.line}  "${f.text}"`);
  }

  const shrunk = Object.keys(baseline).filter(file => (current[file] ?? 0) < baseline[file]);
  if (shrunk.length > 0) console.log(`Baseline can shrink (${shrunk.length} files). Run: npx tsx scripts/editor/check-hardcoded-strings.ts --update`);

  const total = Object.values(current).reduce((a, b) => a + b, 0);
  if (failures > 0) {
    console.error(`\nHardcoded strings check failed in ${failures} file(s).`);
    process.exit(1);
  }
  console.log(`Hardcoded strings check passed (${total} literals pending in baseline).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
