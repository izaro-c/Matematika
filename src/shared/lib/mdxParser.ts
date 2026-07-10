export interface ParsedMDX {
  metadata: Record<string, unknown>;
  imports: string;
  body: string;
  exports: string;
}

function isTopLevelContent(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return !trimmed.startsWith('import ') && !trimmed.startsWith('export ');
}

function collectExportBlock(lines: string[], startIndex: number): { block: string; endIndex: number } {
  const block: string[] = [];
  let depth = 0;
  let seenBody = false;

  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];
    block.push(line);

    for (const char of line) {
      if (char === '{' || char === '(' || char === '[') depth += 1;
      if (char === '}' || char === ')' || char === ']') depth -= 1;
    }
    if (line.includes('=>') || line.includes('=')) seenBody = true;

    const trimmed = line.trim();
    if (
      seenBody &&
      depth <= 0 &&
      (trimmed.endsWith(';') || trimmed.endsWith('};') || trimmed.endsWith(');'))
    ) {
      return { block: block.join('\n'), endIndex: index };
    }

    if (index > startIndex && depth <= 0 && lines[index + 1] && isTopLevelContent(lines[index + 1])) {
      return { block: block.join('\n'), endIndex: index };
    }
  }

  return { block: block.join('\n'), endIndex: lines.length - 1 };
}

/**
 * Analiza sintácticamente un archivo MDX crudo para separar metadatos, importaciones y el cuerpo.
 * Utilizado principalmente en el entorno de edición en vivo (EditorPage).
 * 
 * @param content El contenido en texto crudo del archivo MDX.
 * @returns El objeto ParsedMDX estructurado.
 */
export function parseMDX(content: string): ParsedMDX {
  let metadata = {};
  
  // Expresión regular para capturar el bloque export const metadata = { ... };
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  
  if (match) {
    try {
      // eslint-disable-next-line sonarjs/code-eval -- metadata comes from trusted content files
      const fn = new Function(`return ${match[1]}`);
      metadata = fn();
    } catch (e) {
      console.error("Error parseando los metadatos del archivo MDX:", e);
    }
  }

  // Quitar el bloque de metadatos para procesar el resto
  const withoutMetadata = content.replace(metadataRegex, '');
  const lines = withoutMetadata.split('\n');
  
  const importLines: string[] = [];
  const exportLines: string[] = [];
  const bodyLines: string[] = [];
  
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();
    if (trimmed.startsWith('import ')) {
      importLines.push(line);
      index += 1;
    } else if (trimmed.startsWith('export const Simulation') || trimmed.startsWith('export const Component') || trimmed.startsWith('export const Diagram')) {
      const { block, endIndex } = collectExportBlock(lines, index);
      exportLines.push(block);
      index = endIndex + 1;
    } else {
      bodyLines.push(line);
      index += 1;
    }
  }
  
  return {
    metadata,
    imports: importLines.join('\n').trim(),
    exports: exportLines.join('\n').trim(),
    body: bodyLines.join('\n').trim()
  };
}

/**
 * Ensambla metadatos, importaciones y el cuerpo en un string MDX válido.
 * Utilizado por el Editor para previsualizar/guardar archivos.
 * 
 * @param metadata Objeto serializable con el frontmatter (zod).
 * @param imports Bloque de texto con los `import` de React.
 * @param body Cuerpo en markdown/JSX.
 * @param exports Bloque de texto con los `export` adicionales.
 * @returns El código fuente combinado.
 */
export function stringifyMDX(metadata: Record<string, unknown>, imports: string, body: string, exportsStr: string = ''): string {
  // Convertir a string JSON con formato y limpiar comillas en claves si se desea (aunque JSON estándar es válido)
  const metaString = JSON.stringify(metadata, null, 2);
  
  const parts = [];
  
  parts.push(`export const metadata = ${metaString};`);
  parts.push('');
  
  if (imports.trim()) {
    parts.push(imports.trim());
    parts.push('');
  }
  
  if (exportsStr.trim()) {
    parts.push(exportsStr.trim());
    parts.push('');
  }

  parts.push(body.trim());
  parts.push('');
  
  return parts.join('\n');
}
