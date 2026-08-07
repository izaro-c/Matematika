/**
 * Trust-boundary checks for editor-persisted MDX / diagram sources.
 * Blocks injection primitives and non-allowlisted module "plugins".
 */

export type ContentGuardKind = 'mdx' | 'diagram';

export interface ContentSecurityFinding {
  code: string;
  severity: 'error';
  message: string;
  source?: 'security';
}

const INJECTION: Array<{ code: string; re: RegExp; message: string }> = [
  { code: 'security-eval', re: /\beval\s*\(/, message: 'eval() no está permitido en el corpus.' },
  { code: 'security-function-ctor', re: /\b(?:new\s+)?Function\s*\(/, message: 'Function() no está permitido en el corpus.' },
  { code: 'security-dynamic-import', re: /\bimport\s*\(/, message: 'import() dinámico no está permitido.' },
  { code: 'security-require', re: /\brequire\s*\(/, message: 'require() no está permitido.' },
  { code: 'security-script-tag', re: /<\s*script\b/i, message: 'Etiquetas <script> no permitidas.' },
  { code: 'security-javascript-url', re: /javascript\s*:/i, message: 'URLs javascript: no permitidas.' },
  { code: 'security-data-html', re: /data\s*:\s*text\/html/i, message: 'data:text/html no está permitido.' },
  { code: 'security-fetch', re: /\bfetch\s*\(/, message: 'fetch() no está permitido en el corpus.' },
  { code: 'security-xhr', re: /\bXMLHttpRequest\b/, message: 'XMLHttpRequest no está permitido.' },
  { code: 'security-websocket', re: /\bWebSocket\b/, message: 'WebSocket no está permitido.' },
  { code: 'security-worker', re: /\b(?:new\s+)?Worker\s*\(/, message: 'Worker no está permitido.' },
  { code: 'security-inner-html', re: /\.innerHTML\b/, message: 'innerHTML no está permitido en fuente editable.' },
  { code: 'security-document-write', re: /\bdocument\s*\.\s*write\s*\(/, message: 'document.write no está permitido.' },
  { code: 'security-process', re: /\bprocess\s*\./, message: 'Acceso a process no permitido.' },
  { code: 'security-node-protocol', re: /['"]node:/, message: 'Imports node: no permitidos.' },
];

const MDX_DANGEROUS_TAGS = /<\s*(iframe|object|embed|link|meta|base|form)\b/i;
const MDX_EVENT_ATTR = /<\s*[A-Za-z][^>]*\s+on[A-Za-z]+\s*=/;

const MDX_IMPORT_PREFIXES = ['@content/diagrams/'] as const;
const DIAGRAM_IMPORT_ALLOW = [
  /^react$/,
  /^three$/,
  /^@react-three\/(?:drei|fiber)$/,
  /^@\/diagrams\//,
  /^@\/components\/ui\/(?:DiagramOverlay|StepBinding)$/,
  /^@\/lib\/page-context\//,
] as const;

const IMPORT_RE =
  /(?:^|[\n;])\s*import\s+(?:type\s+)?(?:[^'"\n]+?\s+from\s+)?['"]([^'"]+)['"]/g;

function finding(code: string, message: string): ContentSecurityFinding {
  return { code, severity: 'error', message, source: 'security' };
}

function extractImports(source: string): string[] {
  const out: string[] = [];
  IMPORT_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = IMPORT_RE.exec(source)) !== null) out.push(match[1]);
  return out;
}

function isAllowedDiagramImport(specifier: string): boolean {
  return DIAGRAM_IMPORT_ALLOW.some(pattern => pattern.test(specifier));
}

function isAllowedMdxImport(specifier: string): boolean {
  return MDX_IMPORT_PREFIXES.some(prefix => specifier.startsWith(prefix));
}

function auditImports(kind: ContentGuardKind, source: string): ContentSecurityFinding[] {
  const findings: ContentSecurityFinding[] = [];
  for (const specifier of extractImports(source)) {
    if (specifier.includes('..') || specifier.startsWith('/') || /^https?:/i.test(specifier)) {
      findings.push(finding('security-import-path', `Importación prohibida: ${specifier}`));
      continue;
    }
    const ok = kind === 'mdx' ? isAllowedMdxImport(specifier) : isAllowedDiagramImport(specifier);
    if (!ok) {
      findings.push(finding(
        'security-import-plugin',
        `Módulo no allowlisted (plugin): ${specifier}`,
      ));
    }
  }
  return findings;
}

const ALLOWED_MDX_EXPORTS = new Set(['metadata', 'Simulation', 'Diagram']);

function auditMdxExports(source: string): ContentSecurityFinding[] {
  const findings: ContentSecurityFinding[] = [];
  if (/(?:^|[\n;])\s*export\s+(?:default|function|class|\*|\{)/m.test(source)) {
    findings.push(finding('security-export', 'Solo se permiten export const metadata, Simulation y Diagram.'));
  }
  for (const match of source.matchAll(/(?:^|[\n;])\s*export\s+const\s+(\w+)\b/g)) {
    if (!ALLOWED_MDX_EXPORTS.has(match[1])) {
      findings.push(finding('security-export', `Exportación no permitida: ${match[1]}`));
    }
  }
  return findings;
}

function auditMdxDangerousSyntax(source: string): ContentSecurityFinding[] {
  const findings: ContentSecurityFinding[] = [];
  if (MDX_DANGEROUS_TAGS.test(source)) {
    findings.push(finding('security-html-tag', 'Etiqueta HTML peligrosa en MDX.'));
  }
  if (MDX_EVENT_ATTR.test(source)) {
    findings.push(finding('security-event-attr', 'Atributos on* no permitidos en MDX.'));
  }
  return findings;
}

export function auditEditorSource(kind: ContentGuardKind, source: string): ContentSecurityFinding[] {
  const findings: ContentSecurityFinding[] = [];
  for (const rule of INJECTION) {
    if (rule.re.test(source)) findings.push(finding(rule.code, rule.message));
  }
  findings.push(...auditImports(kind, source));
  if (kind === 'mdx') {
    findings.push(...auditMdxExports(source));
    findings.push(...auditMdxDangerousSyntax(source));
  }
  return findings;
}

export function contentSecurityDiagnostics(kind: ContentGuardKind, source: string): Array<{
  code: string;
  severity: 'error';
  message: string;
  source: 'security';
}> {
  return auditEditorSource(kind, source).map(item => ({
    code: item.code,
    severity: 'error' as const,
    message: item.message,
    source: 'security' as const,
  }));
}
