import path from 'node:path';
import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { parseEditorDocument } from '../../src/features/editor/document/parseEditorDocument';
import {
  applyContentRequestSchema,
  createContentRequestSchema,
  restoreBackupRequestSchema,
  saveDraftRequestSchema,
} from '../../src/features/editor/persistence/persistenceContracts';
import { BackendError, EditorPersistenceBackend } from './editorPersistenceBackend';
import { parseDiagramSourceAST } from './parseDiagramSourceAST';
import { updateMdxImportsExports } from './updateDiagramImportsExports';
import { listEditableCatalogResources } from './buildEditorResourceCatalog';

export const MAX_REQUEST_BYTES = 5 * 1024 * 1024;

export interface EditorApiConfig {
  projectRoot: string;
  srcRoot?: string;
  storageRoot?: string;
  /** When set, POST requests must include `Authorization: Bearer <token>`. */
  writeToken?: string;
}

export function resolveEditorPaths(projectRoot: string, overrides?: Pick<EditorApiConfig, 'srcRoot' | 'storageRoot'>) {
  const srcRoot = overrides?.srcRoot
    ? path.resolve(overrides.srcRoot)
    : process.env.MATEMATIKA_EDITOR_SRC_ROOT
      ? path.resolve(process.env.MATEMATIKA_EDITOR_SRC_ROOT)
      : path.resolve(projectRoot, 'src');
  const storageRoot = overrides?.storageRoot
    ? path.resolve(overrides.storageRoot)
    : process.env.MATEMATIKA_EDITOR_STORAGE_ROOT
      ? path.resolve(process.env.MATEMATIKA_EDITOR_STORAGE_ROOT)
      : path.resolve(projectRoot, '.matematika/editor');
  const writeRoots = [
    path.resolve(srcRoot, 'database/content'),
    path.resolve(srcRoot, 'widgets/diagrams'),
  ];
  return { srcRoot, storageRoot, writeRoots };
}

export function createEditorPersistenceBackend(config: EditorApiConfig): EditorPersistenceBackend {
  const { srcRoot, storageRoot, writeRoots } = resolveEditorPaths(config.projectRoot, config);
  return new EditorPersistenceBackend({
    srcRoot,
    storageRoot,
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
    },
  });
}

export function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
      if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) {
        reject(new BackendError(413, { message: 'Request body too large' }));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new BackendError(400, { message: 'Invalid JSON body' }));
      }
    });
    req.on('error', reject);
  });
}

export function handleBackendError(res: ServerResponse, error: unknown) {
  if (error instanceof BackendError) sendJson(res, error.status, error.payload);
  else sendJson(res, 500, { message: error instanceof Error ? error.message : 'Unknown server error' });
}

function bearerToken(req: IncomingMessage): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}

function requiresWriteAuth(method: string | undefined): boolean {
  return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
}

export function assertWriteAuthorized(req: IncomingMessage, writeToken?: string): void {
  if (!writeToken || !requiresWriteAuth(req.method)) return;
  const token = bearerToken(req);
  if (!token || token !== writeToken) {
    throw new BackendError(401, { message: 'Unauthorized: valid Bearer token required for write operations' });
  }
}

export interface EditorApiHandlers {
  backend: EditorPersistenceBackend;
  srcRoot: string;
  writeToken?: string;
}

export function createEditorApiHandlers(config: EditorApiConfig): EditorApiHandlers {
  const { srcRoot } = resolveEditorPaths(config.projectRoot, config);
  return {
    backend: createEditorPersistenceBackend(config),
    srcRoot,
    writeToken: config.writeToken ?? process.env.EDITOR_API_TOKEN,
  };
}

export async function handleEditorApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
  handlers: EditorApiHandlers,
): Promise<boolean> {
  try {
    assertWriteAuthorized(req, handlers.writeToken);
  } catch (error) {
    handleBackendError(res, error);
    return true;
  }

  const { backend, srcRoot } = handlers;

  if (pathname === '/api/content/parse-diagram') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { message: 'Method not allowed' });
      return true;
    }
    try {
      const body = await readJsonBody(req) as { source: string };
      sendJson(res, 200, parseDiagramSourceAST(body.source));
    } catch (error) {
      handleBackendError(res, error);
    }
    return true;
  }

  if (pathname === '/api/content/update-imports-exports') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { message: 'Method not allowed' });
      return true;
    }
    try {
      const body = await readJsonBody(req) as {
        path: string;
        componentName: string;
        importPath: string;
        mode: 'simulation' | 'diagram' | 'inline';
      };
      const current = await backend.readContent(body.path);
      const result = updateMdxImportsExports(current.source, body.componentName, body.importPath, body.mode);
      if (result.modified) {
        const sourceHash = crypto.createHash('sha256').update(result.source, 'utf8').digest('hex');
        await backend.applyContent({
          path: body.path,
          source: result.source,
          sourceHash,
          expectedVersion: current.version,
          localRevision: 0,
        });
      }
      sendJson(res, 200, { success: true, modified: result.modified, source: result.source });
    } catch (error) {
      handleBackendError(res, error);
    }
    return true;
  }

  if (pathname === '/api/content/restore') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { message: 'Method not allowed' });
      return true;
    }
    try {
      const parsed = restoreBackupRequestSchema.safeParse(await readJsonBody(req));
      if (!parsed.success) {
        sendJson(res, 400, { message: 'Invalid restore request', details: parsed.error.issues });
        return true;
      }
      sendJson(res, 200, await backend.restoreBackup(parsed.data));
    } catch (error) {
      handleBackendError(res, error);
    }
    return true;
  }

  if (pathname === '/api/content') {
    const url = new URL(req.url || '/', `http://${req.headers.host ?? 'localhost'}`);
    if (req.method === 'GET') {
      const rawPath = url.searchParams.get('path');
      if (!rawPath) {
        sendJson(res, 400, { message: 'Missing path' });
        return true;
      }
      try {
        sendJson(res, 200, await backend.readContent(rawPath));
      } catch (error) {
        handleBackendError(res, error);
      }
      return true;
    }
    if (req.method === 'POST') {
      try {
        const payload = await readJsonBody(req);
        const creation = createContentRequestSchema.safeParse(payload);
        if (creation.success) {
          const { path: filePath, source, sourceHash, localRevision } = creation.data;
          sendJson(res, 200, await backend.createContent({ path: filePath, source, sourceHash, localRevision }));
          return true;
        }
        if (
          payload
          && typeof payload === 'object'
          && 'path' in payload
          && 'content' in payload
          && typeof payload.path === 'string'
          && payload.path.endsWith('.tsx')
          && typeof payload.content === 'string'
        ) {
          const sourceHash = crypto.createHash('sha256').update(payload.content, 'utf8').digest('hex');
          try {
            const current = await backend.readContent(payload.path);
            sendJson(res, 200, await backend.applyContent({
              path: payload.path,
              source: payload.content,
              sourceHash,
              expectedVersion: current.version,
              localRevision: 0,
            }));
          } catch (error) {
            if (error instanceof BackendError && error.status === 404) {
              sendJson(res, 200, await backend.createContent({
                path: payload.path,
                source: payload.content,
                sourceHash,
                localRevision: 0,
              }));
            } else {
              throw error;
            }
          }
          return true;
        }
        const parsed = applyContentRequestSchema.safeParse(payload);
        if (!parsed.success) {
          sendJson(res, 400, { message: 'Invalid apply request', details: parsed.error.issues });
          return true;
        }
        sendJson(res, 200, await backend.applyContent(parsed.data));
      } catch (error) {
        handleBackendError(res, error);
      }
      return true;
    }
    sendJson(res, 405, { message: 'Method not allowed' });
    return true;
  }

  if (pathname === '/api/draft') {
    const url = new URL(req.url || '/', `http://${req.headers.host ?? 'localhost'}`);
    if (req.method === 'GET') {
      const rawPath = url.searchParams.get('path');
      if (!rawPath) {
        sendJson(res, 400, { message: 'Missing path' });
        return true;
      }
      try {
        sendJson(res, 200, await backend.readDraft(rawPath));
      } catch (error) {
        handleBackendError(res, error);
      }
      return true;
    }
    if (req.method === 'POST') {
      try {
        const parsed = saveDraftRequestSchema.safeParse(await readJsonBody(req));
        if (!parsed.success) {
          sendJson(res, 400, { message: 'Invalid draft request', details: parsed.error.issues });
          return true;
        }
        sendJson(res, 200, await backend.saveDraft(parsed.data));
      } catch (error) {
        handleBackendError(res, error);
      }
      return true;
    }
    sendJson(res, 405, { message: 'Method not allowed' });
    return true;
  }

  if (pathname === '/api/list-content') {
    if (req.method === 'GET') {
      sendJson(res, 200, listEditableCatalogResources(srcRoot));
      return true;
    }
    sendJson(res, 405, { message: 'Method not allowed' });
    return true;
  }

  if (pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok' });
    return true;
  }

  return false;
}
