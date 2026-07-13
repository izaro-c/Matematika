import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import corpus from '../../../fixtures/editor/phase6-real-mdx-corpus.json';
import {
  applyMutationPlan,
  parseEditorDocument,
  planBlockDeletion,
  planBlockDuplication,
  planBlockInsertion,
  planBlockMove,
  planBlockReplacement,
  planMetadataUpdate,
} from '../../../../src/features/editor/document';
import { buildDiffReview } from '../../../../src/features/editor/ux/diffReview';

const validEnvelope = `export const metadata = {
  "id": "fase-seis-prueba",
  "type": "definicion",
  "title": "Prueba",
  "description": "Documento de prueba.",
  "subtype": "nominal"
};`;

describe('Phase 6 structural and lossless MDX engine', () => {
  it('roundtrips a representative real corpus byte-for-byte with readable schema-valid metadata', () => {
    expect(corpus).toHaveLength(12);
    for (const entry of corpus) {
      const source = fs.readFileSync(entry.path, 'utf8');
      const document = parseEditorDocument(source);
      expect(document.source, entry.path).toBe(source);
      expect(document.metadata.status, entry.path).toBe('readable');
      expect(document.metadata.schemaValid, entry.path).toBe(true);
      expect(document.metadata.value?.id, entry.path).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(document.bodyBlocks.some(block => block.kind === 'opaque'), entry.path).toBe(false);
    }
  });

  it('edits one metadata value and preserves comments, imports, exports and body bytes', () => {
    const source = `${validEnvelope.replace('"title": "Prueba",', '"title": "Prueba", // título conservado')}

import { X } from './x';
export const Simulation = X;

Texto con <ConceptLink targetId="segmento">segmento</ConceptLink>.`;
    const document = parseEditorDocument(source);
    const title = document.metadata.properties.find(property => property.key === 'title');
    expect(title).toBeDefined();
    const plan = planMetadataUpdate(document, { ...document.metadata.value, title: 'Título localizado' });
    expect(plan.edits).toHaveLength(1);
    expect(plan.edits[0].range).toEqual(title?.valueRange);
    const next = applyMutationPlan(document, plan);
    expect(next.source).toBe(source.replace('"Prueba", // título conservado', '"Título localizado", // título conservado'));
    expect(next.source.slice(next.envelope.importRanges[0].start, next.envelope.importRanges[0].end))
      .toBe("import { X } from './x';");
    expect(next.metadata.value?.title).toBe('Título localizado');
  });

  it('keeps unknown JSX source-only while allowing a neighboring localized edit', () => {
    const unknown = '<FutureWidget value={{ nested: [1, { keep: true }] }} />';
    const source = `${validEnvelope}\n\nTexto editable.\n\n${unknown}\n\nTexto final.`;
    const document = parseEditorDocument(source);
    const opaque = document.bodyBlocks.find(block => block.kind === 'opaque');
    expect(opaque?.source).toBe(unknown);
    expect(document.compatibility).toBe('partially-editable');
    const paragraph = document.bodyBlocks.find(block => block.kind === 'editable' && block.blockType === 'paragraph');
    if (!paragraph || paragraph.kind !== 'editable') throw new Error('Missing paragraph fixture');
    const next = applyMutationPlan(document, planBlockReplacement(document, paragraph.id, 'Texto cambiado.'));
    expect(next.source).toContain(unknown);
    expect(next.source).toBe(source.replace('Texto editable.', 'Texto cambiado.'));
  });

  it('projects proof steps inside a known container without rewriting its wrapper', () => {
    const source = `${validEnvelope}\n\n<DemonstrationSection diagram={<Demo />}>

<ProofStep number={1} title="Hipótesis" target="paso-1">
  Texto del paso.
</ProofStep>

</DemonstrationSection>`;
    const document = parseEditorDocument(source);
    const step = document.bodyBlocks.find(block => block.kind === 'editable' && block.blockType === 'demonstration');
    if (!step || step.kind !== 'editable') throw new Error('Missing proof step');
    const next = applyMutationPlan(document, planBlockReplacement(document, step.id, '\n  Texto localizado.\n'));
    expect(next.source).toBe(source.replace('\n  Texto del paso.\n', '\n  Texto localizado.\n'));
    expect(next.source).toContain('<DemonstrationSection diagram={<Demo />}>');
    expect(next.source).toContain('</DemonstrationSection>');
  });

  it('plans insertion, duplication, deletion and reordering as bounded mutations', () => {
    const source = `${validEnvelope}\n\n### Uno\n\nPrimero.\n\n### Dos\n\nSegundo.`;
    const opened = parseEditorDocument(source);
    const insertion = planBlockInsertion(opened, { index: 1, blockType: 'note', content: 'Nota nueva.' });
    const inserted = applyMutationPlan(opened, insertion);
    expect(inserted.source).toContain('<Nota>\nNota nueva.\n</Nota>');
    expect(insertion.preview.requiresReview).toBe(false);

    const paragraph = inserted.bodyBlocks.find(block => block.kind === 'editable' && block.blockType === 'paragraph');
    if (!paragraph) throw new Error('Missing paragraph');
    const duplication = planBlockDuplication(inserted, paragraph.id);
    expect(duplication.preview.requiresReview).toBe(true);
    const duplicated = applyMutationPlan(inserted, duplication);
    expect(duplicated.source.match(/Primero\./g)).toHaveLength(2);

    const headings = duplicated.bodyBlocks.filter(block => block.kind === 'editable' && block.blockType === 'heading');
    const move = planBlockMove(duplicated, headings[1].id, 0);
    expect(move.preview.summary).toContain('Revise el diff');
    const moved = applyMutationPlan(duplicated, move);
    expect(moved.source.indexOf('### Dos')).toBeLessThan(moved.source.indexOf('### Uno'));

    const movedParagraph = moved.bodyBlocks.find(block => block.kind === 'editable' && block.blockType === 'paragraph');
    if (!movedParagraph) throw new Error('Missing moved paragraph');
    const deletion = planBlockDeletion(moved, movedParagraph.id);
    expect(deletion.preview.originalSnippet).toContain('Primero.');
    expect(applyMutationPlan(moved, deletion).source.length).toBeLessThan(moved.source.length);
  });

  it('produces a reviewable, operation-bound diff for a broad move', () => {
    const source = `${validEnvelope}\n\n### Uno\n\nPrimero.\n\n### Dos\n\nSegundo.`;
    const document = parseEditorDocument(source);
    const headings = document.bodyBlocks.filter(block => block.kind === 'editable' && block.blockType === 'heading');
    const move = planBlockMove(document, headings[1].id, 0);
    const candidate = applyMutationPlan(document, move);
    const review = buildDiffReview({
      documentId: 'phase-6.mdx',
      baseSource: source,
      candidateSource: candidate.source,
      localRevision: 1,
      baseVersion: 'v1',
      expectedRanges: move.edits.map(edit => ({ ...edit.range, operationId: edit.operationId, blockId: edit.blockId, reason: edit.reason ?? '' })),
    });
    expect(review.status).toBe('reviewable');
    expect(review.blockingChangeCount).toBe(0);
    expect(review.changes.length).toBeGreaterThan(0);
    expect(review.changes.every(change => change.classification === 'expected')).toBe(true);
  });

  it('protects immutable IDs, invalid schemas, dynamic metadata and parse failures', () => {
    const valid = parseEditorDocument(`${validEnvelope}\n\nTexto.`);
    expect(() => planMetadataUpdate(valid, { ...valid.metadata.value, id: 'otro-id' })).toThrow('immutable');
    expect(() => planMetadataUpdate(valid, { ...valid.metadata.value, description: undefined })).toThrow('schema');

    const idBearingSource = `${validEnvelope}\n\n<PasoEjercicio id="paso-publico">Planteamiento.</PasoEjercicio>`;
    const idBearing = parseEditorDocument(idBearingSource);
    expect(() => planBlockDuplication(idBearing, idBearing.bodyBlocks[0].id)).toThrow('ID-bearing');

    const dynamicSource = 'export const metadata = buildMetadata();\n\nTexto intacto.';
    const dynamic = parseEditorDocument(dynamicSource);
    expect(dynamic.metadata.status).toBe('unsupported');
    expect(dynamic.source).toBe(dynamicSource);
    expect(() => planMetadataUpdate(dynamic, {})).toThrow('not a statically readable object');

    const brokenSource = `${validEnvelope}\n\nTexto { syntax error here }.`;
    const broken = parseEditorDocument(brokenSource);
    expect(broken.compatibility).toBe('unsupported');
    expect(broken.source).toBe(brokenSource);
    expect(broken.bodyBlocks).toHaveLength(0);
  });
});
