export type EditorResourceCapability =
  | 'visual-exact'
  | 'code-preview'
  | 'internal'
  | 'invalid';

export type EditorResourceKind = 'mdx-document' | 'diagram' | 'internal';

export interface EditorResourceCatalogEntry {
  path: string;
  name: string;
  type: string;
  kind: EditorResourceKind;
  capability: EditorResourceCapability;
  capabilityLabel: string;
  reason: string;
}

export const RESOURCE_CAPABILITY_LABELS: Record<EditorResourceCapability, string> = {
  'visual-exact': 'Edición visual exacta',
  'code-preview': 'Edición de código con vista previa',
  internal: 'Recurso interno',
  invalid: 'Recurso inválido',
};

export function isEditableCatalogResource(entry: EditorResourceCatalogEntry): boolean {
  return entry.kind !== 'internal' && entry.capability !== 'internal';
}
