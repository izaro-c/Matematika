import type { DiagramSpecV3, DiagramTranslation, DiagramObject, DiagramPanelBlockTranslation } from './schema';

type TextRule = { text: string };
type PanelBlock = { id: string; title?: string; text: string; rules?: TextRule[] };

/** Sustituye los textos de las variantes por índice; un hueco o "" conserva el texto base. */
export function localizeTextRules<T extends TextRule>(rules: T[] | undefined, texts: string[] | undefined): T[] | undefined {
  if (!rules || !texts?.length) return rules;
  return rules.map((rule, index) => (texts[index] ? { ...rule, text: texts[index] } : rule));
}

export function localizePanelBlocks<T extends PanelBlock>(blocks: T[] | undefined, translations: Record<string, DiagramPanelBlockTranslation> | undefined): T[] | undefined {
  if (!blocks || !translations) return blocks;
  return blocks.map(block => {
    const tr = translations[block.id];
    if (!tr) return block;
    return {
      ...block,
      ...(tr.title ? { title: tr.title } : {}),
      ...(tr.text ? { text: tr.text } : {}),
      ...(block.rules ? { rules: localizeTextRules(block.rules, tr.rules) } : {}),
    };
  });
}

export function localizeDiagramSpec<T extends DiagramSpecV3>(spec: T, lang?: string): T {
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
      const overlayTr = stepTr.overlays;
      const objectStates = overlayTr && step.objectStates
        ? Object.fromEntries(Object.entries(step.objectStates).map(([objectId, state]) => {
          const tr = overlayTr[objectId];
          if (!tr || !state?.overlay) return [objectId, state];
          return [objectId, {
            ...state,
            overlay: { ...state.overlay, title: tr.title ?? state.overlay.title, content: tr.content ?? state.overlay.content },
          }];
        }))
        : step.objectStates;
      return {
        ...step,
        label: stepTr.label ?? step.label,
        description: stepTr.description ?? step.description,
        ...(objectStates ? { objectStates } : {}),
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

  // Localize objects
  if (Array.isArray(localized.objects)) {
    localized.objects = localized.objects.map((obj: DiagramObject): DiagramObject => {
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
      const valueLabels = tr.valueLabels?.[obj.id];
      if (valueLabels && updatedObj.objectType === 'control' && updatedObj.action?.valueLabels) {
        updatedObj.action = {
          ...updatedObj.action,
          valueLabels: updatedObj.action.valueLabels.map((text: string, index: number) => valueLabels[index] || text),
        };
      }
      if (tr.ariaLabels?.[obj.id] && updatedObj.selection) {
        updatedObj.selection = { ...updatedObj.selection, ariaLabel: tr.ariaLabels[obj.id] };
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
          ...(updatedObj.content.rules ? { rules: localizeTextRules(updatedObj.content.rules, tr.rules?.[obj.id]) } : {}),
          ...(updatedObj.content.blocks ? { blocks: localizePanelBlocks(updatedObj.content.blocks, tr.blocks?.[obj.id]) } : {}),
        };
      }

      if (updatedObj.objectType === 'path' && updatedObj.geometry?.type === 'dimension' && updatedObj.geometry.text) {
        const textVal = tr.texts?.[obj.id] ?? tr.annotations?.[obj.id];
        if (textVal) updatedObj.geometry = { ...updatedObj.geometry, text: textVal };
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

  return localized;
}
