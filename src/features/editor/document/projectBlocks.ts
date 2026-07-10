import { ProjectedBlock, VisualCompatibility, EditorDocument } from './documentTypes';
import { mapLocation } from './parseEditorDocument';

function isComplexParagraph(node: any): boolean {
  if (!node.children) return false;
  for (const child of node.children) {
    if (
      child.type === 'mdxJsxTextElement' ||
      child.type === 'mdxTextExpression' ||
      child.type === 'html' ||
      child.type === 'inlineMath'
    ) {
      return true;
    }
  }
  return false;
}

export function projectBlocks(source: string, ast: any): { blocks: ProjectedBlock[]; compatibility: VisualCompatibility } {
  const blocks: ProjectedBlock[] = [];
  let compatibility: VisualCompatibility = 'fully-editable';

  if (!ast || !ast.children) {
    return { blocks, compatibility: 'unsupported' };
  }

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
          reason: 'Paragraph contains complex JSX or HTML inline nodes',
          nodeType: node.type
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
      if (isComplexParagraph(node)) {
        hasOpaque = true;
        blocks.push({
          kind: 'opaque',
          id,
          source: nodeSource,
          location,
          reason: 'Heading contains complex JSX or HTML inline nodes',
          nodeType: node.type
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
        reason,
        nodeType: node.type
      });
    }
  }

  if (hasExports) {
    compatibility = 'read-only';
  } else if (hasOpaque) {
    compatibility = 'partially-editable';
  }

  return { blocks, compatibility };
}

export function classifyVisualCompatibility(doc: EditorDocument): { compatibility: VisualCompatibility; reasons: string[] } {
  const reasons: string[] = [];
  
  if (doc.diagnostics.some(d => d.severity === 'critical')) {
    reasons.push('Document contains critical parse exceptions.');
    return { compatibility: 'unsupported', reasons };
  }

  const opacities = doc.blocks.filter(b => b.kind === 'opaque');
  
  if (doc.blocks.length === 0) {
    return { compatibility: 'fully-editable', reasons };
  }

  const hasExports = opacities.some(b => b.nodeType === 'mdxjsEsm');
  if (hasExports) {
    reasons.push('Document has ESM imports or exports (read-only visual mode).');
    return { compatibility: 'read-only', reasons };
  }

  if (opacities.length > 0) {
    for (const b of opacities) {
      reasons.push(`Block ${b.id} is opaque: ${b.reason}`);
    }
    return { compatibility: 'partially-editable', reasons };
  }

  return { compatibility: 'fully-editable', reasons };
}

export function getVisualCapabilities(compatibility: VisualCompatibility): {
  canViewVisual: boolean;
  canEditSafeBlocks: boolean;
  canApplyVisualChanges: boolean;
  canSwitchFromCodeToVisual: boolean;
} {
  return {
    canViewVisual: compatibility !== 'unsupported',
    canEditSafeBlocks: compatibility === 'fully-editable' || compatibility === 'partially-editable',
    canApplyVisualChanges: compatibility === 'fully-editable' || compatibility === 'partially-editable',
    canSwitchFromCodeToVisual: compatibility !== 'unsupported'
  };
}
