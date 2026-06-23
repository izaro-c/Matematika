import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('./src/content');
const ISSUES: string[] = [];
let fileCount = 0;
let issueCount = 0;

function lintFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(CONTENT_DIR, filePath);
  fileCount++;

  const bodyStart = findBodyStart(content);
  const body = bodyStart !== -1 ? content.slice(bodyStart) : '';

  if (body) {
    const trimmed = body.trimStart();

    if (!trimmed.startsWith('<Capitular')) {
      ISSUES.push(`${relativePath}: Falta <Capitular> al inicio del contenido`);
      issueCount++;
    }

    if (/^---$/m.test(trimmed)) {
      ISSUES.push(`${relativePath}: Usa '---' en lugar de <Separador />`);
      issueCount++;
    }
  }

  // eslint-disable-next-line sonarjs/super-linear-regex -- bounded input
  const mdLinkRegex = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    ISSUES.push(`${relativePath}: Enlace Markdown interno [${match[1]}](${match[2]}) — usa <ConceptLink> o componente semántico`);
    issueCount++;
  }

  // eslint-disable-next-line sonarjs/super-linear-regex -- bounded input
  const mdLinkFullRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  while ((match = mdLinkFullRegex.exec(content)) !== null) {
    ISSUES.push(`${relativePath}: Enlace Markdown absoluto [${match[1]}](${match[2]}) — verificar si aplica <ConceptLink>`);
    issueCount++;
  }
}

function findBodyStart(content: string): number {
  const lines = content.split('\n');
  let inExport = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trimStart().startsWith('import ') || line.trimStart().startsWith('export ')) {
      inExport = true;
      continue;
    }

    if (inExport && line.trim() === '') {
      inExport = false;
      continue;
    }

    if (inExport) continue;

    if (line.trim() !== '') {
      return content.indexOf(line);
    }
  }

  return -1;
}

function walkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.mdx')) {
      lintFile(fullPath);
    }
  }
}

console.log('🔍 Linting MDX content files...\n');
walkDir(CONTENT_DIR);

if (issueCount === 0) {
  console.log(`✅ ${fileCount} archivos MDX revisados. Sin incidencias.`);
} else {
  console.log(`⚠️  ${issueCount} incidencias en ${fileCount} archivos:\n`);
  for (const issue of ISSUES) {
    console.log(`  • ${issue}`);
  }
  console.log(`\n📋 Revisa STYLEGUIDE.md para las reglas de estructura MDX.`);
  process.exit(1);
}
