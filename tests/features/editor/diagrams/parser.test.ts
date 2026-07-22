import { describe, it, expect } from 'vitest';
import { afterEach, vi } from 'vitest';
import { parseDiagramSourceLocally, parseDiagramSourceOnServer } from '../../../../src/features/editor/diagrams/source/parser';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model';

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
      expect(parsed?.points).toHaveLength(2);
    }
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
      expect(parsed.model.version).toBe(2);
      expect(parsed.model.viewport.bounds).toEqual([-5, 5, 5, -5]);
      expect(parsed.model.points).toHaveLength(2);
      expect(parsed.model.elements).toHaveLength(3);
      const regenerated = generateDiagramSource(parsed.model, 'Test');
      expect(regenerated.ok && regenerated.source).toBe(gen.source);
    }
  });

  it('should handle invalid syntax diagnostics in AST parser', () => {
    const brokenSource = `
      import { MathBoard } from '@/shared/diagrams/core/MathBoard';
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
    model.elements.push({
      id: 'ticks-segmento',
      label: 'Marcas de medida',
      kind: 'measureTicks',
      refs: ['segAB'],
      color: 'ocre',
      layerId: 'geometry',
      order: 30,
      visible: true,
      locked: false,
      groupIds: [],
      selection: { selectable: true, role: 'secondary' },
      target: false,
      properties: { tickDistance: 1.5 },
      style: { strokeWidth: 2, markHeight: 12 },
    });
    const generated = generateDiagramSource(model, 'MarcasMedida');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    await expect(parseDiagramSourceOnServer(generated.source)).resolves.toMatchObject({
      status: 'visual-exact',
      model: {
        elements: expect.arrayContaining([
          expect.objectContaining({
            kind: 'measureTicks',
            properties: { tickDistance: 1.5 },
            style: expect.objectContaining({ markHeight: 12 }),
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

  it('never grants visual editing because a partial AST contains a point', () => {
    const manual = `
      import { MathBoard } from '@/shared/diagrams/core/MathBoard';
      import { createPoint } from '@/shared/diagrams/core/MathFactory';
      import { DiagramInfoPanel } from '@/shared/ui/DiagramOverlay';
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
    expect(parsed.status === 'code-preview' && parsed.previewModel?.points).toHaveLength(1);
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
