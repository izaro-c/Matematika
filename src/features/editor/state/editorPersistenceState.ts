import type { ContentVersion, EditorFileIdentity, LocalRevision } from '../persistence/persistenceContracts';
import type { PersistenceError } from '../persistence/persistenceErrors';

export type EditorPersistenceStatus =
  | { kind: 'idle' }
  | { kind: 'loading'; file: EditorFileIdentity }
  | { kind: 'ready-clean'; file: EditorFileIdentity; version: ContentVersion; confirmedRevision: LocalRevision }
  | { kind: 'ready-dirty'; file: EditorFileIdentity; version: ContentVersion; localRevision: LocalRevision }
  | { kind: 'validating'; file: EditorFileIdentity; localRevision: LocalRevision }
  | { kind: 'blocked'; file: EditorFileIdentity; localRevision: LocalRevision; reason: string }
  | { kind: 'saving-draft'; file: EditorFileIdentity; localRevision: LocalRevision }
  | { kind: 'draft-saved'; file: EditorFileIdentity; localRevision: LocalRevision; draftId: string }
  | { kind: 'saving-file'; file: EditorFileIdentity; localRevision: LocalRevision }
  | { kind: 'saved'; file: EditorFileIdentity; localRevision: LocalRevision; version: ContentVersion; backupId: string }
  | { kind: 'save-error'; file: EditorFileIdentity; localRevision: LocalRevision; error: PersistenceError }
  | { kind: 'conflict'; file: EditorFileIdentity; localRevision: LocalRevision; expectedVersion: ContentVersion; actualVersion: ContentVersion }
  | { kind: 'cancelled'; file: EditorFileIdentity; localRevision: LocalRevision }
  | { kind: 'unsupported'; file: EditorFileIdentity; reason: string };

export interface EditorPersistenceState {
  status: EditorPersistenceStatus;
  file: EditorFileIdentity | null;
  source: string;
  sourceHash: string;
  version: ContentVersion | null;
  localRevision: LocalRevision;
  confirmedRevision: LocalRevision;
}

export const initialEditorPersistenceState: EditorPersistenceState = {
  status: { kind: 'idle' }, file: null, source: '', sourceHash: '', version: null,
  localRevision: 0, confirmedRevision: 0
};

export type PersistenceAction =
  | { type: 'FILE_LOAD_STARTED'; file: EditorFileIdentity }
  | { type: 'FILE_LOAD_SUCCEEDED'; file: EditorFileIdentity; source: string; sourceHash: string; version: ContentVersion }
  | { type: 'FILE_LOAD_FAILED'; file: EditorFileIdentity; error: PersistenceError }
  | { type: 'SOURCE_CHANGED'; file: EditorFileIdentity; source: string; sourceHash: string; localRevision: LocalRevision }
  | { type: 'VALIDATION_STARTED'; file: EditorFileIdentity; localRevision: LocalRevision }
  | { type: 'VALIDATION_FAILED'; file: EditorFileIdentity; localRevision: LocalRevision; reason: string }
  | { type: 'DRAFT_SAVE_STARTED'; file: EditorFileIdentity; localRevision: LocalRevision }
  | { type: 'DRAFT_SAVE_SUCCEEDED'; file: EditorFileIdentity; localRevision: LocalRevision; draftId: string }
  | { type: 'DRAFT_SAVE_FAILED'; file: EditorFileIdentity; localRevision: LocalRevision; error: PersistenceError }
  | { type: 'FILE_SAVE_STARTED'; file: EditorFileIdentity; localRevision: LocalRevision }
  | { type: 'FILE_SAVE_SUCCEEDED'; file: EditorFileIdentity; localRevision: LocalRevision; version: ContentVersion; backupId: string }
  | { type: 'STALE_FILE_SAVE_SUCCEEDED'; file: EditorFileIdentity; localRevision: LocalRevision; version: ContentVersion; backupId: string }
  | { type: 'FILE_SAVE_FAILED'; file: EditorFileIdentity; localRevision: LocalRevision; error: PersistenceError }
  | { type: 'CONFLICT_DETECTED'; file: EditorFileIdentity; localRevision: LocalRevision; expectedVersion: string; actualVersion: string }
  | { type: 'REQUEST_ABORTED'; file: EditorFileIdentity; localRevision: LocalRevision }
  | { type: 'FILE_SWITCHED'; file: EditorFileIdentity };

function matches(state: EditorPersistenceState, file: EditorFileIdentity, revision?: number): boolean {
  return state.file?.path === file.path && (revision === undefined || state.localRevision === revision);
}

export function editorPersistenceReducer(state: EditorPersistenceState, action: PersistenceAction): EditorPersistenceState {
  switch (action.type) {
    case 'FILE_LOAD_STARTED': return { ...initialEditorPersistenceState, file: action.file, status: { kind: 'loading', file: action.file } };
    case 'FILE_LOAD_SUCCEEDED':
      if (!matches(state, action.file)) return state;
      return { status: { kind: 'ready-clean', file: action.file, version: action.version, confirmedRevision: 0 }, file: action.file,
        source: action.source, sourceHash: action.sourceHash, version: action.version, localRevision: 0, confirmedRevision: 0 };
    case 'FILE_LOAD_FAILED':
      if (!matches(state, action.file)) return state;
      return { ...state, status: { kind: 'save-error', file: action.file, localRevision: state.localRevision, error: action.error } };
    case 'SOURCE_CHANGED': {
      if (!matches(state, action.file) || !state.version) return state;
      if (action.localRevision <= state.localRevision) return state;
      const revision = action.localRevision;
      return { ...state, source: action.source, sourceHash: action.sourceHash, localRevision: revision,
        status: { kind: 'ready-dirty', file: action.file, version: state.version, localRevision: revision } };
    }
    case 'VALIDATION_STARTED':
      return matches(state, action.file, action.localRevision) ? { ...state, status: { kind: 'validating', file: action.file, localRevision: action.localRevision } } : state;
    case 'VALIDATION_FAILED':
      return matches(state, action.file, action.localRevision) ? { ...state, status: { kind: 'blocked', file: action.file, localRevision: action.localRevision, reason: action.reason } } : state;
    case 'DRAFT_SAVE_STARTED':
      return matches(state, action.file, action.localRevision) ? { ...state, status: { kind: 'saving-draft', file: action.file, localRevision: action.localRevision } } : state;
    case 'DRAFT_SAVE_SUCCEEDED':
      return matches(state, action.file, action.localRevision) ? { ...state, status: { kind: 'draft-saved', file: action.file, localRevision: action.localRevision, draftId: action.draftId } } : state;
    case 'FILE_SAVE_STARTED':
      return matches(state, action.file, action.localRevision) ? { ...state, status: { kind: 'saving-file', file: action.file, localRevision: action.localRevision } } : state;
    case 'FILE_SAVE_SUCCEEDED':
      if (!matches(state, action.file) || action.localRevision > state.localRevision) return state;
      if (action.localRevision < state.localRevision) {
        return { ...state, version: action.version, confirmedRevision: Math.max(state.confirmedRevision, action.localRevision),
          status: { kind: 'ready-dirty', file: action.file, version: action.version, localRevision: state.localRevision } };
      }
      return { ...state, version: action.version, confirmedRevision: action.localRevision,
        status: { kind: 'saved', file: action.file, localRevision: action.localRevision, version: action.version, backupId: action.backupId } };
    case 'STALE_FILE_SAVE_SUCCEEDED':
      if (!matches(state, action.file) || action.localRevision > state.localRevision) return state;
      return { ...state, version: action.version, confirmedRevision: Math.max(state.confirmedRevision, action.localRevision),
        status: { kind: 'ready-dirty', file: action.file, version: action.version, localRevision: state.localRevision } };
    case 'CONFLICT_DETECTED':
      return matches(state, action.file, action.localRevision) ? { ...state, status: { kind: 'conflict', file: action.file, localRevision: action.localRevision,
        expectedVersion: action.expectedVersion, actualVersion: action.actualVersion } } : state;
    case 'DRAFT_SAVE_FAILED':
    case 'FILE_SAVE_FAILED':
      return matches(state, action.file, action.localRevision) ? { ...state, status: { kind: 'save-error', file: action.file, localRevision: action.localRevision, error: action.error } } : state;
    case 'REQUEST_ABORTED':
      return matches(state, action.file, action.localRevision) ? { ...state, status: { kind: 'cancelled', file: action.file, localRevision: action.localRevision } } : state;
    case 'FILE_SWITCHED': return { ...initialEditorPersistenceState, file: action.file, status: { kind: 'loading', file: action.file } };
  }
}

export function persistenceStatusLabel(status: EditorPersistenceStatus): string {
  const labels: Record<EditorPersistenceStatus['kind'], string> = {
    idle: 'Sin archivo', loading: 'Cargando', 'ready-clean': 'Sin cambios', 'ready-dirty': 'Cambios locales',
    validating: 'Validando', blocked: 'Bloqueado', 'saving-draft': 'Guardando borrador', 'draft-saved': 'Borrador guardado',
    'saving-file': 'Aplicando archivo', saved: 'Archivo guardado', 'save-error': 'Error de guardado', conflict: 'Conflicto',
    cancelled: 'Operación cancelada', unsupported: 'Documento no compatible'
  };
  return labels[status.kind];
}
