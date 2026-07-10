import { describe, expect, it } from 'vitest';
import { validateEditorDocument } from '@/features/editor/core/validation';
import type { Block } from '@/features/editor/core/parser';

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

  it('warns about proof steps without diagram interaction and blocks missing justification', () => {
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
              justificacion: '',
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
        proofMethod: 'directo',
        layout: 'split',
      },
      imports: '',
      exports: '',
      blocks,
    });

    expect(result.canSave).toBe(false);
    expect(result.issues.map(issue => issue.id)).toEqual(expect.arrayContaining([
      'proof-1-justification',
      'proof-1-interactive',
      'proof-1-visual-argument',
    ]));
  });

  it('blocks broken visual diagram references before saving', () => {
    const result = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'diagram-1',
          type: 'diagram',
          content: 'TrianguloEditor',
          metadata: {
            visualModel: {
              points: [{ id: 'pA', constraint: 'diagonal' }],
              elements: [
                { id: 'segAB', kind: 'segment', refs: ['pA', 'pB'] },
                { id: 'perpAB', kind: 'perpendicular', refs: ['pA', 'pA'] },
                { id: 'weird', kind: 'bezier', refs: ['pA'] },
              ],
              sliders: [{ id: 'slider1', min: 2, max: 1 }],
              steps: [{ id: 'step1', visibleTargets: ['segAB', 'missingTarget'] }],
            },
          },
        },
      ],
    });

    expect(result.canSave).toBe(false);
    expect(result.issues.map(issue => issue.id)).toEqual(expect.arrayContaining([
      'diagram-diagram-1-pA-constraint',
      'diagram-diagram-1-segAB-ref-pB',
      'diagram-diagram-1-perpAB-refs-min',
      'diagram-diagram-1-weird-kind',
      'diagram-diagram-1-slider1-range',
      'diagram-diagram-1-step1-target-missingTarget',
    ]));
  });

  it('allows glider points on valid visual supports and derived midpoint references', () => {
    const result = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'diagram-glider',
          type: 'diagram',
          content: 'LugarGeometricoEditor',
          metadata: {
            visualModel: {
              points: [
                { id: 'pA', constraint: 'fixed' },
                { id: 'pB', constraint: 'fixed' },
                { id: 'pP', constraint: 'glider', gliderTarget: 'lineMediatriz' },
              ],
              elements: [
                { id: 'midAB', kind: 'midpoint', refs: ['pA', 'pB'] },
                { id: 'lineMediatriz', kind: 'perpendicular', refs: ['pA', 'pB', 'midAB'] },
                { id: 'segPA', kind: 'segment', refs: ['pP', 'pA'] },
              ],
            },
          },
        },
      ],
    });

    expect(result.issues.map(issue => issue.id)).not.toContain('diagram-diagram-glider-lineMediatriz-ref-midAB');
    expect(result.issues.map(issue => issue.id)).not.toContain('diagram-diagram-glider-pP-glider-target-missing');
  });

  it('allows angle bisectors as visual targets and glider supports', () => {
    const result = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'diagram-bisector',
          type: 'diagram',
          content: 'BisectrizEditor',
          metadata: {
            visualModel: {
              points: [
                { id: 'pA', constraint: 'free' },
                { id: 'pB', constraint: 'free' },
                { id: 'pC', constraint: 'free' },
                { id: 'pP', constraint: 'glider', gliderTarget: 'bisABC' },
              ],
              elements: [
                { id: 'bisABC', kind: 'angleBisector', refs: ['pA', 'pB', 'pC'] },
                { id: 'segBP', kind: 'segment', refs: ['pB', 'pP'] },
              ],
            },
          },
        },
      ],
    });

    expect(result.canSave).toBe(true);
    expect(result.issues.map(issue => issue.id)).not.toContain('diagram-diagram-bisector-bisABC-kind');
    expect(result.issues.map(issue => issue.id)).not.toContain('diagram-diagram-bisector-pP-glider-target-missing');
  });

  it('allows guided geometric constructions with derived targets', () => {
    const result = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'diagram-guided-constructions',
          type: 'diagram',
          content: 'ConstruccionesGuiadasEditor',
          metadata: {
            visualModel: {
              points: [
                { id: 'pA', constraint: 'free' },
                { id: 'pB', constraint: 'free' },
                { id: 'pC', constraint: 'free' },
              ],
              elements: [
                { id: 'midAB', kind: 'midpoint', refs: ['pA', 'pB'] },
                { id: 'lineMediatrizAB', kind: 'perpendicular', refs: ['pA', 'pB', 'midAB'] },
                { id: 'segMedianaCAB', kind: 'segment', refs: ['pC', 'midAB'] },
                { id: 'footCAB', kind: 'perpendicularFoot', refs: ['pA', 'pB', 'pC'] },
                { id: 'extAlturaCAB', kind: 'baseExtension', refs: ['pA', 'pB', 'footCAB'] },
                { id: 'lineAlturaCAB', kind: 'perpendicular', refs: ['pA', 'pB', 'pC'] },
                { id: 'segAlturaCAB', kind: 'segment', refs: ['pC', 'footCAB'] },
                { id: 'rightAngleAlturaCAB', kind: 'rightAngle', refs: ['pA', 'footCAB', 'pC'] },
                { id: 'angleABC', kind: 'angle', refs: ['pA', 'pB', 'pC'] },
                { id: 'bisABC', kind: 'angleBisector', refs: ['pA', 'pB', 'pC'] },
              ],
              steps: [
                { id: 'step1', visibleTargets: ['midAB', 'lineMediatrizAB', 'segMedianaCAB', 'footCAB', 'extAlturaCAB', 'lineAlturaCAB', 'segAlturaCAB', 'rightAngleAlturaCAB', 'angleABC', 'bisABC'] },
              ],
            },
          },
        },
      ],
    });

    expect(result.canSave).toBe(true);
    expect(result.errorCount).toBe(0);
  });

  it('blocks glider points without a compatible support', () => {
    const result = validateEditorDocument({
      metadata: validDefinitionMetadata,
      imports: '',
      exports: '',
      blocks: [
        {
          id: 'diagram-bad-glider',
          type: 'diagram',
          content: 'LugarGeometricoEditor',
          metadata: {
            visualModel: {
              points: [{ id: 'pP', constraint: 'glider', gliderTarget: 'missingLine' }],
              elements: [],
            },
          },
        },
      ],
    });

    expect(result.canSave).toBe(false);
    expect(result.issues.map(issue => issue.id)).toContain('diagram-diagram-bad-glider-pP-glider-target-missing');
  });
});
