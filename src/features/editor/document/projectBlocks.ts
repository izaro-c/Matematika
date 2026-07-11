import type { ProjectedBlock, VisualCompatibility, EditorDocument } from './documentTypes';

function mapLocation(position: any) {
  return {
    range: { start: position?.start?.offset ?? 0, end: position?.end?.offset ?? 0 },
    startLine: position?.start?.line,
    startColumn: position?.start?.column,
    endLine: position?.end?.line,
    endColumn: position?.end?.column
  };
}

function isComplexParagraph(node: any): boolean {
  return !Array.isArray(node.children) || node.children.length !== 1 || node.children[0].type !== 'text';
}

export function projectBlocks(source: string, bodyNodes: any[]): { blocks: ProjectedBlock[]; compatibility: VisualCompatibility } {
  const blocks: ProjectedBlock[] = [];
  let compatibility: VisualCompatibility = 'fully-editable';

  if (!Array.isArray(bodyNodes)) {
    return { blocks, compatibility: 'unsupported' };
  }

  let index = 0;
  let hasOpaque = false;

  for (const node of bodyNodes) {
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
        const child = node.children?.[0];
        const editRange = child?.position ? mapLocation(child.position).range : location.range;
        blocks.push({
          kind: 'editable',
          id,
          blockType: 'paragraph',
          location,
          editRange,
          originalSource: source.slice(editRange.start, editRange.end),
          data: {
            text: source.slice(editRange.start, editRange.end)
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
        const child = node.children?.[0];
        const editRange = child?.position ? mapLocation(child.position).range : location.range;
        blocks.push({
          kind: 'editable',
          id,
          blockType: 'heading',
          location,
          editRange,
          originalSource: source.slice(editRange.start, editRange.end),
          data: {
            depth: node.depth,
            text: source.slice(editRange.start, editRange.end)
          }
        });
      }
    } else {
      hasOpaque = true;
      let reason = `Unsupported AST node type: ${node.type}`;
      
      if (node.type === 'mdxJsxFlowElement') {
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

  if (blocks.length > 0 && blocks.every(block => block.kind === 'opaque')) {
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

  const opacities = doc.bodyBlocks.filter(b => b.kind === 'opaque');
  
  if (doc.bodyBlocks.length === 0) {
    reasons.push('Document body has no editable visual blocks.');
    return { compatibility: 'read-only', reasons };
  }

  if (opacities.length === doc.bodyBlocks.length) {
    reasons.push('Document body contains only opaque blocks.');
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
