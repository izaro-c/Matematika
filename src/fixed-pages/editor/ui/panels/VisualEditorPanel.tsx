import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Block, BlockType } from '@/fixed-pages/editor/session/parser';
import type { DiagramTargetRegistry, EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import { GENERAL_BLOCK_PRESETS, LATEX_SYMBOLS, PAGE_PROFILE_PRESETS, type BlockPreset } from './visualEditorPresets';
import { VisualEditorBlock } from './VisualEditorBlock';
import { MdxFormatBar } from '../toolbar/MdxFormatBar';
import { DemonstrationCanvas, applyStepUpdate } from '../blocks/DemonstrationCanvas';
import { autoCapitularLetter, demoStepIndexInGroup, demosNeedingRenumber, groupVisualBlocks, stepFromDemoBlock } from '../prose/demoGrouping';
import type { ProofStepData } from '@/fixed-pages/editor/session/parser';
import { resolvePublicOrExternalAsset } from '@/lib/routes';
import {
  editableHtmlToMdx,
  getSelectedPlainText,
  insertHtmlAtSelection,
  mdxToEditableHtml,
} from '../prose/inlineProseOps';
import { SelectionLinkBubble } from '../prose/SelectionLinkBubble';
import { buildInteractiveReference } from '@/fixed-pages/editor/types/editorContracts';
import { useMathStore } from '@/lib/page-context/MathStoreContext';

function insertSymbol(textareaId: string, code: string) {
  const el = document.getElementById(textareaId) as HTMLTextAreaElement | null;
  if (!el) return;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? start;
  el.setRangeText(code, start, end, 'end');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.focus();
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
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [assignStepOpen, setAssignStepOpen] = useState(false);
  const stepTargets = useMemo(() => diagramTargets.filter(t => t.kind === 'step'), [diagramTargets]);

  const setVariable = useMathStore(state => state.setVariable);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [activeDemoBlockId, setActiveDemoBlockId] = useState<string | null>(null);
  const [focusedSurfaceId, setFocusedSurfaceId] = useState<string | null>(null);
  const [formatHint, setFormatHint] = useState<string | null>(null);
  const [pendingDeleteStepId, setPendingDeleteStepId] = useState<string | null>(null);
  const pendingDeleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRenumber = useRef(false);

  const commandSearchRef = useRef<HTMLInputElement>(null);

  const closeCommand = () => setCommandOpen(false);
  const commandDialogRef = useModalFocus<HTMLDivElement>(commandOpen, closeCommand, commandSearchRef);
  const showStatement = ['teorema', 'lema', 'corolario', 'definicion', 'axioma'].includes(String(metadata.type));
  const isMathematician = metadata.type === 'matematico';
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
        setCommandOpen(value => !value);
      }
      if (event.key === 'Escape') setCommandOpen(false);
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

  const insertPresetAt = (index: number, preset: BlockPreset) => {
    addBlock(index, preset.type, preset.content, preset.metadata);
    if (preset.type === 'demonstration') requestRenumber();
    setCommandOpen(false);
    setCommandQuery('');
  };
  const insertPresetNearSelection = (preset: BlockPreset) => {
    const anchorId = activeDemoBlock?.id ?? editingBlockId;
    const index = anchorId ? blocks.findIndex(b => b.id === anchorId) : -1;
    insertPresetAt(index >= 0 ? index + 1 : blocks.length, preset);
  };
  const allPresets = useMemo(
    () => [...(PAGE_PROFILE_PRESETS[String(metadata.type || '')] || []), ...GENERAL_BLOCK_PRESETS]
      .filter((preset, index, all) => all.findIndex(item => item.label === preset.label && item.type === preset.type) === index),
    [metadata.type],
  );

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
    insertPresetNearSelection,
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
      insertPresetNearSelection,
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
        blockPresets={allPresets}
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
        onInsertPreset={preset => api().insertPresetNearSelection(preset)}
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
    allPresets,
  ]);

  useEffect(() => () => onFormatBarChange?.(null), [onFormatBarChange]);

  const renderHeader = () => {
    if (!currentFile) return null;
    return (
      <div className="mb-8 pb-6 border-b border-carbon/15 space-y-4">
        <div>
          <span className="ac-label ac-label--sm ac-label--canela select-none">
            {String(metadata.type || 'Concepto')}
          </span>
          <textarea
            value={String(metadata.title || '')}
            disabled={isReadOnly || !canEditVisualMetadata}
            onChange={(e) => handleMetadataChange('title', e.target.value)}
            className="w-full bg-transparent border-none outline-none font-serif font-bold text-3xl text-carbon p-0 mt-1 resize-none focus:ring-0 placeholder-carbon/20"
            placeholder="Título del Concepto"
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <textarea
            value={String(metadata.description || '')}
            disabled={isReadOnly || !canEditVisualMetadata}
            onChange={(e) => handleMetadataChange('description', e.target.value)}
            className="w-full bg-transparent border-none outline-none font-serif italic text-base text-carbon/70 p-0 mt-2 resize-none focus:ring-0 placeholder-carbon/30"
            placeholder="Añada una breve descripción motivacional..."
            rows={2}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>

        {isMathematician && <section className="grid gap-4 rounded border border-canela/20 bg-canela/5 p-4 sm:grid-cols-[7rem_1fr]" aria-label="Ficha del matemático">
          <div className="overflow-hidden rounded border border-carbon/10 bg-lienzo">
            {metadata.image ? <img src={resolvePublicOrExternalAsset(String(metadata.image))} alt="" className="aspect-[4/5] h-full w-full object-cover" /> : <div className="flex aspect-[4/5] items-center justify-center font-serif text-3xl text-carbon/25">∑</div>}
          </div>
          <div className="grid content-start gap-3 sm:grid-cols-2">
            <label className="text-[10px] font-bold text-carbon/55 sm:col-span-2">Nombre completo<input value={String(metadata.name || metadata.title || '')} onChange={event => handleMetadataChange('name', event.target.value)} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-3 py-2 font-serif text-base font-bold text-carbon" /></label>
            <label className="text-[10px] font-bold text-carbon/55">Nacimiento<input type="number" value={Number(metadata.birthYear || 0)} onChange={event => handleMetadataChange('birthYear', Number(event.target.value))} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs text-carbon" /></label>
            <label className="text-[10px] font-bold text-carbon/55">Fallecimiento<input type="number" value={Number(metadata.deathYear || 0)} onChange={event => handleMetadataChange('deathYear', Number(event.target.value))} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs text-carbon" /></label>
            <label className="text-[10px] font-bold text-carbon/55 sm:col-span-2">Lugar o tradición<input value={String(metadata.country || '')} onChange={event => handleMetadataChange('country', event.target.value)} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs text-carbon" /></label>
            <label className="text-[10px] font-bold text-carbon/55 sm:col-span-2">Ruta de la imagen<input value={String(metadata.image || '')} onChange={event => handleMetadataChange('image', event.target.value)} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 font-mono text-[10px] text-carbon" /></label>
          </div>
        </section>}

        {showStatement && (
          <div className="p-4 border-l-4 border-ocre/50 bg-ocre/5 rounded-r space-y-2">
            <div className="flex justify-between items-center select-none">
              <div className="ac-label ac-label--xs ac-label--ocre-soft">Enunciado Formal</div>
              <div className="flex gap-1 items-center">
                <span className="ac-label ac-label--2xs ac-label--faint mr-1">Insertar:</span>
                {LATEX_SYMBOLS.map(sym => (
                  <button
                    key={sym.label}
                    type="button"
                    onClick={() => insertSymbol('statement-editor', sym.code)}
                    className="px-1 bg-carbon/5 hover:bg-carbon/10 text-carbon text-[9px] rounded font-mono transition-colors cursor-pointer"
                  >
                    {sym.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              id="statement-editor"
              disabled={!canEditVisualMetadata}
              value={String(metadata.statement || '')}
              onChange={(e) => handleMetadataChange('statement', e.target.value)}
              className="w-full bg-transparent border-none outline-none font-serif text-sm text-carbon leading-relaxed p-0 resize-none focus:ring-0 placeholder-carbon/30"
              placeholder="Escriba el enunciado formal o definición exacta..."
              rows={2}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderBlocksList = () => {
    if (isLoading) {
      return (
        <div
          className="max-w-2xl mx-auto py-8 space-y-6 font-serif animate-pulse"
          role="status"
          aria-busy="true"
          aria-label="Cargando documento"
        >
          <span className="sr-only">Cargando contenido…</span>
          {/* Header Skeleton */}
          <div className="pb-6 border-b border-carbon/15 space-y-3">
            <div className="h-5 w-20 rounded-full bg-canela/20" />
            <div className="h-8 w-3/4 rounded-lg bg-carbon/15 mt-2" />
            <div className="space-y-1.5 pt-1">
              <div className="h-4 w-full rounded bg-carbon/10" />
              <div className="h-4 w-5/6 rounded bg-carbon/10" />
            </div>
          </div>

          {/* Statement Box Skeleton */}
          <div className="p-4 border-l-4 border-ocre/40 bg-ocre/5 rounded-r space-y-2.5">
            <div className="h-3.5 w-28 rounded bg-ocre/20" />
            <div className="h-4 w-full rounded bg-carbon/10" />
            <div className="h-4 w-4/5 rounded bg-carbon/10" />
          </div>

          {/* Paragraph Skeletons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="h-10 w-8 rounded bg-carbon/15 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full rounded bg-carbon/10" />
                <div className="h-4 w-full rounded bg-carbon/10" />
                <div className="h-4 w-3/4 rounded bg-carbon/10" />
              </div>
            </div>

            <div className="space-y-2 pt-3">
              <div className="h-4 w-full rounded bg-carbon/10" />
              <div className="h-4 w-11/12 rounded bg-carbon/10" />
              <div className="h-4 w-2/3 rounded bg-carbon/10" />
            </div>
          </div>
        </div>
      );
    }

    if (blocks.length === 0) {
      return (
        <div className="max-w-2xl mx-auto py-8">
          {renderHeader()}
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-carbon/25 rounded-2xl p-8 text-center bg-carbon/5">
            <svg className="h-10 w-10 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="mt-3 text-sm font-serif font-bold text-carbon">Esta página no tiene contenido todavía</p>
            <p className="mt-1 text-xs text-carbon/60 max-w-sm">
              Puedes empezar escribiendo un primer párrafo o añadiendo elementos desde la barra superior.
            </p>
            <button
              type="button"
              disabled={!canMutateVisualStructure}
              onClick={() => addBlock(0, 'paragraph')}
              className="mt-4 px-4 py-2 bg-canela text-lienzo rounded-xl text-xs font-serif font-bold hover:bg-canela/90 transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Añadir Párrafo
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-2xl mx-auto py-8 font-serif">
        {renderHeader()}

        {/* Toolbar de asignación de paso multi-bloque */}
        {stepTargets.length > 0 && !isReadOnly && (
          <div className="flex items-center justify-between rounded border border-terracota/25 bg-terracota/5 p-2.5 font-sans text-xs text-carbon">
            <div className="flex items-center gap-2">
              <span className="font-bold text-terracota">✦ Pasos de diagrama</span>
              <button
                type="button"
                onClick={() => {
                  setAssignStepOpen(!assignStepOpen);
                  if (assignStepOpen) setSelectedBlockIds([]);
                }}
                className={`rounded border px-2 py-0.5 font-bold transition-colors cursor-pointer ${
                  assignStepOpen ? 'border-terracota bg-terracota text-lienzo' : 'border-carbon/20 bg-lienzo text-carbon/70 hover:border-terracota/40'
                }`}
              >
                {assignStepOpen ? 'Cancelar selección' : 'Asignar paso a varios bloques'}
              </button>
            </div>

            {assignStepOpen && selectedBlockIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-carbon/60">{selectedBlockIds.length} seleccionado(s)</span>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const stepId = e.target.value || null;
                    onAssignDiagramStep?.(selectedBlockIds, stepId);
                    setSelectedBlockIds([]);
                    setAssignStepOpen(false);
                  }}
                  className="rounded border border-terracota/30 bg-lienzo px-2 py-1 font-mono text-[11px] text-carbon outline-none"
                >
                  <option value="">Seleccionar paso…</option>
                  {stepTargets.map(t => (
                    <option key={t.id} value={t.id}>✦ {t.label || t.id}</option>
                  ))}
                  <option value="">(Quitar asignación)</option>
                </select>
              </div>
            )}
          </div>
        )}


        {visualGroups.map((group, groupIndex) => {
          if (group.kind === 'demonstration') {
            return (
              <DemonstrationCanvas
                key={`demo-group-${group.blocks[0]?.id ?? groupIndex}`}
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
            );
          }

          const block = group.block;
          const index = blocks.findIndex(item => item.id === block.id);
          const isSelected = selectedBlockIds.includes(block.id);
          return (
            <div key={block.id} className="relative">
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
                addBlock={addBlock}
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
            <span className="font-bold text-pavo">Edición de código con vista previa:</span> El cuerpo no contiene ningún bloque visual que pueda editarse mediante un parche localizado exacto.
          </div>
        )}
      </div>

      {renderBlocksList()}
      </div>

      {commandOpen && <div className="absolute inset-0 z-40 flex items-start justify-center bg-carbon/20 p-4 pt-[10vh]" role="presentation">
        <div ref={commandDialogRef} className="w-full max-w-lg rounded border border-carbon/20 bg-lienzo p-3 shadow-xl" role="dialog" aria-modal="true" aria-label="Insertar bloque">
          <div className="flex items-center gap-2">
            <input ref={commandSearchRef} value={commandQuery} onChange={event => setCommandQuery(event.target.value)} placeholder="Buscar bloque: definición, advertencia, ejemplo…" aria-label="Buscar tipo de bloque" className="min-w-0 flex-1 rounded border border-carbon/15 bg-carbon/5 px-3 py-2 text-sm text-carbon outline-none focus:border-canela" />
            <button type="button" onClick={() => setCommandOpen(false)} className="rounded px-2 py-1 text-xs text-carbon/55">Esc</button>
          </div>
          <div className="mt-3 grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
            {[...allPresets]
              .filter(preset => `${preset.label} ${preset.type}`.toLowerCase().includes(commandQuery.toLowerCase()))
              .map(preset => <button key={`${preset.label}-${preset.type}`} type="button" onClick={() => insertPresetNearSelection(preset)} className="rounded border border-carbon/10 bg-carbon/5 p-3 text-left hover:border-canela/30 hover:bg-canela/5">
                <span className="block font-serif text-xs font-bold text-carbon">{preset.label}</span><span className="mt-1 block text-[9px] text-carbon/45">{preset.type}</span>
              </button>)}
          </div>
        </div>
      </div>}
    </div>
  );
};
export default VisualEditorPanel;
