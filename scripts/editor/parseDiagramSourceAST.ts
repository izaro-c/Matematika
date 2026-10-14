import ts from 'typescript';
import {
  type ParseDiagramSourceResult,
  classifyEmbeddedDiagramSource,
} from '../../src/fixed-pages/editor/diagrams/source/parser';
import { contentSecurityDiagnostics } from '../../src/fixed-pages/editor/security/contentGuard';

/**
 * Clasifica la fuente TSX de un diagrama. Solo un DiagramSpec v3 embebido
 * produce un modelo editable; cualquier otro diagrama queda como código.
 */
export function parseDiagramSourceAST(source: string, metadataType = ''): ParseDiagramSourceResult {
  const security = contentSecurityDiagnostics('diagram', source);
  if (security.length > 0) {
    return { status: 'invalid', diagnostics: security };
  }
  const embeddedClassification = classifyEmbeddedDiagramSource(source, metadataType);
  if (embeddedClassification) return embeddedClassification;
  const diagnostics: ParseDiagramSourceResult['diagnostics'] = [];
  let sourceFile: ts.SourceFile;
  try {
    sourceFile = ts.createSourceFile('diagram.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  } catch (error) {
    return {
      status: 'invalid',
      diagnostics: [{
        code: 'typescript-parse-error',
        severity: 'error',
        message: error instanceof Error ? error.message : 'Error de sintaxis TypeScript.',
        source: 'source',
      }]
    };
  }

  // Since we don't compile full project imports here, let's look for syntactic diagnostics only
  const syntaxDiag = (sourceFile as any).parseDiagnostics;
  if (syntaxDiag && syntaxDiag.length > 0) {
    return {
      status: 'invalid',
      diagnostics: (syntaxDiag as any[]).map((d: any) => ({
        code: 'typescript-syntax-error',
        severity: 'error',
        message: d.messageText.toString(),
        source: 'source',
      }))
    };
  }

  const hasExportedComponent = /export\s+(?:const|function)\s+[A-Z]\w*\b/.test(source);
  if (!hasExportedComponent) {
    return {
      status: 'invalid',
      diagnostics: [{
        code: 'missing-exported-diagram',
        severity: 'error',
        message: 'No se encontró un componente de diagrama exportado.',
        source: 'source',
      }],
    };
  }

  diagnostics.push({
    code: 'diagram-without-spec',
    severity: 'info',
    message: 'El diagrama no declara un DiagramSpec v3 embebido; el código TSX conserva la autoridad y no hay modelo visual editable.',
    source: 'synchronization',
  });
  return {
    status: 'code-preview',
    diagnostics,
  };
}
