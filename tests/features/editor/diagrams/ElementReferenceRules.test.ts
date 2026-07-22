import { describe, expect, it } from 'vitest';
import {
  gliderSupportElements,
  isGliderSupportKind,
  minimumRefsForKind,
  refsForKind,
  refsNeededForTool,
} from '../../../../src/features/editor/diagrams/model/referenceRules';
import type { ElementKind } from '../../../../src/features/editor/diagrams/model/types';

describe('ElementReferenceRules', () => {
  describe('refsForKind', () => {
    it('conserva todas las referencias en polígonos y descomposiciones de área', () => {
      const polygonRefs = ['pA', 'pB', 'pC', 'pD', 'pE'];
      expect(refsForKind('polygon', polygonRefs)).toEqual(polygonRefs);
      expect(refsForKind('areaDecomposition', polygonRefs)).toEqual(polygonRefs);
    });

    it('recorta referencias según los slots fijos del tipo', () => {
      expect(refsForKind('segment', ['pA', 'pB', 'pC'])).toEqual(['pA', 'pB']);
      expect(refsForKind('angle', ['pA', 'pB', 'pC', 'pD'])).toEqual(['pA', 'pB', 'pC']);
      expect(refsForKind('grid', ['pA', 'pB', 'pC', 'pD', 'pE'])).toEqual(['pA', 'pB', 'pC', 'pD']);
    });

    it('conserva referencias opcionales cuando se proporcionan', () => {
      expect(refsForKind('functionCurve', ['pA'])).toEqual(['pA']);
      expect(refsForKind('parametricCurve', ['pA'])).toEqual(['pA']);
      expect(refsForKind('infoPanel', ['segAB'])).toEqual(['segAB']);
      expect(refsForKind('functionCurve', [])).toEqual([]);
    });

    it('limita a una referencia los tipos de anotación simple', () => {
      expect(refsForKind('text', ['pA', 'pB'])).toEqual(['pA']);
      expect(refsForKind('label', ['segAB', 'pA'])).toEqual(['segAB']);
      expect(refsForKind('measureTicks', ['segAB', 'pA'])).toEqual(['segAB']);
    });
  });

  describe('minimumRefsForKind and refsNeededForTool', () => {
    it('exige al menos tres vértices en contornos repetibles', () => {
      expect(minimumRefsForKind('polygon')).toBe(3);
      expect(minimumRefsForKind('areaDecomposition')).toBe(3);
      expect(refsNeededForTool('polygon')).toBe(3);
      expect(refsNeededForTool('areaDecomposition')).toBe(3);
    });

    it('exige al menos dos áreas en una intersección', () => {
      expect(minimumRefsForKind('areaIntersection')).toBe(2);
      expect(refsNeededForTool('areaIntersection')).toBe(2);
    });

    it('alinea el mínimo con los slots semánticos de herramientas frecuentes', () => {
      const expectations: Array<[ElementKind, number]> = [
        ['segment', 2],
        ['circle', 2],
        ['arc', 3],
        ['grid', 4],
        ['poincareGeodesic', 4],
        ['measureTicks', 1],
        ['functionCurve', 0],
        ['infoPanel', 0],
        ['text', 1],
      ];
      for (const [kind, count] of expectations) {
        expect(minimumRefsForKind(kind)).toBe(count);
        expect(refsNeededForTool(kind)).toBe(count);
      }
    });

    it('no exige referencias para selección ni punto libre', () => {
      expect(refsNeededForTool('select')).toBe(0);
      expect(refsNeededForTool('point')).toBe(0);
    });
  });

  describe('glider support kinds', () => {
    it('reconoce soportes geométricos compatibles con gliders', () => {
      const supported: ElementKind[] = [
        'segment', 'line', 'ray', 'circle', 'arc', 'functionCurve', 'parametricCurve',
        'perpendicular', 'parallel', 'angleBisector', 'poincareGeodesic', 'poincareArc',
      ];
      for (const kind of supported) {
        expect(isGliderSupportKind(kind)).toBe(true);
      }
    });

    it('excluye regiones, marcas y puntos construidos', () => {
      const unsupported: ElementKind[] = [
        'polygon', 'areaDecomposition', 'grid', 'intersection', 'midpoint', 'angle', 'label',
      ];
      for (const kind of unsupported) {
        expect(isGliderSupportKind(kind)).toBe(false);
      }
    });

    it('filtra elementos del modelo por capacidad de soporte', () => {
      const elements = [
        { id: 'segAB', kind: 'segment' as const },
        { id: 'poly', kind: 'polygon' as const },
        { id: 'geo', kind: 'poincareGeodesic' as const },
      ];
      expect(gliderSupportElements(elements).map(item => item.id)).toEqual(['segAB', 'geo']);
    });
  });
});
