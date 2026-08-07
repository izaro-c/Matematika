export type EditorResourceCapability =
  | 'visual-exact'
  | 'code-preview'
  | 'internal'
  | 'invalid';

export type EditorResourceKind = 'mdx-document' | 'diagram' | 'internal';

export interface EditorResourceCatalogEntry {
  path: string;
  name: string;
  title?: string;
  type: string;
  kind: EditorResourceKind;
  capability: EditorResourceCapability;
  capabilityLabel: string;
  reason: string;
}

export const RESOURCE_CAPABILITY_LABELS: Record<EditorResourceCapability, string> = {
  'visual-exact': 'Editable',
  'code-preview': 'Solo fuente',
  internal: 'Recurso interno',
  invalid: 'Con errores',
};

export function isEditableCatalogResource(entry: EditorResourceCatalogEntry): boolean {
  return entry.kind !== 'internal' && entry.capability !== 'internal';
}
