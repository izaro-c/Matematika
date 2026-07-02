import type { WizardData } from '@/features/editor/lib/editorContracts';

export function applyTemplateReplacements(template: string, w: WizardData): string {
  return template
    .replace(/\{\{ID\}\}/g, w.id)
    .replace(/\{\{TITLE\}\}/g, w.title)
    .replace(/\{\{FIRST_LETTER\}\}/g, w.title.charAt(0))
    .replace(/\{\{DESCRIPTION\}\}/g, w.description)
    .replace(/\{\{COLOR\}\}/g, w.color)
    .replace(/\{\{ERA\}\}/g, w.era)
    .replace(/\{\{BIRTH\}\}/g, w.birth)
    .replace(/\{\{DEATH\}\}/g, w.death);
}

function parseCSV(str: string): string[] {
  return str.split(',').map(s => s.trim()).filter(s => s);
}

const COMMON_FIELDS = ['authors', 'tags'] as const;

function applyFieldIfPresent(meta: Record<string, unknown>, w: WizardData, field: string): void {
  const value = (w as unknown as Record<string, unknown>)[field];
  if (value) meta[field] = parseCSV(String(value));
}

export function applyTypeSpecificMetadata(
  w: WizardData,
  meta: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...meta, id: w.id };
  const typeHandlers: Record<string, () => void> = {
    theorems: () => {
      result.type = 'teorema';
      result.color = w.color;
      for (const f of [...COMMON_FIELDS, 'corollaries', 'demos'] as const) {
        applyFieldIfPresent(result, w, f);
      }
    },
    definitions: () => {
      result.type = 'definicion';
      result.color = w.color;
      for (const f of COMMON_FIELDS) applyFieldIfPresent(result, w, f);
    },
    demonstrations: () => {
      result.type = 'demostracion';
      if (w.parentTheorem) result.parentTheorem = w.parentTheorem;
      if (w.proofMethod) result.proofMethod = w.proofMethod;
      for (const f of COMMON_FIELDS) applyFieldIfPresent(result, w, f);
      if (w.lemmas) result.lemmas = parseCSV(String(w.lemmas));
    },
    lessons: () => {
      result.type = 'leccion';
      if (w.tags) result.tags = parseCSV(String(w.tags));
    },
    mathematicians: () => {
      result.type = 'matematico';
    },
    models: () => {
      result.type = 'modelo';
      if (w.satisfies) result.satisfies = w.satisfies;
      if (w.axioms_verified) result.axioms_verified = parseCSV(String(w.axioms_verified));
      if (w.hasDiagram) result.hasDiagram = w.hasDiagram;
    },
  };
  typeHandlers[w.type]?.();
  return result;
}
