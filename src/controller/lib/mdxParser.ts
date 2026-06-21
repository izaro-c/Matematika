/**
 * Representa un archivo MDX descompuesto en sus 3 partes lógicas.
 */
export interface ParsedMDX {
  metadata: Record<string, unknown>;
  imports: string;
  body: string;
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
      // Usar new Function para evaluar el objeto literal (que puede tener comillas simples o sin comillas)
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
  const bodyLines: string[] = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('import ')) {
      importLines.push(line);
    } else {
      bodyLines.push(line);
    }
  }
  
  return {
    metadata,
    imports: importLines.join('\n').trim(),
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
 * @returns El código fuente combinado.
 */
export function stringifyMDX(metadata: Record<string, unknown>, imports: string, body: string): string {
  // Convertir a string JSON con formato y limpiar comillas en claves si se desea (aunque JSON estándar es válido)
  const metaString = JSON.stringify(metadata, null, 2);
  
  const parts = [];
  
  parts.push(`export const metadata = ${metaString};`);
  parts.push('');
  
  if (imports.trim()) {
    parts.push(imports.trim());
    parts.push('');
  }
  
  parts.push(body.trim());
  parts.push('');
  
  return parts.join('\n');
}
