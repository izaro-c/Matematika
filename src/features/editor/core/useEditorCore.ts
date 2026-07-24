import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type SetStateAction } from 'react';
import type { FileNode } from '../lib/editorContracts';
import type { DirtyState, EditorMode, EditorValidationResult } from './editorTypes';
import type { Block, BlockType } from './parser';
import {
  openEditorDocument, enterVisualMode,
  parseEditorDocument, getVisualCapabilities,
  applyMutationPlan, planBlockUpdate, planBlockInsertion, planBlockDeletion,
  planBlockDuplication, planBlockMove, planMetadataUpdate, planDiagramBinding,
  type DocumentMutationPlan, type EditorDocument, type ProjectedBlock
} from '../document';
import {
  ContentRepository, DraftRepository, SaveCoordinator, editorApiClient, hashSource,
  type EditorSaveSnapshot, type PersistenceError, type SaveCoordinatorEvent
} from '../persistence';
import { editorApiUnavailableInProduction, editorWriteAccessGranted } from '../persistence/editorApiBase';
import {
  editorPersistenceReducer, initialEditorPersistenceState, persistenceStatusLabel
} from '../state';
import { validateEditorDocument } from './validation';
import { buildAuthoringIntegrityReport, createPagePath, createPageSource, type CreatePageInput } from '../ux/authoringModel';
import type { DiagramTargetRegistry, EditorDiagramReference } from './editorTypes';

export type VisualSavePolicy = 'disabled' | 'manual-reviewed' | 'enabled';
export const VISUAL_SAVE_POLICY: VisualSavePolicy = 'enabled';
export const DRAFT_AUTOSAVE_ENABLED = false;

interface OpenFileOptions {
  discardLocalChanges?: boolean;
}

const contentRepository = new ContentRepository(editorApiClient);
const draftRepository = new DraftRepository(editorApiClient);

function blockText(block: ProjectedBlock): string {
  if (block.kind !== 'editable') return block.source;
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
          ...(block.data && typeof block.data === 'object' && 'attributes' in block.data
            ? (block.data as { attributes?: Record<string, unknown> }).attributes : {}),
          ...(block.data && typeof block.data === 'object' && 'component' in block.data
            ? { component: (block.data as { component?: string }).component } : {}),
          ...(block.data && typeof block.data === 'object' && 'steps' in block.data
            ? { steps: (block.data as { steps?: unknown[] }).steps } : {}),
          ...(block.data && typeof block.data === 'object' && 'capitular' in block.data
            ? { capitular: (block.data as { capitular?: string }).capitular } : {}),
          ...(block.blockType === 'heading' && block.data && typeof block.data === 'object'
            ? { level: (block.data as { depth?: number }).depth } : {}) }
      : { location: block.location, opaque: block.kind === 'opaque', preserved: block.kind === 'preserved', reason: block.reason, nodeType: block.nodeType }
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

const blockedMessage = 'Acción bloqueada: no hay documento abierto.';

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


export const useEditorCore = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');
  const [metadata, setMetadataView] = useState<Record<string, unknown>>({});
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
  const loadControllerRef = useRef<AbortController | undefined>(undefined);
  const saveIdentity = useMemo(() => new LiveSaveIdentity(), []);
  const editorSessionId = useMemo(() => crypto.randomUUID(), []);
  const isMountedRef = useRef(true);

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

  const coordinator = useMemo(
    () => new SaveCoordinator(contentRepository, draftRepository, onCoordinatorEvent),
    [onCoordinatorEvent],
  );

  useEffect(() => () => coordinator.dispose(), [coordinator]);
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
    const documentIssues = (doc?.diagnostics ?? []).map(item => ({
      id: item.code,
      area: item.panel === 'metadata' ? 'metadata' as const : 'body' as const,
      severity: item.severity === 'info' ? 'info' as const : item.severity === 'warning' ? 'warning' as const : 'error' as const,
      message: item.message,
      blockId: item.blockId,
      sourceRange: item.sourceRange ?? item.location?.range
    }));
    const structured = validateEditorDocument({ metadata, imports, exports, blocks, rawBody });
    const integrity = buildAuthoringIntegrityReport({
      source: rawBody,
      metadata,
      currentFile,
      diagramTargets: blocks.flatMap(block => Array.isArray(block.metadata?.targets) ? block.metadata.targets : []) as DiagramTargetRegistry,
    });
    const byId = new Map([...documentIssues, ...structured.issues, ...integrity].map(issue => [issue.id, issue]));
    const issues = [...byId.values()];
    const errorCount = issues.filter(issue => issue.severity === 'error').length;
    const warningCount = issues.filter(issue => issue.severity === 'warning').length;
    return { issues, canSave: errorCount === 0, errorCount, warningCount };
  }, [blocks, currentFile, doc, exports, imports, isDiagramSource, metadata, rawBody]);

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
    setMetadataView(nextDoc.metadata.value ?? {});
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
      setBaseSource(response.source);
      revisionRef.current = 0;
      saveIdentity.set(file.path, response.source, 0);
      dispatch({ type: 'FILE_LOAD_SUCCEEDED', file, source: response.source, sourceHash: response.sourceHash, version: response.version });
      if (filePath.endsWith('.mdx')) {
        const nextDocument = parseEditorDocument(response.source);
        syncProjection(nextDocument);
        setEditorMode(nextDocument.compatibility === 'unsupported' ? 'code' : 'visual');
      } else {
        setDoc(null); setBlocksView([]); setImportsView(''); setExportsView('');
        setEditorMode('code');
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      const detail: PersistenceError = error && typeof error === 'object' && 'detail' in error
        ? (error as { detail: PersistenceError }).detail : { kind: 'network-error', cause: error };
      dispatch({ type: 'FILE_LOAD_FAILED', file, error: detail });
      setMessage(persistenceMessage(detail));
    }
  }, [coordinator, saveIdentity, syncProjection]);

  const commitSourceChange = useCallback((source: string, nextDoc?: EditorDocument) => {
    const file = persistenceRef.current.file;
    if (!file) return;
    sourceRef.current = source;
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

  const commitMutation = useCallback((mutation: DocumentMutationPlan, successMessage: string) => {
    if (!doc) { setMessage(blockedMessage); return; }
    try {
      const nextDoc = applyMutationPlan(doc, mutation);
      commitSourceChange(nextDoc.source, nextDoc);
      setMessage(successMessage);
    } catch (error) {
      setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [commitSourceChange, doc]);

  const updateBlock = useCallback((id: string, content: string, blockMetadata?: Record<string, unknown>) => {
    if (!doc || !capabilities.canEditSafeBlocks) { setMessage(blockedMessage); return; }
    try {
      commitMutation(planBlockUpdate(doc, id, { content, metadata: blockMetadata }), 'Cambio localizado aplicado.');
    } catch (error) {
      setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [capabilities.canEditSafeBlocks, commitMutation, doc]);

  const blockUnsafeAction = useCallback((_id?: string) => setMessage(blockedMessage), []);
  const setMetadata = useCallback((nextAction: SetStateAction<Record<string, unknown>>) => {
    if (!doc || doc.metadata.status !== 'readable') { setMessage('Los metadatos no son legibles de forma estática. Edítelos en código.'); return; }
    const next = typeof nextAction === 'function' ? nextAction(metadata) : nextAction;
    try {
      commitMutation(planMetadataUpdate(doc, next), 'Metadatos actualizados mediante parches de propiedades.');
    } catch (error) {
      setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [commitMutation, doc, metadata]);
  const setImports = useCallback((_next: SetStateAction<string>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setExports = useCallback((_next: SetStateAction<string>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setBlocks = useCallback((_next: SetStateAction<Block[]>) => blockUnsafeAction(), [blockUnsafeAction]);

  const removeBlock = useCallback((id: string) => {
    if (!doc) { blockUnsafeAction(id); return; }
    try { commitMutation(planBlockDeletion(doc, id), 'Bloque eliminado localmente.'); }
    catch (error) { setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`); }
  }, [blockUnsafeAction, commitMutation, doc]);

  const addBlock = useCallback((index: number, type: BlockType, content?: string, blockMetadata?: Record<string, unknown>) => {
    if (!doc) { blockUnsafeAction(); return; }
    try { commitMutation(planBlockInsertion(doc, { index, blockType: type, content, metadata: blockMetadata }), 'Bloque insertado localmente.'); }
    catch (error) { setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`); }
  }, [blockUnsafeAction, commitMutation, doc]);

  const moveBlock = useCallback((from: number, to: number) => {
    if (!doc) { blockUnsafeAction(); return; }
    const moving = doc.bodyBlocks[from];
    if (!moving) { setMessage('No existe el bloque que se intenta mover.'); return; }
    const sameParent = doc.bodyBlocks.filter(block => block.parentId === moving.parentId);
    const target = doc.bodyBlocks[to];
    const localTarget = target?.parentId === moving.parentId
      ? sameParent.findIndex(block => block.id === target.id)
      : Math.max(0, sameParent.length - 1);
    try { commitMutation(planBlockMove(doc, moving.id, localTarget), 'Bloque reordenado localmente.'); }
    catch (error) { setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`); }
  }, [blockUnsafeAction, commitMutation, doc]);

  const duplicateBlock = useCallback((id: string) => {
    if (!doc) { blockUnsafeAction(id); return; }
    try { commitMutation(planBlockDuplication(doc, id), 'Bloque duplicado localmente.'); }
    catch (error) { setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`); }
  }, [blockUnsafeAction, commitMutation, doc]);

  const bindDiagram = useCallback((spec: EditorDiagramReference) => {
    if (!doc || spec.mode === 'inline') {
      setMessage(spec.mode === 'inline'
        ? 'Los diagramas inline requieren edición explícita del contenedor en modo código.'
        : blockedMessage);
      return;
    }
    try {
      commitMutation(planDiagramBinding(doc, {
        componentName: spec.componentName,
        importPath: spec.importPath,
        mode: spec.mode,
      }), 'Diagrama vinculado mediante un plan estructural único.');
    } catch (error) {
      setMessage(`Vinculación rechazada: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [commitMutation, doc]);

  const createPage = useCallback(async (input: CreatePageInput): Promise<boolean> => {
    if (editorApiUnavailableInProduction() || !editorWriteAccessGranted()) {
      setMessage('No se puede crear la página: se requiere API configurada y token de edición.');
      return false;
    }
    try {
      const source = createPageSource(input);
      const path = createPagePath(input);
      const candidate = parseEditorDocument(source);
      if (candidate.metadata.status !== 'readable' || !candidate.metadata.schemaValid || candidate.compatibility === 'unsupported') {
        throw new Error('La plantilla inicial no cumple el schema autoritativo o no es MDX estructurable.');
      }
      const sourceHash = await hashSource(source);
      await editorApiClient.createContent({ path, source, sourceHash, localRevision: 0, create: true });
      await loadFileList();
      await openFile(path, { discardLocalChanges: true });
      setEditorMode('visual');
      setMessage('Página creada con estructura y metadatos validados.');
      return true;
    } catch (error) {
      const detail = error && typeof error === 'object' && 'detail' in error
        ? (error as { detail: PersistenceError }).detail
        : null;
      setMessage(detail ? persistenceMessage(detail) : `No se pudo crear la página: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }, [loadFileList, openFile]);

  const saveCurrentFile = useCallback(async (): Promise<boolean> => {
    const state = persistenceRef.current;
    if (!state.file || !state.version) return false;
    if (editorApiUnavailableInProduction()) {
      setMessage('No se puede guardar: la API del editor no está configurada en este despliegue.');
      return false;
    }
    if (!editorWriteAccessGranted()) {
      setMessage('No se puede guardar: introduce el token de edición para persistir cambios.');
      return false;
    }
    const captured = {
      file: state.file,
      source: sourceRef.current,
      localRevision: revisionRef.current,
      baseVersion: state.version
    };
    if (captured.file.path.endsWith('.mdx') && parseEditorDocument(captured.source).compatibility === 'unsupported') {
      dispatch({ type: 'VALIDATION_FAILED', file: captured.file, localRevision: captured.localRevision, reason: 'Invalid MDX source' });
      setMessage('No se puede guardar: el documento MDX contiene errores de sintaxis.');
      return false;
    }
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
    const sourceHash = await hashSource(captured.source);
    if (persistenceRef.current.file?.path !== captured.file.path
      || revisionRef.current !== captured.localRevision
      || sourceRef.current !== captured.source) return false;
    const snapshot: EditorSaveSnapshot = { ...captured, sourceHash };
    const confirmed = await coordinator.applyNow(snapshot);
    return confirmed
      && revisionRef.current === snapshot.localRevision
      && sourceRef.current === snapshot.source
      && persistenceRef.current.file?.path === snapshot.file.path;
  }, [coordinator, compatibility, editorMode, isDiagramSource]);

  const saveDraftCurrentFile = useCallback(async (): Promise<boolean> => {
    const state = persistenceRef.current;
    if (!coordinator || !state.file || !state.version || state.localRevision <= state.confirmedRevision) return false;
    if (editorApiUnavailableInProduction() || !editorWriteAccessGranted()) {
      setMessage('No se puede guardar borrador: se requiere API configurada y token de edición.');
      return false;
    }
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
    removeBlock, addBlock, moveBlock, duplicateBlock, bindDiagram, createPage, setMetadata, setImports, setExports, setBlocks,
    canMutateVisualStructure: capabilities.canEditSafeBlocks,
    canEditVisualMetadata: doc?.metadata.status === 'readable' && doc.metadata.schemaValid,
  };
};
