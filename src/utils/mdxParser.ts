export interface ParsedMDX {
  metadata: any;
  imports: string;
  body: string;
}

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

export function stringifyMDX(metadata: any, imports: string, body: string): string {
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
