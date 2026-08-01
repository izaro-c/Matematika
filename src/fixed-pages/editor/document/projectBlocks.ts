import type {
  BlockContainer,
  EditorDocument,
  ProjectedBlock,
  SourceLocation,
  VisualCompatibility,
} from './documentTypes';
import {
  PRESERVED_MDAST_NODE_TYPES,
  TRANSPARENT_JSX_CONTAINERS,
  jsxContentRange,
  projectRegisteredBlock,
  type MdxAstNode,
} from './blockRegistry';

function mapLocation(position: MdxAstNode['position']): SourceLocation {
  return {
    range: {
      start: position?.start?.offset ?? 0,
      end: position?.end?.offset ?? 0,
    },
    startLine: position?.start?.line,
    startColumn: position?.start?.column,
    endLine: position?.end?.line,
    endColumn: position?.end?.column,
  };
}

export interface BlockProjectionResult {
  blocks: ProjectedBlock[];
  containers: BlockContainer[];
  compatibility: VisualCompatibility;
}

export function projectBlocks(source: string, bodyNodes: MdxAstNode[]): BlockProjectionResult {
  const blocks: ProjectedBlock[] = [];
  const bodyStart = bodyNodes[0]?.position?.start?.offset ?? 0;
  const bodyEnd = bodyNodes[bodyNodes.length - 1]?.position?.end?.offset ?? bodyStart;
  const containers: BlockContainer[] = [{
    id: 'container-root',
    kind: 'root',
    contentRange: { start: bodyStart, end: bodyEnd },
  }];
  let sequence = 0;

  const projectNode = (node: MdxAstNode, parentId: string): void => {
    if (!node.position) return;
    const location = mapLocation(node.position);
    const nodeSource = source.slice(location.range.start, location.range.end);

    if (
      node.type === 'mdxJsxFlowElement'
      && node.name
      && TRANSPARENT_JSX_CONTAINERS.has(node.name)
    ) {
      const contentRange = jsxContentRange(source, node);
      if (!contentRange) {
        const id = `block-${sequence++}`;
        blocks.push({
          kind: 'opaque',
          id,
          source: nodeSource,
          location,
          reason: `Known JSX container <${node.name}> has no safe content range`,
          nodeType: node.type,
          parentId,
        });
        return;
      }
      const containerId = `container-${containers.length}`;
      containers.push({ id: containerId, kind: 'jsx-container', name: node.name, contentRange });
      for (const child of node.children ?? []) projectNode(child, containerId);
      return;
    }

    const id = `block-${sequence++}`;
    const registered = projectRegisteredBlock(source, node);
    if (registered) {
      blocks.push({
        kind: 'editable',
        id,
        blockType: registered.blockType,
        originalSource: source.slice(registered.editRange.start, registered.editRange.end),
        location,
        editRange: registered.editRange,
        data: registered.data,
        parentId,
      });
      return;
    }

    if (node.type && PRESERVED_MDAST_NODE_TYPES.has(node.type)) {
      blocks.push({
        kind: 'preserved',
        id,
        source: nodeSource,
        location,
        reason: `Recognized source-only syntax: ${node.type}`,
        nodeType: node.type,
        parentId,
      });
      return;
    }

    blocks.push({
      kind: 'opaque',
      id,
      source: nodeSource,
      location,
      reason: node.type === 'mdxJsxFlowElement'
        ? `Unregistered JSX block component: <${node.name ?? 'anonymous'}>`
        : `Unregistered AST node type: ${node.type ?? 'unknown'}`,
      nodeType: node.type,
      parentId,
    });
  };

  for (const node of bodyNodes) projectNode(node, 'container-root');

  const nonEditable = blocks.filter(block => block.kind !== 'editable');
  let compatibility: VisualCompatibility = 'fully-editable';
  if (blocks.length === 0 || nonEditable.length === blocks.length) compatibility = 'read-only';
  else if (nonEditable.length > 0) compatibility = 'partially-editable';
  return { blocks, containers, compatibility };
}

export function classifyVisualCompatibility(doc: EditorDocument): {
  compatibility: VisualCompatibility;
  reasons: string[];
} {
  if (doc.diagnostics.some(diagnostic => diagnostic.severity === 'critical')) {
    return {
      compatibility: 'unsupported',
      reasons: ['Document contains critical parse exceptions.'],
    };
  }

  if (doc.bodyBlocks.length === 0) {
    return {
      compatibility: 'read-only',
      reasons: ['Document body has no registered visual blocks.'],
    };
  }

  const nonEditable = doc.bodyBlocks.filter(block => block.kind !== 'editable');
  if (nonEditable.length === doc.bodyBlocks.length) {
    return {
      compatibility: 'read-only',
      reasons: nonEditable.map(block => `Block ${block.id} is ${block.kind}: ${block.reason}`),
    };
  }
  if (nonEditable.length > 0) {
    return {
      compatibility: 'partially-editable',
      reasons: nonEditable.map(block => `Block ${block.id} is ${block.kind}: ${block.reason}`),
    };
  }
  return { compatibility: 'fully-editable', reasons: [] };
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
    canSwitchFromCodeToVisual: compatibility !== 'unsupported',
  };
}
