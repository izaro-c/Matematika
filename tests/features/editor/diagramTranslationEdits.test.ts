import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { localizeDiagramSpec, type AnnotationObject } from '@/diagrams';
import { movedTo, positionOf } from '../../helpers/diagramSpec';
import { applyLocalizedModelEdit, updateElement, type VisualDiagramModel } from '@/fixed-pages/editor/diagrams/model';
import { parseDiagramSourceLocally } from '@/fixed-pages/editor/diagrams/source/parser';

function load(path: string): VisualDiagramModel {
  const model = parseDiagramSourceLocally(readFileSync(path, 'utf8'));
  if (!model) throw new Error(`No se pudo leer ${path}`);
  return model;
}

const panelOf = (model: VisualDiagramModel, id: string) => model.objects.find(object => object.id === id) as AnnotationObject;

describe('edición de traducciones de diagramas', () => {
  it('traduce variantes y bloques de paneles al localizar', () => {
    const model = load('content/diagrams/Definiciones/Triangulo.tsx');
    const en = localizeDiagramSpec(model, 'en');
    const blocks = panelOf(en, 'infoPanel26').content.blocks ?? [];
    expect(blocks[0].text).toBe('**Scalene**');
    expect(blocks[0].rules?.[1].text).toBe('**Equilateral**');
    expect(blocks[1].text).toBe('*Acute*');
  });

  it('guarda como traducción los textos editados en otra lengua sin tocar el castellano', () => {
    const base = load('content/diagrams/Definiciones/Cuadrilatero.tsx');
    const localized = localizeDiagramSpec(base, 'eu');
    const panel = panelOf(localized, 'clasificacion');
    const [block] = panel.content.blocks!;
    const blocks = [{
      ...block,
      rules: block.rules!.map((rule, index) => (index === 6 ? { ...rule, text: 'Trapezoide berria' } : rule)),
    }];
    const edited = updateElement(localized, 'clasificacion', {
      content: { ...panel.content, blocks },
      appearance: { ...panel.appearance, fontSize: 18 },
    } as Partial<AnnotationObject>);

    const next = applyLocalizedModelEdit(base, localized, edited, 'eu');
    const nextPanel = panelOf(next, 'clasificacion');
    expect(nextPanel.content.blocks?.[0].rules?.[6].text).toBe(panelOf(base, 'clasificacion').content.blocks?.[0].rules?.[6].text);
    expect(nextPanel.appearance?.fontSize).toBe(18);
    expect(next.translations?.eu?.blocks?.clasificacion?.clasificacion?.rules?.[6]).toBe('Trapezoide berria');
    expect(next.translations?.eu?.blocks?.clasificacion?.clasificacion?.rules?.[0]).toBe(base.translations?.eu?.blocks?.clasificacion?.clasificacion?.rules?.[0]);
    expect(next.translations?.en).toEqual(base.translations?.en);
  });

  it('mantiene alineadas las traducciones al borrar una variante y al vaciar un bloque', () => {
    const base = load('content/diagrams/Definiciones/Triangulo.tsx');
    const localized = localizeDiagramSpec(base, 'en');
    const panel = panelOf(localized, 'infoPanel26');
    const [first, second] = panel.content.blocks!;
    const edited = updateElement(localized, 'infoPanel26', {
      content: {
        ...panel.content,
        blocks: [{ ...first, rules: first.rules!.filter((_, index) => index !== 0) }, { ...second, text: '' }],
      },
    } as Partial<AnnotationObject>);

    const next = applyLocalizedModelEdit(base, localized, edited, 'en');
    const baseBlocks = panelOf(base, 'infoPanel26').content.blocks!;
    expect(panelOf(next, 'infoPanel26').content.blocks?.[0].rules?.map(rule => rule.text)).toEqual(baseBlocks[0].rules!.slice(1).map(rule => rule.text));
    expect(next.translations?.en?.blocks?.infoPanel26?.['por-lados']?.rules).toEqual(['**Equilateral**', '**Isosceles**']);
    expect(next.translations?.en?.blocks?.infoPanel26?.['por-angulos']?.text).toBeUndefined();
  });

  it('las ediciones estructurales desde otra lengua no sobrescriben los textos base', () => {
    const base = load('content/diagrams/Definiciones/Triangulo.tsx');
    const localized = localizeDiagramSpec(base, 'eu');
    const edited = movedTo(localized, 'A', positionOf(localized, 'A').x + 1, positionOf(localized, 'A').y);
    const next = applyLocalizedModelEdit(base, localized, edited, 'eu');
    expect(next.title).toBe(base.title);
    expect(next.note).toBe(base.note);
    expect(panelOf(next, 'infoPanel26')).toBe(panelOf(base, 'infoPanel26'));
    expect(positionOf(next, 'A').x).toBe(positionOf(base, 'A').x + 1);
    expect(next.translations).toEqual(base.translations);
  });
});
