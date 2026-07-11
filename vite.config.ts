import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import fs from 'fs'
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
  applyContentRequestSchema, restoreBackupRequestSchema, saveDraftRequestSchema
} from './src/features/editor/persistence/persistenceContracts';
import { BackendError, EditorPersistenceBackend } from './scripts/editor/editorPersistenceBackend';

/**
 * Plugin personalizado de Vite (`editorAPI`) para Matematika.
 * Intercepta peticiones al servidor de desarrollo para proporcionar una API REST
 * ligera (lectura/escritura/listado) que permite al Editor Web modificar
 * archivos locales (.mdx, .tsx) y usar el HMR de Vite para Live Preview.
 */
const MAX_REQUEST_BYTES = 5 * 1024 * 1024;

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
      const srcRoot = path.resolve(__dirname, 'src');
      const writeRoots = [
        path.resolve(srcRoot, 'database/content'),
        path.resolve(srcRoot, 'shared/diagrams'),
        path.resolve(srcRoot, 'widgets/diagrams')
      ];
      const backend = new EditorPersistenceBackend({
        srcRoot,
        storageRoot: path.resolve(__dirname, '.matematika/editor'),
        allowedRoots: writeRoots,
        readRoots: [...writeRoots, path.resolve(srcRoot, 'shared/templates')],
        validateSource(filePath, source) {
          if (filePath.endsWith('.mdx') && parseEditorDocument(source).compatibility === 'unsupported') {
            throw new BackendError(400, { message: 'Invalid MDX source' });
          }
          if (filePath.endsWith('.tsx') && source.trim().length === 0) throw new BackendError(400, { message: 'Empty TSX source' });
        }
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
          const contentDir = path.resolve(__dirname, 'src', 'database', 'content');
          const componentsDir = path.resolve(__dirname, 'src', 'widgets', 'diagrams');
          const sharedComponentsDir = path.resolve(__dirname, 'src', 'shared', 'diagrams');
          const results: { path: string, name: string, type: string, fullPath?: string }[] = [];

          function walk(dir: string, baseType: string, prefix: string) {
            if (!fs.existsSync(dir)) return;
            const files = fs.readdirSync(dir);
            for (const file of files) {
              const fullPath = path.join(dir, file);
              const stat = fs.statSync(fullPath);
              if (stat.isDirectory()) {
                walk(fullPath, baseType || file, prefix);
              } else if (file.endsWith('.mdx') || file.endsWith('.tsx')) {
                const relativePath = path.relative(path.resolve(__dirname, 'src'), fullPath);
                results.push({
                  path: relativePath, 
                  name: file,
                  type: baseType || path.dirname(relativePath).split(path.sep)[1] || prefix,
                  fullPath
                });
              }
            }
          }

          walk(contentDir, '', 'content');
          walk(componentsDir, 'components', 'components');
          walk(sharedComponentsDir, 'components', 'components');

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(results));
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
