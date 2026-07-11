import { z } from 'zod';

export type ContentVersion = string & { readonly __contentVersionBrand?: never };
export type LocalRevision = number & { readonly __localRevisionBrand?: never };

export interface EditorFileIdentity { path: string }

export interface RevisionSnapshot {
  file: EditorFileIdentity;
  localRevision: LocalRevision;
  sourceHash: string;
  baseVersion: ContentVersion;
}

export interface EditorSaveSnapshot extends RevisionSnapshot { source: string }
export interface EditorDraftSnapshot extends EditorSaveSnapshot { editorSessionId: string }

export const readContentResponseSchema = z.object({
  path: z.string().min(1), source: z.string(), sourceHash: z.string().min(1), version: z.string().min(1)
}).strict();
export type ReadContentResponse = z.infer<typeof readContentResponseSchema>;

export const saveDraftRequestSchema = z.object({
  path: z.string().min(1), source: z.string(), sourceHash: z.string().min(1),
  baseVersion: z.string().min(1), localRevision: z.number().int().nonnegative(), editorSessionId: z.string().min(1)
}).strict();
export type SaveDraftRequest = z.infer<typeof saveDraftRequestSchema>;

export const saveDraftResponseSchema = z.object({
  path: z.string().min(1), draftId: z.string().min(1), sourceHash: z.string().min(1),
  baseVersion: z.string().min(1), localRevision: z.number().int().nonnegative(), editorSessionId: z.string().min(1),
  disposition: z.enum(['accepted', 'ignored-stale']), savedAt: z.string().min(1)
}).strict();
export type SaveDraftResponse = z.infer<typeof saveDraftResponseSchema>;

export const readDraftResponseSchema = saveDraftResponseSchema.extend({
  source: z.string(), status: z.enum(['current', 'stale']), currentVersion: z.string().min(1)
}).strict();
export type ReadDraftResponse = z.infer<typeof readDraftResponseSchema>;

export const applyContentRequestSchema = z.object({
  path: z.string().min(1), source: z.string(), sourceHash: z.string().min(1),
  expectedVersion: z.string().min(1), localRevision: z.number().int().nonnegative()
}).strict();
export type ApplyContentRequest = z.infer<typeof applyContentRequestSchema>;

export const applyContentResponseSchema = z.object({
  path: z.string().min(1), sourceHash: z.string().min(1), previousVersion: z.string().min(1),
  version: z.string().min(1), confirmedRevision: z.number().int().nonnegative(), backupId: z.string().min(1)
}).strict();
export type ApplyContentResponse = z.infer<typeof applyContentResponseSchema>;

export const restoreBackupRequestSchema = z.object({
  path: z.string().min(1), backupId: z.string().min(1), expectedVersion: z.string().min(1)
}).strict();
export type RestoreBackupRequest = z.infer<typeof restoreBackupRequestSchema>;

export const restoreBackupResponseSchema = z.object({
  path: z.string().min(1), sourceHash: z.string().min(1), previousVersion: z.string().min(1),
  version: z.string().min(1), backupId: z.string().min(1), restoredBackupId: z.string().min(1)
}).strict();
export type RestoreBackupResponse = z.infer<typeof restoreBackupResponseSchema>;

export const contentConflictSchema = z.object({
  kind: z.literal('content-conflict'),
  path: z.string(),
  expectedVersion: z.string(),
  actualVersion: z.string(),
  localRevision: z.number().int().nonnegative()
}).strict();
export type ContentConflict = z.infer<typeof contentConflictSchema>;

export const draftConflictSchema = z.object({
  kind: z.literal('draft-conflict'),
  path: z.string(),
  expectedVersion: z.string(),
  actualVersion: z.string(),
  localRevision: z.number().int().nonnegative(),
  editorSessionId: z.string().min(1),
  reason: z.enum(['base-version-mismatch', 'revision-source-mismatch', 'stale-revision']).optional()
}).strict();
export type DraftConflict = z.infer<typeof draftConflictSchema>;

export const conflictSchema = z.discriminatedUnion('kind', [
  contentConflictSchema,
  draftConflictSchema
]);
