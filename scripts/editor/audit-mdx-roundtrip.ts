import fs from 'node:fs';
import path from 'node:path';
import { assertSafeReport, runCorpusAudit, type CorpusAuditReport } from './corpusAuditCore';

const reportPath = path.join(process.cwd(), 'ai/reports/editor-roundtrip-baseline.json');
const markdownPath = path.join(process.cwd(), 'ai/reports/editor-roundtrip-baseline.md');

function markdown(report: CorpusAuditReport): string {
  return `# Auditoría lossless del editor

El informe ejecuta apertura, proyección, cambios de modo y tres ciclos sobre el motor productivo. No reserializa el documento.

## Resultado

- Total de MDX: ${report.totalFiles}
- Exactos: ${report.files.filter(file => file.exact).length}
- No idempotentes: ${report.files.filter(file => !file.idempotent).length}
- Envelope alterado: ${report.files.filter(file => !file.envelopePreserved).length}
- Body alterado: ${report.files.filter(file => !file.bodyPreserved).length}
- Metadata legible y válida: ${report.files.filter(file => file.metadataReadable && file.metadataSchemaValid).length}/${report.totalFiles}
- Regiones opacas: ${report.files.reduce((total, file) => total + file.opaqueBlocks, 0)}

| Compatibilidad | Documentos |
| --- | ---: |
| fully-editable | ${report.counts['fully-editable']} |
| partially-editable | ${report.counts['partially-editable']} |
| read-only | ${report.counts['read-only']} |
| unsupported | ${report.counts.unsupported} |
`;
}

export function compareBaseline(baseline: CorpusAuditReport, current: CorpusAuditReport): string[] {
  const failures: string[] = [];
  const baselinePaths = baseline.files.map(file => file.path);
  const currentPaths = current.files.map(file => file.path);
  if (JSON.stringify(baselinePaths) !== JSON.stringify(currentPaths)) failures.push('Corpus file set changed');
  for (const entry of current.files) {
    const previous = baseline.files.find(file => file.path === entry.path);
    if (!previous) continue;
    if (entry.compatibility !== previous.compatibility) failures.push(`Compatibility changed: ${entry.path}`);
    if (entry.originalHash !== previous.originalHash) failures.push(`Corpus source changed: ${entry.path}`);
  }
  try { assertSafeReport(current); } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }
  return failures;
}

function main() {
  const current = runCorpusAudit();
  assertSafeReport(current);
  if (process.argv.includes('--audit')) {
    fs.writeFileSync(reportPath, `${JSON.stringify(current, null, 2)}\n`, 'utf8');
    fs.writeFileSync(markdownPath, markdown(current), 'utf8');
    console.log(`[SUCCESS] Auditoría escrita para ${current.totalFiles} documentos.`);
    return;
  }
  if (process.argv.includes('--check') || process.argv.includes('--strict')) {
    if (!fs.existsSync(reportPath)) throw new Error(`Baseline missing: ${reportPath}`);
    const failures = compareBaseline(JSON.parse(fs.readFileSync(reportPath, 'utf8')), current);
    if (failures.length > 0) throw new Error(failures.join('\n'));
    console.log(`[SUCCESS] Gate lossless superado para ${current.totalFiles} documentos.`);
    return;
  }
  throw new Error('Use --audit, --check or --strict');
}

if (process.argv[1]?.endsWith('audit-mdx-roundtrip.ts')) main();
