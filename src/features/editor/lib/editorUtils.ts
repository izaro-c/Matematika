import type { WizardData } from '@/features/editor/hooks/useEditorState';

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

export function applyTypeSpecificMetadata(w: WizardData, meta: Record<string, unknown>): void {
  const typeHandlers: Record<string, () => void> = {
    theorems: () => {
      for (const f of [...COMMON_FIELDS, 'corollaries', 'demos'] as const) {
        applyFieldIfPresent(meta, w, f);
      }
    },
    definitions: () => {
      for (const f of COMMON_FIELDS) applyFieldIfPresent(meta, w, f);
    },
    demonstrations: () => {
      if (w.parentTheorem) meta.parentTheorem = w.parentTheorem;
      if (w.proofMethod) meta.proofMethod = w.proofMethod;
      for (const f of COMMON_FIELDS) applyFieldIfPresent(meta, w, f);
      if (w.lemmas) meta.lemmas = parseCSV(String(w.lemmas));
    },
    lessons: () => {
      if (w.tags) meta.tags = parseCSV(String(w.tags));
    },
    models: () => {
      if (w.satisfies) meta.satisfies = w.satisfies;
      if (w.axioms_verified) meta.axioms_verified = parseCSV(String(w.axioms_verified));
      if (w.hasDiagram) meta.hasDiagram = w.hasDiagram;
    },
  };
  typeHandlers[w.type]?.();
}
