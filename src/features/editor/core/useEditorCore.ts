import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type SetStateAction } from 'react';
import type { FileNode } from '../lib/editorContracts';
import type { DirtyState, EditorMode, EditorValidationResult } from './editorTypes';
import type { Block, BlockType } from './parser';
import {
  openEditorDocument, enterVisualMode, applyVisualOperation,
  parseEditorDocument, getVisualCapabilities,
  computeFingerprint,
  type EditorDocument, type ProjectedBlock, type SourceEdit, type SourceRange
} from '../document';
import {
  ContentRepository, DraftRepository, SaveCoordinator, editorApiClient, hashSource,
  type EditorSaveSnapshot, type PersistenceError, type SaveCoordinatorEvent
} from '../persistence';
import {
  editorPersistenceReducer, initialEditorPersistenceState, persistenceStatusLabel
} from '../state';
import type { ApprovedDiff, ExpectedDiffRange } from '../ux/diffReview';

export type VisualSavePolicy = 'disabled' | 'manual-reviewed' | 'enabled';
export const VISUAL_SAVE_POLICY: VisualSavePolicy = 'enabled';
export const DRAFT_AUTOSAVE_ENABLED = false;

interface OpenFileOptions {
  discardLocalChanges?: boolean;
}

const contentRepository = new ContentRepository(editorApiClient);
const draftRepository = new DraftRepository(editorApiClient);

function blockText(block: ProjectedBlock): string {
  if (block.kind === 'opaque') return block.source;
  if (block.data && typeof block.data === 'object' && 'text' in block.data) return String((block.data as { text: unknown }).text);
  return block.originalSource;
}

function mapProjectedBlocks(projected: ProjectedBlock[]): Block[] {
  return projected.map(block => ({
    id: block.id,
    type: block.kind === 'editable' ? block.blockType as BlockType : 'advancedMdx',
    content: blockText(block),
    metadata: block.kind === 'editable'
      ? { location: block.location, editRange: block.editRange, originalSource: block.originalSource, editable: true,
          ...(block.blockType === 'heading' && block.data && typeof block.data === 'object'
            ? { level: (block.data as { depth?: number }).depth } : {}) }
      : { location: block.location, opaque: true, reason: block.reason, nodeType: block.nodeType }
  }));
}

function sliceRanges(source: string, ranges: Array<{ start: number; end: number }>): string {
  return ranges.map(range => source.slice(range.start, range.end)).join('\n');
}

function persistenceMessage(error: PersistenceError): string {
  if (error.kind === 'content-conflict') return 'Conflicto: el archivo cambió externamente. Recárguelo antes de aplicar.';
  if (error.kind === 'draft-conflict') return 'Conflicto: ya existe un borrador más reciente de otra sesión.';
  if (error.kind === 'invalid-response' || error.kind === 'protocol-error') return 'El servidor devolvió una respuesta inválida; no se confirmó el guardado.';
  if (error.kind === 'aborted') return 'Operación cancelada.';
  if (error.kind === 'network-error') return 'Error de red; los cambios locales se conservan.';
  return 'Error de persistencia; los cambios locales se conservan.';
}

const blockedMessage = 'Acción visual bloqueada: todavía no existe un parche localizado demostrablemente lossless.';

class LiveSaveIdentity {
  private path: string | null = null;
  private source = '';
  private revision = 0;

  set(filePath: string, source: string, revision: number): void {
    this.path = filePath;
    this.source = source;
    this.revision = revision;
  }

  clear(): void { this.path = null; }

  matches(snapshot: EditorSaveSnapshot): boolean {
    return this.path === snapshot.file.path && this.source === snapshot.source && this.revision === snapshot.localRevision;
  }
}

interface TrackedVisualOperation {
  operationId: string;
  blockId: string;
  range: SourceRange;
  reason: string;
}

export const useEditorCore = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('code');
  const [metadata] = useState<Record<string, unknown>>({});
  const [imports, setImportsView] = useState('');
  const [exports, setExportsView] = useState('');
  const [blocks, setBlocksView] = useState<Block[]>([]);
  const [doc, setDoc] = useState<EditorDocument | null>(null);
  const [message, setMessage] = useState('');
  const [baseSource, setBaseSource] = useState('');
  const [persistence, dispatch] = useReducer(editorPersistenceReducer, initialEditorPersistenceState);
  const persistenceRef = useRef(persistence);
  const sourceRef = useRef('');
  const revisionRef = useRef(0);
  const visualOperationsRef = useRef<TrackedVisualOperation[]>([]);
  const loadControllerRef = useRef<AbortController | undefined>(undefined);
  const saveIdentity = useMemo(() => new LiveSaveIdentity(), []);
  const editorSessionId = useMemo(() => crypto.randomUUID(), []);
  const isMountedRef = useRef(true);
  const [coordinator, setCoordinator] = useState<SaveCoordinator | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => { persistenceRef.current = persistence; }, [persistence]);

  const onCoordinatorEvent = useCallback((event: SaveCoordinatorEvent) => {
      const { file, localRevision } = event.snapshot;
      if (event.type === 'draft-started') dispatch({ type: 'DRAFT_SAVE_STARTED', file, localRevision });
      else if (event.type === 'draft-succeeded') dispatch({ type: 'DRAFT_SAVE_SUCCEEDED', file, localRevision, draftId: event.draftId });
      else if (event.type === 'apply-started') dispatch({ type: 'FILE_SAVE_STARTED', file, localRevision });
      else if (event.type === 'apply-succeeded') {
        const isCurrentSnapshot = saveIdentity.matches(event.snapshot);
        if (isCurrentSnapshot) setBaseSource(event.snapshot.source);
        dispatch({ type: isCurrentSnapshot ? 'FILE_SAVE_SUCCEEDED' : 'STALE_FILE_SAVE_SUCCEEDED',
          file, localRevision, version: event.version, backupId: event.backupId });
      } else if (event.error.kind === 'content-conflict') {
        if (!saveIdentity.matches(event.snapshot)) return;
        dispatch({ type: 'CONFLICT_DETECTED', file, localRevision,
          expectedVersion: event.error.expectedVersion, actualVersion: event.error.actualVersion });
      } else {
        if (!saveIdentity.matches(event.snapshot)) return;
        dispatch({ type: event.type === 'draft-failed' ? 'DRAFT_SAVE_FAILED' : 'FILE_SAVE_FAILED', file, localRevision, error: event.error });
      }
  }, [saveIdentity]);

  useEffect(() => {
    const nextCoordinator = new SaveCoordinator(contentRepository, draftRepository, onCoordinatorEvent);
    setCoordinator(nextCoordinator);
    return () => nextCoordinator.dispose();
  }, [onCoordinatorEvent]);
  useEffect(() => () => { loadControllerRef.current?.abort(); }, []);

  const currentFile = persistence.file?.path ?? null;
  const rawBody = persistence.source;
  const loading = persistence.status.kind === 'loading';
  const saving = persistence.status.kind === 'saving-file' || persistence.status.kind === 'saving-draft';
  const dirtyState: DirtyState = persistence.status.kind === 'ready-clean' || persistence.status.kind === 'saved' ? 'clean'
    : persistence.status.kind === 'blocked' ? 'blocked'
      : saving ? 'saving' : persistence.localRevision > persistence.confirmedRevision ? 'dirty' : 'clean';
  const compatibility = doc?.compatibility ?? 'unsupported';
  const compatibilityReasons = doc?.compatibilityReasons ?? [];
  const capabilities = useMemo(() => getVisualCapabilities(compatibility), [compatibility]);
  const isDiagramSource = currentFile?.endsWith('.tsx') ?? false;
  const validation = useMemo<EditorValidationResult>(() => {
    if (isDiagramSource) return { issues: [], canSave: true, errorCount: 0, warningCount: 0 };
    const critical = doc?.diagnostics.filter(item => item.severity === 'critical') ?? [];
    return { issues: critical.map(item => ({
      id: item.code,
      area: 'body' as const,
      severity: 'error' as const,
      message: item.message,
      blockId: item.blockId,
      sourceRange: item.sourceRange ?? item.location?.range
    })),
      canSave: critical.length === 0, errorCount: critical.length, warningCount: 0 };
  }, [doc, isDiagramSource]);

  const loadFileList = useCallback(async () => {
    setFilesLoading(true);
    setFilesError(null);
    try { setFiles(await editorApiClient.listContent() as FileNode[]); }
    catch (error) {
      console.error('Error cargando lista de archivos:', error);
      setFilesError('El servidor del editor no devolvió el catálogo seguro.');
    }
    finally { setFilesLoading(false); }
  }, []);

  const syncProjection = useCallback((nextDoc: EditorDocument) => {
    setDoc(nextDoc);
    setBlocksView(mapProjectedBlocks(nextDoc.bodyBlocks));
    setImportsView(sliceRanges(nextDoc.source, nextDoc.envelope.importRanges));
    setExportsView(sliceRanges(nextDoc.source, nextDoc.envelope.exportRanges));
  }, []);

  const openFile = useCallback(async (filePath: string, options: OpenFileOptions = {}) => {
    const file = { path: filePath };
    const active = persistenceRef.current;
    if (!options.discardLocalChanges && active.file && active.file.path !== filePath && (active.localRevision > active.confirmedRevision || revisionRef.current > active.confirmedRevision)) {
      setMessage('Cambio de archivo bloqueado: existen cambios locales sin aplicar.');
      return;
    }
    loadControllerRef.current?.abort();
    coordinator?.cancelAll();
    saveIdentity.clear();
    const controller = new AbortController();
    loadControllerRef.current = controller;
    dispatch({ type: 'FILE_LOAD_STARTED', file });
    setMessage('');
    try {
      const response = await contentRepository.read(file, controller.signal);
      if (controller.signal.aborted) return;
      sourceRef.current = response.source;
      visualOperationsRef.current = [];
      setBaseSource(response.source);
      revisionRef.current = 0;
      saveIdentity.set(file.path, response.source, 0);
      dispatch({ type: 'FILE_LOAD_SUCCEEDED', file, source: response.source, sourceHash: response.sourceHash, version: response.version });
      if (filePath.endsWith('.mdx')) syncProjection(parseEditorDocument(response.source));
      else { setDoc(null); setBlocksView([]); setImportsView(''); setExportsView(''); }
      setEditorMode('code');
    } catch (error) {
      if (controller.signal.aborted) return;
      const detail: PersistenceError = error && typeof error === 'object' && 'detail' in error
        ? (error as { detail: PersistenceError }).detail : { kind: 'network-error', cause: error };
      dispatch({ type: 'FILE_LOAD_FAILED', file, error: detail });
      setMessage(persistenceMessage(detail));
    }
  }, [coordinator, saveIdentity, syncProjection]);

  const commitSourceChange = useCallback((source: string, nextDoc?: EditorDocument, visualOperation?: TrackedVisualOperation) => {
    const file = persistenceRef.current.file;
    if (!file) return;
    sourceRef.current = source;
    visualOperationsRef.current = visualOperation ? [...visualOperationsRef.current, visualOperation] : [];
    setMessage('');
    revisionRef.current += 1;
    const revision = revisionRef.current;
    saveIdentity.set(file.path, source, revision);
    dispatch({ type: 'SOURCE_CHANGED', file, source, localRevision: revision });
    if (nextDoc) syncProjection(nextDoc);
    hashSource(source).then((sourceHash) => {
      if (!isMountedRef.current) return;
      const active = persistenceRef.current;
      if (
        active.file?.path !== file.path ||
        revisionRef.current !== revision ||
        sourceRef.current !== source
      ) {
        return;
      }
      dispatch({ type: 'SOURCE_HASH_RESOLVED', file, source, sourceHash, localRevision: revision });
      if (DRAFT_AUTOSAVE_ENABLED && active.version) {
        coordinator?.scheduleDraft({ file, source, sourceHash, localRevision: revision,
          baseVersion: active.version, editorSessionId });
      }
    });
  }, [coordinator, editorSessionId, saveIdentity, syncProjection]);

  const toggleEditorMode = useCallback(() => {
    if (editorMode === 'visual') { setEditorMode('code'); return; }
    if (!currentFile?.endsWith('.mdx')) return;
    const nextDoc = enterVisualMode(openEditorDocument(sourceRef.current)).document;
    if (nextDoc.compatibility === 'unsupported') { setMessage(`Modo visual bloqueado: ${nextDoc.compatibilityReasons.join(' ')}`); return; }
    syncProjection(nextDoc);
    setEditorMode('visual');
  }, [currentFile, editorMode, syncProjection]);

  const updateRawBody = useCallback((source: string) => {
    const nextDoc = currentFile?.endsWith('.mdx') ? parseEditorDocument(source) : undefined;
    commitSourceChange(source, nextDoc);
  }, [commitSourceChange, currentFile]);

  const updateBlock = useCallback((id: string, content: string, _metadata?: Record<string, unknown>) => {
    if (!doc || !capabilities.canEditSafeBlocks) { setMessage(blockedMessage); return; }
    const block = doc.bodyBlocks.find(candidate => candidate.id === id);
    if (!block || block.kind !== 'editable') { setMessage('Acción visual bloqueada: los bloques opacos son inmutables.'); return; }
    const edit: SourceEdit = { operationId: `edit-${id}-${doc.sourceFingerprint}`, blockId: id, range: block.editRange,
      expectedSource: block.originalSource, replacement: content };
    try {
      const nextDoc = applyVisualOperation(enterVisualMode({ document: doc, mode: 'code', appliedOperationIds: [] }), edit).document;
      commitSourceChange(nextDoc.source, nextDoc, {
        operationId: edit.operationId,
        blockId: id,
        range: block.editRange,
        reason: `Bloque visual ${id} editado.`,
      });
      setMessage('Cambio visual aplicado localmente; el guardado visual permanece deshabilitado.');
    } catch (error) { setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`); }
  }, [capabilities.canEditSafeBlocks, commitSourceChange, doc]);

  const blockUnsafeAction = useCallback((_id?: string) => setMessage(blockedMessage), []);
  const setMetadata = useCallback((_next: SetStateAction<Record<string, unknown>>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setImports = useCallback((_next: SetStateAction<string>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setExports = useCallback((_next: SetStateAction<string>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setBlocks = useCallback((_next: SetStateAction<Block[]>) => blockUnsafeAction(), [blockUnsafeAction]);

  const getExpectedDiffRanges = useCallback((): ExpectedDiffRange[] => {
    return visualOperationsRef.current.map(operation => ({
      start: operation.range.start,
      end: operation.range.end,
      reason: operation.reason,
      operationId: operation.operationId,
      blockId: operation.blockId,
    }));
  }, []);

  const hasValidPartialApproval = useCallback((
    approval: ApprovedDiff | undefined,
    captured: { file: { path: string }; source: string; localRevision: number; baseVersion: string },
  ): boolean => {
    if (!approval) return false;
    const operationIds = getExpectedDiffRanges().map(range => range.operationId).sort();
    return approval.documentId === captured.file.path
      && approval.baseVersion === captured.baseVersion
      && approval.baseSourceHash === computeFingerprint(baseSource)
      && approval.candidateSourceHash === computeFingerprint(captured.source)
      && approval.revision === captured.localRevision
      && approval.operationIds.join('\0') === operationIds.join('\0')
      && approval.expectedRanges.length === visualOperationsRef.current.length
      && approval.expectedRanges.every(range => (
        operationIds.includes(range.operationId)
        && visualOperationsRef.current.some(operation => (
          operation.operationId === range.operationId
          && operation.blockId === range.blockId
          && operation.range.start === range.start
          && operation.range.end === range.end
        ))
      ));
  }, [baseSource, getExpectedDiffRanges]);

  const saveCurrentFile = useCallback(async (approval?: ApprovedDiff): Promise<boolean> => {
    const state = persistenceRef.current;
    if (!state.file || !state.version) return false;
    if (editorMode === 'visual' && !isDiagramSource) {
      if ((VISUAL_SAVE_POLICY as VisualSavePolicy) === 'disabled') {
        setMessage('El guardado visual está desactivado por contención de seguridad.');
        return false;
      }
      if (compatibility === 'read-only') {
        setMessage('El guardado visual está desactivado para documentos de solo lectura.');
        return false;
      }
      if (compatibility === 'unsupported') {
        setMessage('El guardado visual está desactivado para documentos no soportados.');
        return false;
      }
    }
    const captured = {
      file: state.file,
      source: sourceRef.current,
      localRevision: revisionRef.current,
      baseVersion: state.version
    };
    if (captured.file.path.endsWith('.mdx') && parseEditorDocument(captured.source).compatibility === 'unsupported') {
      dispatch({ type: 'VALIDATION_FAILED', file: captured.file, localRevision: captured.localRevision, reason: 'Invalid MDX source' });
      setMessage('No se puede aplicar: el source MDX actual no se puede analizar.');
      return false;
    }
    if (captured.file.path.endsWith('.mdx')) {
      const candidateDoc = parseEditorDocument(captured.source);
      if (candidateDoc.compatibility === 'partially-editable' && !hasValidPartialApproval(approval, captured)) {
        dispatch({ type: 'VALIDATION_FAILED', file: captured.file, localRevision: captured.localRevision, reason: 'Diff approval required' });
        setMessage('No se puede aplicar: la edición visual exacta por rangos requiere una revisión de diff vigente.');
        return false;
      }
    }
    const sourceHash = await hashSource(captured.source);
    if (persistenceRef.current.file?.path !== captured.file.path
      || revisionRef.current !== captured.localRevision
      || sourceRef.current !== captured.source) return false;
    const snapshot: EditorSaveSnapshot = { ...captured, sourceHash };
    if (!coordinator) return false;
    const confirmed = await coordinator.applyNow(snapshot);
    return confirmed
      && revisionRef.current === snapshot.localRevision
      && sourceRef.current === snapshot.source
      && persistenceRef.current.file?.path === snapshot.file.path;
  }, [coordinator, editorMode, isDiagramSource, compatibility, hasValidPartialApproval]);

  const saveDraftCurrentFile = useCallback(async (): Promise<boolean> => {
    const state = persistenceRef.current;
    if (!coordinator || !state.file || !state.version || state.localRevision <= state.confirmedRevision) return false;
    const source = sourceRef.current;
    const localRevision = revisionRef.current;
    const sourceHash = await hashSource(source);
    if (persistenceRef.current.file?.path !== state.file.path || revisionRef.current !== localRevision || sourceRef.current !== source) {
      return false;
    }
    await coordinator.saveDraftNow({
      file: state.file,
      source,
      sourceHash,
      localRevision,
      baseVersion: state.version,
      editorSessionId,
    });
    return true;
  }, [coordinator, editorSessionId]);

  return {
    files, filesLoading, filesError, loading, currentFile, editorMode, metadata, imports, exports, blocks, rawBody,
    baseSource, localRevision: persistence.localRevision, baseVersion: persistence.version,
    saving, dirtyState, validation, message, persistenceStatus: persistence.status,
    persistenceLabel: persistenceStatusLabel(persistence.status),
    loadFileList, openFile, toggleEditorMode, setEditorMode, updateRawBody, updateBlock, saveCurrentFile, saveDraftCurrentFile,
    compatibility, compatibilityReasons, capabilities,
    removeBlock: (id: string) => blockUnsafeAction(id), addBlock: (_index: number, _type: BlockType) => blockUnsafeAction(),
    moveBlock: (_from: number, _to: number) => blockUnsafeAction(), setMetadata, setImports, setExports, setBlocks,
    canMutateVisualStructure: false, canEditVisualMetadata: false,
    getExpectedDiffRanges
  };
};
