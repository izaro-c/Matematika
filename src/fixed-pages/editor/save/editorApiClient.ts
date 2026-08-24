import { z, type ZodType } from 'zod';
import {
  applyContentResponseSchema, conflictSchema, readContentResponseSchema, readDraftResponseSchema,
  restoreBackupResponseSchema, saveDraftResponseSchema,
  type ApplyContentRequest, type ApplyContentResponse, type EditorFileIdentity, type ReadContentResponse,
  type ReadDraftResponse, type RestoreBackupRequest, type RestoreBackupResponse,
  type SaveDraftRequest, type SaveDraftResponse
} from './persistenceContracts';
import { createContentRequestSchema, type CreateContentRequest } from './persistenceContracts';
import { PersistenceFailure } from './persistenceErrors';
import { editorApiPath, editorAuthHeaders } from './editorApiBase';

const fileListSchema = z.array(z.object({
  path: z.string(),
  name: z.string(),
  title: z.string().optional(),
  type: z.string(),
  kind: z.enum(['mdx-document', 'diagram']),
  capability: z.enum(['visual-exact', 'code-preview', 'invalid']),
  capabilityLabel: z.string(),
  reason: z.string(),
  lang: z.string().optional(),
  id: z.string().optional(),
}));

async function readPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) throw new PersistenceFailure({ kind: 'invalid-response', message: 'Response body is empty' });
  try { return JSON.parse(text) as unknown; }
  catch { throw new PersistenceFailure({ kind: 'invalid-response', message: 'Response is not valid JSON', payload: text }); }
}

async function request<T>(url: string, schema: ZodType<T>, init?: RequestInit): Promise<T> {
  let response: Response;
  const headers = {
    ...editorAuthHeaders(),
    ...(init?.headers ?? {}),
  };
  try { response = await fetch(url, { ...init, headers }); }
  catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new PersistenceFailure({ kind: 'aborted' });
    throw new PersistenceFailure({ kind: 'network-error', cause: error });
  }
  const payload = await readPayload(response);
  if (!response.ok) {
    if (response.status === 409) {
      const parsed = conflictSchema.safeParse(payload);
      if (!parsed.success) throw new PersistenceFailure({ kind: 'invalid-response', message: 'Invalid conflict payload', payload });
      if (parsed.data.kind === 'content-conflict') {
        throw new PersistenceFailure({
          kind: 'content-conflict',
          expectedVersion: parsed.data.expectedVersion,
          actualVersion: parsed.data.actualVersion
        });
      } else {
        throw new PersistenceFailure({
          kind: 'draft-conflict',
          expectedVersion: parsed.data.expectedVersion,
          actualVersion: parsed.data.actualVersion,
          localRevision: parsed.data.localRevision,
          editorSessionId: parsed.data.editorSessionId,
          reason: parsed.data.reason
        });
      }
    }
    const message = typeof payload === 'object' && payload && 'message' in payload ? String(payload.message) : `HTTP ${response.status}`;
    if (response.status === 401 || response.status === 403) throw new PersistenceFailure({ kind: 'unauthorized', message });
    if (response.status === 404) throw new PersistenceFailure({ kind: 'not-found', message });
    if (response.status >= 400 && response.status < 500) throw new PersistenceFailure({ kind: 'validation-error', message, details: payload });
    throw new PersistenceFailure({ kind: 'server-error', status: response.status, message });
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new PersistenceFailure({ kind: 'invalid-response', message: 'Response contract validation failed', payload });
  return parsed.data;
}

function json(requestBody: unknown, signal?: AbortSignal): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
    signal,
  };
}

import { getLocalCatalog, readLocalContent, applyLocalContent, saveLocalDraft } from './localEditorStore';

export class EditorApiClient {
  async readContent(file: EditorFileIdentity, signal?: AbortSignal): Promise<ReadContentResponse> {
    try {
      return await request(editorApiPath(`/Matematika/api/content?path=${encodeURIComponent(file.path)}`), readContentResponseSchema, { signal });
    } catch (error) {
      if (error instanceof PersistenceFailure && error.detail.kind !== 'network-error') throw error;
      return readLocalContent(file.path);
    }
  }
  async listContent(signal?: AbortSignal) {
    try {
      return await request(editorApiPath('/api/list-content'), fileListSchema, { signal });
    } catch (error) {
      if (error instanceof PersistenceFailure && error.detail.kind !== 'network-error') throw error;
      return getLocalCatalog();
    }
  }
  async readDraft(file: EditorFileIdentity, signal?: AbortSignal): Promise<ReadDraftResponse> {
    return request(editorApiPath(`/api/draft?path=${encodeURIComponent(file.path)}`), readDraftResponseSchema, { signal });
  }
  async saveDraft(value: SaveDraftRequest, signal?: AbortSignal): Promise<SaveDraftResponse> {
    try {
      return await request(editorApiPath('/api/draft'), saveDraftResponseSchema, json(value, signal));
    } catch (error) {
      if (error instanceof PersistenceFailure && error.detail.kind !== 'network-error') throw error;
      return saveLocalDraft(value);
    }
  }
  async applyContent(value: ApplyContentRequest, signal?: AbortSignal): Promise<ApplyContentResponse> {
    try {
      return await request(editorApiPath('/Matematika/api/content'), applyContentResponseSchema, json(value, signal));
    } catch (error) {
      if (error instanceof PersistenceFailure && error.detail.kind !== 'network-error') throw error;
      return applyLocalContent(value);
    }
  }
  async createContent(value: CreateContentRequest, signal?: AbortSignal): Promise<ApplyContentResponse> {
    const checked = createContentRequestSchema.parse(value);
    try {
      return await request(editorApiPath('/Matematika/api/content'), applyContentResponseSchema, json(checked, signal));
    } catch (error) {
      if (error instanceof PersistenceFailure && error.detail.kind !== 'network-error') throw error;
      return applyLocalContent(checked);
    }
  }
  restoreBackup(value: RestoreBackupRequest, signal?: AbortSignal): Promise<RestoreBackupResponse> {
    return request(editorApiPath('/Matematika/api/content/restore'), restoreBackupResponseSchema, json(value, signal));
  }
}

export const editorApiClient = new EditorApiClient();

