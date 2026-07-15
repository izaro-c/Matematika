import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Block, BlockType } from '../../core/parser';
import type { DiagramTargetRegistry } from '../../core/editorTypes';
import { buildDocumentOutline } from '../../ux/authoringModel';
import { useModalFocus } from '../hooks/useModalFocus';
import { insertSymbol } from './InlineContentPreview';
import { GENERAL_BLOCK_PRESETS, LATEX_SYMBOLS, PAGE_PROFILE_PRESETS, type BlockPreset } from './visualEditorPresets';
import { VisualEditorBlock } from './VisualEditorBlock';
import { resolvePublicOrExternalAsset } from '@/shared/lib/routeHelper';

interface VisualEditorPanelProps {
  currentFile: string | null;
  metadata: Record<string, unknown>;
  isReadOnly: boolean;
  canEditVisualMetadata: boolean;
  canMutateVisualStructure: boolean;
  blocks: Block[];
  editingBlockId: string | null;
  setEditingBlockId: (id: string | null) => void;
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
}

export const VisualEditorPanel: React.FC<VisualEditorPanelProps> = ({
  currentFile,
  metadata,
  isReadOnly,
  canEditVisualMetadata,
  canMutateVisualStructure,
  blocks,
  editingBlockId,
  setEditingBlockId,
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
}) => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [outlineOpen, setOutlineOpen] = useState(false);
  const commandSearchRef = useRef<HTMLInputElement>(null);
  const closeCommand = () => setCommandOpen(false);
  const commandDialogRef = useModalFocus<HTMLDivElement>(commandOpen, closeCommand, commandSearchRef);
  const showStatement = ['teorema', 'lema', 'corolario', 'definicion', 'axioma'].includes(String(metadata.type));
  const isMathematician = metadata.type === 'matematico';
  const outline = useMemo(() => buildDocumentOutline(blocks), [blocks]);

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

  const applyInlineTransform = (
    block: Block,
    wrap: (selected: string) => string,
    fallback = 'texto'
  ) => {
    const active = document.activeElement as HTMLTextAreaElement | HTMLInputElement | null;
    if (!active || typeof active.selectionStart !== 'number' || typeof active.selectionEnd !== 'number') return;
    const start = active.selectionStart;
    const end = active.selectionEnd;
    const selected = active.value.substring(start, end) || fallback;
    const next = `${block.content.substring(0, start)}${wrap(selected)}${block.content.substring(end)}`;
    updateBlock(block.id, next, block.metadata);
    requestAnimationFrame(() => {
      active.focus();
      const cursor = start + wrap(selected).length;
      active.setSelectionRange(cursor, cursor);
    });
  };

  const openLinkerFromActiveSelection = (block: Block) => {
    const active = document.activeElement as HTMLTextAreaElement | HTMLInputElement | null;
    if (!active || typeof active.selectionStart !== 'number' || typeof active.selectionEnd !== 'number') return;
    const start = active.selectionStart;
    const end = active.selectionEnd;
    const text = active.value.substring(start, end).trim();
    if (!text) return;
    const rect = active.getBoundingClientRect();
    const mockEvent = {
      stopPropagation: () => {},
      currentTarget: active,
      clientX: rect.left,
      clientY: rect.top
    } as unknown as React.MouseEvent;

    handleEditLink(block.id, '', text, {}, 'InteractiveElement', mockEvent);
  };

  const renderInlineToolbar = (block: Block) => (
    <div className="flex flex-wrap items-center gap-1 rounded border border-carbon/10 bg-lienzo px-2 py-1 shadow-sm">
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `**${value}**`, 'énfasis')} className="h-6 min-w-6 rounded px-1.5 text-[10px] font-bold text-carbon hover:bg-carbon/5 cursor-pointer" title="Negrita" aria-label="Aplicar negrita">B</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `*${value}*`, 'énfasis')} className="h-6 min-w-6 rounded px-1.5 text-[10px] italic text-carbon hover:bg-carbon/5 cursor-pointer" title="Cursiva" aria-label="Aplicar cursiva">I</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `$${value}$`, 'x')} className="h-6 rounded px-1.5 font-mono text-[10px] text-ocre hover:bg-ocre/10 cursor-pointer" title="LaTeX inline" aria-label="Aplicar LaTeX en línea">$x$</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => openLinkerFromActiveSelection(block)} className="h-6 rounded px-1.5 text-[10px] font-bold text-salvia hover:bg-salvia/10 cursor-pointer" title="Conectar a concepto o diagrama">Vínculo</button>
    </div>
  );

  const insertPresetAt = (index: number, preset: BlockPreset) => {
    addBlock(index, preset.type, preset.content, preset.metadata);
    setCommandOpen(false);
    setCommandQuery('');
  };
  const insertPresetAtEnd = (preset: BlockPreset) => insertPresetAt(blocks.length, preset);
  const profilePresets = PAGE_PROFILE_PRESETS[String(metadata.type || '')] || [];

  const renderHeader = () => {
    if (!currentFile) return null;
    return (
      <div className="mb-8 pb-6 border-b border-carbon/15 space-y-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-salvia select-none">
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

        {isMathematician && <section className="grid gap-4 rounded border border-salvia/20 bg-salvia/5 p-4 sm:grid-cols-[7rem_1fr]" aria-label="Ficha del matemático">
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
              <div className="text-[9px] uppercase tracking-widest font-bold text-ocre/70">Enunciado Formal</div>
              <div className="flex gap-1 items-center">
                <span className="text-[8px] font-sans text-carbon/40 uppercase mr-1">Insertar:</span>
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
    if (blocks.length === 0) {
      return (
        <div className="max-w-2xl mx-auto py-8">
          {renderHeader()}
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-carbon/25 rounded p-8 text-center bg-carbon/5">
            <p className="text-sm font-serif italic text-carbon/60">El documento está vacío. Añada contenido.</p>
            <button
              type="button"
              disabled={!canMutateVisualStructure}
              onClick={() => addBlock(0, 'paragraph')}
              className="mt-4 px-4 py-1.5 bg-salvia text-lienzo rounded text-xs font-serif font-bold hover:bg-salvia/80 transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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

        {blocks.map((block, index) => (
          <VisualEditorBlock
            key={block.id}
            block={block}
            blocks={blocks}
            index={index}
            isReadOnly={isReadOnly}
            canMutateVisualStructure={canMutateVisualStructure}
            editingBlockId={editingBlockId}
            setEditingBlockId={setEditingBlockId}
            addBlock={addBlock}
            moveBlock={moveBlock}
            duplicateBlock={duplicateBlock}
            removeBlock={removeBlock}
            updateBlock={updateBlock}
            handleTextareaSelect={handleTextareaSelect}
            handleEditLink={handleEditLink}
            renderInlineToolbar={renderInlineToolbar}
            setActiveDiagramIndex={setActiveDiagramIndex}
            setActiveDiagramBlockId={setActiveDiagramBlockId}
            setDiagramBuilderOpen={setDiagramBuilderOpen}
            diagramTargets={diagramTargets}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      <button type="button" onClick={() => setOutlineOpen(value => !value)} aria-expanded={outlineOpen} className="absolute left-3 top-3 z-30 rounded border border-carbon/15 bg-lienzo/95 px-2.5 py-1.5 text-[10px] font-bold text-carbon/60 shadow-sm backdrop-blur">
        Índice {outline.length > 0 ? `(${outline.length})` : ''}
      </button>
      {outlineOpen && <aside className="absolute bottom-3 left-3 top-12 z-30 w-52 overflow-y-auto rounded border border-carbon/15 bg-lienzo/95 p-3 shadow-xl backdrop-blur" aria-label="Outline del documento">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-carbon/50">Outline</h2>
          <button type="button" onClick={() => setOutlineOpen(false)} className="rounded px-1.5 py-0.5 text-[9px] font-bold text-carbon/55" aria-label="Cerrar índice">Cerrar</button>
        </div>
        <nav className="space-y-1" aria-label="Outline del documento">
          {outline.map(item => <button key={item.id} type="button" onClick={() => { document.getElementById(`block-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setOutlineOpen(false); }}
            className="block w-full truncate rounded px-2 py-1.5 text-left text-[10px] text-carbon/65 hover:bg-salvia/10 hover:text-salvia" style={{ paddingLeft: `${Math.max(8, (item.level - 2) * 8)}px` }}>{item.label}</button>)}
        </nav>
      </aside>}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mx-auto mb-4 max-w-3xl space-y-2 pt-8">
        {isReadOnly && (
          <div className="rounded border border-pavo/30 bg-pavo/5 p-3 text-xs text-carbon shadow-sm">
            <span className="font-bold text-pavo">Edición de código con vista previa:</span> El cuerpo no contiene ningún bloque visual que pueda editarse mediante un parche localizado exacto.
          </div>
        )}
      </div>

      {!isReadOnly && canMutateVisualStructure && (
        <div className="sticky top-0 z-20 mx-auto mb-4 max-w-3xl rounded border border-carbon/15 bg-lienzo/95 p-2 shadow-sm backdrop-blur select-none">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => setCommandOpen(true)} className="rounded bg-salvia px-3 py-1.5 text-xs font-bold text-lienzo hover:bg-salvia/85">＋ Insertar bloque</button>
            <button type="button" onClick={() => addBlock(blocks.length, 'paragraph')} className="rounded border border-carbon/15 px-3 py-1.5 text-xs font-bold text-carbon/65 hover:bg-carbon/5">Párrafo</button>
            <button
              type="button"
              onClick={() => {
                setActiveDiagramIndex(blocks.length);
                setActiveDiagramBlockId(null);
                setDiagramBuilderOpen(true);
              }}
              className="rounded bg-pavo/10 px-2 py-1 text-[10px] font-bold text-pavo hover:bg-pavo/20 cursor-pointer"
            >
              Diagrama
            </button>
          </div>
        </div>
      )}

      {renderBlocksList()}
      </div>

      {commandOpen && <div className="absolute inset-0 z-40 flex items-start justify-center bg-carbon/20 p-4 pt-[10vh]" role="presentation">
        <div ref={commandDialogRef} className="w-full max-w-lg rounded border border-carbon/20 bg-lienzo p-3 shadow-xl" role="dialog" aria-modal="true" aria-label="Insertar bloque">
          <div className="flex items-center gap-2">
            <input ref={commandSearchRef} value={commandQuery} onChange={event => setCommandQuery(event.target.value)} placeholder="Buscar bloque: definición, advertencia, ejemplo…" aria-label="Buscar tipo de bloque" className="min-w-0 flex-1 rounded border border-carbon/15 bg-carbon/5 px-3 py-2 text-sm text-carbon outline-none focus:border-salvia" />
            <button type="button" onClick={() => setCommandOpen(false)} className="rounded px-2 py-1 text-xs text-carbon/55">Esc</button>
          </div>
          <div className="mt-3 grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
            {[...profilePresets, ...GENERAL_BLOCK_PRESETS].filter((preset, index, all) => all.findIndex(item => item.label === preset.label && item.type === preset.type) === index)
              .filter(preset => `${preset.label} ${preset.type}`.toLowerCase().includes(commandQuery.toLowerCase()))
              .map(preset => <button key={`${preset.label}-${preset.type}`} type="button" onClick={() => insertPresetAtEnd(preset)} className="rounded border border-carbon/10 bg-carbon/5 p-3 text-left hover:border-salvia/30 hover:bg-salvia/5">
                <span className="block font-serif text-xs font-bold text-carbon">{preset.label}</span><span className="mt-1 block text-[9px] text-carbon/45">{preset.type}</span>
              </button>)}
          </div>
        </div>
      </div>}
    </div>
  );
};
export default VisualEditorPanel;
