import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { Block, BlockType } from '@/fixed-pages/editor/session/parser';
import type { DiagramTargetRegistry, EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';
import { blockCatalog, type BlockCatalogEntry } from './blockCatalog';
import { BlockDragHandle, BlockInsertGap } from './VisualBlockControls';
import type { RelocationPlacement } from '@/fixed-pages/editor/document';
import { VisualEditorBlock } from './VisualEditorBlock';
import { VisualEditorHeader } from './VisualEditorHeader';
import { VisualEditorEmpty, VisualEditorSkeleton } from './VisualEditorStates';
import { StepAssignmentBar } from './StepAssignmentBar';
import { BlockCommandPalette } from './BlockCommandPalette';
import { MdxFormatBar } from '../toolbar/MdxFormatBar';
import { DemonstrationCanvas, applyStepUpdate } from '../blocks/DemonstrationCanvas';
import { autoCapitularLetter, demoStepIndexInGroup, demosNeedingRenumber, groupVisualBlocks, stepFromDemoBlock } from '../prose/demoGrouping';
import type { ProofStepData } from '@/fixed-pages/editor/session/parser';
import {
  editableHtmlToMdx,
  getSelectedPlainText,
  insertHtmlAtSelection,
  mdxToEditableHtml,
} from '../prose/inlineProseOps';
import { SelectionLinkBubble } from '../prose/SelectionLinkBubble';
import { buildInteractiveReference } from '@/fixed-pages/editor/types/editorContracts';
import { useMathStore } from '@/lib/page-context/MathStoreContext';

/** The caret in the prose being edited, kept so an inline entry can go back to it. */
function proseCaret(): Range | null {
  const selection = window.getSelection();
  const anchor = selection?.anchorNode;
  const inProse = (anchor instanceof Element ? anchor : anchor?.parentElement)?.closest('[contenteditable="true"]');
  return inProse && selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
}

interface VisualEditorPanelProps {
  currentFile: string | null;
  isLoading?: boolean;
  metadata: Record<string, unknown>;
  isReadOnly: boolean;
  canEditVisualMetadata: boolean;
  canMutateVisualStructure: boolean;
  blocks: Block[];
  editingBlockId: string | null;
  setEditingBlockId: (id: string | null) => void;
  highlightedBlockId?: string | null;
  issues?: EditorValidationIssue[];
  handleMetadataChange: (key: string, value: unknown) => void;
  addBlock: (index: number, type: BlockType, content?: string, metadata?: Record<string, unknown>) => void;
  moveBlock: (from: number, to: number) => void;
  relocateBlock?: (blockId: string, anchorId: string, placement: RelocationPlacement) => void;
  relocateSection?: (headingId: string, anchorId: string, placement: RelocationPlacement) => void;
  stepSection?: (headingId: string, direction: -1 | 1) => void;
  /** Ids of the blocks that move with a heading. */
  sectionBlocks?: (headingId: string) => string[];
  duplicateBlock: (id: string) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, content: string, metadata?: Record<string, unknown>) => void;
  handleTextareaSelect: (e: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => void;
  handleEditLink: (blockId: string, rawMarkup: string, text: string, attrs: Record<string, unknown>, tag: string, e: React.MouseEvent) => void;
  setActiveDiagramIndex: (index: number | null) => void;
  setActiveDiagramBlockId: (id: string | null) => void;
  setDiagramBuilderOpen: (open: boolean) => void;
  diagramTargets: DiagramTargetRegistry;
  onAssignDiagramStep?: (blockIds: string[], stepId: string | null) => void;
  onSyncDiagramStep?: (step: ProofStepData, index: number) => void;
  onFormatBarChange?: (formatBar: React.ReactNode) => void;
}


export const VisualEditorPanel: React.FC<VisualEditorPanelProps> = ({
  currentFile,
  isLoading = false,
  metadata,
  isReadOnly,
  canEditVisualMetadata,
  canMutateVisualStructure,
  blocks,
  editingBlockId,
  setEditingBlockId,
  highlightedBlockId,
  issues = [],
  handleMetadataChange,
  addBlock,
  moveBlock,
  relocateBlock,
  relocateSection,
  stepSection,
  sectionBlocks,
  duplicateBlock,
  removeBlock,
  updateBlock,
  handleTextareaSelect,
  handleEditLink,
  setActiveDiagramIndex,
  setActiveDiagramBlockId,
  setDiagramBuilderOpen,
  diagramTargets,
  onAssignDiagramStep,
  onSyncDiagramStep,
  onFormatBarChange,
}) => {
  const { t } = useI18n();
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [assignStepOpen, setAssignStepOpen] = useState(false);
  const stepTargets = useMemo(() => diagramTargets.filter(target => target.kind === 'step'), [diagramTargets]);

  const setVariable = useMathStore(state => state.setVariable);
  /** Open palette: where it inserts (null = next to the selection) and the caret it had in the prose. */
  const [palette, setPalette] = useState<{ index: number | null; range: Range | null } | null>(null);
  const [drag, setDrag] = useState<{ blockId: string; section: boolean; movingIds: string[] } | null>(null);
  const [drop, setDrop] = useState<{ anchorId: string; placement: RelocationPlacement } | null>(null);
  const [activeDemoBlockId, setActiveDemoBlockId] = useState<string | null>(null);
  const [focusedSurfaceId, setFocusedSurfaceId] = useState<string | null>(null);
  const [formatHint, setFormatHint] = useState<string | null>(null);
  const [pendingDeleteStepId, setPendingDeleteStepId] = useState<string | null>(null);
  const pendingDeleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRenumber = useRef(false);

  const openPalette = (index: number | null) => setPalette({ index, range: proseCaret() });
  const closePalette = () => setPalette(null);
  const visualGroups = useMemo(() => groupVisualBlocks(blocks), [blocks]);
  const firstParagraphId = useMemo(() => blocks.find(block => block.type === 'paragraph')?.id ?? null, [blocks]);
  const demoBlocks = useMemo(() => blocks.filter(b => b.type === 'demonstration'), [blocks]);
  const activeDemoBlock = activeDemoBlockId
    ? blocks.find(b => b.id === activeDemoBlockId)
    : null;
  const requestRenumber = () => {
    pendingRenumber.current = true;
  };

  useEffect(() => {
    if (!pendingRenumber.current || isReadOnly) return;
    pendingRenumber.current = false;
    demosNeedingRenumber(blocks).forEach(item => applyStepUpdate(updateBlock, item.blockId, item.step));
  }, [blocks, isReadOnly, updateBlock]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        const range = proseCaret();
        setPalette(current => (current ? null : { index: null, range }));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!formatHint) return;
    const timer = window.setTimeout(() => setFormatHint(null), 3200);
    return () => window.clearTimeout(timer);
  }, [formatHint]);

  const updateParagraphWithCapitular = (id: string, content: string, metadata?: Record<string, unknown>) => {
    if (id === firstParagraphId) {
      const letter = autoCapitularLetter(content);
      updateBlock(id, content, { ...metadata, capitular: letter });
      return;
    }
    updateBlock(id, content, metadata);
  };

  const persistFocusedProse = () => {
    const active = document.activeElement as HTMLElement | null;
    if (!active?.isContentEditable || !active.id) return;
    const mdx = editableHtmlToMdx(active);
    if (active.id.endsWith('-title')) {
      const blockId = active.id.replace(/-title$/, '');
      const block = blocks.find(b => b.id === blockId);
      if (!block || block.type !== 'demonstration') return;
      const step = { ...stepFromDemoBlock(block), title: mdx };
      applyStepUpdate(updateBlock, blockId, step);
      return;
    }
    if (active.id.endsWith('-body')) {
      const blockId = active.id.replace(/-body$/, '');
      const block = blocks.find(b => b.id === blockId);
      if (!block || block.type !== 'demonstration') return;
      const step = { ...stepFromDemoBlock(block), body: mdx };
      applyStepUpdate(updateBlock, blockId, step);
      return;
    }
    if (active.id.startsWith('prose-')) {
      const blockId = active.id.slice('prose-'.length);
      const block = blocks.find(b => b.id === blockId);
      if (!block) return;
      if (block.type === 'paragraph') updateParagraphWithCapitular(blockId, mdx, block.metadata);
      else updateBlock(blockId, mdx, block.metadata);
    }
  };

  const renderInlineToolbar = (_block: Block) => null;

  const indexNearSelection = () => {
    const anchorId = activeDemoBlock?.id ?? editingBlockId;
    const index = anchorId ? blocks.findIndex(b => b.id === anchorId) : -1;
    return index >= 0 ? index + 1 : blocks.length;
  };
  const insertEntry = (entry: BlockCatalogEntry) => {
    const target = palette;
    setPalette(null);
    const index = target?.index ?? indexNearSelection();
    const { action } = entry;
    if (action.kind === 'diagram') {
      setActiveDiagramIndex(index);
      setActiveDiagramBlockId(null);
      setDiagramBuilderOpen(true);
      return;
    }
    if (action.kind === 'inline') {
      const range = target?.range;
      if (!range) {
        addBlock(index, 'paragraph', action.markup(''));
        return;
      }
      // Tras cerrar la paleta, el foco vuelve a la prosa: se restaura el cursor y se inserta ahí.
      window.requestAnimationFrame(() => {
        const editable = (range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement)?.closest<HTMLElement>('[contenteditable="true"]');
        editable?.focus();
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        if (insertHtmlAtSelection(mdxToEditableHtml(action.markup(range.toString().trim())))) persistFocusedProse();
      });
      return;
    }
    addBlock(index, action.type, action.content, action.metadata);
    if (action.type === 'demonstration') requestRenumber();
  };
  const catalog = useMemo(() => blockCatalog(String(metadata.type || '')), [metadata.type]);

  const canDrag = !isReadOnly && canMutateVisualStructure && Boolean(relocateBlock);
  const startDrag = (block: Block, event: React.DragEvent<HTMLElement>) => {
    const section = block.type === 'heading' && Boolean(relocateSection);
    const movingIds = section && sectionBlocks ? sectionBlocks(block.id) : [block.id];
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', block.id);
    const element = document.getElementById(`block-${block.id}`);
    if (element) event.dataTransfer.setDragImage(element, 16, 16);
    setDrag({ blockId: block.id, section, movingIds });
  };
  const endDrag = () => { setDrag(null); setDrop(null); };
  /** Drop targets: a block slot; the pointer half decides before or after. */
  const dropProps = (anchorBefore: string, anchorAfter: string) => ({
    onDragOver: (event: React.DragEvent<HTMLElement>) => {
      if (!drag || drag.movingIds.includes(anchorBefore) || drag.movingIds.includes(anchorAfter)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      const box = event.currentTarget.getBoundingClientRect();
      const next = event.clientY < box.top + box.height / 2
        ? { anchorId: anchorBefore, placement: 'before' as const }
        : { anchorId: anchorAfter, placement: 'after' as const };
      if (drop?.anchorId !== next.anchorId || drop.placement !== next.placement) setDrop(next);
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      const target = drop;
      const moving = drag;
      endDrag();
      if (!target || !moving) return;
      const ids = blocks.map(b => b.id);
      const first = ids.indexOf(moving.movingIds[0]);
      const last = ids.indexOf(moving.movingIds[moving.movingIds.length - 1]);
      const anchor = ids.indexOf(target.anchorId);
      // Soltar justo al lado de lo que se arrastra no lo mueve.
      if ((target.placement === 'after' && anchor === first - 1) || (target.placement === 'before' && anchor === last + 1)) return;
      if (moving.section) relocateSection?.(moving.blockId, target.anchorId, target.placement);
      else relocateBlock?.(moving.blockId, target.anchorId, target.placement);
    },
  });
  const dropLine = (anchorBefore: string, anchorAfter: string) => {
    if (!drop) return null;
    if (drop.anchorId === anchorBefore && drop.placement === 'before') return <div className="ed-drop-line ed-drop-line--before" aria-hidden="true" />;
    if (drop.anchorId === anchorAfter && drop.placement === 'after') return <div className="ed-drop-line ed-drop-line--after" aria-hidden="true" />;
    return null;
  };
  const insertGap = (index: number) => (!isReadOnly && canMutateVisualStructure
    ? <BlockInsertGap label={index === 0 ? t('editor.palette.insertAtStart') : t('editor.palette.insertHere')} onOpen={() => openPalette(index)} />
    : null);

  const openLinkerForSelection = () => {
    const selected = getSelectedPlainText().trim();
    if (!selected) {
      setFormatHint('Selecciona el texto que quieres enlazar.');
      return;
    }
    const blockId = activeDemoBlock?.id ?? editingBlockId ?? blocks[0]?.id;
    if (!blockId) return;
    handleEditLink(blockId, '', selected, {}, 'ConceptLink', {} as React.MouseEvent);
  };

  const highlightSelection = () => {
    const selected = getSelectedPlainText().trim() || 'elemento';
    if (insertHtmlAtSelection(mdxToEditableHtml(buildInteractiveReference('elemento', 'canela', selected)))) {
      persistFocusedProse();
      return;
    }
    setFormatHint('Haz clic en el texto y selecciona el rótulo a resaltar.');
  };

  const activateDemoStep = (blockId: string, step: ProofStepData, index: number) => {
    setActiveDemoBlockId(blockId);
    setEditingBlockId(blockId);
    onSyncDiagramStep?.(step, index);
    const targets = Array.isArray(step.target)
      ? step.target
      : (typeof step.target === 'string' && step.target.trim() ? [step.target] : []);
    if (targets[0]) setVariable('highlight', targets[0]);
    const proofTarget = targets[0] || `step-${step.number}`;
    setVariable('step', proofTarget);
  };

  const handleUpdateStep = (blockId: string, step: ProofStepData) => {
    applyStepUpdate(updateBlock, blockId, step);
    const index = demoStepIndexInGroup(blocks, blockId);
    if (index >= 0 && activeDemoBlockId === blockId) {
      onSyncDiagramStep?.(step, index);
      const targets = Array.isArray(step.target)
        ? step.target
        : (typeof step.target === 'string' && step.target.trim() ? [step.target] : []);
      if (targets[0]) setVariable('highlight', targets[0]);
    }
  };

  const handleInsertStepAfter = (blockId: string) => {
    const index = blocks.findIndex(b => b.id === blockId);
    const insertAt = index < 0 ? blocks.length : index + 1;
    const nextNumber = demoBlocks.findIndex(b => b.id === blockId) + 2;
    addBlock(insertAt, 'demonstration', 'Por hipótesis, se afirma el paso.', {
      number: nextNumber > 0 ? nextNumber : demoBlocks.length + 1,
      title: `Paso ${nextNumber > 0 ? nextNumber : demoBlocks.length + 1}`,
    });
    requestRenumber();
  };

  const handleInsertStepFromToolbar = () => {
    if (activeDemoBlock) {
      handleInsertStepAfter(activeDemoBlock.id);
      return;
    }
    const lastDemo = demoBlocks[demoBlocks.length - 1];
    if (lastDemo) {
      handleInsertStepAfter(lastDemo.id);
      return;
    }
    addBlock(blocks.length, 'demonstration', 'Por hipótesis, se fija el punto de partida.', {
      number: 1,
      title: 'Paso 1',
    });
    requestRenumber();
  };

  const handleMoveStepByBlockId = (blockId: string, direction: -1 | 1) => {
    const demoIndex = demoBlocks.findIndex(block => block.id === blockId);
    if (demoIndex < 0) return;
    const swap = demoBlocks[demoIndex + direction];
    if (!swap) {
      setFormatHint(direction < 0 ? 'Este paso ya es el primero.' : 'Este paso ya es el último.');
      return;
    }
    const from = blocks.findIndex(block => block.id === blockId);
    const to = blocks.findIndex(block => block.id === swap.id);
    if (from < 0 || to < 0) return;
    try {
      moveBlock(from, to);
      requestRenumber();
    } catch {
      setFormatHint('No se pudo reposicionar el paso.');
    }
  };

  const handleDuplicateStepByBlockId = (blockId: string) => {
    duplicateBlock(blockId);
    requestRenumber();
  };

  const handleDeleteStepByBlockId = (blockId: string) => {
    removeBlock(blockId);
    requestRenumber();
  };

  const handleMoveActiveStep = (direction: -1 | 1) => {
    if (!activeDemoBlock) return;
    handleMoveStepByBlockId(activeDemoBlock.id, direction);
  };

  // Handlers change every render; keep them out of the publish effect deps.
  const formatBarApiRef = useRef({
    openLinkerForSelection,
    handleInsertStepFromToolbar,
    handleMoveActiveStep,
    openPalette,
    persistFocusedProse,
    duplicateBlock,
    removeBlock,
    requestRenumber,
    activeDemoBlockId,
  });
  useEffect(() => {
    formatBarApiRef.current = {
      openLinkerForSelection,
      handleInsertStepFromToolbar,
      handleMoveActiveStep,
      openPalette,
      persistFocusedProse,
      duplicateBlock,
      removeBlock,
      requestRenumber,
      activeDemoBlockId,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!onFormatBarChange) return;
    if (isReadOnly) {
      onFormatBarChange(null);
      return;
    }
    const api = () => formatBarApiRef.current;
    onFormatBarChange(
      <MdxFormatBar
        isReadOnly={isReadOnly}
        canMutateStructure={canMutateVisualStructure}
        hasActiveProse={Boolean(focusedSurfaceId) || Boolean(editingBlockId)}
        hasActiveDemoStep={Boolean(activeDemoBlockId)}
        onOpenLinker={() => api().openLinkerForSelection()}
        onInsertStep={() => api().handleInsertStepFromToolbar()}
        onMoveStep={dir => api().handleMoveActiveStep(dir)}
        onDuplicateStep={() => {
          const id = api().activeDemoBlockId;
          if (!id) return;
          api().duplicateBlock(id);
          api().requestRenumber();
        }}
        onDeleteStep={() => {
          const id = api().activeDemoBlockId;
          if (!id) return;
          if (pendingDeleteStepId === id) {
            // Segunda acción: confirmar eliminación
            if (pendingDeleteTimer.current) clearTimeout(pendingDeleteTimer.current);
            setPendingDeleteStepId(null);
            api().removeBlock(id);
            setActiveDemoBlockId(null);
            api().requestRenumber();
          } else {
            // Primera acción: marcar como pendiente durante 3 s
            if (pendingDeleteTimer.current) clearTimeout(pendingDeleteTimer.current);
            setPendingDeleteStepId(id);
            pendingDeleteTimer.current = setTimeout(() => setPendingDeleteStepId(null), 3000);
          }
        }}
        onOpenPalette={() => api().openPalette(null)}
        onNotify={setFormatHint}
        onProseMutated={() => api().persistFocusedProse()}
      />
    );
  }, [
    onFormatBarChange,
    isReadOnly,
    canMutateVisualStructure,
    focusedSurfaceId,
    editingBlockId,
    activeDemoBlockId,
  ]);

  useEffect(() => () => onFormatBarChange?.(null), [onFormatBarChange]);

  const header = currentFile ? (
    <VisualEditorHeader
      metadata={metadata}
      isReadOnly={isReadOnly}
      canEditVisualMetadata={canEditVisualMetadata}
      handleMetadataChange={handleMetadataChange}
    />
  ) : null;

  const renderBlocksList = () => {
    if (isLoading) return <VisualEditorSkeleton />;

    if (blocks.length === 0) {
      return (
        <VisualEditorEmpty canMutateVisualStructure={canMutateVisualStructure} onAddParagraph={() => addBlock(0, 'paragraph')}>
          {header}
        </VisualEditorEmpty>
      );
    }

    return (
      <div className="space-y-6 max-w-2xl mx-auto py-8 font-serif">
        {header}

        {stepTargets.length > 0 && !isReadOnly && (
          <StepAssignmentBar
            stepTargets={stepTargets}
            open={assignStepOpen}
            onOpenChange={setAssignStepOpen}
            selectedBlockIds={selectedBlockIds}
            onClearSelection={() => setSelectedBlockIds([])}
            onAssign={stepId => onAssignDiagramStep?.(selectedBlockIds, stepId)}
          />
        )}

        {insertGap(0)}

        {visualGroups.map((group, groupIndex) => {
          if (group.kind === 'demonstration') {
            const firstId = group.blocks[0]?.id ?? '';
            const lastId = group.blocks[group.blocks.length - 1]?.id ?? '';
            const lastIndex = blocks.findIndex(item => item.id === lastId);
            return (
              <React.Fragment key={`demo-group-${firstId || groupIndex}`}>
              <div className="ed-block-slot" {...(drag ? dropProps(firstId, lastId) : {})}>
              {dropLine(firstId, lastId)}
              <DemonstrationCanvas
                blocks={group.blocks}
                activeBlockId={activeDemoBlockId}
                isReadOnly={isReadOnly}
                diagramTargets={diagramTargets}
                onActivate={activateDemoStep}
                onUpdateStep={handleUpdateStep}
                onInsertAfter={handleInsertStepAfter}
                onMoveStep={handleMoveStepByBlockId}
                onDuplicateStep={handleDuplicateStepByBlockId}
                onDeleteStep={handleDeleteStepByBlockId}
                onFocusSurface={setFocusedSurfaceId}
                onEditChip={(blockId, raw, text, attrs, tag, event) => handleEditLink(blockId, raw, text, attrs, tag, event)}
              />
              </div>
              {insertGap(lastIndex + 1)}
              </React.Fragment>
            );
          }

          const block = group.block;
          const index = blocks.findIndex(item => item.id === block.id);
          const isSelected = selectedBlockIds.includes(block.id);
          const isMoving = drag?.movingIds.includes(block.id) ?? false;
          const isSourceOnly = block.metadata?.preserved === true || block.metadata?.opaque === true;
          return (
            <React.Fragment key={block.id}>
            <div className={`ed-block-slot${isMoving ? ' ed-dragging' : ''}`} {...(drag ? dropProps(block.id, block.id) : {})}>
              {dropLine(block.id, block.id)}
              {canDrag && !assignStepOpen && !isSourceOnly && (
                <BlockDragHandle
                  section={block.type === 'heading' && Boolean(relocateSection)}
                  label={block.type === 'heading' && relocateSection ? t('editor.visual.dragSection') : t('editor.visual.dragBlock')}
                  onDragStart={event => startDrag(block, event)}
                  onDragEnd={endDrag}
                />
              )}
              {assignStepOpen && (
                <div className="absolute -left-7 top-4 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedBlockIds([...selectedBlockIds, block.id]);
                      else setSelectedBlockIds(selectedBlockIds.filter(id => id !== block.id));
                    }}
                    className="h-4 w-4 rounded border-terracota text-terracota focus:ring-terracota cursor-pointer"
                  />
                </div>
              )}
              <VisualEditorBlock
                block={block}
                blocks={blocks}
                index={index}
                isReadOnly={isReadOnly}
                canMutateVisualStructure={canMutateVisualStructure}
                editingBlockId={editingBlockId}
                setEditingBlockId={setEditingBlockId}
                highlightedBlockId={highlightedBlockId}
                issues={issues}
                onOpenPalette={() => openPalette(index + 1)}
                onStepSection={stepSection ? direction => stepSection(block.id, direction) : undefined}
                moveBlock={moveBlock}
                duplicateBlock={duplicateBlock}
                removeBlock={removeBlock}
                updateBlock={block.type === 'paragraph' ? updateParagraphWithCapitular : updateBlock}
                handleTextareaSelect={handleTextareaSelect}
                handleEditLink={handleEditLink}
                renderInlineToolbar={renderInlineToolbar}
                setActiveDiagramIndex={setActiveDiagramIndex}
                setActiveDiagramBlockId={setActiveDiagramBlockId}
                setDiagramBuilderOpen={setDiagramBuilderOpen}
                diagramTargets={diagramTargets}
              />
            </div>
            {insertGap(index + 1)}
            </React.Fragment>
          );

        })}
      </div>
    );
  };

  return (
    <div data-panel="visual-editor" className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {formatHint && (
        <div className="border-b border-ocre/20 bg-ocre/10 px-3 py-1.5 text-[11px] text-carbon" role="status">
          {formatHint}
        </div>
      )}

      <SelectionLinkBubble
        disabled={isReadOnly}
        onLinkSelection={openLinkerForSelection}
        onHighlightSelection={highlightSelection}
        onProseMutated={persistFocusedProse}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mx-auto mb-4 max-w-3xl space-y-2 pt-2">
        {isReadOnly && (
          <div className="rounded border border-pavo/30 bg-pavo/5 p-3 text-xs text-carbon shadow-sm">
            <span className="font-bold text-pavo">{t('editor.visual.codeEditing')}</span> <span>{t('editor.visual.noVisualBlocks')}</span>
          </div>
        )}
      </div>

      {renderBlocksList()}
      </div>

      <BlockCommandPalette
        open={palette !== null}
        entries={catalog}
        onClose={closePalette}
        onInsert={insertEntry}
      />
    </div>
  );
};
export default VisualEditorPanel;
