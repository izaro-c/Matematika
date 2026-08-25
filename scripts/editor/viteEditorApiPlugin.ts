import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

interface FileNode {
  path: string;
  name: string;
  title?: string;
  type: string;
  kind: 'mdx-document' | 'diagram';
  capability: 'visual-exact' | 'code-preview' | 'invalid';
  capabilityLabel: string;
  reason: string;
  lang?: string;
  id?: string;
}

const CONTENT_TYPE_MAP: Record<string, string> = {
  definitions: 'definicion',
  theorems: 'teorema',
  methods: 'metodo',
  demonstrations: 'demostracion',
  mathematicians: 'matematico',
  examples: 'ejemplo',
  exercises: 'ejercicio',
  usecases: 'caso-de-uso',
  plans: 'plan-de-estudio',
  axioms: 'axioma',
  models: 'modelo',
  'axiomatic-systems': 'sistema-axiomatico',
};

function getRootDir(): string {
  return process.env.MATEMATIKA_EDITOR_SRC_ROOT || process.cwd();
}

function extractTitle(source: string, defaultTitle: string): string {
  const match = source.match(/["']title["']\s*:\s*["']([^"']+)["']/);
  if (match?.[1]) return match[1];
  const h1 = source.match(/^#\s+(.+)$/m);
  if (h1?.[1]) return h1[1].trim();
  const h2 = source.match(/^##\s+(.+)$/m);
  if (h2?.[1]) return h2[1].trim();
  return defaultTitle;
}

function extractMetadata(source: string): { title?: string; type?: string; lang?: string; id?: string } {
  let title: string | undefined;
  let type: string | undefined;
  let lang: string | undefined;
  let id: string | undefined;

  const idMatch = source.match(/["']id["']\s*:\s*["']([^"']+)["']/);
  if (idMatch?.[1]) id = idMatch[1];

  const typeMatch = source.match(/["']type["']\s*:\s*["']([^"']+)["']/);
  if (typeMatch?.[1]) type = typeMatch[1];

  const langMatch = source.match(/["']lang["']\s*:\s*["']([^"']+)["']/);
  if (langMatch?.[1]) lang = langMatch[1];

  const titleMatch = source.match(/["']title["']\s*:\s*["']([^"']+)["']/);
  if (titleMatch?.[1]) title = titleMatch[1];

  return { title, type, lang, id };
}

async function scanDirectory(dir: string, baseDir: string): Promise<string[]> {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await scanDirectory(fullPath, baseDir)));
    } else if (entry.isFile()) {
      const relative = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push(relative);
    }
  }
  return results;
}

async function buildCatalog(rootDir: string): Promise<FileNode[]> {
  const fileNodes: FileNode[] = [];
  const relativePaths: string[] = [];

  const contentMdx = path.join(rootDir, 'content/mdx');
  const contentDiagrams = path.join(rootDir, 'content/diagrams');
  const docsContent = path.join(rootDir, 'docs/content');

  const scannedMdx = await scanDirectory(contentMdx, rootDir);
  const scannedDiagrams = await scanDirectory(contentDiagrams, rootDir);
  const scannedDocs = await scanDirectory(docsContent, rootDir);

  relativePaths.push(...scannedMdx, ...scannedDiagrams, ...scannedDocs);

  for (const relPath of relativePaths) {
    const isMdx = relPath.endsWith('.mdx') || relPath.endsWith('.md');
    const isDiagram = relPath.endsWith('.tsx');
    if (!isMdx && !isDiagram) continue;

    const absPath = path.join(rootDir, relPath);
    let source: string;
    try {
      source = await fs.promises.readFile(absPath, 'utf8');
    } catch {
      continue;
    }

    const fileName = path.basename(relPath);
    const idFromPath = fileName.replace(/\.(mdx|md|tsx)$/i, '');
    const meta = extractMetadata(source);

    if (isMdx) {
      const relParts = relPath.replace(/^(content\/mdx|docs\/content)\//, '').split('/');
      let lang = meta.lang || 'es';
      let typeDir = relParts[0];
      if (relParts.length > 1 && /^[a-z]{2}(-[A-Z]{2})?$/.test(relParts[0])) {
        lang = relParts[0];
        typeDir = relParts[1];
      }
      const type = meta.type || CONTENT_TYPE_MAP[typeDir] || typeDir || 'content';
      const id = meta.id || idFromPath;
      const title = extractTitle(source, meta.title || id);

      fileNodes.push({
        path: relPath,
        name: fileName,
        title,
        type,
        kind: 'mdx-document',
        capability: 'visual-exact',
        capabilityLabel: 'Visual exacto',
        reason: 'Edición local en disco.',
        lang,
        id,
      });
    } else {
      const category = relPath.replace(/^content\/diagrams\//, '').split('/')[0] || 'general';
      const id = meta.id || idFromPath;
      const title = extractTitle(source, id);

      fileNodes.push({
        path: relPath,
        name: fileName,
        title,
        type: `diagram-${category.toLowerCase()}`,
        kind: 'diagram',
        capability: 'visual-exact',
        capabilityLabel: 'Visual exacto',
        reason: 'Edición local en disco.',
        id,
      });
    }
  }

  return fileNodes.sort((a, b) => a.path.localeCompare(b.path));
}

async function readRequestBody(req: import('node:http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export function viteEditorApiPlugin(): Plugin {
  const drafts = new Map<string, {
    path: string;
    source: string;
    sourceHash: string;
    baseVersion: string;
    localRevision: number;
    editorSessionId: string;
    savedAt: string;
  }>();

  return {
    name: 'vite-editor-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname.replace(/^\/Matematika/, '');

        if (!pathname.startsWith('/api/')) {
          return next();
        }

        const rootDir = getRootDir();

        try {
          if (pathname === '/api/list-content' && req.method === 'GET') {
            const catalog = await buildCatalog(rootDir);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(catalog));
            return;
          }

          if (pathname === '/api/content' && req.method === 'GET') {
            const relativePath = url.searchParams.get('path');
            if (!relativePath) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Missing path query parameter' }));
              return;
            }

            const absPath = path.resolve(rootDir, relativePath);
            if (!absPath.startsWith(rootDir)) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Access denied outside project root' }));
              return;
            }

            if (!fs.existsSync(absPath)) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: `File not found: ${relativePath}` }));
              return;
            }

            const source = await fs.promises.readFile(absPath, 'utf8');
            const sourceHash = crypto.createHash('sha256').update(source).digest('hex');

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              path: relativePath,
              source,
              sourceHash,
              version: `sha256:${sourceHash}`,
            }));
            return;
          }

          if (pathname === '/api/content' && req.method === 'POST') {
            const body = (await readRequestBody(req)) as {
              path?: string;
              source?: string;
              sourceHash?: string;
              expectedVersion?: string;
              localRevision?: number;
              create?: boolean;
            };

            if (!body.path || body.source === undefined) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Missing path or source in request body' }));
              return;
            }

            const absPath = path.resolve(rootDir, body.path);
            if (!absPath.startsWith(rootDir)) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Access denied outside project root' }));
              return;
            }

            if (fs.existsSync(absPath) && body.expectedVersion) {
              const existing = await fs.promises.readFile(absPath, 'utf8');
              const actualHash = crypto.createHash('sha256').update(existing).digest('hex');
              const actualVersion = `sha256:${actualHash}`;

              if (body.expectedVersion !== actualVersion) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  kind: 'content-conflict',
                  path: body.path,
                  expectedVersion: body.expectedVersion,
                  actualVersion,
                  localRevision: body.localRevision ?? 0,
                }));
                return;
              }
            }

            await fs.promises.mkdir(path.dirname(absPath), { recursive: true });
            await fs.promises.writeFile(absPath, body.source, 'utf8');

            const newHash = crypto.createHash('sha256').update(body.source).digest('hex');
            const version = `sha256:${newHash}`;

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              path: body.path,
              sourceHash: newHash,
              previousVersion: body.expectedVersion || version,
              version,
              confirmedRevision: body.localRevision ?? 0,
              backupId: `dev-backup-${Date.now()}`,
            }));
            return;
          }

          if (pathname === '/api/draft' && req.method === 'POST') {
            const body = (await readRequestBody(req)) as {
              path?: string;
              source?: string;
              sourceHash?: string;
              baseVersion?: string;
              localRevision?: number;
              editorSessionId?: string;
            };

            if (body.path && body.source) {
              drafts.set(body.path, {
                path: body.path,
                source: body.source,
                sourceHash: body.sourceHash || '',
                baseVersion: body.baseVersion || '',
                localRevision: body.localRevision || 0,
                editorSessionId: body.editorSessionId || '',
                savedAt: new Date().toISOString(),
              });
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              path: body.path || '',
              draftId: `draft-${Date.now()}`,
              sourceHash: body.sourceHash || '',
              baseVersion: body.baseVersion || '',
              localRevision: body.localRevision || 0,
              editorSessionId: body.editorSessionId || '',
              disposition: 'accepted',
              savedAt: new Date().toISOString(),
            }));
            return;
          }

          if (pathname === '/api/draft' && req.method === 'GET') {
            const relativePath = url.searchParams.get('path');
            const draft = relativePath ? drafts.get(relativePath) : undefined;
            if (!draft) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ message: 'Draft not found' }));
              return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              path: draft.path,
              draftId: `draft-${Date.now()}`,
              source: draft.source,
              sourceHash: draft.sourceHash,
              baseVersion: draft.baseVersion,
              localRevision: draft.localRevision,
              editorSessionId: draft.editorSessionId,
              disposition: 'accepted',
              savedAt: draft.savedAt,
              status: 'current',
              currentVersion: draft.baseVersion,
            }));
            return;
          }

          if (pathname === '/api/content/restore' && req.method === 'POST') {
            const body = (await readRequestBody(req)) as {
              path?: string;
              backupId?: string;
              expectedVersion?: string;
            };

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              path: body.path || '',
              sourceHash: 'restored-hash',
              previousVersion: body.expectedVersion || '',
              version: body.expectedVersion || '',
              backupId: body.backupId || '',
              restoredBackupId: body.backupId || '',
            }));
            return;
          }

          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: `API endpoint not found: ${pathname}` }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: err instanceof Error ? err.message : String(err) }));
        }
      });
    },
  };
}
