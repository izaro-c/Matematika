/**
 * Botón `cycle`: cada pulsación suma un paso y, pasado el máximo, vuelve al mínimo.
 * Se prueba sobre la tabla de `OperacionBinariaTabla`, cuyas casillas son botones `cycle`.
 */
import { describe, expect, it } from 'vitest';
import { cycleValueIndex, nextButtonTarget, nextCycleValue } from '@/diagrams/render/elements/diagramButton';
import { localizeDiagramSpec } from '@/diagrams/model/localizeDiagram';
import { parseDiagramSpecV3, type ControlObject, type DiagramSpecV3 } from '@/diagrams/public';
import { OperacionBinariaTablaSpec } from '@content/diagrams/Definiciones/OperacionBinariaTabla';

function spec(): DiagramSpecV3 {
  return structuredClone(OperacionBinariaTablaSpec) as DiagramSpecV3;
}

function cell(scene: DiagramSpecV3, id: string): ControlObject {
  const found = scene.objects.find(object => object.id === id);
  if (found?.objectType !== 'control') throw new Error(`Falta la casilla ${id}`);
  return found;
}

describe('botón cycle', () => {
  it('avanza un paso y vuelve al mínimo tras el máximo', () => {
    const range = { min: 0, max: 3, step: 1 };
    expect([0, 1, 2, 3].map(value => nextCycleValue(range, value))).toEqual([1, 2, 3, 0]);
    expect(nextCycleValue({ min: 0, max: 0.3, step: 0.1 }, 0.1 + 0.1)).toBeCloseTo(0.3);
    expect(nextCycleValue({ min: 0, max: 0.3, step: 0.1 }, 0.1 + 0.1 + 0.1)).toBe(0);
  });

  it('no anima: la pulsación no tiene destino propio', () => {
    expect(nextButtonTarget({ to: 3, durationMs: 0, easing: 'linear', behavior: 'cycle' }, 0, 2, undefined)).toEqual({ from: 2, to: 2 });
  });

  it('indexa valueLabels por (valor − min) / step', () => {
    expect(cycleValueIndex({ min: -1, step: 0.5 }, 0)).toBe(2);
  });

  it('las casillas de la tabla empiezan con a * b = máx(a, b)', () => {
    const scene = spec();
    for (let a = 0; a < 3; a += 1) {
      for (let b = 0; b < 3; b += 1) {
        const control = cell(scene, `c${a}${b}`);
        expect(control.action?.behavior).toBe('cycle');
        expect(control.value).toBe(Math.max(a, b));
      }
    }
  });

  it('exige un texto por valor y solo en botones cycle', () => {
    const missing = spec();
    cell(missing, 'c00').action!.valueLabels = ['$0$', '$1$'];
    expect(parseDiagramSpecV3(missing).success).toBe(false);

    const toggle = spec();
    cell(toggle, 'c00').action!.behavior = 'toggle';
    expect(parseDiagramSpecV3(toggle).success).toBe(false);

    expect(parseDiagramSpecV3(spec()).success).toBe(true);
  });

  it('traduce valueLabels por índice y hereda los vacíos', () => {
    const scene = spec();
    scene.translations = { ...scene.translations, en: { ...scene.translations?.en, valueLabels: { c00: ['zero', '', '', 'three'] } } };
    const localized = localizeDiagramSpec(scene, 'en');
    expect(cell(localized, 'c00').action?.valueLabels).toEqual(['zero', '$1$', '$2$', 'three']);
  });
});
