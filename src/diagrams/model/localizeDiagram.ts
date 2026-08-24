import type { DiagramSpecV2, DiagramSpecV3, DiagramTranslation, DiagramObject } from './schema';

export function localizeDiagramSpec<T extends DiagramSpecV2 | DiagramSpecV3>(spec: T, lang?: string): T {
  if (!lang || !spec) return spec;
  const translations = (spec as { translations?: Record<string, DiagramTranslation> }).translations;
  if (!translations || !translations[lang]) return spec;

  const tr = translations[lang];
  const localized = { ...spec } as T;

  if (tr.title) localized.title = tr.title;
  if (tr.subtitle) (localized as any).subtitle = tr.subtitle;
  if (tr.note) localized.note = tr.note;
  if (tr.description) (localized as any).description = tr.description;

  // Localize steps
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

  // Helper for updating object properties with translations
  const getLocalizedProp = (id: string, currentProp: any, propKey: 'label' | 'title' | 'subtitle' | 'text' | 'description' | 'caption') => {
    let newVal = currentProp;
    if (propKey === 'label' && (tr.labels?.[id] || tr.titles?.[id])) {
      newVal = tr.labels?.[id] ?? tr.titles?.[id];
    } else if (propKey === 'title' && (tr.titles?.[id] || tr.labels?.[id])) {
      newVal = tr.titles?.[id] ?? tr.labels?.[id];
    } else if (propKey === 'subtitle' && tr.subtitles?.[id]) {
      newVal = tr.subtitles?.[id];
    } else if (propKey === 'text' && (tr.texts?.[id] || tr.annotations?.[id])) {
      newVal = tr.texts?.[id] ?? tr.annotations?.[id];
    } else if (propKey === 'description' && (tr.descriptions?.[id] || tr.annotations?.[id])) {
      newVal = tr.descriptions?.[id] ?? tr.annotations?.[id];
    } else if (propKey === 'caption' && (tr.annotations?.[id] || tr.texts?.[id])) {
      newVal = tr.annotations?.[id] ?? tr.texts?.[id];
    }
    return newVal;
  };

  // Localize v3 objects
  if (localized.version === 3 && Array.isArray((localized as unknown as DiagramSpecV3).objects)) {
    const v3 = localized as unknown as DiagramSpecV3;
    v3.objects = v3.objects.map((obj: DiagramObject): DiagramObject => {
      const updatedObj = { ...obj } as any;

      if (tr.labels?.[obj.id] || tr.titles?.[obj.id]) {
        updatedObj.label = tr.labels?.[obj.id] ?? tr.titles?.[obj.id];
      }
      if (tr.titles?.[obj.id] && updatedObj.title) {
        updatedObj.title = tr.titles[obj.id];
      }
      if (tr.subtitles?.[obj.id] && updatedObj.subtitle) {
        updatedObj.subtitle = tr.subtitles[obj.id];
      }

      // Handle obj.content
      if (updatedObj.content && typeof updatedObj.content === 'object') {
        const textVal = tr.texts?.[obj.id] ?? tr.annotations?.[obj.id];
        const titleVal = tr.titles?.[obj.id] ?? tr.labels?.[obj.id];
        const subVal = tr.subtitles?.[obj.id];
        const descVal = tr.descriptions?.[obj.id] ?? tr.annotations?.[obj.id];

        updatedObj.content = {
          ...updatedObj.content,
          ...(textVal ? { text: textVal } : {}),
          ...(titleVal ? { title: titleVal } : {}),
          ...(subVal ? { subtitle: subVal } : {}),
          ...(descVal ? { description: descVal } : {}),
        };
      }

      // Handle obj.properties
      if (updatedObj.properties && typeof updatedObj.properties === 'object') {
        const props = { ...updatedObj.properties };
        for (const k of ['label', 'title', 'subtitle', 'text', 'description', 'caption'] as const) {
          if (props[k] !== undefined) {
            props[k] = getLocalizedProp(obj.id, props[k], k);
          }
        }
        updatedObj.properties = props;
      }

      return updatedObj as DiagramObject;
    });
  }

  // Localize v2 points, elements, and sliders
  const anyLoc = localized as unknown as {
    points?: Array<{ id: string; label?: string }>;
    sliders?: Array<{ id: string; label?: string; name?: string; description?: string }>;
    elements?: Array<{ id: string; kind?: string; label?: string; title?: string; subtitle?: string; text?: string; description?: string; properties?: Record<string, any> }>;
  };

  if (Array.isArray(anyLoc.points)) {
    anyLoc.points = anyLoc.points.map(p => {
      const label = tr.labels?.[p.id] ?? tr.titles?.[p.id];
      return label ? { ...p, label } : p;
    });
  }

  if (Array.isArray(anyLoc.sliders)) {
    anyLoc.sliders = anyLoc.sliders.map(s => {
      const label = tr.labels?.[s.id] ?? tr.titles?.[s.id];
      const desc = tr.descriptions?.[s.id] ?? tr.annotations?.[s.id];
      return {
        ...s,
        ...(label ? { label, name: label } : {}),
        ...(desc ? { description: desc } : {}),
      };
    });
  }

  if (Array.isArray(anyLoc.elements)) {
    anyLoc.elements = anyLoc.elements.map(el => {
      const updated = { ...el };

      if (tr.labels?.[el.id] || tr.titles?.[el.id]) {
        updated.label = tr.labels?.[el.id] ?? tr.titles?.[el.id];
      }
      if (tr.titles?.[el.id]) {
        updated.title = tr.titles[el.id];
      }
      if (tr.subtitles?.[el.id]) {
        updated.subtitle = tr.subtitles[el.id];
      }
      if (tr.texts?.[el.id] || tr.annotations?.[el.id]) {
        updated.text = tr.texts?.[el.id] ?? tr.annotations?.[el.id];
      }
      if (tr.descriptions?.[el.id]) {
        updated.description = tr.descriptions[el.id];
      }

      if (updated.properties && typeof updated.properties === 'object') {
        const props = { ...updated.properties };
        for (const k of ['label', 'title', 'subtitle', 'text', 'description', 'caption'] as const) {
          if (props[k] !== undefined) {
            props[k] = getLocalizedProp(el.id, props[k], k);
          }
        }
        updated.properties = props;
      }

      return updated;
    });
  }

  return localized;
}
