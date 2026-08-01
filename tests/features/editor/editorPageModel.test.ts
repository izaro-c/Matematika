import { describe, expect, it } from 'vitest';
import {
  buildPageConnectionSummary,
  buildPageDiagramLinks,
  getDiagramWorkbenchMode,
  getPreviewPath,
  mergeDiagramTargets,
} from '../../../src/fixed-pages/editor/ui/editorPageModel';
import type { Block } from '../../../src/fixed-pages/editor/core/parser';
import type { FileNode } from '../../../src/fixed-pages/editor/lib/editorContracts';

const diagramFile: FileNode = {
  path: 'content/diagrams/Teoremas/Pitagoras.tsx',
  name: 'Pitagoras.tsx',
  type: 'file',
  kind: 'diagram',
  capability: 'code-preview',
  capabilityLabel: 'Código y vista previa',
  reason: 'Fuente TSX autoritativa',
};

describe('editor page model', () => {
  it('derives published preview routes from metadata', () => {
    expect(getPreviewPath({ id: 'teorema-pitagoras', type: 'teorema' })).toBe('/teorema/teorema-pitagoras');
    expect(getPreviewPath({ id: 'plan-geometria', type: 'plan-de-estudio' })).toBe('/plan/plan-geometria');
    expect(getPreviewPath({ id: '', type: 'teorema' })).toBeNull();
  });

  it('discovers imported and inline diagram links without duplicating components', () => {
    const blocks: Block[] = [{ id: 'diagram-1', type: 'diagram', content: 'Pitagoras', metadata: { targets: [{ id: 'a', label: 'a' }] } }];
    const links = buildPageDiagramLinks(
      'content/mdx/theorems/pitagoras.mdx',
      "import { Pitagoras } from '@content/diagrams/Teoremas/Pitagoras'",
      'export const Simulation = Pitagoras;',
      [diagramFile],
      blocks,
    );
    expect(links).toEqual([{ componentName: 'Pitagoras', importSource: '@content/diagrams/Teoremas/Pitagoras', path: diagramFile.path, role: 'Simulation', targets: [{ id: 'a', label: 'a' }] }]);
  });

  it('builds workbench modes and merges qualified targets', () => {
    expect(getDiagramWorkbenchMode('content/diagrams/Test.tsx')).toEqual({ kind: 'file', path: 'content/diagrams/Test.tsx' });
    expect(getDiagramWorkbenchMode('page.mdx', { id: 'd', type: 'diagram', content: 'Demo', metadata: { source: 'export {}' } })).toMatchObject({ kind: 'inline', componentName: 'Demo' });
    expect(mergeDiagramTargets([{ id: 'A', label: 'local' }], [{ id: 'A', label: 'loaded' }])).toEqual([{ id: 'A', label: 'loaded' }]);
  });

  it('classifies connected, missing and invalid interactive targets', () => {
    const blocks: Block[] = [{ id: 'p', type: 'paragraph', content: '<InteractiveElement target="A" color="salvia">punto A</InteractiveElement> <InteractiveElement target="X">desconocido</InteractiveElement>' }];
    const summary = buildPageConnectionSummary(blocks, [{ id: 'A', label: 'A' }, { id: 'B', label: 'B' }]);
    expect(summary.connected.map(item => item.target)).toEqual(['A', 'X']);
    expect(summary.missingTargets.map(item => item.id)).toEqual(['B']);
    expect(summary.invalidConnections.map(item => item.target)).toEqual(['X']);
  });
});
