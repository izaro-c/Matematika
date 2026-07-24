import React from 'react';
import { FormulaBlock } from '../blocks/FormulaBlock';
import { DemonstrationBlock } from '../blocks/DemonstrationBlock';
import type { DiagramTargetRegistry } from '../../core/editorTypes';
import type { Block, BlockType } from '../../core/parser';
import { insertSymbol, parseMarkdownTable, renderFormattedText, type EditLinkHandler } from './InlineContentPreview';
import { INLINE_EDITABLE_BLOCKS, LATEX_SYMBOLS } from './visualEditorPresets';
import { BlockActions, BlockInsertMenu } from './VisualBlockControls';
import { RegisteredMdxBlockEditor } from './RegisteredMdxBlockEditor';
import { ExerciseBlockEditor } from './ExerciseBlockEditor';
import { DiagramRuntimePreview } from '../../diagrams/ui/DiagramRuntimePreview';

interface VisualEditorBlockProps {
  block: Block;
  blocks: Block[];
  index: number;
  isReadOnly: boolean;
  canMutateVisualStructure: boolean;
  editingBlockId: string | null;
  setEditingBlockId: (id: string | null) => void;
  addBlock: (index: number, type: BlockType, content?: string, metadata?: Record<string, unknown>) => void;
  moveBlock: (from: number, to: number) => void;
  duplicateBlock: (id: string) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, content: string, metadata?: Record<string, unknown>) => void;
  handleTextareaSelect: (event: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => void;
  handleEditLink: EditLinkHandler;
  renderInlineToolbar: (block: Block) => React.ReactNode;
  setActiveDiagramIndex: (index: number | null) => void;
  setActiveDiagramBlockId: (id: string | null) => void;
  setDiagramBuilderOpen: (open: boolean) => void;
  diagramTargets: DiagramTargetRegistry;
}

export const VisualEditorBlock: React.FC<VisualEditorBlockProps> = ({
  block, blocks, index, isReadOnly, canMutateVisualStructure, editingBlockId,
  setEditingBlockId, addBlock, moveBlock, duplicateBlock, removeBlock, updateBlock,
  handleTextareaSelect, handleEditLink, renderInlineToolbar, setActiveDiagramIndex,
  setActiveDiagramBlockId, setDiagramBuilderOpen, diagramTargets,
}) => {
  const precedingCapitular = blocks[index - 1]?.metadata?.component === 'Capitular' ? blocks[index - 1] : null;
  const dropCapLetter = block.metadata?.capitular
    ? String(block.metadata.capitular).slice(0, 1)
    : precedingCapitular ? String(precedingCapitular.metadata?.letra || '').slice(0, 1) : '';
  const hasDropCap = block.type === 'paragraph' && Boolean(dropCapLetter);
  const isSourceOnly = block.metadata?.preserved === true || block.metadata?.opaque === true;

  return (
            <div
              key={block.id}
              id={`block-${block.id}`}
              tabIndex={0}
              aria-label={`Bloque ${index + 1}: ${block.type}. Alt y flechas para reordenar.`}
              onKeyDown={(event) => {
                if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === 'F2') && !isReadOnly && !isSourceOnly && INLINE_EDITABLE_BLOCKS.has(block.type)) {
                  event.preventDefault();
                  setEditingBlockId(block.id);
                  return;
                }
                if (!event.altKey || !canMutateVisualStructure || isSourceOnly) return;
                if (event.key === 'ArrowUp' && index > 0) { event.preventDefault(); moveBlock(index, index - 1); }
                if (event.key === 'ArrowDown' && index < blocks.length - 1) { event.preventDefault(); moveBlock(index, index + 1); }
              }}
              className="relative group/block rounded border border-transparent bg-transparent p-3 transition-all hover:border-carbon/15 hover:bg-carbon/5 focus:border-salvia/40 focus:outline-none"
            >
              {!isReadOnly && canMutateVisualStructure && !isSourceOnly && (
                <BlockActions blockId={block.id} index={index} blockCount={blocks.length} moveBlock={moveBlock} duplicateBlock={duplicateBlock} removeBlock={removeBlock} />
              )}

              {block.type === 'paragraph' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">Párrafo</label>
                    <span className="flex items-center gap-2 text-[8px] text-carbon/30 italic font-sans">
                      {hasDropCap && <label className="not-italic font-bold text-salvia">Capitular <input aria-label="Letra capitular" maxLength={1} value={dropCapLetter} onChange={event => updateBlock(block.id, block.content, { ...block.metadata, capitular: event.target.value.toUpperCase() })} className="ml-1 h-5 w-6 rounded border border-salvia/20 bg-lienzo text-center font-serif text-xs font-bold text-salvia" /></label>}
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
                      {hasDropCap ? (
                        <>
                          <span className="float-left text-5xl font-serif font-bold text-salvia mr-2 leading-none mt-1 select-none">
                            {dropCapLetter}
                          </span>
                          {renderFormattedText(block.content, block.id, handleEditLink) || (
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
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">Título</label>
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
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">Lista</label>
                    <label className="flex items-center gap-1 ac-label ac-label--2xs ac-label--muted cursor-pointer">
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
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">Tabla</label>
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
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">Separador</label>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-carbon/15 to-transparent my-4" />
                </div>
              )}

              {block.type === 'note' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans font-serif">Nota</label>
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
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">Cita</label>
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
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">Definición Inline</label>
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
                      <div className="ac-label ac-label--sm ac-label--salvia mb-1 select-none">
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
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">Fórmula Destacada</label>
                    <div className="flex gap-1 items-center">
                      <span className="ac-label ac-label--2xs ac-label--faint mr-1">Insertar:</span>
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
                  singleStepMode
                />
              )}

              {block.type === 'exercise' && (
                <ExerciseBlockEditor block={block} isReadOnly={isReadOnly} updateBlock={updateBlock} handleTextareaSelect={handleTextareaSelect} handleEditLink={handleEditLink} renderInlineToolbar={renderInlineToolbar} />
              )}

              {block.type === 'advancedMdx' && (
                block.metadata?.editable ? <RegisteredMdxBlockEditor block={block} isReadOnly={isReadOnly} updateBlock={updateBlock} handleTextareaSelect={handleTextareaSelect} handleEditLink={handleEditLink} renderInlineToolbar={renderInlineToolbar} /> :
                <div className="space-y-2"><div className="rounded border border-pavo/20 bg-pavo/5 p-4"><>
                      <p className="mb-3 text-xs italic text-carbon/55 select-none">Bloque desconocido preservado byte a byte. Se modifica exclusivamente en la vista de código.</p>
                      <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded border border-carbon/10 bg-lienzo p-3 font-mono text-[10px] leading-relaxed text-carbon/65">{block.content}</pre>
                    </></div></div>
              )}

              {block.type === 'diagram' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-carbon/10 pb-1 opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">
                      Diagrama canónico ({block.content})
                    </label>
                    {canMutateVisualStructure && <button
                      type="button"
                      onClick={() => {
                        setActiveDiagramBlockId(block.id);
                        setActiveDiagramIndex(null);
                        setDiagramBuilderOpen(true);
                      }}
                      className="text-[9px] bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-0.5 rounded font-serif font-bold transition-all cursor-pointer"
                    >
                      Reemplazar
                    </button>}
                  </div>
                  <div className="rounded border border-carbon/15 bg-carbon/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-sm font-bold text-carbon">{block.content}</p>
                        <p className="mt-1 font-mono text-[10px] text-carbon/50">{block.metadata?.path || 'Diagrama heredado sin archivo asociado'}</p>
                      </div>
                      <span className="rounded bg-salvia/10 px-2 py-1 text-[10px] font-bold text-salvia select-none">Catálogo de diagramas finales</span>
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
                    <div className="mt-4">
                      <DiagramRuntimePreview filePath={typeof block.metadata?.path === 'string' ? block.metadata.path : null} componentName={block.content} />
                    </div>
                  </div>
                </div>
              )}

              {!isReadOnly && canMutateVisualStructure && (
                <BlockInsertMenu
                  index={index}
                  addBlock={addBlock}
                  openDiagramBuilder={(insertIndex) => {
                    setActiveDiagramIndex(insertIndex);
                    setActiveDiagramBlockId(null);
                    setDiagramBuilderOpen(true);
                  }}
                />
              )}
            </div>
  );
};
