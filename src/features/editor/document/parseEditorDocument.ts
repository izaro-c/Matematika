import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { EditorDocument, EditorDiagnostic, VisualCompatibility, SourceLocation, ProjectedBlock } from './documentTypes';

export function computeHash(content: string): string {
  let hash = 5381;
  for (let i = 0; i < content.length; i++) {
    hash = (hash * 33) ^ content.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function mapLocation(position: any): SourceLocation {
  return {
    range: {
      start: position?.start?.offset ?? 0,
      end: position?.end?.offset ?? 0
    },
    startLine: position?.start?.line,
    startColumn: position?.start?.column,
    endLine: position?.end?.line,
    endColumn: position?.end?.column
  };
}

export function parseEditorDocument(source: string): EditorDocument {
  const hash = computeHash(source);
  const diagnostics: EditorDiagnostic[] = [];
  let ast: any = null;
  const blocks: ProjectedBlock[] = [];
  let compatibility: VisualCompatibility = 'fully-editable';

  try {
    const processor = unified().use(remarkParse).use(remarkMdx);
    ast = processor.parse(source);
  } catch (e: any) {
    compatibility = 'unsupported';
    diagnostics.push({
      code: 'PARSE_EXCEPTION',
      severity: 'critical',
      message: e.message || String(e)
    });
  }

  return {
    source,
    sourceHash: hash,
    ast,
    blocks,
    diagnostics,
    compatibility
  };
}
