import type { DiagramSpecV2, DiagramSpecV3, DiagramTranslation, DiagramObject } from './schema';

export function localizeDiagramSpec<T extends DiagramSpecV2 | DiagramSpecV3>(spec: T, lang?: string): T {
  if (!lang || !spec) return spec;
  const translations = (spec as { translations?: Record<string, DiagramTranslation> }).translations;
  if (!translations || !translations[lang]) return spec;

  const tr = translations[lang];
  const localized = { ...spec } as T;

  if (tr.title) localized.title = tr.title;
  if (tr.note) localized.note = tr.note;

  if (tr.steps && Array.isArray(localized.steps)) {
    localized.steps = localized.steps.map(step => {
      const stepTr = tr.steps?.[step.id];
      if (!stepTr) return step;
      if (typeof stepTr === 'string') {
        return { ...step, label: stepTr };
      }
      return {
        ...step,
        label: stepTr.label ?? step.label,
        description: stepTr.description ?? step.description,
      };
    });
  }

  // Localize objects / elements / annotations
  if (localized.version === 3 && Array.isArray((localized as unknown as DiagramSpecV3).objects)) {
    const v3 = localized as unknown as DiagramSpecV3;
    v3.objects = v3.objects.map((obj: DiagramObject): DiagramObject => {
      if (obj.objectType === 'annotation' && tr.annotations?.[obj.id]) {
        return {
          ...obj,
          label: tr.labels?.[obj.id] ?? obj.label,
          content: {
            ...obj.content,
            text: tr.annotations[obj.id],
          },
        };
      }
      if (tr.labels?.[obj.id]) {
        return { ...obj, label: tr.labels[obj.id] };
      }
      return obj;
    });
  }

  // Also localize materialized scene points and elements (e.g. in VisualDiagramModel)
  const anyLoc = localized as unknown as { points?: Array<{ id: string; label?: string }>; elements?: Array<{ id: string; kind?: string; label?: string; text?: string }> };
  if (Array.isArray(anyLoc.points)) {
    anyLoc.points = anyLoc.points.map(p => {
      if (tr.labels?.[p.id]) {
        return { ...p, label: tr.labels[p.id] };
      }
      return p;
    });
  }

  if (Array.isArray(anyLoc.elements)) {
    anyLoc.elements = anyLoc.elements.map(el => {
      let updated = el;
      if (tr.labels?.[el.id]) {
        updated = { ...updated, label: tr.labels[el.id] };
      }
      if (el.kind === 'infoPanel' && tr.annotations?.[el.id]) {
        updated = {
          ...updated,
          text: tr.annotations[el.id],
        };
      }
      return updated;
    });
  }

  return localized;
}
