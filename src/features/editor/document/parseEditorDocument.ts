import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { EditorDocument, EditorDiagnostic, VisualCompatibility, SourceLocation, ProjectedBlock } from './documentTypes';
import { projectBlocks, classifyVisualCompatibility } from './projectBlocks';

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
  let blocks: ProjectedBlock[] = [];
  let compatibility: VisualCompatibility;
  const envelope: EditorDocument['envelope'] = { importRanges: [], exportRanges: [] };
  let bodyRange = { start: 0, end: source.length };

  try {
    // Syntax-only subset of the Vite MDX pipeline. These plugins parse but do not
    // compile, execute imports, or rewrite the source.
    const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath);
    ast = processor.parse(source);

    const children = Array.isArray(ast.children) ? ast.children : [];
    const esmNodes = children.filter((node: any) => node.type === 'mdxjsEsm' && node.position);
    for (const node of esmNodes) {
      const range = mapLocation(node.position).range;
      const text = source.slice(range.start, range.end).trimStart();
      if (/^import\s/.test(text)) envelope.importRanges.push(range);
      else {
        envelope.exportRanges.push(range);
        if (/^export\s+const\s+metadata\b/.test(text)) envelope.metadataRange = range;
      }
    }

    const bodyNodes = children.filter((node: any) => node.type !== 'mdxjsEsm' && node.position);
    if (bodyNodes.length > 0) {
      const first = mapLocation(bodyNodes[0].position).range.start;
      const last = mapLocation(bodyNodes[bodyNodes.length - 1].position).range.end;
      bodyRange = { start: first, end: last };
    } else {
      const leadingEnvelopeEnd = esmNodes.reduce(
        (end: number, node: any) => Math.max(end, mapLocation(node.position).range.end),
        0
      );
      bodyRange = { start: leadingEnvelopeEnd, end: leadingEnvelopeEnd };
    }

    const proj = projectBlocks(source, bodyNodes);
    blocks = proj.blocks;
    compatibility = proj.compatibility;
  } catch (e: any) {
    compatibility = 'unsupported';
    diagnostics.push({
      code: 'PARSE_EXCEPTION',
      severity: 'critical',
      message: e.message || String(e)
    });
  }

  const doc: EditorDocument = {
    source,
    sourceHash: hash,
    ast,
    envelope,
    bodyRange,
    bodyBlocks: blocks,
    diagnostics,
    compatibility,
    compatibilityReasons: []
  };

  const classif = classifyVisualCompatibility(doc);
  doc.compatibility = classif.compatibility;
  doc.compatibilityReasons = classif.reasons;

  return doc;
}
