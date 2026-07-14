import type { SourceRange } from './documentTypes';
import { readStaticEstreeValue } from './metadataProjection';

export type MdxAstNode = {
  type?: string;
  name?: string | null;
  depth?: number;
  value?: unknown;
  position?: {
    start?: { offset?: number; line?: number; column?: number };
    end?: { offset?: number; line?: number; column?: number };
  };
  attributes?: MdxAstNode[];
  children?: MdxAstNode[];
  data?: { estree?: MdxAstNode };
  [key: string]: unknown;
};

export interface RegisteredBlockProjection {
  blockType: string;
  editRange: SourceRange;
  data: Record<string, unknown>;
}

export const TRANSPARENT_JSX_CONTAINERS = new Set(['DemonstrationSection']);

/** JSX flow components with an explicit lossless mutation contract. */
export const SUPPORTED_JSX_BLOCKS = {
  Formula: 'formula',
  Separador: 'separator',
  Nota: 'note',
  Cita: 'citation',
  Definicion: 'definition_box',
  Demostracion: 'demonstration',
  Corolario: 'advancedMdx',
  Emparejar: 'advancedMdx',
  Clasificador: 'advancedMdx',
  Ordenacion: 'advancedMdx',
  MatrizInteractiva: 'advancedMdx',
  ProofStep: 'demonstration',
  PasoEjercicio: 'exercise',
  Resolucion: 'advancedMdx',
  Apoyo: 'advancedMdx',
  Hueco: 'advancedMdx',
  StudyTask: 'advancedMdx',
  Paso: 'advancedMdx',
  StudyPlanCheckpoint: 'advancedMdx',
  Solucion: 'advancedMdx',
  Pregunta: 'advancedMdx',
  ErrorComun: 'advancedMdx',
  Capitular: 'advancedMdx',
} as const;

/** Parsed syntax that is intentionally source-only, not opaque. */
export const PRESERVED_MDAST_NODE_TYPES = new Set([
  'mdxFlowExpression',
  'code',
  'html',
  'thematicBreak',
  'definition',
  'footnoteDefinition',
  'yaml',
]);

const STANDARD_BLOCK_TYPES: Record<string, string> = {
  paragraph: 'paragraph',
  heading: 'heading',
  list: 'list',
  table: 'table',
  math: 'formula',
  blockquote: 'advancedMdx',
};

function rangeOf(node: MdxAstNode): SourceRange | null {
  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;
  return typeof start === 'number' && typeof end === 'number' ? { start, end } : null;
}

function findOpeningTagEnd(source: string, start: number, end: number): number | null {
  let quote: '"' | "'" | '`' | null = null;
  let escaped = false;
  let braceDepth = 0;
  for (let index = start; index < end; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }
    if (character === '{') braceDepth += 1;
    else if (character === '}') braceDepth = Math.max(0, braceDepth - 1);
    else if (character === '>' && braceDepth === 0) return index;
  }
  return null;
}

export function jsxContentRange(source: string, node: MdxAstNode): SourceRange | null {
  const location = rangeOf(node);
  if (!location || !node.name) return null;
  const openingEnd = findOpeningTagEnd(source, location.start, location.end);
  if (openingEnd === null) return null;
  const openingSource = source.slice(location.start, openingEnd + 1);
  if (/\/\s*>$/.test(openingSource)) return null;
  const closingStart = source.lastIndexOf(`</${node.name}`, location.end);
  if (closingStart < openingEnd || closingStart >= location.end) return null;
  return { start: openingEnd + 1, end: closingStart };
}

function expressionFromProgram(program: MdxAstNode | undefined): MdxAstNode | null {
  const body = Array.isArray(program?.body) ? program.body as MdxAstNode[] : [];
  if (body.length !== 1 || body[0]?.type !== 'ExpressionStatement') return null;
  return body[0].expression as MdxAstNode | null;
}

function readJsxAttributes(source: string, node: MdxAstNode): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const attribute of node.attributes ?? []) {
    if (attribute.type !== 'mdxJsxAttribute' || typeof attribute.name !== 'string') continue;
    if (attribute.value === null || attribute.value === undefined) {
      result[attribute.name] = true;
      continue;
    }
    if (typeof attribute.value === 'string') {
      result[attribute.name] = attribute.value;
      continue;
    }
    const valueNode = attribute.value as MdxAstNode;
    const expression = expressionFromProgram(valueNode.data?.estree);
    if (expression) {
      try {
        result[attribute.name] = readStaticEstreeValue(expression);
        continue;
      } catch {
        // Dynamic attributes remain exact source strings and are never executed.
      }
    }
    // Dynamic attributes fallback to the raw expression content inside {}
    const attributeRange = rangeOf(attribute);
    if (attributeRange) {
      const rawAttr = source.slice(attributeRange.start, attributeRange.end).trim();
      const equalsIndex = rawAttr.indexOf('=');
      if (equalsIndex !== -1 && rawAttr.substring(0, equalsIndex).trim() === attribute.name) {
        const valuePart = rawAttr.substring(equalsIndex + 1).trim();
        if (valuePart.startsWith('{') && valuePart.endsWith('}')) {
          result[attribute.name] = valuePart.slice(1, -1).trim();
          continue;
        }
      }
      result[attribute.name] = rawAttr;
    } else {
      result[attribute.name] = '';
    }
  }
  return result;
}

// Registry dispatch is intentionally centralized so supported syntax remains explicit.
// eslint-disable-next-line sonarjs/cognitive-complexity
export function projectRegisteredBlock(source: string, node: MdxAstNode): RegisteredBlockProjection | null {
  const location = rangeOf(node);
  if (!location) return null;

  const standardType = node.type ? STANDARD_BLOCK_TYPES[node.type] : undefined;
  if (standardType) {
    let editRange = location;
    const data: Record<string, unknown> = { text: source.slice(location.start, location.end) };
    if (node.type === 'heading') {
      const children = node.children ?? [];
      const firstRange = children[0] ? rangeOf(children[0]) : null;
      const lastRange = children.length > 0 ? rangeOf(children[children.length - 1]) : null;
      if (firstRange && lastRange) editRange = { start: firstRange.start, end: lastRange.end };
      data.depth = node.depth;
      data.text = source.slice(editRange.start, editRange.end);
    }
    return { blockType: standardType, editRange, data };
  }

  if (node.type !== 'mdxJsxFlowElement' || !node.name) return null;
  const blockType = SUPPORTED_JSX_BLOCKS[node.name as keyof typeof SUPPORTED_JSX_BLOCKS];
  if (!blockType) return null;
  const contentRange = jsxContentRange(source, node);
  const editRange = contentRange ?? location;
  const attributes = readJsxAttributes(source, node);
  const data: Record<string, unknown> = {
    text: source.slice(editRange.start, editRange.end),
    component: node.name,
    attributes,
  };
  if (node.name === 'ProofStep') {
    data.steps = [{
      number: attributes.number ?? 1,
      title: attributes.title ?? '',
      justificacion: attributes.justificacion ?? '',
      target: attributes.target ?? '',
      body: source.slice(editRange.start, editRange.end),
      leanBlocks: Array.isArray(attributes.leanBlocks) ? attributes.leanBlocks : undefined,
      leanBlocksExpression: typeof attributes.leanBlocks === 'string' ? attributes.leanBlocks : undefined,
    }];
  }
  return { blockType, editRange, data };
}

export function serializeJsxBlock(component: string, content: string, attributes: Record<string, unknown> = {}): string {
  const processedAttrs: Record<string, { value: any; isExpression?: boolean }> = {};

  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined || value === null || value === '') continue;

    if (key.endsWith('Expression')) {
      const baseKey = key.slice(0, -10);
      if (attributes[baseKey] === undefined || attributes[baseKey] === null || attributes[baseKey] === '') {
        processedAttrs[baseKey] = { value: String(value), isExpression: true };
      }
    } else {
      processedAttrs[key] = { value };
    }
  }

  const serializedAttributes = Object.entries(processedAttrs)
    .map(([key, { value, isExpression }]) => {
      if (isExpression) return `${key}={${value}}`;
      if (typeof value === 'string') return `${key}=${JSON.stringify(value)}`;
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(' ');
  const suffix = serializedAttributes ? ` ${serializedAttributes}` : '';
  if (!content) return `<${component}${suffix} />`;
  return `<${component}${suffix}>\n${content}\n</${component}>`;
}

export function registeredBlockAttributes(blockType: string, data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') return {};
  const record = data as Record<string, unknown>;
  const attributes = record.attributes;
  if (attributes && typeof attributes === 'object' && !Array.isArray(attributes)) {
    return attributes as Record<string, unknown>;
  }
  if (blockType === 'heading' && typeof record.depth === 'number') return { level: record.depth };
  return {};
}

/** Canonical source is used only for newly inserted blocks; existing source is never normalized. */
export function serializeRegisteredBlock(
  blockType: string,
  data: { content?: string; metadata?: Record<string, unknown> } = {},
): string {
  const content = data.content ?? '';
  const metadata = data.metadata ?? {};
  if (blockType === 'paragraph') return content || 'Nuevo párrafo.';
  if (blockType === 'heading') return `${'#'.repeat(Number(metadata.level) || 3)} ${content || 'Nueva sección'}`;
  if (blockType === 'list') return (content || 'Primer elemento').split('\n').map((line, index) => (
    metadata.ordered === true ? `${index + 1}. ${line}` : `- ${line}`
  )).join('\n');
  if (blockType === 'table') return content || '| Magnitud | Valor |\n| --- | --- |\n| a | $1$ |';
  if (blockType === 'formula') return serializeJsxBlock('Formula', content || '  $$ x = y $$');
  if (blockType === 'separator') return '<Separador />';
  if (blockType === 'note') return serializeJsxBlock('Nota', content || 'Observación.');
  if (blockType === 'citation') return serializeJsxBlock('Cita', content || 'Cita.', metadata);
  if (blockType === 'definition_box') return serializeJsxBlock('Definicion', content || 'Definición.', metadata);
  if (blockType === 'exercise') return serializeJsxBlock('PasoEjercicio', content || 'Planteamiento.', metadata);
  if (blockType === 'demonstration') return serializeJsxBlock('ProofStep', content || 'Paso justificado.', metadata);
  if (blockType === 'advancedMdx' && typeof metadata.component === 'string') {
    const { component, ...attributes } = metadata;
    return serializeJsxBlock(component, content, attributes);
  }
  throw new Error(`No registered serializer for block type: ${blockType}`);
}
