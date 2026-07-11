import fs from 'node:fs';
import path from 'node:path';
import { assertSafeReport, runCorpusAudit } from './corpusAuditCore';

const output = path.join(process.cwd(), 'ai/reports/editor-lossless-compatibility.json');
const markdownOutput = path.join(process.cwd(), 'ai/reports/editor-lossless-compatibility.md');
const report = runCorpusAudit();
assertSafeReport(report);

if (process.argv.includes('--audit')) {
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownOutput, `# Compatibilidad lossless del corpus\n\n| Compatibilidad | Documentos |\n| --- | ---: |\n| fully-editable | ${report.counts['fully-editable']} |\n| partially-editable | ${report.counts['partially-editable']} |\n| read-only | ${report.counts['read-only']} |\n| unsupported | ${report.counts.unsupported} |\n| **Total** | **${report.totalFiles}** |\n\nTodos los documentos se conservaron exactamente tras apertura, proyección, cambios de modo y tres ciclos.\n`, 'utf8');
  console.log(`[SUCCESS] Compatibilidad auditada para ${report.totalFiles} documentos.`);
} else if (process.argv.includes('--check')) {
  if (!fs.existsSync(output)) throw new Error(`Baseline missing: ${output}`);
  const baseline = JSON.parse(fs.readFileSync(output, 'utf8'));
  if (JSON.stringify(baseline) !== JSON.stringify(report)) throw new Error('Compatibility baseline changed');
  console.log(`[SUCCESS] Compatibilidad estable para ${report.totalFiles} documentos.`);
} else {
  throw new Error('Use --audit or --check');
}
