import React from 'react';
import { KatexText } from '@/shared/ui/KatexText';
import { FormulaBlock } from '../blocks/FormulaBlock';
import { DemonstrationBlock } from '../blocks/DemonstrationBlock';
import { Block, BlockType, parseInlineNodes } from '../../core/parser';
import type { DiagramTargetRegistry } from '../../core/editorTypes';

const LATEX_SYMBOLS = [
  { label: '∀', code: '\\forall ' },
  { label: '∃', code: '\\exists ' },
  { label: '⟹', code: '\\implies ' },
  { label: '∈', code: '\\in ' },
  { label: '≅', code: '\\cong ' },
  { label: 'AB', code: '\\overline{AB}' },
  { label: '∠', code: '\\angle ' },
  { label: '△', code: '\\triangle ' },
  { label: '⊥', code: '\\perp ' },
  { label: '∥', code: '\\parallel ' }
];

type BlockPreset = {
  label: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, any>;
  group?: 'general' | 'profile';
};

const GENERAL_BLOCK_PRESETS: BlockPreset[] = [
  { label: 'Párrafo', type: 'paragraph', content: '' },
  { label: 'Título', type: 'heading', content: 'Nueva sección', metadata: { level: 3 } },
  { label: 'Lista', type: 'list', content: 'Primer elemento\nSegundo elemento', metadata: { ordered: false } },
  { label: 'Tabla', type: 'table', content: '| Magnitud | Valor |\n|---|---|\n| a | $1$ |' },
  { label: 'Fórmula', type: 'formula', content: '$$ x = y $$' },
  { label: 'Definición', type: 'definition_box', content: 'Se define con precisión el objeto matemático.', metadata: { title: 'Definición' } },
  { label: 'Nota', type: 'note', content: 'Observación, caso límite o aclaración breve.' },
  { label: 'Cita', type: 'citation', content: 'Texto de la cita.', metadata: { author: '' } },
  { label: 'Separador', type: 'separator', content: '' },
  { label: 'Demostración', type: 'demonstration', content: '', metadata: { steps: [] } },
];

const PAGE_PROFILE_PRESETS: Record<string, BlockPreset[]> = {
  definicion: [
    { label: 'Motivación', type: 'heading', content: 'Motivación', metadata: { level: 3 }, group: 'profile' },
    { label: 'Definición formal', type: 'definition_box', content: 'Se especifican las condiciones necesarias y suficientes.', metadata: { title: 'Definición formal' }, group: 'profile' },
    { label: 'Casos límite', type: 'note', content: 'Se aclara qué ocurre en los casos degenerados o frontera.', group: 'profile' },
  ],
  teorema: [
    { label: 'Hipótesis', type: 'paragraph', content: 'Bajo las hipótesis indicadas en el enunciado formal, se consideran los objetos relevantes.', group: 'profile' },
    { label: 'Conclusión', type: 'formula', content: '$$ \\text{conclusión simbólica} $$', group: 'profile' },
    { label: 'Demostración asociada', type: 'paragraph', content: 'La demostración formal se enlaza como página independiente mediante un identificador de demostración en metadatos.', group: 'profile' },
  ],
  demostracion: [
    { label: 'Paso lógico', type: 'demonstration', content: '', metadata: { steps: [{ number: 1, title: 'Paso lógico', justificacion: 'Por hipótesis o por resultado previo especificado.', target: '', body: 'Se escribe la afirmación del paso con sus enlaces semánticos e interactivos.' }] }, group: 'profile' },
  ],
  ejercicio: [
    {
      label: 'Pregunta interactiva',
      type: 'exercise',
      content: `Identifica la relación matemática adecuada.\n\n<Pregunta\n  id="p1_q1"\n  correct="a"\n  texto="¿Qué afirmación es correcta?"\n  opciones={[\n    { value: "a", texto: "Respuesta correcta" },\n    { value: "b", texto: "Distractor razonable" }\n  ]}\n/>\n\n<Resolucion>\n  Se justifica la respuesta paso a paso.\n</Resolucion>`,
      metadata: { component: 'PasoEjercicio', id: 'p1', numero: 1, titulo: 'Planteamiento', questionIds: ['p1_q1'] },
      group: 'profile',
    },
    { label: 'Hueco', type: 'advancedMdx', content: '', metadata: { component: 'Hueco', id: 'q1', correct: 'respuesta', pista: 'Pista breve.' }, group: 'profile' },
    { label: 'Solución revelable', type: 'advancedMdx', content: 'Se desarrolla la solución completa con pasos justificados.', metadata: { component: 'Solucion', label: 'Ver solución' }, group: 'profile' },
  ],
  'caso-de-uso': [
    { label: 'Situación', type: 'heading', content: 'Situación', metadata: { level: 3 }, group: 'profile' },
    { label: 'Modelo matemático', type: 'definition_box', content: 'Se identifica el objeto matemático que modela la situación.', metadata: { title: 'Modelo matemático' }, group: 'profile' },
    { label: 'Cálculo', type: 'formula', content: '$$ \\text{cálculo} $$', group: 'profile' },
    { label: 'Interpretación', type: 'note', content: 'Se interpreta el resultado y se declaran los límites del modelo.', group: 'profile' },
  ],
  matematico: [
    { label: 'Contribución', type: 'heading', content: 'Contribución', metadata: { level: 3 }, group: 'profile' },
    { label: 'Conceptos asociados', type: 'list', content: '<ConceptLink targetId="concepto" isDependency={false}>concepto relacionado</ConceptLink>', metadata: { ordered: false }, group: 'profile' },
    { label: 'Obra', type: 'list', content: 'Obra o resultado principal', metadata: { ordered: false }, group: 'profile' },
  ],
  modelo: [
    { label: 'Estructura concreta', type: 'definition_box', content: 'Se describe el universo y las relaciones que forman el modelo.', metadata: { title: 'Estructura concreta' }, group: 'profile' },
    { label: 'Axiomas satisfechos', type: 'list', content: '<ConceptLink targetId="axioma" isDependency={false}>axioma verificado</ConceptLink>', metadata: { ordered: false }, group: 'profile' },
  ],
};

const insertSymbol = (textareaId: string, symbol: string) => {
  const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const newVal = val.substring(0, start) + symbol + val.substring(end);
  textarea.value = newVal;
  textarea.focus();
  textarea.setSelectionRange(start + symbol.length, start + symbol.length);
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
};

function parseMarkdownTable(content: string): string[][] {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('|'))
    .filter(line => !/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line))
    .map(line => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim()));
}

function renderFormattedText(
  text: string,
  blockId: string,
  onEditLink?: (blockId: string, rawMarkup: string, text: string, attrs: any, tag: string, e: React.MouseEvent) => void
): React.ReactNode[] | string {
  const parts = parseInlineNodes(text).map((node, index) => {
    const key = `${blockId}-${index}`;
    if (node.type === 'text') return node.value;
    if (node.type === 'bold') return <strong key={key} className="font-bold text-carbon">{node.value}</strong>;
    if (node.type === 'italic') return <em key={key} className="italic text-carbon/85">{node.value}</em>;
    if (node.type === 'inlineLatex') {
      return <KatexText key={key} text={`$${node.value}$`} className="rounded bg-ocre/5 px-1 py-0.5 text-carbon" />;
    }

    if (node.type === 'conceptLink' || node.type === 'refLink') {
      const tag = node.type === 'conceptLink' ? 'ConceptLink' : 'RefLink';
      const colorClass = node.type === 'conceptLink'
        ? 'text-salvia border-b border-dashed border-salvia/30'
        : 'text-pavo border-b border-dashed border-pavo/30';
      const targetLabel = Array.isArray(node.attrs.targetId) ? node.attrs.targetId.join(', ') : node.attrs.targetId || '';
      return (
        <span
          key={key}
          onClick={(e) => onEditLink && onEditLink(blockId, node.raw, node.value, node.attrs, tag, e)}
          className={`${colorClass} font-bold cursor-pointer hover:bg-salvia/10 px-0.5 transition-colors relative group/link`}
          title={`Vínculo a: ${targetLabel} (Click para editar)`}
        >
          {renderFormattedText(node.value, `${key}-inner`, onEditLink)}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/link:block bg-carbon text-lienzo text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-30 font-sans">
            Concepto: {targetLabel || 'sin destino'}
          </span>
        </span>
      );
    }

    const color = node.attrs.color || 'salvia';
    const colorClass = `text-${color} border-b border-dashed border-${color}/30`;
    return (
      <span
        key={key}
        onClick={(e) => onEditLink && onEditLink(blockId, node.raw, node.value, node.attrs, 'InteractiveElement', e)}
        className={`${colorClass} font-bold cursor-pointer hover:bg-carbon/10 px-0.5 transition-colors relative group/link`}
        title={`Resalta en gráfico: ${node.attrs.target || ''} (Click para editar)`}
      >
        {renderFormattedText(node.value, `${key}-inner`, onEditLink)}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/link:block bg-carbon text-lienzo text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-30 font-sans">
          Resalta: {node.attrs.target || ''} ({color})
        </span>
      </span>
    );
  });

  return parts.length > 0 ? parts : text;
}

interface VisualEditorPanelProps {
  currentFile: string | null;
  metadata: Record<string, any>;
  isReadOnly: boolean;
  canEditVisualMetadata: boolean;
  canMutateVisualStructure: boolean;
  blocks: Block[];
  editingBlockId: string | null;
  setEditingBlockId: (id: string | null) => void;
  handleMetadataChange: (key: string, value: any) => void;
  addBlock: (index: number, type: BlockType) => void;
  moveBlock: (from: number, to: number) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, content: string, metadata?: Record<string, any>) => void;
  handleTextareaSelect: (e: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => void;
  handleEditLink: (blockId: string, rawMarkup: string, text: string, attrs: any, tag: string, e: React.MouseEvent) => void;
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
  removeBlock,
  updateBlock,
  handleTextareaSelect,
  handleEditLink,
  setActiveDiagramIndex,
  setActiveDiagramBlockId,
  setDiagramBuilderOpen,
  diagramTargets,
}) => {
  const showStatement = ['teorema', 'lema', 'corolario', 'definicion', 'axioma'].includes(String(metadata.type));

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
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `**${value}**`, 'énfasis')} className="h-6 min-w-6 rounded px-1.5 text-[10px] font-bold text-carbon hover:bg-carbon/5 cursor-pointer" title="Negrita">B</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `*${value}*`, 'énfasis')} className="h-6 min-w-6 rounded px-1.5 text-[10px] italic text-carbon hover:bg-carbon/5 cursor-pointer" title="Cursiva">I</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `$${value}$`, 'x')} className="h-6 rounded px-1.5 font-mono text-[10px] text-ocre hover:bg-ocre/10 cursor-pointer" title="LaTeX inline">$x$</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => openLinkerFromActiveSelection(block)} className="h-6 rounded px-1.5 text-[10px] font-bold text-salvia hover:bg-salvia/10 cursor-pointer" title="Conectar a concepto o diagrama">Vínculo</button>
    </div>
  );

  const insertPresetAt = (index: number, preset: BlockPreset) => {
    addBlock(index, preset.type);
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

        {blocks.map((block, index) => {
          const isFirstParagraph = index === blocks.findIndex(b => b.type === 'paragraph');
          return (
            <div key={block.id} className="relative group/block bg-transparent border border-transparent hover:bg-carbon/5 hover:border-carbon/15 rounded p-3 transition-all">
              {!isReadOnly && canMutateVisualStructure && (
                <div className="absolute -left-12 top-2 flex flex-col items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveBlock(index, index - 1)}
                    className="w-6 h-6 flex items-center justify-center bg-lienzo border border-carbon/20 rounded hover:bg-carbon/5 text-[10px] text-carbon disabled:opacity-30 cursor-pointer"
                    title="Subir Bloque"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === blocks.length - 1}
                    onClick={() => moveBlock(index, index + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-lienzo border border-carbon/20 rounded hover:bg-carbon/5 text-[10px] text-carbon disabled:opacity-30 cursor-pointer"
                    title="Bajar Bloque"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    className="w-6 h-6 flex items-center justify-center bg-terracota text-lienzo rounded hover:bg-terracota/80 text-[10px] mt-2 cursor-pointer"
                    title="Eliminar Bloque"
                  >
                    ✕
                  </button>
                </div>
              )}

              {block.type === 'paragraph' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Párrafo</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">
                      {editingBlockId === block.id ? 'Subraye texto para vincular concepto' : 'Haga clic para editar'}
                    </span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className="w-full bg-transparent resize-none focus:outline-none text-base leading-relaxed text-carbon font-serif min-h-[40px] focus:ring-0 p-0"
                        placeholder="Escriba prosa explicativa o notas aquí..."
                        style={{ height: 'auto' }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className="w-full text-base leading-relaxed text-carbon font-serif cursor-text py-1 select-text"
                    >
                      {isFirstParagraph ? (
                        <>
                          <span className="float-left text-5xl font-serif font-bold text-salvia mr-2 leading-none mt-1 select-none">
                            {block.content.charAt(0).toUpperCase()}
                          </span>
                          {renderFormattedText(block.content.substring(1), block.id, handleEditLink) || (
                            <span className="text-carbon/25 italic">Escriba prosa explicativa o notas aquí...</span>
                          )}
                        </>
                      ) : (
                        renderFormattedText(block.content, block.id, handleEditLink) || (
                          <span className="text-carbon/25 italic">Escriba prosa explicativa o notas aquí...</span>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'heading' && (
                <div className="space-y-1 py-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Título</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <input
                      autoFocus
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      onBlur={() => setEditingBlockId(null)}
                      placeholder="Escriba el título de sección..."
                      className="w-full bg-transparent border-none outline-none font-serif font-bold text-xl text-carbon p-0 focus:ring-0"
                    />
                  ) : (
                    <h3
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className={`font-serif font-bold text-carbon mt-1 cursor-text ${
                        block.metadata?.level === 2 ? 'text-2xl border-b border-carbon/15 pb-2' : 'text-xl'
                      }`}
                    >
                      {block.content || <span className="text-carbon/25 italic">Título de sección...</span>}
                    </h3>
                  )}
                </div>
              )}

              {block.type === 'list' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Lista</label>
                    <label className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-carbon/35 cursor-pointer">
                      Numerada
                      <input
                        type="checkbox"
                        checked={block.metadata?.ordered === true}
                        onChange={(event) => updateBlock(block.id, block.content, { ...block.metadata, ordered: event.target.checked })}
                      />
                    </label>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className="min-h-24 w-full resize-none rounded border border-carbon/15 bg-carbon/5 p-3 text-sm leading-relaxed text-carbon outline-none focus:border-salvia"
                        placeholder="Un elemento por línea..."
                      />
                    </div>
                  ) : (
                    <div onClick={() => !isReadOnly && setEditingBlockId(block.id)} className="cursor-text rounded border border-carbon/10 bg-carbon/5 p-4">
                      {block.metadata?.ordered === true ? (
                        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-carbon">
                          {block.content.split('\n').filter(Boolean).map((item, itemIndex) => (
                            <li key={`${block.id}-${itemIndex}`}>{renderFormattedText(item, block.id, handleEditLink)}</li>
                          ))}
                        </ol>
                      ) : (
                        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-carbon">
                          {block.content.split('\n').filter(Boolean).map((item, itemIndex) => (
                            <li key={`${block.id}-${itemIndex}`}>{renderFormattedText(item, block.id, handleEditLink)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'table' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Tabla</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar Markdown de tabla</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className="min-h-32 w-full resize-none rounded border border-carbon/15 bg-carbon/5 p-3 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-salvia"
                        placeholder="| Columna | Valor |\n|---|---|\n| a | $1$ |"
                      />
                    </div>
                  ) : (
                    <div onClick={() => !isReadOnly && setEditingBlockId(block.id)} className="overflow-x-auto rounded border border-carbon/15 bg-lienzo cursor-text">
                      <table className="w-full border-collapse text-sm text-carbon">
                        <tbody>
                          {parseMarkdownTable(block.content).map((row, rowIndex) => (
                            <tr key={`${block.id}-${rowIndex}`} className={rowIndex === 0 ? 'bg-carbon/5' : 'border-t border-carbon/10'}>
                              {row.map((cell, cellIndex) => {
                                const Cell = rowIndex === 0 ? 'th' : 'td';
                                return (
                                  <Cell key={`${block.id}-${rowIndex}-${cellIndex}`} className="px-3 py-2 text-left align-top">
                                    {renderFormattedText(cell, block.id, handleEditLink)}
                                  </Cell>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {block.type === 'separator' && (
                <div className="py-2 select-none">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Separador</label>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-carbon/15 to-transparent my-4" />
                </div>
              )}

              {block.type === 'note' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans font-serif">Nota</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="space-y-2">
                      {renderInlineToolbar(block)}
                      <div className="p-4 bg-carbon/5 border-l-4 border-carbon/40 rounded-r">
                        <textarea
                          autoFocus
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          onSelect={(e) => handleTextareaSelect(e, block.id)}
                          onBlur={() => setEditingBlockId(null)}
                          className="w-full bg-transparent border-none outline-none font-serif text-sm text-carbon leading-relaxed p-0 resize-none focus:ring-0 min-h-[40px]"
                          placeholder="Escriba la nota aclaratoria..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className="p-4 bg-carbon/5 border-l-4 border-carbon/40 rounded-r font-serif text-sm text-carbon leading-relaxed cursor-text italic"
                    >
                      {renderFormattedText(block.content, block.id, handleEditLink) || <span className="text-carbon/25 italic">Escriba una nota aclaratoria aquí...</span>}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'citation' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Cita</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="py-3 px-5 border-l-2 border-salvia/30 bg-salvia/5 rounded-r space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        className="w-full bg-transparent border-none outline-none font-serif italic text-sm text-carbon p-0 resize-none focus:ring-0"
                        placeholder="Texto de la cita..."
                      />
                      <input
                        value={block.metadata?.author || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { author: e.target.value })}
                        onBlur={() => setEditingBlockId(null)}
                        className="w-full bg-transparent border-none outline-none text-[10px] font-sans text-carbon/60 p-0 focus:ring-0 text-right"
                        placeholder="Autor de la cita..."
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className="py-4 px-6 border-l-2 border-salvia/30 italic text-carbon/85 font-serif text-sm leading-relaxed cursor-text relative"
                    >
                      <p>"{renderFormattedText(block.content, block.id, handleEditLink) || 'Escriba la cita aquí...'}"</p>
                      {block.metadata?.author && (
                        <p className="text-right text-[10px] text-carbon/50 not-italic mt-1">— {block.metadata.author}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'definition_box' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Definición Inline</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="p-4 border border-salvia/20 bg-salvia/5 rounded-sm space-y-2">
                      <input
                        value={block.metadata?.title || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { title: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs font-serif font-bold text-salvia p-0 focus:ring-0"
                        placeholder="Título de la definición..."
                      />
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className="w-full bg-transparent border-none outline-none font-serif text-sm text-carbon p-0 resize-none focus:ring-0"
                        placeholder="Escriba la definición formal..."
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className="p-4 border border-salvia/20 bg-salvia/5 rounded-sm font-serif text-sm text-carbon cursor-text"
                    >
                      <div className="text-[10px] uppercase font-bold text-salvia tracking-widest mb-1 select-none">
                        Definición: {block.metadata?.title || 'Sin Título'}
                      </div>
                      <div>{renderFormattedText(block.content, block.id, handleEditLink) || <span className="text-carbon/25 italic">Cuerpo de la definición...</span>}</div>
                    </div>
                  )}
                </div>
              )}

              {block.type === 'formula' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Fórmula Destacada</label>
                    <div className="flex gap-1 items-center">
                      <span className="text-[8px] font-sans text-carbon/40 uppercase mr-1">Insertar:</span>
                      {LATEX_SYMBOLS.map(sym => (
                        <button
                          key={sym.label}
                          type="button"
                          onClick={() => insertSymbol('formula-editor-' + block.id, sym.code)}
                          className="px-1 bg-carbon/5 hover:bg-carbon/10 text-carbon text-[9px] rounded font-mono transition-colors cursor-pointer"
                        >
                          {sym.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <FormulaBlock
                    id={'formula-editor-' + block.id}
                    content={block.content}
                    onChange={(newContent) => updateBlock(block.id, newContent)}
                  />
                </div>
              )}

              {block.type === 'demonstration' && (
                <DemonstrationBlock
                  steps={block.metadata?.steps || []}
                  diagramTargets={diagramTargets}
                  onChange={(updatedSteps) => updateBlock(block.id, '', { steps: updatedSteps })}
                />
              )}

              {block.type === 'exercise' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-carbon/10 pb-1 opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">
                      Paso de ejercicio interactivo
                    </label>
                    <span className="font-mono text-[9px] text-carbon/35">{block.metadata?.id || 'sin-id'}</span>
                  </div>
                  <div className="rounded border border-ocre/20 bg-ocre/5 p-4">
                    <div className="mb-3 grid gap-2 sm:grid-cols-3">
                      <input
                        value={block.metadata?.id || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, id: e.target.value })}
                        className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon outline-none focus:border-ocre"
                        placeholder="id del paso"
                      />
                      <input
                        type="number"
                        value={block.metadata?.numero || 1}
                        onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, numero: Number(e.target.value) || 1 })}
                        className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon outline-none focus:border-ocre"
                        placeholder="número"
                      />
                      <input
                        value={block.metadata?.titulo || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, titulo: e.target.value })}
                        className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon outline-none focus:border-ocre"
                        placeholder="título del paso"
                      />
                    </div>
                    {editingBlockId === block.id ? (
                      <div className="space-y-2">
                        {renderInlineToolbar(block)}
                        <textarea
                          autoFocus
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          onSelect={(e) => handleTextareaSelect(e, block.id)}
                          onBlur={() => setEditingBlockId(null)}
                          className="min-h-56 w-full resize-y rounded border border-carbon/15 bg-lienzo p-3 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-ocre"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                        className="block w-full rounded border border-dashed border-carbon/15 bg-lienzo/70 p-3 text-left font-serif text-sm leading-relaxed text-carbon hover:border-ocre/30 cursor-pointer"
                      >
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ocre/75">
                          {block.metadata?.titulo || 'Paso interactivo'}
                        </span>
                        <span className="line-clamp-6 whitespace-pre-wrap">{renderFormattedText(block.content, block.id, handleEditLink)}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {block.type === 'advancedMdx' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-carbon/10 pb-1 opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">
                      Componente MDX avanzado
                    </label>
                    <span className="font-mono text-[9px] text-carbon/35">{block.metadata?.component || 'MDX'}</span>
                  </div>
                  <div className="rounded border border-pavo/20 bg-pavo/5 p-4">
                    <p className="mb-3 text-xs italic text-carbon/55 select-none">
                      Este componente se conserva como MDX válido. Puede editarse aquí o ajustarse con más precisión en código fuente.
                    </p>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      onSelect={(e) => handleTextareaSelect(e, block.id)}
                      className="min-h-32 w-full resize-y rounded border border-carbon/15 bg-lienzo p-3 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-pavo"
                    />
                  </div>
                </div>
              )}

              {block.type === 'diagram' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-carbon/10 pb-1 opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">
                      Diagrama canónico ({block.content})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDiagramBlockId(block.id);
                        setActiveDiagramIndex(null);
                        setDiagramBuilderOpen(true);
                      }}
                      className="text-[9px] bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-0.5 rounded font-serif font-bold transition-all cursor-pointer"
                    >
                      Reemplazar
                    </button>
                  </div>
                  <div className="rounded border border-carbon/15 bg-carbon/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-sm font-bold text-carbon">{block.content}</p>
                        <p className="mt-1 font-mono text-[10px] text-carbon/50">{block.metadata?.path || 'Diagrama heredado sin archivo asociado'}</p>
                      </div>
                      <span className="rounded bg-salvia/10 px-2 py-1 text-[10px] font-bold text-salvia select-none">shared/diagrams</span>
                    </div>
                    {Array.isArray(block.metadata?.targets) && block.metadata.targets.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {block.metadata.targets.map((target: { id: string; label: string }) => (
                          <span key={target.id} className="rounded border border-carbon/10 bg-lienzo px-2 py-0.5 font-mono text-[10px] text-carbon/65" title={target.label}>
                            {target.id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isReadOnly && canMutateVisualStructure && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity   flex gap-1 bg-lienzo border border-carbon/25 rounded-full p-1 shadow-sm shrink-0 whitespace-nowrap z-10">
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'paragraph')}
                    className="px-2 py-0.5 text-[8px] font-bold text-salvia hover:bg-salvia/10 rounded-full font-serif cursor-pointer"
                  >
                    + Párrafo
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'heading')}
                    className="px-2 py-0.5 text-[8px] font-bold text-pizarra hover:bg-pizarra/10 rounded-full font-serif cursor-pointer"
                  >
                    + Título
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'list')}
                    className="px-2 py-0.5 text-[8px] font-bold text-pavo hover:bg-pavo/10 rounded-full font-serif cursor-pointer"
                  >
                    + Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'table')}
                    className="px-2 py-0.5 text-[8px] font-bold text-ocre hover:bg-ocre/10 rounded-full font-serif cursor-pointer"
                  >
                    + Tabla
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'formula')}
                    className="px-2 py-0.5 text-[8px] font-bold text-ocre hover:bg-ocre/10 rounded-full font-serif cursor-pointer"
                  >
                    + Fórmula
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'separator')}
                    className="px-2 py-0.5 text-[8px] font-bold text-carbon hover:bg-carbon/10 rounded-full font-serif cursor-pointer"
                  >
                    + Separador
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'note')}
                    className="px-2 py-0.5 text-[8px] font-bold text-ocre hover:bg-ocre/10 rounded-full font-serif cursor-pointer"
                  >
                    + Nota
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'citation')}
                    className="px-2 py-0.5 text-[8px] font-bold text-salvia hover:bg-salvia/10 rounded-full font-serif cursor-pointer"
                  >
                    + Cita
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'definition_box')}
                    className="px-2 py-0.5 text-[8px] font-bold text-terracota hover:bg-terracota/10 rounded-full font-serif cursor-pointer"
                  >
                    + Def Inline
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock(index + 1, 'demonstration')}
                    className="px-2 py-0.5 text-[8px] font-bold text-terracota hover:bg-terracota/10 rounded-full font-serif cursor-pointer"
                  >
                    + Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDiagramIndex(index + 1);
                      setActiveDiagramBlockId(null);
                      setDiagramBuilderOpen(true);
                    }}
                    className="px-2 py-0.5 text-[8px] font-bold text-pavo hover:bg-pavo/10 rounded-full font-serif cursor-pointer"
                  >
                    + Diagrama
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mx-auto mb-4 max-w-3xl space-y-2">
        <div className="rounded border border-ocre/30 bg-ocre/5 p-3 text-xs text-carbon shadow-sm">
          <span className="font-bold text-ocre">⚠️ Modo Visual Experimental:</span> El guardado visual, la metadata y las operaciones de añadir, mover o eliminar bloques están bloqueadas. Solo se admiten cambios localizados en bloques explícitamente editables.
        </div>
        {isReadOnly && (
          <div className="rounded border border-pavo/30 bg-pavo/5 p-3 text-xs text-carbon shadow-sm">
            <span className="font-bold text-pavo">ℹ️ Documento de Solo Lectura Visual:</span> El body no contiene ningún bloque que pueda editarse mediante un parche localizado seguro.
          </div>
        )}
      </div>

      {!isReadOnly && canMutateVisualStructure && (
        <div className="sticky top-0 z-20 mx-auto mb-4 max-w-3xl rounded border border-carbon/15 bg-lienzo/95 p-2 shadow-sm backdrop-blur select-none">
          <div className="flex flex-wrap items-center justify-center gap-1">
            {GENERAL_BLOCK_PRESETS.map(preset => (
              <button
                key={`${preset.type}-${preset.label}`}
                type="button"
                onClick={() => insertPresetAtEnd(preset)}
                className="rounded px-2 py-1 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5 hover:text-carbon cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
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
          {profilePresets.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1 border-t border-carbon/10 pt-2">
              <span className="mr-1 text-[9px] font-bold uppercase tracking-widest text-carbon/40">
                {String(metadata.type)}
              </span>
              {profilePresets.map(preset => (
                <button
                  key={`${preset.type}-${preset.label}`}
                  type="button"
                  onClick={() => insertPresetAtEnd(preset)}
                  className="rounded border border-salvia/20 bg-salvia/5 px-2 py-1 text-[10px] font-bold text-salvia hover:bg-salvia/10 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {renderBlocksList()}
    </div>
  );
};
export default VisualEditorPanel;
