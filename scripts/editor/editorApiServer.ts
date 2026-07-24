import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createEditorApiHandlers,
  handleEditorApiRequest,
  sendJson,
} from './editorApiRoutes';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = process.env.MATEMATIKA_PROJECT_ROOT
  ? path.resolve(process.env.MATEMATIKA_PROJECT_ROOT)
  : path.resolve(__dirname, '../..');

const port = Number(process.env.EDITOR_API_PORT || process.env.PORT || 8787);

const defaultOrigins = [
  'https://izaro-c.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];

function allowedOrigins(): string[] {
  const configured = process.env.EDITOR_CORS_ORIGIN?.split(',').map(value => value.trim()).filter(Boolean) ?? [];
  return [...new Set([...configured, ...defaultOrigins])];
}

function applyCors(req: http.IncomingMessage, res: http.ServerResponse): boolean {
  const origin = req.headers.origin;
  const origins = allowedOrigins();
  if (origin && origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', origins[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  return req.method === 'OPTIONS';
}

const handlers = createEditorApiHandlers({ projectRoot });

const server = http.createServer(async (req, res) => {
  if (applyCors(req, res)) {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host ?? 'localhost'}`);
  const handled = await handleEditorApiRequest(req, res, url.pathname, handlers);
  if (!handled) sendJson(res, 404, { message: 'Not found' });
});

server.listen(port, () => {
  const writeProtected = Boolean(handlers.writeToken);
  console.log(`Matematika editor API listening on http://127.0.0.1:${port}`);
  console.log(`Project root: ${projectRoot}`);
  console.log(`Write protection: ${writeProtected ? 'enabled (Bearer token required)' : 'disabled'}`);
});
