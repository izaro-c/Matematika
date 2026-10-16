import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type SetStateAction } from 'react';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { DirtyState, EditorMode, EditorValidationResult } from './editorTypes';
import type { Block, BlockType } from './parser';
import {
  openEditorDocument, enterVisualMode,
  parseEditorDocument, getVisualCapabilities,
  applyMutationPlan, planBlockUpdate, planBlockInsertion, planBlockDeletion,
  planBlockDuplication, planBlockMove, planMetadataUpdate, planDiagramBinding,
  planAssignDiagramStep,
  type DocumentMutationPlan, type EditorDocument, type ProjectedBlock, type BlockContainer
} from '../document';


import {
  ContentRepository, DraftRepository, SaveCoordinator, editorApiClient, hashSource,
  type EditorSaveSnapshot, type PersistenceError, type SaveCoordinatorEvent
} from '../save';
import { editorApiUnavailableInProduction, editorWriteAccessGranted } from '@/fixed-pages/editor/save/editorApiBase';
import {
  editorPersistenceReducer, initialEditorPersistenceState, persistenceStatusLabel
} from '@/fixed-pages/editor/save';
import { validateEditorDocument } from './validation';
import { saveBlockedByValidation } from './validationMessages';
import {
  buildAuthoringIntegrityReport, cloneMdxForTranslation, createPagePath, createPageSource, type CreatePageInput,
  type CreateDiagramInput, idToComponentName, createDiagramPath,
} from '@/fixed-pages/editor/review/authoringModel';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model/scene/templateModels';
import { generateDiagramSource } from '@/fixed-pages/editor/diagrams/source/generator';
import type { DiagramTargetRegistry, EditorDiagramReference } from './editorTypes';
import { editorMessage, EditorMessageError, type EditorMessage } from '@/fixed-pages/editor/types/editorMessage';

export type VisualSavePolicy = 'disabled' | 'enabled';
export const VISUAL_SAVE_POLICY: VisualSavePolicy = 'enabled';

export type SaveAttemptResult =
  | { ok: true }
  | { ok: false; reason: EditorMessage };

interface OpenFileOptions {
  discardLocalChanges?: boolean;
}

function flushPendingProse(): void {
  const active = typeof document !== 'undefined' ? document.activeElement : null;
  if (active instanceof HTMLElement && active.isContentEditable) active.blur();
}

const contentRepository = new ContentRepository(editorApiClient);
const draftRepository = new DraftRepository(editorApiClient);

function blockText(block: ProjectedBlock): string {
  if (block.kind !== 'editable') return block.source;
  if (block.data && typeof block.data === 'object' && 'text' in block.data) return String((block.data as { text: unknown }).text);
  return block.originalSource;
}

function mapProjectedBlocks(projected: ProjectedBlock[], containers: BlockContainer[]): Block[] {
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
            ? { level: (block.data as { depth?: number }).depth } : {}),
          // Propagate diagramStep from StepSection parent container
          ...(() => {
            const parent = containers.find(c => c.id === block.parentId);
            if (parent?.name === 'StepSection' && parent.attributes?.step) {
              return { diagramStep: parent.attributes.step };
            }
            return {};
          })() }
      : { location: block.location, opaque: block.kind === 'opaque', preserved: block.kind === 'preserved', reason: block.reason, nodeType: block.nodeType }
  }));
}

function sliceRanges(source: string, ranges: Array<{ start: number; end: number }>): string {
  return ranges.map(range => source.slice(range.start, range.end)).join('\n');
}

export function persistenceMessage(error: PersistenceError): EditorMessage {
  if (error.kind === 'content-conflict') return editorMessage('errors.contentConflict');
  if (error.kind === 'draft-conflict') return editorMessage('errors.draftConflict');
  if (error.kind === 'invalid-response' || error.kind === 'protocol-error') return editorMessage('errors.invalidServerResponse');
  if (error.kind === 'aborted') return editorMessage('errors.operationCancelled');
  if (error.kind === 'network-error') return editorMessage('errors.networkError');
  return editorMessage('errors.persistenceError');
}

const blockedMessage = editorMessage('errors.noDocumentOpen');

type FailureCode = 'errors.changeRejected' | 'errors.bindingRejected' | 'errors.assignmentRejected'
  | 'errors.pageCreateFailed' | 'errors.diagramCreateFailed' | 'errors.translationCreateFailed';

/**
 * Mensaje de un fallo capturado: el propio del error si lo trae (`EditorMessageError`),
 * el de persistencia si es un fallo de guardado, o el genérico con el detalle del error.
 */
export function failureMessage(error: unknown, generic: FailureCode): EditorMessage {
  if (error instanceof EditorMessageError) return error.editorMessage;
  const detail = error && typeof error === 'object' && 'detail' in error
    ? (error as { detail: PersistenceError }).detail
    : null;
  if (detail) return persistenceMessage(detail);
  return editorMessage(generic, { detail: error instanceof Error ? error.message : String(error) });
}

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
  const [filesError, setFilesError] = useState<EditorMessage | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');
  const [metadata, setMetadataView] = useState<Record<string, unknown>>({});
  const [imports, setImportsView] = useState('');
  const [exports, setExportsView] = useState('');
  const [blocks, setBlocksView] = useState<Block[]>([]);
  const [doc, setDoc] = useState<EditorDocument | null>(null);
  const docRef = useRef<EditorDocument | null>(null);
  const [message, setMessage] = useState<EditorMessage | null>(null);
  const [baseSource, setBaseSource] = useState('');
  const [persistence, dispatch] = useReducer(editorPersistenceReducer, initialEditorPersistenceState);
  const persistenceRef = useRef(persistence);
  const sourceRef = useRef('');
  const revisionRef = useRef(0);
  const validationRef = useRef<EditorValidationResult>({ issues: [], canSave: true, errorCount: 0, warningCount: 0 });
  const loadControllerRef = useRef<AbortController | undefined>(undefined);
  const saveIdentity = useMemo(() => new LiveSaveIdentity(), []);
  const editorSessionId = useMemo(() => crypto.randomUUID(), []);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => { persistenceRef.current = persistence; }, [persistence]);
  // eslint-disable-next-line react-hooks/refs
  docRef.current = doc;

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
        setMessage(persistenceMessage(event.error));
        if (!saveIdentity.matches(event.snapshot)) return;
        dispatch({ type: 'CONFLICT_DETECTED', file, localRevision,
          expectedVersion: event.error.expectedVersion, actualVersion: event.error.actualVersion });
      } else {
        setMessage(persistenceMessage(event.error));
        if (!saveIdentity.matches(event.snapshot)) return;
        dispatch({ type: event.type === 'draft-failed' ? 'DRAFT_SAVE_FAILED' : 'FILE_SAVE_FAILED', file, localRevision, error: event.error });
      }
  }, [saveIdentity]);

  // StrictMode replays effect cleanups; dispose() permanently kills a memoized coordinator
  // and every applyNow returns obsolete. cancelAll aborts in-flight work without that flag.
  const onCoordinatorEventRef = useRef(onCoordinatorEvent);
  useEffect(() => {
    onCoordinatorEventRef.current = onCoordinatorEvent;
  }, [onCoordinatorEvent]);

  const coordinator = useMemo(
    () => new SaveCoordinator(
      contentRepository,
      draftRepository,
      // eslint-disable-next-line react-hooks/refs
      event => onCoordinatorEventRef.current(event),
    ),
    [],
  );

  useEffect(() => () => coordinator.cancelAll(), [coordinator]);
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
    const byId = new Map([...documentIssues, ...structured.issues, ...integrity].map(issue => [`${issue.id}-${issue.area}-${issue.blockId ?? ''}-${issue.message.slice(0, 20)}`, issue]));
    const issues = [...byId.values()];
    const errorCount = issues.filter(issue => issue.severity === 'error').length;
    const warningCount = issues.filter(issue => issue.severity === 'warning').length;
    return { issues, canSave: errorCount === 0, errorCount, warningCount };
  }, [blocks, currentFile, doc, exports, imports, isDiagramSource, metadata, rawBody]);
  // eslint-disable-next-line react-hooks/refs
  validationRef.current = validation;

  const loadFileList = useCallback(async () => {
    setFilesLoading(true);
    setFilesError(null);
    try { setFiles(await editorApiClient.listContent() as FileNode[]); }
    catch (error) {
      console.error('Error cargando lista de archivos:', error);
      setFilesError(editorMessage('errors.catalogUnavailable'));
    }
    finally { setFilesLoading(false); }
  }, []);

  const syncProjection = useCallback((nextDoc: EditorDocument) => {
    setDoc(nextDoc);
    setMetadataView(nextDoc.metadata.value ?? {});
    setBlocksView(mapProjectedBlocks(nextDoc.bodyBlocks, nextDoc.containers));
    setImportsView(sliceRanges(nextDoc.source, nextDoc.envelope.importRanges));
    setExportsView(sliceRanges(nextDoc.source, nextDoc.envelope.exportRanges));
  }, []);

  const openFile = useCallback(async (filePath: string, options: OpenFileOptions = {}) => {
    const file = { path: filePath };
    const active = persistenceRef.current;
    if (!options.discardLocalChanges && active.file && active.file.path !== filePath && (active.localRevision > active.confirmedRevision || revisionRef.current > active.confirmedRevision)) {
      setMessage(editorMessage('errors.fileSwitchBlocked'));
      return;
    }
    loadControllerRef.current?.abort();
    coordinator?.cancelAll();
    saveIdentity.clear();
    const controller = new AbortController();
    loadControllerRef.current = controller;
    dispatch({ type: 'FILE_LOAD_STARTED', file });
    setMessage(null);
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

  const closeFile = useCallback(() => {
    loadControllerRef.current?.abort();
    coordinator?.cancelAll();
    saveIdentity.clear();
    setDoc(null);
    setBlocksView([]);
    setImportsView('');
    setExportsView('');
    dispatch({ type: 'FILE_CLOSED' });
  }, [coordinator, saveIdentity]);

  const commitSourceChange = useCallback((source: string, nextDoc?: EditorDocument) => {
    const file = persistenceRef.current.file;
    if (!file) return;
    sourceRef.current = source;
    setMessage(null);
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
    });
  }, [saveIdentity, syncProjection]);

  const toggleEditorMode = useCallback(() => {
    if (editorMode === 'visual') { setEditorMode('code'); return; }
    if (!currentFile?.endsWith('.mdx')) return;
    const nextDoc = enterVisualMode(openEditorDocument(sourceRef.current)).document;
    if (nextDoc.compatibility === 'unsupported') { setMessage(editorMessage('errors.visualModeBlocked', { reasons: nextDoc.compatibilityReasons.join(' ') })); return; }
    syncProjection(nextDoc);
    setEditorMode('visual');
  }, [currentFile, editorMode, syncProjection]);

  const updateRawBody = useCallback((source: string) => {
    const nextDoc = currentFile?.endsWith('.mdx') ? parseEditorDocument(source) : undefined;
    commitSourceChange(source, nextDoc);
  }, [commitSourceChange, currentFile]);

  const commitMutation = useCallback((mutation: DocumentMutationPlan, successMessage: EditorMessage) => {
    const current = docRef.current;
    if (!current) { setMessage(blockedMessage); return; }
    try {
      const nextDoc = applyMutationPlan(current, mutation);
      // ponytail: focus/blur roundtrips must not bump revision when source is identical
      if (nextDoc.source === current.source) return;
      docRef.current = nextDoc;
      commitSourceChange(nextDoc.source, nextDoc);
      setMessage(successMessage);
    } catch (error) {
      setMessage(failureMessage(error, 'errors.changeRejected'));
    }
  }, [commitSourceChange]);

  const updateBlock = useCallback((id: string, content: string, blockMetadata?: Record<string, unknown>) => {
    const current = docRef.current;
    if (!current || !capabilities.canEditSafeBlocks) { setMessage(blockedMessage); return; }
    try {
      commitMutation(planBlockUpdate(current, id, { content, metadata: blockMetadata }), editorMessage('notices.localChangeApplied'));
    } catch (error) {
      setMessage(failureMessage(error, 'errors.changeRejected'));
    }
  }, [capabilities.canEditSafeBlocks, commitMutation]);

  const blockUnsafeAction = useCallback((_id?: string) => setMessage(blockedMessage), []);
  const setMetadata = useCallback((nextAction: SetStateAction<Record<string, unknown>>) => {
    const current = docRef.current;
    if (!current || current.metadata.status !== 'readable') { setMessage(editorMessage('errors.metadataNotReadable')); return; }
    const next = typeof nextAction === 'function' ? nextAction(metadata) : nextAction;
    try {
      commitMutation(planMetadataUpdate(current, next), editorMessage('notices.metadataUpdated'));
    } catch (error) {
      setMessage(failureMessage(error, 'errors.changeRejected'));
    }
  }, [commitMutation, metadata]);
  const setImports = useCallback((_next: SetStateAction<string>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setExports = useCallback((_next: SetStateAction<string>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setBlocks = useCallback((_next: SetStateAction<Block[]>) => blockUnsafeAction(), [blockUnsafeAction]);

  const removeBlock = useCallback((id: string) => {
    const current = docRef.current;
    if (!current) { blockUnsafeAction(id); return; }
    try { commitMutation(planBlockDeletion(current, id), editorMessage('notices.blockDeleted')); }
    catch (error) { setMessage(failureMessage(error, 'errors.changeRejected')); }
  }, [blockUnsafeAction, commitMutation]);

  const addBlock = useCallback((index: number, type: BlockType, content?: string, blockMetadata?: Record<string, unknown>) => {
    const current = docRef.current;
    if (!current) { blockUnsafeAction(); return; }
    try { commitMutation(planBlockInsertion(current, { index, blockType: type, content, metadata: blockMetadata }), editorMessage('notices.blockInserted')); }
    catch (error) { setMessage(failureMessage(error, 'errors.changeRejected')); }
  }, [blockUnsafeAction, commitMutation]);

  const moveBlock = useCallback((from: number, to: number) => {
    const current = docRef.current;
    if (!current) { blockUnsafeAction(); return; }
    const moving = current.bodyBlocks[from];
    if (!moving) { setMessage(editorMessage('errors.blockNotFound')); return; }
    const sameParent = current.bodyBlocks.filter(block => block.parentId === moving.parentId);
    const target = current.bodyBlocks[to];
    const localTarget = target?.parentId === moving.parentId
      ? sameParent.findIndex(block => block.id === target.id)
      : Math.max(0, sameParent.length - 1);
    try { commitMutation(planBlockMove(current, moving.id, localTarget), editorMessage('notices.blockMoved')); }
    catch (error) { setMessage(failureMessage(error, 'errors.changeRejected')); }
  }, [blockUnsafeAction, commitMutation]);

  const duplicateBlock = useCallback((id: string) => {
    const current = docRef.current;
    if (!current) { blockUnsafeAction(id); return; }
    try { commitMutation(planBlockDuplication(current, id), editorMessage('notices.blockDuplicated')); }
    catch (error) { setMessage(failureMessage(error, 'errors.changeRejected')); }
  }, [blockUnsafeAction, commitMutation]);

  const bindDiagram = useCallback((spec: EditorDiagramReference) => {
    const current = docRef.current;
    if (!current || spec.mode === 'inline') {
      setMessage(spec.mode === 'inline'
        ? editorMessage('errors.inlineDiagramNeedsCode')
        : blockedMessage);
      return;
    }
    try {
      commitMutation(planDiagramBinding(current, {
        componentName: spec.componentName,
        importPath: spec.importPath,
        mode: spec.mode,
      }), editorMessage('notices.diagramLinked'));
    } catch (error) {
      setMessage(failureMessage(error, 'errors.bindingRejected'));
    }
  }, [commitMutation]);

  const assignDiagramStep = useCallback((blockIds: string[], stepId: string | null) => {
    const current = docRef.current;
    if (!current) { setMessage(blockedMessage); return; }
    try {
      commitMutation(planAssignDiagramStep(current, blockIds, stepId), stepId
        ? (blockIds.length === 1 ? editorMessage('notices.stepAssignedOne', { step: stepId }) : editorMessage('notices.stepAssignedOther', { step: stepId, count: blockIds.length }))
        : editorMessage('notices.stepUnassigned'));
    } catch (error) {
      setMessage(failureMessage(error, 'errors.assignmentRejected'));
    }
  }, [commitMutation]);


  const createPage = useCallback(async (input: CreatePageInput): Promise<boolean> => {
    if (editorApiUnavailableInProduction() || !editorWriteAccessGranted()) {
      setMessage(editorMessage('errors.createPageNeedsApi'));
      return false;
    }
    try {
      const source = createPageSource(input);
      const path = createPagePath(input);
      const candidate = parseEditorDocument(source);
      if (candidate.metadata.status !== 'readable' || !candidate.metadata.schemaValid || candidate.compatibility === 'unsupported') {
        throw new EditorMessageError(editorMessage('errors.pageTemplateInvalid'));
      }
      const sourceHash = await hashSource(source);
      await editorApiClient.createContent({ path, source, sourceHash, localRevision: 0, create: true });
      await loadFileList();
      await openFile(path, { discardLocalChanges: true });
      setEditorMode('visual');
      setMessage(editorMessage('notices.pageCreated'));
      return true;
    } catch (error) {
      setMessage(failureMessage(error, 'errors.pageCreateFailed'));
      return false;
    }
  }, [loadFileList, openFile]);

  const createDiagram = useCallback(async (input: CreateDiagramInput): Promise<{ path: string; componentName: string } | null> => {
    if (editorApiUnavailableInProduction() || !editorWriteAccessGranted()) {
      setMessage(editorMessage('errors.createDiagramNeedsApi'));
      return null;
    }
    try {
      const componentName = idToComponentName(input.id);
      const category = input.category.trim() || 'Teoremas';
      const path = createDiagramPath(input);
      const templateModel = createTemplateModel(input.templateType, input.title, category);
      const generated = generateDiagramSource(templateModel, componentName);
      if (!generated.ok) {
        throw new EditorMessageError(editorMessage('errors.diagramTemplateFailed'));
      }
      const source = generated.source;
      const sourceHash = await hashSource(source);
      await editorApiClient.createContent({ path, source, sourceHash, localRevision: 0, create: true });
      await loadFileList();
      setMessage(editorMessage('notices.diagramCreated'));
      return { path, componentName };
    } catch (error) {
      setMessage(failureMessage(error, 'errors.diagramCreateFailed'));
      return null;
    }
  }, [loadFileList]);

  const saveCurrentFile = useCallback(async (): Promise<SaveAttemptResult> => {
    const fail = (reason: EditorMessage): SaveAttemptResult => {
      setMessage(reason);
      return { ok: false, reason };
    };

    flushPendingProse();

    const state = persistenceRef.current;
    if (!state.file || !state.version) return fail(editorMessage('errors.noConfirmedVersion'));
    if (editorApiUnavailableInProduction()) {
      return fail(editorMessage('errors.saveNeedsApi'));
    }
    if (!editorWriteAccessGranted()) {
      return fail(editorMessage('errors.saveNeedsToken'));
    }
    if (revisionRef.current <= state.confirmedRevision && state.localRevision <= state.confirmedRevision) {
      return fail(editorMessage('errors.noLocalChanges'));
    }
    if (!validationRef.current.canSave) {
      return fail(
        saveBlockedByValidation(validationRef.current.errorCount),
      );
    }
    if (editorMode === 'visual' && !isDiagramSource) {
      if ((VISUAL_SAVE_POLICY as VisualSavePolicy) === 'disabled') {
        return fail(editorMessage('errors.visualSaveDisabled'));
      }
      if (compatibility === 'read-only') {
        return fail(editorMessage('errors.visualSaveReadOnly'));
      }
      if (compatibility === 'unsupported') {
        return fail(editorMessage('errors.visualSaveUnsupported'));
      }
    }
    const captured = {
      file: state.file,
      source: sourceRef.current,
      localRevision: revisionRef.current,
      baseVersion: state.version
    };
    if (captured.file.path.endsWith('.mdx') && parseEditorDocument(captured.source).compatibility === 'unsupported') {
      dispatch({ type: 'VALIDATION_FAILED', file: captured.file, localRevision: captured.localRevision, reason: editorMessage('errors.invalidSourceReason') });
      return fail(editorMessage('errors.sourceUnparseable'));
    }
    if (captured.file.path.endsWith('.mdx')) {
      const candidateDoc = parseEditorDocument(captured.source);
      if (candidateDoc.metadata.status !== 'readable' || !candidateDoc.metadata.schemaValid) {
        dispatch({ type: 'VALIDATION_FAILED', file: captured.file, localRevision: captured.localRevision, reason: editorMessage('errors.invalidMetadataReason') });
        return fail(editorMessage('errors.metadataSchemaInvalid'));
      }
    }
    const sourceHash = await hashSource(captured.source);
    if (persistenceRef.current.file?.path !== captured.file.path
      || revisionRef.current !== captured.localRevision
      || sourceRef.current !== captured.source) {
      return fail(editorMessage('errors.documentChangedWhileSaving'));
    }
    const snapshot: EditorSaveSnapshot = { ...captured, sourceHash };
    const applied = await coordinator.applyNow(snapshot);
    if (applied.ok) return { ok: true };
    if (applied.error) return fail(persistenceMessage(applied.error));
    return fail(editorMessage('errors.saveCancelledOrStale'));
  }, [coordinator, editorMode, isDiagramSource, compatibility]);

  const saveDraftCurrentFile = useCallback(async (): Promise<boolean> => {
    const state = persistenceRef.current;
    if (!coordinator || !state.file || !state.version || state.localRevision <= state.confirmedRevision) return false;
    if (editorApiUnavailableInProduction() || !editorWriteAccessGranted()) {
      setMessage(editorMessage('errors.draftNeedsApi'));
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

  const createTranslation = useCallback(async (targetLang: string, targetTitle?: string): Promise<boolean> => {
    if (editorApiUnavailableInProduction() || !editorWriteAccessGranted()) {
      setMessage(editorMessage('errors.translationNeedsApi'));
      return false;
    }
    if (!currentFile || !currentFile.endsWith('.mdx')) {
      setMessage(editorMessage('errors.translationOnlyMdx'));
      return false;
    }
    try {
      const source = sourceRef.current;
      const meta = (doc?.metadata.value ?? {}) as Record<string, unknown>;
      const targetSource = cloneMdxForTranslation(source, targetLang, targetTitle);
      const parsedId = typeof meta.id === 'string' && meta.id ? meta.id : (currentFile.split('/').pop()?.replace(/\.mdx$/, '') || 'documento');
      const parsedType = typeof meta.type === 'string' && meta.type ? meta.type : 'definicion';
      const path = createPagePath({
        id: parsedId,
        type: parsedType,
        title: targetTitle || (typeof meta.title === 'string' ? meta.title : parsedId),
        description: typeof meta.description === 'string' ? meta.description : '',
        lang: targetLang,
      });
      const candidate = parseEditorDocument(targetSource);
      if (candidate.metadata.status !== 'readable' || !candidate.metadata.schemaValid || candidate.compatibility === 'unsupported') {
        throw new EditorMessageError(editorMessage('errors.translationTemplateInvalid'));
      }
      const sourceHash = await hashSource(targetSource);
      await editorApiClient.createContent({ path, source: targetSource, sourceHash, localRevision: 0, create: true });
      await loadFileList();
      await openFile(path, { discardLocalChanges: true });
      setEditorMode('visual');
      setMessage(editorMessage('notices.translationCreated', { lang: targetLang.toUpperCase() }));
      return true;
    } catch (error) {
      setMessage(failureMessage(error, 'errors.translationCreateFailed'));
      return false;
    }
  }, [currentFile, doc, loadFileList, openFile]);

  return {
    files, filesLoading, filesError, loading, currentFile, editorMode, metadata, imports, exports, blocks, rawBody,
    baseSource, localRevision: persistence.localRevision, confirmedRevision: persistence.confirmedRevision,
    baseVersion: persistence.version,
    saving, dirtyState, validation, message, persistenceStatus: persistence.status,
    persistenceLabel: persistenceStatusLabel(persistence.status),
    loadFileList, openFile, closeFile, toggleEditorMode, setEditorMode, updateRawBody, updateBlock, saveCurrentFile, saveDraftCurrentFile,
    compatibility, compatibilityReasons, capabilities,
    removeBlock, addBlock, moveBlock, duplicateBlock, bindDiagram, assignDiagramStep, createPage, createDiagram, createTranslation, setMetadata, setImports, setExports, setBlocks,
    canMutateVisualStructure: capabilities.canEditSafeBlocks,
    canEditVisualMetadata: doc?.metadata.status === 'readable' && doc.metadata.schemaValid,
  };
};

