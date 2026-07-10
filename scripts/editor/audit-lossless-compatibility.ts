import fs from 'fs';
import path from 'path';
import { parseEditorDocument } from '../../src/features/editor/document/parseEditorDocument';
import { classifyVisualCompatibility } from '../../src/features/editor/document/projectBlocks';

function getRepositoryRoot(): string {
  return process.cwd();
}

function discoverMdxFiles(dir: string, baseDir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (
        file !== 'node_modules' &&
        file !== '.git' &&
        file !== 'dist' &&
        file !== 'coverage' &&
        file !== 'fixtures'
      ) {
        results = results.concat(discoverMdxFiles(fullPath, baseDir));
      }
    } else if (file.endsWith('.mdx')) {
      const relative = path.relative(baseDir, fullPath);
      results.push(relative);
    }
  }
  return results;
}

interface FileCompatibilityResult {
  path: string;
  compatibility: string;
  sourceHash: string;
  totalBlocks: number;
  editableBlocks: number;
  opaqueBlocks: number;
  reasons: string[];
}

interface LosslessAuditReport {
  schemaVersion: number;
  totalFiles: number;
  counts: {
    'fully-editable': number;
    'partially-editable': number;
    'read-only': number;
    unsupported: number;
  };
  files: FileCompatibilityResult[];
}

function runAudit(): LosslessAuditReport {
  const repoRoot = getRepositoryRoot();
  const corpusDir = path.join(repoRoot, 'src/database/content');
  
  const files = discoverMdxFiles(corpusDir, repoRoot).sort();
  const results: FileCompatibilityResult[] = [];
  
  const counts = {
    'fully-editable': 0,
    'partially-editable': 0,
    'read-only': 0,
    unsupported: 0
  };

  for (const relativePath of files) {
    const absolutePath = path.join(repoRoot, relativePath);
    const content = fs.readFileSync(absolutePath, 'utf8');
    
    // Parse
    const doc = parseEditorDocument(content);
    
    // Stability test: 3 cycles
    const doc2 = parseEditorDocument(doc.source);
    const doc3 = parseEditorDocument(doc2.source);
    if (doc.sourceHash !== doc2.sourceHash || doc2.sourceHash !== doc3.sourceHash) {
      throw new Error(`Hash instability detected on file: ${relativePath}`);
    }

    const classif = classifyVisualCompatibility(doc);
    counts[classif.compatibility] += 1;

    const editableBlocks = doc.blocks.filter(b => b.kind === 'editable').length;
    const opaqueBlocks = doc.blocks.filter(b => b.kind === 'opaque').length;

    results.push({
      path: relativePath,
      compatibility: classif.compatibility,
      sourceHash: doc.sourceHash,
      totalBlocks: doc.blocks.length,
      editableBlocks,
      opaqueBlocks,
      reasons: classif.reasons
    });
  }

  return {
    schemaVersion: 1,
    totalFiles: files.length,
    counts,
    files: results
  };
}

function generateMarkdownReport(report: LosslessAuditReport, outputPath: string) {
  let md = `# Informe de Compatibilidad Lossless del Corpus

Este informe detalla el nivel de compatibilidad de los documentos del corpus con el nuevo motor de edición sin pérdidas (lossless).

## Resumen de Compatibilidad

| Compatibilidad | Cantidad | Porcentaje |
| :--- | ---: | ---: |
| **fully-editable** | ${report.counts['fully-editable']} | ${((report.counts['fully-editable'] / report.totalFiles) * 100).toFixed(2)}% |
| **partially-editable** | ${report.counts['partially-editable']} | ${((report.counts['partially-editable'] / report.totalFiles) * 100).toFixed(2)}% |
| **read-only** | ${report.counts['read-only']} | ${((report.counts['read-only'] / report.totalFiles) * 100).toFixed(2)}% |
| **unsupported** | ${report.counts['unsupported']} | ${((report.counts['unsupported'] / report.totalFiles) * 100).toFixed(2)}% |
| **Total** | **${report.totalFiles}** | **100.00%** |

## Detalle por Archivo

| Archivo | Compatibilidad | Bloques (Edit/Opaque) | Razones / Diagnósticos |
| :--- | :---: | :---: | :--- |
`;

  for (const f of report.files) {
    const blocksStr = `${f.totalBlocks} (${f.editableBlocks}/${f.opaqueBlocks})`;
    const reasonsStr = f.reasons.length > 0 ? f.reasons.join('; ') : '-';
    md += `| \`${f.path}\` | \`${f.compatibility}\` | ${blocksStr} | ${reasonsStr} |\n`;
  }

  fs.writeFileSync(outputPath, md, 'utf8');
}

function main() {
  const args = process.argv.slice(2);
  const isAudit = args.includes('--audit');
  const isCheck = args.includes('--check');

  const repoRoot = getRepositoryRoot();
  const jsonPath = path.join(repoRoot, 'ai/reports/editor-lossless-compatibility.json');
  const mdPath = path.join(repoRoot, 'ai/reports/editor-lossless-compatibility.md');

  if (isAudit) {
    console.log('[INFO] Ejecutando auditoría de compatibilidad lossless...');
    const report = runAudit();
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
    generateMarkdownReport(report, mdPath);
    console.log(`[SUCCESS] Escrito informe JSON en: ${jsonPath}`);
    console.log(`[SUCCESS] Escrito informe Markdown en: ${mdPath}`);
    process.exit(0);
  }

  if (isCheck) {
    console.log('[INFO] Verificando compatibilidad lossless contra baseline...');
    if (!fs.existsSync(jsonPath)) {
      console.error(`[FAIL] Baseline JSON no encontrado en: ${jsonPath}. Ejecuta --audit primero.`);
      process.exit(1);
    }

    const baseline: LosslessAuditReport = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const current = runAudit();

    let regressions = 0;
    const currentPaths = new Set(current.files.map(f => f.path));

    for (const baseFile of baseline.files) {
      if (!currentPaths.has(baseFile.path)) {
        console.error(`[REGRESION] Archivo desaparecido del corpus: \`${baseFile.path}\``);
        regressions += 1;
        continue;
      }

      const curFile = current.files.find(f => f.path === baseFile.path)!;
      
      // Downgrade check (e.g. from fully-editable to partially-editable or read-only, etc.)
      const order = ['unsupported', 'read-only', 'partially-editable', 'fully-editable'];
      const baseOrder = order.indexOf(baseFile.compatibility);
      const curOrder = order.indexOf(curFile.compatibility);

      if (curOrder < baseOrder) {
        console.error(`[REGRESION] Compatibilidad degradada para \`${baseFile.path}\`: ${baseFile.compatibility} -> ${curFile.compatibility}`);
        regressions += 1;
      }
    }

    if (regressions > 0) {
      console.error(`[FAIL] Puerta de no-regresión fallida con ${regressions} regresiones encontradas.`);
      process.exit(1);
    }

    console.log('[SUCCESS] Puerta de no-regresión de compatibilidad lossless superada.');
    process.exit(0);
  }

  console.error('[ERROR] Debe especificarse --audit o --check');
  process.exit(1);
}

main();
