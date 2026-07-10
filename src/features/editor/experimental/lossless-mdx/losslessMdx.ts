import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import crypto from 'crypto';
import {
  ExperimentalEditorDocument,
  ProjectedBlock,
  SourceEdit,
  SourceEditResult,
  VisualCompatibility,
  EditorDiagnostic,
  SourceLocation
} from './documentTypes';

function computeHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

// Convert Unified position to our SourceLocation contract
function mapLocation(position: any): SourceLocation {
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

// Check if a paragraph node contains complex elements
function isComplexParagraph(node: any): boolean {
  if (!node.children) return false;
  for (const child of node.children) {
    if (
      child.type === 'mdxJsxTextElement' ||
      child.type === 'mdxTextExpression' ||
      child.type === 'html'
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Parses raw MDX content into our structured ExperimentalEditorDocument.
 */
export function parseExperimentalDocument(source: string): ExperimentalEditorDocument {
  const hash = computeHash(source);
  const diagnostics: EditorDiagnostic[] = [];
  let ast: any = null;
  let blocks: ProjectedBlock[] = [];
  let compatibility: VisualCompatibility = 'fully-editable';

  try {
    const processor = unified().use(remarkParse).use(remarkMdx);
    ast = processor.parse(source);

    if (ast && ast.children) {
      let index = 0;
      let hasOpaque = false;
      let hasExports = false;

      for (const node of ast.children) {
        const location = mapLocation(node.position);
        const nodeSource = source.slice(location.range.start, location.range.end);
        const id = `block-${index}`;
        index += 1;

        if (node.type === 'paragraph') {
          if (isComplexParagraph(node)) {
            hasOpaque = true;
            blocks.push({
              kind: 'opaque',
              id,
              source: nodeSource,
              location,
              reason: 'Paragraph contains complex JSX or HTML inline nodes'
            });
          } else {
            blocks.push({
              kind: 'editable',
              id,
              blockType: 'paragraph',
              location,
              originalSource: nodeSource,
              data: {
                text: nodeSource
              }
            });
          }
        } else if (node.type === 'heading') {
          // Check if heading has complex inline elements
          if (isComplexParagraph(node)) {
            hasOpaque = true;
            blocks.push({
              kind: 'opaque',
              id,
              source: nodeSource,
              location,
              reason: 'Heading contains complex JSX or HTML inline nodes'
            });
          } else {
            blocks.push({
              kind: 'editable',
              id,
              blockType: 'heading',
              location,
              originalSource: nodeSource,
              data: {
                depth: node.depth,
                text: nodeSource
              }
            });
          }
        } else {
          // Unsupported node types become opaque blocks
          hasOpaque = true;
          let reason = `Unsupported AST node type: ${node.type}`;
          
          if (node.type === 'mdxjsEsm') {
            hasExports = true;
            reason = 'ESM import or export statement';
          } else if (node.type === 'mdxJsxFlowElement') {
            reason = `JSX block component: <${node.name}>`;
          } else if (node.type === 'mdxFlowExpression') {
            reason = 'JSX multiline expression block';
          } else if (node.type === 'list') {
            reason = 'Standard markdown list block';
          } else if (node.type === 'table') {
            reason = 'Standard markdown table block';
          } else if (node.type === 'math') {
            reason = 'Display math block';
          }

          blocks.push({
            kind: 'opaque',
            id,
            source: nodeSource,
            location,
            reason
          });
        }
      }

      if (hasExports) {
        compatibility = 'read-only';
      } else if (hasOpaque) {
        compatibility = 'partially-editable';
      }
    }
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

/**
 * Projects the blocks from a parsed document.
 */
export function projectExperimentalBlocks(document: ExperimentalEditorDocument): ProjectedBlock[] {
  return document.blocks;
}

/**
 * Applies a list of localized parches to the original source.
 */
export function applySourceEdits(source: string, edits: SourceEdit[]): SourceEditResult {
  // 1. Boundary & parameter validation
  for (const edit of edits) {
    if (edit.range.start < 0 || edit.range.end > source.length) {
      return { success: false, error: `Edit range [${edit.range.start}, ${edit.range.end}] is out of bounds for source length ${source.length}` };
    }
    if (edit.range.start > edit.range.end) {
      return { success: false, error: `Invalid negative edit range [${edit.range.start}, ${edit.range.end}]` };
    }

    // 2. Expected source verification (fail if source is obsolete)
    const currentText = source.slice(edit.range.start, edit.range.end);
    if (currentText !== edit.expectedSource) {
      return {
        success: false,
        error: `Expected source mismatch at range [${edit.range.start}, ${edit.range.end}]. Expected: ${JSON.stringify(edit.expectedSource)}, Found: ${JSON.stringify(currentText)}`
      };
    }
  }

  // 3. Sort edits descending by start offset to prevent shifting coordinates
  const sortedEdits = [...edits].sort((a, b) => b.range.start - a.range.start);

  // 4. Overlap detection
  for (let i = 0; i < sortedEdits.length - 1; i++) {
    const higher = sortedEdits[i];
    const lower = sortedEdits[i + 1];
    if (lower.range.end > higher.range.start) {
      return { success: false, error: `Overlapping edits detected between [${lower.range.start}, ${lower.range.end}] and [${higher.range.start}, ${higher.range.end}]` };
    }
  }

  // 5. Apply parches atomically
  let output = source;
  for (const edit of sortedEdits) {
    output = output.slice(0, edit.range.start) + edit.replacement + output.slice(edit.range.end);
  }

  return { success: true, output };
}

/**
 * Reparses the edited source content.
 */
export function reparseEditedDocument(source: string, edits: SourceEdit[]): ExperimentalEditorDocument {
  const result = applySourceEdits(source, edits);
  if (!result.success || result.output === undefined) {
    throw new Error(result.error || 'Failed to apply edits');
  }
  return parseExperimentalDocument(result.output);
}
