import fs from 'fs';
import path from 'path';

const METADATA_EXPORT = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;

export type MdxMetadataResult =
  | { status: 'ok'; metadata: Record<string, unknown> }
  | { status: 'missing' }
  | { status: 'invalid'; error: unknown };

/** Evalúa el literal `export const metadata = { ... }` de un MDX del repositorio (contenido propio, de confianza). */
export function readMdxMetadata(content: string): MdxMetadataResult {
  const match = content.match(METADATA_EXPORT);
  if (!match) return { status: 'missing' };
  try {
    // eslint-disable-next-line sonarjs/code-eval -- internal script, trusted MDX content
    const metadata = new Function(`return ${match[1]}`)() as Record<string, unknown>;
    return { status: 'ok', metadata };
  } catch (error) {
    return { status: 'invalid', error };
  }
}

/** Lista recursivamente los `.mdx` bajo `dir` (vacío si no existe). */
export function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listMdxFiles(full));
    else if (entry.name.endsWith('.mdx')) files.push(full);
  }
  return files;
}
