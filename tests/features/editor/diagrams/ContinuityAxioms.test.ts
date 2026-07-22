import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import { buildTargets } from '../../../../src/features/editor/diagrams/model/selectors';
import { updateElement, updateSlider } from '../../../../src/features/editor/diagrams/model';
import {
  evaluateMathExpression,
  expressionVariables,
  withMovedPoint,
  type DiagramSpecV2,
} from '../../../../src/shared/diagrams/public';

const CASES = [
  {
    componentName: 'AxiomaArquimedes',
    source: 'src/widgets/diagrams/Axiomas/AxiomaArquimedes.tsx',
  },
  {
    componentName: 'AxiomaDedekind',
    source: 'src/widgets/diagrams/Axiomas/AxiomaDedekind.tsx',
  },
] as const;

function readModel(source: string): DiagramSpecV2 {
  const parsed = parseDiagramSourceAST(fs.readFileSync(source, 'utf8'));
  if (parsed.status !== 'visual-exact') {
    throw new Error(`${source} debe ser visual-exact: ${JSON.stringify(parsed.diagnostics)}`);
  }
  return parsed.model;
}

describe('axiomas de continuidad editables', () => {
  it.each(CASES)('$componentName se reabre y regenera byte a byte', ({ componentName, source }) => {
    const original = fs.readFileSync(source, 'utf8');
    const regenerated = generateDiagramSource(readModel(source), componentName);
    expect(regenerated.ok).toBe(true);
    if (regenerated.ok) expect(regenerated.source).toBe(original);
    expect(original).not.toContain('MathBoard');
    expect(original).not.toContain('onInit');
  });

  it('recalcula el rango arquimediano y alcanza el primer natural suficiente incluso con AB pequeño', () => {
    const model = readModel(CASES[0].source);
    const slider = model.sliders.find(item => item.id === 'n')!;
    const pBMin = model.points.find(item => item.id === 'pBMin')!;

    expect(slider).toMatchObject({
      min: 1,
      max: 7,
      step: 1,
      maxExpression: 'floor(segCD.length/segAB.length+0.000000001)+1',
    });
    const accumulatedPoint = model.points.find(item => item.id === 'pAccumulated');
    expect(accumulatedPoint).toMatchObject({
      constraint: 'derived',
      xExpression: 'pBase.x+n*abs(pB.x-pA.x)',
    });
    expect(accumulatedPoint?.dependencies).toHaveLength(4);
    expect(accumulatedPoint?.dependencies).toEqual(expect.arrayContaining(['pBase', 'n', 'pA', 'pB']));
    expect(model.elements.find(item => item.id === 'copyTicks')).toMatchObject({
      kind: 'measureTicks',
      properties: { tickDistanceExpression: 'abs(pB.x-pA.x)', minorTickCount: 0 },
    });

    const withSmallAB = withMovedPoint(model, 'pB', pBMin.x, pBMin.y);
    const smallVariables = expressionVariables(withSmallAB);
    const required = evaluateMathExpression(slider.maxExpression!, smallVariables);
    const ab = smallVariables['segAB.length'];
    const cd = smallVariables['segCD.length'];
    expect(required).toBeGreaterThan(40);
    expect((required - 1) * ab).toBeLessThanOrEqual(cd + 1e-9);
    expect(required * ab).toBeGreaterThan(cd);

    const atRequired = updateSlider(withSmallAB, 'n', { value: required });
    const variables = expressionVariables(atRequired);
    const accumulated = atRequired.elements.find(item => item.id === 'accumulatedAfter')!;
    expect(evaluateMathExpression(accumulated.properties!.visibleWhen!, variables)).toBe(1);

    const targets = buildTargets(model).map(target => target.id);
    expect(targets).toEqual(expect.arrayContaining([
      'pA',
      'pC',
      'segAB',
      'segCD',
      'n',
      'copiasAB',
      'acumulado',
      'nMinimo',
    ]));
  });

  it('conserva una cortadura exhaustiva con frontera móvil única', () => {
    const model = readModel(CASES[1].source);
    expect(model.points.find(item => item.id === 'pP')).toMatchObject({
      constraint: 'glider',
      gliderTarget: 'realLine',
      targetId: 'pP',
      selection: { ariaLabel: 'Punto de corte móvil P' },
    });
    expect(model.elements.find(item => item.id === 'rayL')).toMatchObject({
      kind: 'ray',
      refs: ['pP', 'pLeft'],
      color: 'carbon',
    });
    expect(model.elements.find(item => item.id === 'rayR')).toMatchObject({
      kind: 'ray',
      refs: ['pP', 'pRight'],
      color: 'salvia',
    });
    expect(model.groups.find(item => item.id === 'classL')).toMatchObject({ targetId: 'claseL', memberIds: ['rayL', 'labelL'] });
    expect(model.groups.find(item => item.id === 'classR')).toMatchObject({ targetId: 'claseR', memberIds: ['rayR', 'labelR'] });
    expect(buildTargets(model).map(target => target.id)).toEqual(expect.arrayContaining([
      'recta',
      'pP',
      'claseL',
      'claseR',
    ]));

    const moved = withMovedPoint(model, 'pP', 2.25, 1.7);
    expect(moved.points.find(item => item.id === 'pP')).toMatchObject({ x: 2.25, y: 0 });
    const readings = expressionVariables(moved);
    expect(readings['pP.x']).toBe(2.25);
    expect(evaluateMathExpression('pP.x-1', readings)).toBe(1.25);
    expect(evaluateMathExpression('pP.x+1', readings)).toBe(3.25);
  });

  it('conserva cambios hechos con los mismos comandos del inspector al guardar y reabrir', () => {
    const archimedes = updateElement(
      updateSlider(readModel(CASES[0].source), 'n', { value: 6 }),
      'accumulatedAfter',
      { color: 'musgo' },
    );
    const archimedesSource = generateDiagramSource(archimedes, 'AxiomaArquimedes');
    expect(archimedesSource.ok).toBe(true);
    if (archimedesSource.ok) {
      const reopened = parseDiagramSourceAST(archimedesSource.source);
      expect(reopened.status).toBe('visual-exact');
      if (reopened.status === 'visual-exact') expect(reopened.model).toEqual(archimedes);
    }

    const dedekind = updateElement(
      withMovedPoint(readModel(CASES[1].source), 'pP', -1.75, 0),
      'rayR',
      { style: { strokeWidth: 8, highlightStrokeWidth: 10, preserveColorOnHighlight: true } },
    );
    const dedekindSource = generateDiagramSource(dedekind, 'AxiomaDedekind');
    expect(dedekindSource.ok).toBe(true);
    if (dedekindSource.ok) {
      const reopened = parseDiagramSourceAST(dedekindSource.source);
      expect(reopened.status).toBe('visual-exact');
      if (reopened.status === 'visual-exact') expect(reopened.model).toEqual(dedekind);
    }
  });
});
