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
  | { type: 'interactiveElement'; value: string; attrs: Record<string, any>; raw: string };

export interface ProofStepData {
  number: number;
  title: string;
  justificacion: string;
  target?: string | string[];
  body?: string;
  justificationType?: 'hipotesis' | 'axioma' | 'teorema' | 'definicion' | 'paso-previo' | 'regla-logica' | 'construccion';
  dependencyId?: string;
  /** IDs Lean resueltos cuando la fuente contiene un array literal. Solo lectura en el editor. */
  leanBlocks?: string[];
  /** Expresión fuente (p. ej. metadata.stepTacticMap["1"]). Se conserva sin editar. */
  leanBlocksExpression?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, any>;
}

function componentTypeForName(componentName: string): BlockType {
  if (componentName === 'PasoEjercicio') return 'exercise';
  return 'advancedMdx';
}

function serializeAttribute(name: string, value: any): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'number' || typeof value === 'boolean') return `${name}={${value}}`;
  if (Array.isArray(value) || typeof value === 'object') return `${name}={${JSON.stringify(value)}}`;
  return `${name}="${String(value).replace(/"/g, '&quot;')}"`;
}

function serializeAttributes(attrs: Record<string, any>): string {
  return Object.entries(attrs)
    .map(([key, value]) => serializeAttribute(key, value))
    .filter(Boolean)
    .join(' ');
}

function serializeAttributeLines(attrs: Record<string, any>): string {
  return Object.entries(attrs)
    .map(([key, value]) => serializeAttribute(key, value))
    .filter(Boolean)
    .join('\n  ');
}

function serializeProofTarget(target: ProofStepData['target']): string {
  if (!target) return '';
  if (Array.isArray(target)) return `target={${JSON.stringify(target)}}`;
  return `target="${target}"`;
}

function markdownChunkToBlock(trimmed: string): Block {
  if (trimmed.startsWith('### ')) {
    return {
      id: createBlockId(),
      type: 'heading',
      content: trimmed.substring(4).trim(),
      metadata: { level: 3 }
    };
  }

  if (trimmed.startsWith('## ')) {
    return {
      id: createBlockId(),
      type: 'heading',
      content: trimmed.substring(3).trim(),
      metadata: { level: 2 }
    };
  }

  const lines = trimmed.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length > 0 && lines.every(line => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))) {
    return {
      id: createBlockId(),
      type: 'list',
      content: lines.map(line => line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')).join('\n'),
      metadata: { ordered: lines.every(line => /^\d+\.\s+/.test(line)) }
    };
  }

  if (
    lines.length >= 2 &&
    lines[0].startsWith('|') &&
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[1])
  ) {
    return {
      id: createBlockId(),
      type: 'table',
      content: lines.join('\n')
    };
  }

  return {
    id: createBlockId(),
    type: 'paragraph',
    content: trimmed
  };
}

// Genera un ID único para la key de React
export function createBlockId(prefix = 'block'): string {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
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

export function parseInlineNodes(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const componentRegex = /<(ConceptLink|InteractiveElement|RefLink)\b([^>]*)>([\s\S]*?)<\/\1>/g;
  const latexRegex = /\$([^$\n]+)\$/g;
  const boldRegex = /(\*\*|__)([^*_\n]+)\1/g;
  const italicRegex = /([*_])([^*_\n]+)\1/g;
  let cursor = 0;

  while (cursor < text.length) {
    const candidates = [
      { kind: 'component' as const, match: nextInlineMatch(componentRegex, text, cursor) },
      { kind: 'latex' as const, match: nextInlineMatch(latexRegex, text, cursor) },
      { kind: 'bold' as const, match: nextInlineMatch(boldRegex, text, cursor) },
      { kind: 'italic' as const, match: nextInlineMatch(italicRegex, text, cursor) },
    ]
      .filter((item): item is { kind: 'component' | 'latex' | 'bold' | 'italic'; match: RegExpExecArray } => Boolean(item.match))
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
      if (tag === 'InteractiveElement') nodes.push({ type: 'interactiveElement', value, attrs, raw });
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

/**
 * Convierte el cuerpo MDX a un array de bloques visuales editables.
 */
export function parseBodyToBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  const processedBody = body.trim();

  let lastIndexOffset = 0;

  // Separar el primer párrafo físico del resto del documento
  const doubleNewlineIndex = processedBody.search(/\n\s*\n/);
  const [firstParagraphRaw, textAfterFirstParagraph] = doubleNewlineIndex !== -1
    ? [
      processedBody.substring(0, doubleNewlineIndex).trim(),
      processedBody.substring(doubleNewlineIndex).trim(),
    ]
    : [processedBody, ''];

  // Buscar y limpiar el capitular al inicio del primer párrafo
  const capitularRegex = /^<Capitular\s+letra="([A-Z])"\s*(?:\/>|>(.*?)<\/Capitular>)/is;
  const capMatch = firstParagraphRaw.match(capitularRegex);
  if (capMatch) {
    const letra = capMatch[1];
    const resto = capMatch[2] || '';
    const firstParagraphClean = letra + resto + firstParagraphRaw.substring(capMatch[0].length);
    
    blocks.push({
      id: createBlockId(),
      type: 'paragraph',
      content: firstParagraphClean.trim()
    });
    
    lastIndexOffset = body.indexOf(textAfterFirstParagraph);
    if (lastIndexOffset === -1) lastIndexOffset = body.length;
  }

  // Expresiones regulares para bloques JSX específicos
  const formulaRegex = /<Formula>([\s\S]*?)<\/Formula>/g;
  const demoRegex = /<Demostracion>([\s\S]*?)<\/Demostracion>/g;
  const citationRegex = /<Cita\b([^>]*?)>([\s\S]*?)<\/Cita>/g;
  const defBoxRegex = /<Definicion\b([^>]*?)>([\s\S]*?)<\/Definicion>/g;
  const noteRegex = /<Nota>([\s\S]*?)<\/Nota>/g;
  const separatorRegex = /<Separador\s*\/>/g;
  const exerciseRegex = /<PasoEjercicio\b([^>]*?)>([\s\S]*?)<\/PasoEjercicio>/g;
  const advancedComponentRegex = /<(Apoyo|ErrorComun|Resolucion|Solucion|Pregunta|Hueco|Paso|Corolario|Emparejar|Clasificador|Ordenacion|MatrizInteractiva)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/\1>)/g;
  
  // Buscar diagramas autocerrados (ej. <TrianguloDeformable id="..." /> o cualquier componente que empiece por mayúscula)
  // Excluimos etiquetas estructurales conocidas como Formula, Demostracion, Cita, Definicion, Separador, Capitular, ProofStep, Nota.
  const diagramRegex = /<(?!Formula\b|Demostracion\b|Cita\b|Definicion\b|Separador\b|Capitular\b|ProofStep\b|Nota\b)([A-Z]\w+)\b([^>]*?)\/>/g;

  // Colección de todos los matches encontrados con su índice para ordenarlos
  interface MatchItem {
    type: BlockType;
    index: number;
    length: number;
    content: string;
    rawText: string;
    attributesStr?: string;
  }

  const matches: MatchItem[] = [];

  // Buscar Fórmulas
  let match;
  formulaRegex.lastIndex = 0;
  while ((match = formulaRegex.exec(body)) !== null) {
    matches.push({
      type: 'formula',
      index: match.index,
      length: match[0].length,
      content: match[1].trim(),
      rawText: match[0]
    });
  }

  // Buscar Demostraciones
  demoRegex.lastIndex = 0;
  while ((match = demoRegex.exec(body)) !== null) {
    // Parsear los ProofSteps internos
    const stepRegex = /<ProofStep\b([^>]*?)(?:\/>|>([\s\S]*?)<\/ProofStep>)/g;
    const steps: ProofStepData[] = [];
    let stepMatch;
    while ((stepMatch = stepRegex.exec(match[1])) !== null) {
      const attrs = parseAttributes(stepMatch[1]);
      steps.push({
        number: Number(attrs.number) || (steps.length + 1),
        title: attrs.title || '',
        justificacion: attrs.justificacion || '',
        target: attrs.target || '',
        body: (stepMatch[2] || '').trim(),
        justificationType: attrs.justificationType || undefined,
        dependencyId: attrs.dependencyId || '',
        leanBlocks: Array.isArray(attrs.leanBlocks) ? attrs.leanBlocks : undefined,
        leanBlocksExpression: typeof attrs.leanBlocks === 'string' ? attrs.leanBlocks : undefined,
      });
    }

    matches.push({
      type: 'demonstration',
      index: match.index,
      length: match[0].length,
      content: match[1].trim(),
      rawText: match[0],
      attributesStr: '',
      ...({ metadata: { steps } } as any)
    });
  }

  // Buscar Citas
  citationRegex.lastIndex = 0;
  while ((match = citationRegex.exec(body)) !== null) {
    matches.push({
      type: 'citation',
      index: match.index,
      length: match[0].length,
      content: match[2].trim(),
      rawText: match[0],
      attributesStr: match[1]
    });
  }

  // Buscar Definiciones
  defBoxRegex.lastIndex = 0;
  while ((match = defBoxRegex.exec(body)) !== null) {
    matches.push({
      type: 'definition_box',
      index: match.index,
      length: match[0].length,
      content: match[2].trim(),
      rawText: match[0],
      attributesStr: match[1]
    });
  }

  // Buscar Notas
  noteRegex.lastIndex = 0;
  while ((match = noteRegex.exec(body)) !== null) {
    matches.push({
      type: 'note',
      index: match.index,
      length: match[0].length,
      content: match[1].trim(),
      rawText: match[0]
    });
  }

  // Buscar Separadores
  separatorRegex.lastIndex = 0;
  while ((match = separatorRegex.exec(body)) !== null) {
    matches.push({
      type: 'separator',
      index: match.index,
      length: match[0].length,
      content: '',
      rawText: match[0]
    });
  }

  // Buscar bloques de ejercicio completos antes de sus componentes internos.
  exerciseRegex.lastIndex = 0;
  while ((match = exerciseRegex.exec(body)) !== null) {
    matches.push({
      type: 'exercise',
      index: match.index,
      length: match[0].length,
      content: match[2].trim(),
      rawText: match[0],
      attributesStr: match[1]
    });
  }

  // Buscar componentes MDX especiales que no tienen todavía un editor dedicado.
  advancedComponentRegex.lastIndex = 0;
  while ((match = advancedComponentRegex.exec(body)) !== null) {
    if (match[1] === 'Formula' || match[1] === 'PasoEjercicio') continue;
    matches.push({
      type: componentTypeForName(match[1]),
      index: match.index,
      length: match[0].length,
      content: (match[3] || '').trim(),
      rawText: match[0],
      attributesStr: match[2],
      ...({ componentName: match[1] } as any)
    });
  }

  // Buscar Diagramas
  diagramRegex.lastIndex = 0;
  while ((match = diagramRegex.exec(body)) !== null) {
    const componentName = match[1];
    matches.push({
      type: 'diagram',
      index: match.index,
      length: match[0].length,
      content: componentName,
      rawText: match[0],
      attributesStr: match[2]
    });
  }

  // Ordenar matches por su aparición en el texto
  matches.sort((a, b) => a.index - b.index || b.length - a.length);

  const nonOverlappingMatches: MatchItem[] = [];
  let coveredUntil = -1;
  for (const item of matches) {
    if (item.index < coveredUntil) continue;
    nonOverlappingMatches.push(item);
    coveredUntil = item.index + item.length;
  }

  let lastIndex = lastIndexOffset;

    for (const m of nonOverlappingMatches) {
      // Texto entre el último bloque procesado y este bloque JSX
      const textBetween = body.substring(lastIndex, m.index).trim();
      if (textBetween) {
        // Dividir el texto por dobles saltos de línea para generar párrafos o títulos
        const paragraphs = textBetween.split(/\n\s*\n+/);
        for (const p of paragraphs) {
          const trimmed = p.trim();
          if (trimmed) {
            blocks.push(markdownChunkToBlock(trimmed));
          }
        }
      }

    // Añadir el bloque JSX procesado
    if (m.type === 'formula') {
      blocks.push({
        id: createBlockId(),
        type: 'formula',
        content: m.content
      });
    } else if (m.type === 'demonstration') {
      const metadata = (m as any).metadata || { steps: [] };
      blocks.push({
        id: createBlockId(),
        type: 'demonstration',
        content: '',
        metadata
      });
    } else if (m.type === 'citation') {
      const attrs = parseAttributes(m.attributesStr || '');
      blocks.push({
        id: createBlockId(),
        type: 'citation',
        content: m.content,
        metadata: { author: attrs.author || '' }
      });
    } else if (m.type === 'definition_box') {
      const attrs = parseAttributes(m.attributesStr || '');
      blocks.push({
        id: createBlockId(),
        type: 'definition_box',
        content: m.content,
        metadata: { title: attrs.title || '' }
      });
    } else if (m.type === 'diagram') {
      const attrs = parseAttributes(m.attributesStr || '');
      blocks.push({
        id: createBlockId(),
        type: 'diagram',
        content: m.content, // Ej. TrianguloDeformable
        metadata: attrs
      });
    } else if (m.type === 'exercise') {
      const attrs = parseAttributes(m.attributesStr || '');
      blocks.push({
        id: createBlockId(),
        type: 'exercise',
        content: m.content,
        metadata: { component: 'PasoEjercicio', ...attrs }
      });
    } else if (m.type === 'advancedMdx') {
      const attrs = parseAttributes(m.attributesStr || '');
      blocks.push({
        id: createBlockId(),
        type: 'advancedMdx',
        content: m.content || m.rawText,
        metadata: { component: (m as any).componentName || 'MDX', rawText: m.rawText, ...attrs }
      });
    } else if (m.type === 'note') {
      blocks.push({
        id: createBlockId(),
        type: 'note',
        content: m.content
      });
    } else if (m.type === 'separator') {
      blocks.push({
        id: createBlockId(),
        type: 'separator',
        content: ''
      });
    }

    lastIndex = m.index + m.length;
  }

  // Texto restante después del último bloque JSX
  const remainingTextEnd = body.substring(lastIndex).trim();
  if (remainingTextEnd) {
    const paragraphs = remainingTextEnd.split(/\n\s*\n+/);
    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (trimmed) {
        blocks.push(markdownChunkToBlock(trimmed));
      }
    }
  }

  return blocks;
}

export function stringifyBlocksToBody(blocks: Block[]): string {
  const parts: string[] = [];
  let firstParagraphProcessed = false;

  for (const b of blocks) {
    if (b.type === 'paragraph') {
      if (!firstParagraphProcessed) {
        firstParagraphProcessed = true;
        const text = b.content.trim();
        if (text.length > 0) {
          const firstChar = text.charAt(0).toUpperCase();
          const restText = text.substring(1);
          parts.push(`<Capitular letra="${firstChar}" />${restText}`);
        } else {
          parts.push(b.content);
        }
      } else {
        parts.push(b.content);
      }
    } else if (b.type === 'heading') {
      const level = b.metadata?.level || 3;
      const hashes = '#'.repeat(level);
      parts.push(`${hashes} ${b.content}`);
    } else if (b.type === 'list') {
      const ordered = b.metadata?.ordered === true;
      const lines = b.content
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map((line, index) => ordered ? `${index + 1}. ${line}` : `- ${line}`);
      parts.push(lines.join('\n'));
    } else if (b.type === 'table') {
      parts.push(b.content.trim());
    } else if (b.type === 'separator') {
      parts.push('<Separador />');
    } else if (b.type === 'note') {
      parts.push(`<Nota>\n  ${b.content}\n</Nota>`);
    } else if (b.type === 'formula') {
      parts.push(`<Formula>\n  ${b.content}\n</Formula>`);
    } else if (b.type === 'citation') {
      const authorAttr = b.metadata?.author ? ` author="${b.metadata.author}"` : '';
      parts.push(`<Cita${authorAttr}>\n  ${b.content}\n</Cita>`);
    } else if (b.type === 'definition_box') {
      const titleAttr = b.metadata?.title ? ` title="${b.metadata.title}"` : '';
      parts.push(`<Definicion${titleAttr}>\n  ${b.content}\n</Definicion>`);
    } else if (b.type === 'exercise') {
      const attrs = { ...(b.metadata || {}) };
      delete attrs.component;
      const attrString = serializeAttributeLines(attrs);
      const attrLines = attrString ? `\n  ${attrString}` : '';
      const body = b.content.trim().replace(/\n/g, '\n  ');
      parts.push(`<PasoEjercicio${attrLines}\n>\n  ${body}\n</PasoEjercicio>`);
    } else if (b.type === 'advancedMdx') {
      const componentName = b.metadata?.component;
      if (componentName && componentName !== 'MDX') {
        const attrs = { ...(b.metadata || {}) };
        delete attrs.component;
        delete attrs.rawText;
        const attrString = serializeAttributes(attrs);
        const attrSuffix = attrString ? ` ${attrString}` : '';
        if (b.content.trim()) {
          const body = b.content.trim().replace(/\n/g, '\n  ');
          parts.push(`<${componentName}${attrSuffix}>\n  ${body}\n</${componentName}>`);
        } else {
          parts.push(`<${componentName}${attrSuffix} />`);
        }
      } else {
        parts.push(b.content.trim());
      }
    } else if (b.type === 'demonstration') {
      const steps = b.metadata?.steps || [];
      const stepParts = steps.map((s: ProofStepData) => {
        const attrs = [
          `number={${s.number}}`,
          serializeProofTarget(s.target),
          s.title ? `title="${s.title}"` : '',
          s.justificacion ? `justificacion="${s.justificacion}"` : '',
          s.justificationType ? `justificationType="${s.justificationType}"` : '',
          s.dependencyId ? `dependencyId="${s.dependencyId}"` : '',
          s.leanBlocks ? `leanBlocks={${JSON.stringify(s.leanBlocks)}}` : '',
          s.leanBlocksExpression ? `leanBlocks={${s.leanBlocksExpression}}` : '',
        ].filter(Boolean).join(' ');
        const body = s.body?.trim();
        if (!body) return `  <ProofStep ${attrs} />`;
        return `  <ProofStep ${attrs}>\n    ${body.replace(/\n/g, '\n    ')}\n  </ProofStep>`;
      });
      parts.push(`<Demostracion>\n${stepParts.join('\n')}\n</Demostracion>`);
    } else if (b.type === 'diagram') {
      const componentName = b.content;
      const attrs = b.metadata || {};
      const attrStrings = Object.entries(attrs).map(([k, v]) => {
        if (typeof v === 'number') return `${k}={${v}}`;
        if (typeof v === 'boolean') return `${k}={${v}}`;
        if (typeof v === 'object' && v !== null) {
          // Serializar objetos/arrays a un string JSON usando comillas simples fuera
          return `${k}='${JSON.stringify(v)}'`;
        }
        return `${k}="${v}"`;
      });
      const attrString = attrStrings.length > 0 ? ' ' + attrStrings.join(' ') : '';
      parts.push(`<${componentName}${attrString} />`);
    }
  }

  return parts.join('\n\n');
}
