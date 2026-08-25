import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { viteEditorApiPlugin } from '../../../../scripts/editor/viteEditorApiPlugin';

describe('viteEditorApiPlugin', () => {
  let tempDir: string;
  let server: http.Server;
  let baseUrl: string;
  let originalEnv: string | undefined;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'matematika-test-editor-api-'));
    originalEnv = process.env.MATEMATIKA_EDITOR_SRC_ROOT;
    process.env.MATEMATIKA_EDITOR_SRC_ROOT = tempDir;

    // Seed test directory structure
    await fs.mkdir(path.join(tempDir, 'content/mdx/es/definicion'), { recursive: true });
    await fs.mkdir(path.join(tempDir, 'docs/content'), { recursive: true });

    await fs.writeFile(
      path.join(tempDir, 'content/mdx/es/definicion/test.mdx'),
      'export const metadata = { id: "test", type: "definicion", title: "Test Doc" };\n\n## Test Doc\n\nTest content.',
      'utf8'
    );

    await fs.writeFile(
      path.join(tempDir, 'docs/content/guide.md'),
      '# Guide\n\nDocs content test.',
      'utf8'
    );

    const plugin = viteEditorApiPlugin();

    // Simulate Vite configureServer
    const mockViteServer = {
      middlewares: {
        use: (fn: (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void) => {
          server = http.createServer(fn);
        },
      },
    };

    // @ts-expect-error Mocking minimal Vite dev server
    plugin.configureServer?.(mockViteServer);

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as { port: number };
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterEach(async () => {
    process.env.MATEMATIKA_EDITOR_SRC_ROOT = originalEnv;
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('lists content files including content/ and docs/content/', async () => {
    const res = await fetch(`${baseUrl}/api/list-content`);
    expect(res.status).toBe(200);

    const data = (await res.json()) as Array<{ path: string; name: string; title?: string }>;
    expect(data.some((f) => f.path === 'content/mdx/es/definicion/test.mdx')).toBe(true);
    expect(data.some((f) => f.path === 'docs/content/guide.md')).toBe(true);
  });

  it('reads content file from disk and returns sha256 version', async () => {
    const res = await fetch(`${baseUrl}/api/content?path=docs/content/guide.md`);
    expect(res.status).toBe(200);

    const data = (await res.json()) as { path: string; source: string; version: string };
    expect(data.path).toBe('docs/content/guide.md');
    expect(data.source).toBe('# Guide\n\nDocs content test.');
    expect(data.version).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it('writes content to file on disk when saved', async () => {
    const readRes = await fetch(`${baseUrl}/api/content?path=docs/content/guide.md`);
    const initial = (await readRes.json()) as { version: string };

    const updatedText = '# Guide Updated\n\nNew docs content.';
    const saveRes = await fetch(`${baseUrl}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'docs/content/guide.md',
        source: updatedText,
        expectedVersion: initial.version,
        localRevision: 1,
      }),
    });

    expect(saveRes.status).toBe(200);

    // Verify file on disk
    const diskContent = await fs.readFile(path.join(tempDir, 'docs/content/guide.md'), 'utf8');
    expect(diskContent).toBe(updatedText);
  });

  it('returns 409 conflict when expected version does not match', async () => {
    const saveRes = await fetch(`${baseUrl}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'docs/content/guide.md',
        source: 'Conflict content',
        expectedVersion: 'sha256:wronghash000000000000000000000000000000000000000000000000000000',
        localRevision: 1,
      }),
    });

    expect(saveRes.status).toBe(409);
    const data = (await saveRes.json()) as { kind: string };
    expect(data.kind).toBe('content-conflict');
  });
});
