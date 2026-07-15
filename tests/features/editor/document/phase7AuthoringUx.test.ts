import { describe, expect, it } from 'vitest';
import {
  applyMutationPlan,
  parseEditorDocument,
  planBlockUpdate,
  planDiagramBinding,
} from '@/features/editor/document';
import {
  buildAuthoringIntegrityReport,
  buildDocumentOutline,
  createPagePath,
  createPageSource,
  extractSemanticReferences,
  PAGE_TYPE_DIRECTORIES,
} from '@/features/editor/ux/authoringModel';
import type { Block } from '@/features/editor/core/parser';

const definitionSource = `export const metadata = {
  "id": "definicion-prueba",
  "type": "definicion",
  "title": "Definición de prueba",
  "description": "Documento complejo de aceptación.",
  "subtype": "nominal"
};

<Definicion title="Original">
Texto <ConceptLink targetId="punto">inicial</ConceptLink>.
</Definicion>

<FutureWidget keep={{ nested: true }} />
`;

describe('Phase 7 lossless authoring UX', () => {
  it('updates structured JSX attributes and content through one localized phase-6 plan', () => {
    const document = parseEditorDocument(definitionSource);
    const block = document.bodyBlocks.find(item => item.kind === 'editable' && item.blockType === 'definition_box');
    expect(block).toBeDefined();
    const mutation = planBlockUpdate(document, block!.id, {
      content: 'Texto actualizado con <RefLink targetId="recta">referencia</RefLink>.',
      metadata: { title: 'Definición rigurosa' },
    });
    const updated = applyMutationPlan(document, mutation);

    expect(mutation.preview.requiresReview).toBe(true);
    expect(updated.source).toContain('<Definicion title="Definición rigurosa">');
    expect(updated.source).toContain('<RefLink targetId="recta">referencia</RefLink>');
    expect(updated.source).toContain('<FutureWidget keep={{ nested: true }} />');
    expect(updated.source.split('<FutureWidget')[0]).not.toContain('Original');
  });

  it('binds diagram import, published export and metadata in one reviewed multi-region mutation', () => {
    const document = parseEditorDocument(definitionSource);
    const mutation = planDiagramBinding(document, {
      componentName: 'RectaInteractiva',
      importPath: '@/widgets/diagrams/Definiciones/RectaInteractiva',
      mode: 'simulation',
    });
    const updated = applyMutationPlan(document, mutation);

    expect(mutation.kind).toBe('bind-diagram');
    expect(mutation.preview.requiresReview).toBe(true);
    expect(mutation.edits.length).toBeGreaterThanOrEqual(2);
    expect(updated.source).toContain("import { RectaInteractiva } from '@/widgets/diagrams/Definiciones/RectaInteractiva';");
    expect(updated.source).toContain('export const Simulation = RectaInteractiva;');
    expect(updated.metadata.value?.hasSimulation).toBe(true);
    expect(updated.source).toContain('<FutureWidget keep={{ nested: true }} />');
  });

  it('projects outline, semantic references and actionable integrity diagnostics', () => {
    const document = parseEditorDocument(definitionSource.replace('targetId="punto"', 'targetId="no-existe"'));
    const blocks: Block[] = document.bodyBlocks.map(block => ({
      id: block.id,
      type: block.kind === 'editable' ? block.blockType : 'advancedMdx',
      content: block.kind === 'editable' && typeof (block.data as { text?: unknown }).text === 'string'
        ? String((block.data as { text: unknown }).text)
        : '',
      metadata: block.kind === 'editable' ? { location: block.location } : {},
    })) as Block[];

    expect(buildDocumentOutline(blocks)).toHaveLength(document.bodyBlocks.length);
    expect(extractSemanticReferences(document.source)).toEqual(expect.arrayContaining([
      expect.objectContaining({ tag: 'ConceptLink', targetId: 'no-existe' }),
    ]));
    const report = buildAuthoringIntegrityReport({
      source: document.source,
      metadata: document.metadata.value ?? {},
      currentFile: 'database/content/definitions/definicion-prueba.mdx',
      diagramTargets: [],
      entries: [],
    });
    expect(report.some(issue => issue.id.startsWith('broken-ConceptLink-no-existe'))).toBe(true);
  });

  it('creates schema-valid structured pages that reopen in visual mode', () => {
    const input = {
      id: 'demo-editor-compleja',
      type: 'demostracion',
      title: 'Demostración compleja',
      description: 'Se demuestra un resultado mediante pasos justificados.',
      relatedId: 'teorema-pitagoras',
    };
    const source = createPageSource(input);
    const document = parseEditorDocument(source);

    expect(createPagePath(input)).toBe('database/content/demonstrations/demo-editor-compleja.mdx');
    expect(document.metadata.schemaValid).toBe(true);
    expect(document.compatibility).toBe('fully-editable');
    expect(source).toContain('<ProofStep number={1}');
    expect(source).toMatch(/Por hipótesis/);
  });

  it('creates a schema-valid initial document for every page type offered by the form', () => {
    for (const type of Object.keys(PAGE_TYPE_DIRECTORIES)) {
      const source = createPageSource({
        id: `pagina-${type}`,
        type,
        title: `Página ${type}`,
        description: `Descripción rigurosa para ${type}.`,
        relatedId: 'concepto-relacionado',
      });
      const document = parseEditorDocument(source);
      expect(document.metadata.schemaValid, `${type}: ${document.diagnostics.map(item => item.message).join(' ')}`).toBe(true);
      expect(document.compatibility).toBe('fully-editable');
    }
  });

  it('keeps a complex code-authored page fully structural and projects its diagram envelope', () => {
    const source = `export const metadata = {
  "id": "definicion-e2e-compleja",
  "type": "definicion",
  "title": "Definición E2E compleja",
  "description": "Una definición compleja creada y reabierta sin pérdida.",
  "subtype": "nominal",
  "hasSimulation": true
};

import { Complejo } from '@/widgets/diagrams/Definitions/Complejo';
export const Simulation = Complejo;

<Capitular letra="U" />na definición visual conserva estructura y conexiones.

<Separador />

### Definición formal

<Definicion title="Objeto complejo">
Un objeto complejo referencia <ConceptLink targetId="punto" highlightTarget="pA" highlightColor="terracota">un punto publicado</ConceptLink> del diagrama.
</Definicion>

<Nota>
La conclusión se obtiene de las condiciones declaradas, no de la apariencia visual.
</Nota>

<RefLink targetId="punto">Punto</RefLink>.
`;
    const document = parseEditorDocument(source);

    expect(document.compatibility).toBe('fully-editable');
    expect(document.metadata.schemaValid).toBe(true);
    expect(document.envelope.importRanges.map(range => source.slice(range.start, range.end))).toEqual([
      "import { Complejo } from '@/widgets/diagrams/Definitions/Complejo';",
    ]);
    expect(document.envelope.exportRanges.map(range => source.slice(range.start, range.end))).toContain(
      'export const Simulation = Complejo;',
    );
    expect(document.bodyBlocks.every(block => block.kind === 'editable')).toBe(true);
  });

  it('preserves dynamic leanBlocks expression attributes upon block update and does not corrupt types', () => {
    const source = `export const metadata = {
  "id": "demo-prueba",
  "type": "demostracion",
  "stepTacticMap": { "1": [] }
};

<ProofStep number={1} title="Paso 1" justificacion="Por hipótesis" leanBlocks={metadata.stepTacticMap["1"]}>
  Cuerpo del paso
</ProofStep>
`;
    const document = parseEditorDocument(source);
    const block = document.bodyBlocks.find(item => item.kind === 'editable' && item.blockType === 'demonstration');
    expect(block).toBeDefined();
    expect(block!.data.steps[0].leanBlocks).toBeUndefined();
    expect(block!.data.steps[0].leanBlocksExpression).toBe('metadata.stepTacticMap["1"]');

    // Simular que el editor visual actualiza el bloque
    const updatedSteps = [
      {
        ...block!.data.steps[0],
        justificacion: 'Nueva justificación',
      }
    ];

    const mutation = planBlockUpdate(document, block!.id, {
      content: '  Cuerpo del paso',
      metadata: { steps: updatedSteps },
    });
    const updated = applyMutationPlan(document, mutation);

    expect(updated.source).toContain('leanBlocks={metadata.stepTacticMap["1"]}');
    expect(updated.source).not.toContain('leanBlocks="metadata.stepTacticMap["1"]"');
    expect(updated.source).toContain('justificacion="Nueva justificación"');
  });

  it('updates a self-closing capitular without nesting the previous tag', () => {
    const source = definitionSource.replace(
      '<Definicion title="Original">\nTexto <ConceptLink targetId="punto">inicial</ConceptLink>.\n</Definicion>',
      '<Capitular letra="U" />na introducción rigurosa.',
    );
    const document = parseEditorDocument(source);
    const block = document.bodyBlocks.find(item => item.kind === 'editable' && item.blockType === 'paragraph' && item.data.capitular === 'U');
    expect(block).toBeDefined();
    expect(block!.data.text).toBe('na introducción rigurosa.');

    const updated = applyMutationPlan(document, planBlockUpdate(document, block!.id, {
      content: 'na introducción rigurosa.',
      metadata: { capitular: 'E' },
    }));

    expect(updated.source).toContain('<Capitular letra="E" />na introducción rigurosa.');
    expect(updated.source).not.toContain('<Capitular letra="E">');
  });
});
