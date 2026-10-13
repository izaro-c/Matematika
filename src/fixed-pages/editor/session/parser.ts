export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'table'
  | 'separator'
  | 'formula'
  | 'exercise'
  | 'useCase'
  | 'biography'
  | 'demonstration'
  | 'diagram'
  | 'citation'
  | 'definition_box'
  | 'note'
  | 'advancedMdx';

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'inlineLatex'; value: string }
  | { type: 'conceptLink'; value: string; attrs: Record<string, any>; raw: string }
  | { type: 'refLink'; value: string; attrs: Record<string, any>; raw: string }
  | { type: 'interactiveElement'; value: string; attrs: Record<string, any>; raw: string }
  | { type: 'proofStepLink'; step: number; raw: string };

export interface ProofStepData {
  number: number;
  title: string;
  target?: string | string[];
  /** initial | omitido=auto | id/número = manual */
  diagramStep?: string | number;
  /** Clave en DemonstrationSection diagrams={{...}} cuando hay varios diagramas */
  diagramKey?: string;
  body?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, any>;
}

// Extrae atributos de una etiqueta JSX autocerrada o abierta (ej: key="value" o number={1})
export function parseAttributes(attributesStr: string): Record<string, any> {
  const attributes: Record<string, any> = {};
  // Captura attr="val", attr='val', attr={val} o attr=valor-simple.
  const regex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]+)\}|([A-Za-z0-9_.:-]+))/g;
  let match;
  while ((match = regex.exec(attributesStr)) !== null) {
    const name = match[1];
    const valStr = match[2] || match[3] || match[4] || match[5];
    
    // Intentar convertir a número si parece un número y estaba en llaves
    if (match[4] && !isNaN(Number(valStr))) {
      attributes[name] = Number(valStr);
    } else if (match[4] === 'true' || match[4] === 'false') {
      attributes[name] = match[4] === 'true';
    } else if (typeof valStr === 'string' && (valStr.startsWith('[') || valStr.startsWith('{'))) {
      try {
        attributes[name] = JSON.parse(valStr);
      } catch {
        attributes[name] = valStr;
      }
    } else {
      attributes[name] = valStr;
    }
  }
  return attributes;
}

function nextInlineMatch(regex: RegExp, text: string, start: number): RegExpExecArray | null {
  regex.lastIndex = start;
  return regex.exec(text);
}

function combinedConceptLink(
  value: string,
  interactiveAttrs: Record<string, any>,
  raw: string,
): Extract<InlineNode, { type: 'conceptLink' }> | null {
  const nested = value.trim().match(/^<ConceptLink\b([^>]*)>([\s\S]*?)<\/ConceptLink>$/);
  if (!nested) return null;
  const attrs = parseAttributes(nested[1] || '');
  return {
    type: 'conceptLink',
    value: nested[2] || '',
    attrs: {
      ...attrs,
      highlightTarget: attrs.highlightTarget || interactiveAttrs.target,
      highlightColor: attrs.highlightColor || interactiveAttrs.color,
    },
    raw,
  };
}

export function parseInlineNodes(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const componentRegex = /<(ConceptLink|InteractiveElement|RefLink)\b([^>]*)>([\s\S]*?)<\/\1>/g;
  const proofStepLinkRegex = /<ProofStepLink\b([^>]*)\/>/g;
  const latexRegex = /\$([^$\n]+)\$/g;
  const boldRegex = /(\*\*|__)([^*_\n]+)\1/g;
  const italicRegex = /([*_])([^*_\n]+)\1/g;
  let cursor = 0;

  while (cursor < text.length) {
    const candidates = [
      { kind: 'component' as const, match: nextInlineMatch(componentRegex, text, cursor) },
      { kind: 'proofStepLink' as const, match: nextInlineMatch(proofStepLinkRegex, text, cursor) },
      { kind: 'latex' as const, match: nextInlineMatch(latexRegex, text, cursor) },
      { kind: 'bold' as const, match: nextInlineMatch(boldRegex, text, cursor) },
      { kind: 'italic' as const, match: nextInlineMatch(italicRegex, text, cursor) },
    ]
      .filter((item): item is { kind: 'component' | 'proofStepLink' | 'latex' | 'bold' | 'italic'; match: RegExpExecArray } => Boolean(item.match))
      .sort((a, b) => a.match.index - b.match.index);

    const next = candidates[0];
    if (!next) break;

    if (next.match.index > cursor) {
      nodes.push({ type: 'text', value: text.substring(cursor, next.match.index) });
    }

    if (next.kind === 'component') {
      const tag = next.match[1];
      const attrs = parseAttributes(next.match[2] || '');
      const value = next.match[3] || '';
      const raw = next.match[0];
      if (tag === 'ConceptLink') nodes.push({ type: 'conceptLink', value, attrs, raw });
      if (tag === 'RefLink') nodes.push({ type: 'refLink', value, attrs, raw });
      if (tag === 'InteractiveElement') {
        nodes.push(combinedConceptLink(value, attrs, raw) ?? { type: 'interactiveElement', value, attrs, raw });
      }
    } else if (next.kind === 'proofStepLink') {
      const attrs = parseAttributes(next.match[1] || '');
      const step = Number(attrs.step ?? 1);
      nodes.push({ type: 'proofStepLink', step: isNaN(step) ? 1 : step, raw: next.match[0] });
    } else if (next.kind === 'latex') {
      nodes.push({ type: 'inlineLatex', value: next.match[1] });
    } else if (next.kind === 'bold') {
      nodes.push({ type: 'bold', value: next.match[2] });
    } else {
      nodes.push({ type: 'italic', value: next.match[2] });
    }

    cursor = next.match.index + next.match[0].length;
  }

  if (cursor < text.length) {
    nodes.push({ type: 'text', value: text.substring(cursor) });
  }

  return nodes;
}
