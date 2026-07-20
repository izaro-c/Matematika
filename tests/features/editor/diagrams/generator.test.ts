import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { createTemplateModel, setPointAttractors, step } from '../../../../src/features/editor/diagrams/model/commands';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';

describe('DiagramSpec v2 TSX adapter generator', () => {
  it('preserves every v2 field through an exact generate-parse-generate roundtrip', () => {
    const base = createTemplateModel('circunferencia', 'Roundtrip completo', 'definicion');
    const model = {
      ...base,
      componentId: 'roundtrip-completo',
      category: 'Teoremas',
      mode: 'diagram' as const,
      axis: true,
      grid: true,
      viewport: { ...base.viewport, bounds: [-9, 8, 11, -7] as [number, number, number, number] },
      note: 'Overlay con expresión f(x) y pasos.',
      steps: [step('paso-expresion', 'Paso expresión', 'Evalúa f(x).', ['pO', 'circle'])],
      groups: [{
        id: 'circle-group', label: 'Circunferencia', memberIds: ['pO', 'pA', 'circle'], visible: true, locked: false,
        selection: { selectable: true, role: 'primary' as const },
      }],
      points: base.points.map(point => ({ ...point, groupIds: ['circle-group'] })),
      elements: base.elements.map(element => ({ ...element, groupIds: element.id === 'circle' ? ['circle-group'] : [] })),
    };
    const first = generateDiagramSource(model, 'RoundtripCompleto');
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const parsed = parseDiagramSourceAST(first.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model).toEqual(model);
    const second = generateDiagramSource(parsed.model, 'RoundtripCompleto');
    expect(second.ok && second.source).toBe(first.source);
  });

  it('roundtrips the three perpendicular-bisector attractors in Triangulo as valid exact TSX', () => {
    const source = readFileSync('src/widgets/diagrams/Definiciones/Triangulo.tsx', 'utf8');
    const initial = parseDiagramSourceAST(source);
    expect(initial.status).toBe('visual-exact');
    if (initial.status !== 'visual-exact') return;

    const withA = setPointAttractors(initial.model, 'A', ['lineMediatrizBC']);
    const withB = setPointAttractors(withA, 'B', ['lineMediatrizAC']);
    const withC = setPointAttractors(withB, 'C', ['lineMediatrizAB']);
    const generated = generateDiagramSource(withC, 'Triangulo');

    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const reopened = parseDiagramSourceAST(generated.source);
    expect(reopened.status).toBe('visual-exact');
    if (reopened.status !== 'visual-exact') return;
    expect(reopened.model.points.filter(point => ['A', 'B', 'C'].includes(point.id)).map(point => point.attractorIds)).toEqual([
      ['lineMediatrizBC'],
      ['lineMediatrizAC'],
      ['lineMediatrizAB'],
    ]);
    const regenerated = generateDiagramSource(reopened.model, 'Triangulo');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('generates a thin adapter around the shared renderer instead of duplicating MathFactory logic', () => {
    const result = generateDiagramSource(createTemplateModel('circunferencia', 'Círculo de prueba', 'definicion'), 'CirculoDePrueba');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.source).toContain("import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public'");
    expect(result.source).toContain('createDiagramSpec(');
    expect(result.source).toContain('export const CirculoDePrueba = () => <DiagramRenderer spec={CirculoDePruebaSpec} />;');
    expect(result.source).not.toContain('MathBoard');
    expect(result.source).not.toContain('createPoint');
  });

  it('keeps editor preview and published runtime on the same renderer import path', () => {
    const previewAdapter = readFileSync('src/features/editor/diagrams/ui/DiagramCanvas.tsx', 'utf8');
    const generated = generateDiagramSource(createTemplateModel('modelo-estatico', 'Ruta común', 'modelo'), 'RutaComun');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const sharedImport = "from '@/shared/diagrams/public'";
    expect(previewAdapter).toContain(`DiagramRenderer, withMovedPoint, withViewportBounds } ${sharedImport}`);
    expect(previewAdapter).not.toContain('<svg');
    expect(generated.source).toContain(`createDiagramSpec, DiagramRenderer } ${sharedImport}`);
    expect(generated.source).not.toContain('MathBoard');
  });

  it('reports schema paths for invalid IDs, missing points and dangling references', () => {
    const valid = createTemplateModel('circunferencia', 'Inválido', 'definicion');
    const invalid = {
      ...valid,
      componentId: '',
      points: [],
      elements: [{ ...valid.elements[0], refs: ['missing-a', 'missing-b'] }],
    };
    const result = generateDiagramSource(invalid, 'Invalido');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0].code).toBe('invalid-diagram-spec-v2');
    expect(result.diagnostics[0].message).toContain('componentId');
    expect(result.diagnostics[0].message).toContain('points');
  });

  it('rejects component names that cannot be exported safely', () => {
    const result = generateDiagramSource(createTemplateModel('modelo-estatico', 'Modelo', 'modelo'), 'not-valid');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'invalid-component-name' }));
  });
});
