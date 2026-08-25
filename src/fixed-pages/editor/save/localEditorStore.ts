import type {
  ReadContentResponse,
  ApplyContentResponse,
  SaveDraftResponse,
  SaveDraftRequest,
} from './persistenceContracts';
import { hashSource } from './revision';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import contentIndexRaw from '@/data/content/contentIndex.json';

const STORAGE_PREFIX = 'matematika-local-file:';
const DRAFT_PREFIX = 'matematika-local-draft:';

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

function getRawText(val: unknown): string {
  if (typeof val === 'string') return val;
  if (
    val &&
    typeof val === 'object' &&
    'default' in val &&
    typeof (val as { default: unknown }).default === 'string'
  ) {
    return (val as { default: string }).default;
  }
  return '';
}

const rawMdxFiles = {
  ...(import.meta.glob('../../../../content/mdx/**/*.mdx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, unknown>),
  ...(import.meta.glob('/content/mdx/**/*.mdx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, unknown>),
  ...(import.meta.glob('../../../../docs/content/**/*.{md,mdx}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, unknown>),
  ...(import.meta.glob('/docs/content/**/*.{md,mdx}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, unknown>),
};

const rawDiagramFiles = {
  ...(import.meta.glob('../../../../content/diagrams/**/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, unknown>),
  ...(import.meta.glob('/content/diagrams/**/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, unknown>),
};

const localFiles = new Map<string, string>();
const fileMetaMap = new Map<string, { title?: string; type?: string; lang?: string; id?: string }>();

function normalizePath(globPath: string): string {
  const normalized = globPath.replace(/\\/g, '/');
  const mdxIdx = normalized.indexOf('content/mdx/');
  if (mdxIdx >= 0) return normalized.slice(mdxIdx);
  const docsIdx = normalized.indexOf('docs/content/');
  if (docsIdx >= 0) return normalized.slice(docsIdx);
  const diagIdx = normalized.indexOf('content/diagrams/');
  if (diagIdx >= 0) return normalized.slice(diagIdx);
  return normalized.replace(/^\/+/, '');
}

// 1. Seed from Vite glob imports
for (const [key, val] of Object.entries(rawMdxFiles)) {
  const text = getRawText(val);
  if (text) localFiles.set(normalizePath(key), text);
}
for (const [key, val] of Object.entries(rawDiagramFiles)) {
  const text = getRawText(val);
  if (text) localFiles.set(normalizePath(key), text);
}

// 2. Seed from contentIndex.json for 100% catalog coverage
interface IndexEntry {
  id?: string;
  slug?: string;
  lang?: string;
  filePath?: string;
  contentType?: string;
  metadata?: Record<string, unknown>;
}
const indexEntries = Object.values(contentIndexRaw as Record<string, IndexEntry>);

for (const entry of indexEntries) {
  if (!entry || !entry.filePath) continue;
  const fullPath = `content/mdx/${entry.filePath.replace(/^\/+/, '')}`;
  const meta = entry.metadata || {};
  const title = typeof meta.title === 'string' ? meta.title : entry.id || '';
  const type = entry.contentType || (typeof meta.type === 'string' ? meta.type : 'content');
  const lang = entry.lang || (typeof meta.lang === 'string' ? meta.lang : 'es');
  const id = entry.id || entry.slug || '';

  fileMetaMap.set(fullPath, { title, type, lang, id });

  if (!localFiles.has(fullPath)) {
    const metaJson = JSON.stringify(
      {
        id: id || 'documento',
        type: type || 'definicion',
        title: title || id,
        description: typeof meta.description === 'string' ? meta.description : '',
        lang,
      },
      null,
      2,
    );
    const stubSource = `export const metadata = ${metaJson};\n\n## ${title || id}\n\n${typeof meta.description === 'string' ? meta.description : ''}`;
    localFiles.set(fullPath, stubSource);
  }
}

// 3. Override from localStorage
if (typeof localStorage !== 'undefined') {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const filePath = key.slice(STORAGE_PREFIX.length);
      const val = localStorage.getItem(key);
      if (val !== null) localFiles.set(filePath, val);
    }
  }
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

export async function getLocalCatalog(): Promise<FileNode[]> {
  const catalogMap = new Map<string, FileNode>();

  for (const [filePath, source] of localFiles.entries()) {
    const isMdx = filePath.endsWith('.mdx');
    const isDiagram = filePath.endsWith('.tsx');
    if (!isMdx && !isDiagram) continue;

    const fileName = filePath.split('/').pop() || '';
    const idFromPath = fileName.replace(/\.(mdx|tsx)$/i, '');
    const meta = fileMetaMap.get(filePath);

    if (isMdx) {
      const relParts = filePath.replace(/^content\/mdx\//, '').split('/');
      let lang = meta?.lang || 'es';
      let typeDir = relParts[0];
      if (relParts.length > 1 && /^[a-z]{2}(-[A-Z]{2})?$/.test(relParts[0])) {
        lang = relParts[0];
        typeDir = relParts[1];
      }
      const type = meta?.type || CONTENT_TYPE_MAP[typeDir] || typeDir || 'content';
      const id = meta?.id || idFromPath;
      const title = extractTitle(source, meta?.title || id);

      catalogMap.set(filePath, {
        path: filePath,
        name: fileName,
        title,
        type,
        kind: 'mdx-document',
        capability: 'visual-exact',
        capabilityLabel: 'Visual exacto',
        reason: 'Edición local habilitada.',
        lang,
        id,
      });
    } else {
      const category = filePath.replace(/^content\/diagrams\//, '').split('/')[0] || 'general';
      const id = idFromPath;
      const title = extractTitle(source, id);

      catalogMap.set(filePath, {
        path: filePath,
        name: fileName,
        title,
        type: `diagram-${category.toLowerCase()}`,
        kind: 'diagram',
        capability: 'visual-exact',
        capabilityLabel: 'Visual exacto',
        reason: 'Edición local habilitada.',
        id,
      });
    }
  }

  return Array.from(catalogMap.values()).sort((a, b) => a.path.localeCompare(b.path));
}

export async function readLocalContent(path: string): Promise<ReadContentResponse> {
  const normalizedKey = normalizePath(path);
  const source =
    localFiles.get(normalizedKey) ??
    (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_PREFIX + normalizedKey) : null) ??
    '';
  const sourceHash = await hashSource(source);
  return {
    path: normalizedKey,
    source,
    sourceHash,
    version: `sha256:${sourceHash}`,
  };
}

export async function applyLocalContent(req: {
  path: string;
  source: string;
  sourceHash?: string;
  expectedVersion?: string;
  localRevision: number;
}): Promise<ApplyContentResponse> {
  const normalizedKey = normalizePath(req.path);
  localFiles.set(normalizedKey, req.source);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_PREFIX + normalizedKey, req.source);
  }
  const sourceHash = req.sourceHash ?? (await hashSource(req.source));
  const version = `sha256:${sourceHash}`;
  return {
    path: normalizedKey,
    confirmedRevision: req.localRevision,
    previousVersion: req.expectedVersion ?? version,
    version,
    sourceHash,
    backupId: 'local-backup',
  };
}

export async function saveLocalDraft(req: SaveDraftRequest): Promise<SaveDraftResponse> {
  const normalizedKey = normalizePath(req.path);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(DRAFT_PREFIX + normalizedKey, req.source);
  }
  return {
    path: normalizedKey,
    draftId: `draft-local-${Date.now()}`,
    sourceHash: req.sourceHash,
    baseVersion: req.baseVersion,
    localRevision: req.localRevision,
    editorSessionId: req.editorSessionId,
    disposition: 'accepted',
    savedAt: new Date().toISOString(),
  };
}
