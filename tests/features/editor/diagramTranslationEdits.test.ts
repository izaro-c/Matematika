import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { localizeDiagramSpec } from '@/diagrams';
import { applyLocalizedModelEdit, updateElement, type VisualDiagramModel } from '@/fixed-pages/editor/diagrams/model';
import { parseDiagramSourceLocally } from '@/fixed-pages/editor/diagrams/source/parser';

function load(path: string): VisualDiagramModel {
  const model = parseDiagramSourceLocally(readFileSync(path, 'utf8'));
  if (!model) throw new Error(`No se pudo leer ${path}`);
  return model;
}

const panelOf = (model: VisualDiagramModel, id: string) => model.elements.find(element => element.id === id)!;

describe('edición de traducciones de diagramas', () => {
  it('traduce variantes y bloques de paneles al localizar', () => {
    const model = load('content/diagrams/Definiciones/Triangulo.tsx');
    const en = localizeDiagramSpec(model, 'en');
    const blocks = panelOf(en, 'infoPanel26').properties?.infoPanelBlocks ?? [];
    expect(blocks[0].text).toBe('**Scalene**');
    expect(blocks[0].rules?.[1].text).toBe('**Equilateral**');
    const v3Panel = en.objects.find(object => object.id === 'infoPanel26');
    expect(v3Panel && 'content' in v3Panel && v3Panel.content.blocks?.[1].text).toBe('*Acute*');
  });

  it('guarda como traducción los textos editados en otra lengua sin tocar el castellano', () => {
    const base = load('content/diagrams/Definiciones/Cuadrilatero.tsx');
    const localized = localizeDiagramSpec(base, 'eu');
    const panel = panelOf(localized, 'clasificacion');
    const rules = panel.properties!.textRules!.map((rule, index) => (index === 6 ? { ...rule, text: 'Trapezoide berria' } : rule));
    const edited = updateElement(localized, 'clasificacion', { properties: { ...panel.properties, textRules: rules, fontSize: 18 } });

    const next = applyLocalizedModelEdit(base, localized, edited, 'eu');
    const nextPanel = panelOf(next, 'clasificacion');
    expect(nextPanel.properties?.textRules?.[6].text).toBe(panelOf(base, 'clasificacion').properties?.textRules?.[6].text);
    expect(nextPanel.properties?.fontSize).toBe(18);
    expect(next.translations?.eu?.rules?.clasificacion?.[6]).toBe('Trapezoide berria');
    expect(next.translations?.eu?.rules?.clasificacion?.[0]).toBe(base.translations?.eu?.rules?.clasificacion?.[0]);
    expect(next.translations?.en).toEqual(base.translations?.en);
  });

  it('mantiene alineadas las traducciones al borrar una variante y al vaciar un bloque', () => {
    const base = load('content/diagrams/Definiciones/Triangulo.tsx');
    const localized = localizeDiagramSpec(base, 'en');
    const panel = panelOf(localized, 'infoPanel26');
    const [first, second] = panel.properties!.infoPanelBlocks!;
    const edited = updateElement(localized, 'infoPanel26', {
      properties: {
        ...panel.properties,
        infoPanelBlocks: [{ ...first, rules: first.rules!.filter((_, index) => index !== 0) }, { ...second, text: '' }],
      },
    });

    const next = applyLocalizedModelEdit(base, localized, edited, 'en');
    const baseBlocks = panelOf(base, 'infoPanel26').properties!.infoPanelBlocks!;
    expect(panelOf(next, 'infoPanel26').properties?.infoPanelBlocks?.[0].rules?.map(rule => rule.text)).toEqual(baseBlocks[0].rules!.slice(1).map(rule => rule.text));
    expect(next.translations?.en?.blocks?.infoPanel26?.['por-lados']?.rules).toEqual(['**Equilateral**', '**Isosceles**']);
    expect(next.translations?.en?.blocks?.infoPanel26?.['por-angulos']?.text).toBeUndefined();
  });

  it('las ediciones estructurales desde otra lengua no sobrescriben los textos base', () => {
    const base = load('content/diagrams/Definiciones/Triangulo.tsx');
    const localized = localizeDiagramSpec(base, 'eu');
    const edited = { ...localized, points: localized.points.map(point => (point.id === 'A' ? { ...point, x: point.x + 1 } : point)) };
    const next = applyLocalizedModelEdit(base, localized, edited, 'eu');
    expect(next.title).toBe(base.title);
    expect(next.note).toBe(base.note);
    expect(panelOf(next, 'infoPanel26')).toBe(panelOf(base, 'infoPanel26'));
    expect(next.points.find(point => point.id === 'A')?.x).toBe(base.points.find(point => point.id === 'A')!.x + 1);
    expect(next.translations).toEqual(base.translations);
  });
});
