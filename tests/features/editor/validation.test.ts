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
});
