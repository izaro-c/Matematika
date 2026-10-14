import { describe, expect, it } from 'vitest';
import { validateEditorDocument } from '@/fixed-pages/editor/session/validation';
import type { Block } from '@/fixed-pages/editor/session/parser';
import type { DiagramSpec } from '@/diagrams';
import diagramFixture from '../../fixtures/diagrams/diagram-spec.json';
import { expectDiagramKindsAlignedWithInspector } from '../../helpers/assertions';

const validDefinitionMetadata = {
  id: 'segmento',
  type: 'definicion',
  title: 'Segmento',
  description: 'Parte de una recta limitada por dos puntos.',
  subtype: 'nominal',
  authors: [],
};

describe('editor validation', () => {
  it('allows a minimal schema-compatible definition', () => {
    const result = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'intro',
          type: 'paragraph',
          content: 'Un segmento se define mediante dos extremos.',
        },
      ],
    });

    expect(result.canSave).toBe(true);
    expect(result.errorCount).toBe(0);
  });

  it('blocks invalid metadata and unsafe content patterns', () => {
    const result = validateEditorDocument({
      metadata: {
        ...validDefinitionMetadata,
        id: 'Segmento Malo',
        subtype: undefined,
      },
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'unsafe',
          type: 'paragraph',
          content: 'Ver [recta](recta) y usar \\sen(x).',
        },
      ],
    });

    expect(result.canSave).toBe(false);
    expect(result.issues.map(issue => issue.id)).toEqual(expect.arrayContaining([
      'metadata-id-kebab',
      'definition-subtype-required',
      'block-unsafe-markdown-link',
      'block-unsafe-sen',
    ]));
  });

  it('warns about incomplete proof steps without blocking save', () => {
    const blocks: Block[] = [
      {
        id: 'proof',
        type: 'demonstration',
        content: '',
        metadata: {
          steps: [
            {
              number: 1,
              title: 'Paso',
              body: 'Claramente se obtiene la conclusión.',
            },
          ],
        },
      },
    ];

    const result = validateEditorDocument({
      metadata: {
        id: 'demo-segmento',
        type: 'demostracion',
        title: 'Demostración',
        parentTheorem: 'segmento',
        proofMethod: 'metodo-directo',
        layout: 'split',
      },
      imports: '',
      exports: '',
      blocks,
    });

    expect(result.canSave).toBe(true);
    expect(result.errorCount).toBe(0);
    expect(result.warningCount).toBeGreaterThan(0);
    expect(result.issues.map(issue => issue.id)).toEqual(expect.arrayContaining([
      'proof-1-justification',
      'proof-1-interactive',
      'proof-1-visual-argument',
    ]));
  });

  function diagramResult(visualModel: unknown) {
    return validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [{ id: 'diagram-1', type: 'diagram', content: 'TrianguloEditor', metadata: { visualModel } }],
    });
  }

  it('accepts a valid DiagramSpec v3 visual model', () => {
    const result = diagramResult(diagramFixture);
    expect(result.issues.filter(issue => issue.severity === 'error')).toEqual([]);
  });

  it('rejects visual models that are not DiagramSpec v3', () => {
    const result = diagramResult({ points: [{ id: 'pA', constraint: 'diagonal' }], elements: [] });
    expect(result.canSave).toBe(false);
    expect(result.issues.map(issue => issue.id)).toContain('diagram-diagram-1-spec-version');
  });

  it('blocks broken visual diagram references before saving', () => {
    const spec = diagramFixture as unknown as DiagramSpec;
    const broken = {
      ...spec,
      objects: [
        ...spec.objects,
        { ...spec.objects.find(object => object.id === 'segAB')!, id: 'segAX', geometry: { type: 'segment', points: ['pA', 'pMissing'] } },
      ],
      steps: [{ id: 'step1', label: 'Paso', description: '', visibleTargets: ['segAB', 'missingTarget'] }],
    };
    const result = diagramResult(broken);
    expect(result.canSave).toBe(false);
    const messages = result.issues.map(issue => issue.message).join('\n');
    expect(messages).toContain('pMissing');
    expect(messages).toContain('missingTarget');
  });

  it('keeps every construction kind aligned with the inspector', () => {
    expect(() => expectDiagramKindsAlignedWithInspector()).not.toThrow();
  });

  it('allows saving MDX documents containing unresolved ConceptLink and metadata references', () => {
    const result = validateEditorDocument({
      metadata: {
        ...validDefinitionMetadata,
        requires: ['concepto-unresolved-1'],
        links: ['teorema-futuro-2'],
      },
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'para-1',
          type: 'paragraph',
          content: 'Texto con <ConceptLink targetId="id-no-resuelto">enlace no resuelto</ConceptLink>.',
        },
      ],
    });

    expect(result.canSave).toBe(true);
    expect(result.errorCount).toBe(0);
  });

  it('allows saving MDX documents with diagramStep="initial" or unresolved diagram targets', () => {
    const result = validateEditorDocument({
      metadata: {
        ...validDefinitionMetadata,
      },
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'demo-1',
          type: 'proof',
          content: 'Demostración de prueba',
          steps: [
            {
              number: 1,
              body: 'Paso con <InteractiveElement target="targetPendiente">elemento</InteractiveElement>',
              diagramStep: 'initial',
            },
          ],
        },
      ],
    });

    expect(result.canSave).toBe(true);
    expect(result.errorCount).toBe(0);
  });

  it('validates metadata edge cases (missing id, type, unknown type, language, demonstration requirements)', () => {
    // Missing id
    const resNoId = validateEditorDocument({
      metadata: { type: 'definicion', subtype: 'nominal' },
      imports: '',
      exports: '',
      blocks: [],
    });
    expect(resNoId.issues.map(i => i.id)).toContain('metadata-id-required');

    // Missing type
    const resNoType = validateEditorDocument({
      metadata: { id: 'test-node' },
      imports: '',
      exports: '',
      blocks: [],
    });
    expect(resNoType.issues.map(i => i.id)).toContain('metadata-type-required');

    // Unknown type
    const resUnknownType = validateEditorDocument({
      metadata: { id: 'test-node', type: 'tipo-invalido' },
      imports: '',
      exports: '',
      blocks: [],
    });
    expect(resUnknownType.issues.map(i => i.id)).toContain('metadata-type-known');

    // Demonstration requirements & unsupported lang
    const resDemo = validateEditorDocument({
      metadata: {
        id: 'demo-invalida',
        type: 'demostracion',
        lang: 'klingon',
        layout: 'invalido',
      },
      imports: '',
      exports: '',
      blocks: [],
    });
    expect(resDemo.issues.map(i => i.id)).toEqual(expect.arrayContaining([
      'demo-parent-required',
      'demo-layout-required',
      'metadata-lang-supported',
    ]));
  });

  it('validates proof step options, targets, and invalid diagramStep IDs', () => {
    const result = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'demo-block',
          type: 'demonstration',
          metadata: {
            steps: [
              {
                number: 1,
                body: 'Por hipótesis sabemos que A = B.',
                target: ['pA', 'pB'],
                diagramStep: 'Paso No Kebab Ni Numero',
              },
            ],
          },
        },
      ],
    });

    expect(result.issues.map(i => i.id)).toContain('proof-1-diagram-step');
  });

  it('validates empty demonstration block vs inferred single step demonstration block', () => {
    // Empty demonstration block
    const resEmpty = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'demo-empty',
          type: 'demonstration',
          content: '',
        },
      ],
    });
    expect(resEmpty.issues.map(i => i.id)).toContain('proof-demo-empty-empty');

    // Inferred demonstration block from surface fields
    const resInferred = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'demo-inferred',
          type: 'demonstration',
          content: 'Por definición de triángulo tenemos tres lados.',
          metadata: {
            title: 'Paso 1',
            number: 1,
            target: 'triangulo',
            diagramStep: '1',
          },
        },
      ],
    });
    expect(resInferred.issues.map(i => i.id)).not.toContain('proof-demo-inferred-empty');
  });

  it('validates retired diagram canvas and diagram step empty targets', () => {
    // Retired canvas
    const resRetired = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'diag-ret',
          type: 'diagram',
          content: 'InteractiveGeometryCanvas',
        },
      ],
    });
    expect(resRetired.issues.map(i => i.id)).toContain('diagram-diag-ret-retired-canvas');

    // Diagram with step with empty visibleTargets
    const validSpec = diagramFixture as unknown as DiagramSpec;
    const specWithEmptyStep = {
      ...validSpec,
      steps: [{ id: 'step-vacio', label: 'Vacio', description: '', visibleTargets: [] }],
    };
    const resEmptyTargets = diagramResult(specWithEmptyStep);
    expect(resEmptyTargets.issues.map(i => i.id)).toContain('diagram-diagram-1-step-vacio-empty');

    // Diagram with invalid v3 spec schema (e.g. non-array objects)
    const specInvalidV3 = {
      ...validSpec,
      objects: 'no-es-un-array',
    };
    const resInvalidV3 = diagramResult(specInvalidV3);
    expect(resInvalidV3.issues.some(i => i.id.startsWith('diagram-diagram-1-spec-'))).toBe(true);
  });

  it('validates tables, exercises, advanced MDX, and source level checks', () => {
    // Table without proper separator
    const resTableBad = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'tab-1',
          type: 'table',
          content: '| Col 1 | Col 2 |\n| No Separator | Data |',
        },
      ],
    });
    expect(resTableBad.issues.map(i => i.id)).toContain('block-tab-1-table-header');

    // Table with proper separator
    const resTableGood = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'tab-2',
          type: 'table',
          content: '| Col 1 | Col 2 |\n|---|---|\n| A | B |',
        },
      ],
    });
    expect(resTableGood.issues.map(i => i.id)).not.toContain('block-tab-2-table-header');

    // Exercise missing interactions and solutions
    const resExBad = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'ex-1',
          type: 'exercise',
          content: 'Calcula la hipotenusa de un triángulo.',
        },
      ],
    });
    expect(resExBad.issues.map(i => i.id)).toEqual(expect.arrayContaining([
      'block-ex-1-exercise-interaction',
      'block-ex-1-exercise-solution',
    ]));

    // Advanced MDX
    const resAdv = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'adv-1',
          type: 'advancedMdx',
          content: '<CustomComponent />',
        },
      ],
    });
    expect(resAdv.issues.map(i => i.id)).toContain('block-adv-1-advanced-mdx');

    // Source level checks: hex colors, \sen, and security findings
    const resSource = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: 'import "#112233"',
      exports: '',
      blocks: [
        {
          id: 'blk-visual',
          type: 'paragraph',
          content: 'Claramente observamos el color #aabbcc.',
        },
      ],
      rawBody: 'Uso de \\sen(x) en el cuerpo y <script>alert(1)</script>',
    });
    expect(resSource.issues.map(i => i.id)).toEqual(expect.arrayContaining([
      'block-blk-visual-hex',
      'block-blk-visual-visual-language',
      'source-hex',
      'source-sen',
    ]));
    expect(resSource.issues.some(i => i.area === 'source' && i.severity === 'error')).toBe(true);
  });
});
