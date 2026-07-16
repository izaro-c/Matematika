import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import path from 'path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'

import rehypeKatex from 'rehype-katex'

import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { visualizer } from 'rollup-plugin-visualizer';
import { parseEditorDocument } from './src/features/editor/document/parseEditorDocument';
import {
  applyContentRequestSchema, createContentRequestSchema, restoreBackupRequestSchema, saveDraftRequestSchema
} from './src/features/editor/persistence/persistenceContracts';
import { BackendError, EditorPersistenceBackend } from './scripts/editor/editorPersistenceBackend';
import { parseDiagramSourceAST } from './scripts/editor/parseDiagramSourceAST';
import { updateMdxImportsExports } from './scripts/editor/updateDiagramImportsExports';
import { listEditableCatalogResources } from './scripts/editor/buildEditorResourceCatalog';

/**
 * Plugin personalizado de Vite (`editorAPI`) para Matematika.
 * Intercepta peticiones al servidor de desarrollo para proporcionar una API REST
 * ligera (lectura/escritura/listado) que permite al Editor Web modificar
 * archivos locales (.mdx, .tsx) y usar el HMR de Vite para Live Preview.
 */
const MAX_REQUEST_BYTES = 5 * 1024 * 1024;
const editorSrcRoot = process.env.MATEMATIKA_EDITOR_SRC_ROOT
  ? path.resolve(process.env.MATEMATIKA_EDITOR_SRC_ROOT)
  : path.resolve(__dirname, 'src');
const editorStorageRoot = process.env.MATEMATIKA_EDITOR_STORAGE_ROOT
  ? path.resolve(process.env.MATEMATIKA_EDITOR_STORAGE_ROOT)
  : path.resolve(__dirname, '.matematika/editor');
const diagramParserContractFiles = new Set([
  path.resolve(__dirname, 'scripts/editor/parseDiagramSourceAST.ts'),
  path.resolve(__dirname, 'src/features/editor/diagrams/model/commands.ts'),
  path.resolve(__dirname, 'src/features/editor/diagrams/source/generator.ts'),
  path.resolve(__dirname, 'src/features/editor/diagrams/source/parser.ts'),
  path.resolve(__dirname, 'src/shared/diagrams/spec/migrations.ts'),
  path.resolve(__dirname, 'src/shared/diagrams/spec/schema.ts'),
].map(filePath => path.normalize(filePath)));

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
      if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) reject(new BackendError(413, { message: 'Request body too large' }));
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new BackendError(400, { message: 'Invalid JSON body' })); }
    });
    req.on('error', reject);
  });
}

function handleBackendError(res: ServerResponse, error: unknown) {
  if (error instanceof BackendError) sendJson(res, error.status, error.payload);
  else sendJson(res, 500, { message: error instanceof Error ? error.message : 'Unknown server error' });
}

function editorAPI(): Plugin {
  return {
    name: 'editor-api',
    enforce: 'pre' as const,
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.watcher.add([...diagramParserContractFiles]);
      server.watcher.on('change', changedPath => {
        if (diagramParserContractFiles.has(path.normalize(changedPath))) {
          server.restart().catch(error => server.config.logger.error(
            `No se pudo reiniciar Vite tras cambiar el parser de diagramas: ${error instanceof Error ? error.message : String(error)}`,
          ));
        }
      });

      const srcRoot = editorSrcRoot;
      const writeRoots = [
        path.resolve(srcRoot, 'database/content'),
        path.resolve(srcRoot, 'widgets/diagrams')
      ];
      const backend = new EditorPersistenceBackend({
        srcRoot,
        storageRoot: editorStorageRoot,
        allowedRoots: writeRoots,
        readRoots: writeRoots,
        validateSource(filePath, source) {
          if (filePath.endsWith('.mdx')) {
            const document = parseEditorDocument(source);
            if (document.compatibility === 'unsupported') {
              throw new BackendError(400, { message: 'Invalid MDX source', diagnostics: document.diagnostics });
            }
            if (document.metadata.status !== 'readable' || !document.metadata.schemaValid) {
              throw new BackendError(400, { message: 'Invalid MDX metadata', diagnostics: document.diagnostics });
            }
          }
          if (filePath.endsWith('.tsx')) {
            if (source.trim().length === 0) throw new BackendError(400, { message: 'Empty TSX source' });
            const parsed = parseDiagramSourceAST(source);
            if (parsed.status === 'invalid') {
              throw new BackendError(400, {
                message: 'Invalid TSX diagram source',
                diagnostics: parsed.diagnostics,
              });
            }
          }
        }
      });

      server.middlewares.use('/api/content/parse-diagram', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') return sendJson(res, 405, { message: 'Method not allowed' });
        try {
          const body = await readJsonBody(req) as { source: string };
          const result = parseDiagramSourceAST(body.source);
          sendJson(res, 200, result);
        } catch (error) { handleBackendError(res, error); }
      });

      server.middlewares.use('/api/content/update-imports-exports', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') return sendJson(res, 405, { message: 'Method not allowed' });
        try {
          const body = await readJsonBody(req) as { path: string; componentName: string; importPath: string; mode: 'simulation' | 'diagram' | 'inline' };
          const current = await backend.readContent(body.path);
          const result = updateMdxImportsExports(current.source, body.componentName, body.importPath, body.mode);
          if (result.modified) {
            const sourceHash = crypto.createHash('sha256').update(result.source, 'utf8').digest('hex');
            await backend.applyContent({
              path: body.path,
              source: result.source,
              sourceHash,
              expectedVersion: current.version,
              localRevision: 0
            });
          }
          sendJson(res, 200, { success: true, modified: result.modified, source: result.source });
        } catch (error) { handleBackendError(res, error); }
      });

      server.middlewares.use('/api/content/restore', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') return sendJson(res, 405, { message: 'Method not allowed' });
        try {
          const parsed = restoreBackupRequestSchema.safeParse(await readJsonBody(req));
          if (!parsed.success) return sendJson(res, 400, { message: 'Invalid restore request', details: parsed.error.issues });
          sendJson(res, 200, await backend.restoreBackup(parsed.data));
        } catch (error) { handleBackendError(res, error); }
      });

      server.middlewares.use('/api/content', async (req: IncomingMessage, res: ServerResponse) => {
        const url = new URL(req.url || '/', `http://${req.headers.host}`)
        if (req.method === 'GET') {
          const rawPath = url.searchParams.get('path');
          if (!rawPath) return sendJson(res, 400, { message: 'Missing path' });
          try { sendJson(res, 200, await backend.readContent(rawPath)); }
          catch (error) { handleBackendError(res, error); }
          return
        }
        if (req.method === 'POST') {
          try {
            const payload = await readJsonBody(req);
            const creation = createContentRequestSchema.safeParse(payload);
            if (creation.success) {
              const { path, source, sourceHash, localRevision } = creation.data;
              return sendJson(res, 200, await backend.createContent({ path, source, sourceHash, localRevision }));
            }
            if (payload && typeof payload === 'object' && 'path' in payload && 'content' in payload &&
                typeof payload.path === 'string' && payload.path.endsWith('.tsx') && typeof payload.content === 'string') {
              const sourceHash = crypto.createHash('sha256').update(payload.content, 'utf8').digest('hex');
              try {
                const current = await backend.readContent(payload.path);
                return sendJson(res, 200, await backend.applyContent({ path: payload.path, source: payload.content, sourceHash,
                  expectedVersion: current.version, localRevision: 0 }));
              } catch (error) {
                if (error instanceof BackendError && error.status === 404) {
                  return sendJson(res, 200, await backend.createContent({ path: payload.path, source: payload.content, sourceHash, localRevision: 0 }));
                }
                throw error;
              }
            }
            const parsed = applyContentRequestSchema.safeParse(payload);
            if (!parsed.success) return sendJson(res, 400, { message: 'Invalid apply request', details: parsed.error.issues });
            sendJson(res, 200, await backend.applyContent(parsed.data));
          } catch (error) { handleBackendError(res, error); }
          return
        }
        sendJson(res, 405, { message: 'Method not allowed' });
      })

      server.middlewares.use('/api/draft', async (req: IncomingMessage, res: ServerResponse) => {
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        if (req.method === 'GET') {
          const rawPath = url.searchParams.get('path');
          if (!rawPath) return sendJson(res, 400, { message: 'Missing path' });
          try { sendJson(res, 200, await backend.readDraft(rawPath)); }
          catch (error) { handleBackendError(res, error); }
          return;
        }
        if (req.method === 'POST') {
          try {
            const parsed = saveDraftRequestSchema.safeParse(await readJsonBody(req));
            if (!parsed.success) return sendJson(res, 400, { message: 'Invalid draft request', details: parsed.error.issues });
            sendJson(res, 200, await backend.saveDraft(parsed.data));
          } catch (error) { handleBackendError(res, error); }
          return
        }
        sendJson(res, 405, { message: 'Method not allowed' });
      })

      server.middlewares.use('/api/list-content', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(listEditableCatalogResources(srcRoot)));
          return;
        }
        res.statusCode = 405
        res.end('Method not allowed')
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    editorAPI(),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex],
        providerImportSource: "@mdx-js/react"
      }),
    },
    react(),
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: "/Matematika/"
})
