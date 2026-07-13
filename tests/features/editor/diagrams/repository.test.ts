import { afterEach, describe, expect, it, vi } from 'vitest';
import { DiagramRepository } from '../../../../src/features/editor/diagrams/persistence/repository';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';

const apiMocks = vi.hoisted(() => ({
  readContent: vi.fn(),
  applyContent: vi.fn(),
}));

vi.mock('../../../../src/features/editor/persistence/editorApiClient', () => ({
  editorApiClient: {
    readContent: apiMocks.readContent,
    applyContent: apiMocks.applyContent,
  },
}));

const parserMocks = vi.hoisted(() => ({
  parseDiagramSourceOnServer: vi.fn(),
}));

vi.mock('../../../../src/features/editor/diagrams/source/parser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../src/features/editor/diagrams/source/parser')>();
  return {
    ...actual,
    parseDiagramSourceOnServer: parserMocks.parseDiagramSourceOnServer,
  };
});

const { readContent, applyContent } = apiMocks;
const { parseDiagramSourceOnServer } = parserMocks;

describe('DiagramRepository', () => {
  afterEach(() => {
    readContent.mockReset();
    applyContent.mockReset();
    parseDiagramSourceOnServer.mockReset();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('reads a source with embedded visual model without server parsing', async () => {
    const model = createTemplateModel('circunferencia', 'Repository Local', 'definicion');
    const generated = generateDiagramSource(model, 'RepositoryLocal');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    readContent.mockResolvedValueOnce({ source: generated.source, version: 'v1' });

    const result = await new DiagramRepository().readDiagram('src/shared/diagrams/Local.tsx');

    expect(result).toMatchObject({ version: 'v1', parseStatus: 'visual-exact', diagnostics: [] });
    expect(result.model?.title).toBe('Repository Local');
    expect(parseDiagramSourceOnServer).not.toHaveBeenCalled();
  });

  it('keeps valid manual sources in code-with-preview mode without an editable partial model', async () => {
    const model = createTemplateModel('circunferencia', 'Repository Server', 'definicion');
    readContent.mockResolvedValueOnce({ source: 'manual source', version: 'v2' });
    parseDiagramSourceOnServer.mockResolvedValueOnce({
      status: 'code-preview',
      previewModel: model,
      diagnostics: [{ code: 'partial', severity: 'warning', message: 'Recovered.' }],
    });

    const result = await new DiagramRepository().readDiagram('src/shared/diagrams/Server.tsx');

    expect(result.parseStatus).toBe('code-preview');
    expect(result.model).toBeNull();
    expect(result.diagnostics).toHaveLength(1);
  });

  it('preserves source authority for an invalid server parse result', async () => {
    readContent.mockResolvedValueOnce({ source: 'manual source', version: 'v3' });
    parseDiagramSourceOnServer.mockResolvedValueOnce({
      status: 'invalid',
      diagnostics: [{ code: 'invalid', severity: 'error', message: 'invalid' }],
    });

    const result = await new DiagramRepository().readDiagram('src/shared/diagrams/Manual.tsx');

    expect(result).toMatchObject({ source: 'manual source', version: 'v3', model: null, parseStatus: 'invalid' });
  });

  it('saves a diagram through the content API with a source hash and version', async () => {
    applyContent.mockResolvedValueOnce({ version: 'v2', backupId: 'backup-1' });

    const result = await new DiagramRepository().saveDiagram('src/shared/diagrams/Saved.tsx', 'source', 'v1');

    expect(result).toEqual({ version: 'v2', backupId: 'backup-1' });
    expect(applyContent).toHaveBeenCalledWith(expect.objectContaining({
      path: 'src/shared/diagrams/Saved.tsx',
      source: 'source',
      expectedVersion: 'v1',
      localRevision: 0,
      sourceHash: expect.any(String),
    }), undefined);
  });

  it('updates MDX imports through the explicit endpoint and reports failures', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, modified: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }))
      .mockResolvedValueOnce(new Response('boom', { status: 500 })));

    await expect(new DiagramRepository().updateMdxImports(
      'database/content/definitions/a.mdx',
      'A',
      'src/shared/diagrams/A.tsx',
      'diagram',
    )).resolves.toEqual({ success: true, modified: true });

    expect(fetch).toHaveBeenCalledWith('/api/content/update-imports-exports', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        path: 'database/content/definitions/a.mdx',
        componentName: 'A',
        importPath: '@/shared/diagrams/A',
        mode: 'diagram',
      }),
      signal: undefined,
    }));

    await expect(new DiagramRepository().updateMdxImports(
      'database/content/definitions/a.mdx',
      'A',
      'src/shared/diagrams/A.tsx',
      'inline',
    )).rejects.toThrow('Failed to update imports/exports in MDX: boom');
  });
});
