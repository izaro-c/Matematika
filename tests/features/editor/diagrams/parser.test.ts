import { describe, it, expect } from 'vitest';
import { afterEach, vi } from 'vitest';
import { parseDiagramSourceLocally, parseDiagramSourceOnServer } from '../../../../src/fixed-pages/editor/diagrams/source/parser';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { generateDiagramSource } from '../../../../src/fixed-pages/editor/diagrams/source/generator';
import { createTemplateModel, element, modelElements, modelPoints } from '../../../../src/fixed-pages/editor/diagrams/model';
import { withObjectStylePatch } from '../../../../src/diagrams';

describe('Diagram TSX Parser (Local & AST)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should parse local JSON comment block successfully', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const gen = generateDiagramSource(model, 'Test');
    expect(gen.ok).toBe(true);
    if (gen.ok) {
      const parsed = parseDiagramSourceLocally(gen.source, 'definicion');
      expect(parsed).not.toBeNull();
      expect(parsed?.title).toBe('Test');
      expect(parsed && modelPoints(parsed)).toHaveLength(2);
    }
  });

  it('parses EjercicioClasificacionTriangulos.tsx source cleanly with local diagram parser', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const sourcePath = path.join(process.cwd(), 'content/diagrams/Ejercicios/EjercicioClasificacionTriangulos.tsx');
    let source = fs.readFileSync(sourcePath, 'utf8');
    const model = parseDiagramSourceLocally(source, 'ejercicio');
    expect(model).not.toBeNull();
    expect(model?.componentId).toBe('ejercicio-clasificacion-triangulos');

    const { classifyEmbeddedDiagramSource } = await import('../../../../src/fixed-pages/editor/diagrams/source/parser');
    const { generateDiagramSource } = await import('../../../../src/fixed-pages/editor/diagrams/source/generator');

    model!.showHeader = false;
    const gen = generateDiagramSource(model!, 'EjercicioClasificacionTriangulos');
    if (gen.ok) {
      fs.writeFileSync(sourcePath, gen.source, 'utf8');
      source = gen.source;
    }

    const res = classifyEmbeddedDiagramSource(source, 'ejercicio');
    expect(res?.status).toBe('visual-exact');
  });





  it('classifies generated source as exact only when the complete model roundtrips byte for byte', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const gen = generateDiagramSource(model, 'Test');
    expect(gen.ok).toBe(true);
    if (gen.ok) {
      const parsed = parseDiagramSourceAST(gen.source, 'definicion');
      expect(parsed.status).toBe('visual-exact');
      if (parsed.status !== 'visual-exact') return;
      expect(parsed.model.title).toBe('Test');
      expect(parsed.model.version).toBe(3);
      expect(parsed.model.viewport.bounds).toEqual([-5, 5, 5, -5]);
      expect(modelPoints(parsed.model)).toHaveLength(2);
      expect(modelElements(parsed.model)).toHaveLength(3);
      const regenerated = generateDiagramSource(parsed.model, 'Test');
      expect(regenerated.ok && regenerated.source).toBe(gen.source);
    }
  });

  it('should handle invalid syntax diagnostics in AST parser', () => {
    const brokenSource = `
      import { MathBoard } from '@/diagrams/jsxgraph/MathBoard';
      export const Broken = () => {
        return (
          <MathBoard
            boundingbox={[-5, 5, 5, -5]}
            onInit={(board, els, theme) => {
              // Syntax error below
              els["pA"] = createPoint(board, [0, 0]
            }}
          />
        );
      };
    `;
    const parsed = parseDiagramSourceAST(brokenSource, 'definicion');
    expect(parsed.status).toBe('invalid');
    expect(parsed.diagnostics.length).toBeGreaterThan(0);
  });

  it('returns null for missing, incomplete or invalid local model blocks', () => {
    expect(parseDiagramSourceLocally()).toBeNull();
    expect(parseDiagramSourceLocally('export const Manual = () => null;')).toBeNull();
    expect(parseDiagramSourceLocally('/* @matematika-diagram-model\n{"bad":')).toBeNull();
    expect(parseDiagramSourceLocally('/* @matematika-diagram-model\nnot json\n*/')).toBeNull();
  });

  it('normalizes server parser failures and aborts', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response('nope', { status: 500 }))
      .mockRejectedValueOnce(new DOMException('cancelled', 'AbortError'))
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'code-preview', diagnostics: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })));

    await expect(parseDiagramSourceOnServer('bad')).resolves.toMatchObject({
      status: 'invalid',
      diagnostics: [{ code: 'server-error' }],
    });
    await expect(parseDiagramSourceOnServer('abort')).resolves.toMatchObject({
      status: 'invalid',
      diagnostics: [{ code: 'aborted', severity: 'info' }],
    });
    await expect(parseDiagramSourceOnServer('network')).resolves.toMatchObject({
      status: 'invalid',
      diagnostics: [{ code: 'network-error' }],
    });
    await expect(parseDiagramSourceOnServer('manual')).resolves.toMatchObject({
      status: 'code-preview',
      diagnostics: [],
    });
  });

  it('classifies canonical embedded specs locally without consulting a stale dev-server parser', async () => {
    const model = createTemplateModel('triangulo-deformable', 'MarcasMedida', 'definicion');
    const ticks = element('ticks-segmento', 'Marcas de medida', 'measureTicks', ['segAB'], 'ocre', false);
    model.objects.push(withObjectStylePatch(
      { ...ticks, order: 30, selection: { selectable: true, role: 'secondary' }, ...(ticks.objectType === 'mark' ? { spacing: 1.5 } : {}) },
      { strokeWidth: 2, markHeight: 12 },
    ));
    const generated = generateDiagramSource(model, 'MarcasMedida');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    await expect(parseDiagramSourceOnServer(generated.source)).resolves.toMatchObject({
      status: 'visual-exact',
      model: {
        objects: expect.arrayContaining([
          expect.objectContaining({
            id: 'ticks-segmento',
            objectType: 'mark',
            variant: 'graduation',
            spacing: 1.5,
          }),
        ]),
      },
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('delegates an embedded spec rejected by the local contract to the dev-server parser', async () => {
    const model = createTemplateModel('triangulo-deformable', 'ContratoNuevo', 'definicion');
    const generated = generateDiagramSource(model, 'ContratoNuevo');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const locallyUnknown = generated.source.replace(
      '"relations": []',
      '"relations": [{"id":"future","label":"Contrato futuro","type":"future-relation","enabled":true}]',
    );
    const serverResult = { status: 'visual-exact', model, diagnostics: [] };
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify(serverResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchSpy);

    await expect(parseDiagramSourceOnServer(locallyUnknown)).resolves.toEqual(serverResult);
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it('never grants visual editing to TSX without an embedded spec', () => {
    const manual = `
      import { MathBoard } from '@/diagrams/jsxgraph/MathBoard';
      import { createPoint } from '@/diagrams/jsxgraph/MathFactory';
      import { DiagramInfoPanel } from '@/components/ui/DiagramOverlay';
      const curveExpression = (x: number) => Math.sin(x);
      const STEPS = [{ id: 'step-1', expression: curveExpression }];
      export const ManualCurve = () => (
        <MathBoard
          onInit={(board, els, theme) => {
            els.pA = createPoint(board, [0, 0], { name: 'A', fillColor: theme.terracota }, theme);
            els.curve = board.create('functiongraph', [curveExpression]);
          }}
        >
          <DiagramInfoPanel title="Curva" position="bottom-right">{STEPS.length}</DiagramInfoPanel>
        </MathBoard>
      );
    `;
    const parsed = parseDiagramSourceAST(manual);
    expect(parsed.status).toBe('code-preview');
    expect('model' in parsed).toBe(false);
    expect(parsed.diagnostics.some(item => item.code === 'diagram-without-spec')).toBe(true);
  });

  it('blocks visual regeneration when exact generated code gains an unrepresented overlay', () => {
    const model = createTemplateModel('circunferencia', 'Protegido', 'definicion');
    const generated = generateDiagramSource(model, 'Protegido');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const source = `${generated.source}\nexport const MANUAL_OVERLAY = { expression: () => Math.PI, steps: ['uno'] };\n`;
    const parsed = parseDiagramSourceAST(source);
    expect(parsed.status).toBe('code-preview');
    expect('model' in parsed).toBe(false);
    expect(parsed.diagnostics.some(item => item.code === 'embedded-spec-not-lossless')).toBe(true);
  });
});
