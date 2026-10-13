import type { DiagramInfoPanelBlock, DiagramPanelBlockTranslation, DiagramTextRule, DiagramTranslation } from '@/diagrams/model/schema';
import type { VisualDiagramModel, VisualElement, VisualPoint, VisualSlider, VisualStep } from '../types';

/**
 * Edición en una lengua distinta de la base (ES): el inspector trabaja sobre el modelo
 * localizado y aquí se separan los textos (van a `translations[lang]`) de los cambios
 * estructurales (van al modelo base, conservando sus textos en castellano).
 * Un texto vacío o igual al base elimina la traducción y vuelve a heredar el castellano.
 */

type TextMap = Record<string, string>;

function setText(map: TextMap | undefined, id: string, value: string | undefined, base: string | undefined): TextMap | undefined {
  const next = { ...(map ?? {}) };
  if (!value || value === base) delete next[id];
  else next[id] = value;
  return Object.keys(next).length ? next : undefined;
}

function withField<T extends object, K extends keyof T>(item: T, key: K, value: T[K] | undefined): T {
  const next = { ...item };
  if (value === undefined) delete next[key];
  else next[key] = value;
  return next;
}

/** Variantes: alinea por identidad (borrados/reordenados) y, si la longitud no cambia, por índice. */
function splitRules<R extends DiagramTextRule>(
  baseRules: readonly R[] | undefined,
  localizedRules: readonly R[] | undefined,
  nextRules: readonly R[],
): { base: R[]; texts: string[] | undefined } {
  const sameLength = nextRules.length === (localizedRules?.length ?? -1);
  const texts: string[] = [];
  const base = nextRules.map((rule, index) => {
    let sourceIndex = localizedRules?.indexOf(rule) ?? -1;
    if (sourceIndex < 0 && sameLength) sourceIndex = index;
    const baseRule = sourceIndex >= 0 ? baseRules?.[sourceIndex] : undefined;
    if (!baseRule) {
      texts.push('');
      return rule;
    }
    texts.push(rule.text && rule.text !== baseRule.text ? rule.text : '');
    return { ...rule, text: baseRule.text };
  });
  while (texts.length && !texts[texts.length - 1]) texts.pop();
  return { base, texts: texts.length ? texts : undefined };
}

function splitBlocks(
  baseBlocks: readonly DiagramInfoPanelBlock[] | undefined,
  localizedBlocks: readonly DiagramInfoPanelBlock[] | undefined,
  nextBlocks: readonly DiagramInfoPanelBlock[],
): { base: DiagramInfoPanelBlock[]; translations: Record<string, DiagramPanelBlockTranslation> | undefined } {
  const sameLength = nextBlocks.length === (localizedBlocks?.length ?? -1);
  const translations: Record<string, DiagramPanelBlockTranslation> = {};
  const base = nextBlocks.map((block, index) => {
    const localized = localizedBlocks?.find(candidate => candidate === block)
      ?? localizedBlocks?.find(candidate => candidate.id === block.id)
      ?? (sameLength ? localizedBlocks?.[index] : undefined);
    const baseBlock = localized ? baseBlocks?.find(candidate => candidate.id === localized.id) : undefined;
    if (!baseBlock) return block;
    const rules = block.rules ? splitRules(baseBlock.rules, localized?.rules, block.rules) : undefined;
    const tr: DiagramPanelBlockTranslation = {
      ...(block.title && block.title !== baseBlock.title ? { title: block.title } : {}),
      ...(block.text && block.text !== baseBlock.text ? { text: block.text } : {}),
      ...(rules?.texts ? { rules: rules.texts } : {}),
    };
    if (Object.keys(tr).length) translations[block.id] = tr;
    let nextBase = withField({ ...block, text: baseBlock.text }, 'title', baseBlock.title);
    if (rules) nextBase = { ...nextBase, rules: rules.base };
    return nextBase;
  });
  return { base, translations: Object.keys(translations).length ? translations : undefined };
}

function setRecord<V>(map: Record<string, V> | undefined, id: string, value: V | undefined): Record<string, V> | undefined {
  const next = { ...(map ?? {}) };
  if (value === undefined) delete next[id];
  else next[id] = value;
  return Object.keys(next).length ? next : undefined;
}

function splitElement(base: VisualElement, localized: VisualElement, edited: VisualElement, tr: DiagramTranslation): VisualElement {
  tr.labels = setText(tr.labels, edited.id, edited.label, base.label);
  let next: VisualElement = { ...edited, label: base.label };
  if (edited.text !== localized.text) {
    tr.texts = setText(tr.texts, edited.id, edited.text, base.text);
    if (tr.annotations?.[edited.id] && edited.text !== tr.annotations[edited.id]) tr.annotations = setText(tr.annotations, edited.id, undefined, undefined);
  }
  next = withField(next, 'text', base.text);

  const props = edited.properties;
  if (props) {
    const baseProps = base.properties ?? {};
    const localizedProps = localized.properties ?? {};
    let nextProps = { ...props };
    if (props.title !== localizedProps.title) tr.titles = setText(tr.titles, edited.id, props.title, baseProps.title);
    if (props.subtitle !== localizedProps.subtitle) tr.subtitles = setText(tr.subtitles, edited.id, props.subtitle, baseProps.subtitle);
    nextProps = withField(withField(nextProps, 'title', baseProps.title), 'subtitle', baseProps.subtitle);
    if (props.textRules) {
      const rules = splitRules(baseProps.textRules, localizedProps.textRules, props.textRules);
      tr.rules = setRecord(tr.rules, edited.id, rules.texts);
      nextProps.textRules = rules.base;
    }
    if (props.infoPanelBlocks) {
      const blocks = splitBlocks(baseProps.infoPanelBlocks, localizedProps.infoPanelBlocks, props.infoPanelBlocks);
      tr.blocks = setRecord(tr.blocks, edited.id, blocks.translations);
      nextProps.infoPanelBlocks = blocks.base;
    }
    next = { ...next, properties: nextProps };
  }
  return next;
}

function splitLabelled<T extends VisualPoint | VisualSlider>(base: T, edited: T, tr: DiagramTranslation): T {
  tr.labels = setText(tr.labels, edited.id, edited.label, base.label);
  return { ...edited, label: base.label };
}

function splitStep(base: VisualStep, localized: VisualStep, edited: VisualStep, tr: DiagramTranslation): VisualStep {
  const previous = tr.steps?.[edited.id];
  const current = typeof previous === 'string' ? { label: previous } : { ...(previous ?? {}) };
  if (edited.label !== localized.label) {
    if (edited.label && edited.label !== base.label) current.label = edited.label;
    else delete current.label;
  }
  if (edited.description !== localized.description) {
    if (edited.description && edited.description !== base.description) current.description = edited.description;
    else delete current.description;
  }
  tr.steps = setRecord(tr.steps, edited.id, Object.keys(current).length ? current : undefined);
  return {
    ...edited,
    label: base.label,
    description: base.description,
    // Los paneles de paso localizados no se editan aquí: se conserva el original si no cambió.
    objectStates: edited.objectStates === localized.objectStates ? base.objectStates : edited.objectStates,
  };
}

function mergeById<T extends { id: string }>(
  baseItems: readonly T[],
  localizedItems: readonly T[],
  editedItems: readonly T[],
  split: (base: T, localized: T, edited: T) => T,
): T[] {
  const baseById = new Map(baseItems.map(item => [item.id, item]));
  const localizedById = new Map(localizedItems.map(item => [item.id, item]));
  return editedItems.map(item => {
    const base = baseById.get(item.id);
    const localized = localizedById.get(item.id);
    if (!base || !localized) return item;
    if (item === localized) return base;
    return split(base, localized, item);
  });
}

export function applyLocalizedModelEdit(
  base: VisualDiagramModel,
  localized: VisualDiagramModel,
  edited: VisualDiagramModel,
  lang: string,
): VisualDiagramModel {
  const tr: DiagramTranslation = structuredClone(base.translations?.[lang] ?? {});
  if (edited.title !== localized.title) tr.title = edited.title && edited.title !== base.title ? edited.title : undefined;
  if (edited.note !== localized.note) tr.note = edited.note && edited.note !== base.note ? edited.note : undefined;

  const elements = mergeById(base.elements, localized.elements, edited.elements, (b, l, e) => splitElement(b, l, e, tr));
  const points = mergeById(base.points, localized.points, edited.points, (b, _l, e) => splitLabelled(b, e, tr));
  const sliders = mergeById(base.sliders, localized.sliders, edited.sliders, (b, _l, e) => splitLabelled(b, e, tr));
  const steps = mergeById(base.steps, localized.steps, edited.steps, (b, l, e) => splitStep(b, l, e, tr));

  const cleaned = Object.fromEntries(Object.entries(tr).filter(([, value]) => value !== undefined)) as DiagramTranslation;
  const translations = { ...(base.translations ?? {}) };
  if (Object.keys(cleaned).length) translations[lang] = cleaned;
  else delete translations[lang];

  const next: VisualDiagramModel = {
    ...edited,
    title: base.title,
    note: base.note,
    objects: edited.objects === localized.objects ? base.objects : edited.objects,
    elements,
    points,
    sliders,
    steps,
    translations,
  };
  if (!Object.keys(translations).length) delete next.translations;
  return next;
}
