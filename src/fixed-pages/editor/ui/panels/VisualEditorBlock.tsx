import React from 'react';
import { useI18n } from '@/i18n';
import { FormulaBlock } from '../blocks/FormulaBlock';
import type { DiagramTargetRegistry, EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';
import type { Block } from '@/fixed-pages/editor/session/parser';
import { insertSymbol, parseMarkdownTable, renderFormattedText, type EditLinkHandler } from './InlineContentPreview';
import { PublishedEditSurface } from './PublishedEditSurface';
import { INLINE_EDITABLE_BLOCKS, LATEX_SYMBOLS } from './visualEditorPresets';
import { BlockActions } from './VisualBlockControls';
import { RegisteredMdxBlockEditor } from './RegisteredMdxBlockEditor';
import { ExerciseBlockEditor } from './ExerciseBlockEditor';
import { DiagramRuntimePreview } from '../../diagrams/ui/DiagramRuntimePreview';
import { RichProseSurface } from '../prose/RichProseSurface';
import { autoCapitularLetter } from '../prose/demoGrouping';
import { Button, Callout, Card, controlClassName, inlineFieldClassName } from '@/fixed-pages/editor/ui/primitives';

interface VisualEditorBlockProps {
  block: Block;
  blocks: Block[];
  index: number;
  isReadOnly: boolean;
  canMutateVisualStructure: boolean;
  editingBlockId: string | null;
  setEditingBlockId: (id: string | null) => void;
  highlightedBlockId?: string | null;
  issues?: EditorValidationIssue[];
  /** Opens the block palette to insert after this block («/» on the block or in an empty text). */
  onOpenPalette?: () => void;
  /** Alt+Shift+↑/↓ on a heading: moves its whole section. */
  onStepSection?: (direction: -1 | 1) => void;
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
  setEditingBlockId, highlightedBlockId, issues = [], onOpenPalette, onStepSection, moveBlock, duplicateBlock, removeBlock, updateBlock,
  handleTextareaSelect, handleEditLink, renderInlineToolbar, setActiveDiagramIndex,
  setActiveDiagramBlockId, setDiagramBuilderOpen, diagramTargets: _diagramTargets,
}) => {
  const { t } = useI18n();
  const precedingCapitular = blocks[index - 1]?.metadata?.component === 'Capitular' ? blocks[index - 1] : null;
  const dropCapLetter = block.metadata?.capitular
    ? String(block.metadata.capitular).slice(0, 1)
    : precedingCapitular ? String(precedingCapitular.metadata?.letra || '').slice(0, 1) : '';
  const hasDropCap = block.type === 'paragraph' && Boolean(dropCapLetter);
  const isSourceOnly = block.metadata?.preserved === true || block.metadata?.opaque === true;

  const blockIssues = issues.filter(i => i.blockId === block.id);
  const isHighlighted = highlightedBlockId === block.id;
  const hasError = blockIssues.some(i => i.severity === 'error');
  const hasWarning = blockIssues.some(i => i.severity === 'warning');

  let borderClasses = 'border-transparent bg-transparent hover:border-carbon/15 hover:bg-carbon/5 focus:border-canela/40';
  if (isHighlighted) {
    borderClasses = 'border-2 border-granada ring-4 ring-granada/25 bg-granada/10 animate-pulse shadow-xl';
  } else if (hasError) {
    borderClasses = 'border border-granada/40 bg-granada/5 hover:border-granada/60';
  } else if (hasWarning) {
    borderClasses = 'border border-ocre/30 bg-ocre/5 hover:border-ocre/50';
  }

  return (
            <div
              key={block.id}
              id={`block-${block.id}`}
              data-block-id={block.id}
              tabIndex={0}
              aria-label={t('editor.visual.blockAria', { n: index + 1, type: block.type })}
              onKeyDown={(event) => {
                if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === 'F2') && !isReadOnly && !isSourceOnly && INLINE_EDITABLE_BLOCKS.has(block.type)) {
                  event.preventDefault();
                  setEditingBlockId(block.id);
                  return;
                }
                if (event.key === '/' && !event.ctrlKey && !event.metaKey && !isReadOnly && canMutateVisualStructure && onOpenPalette) {
                  const target = event.target as HTMLElement;
                  const emptyProse = target.isContentEditable && !(target.textContent ?? '').trim();
                  if (target === event.currentTarget || emptyProse) {
                    event.preventDefault();
                    onOpenPalette();
                    return;
                  }
                }
                if (!event.altKey || !canMutateVisualStructure || isSourceOnly) return;
                if (event.shiftKey && block.type === 'heading' && onStepSection && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
                  event.preventDefault();
                  onStepSection(event.key === 'ArrowUp' ? -1 : 1);
                  return;
                }
                if (event.key === 'ArrowUp' && index > 0) { event.preventDefault(); moveBlock(index, index - 1); }
                if (event.key === 'ArrowDown' && index < blocks.length - 1) { event.preventDefault(); moveBlock(index, index + 1); }
              }}
              className={`relative group/block rounded p-3 transition-all focus:outline-none ${borderClasses}`}
            >
              {blockIssues.length > 0 && (
                <div className="mb-2 space-y-1">
                  {blockIssues.map(issue => (
                    <div
                      key={issue.id}
                      className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-sans font-medium ${
                        issue.severity === 'error'
                          ? 'bg-granada/15 text-granada border border-granada/30'
                          : 'bg-ocre/15 text-ocre border border-ocre/30'
                      }`}
                    >
                      <span className="font-bold uppercase text-[9px] tracking-wider">
                        {issue.severity === 'error' ? t('editor.visual.severityError') : t('editor.visual.severityWarning')}:
                      </span>
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Badges de metadata / paso de diagrama */}
              {Boolean(block.metadata?.diagramStep) && (
                <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="inline-flex items-center gap-1 rounded border border-terracota/30 bg-terracota/10 px-2 py-0.5 font-bold text-terracota">
                    {t('editor.visual.diagramStep', { step: String(block.metadata?.diagramStep) })}
                  </span>
                </div>
              )}


              {!isReadOnly && canMutateVisualStructure && !isSourceOnly && (
                <BlockActions blockId={block.id} index={index} blockCount={blocks.length} moveBlock={moveBlock} duplicateBlock={duplicateBlock} removeBlock={removeBlock} />
              )}

              {block.type === 'paragraph' && (
                <div className="space-y-1">
                  <PublishedEditSurface active={editingBlockId === block.id} hasError={hasError}>
                    <RichProseSurface
                      surfaceId={`prose-${block.id}`}
                      value={block.content}
                      disabled={isReadOnly}
                      placeholder={t('editor.visual.proseEmpty')}
                      onFocusSurface={() => setEditingBlockId(block.id)}
                      onEditChip={(raw, text, attrs, tag, event) => handleEditLink(block.id, raw, text, attrs, tag, event)}
                      onChange={(content) => {
                        const isFirstParagraph = blocks.findIndex(b => b.type === 'paragraph') === index;
                        const letter = isFirstParagraph ? autoCapitularLetter(content) : undefined;
                        updateBlock(block.id, content, {
                          ...block.metadata,
                          capitular: letter,
                        });
                      }}
                      className={`text-base ${hasDropCap ? 'first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-canela' : ''}`}
                    />
                  </PublishedEditSurface>
                </div>
              )}

              {block.type === 'heading' && (
                <div className="space-y-1 py-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">{t('editor.visual.blockHeading')}</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">{t('editor.visual.clickToEdit')}</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <input
                      autoFocus
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      onBlur={() => setEditingBlockId(null)}
                      placeholder={t('editor.visual.headingPlaceholder')}
                      className={`${inlineFieldClassName} font-serif font-bold text-xl text-carbon`}
                    />
                  ) : (
                    <h3
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className={`font-serif font-bold text-carbon mt-1 cursor-text ${
                        block.metadata?.level === 2 ? 'text-2xl border-b border-carbon/15 pb-2' : 'text-xl'
                      }`}
                    >
                      {block.content || <span className="text-carbon/25 italic">{t('editor.visual.headingEmpty')}</span>}
                    </h3>
                  )}
                </div>
              )}

              {block.type === 'list' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">{t('editor.visual.blockList')}</label>
                    <label className="flex items-center gap-1 ac-label ac-label--2xs ac-label--muted cursor-pointer">
                      {t('editor.visual.numbered')}
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
                        className={controlClassName}
                        placeholder={t('editor.visual.listPlaceholder')}
                      />
                    </div>
                  ) : (
                    <Card onClick={() => !isReadOnly && setEditingBlockId(block.id)}>
                      {block.metadata?.ordered === true ? (
                        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-carbon">
                          {block.content.split('\n').filter(Boolean).map((item, itemIndex) => (
                            <li key={`${block.id}-${itemIndex}`}>{renderFormattedText(item, block.id, handleEditLink, t)}</li>
                          ))}
                        </ol>
                      ) : (
                        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-carbon">
                          {block.content.split('\n').filter(Boolean).map((item, itemIndex) => (
                            <li key={`${block.id}-${itemIndex}`}>{renderFormattedText(item, block.id, handleEditLink, t)}</li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  )}
                </div>
              )}

              {block.type === 'table' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">{t('editor.visual.blockTable')}</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">{t('editor.visual.tableClickToEdit')}</span>
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
                        className={`${controlClassName} font-mono`}
                        placeholder={t('editor.visual.tablePlaceholder')}
                      />
                    </div>
                  ) : (
                    <Card className="overflow-x-auto" onClick={() => !isReadOnly && setEditingBlockId(block.id)}>
                      <table className="w-full border-collapse text-sm text-carbon">
                        <tbody>
                          {parseMarkdownTable(block.content).map((row, rowIndex) => (
                            <tr key={`${block.id}-${rowIndex}`} className={rowIndex === 0 ? 'bg-carbon/5' : 'border-t border-carbon/10'}>
                              {row.map((cell, cellIndex) => {
                                const Cell = rowIndex === 0 ? 'th' : 'td';
                                return (
                                  <Cell key={`${block.id}-${rowIndex}-${cellIndex}`} className="px-3 py-2 text-left align-top">
                                    {renderFormattedText(cell, block.id, handleEditLink, t)}
                                  </Cell>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Card>
                  )}
                </div>
              )}

              {block.type === 'separator' && (
                <div className="py-2 select-none">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">{t('editor.visual.blockSeparator')}</label>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-carbon/15 to-transparent my-4" />
                </div>
              )}

              {block.type === 'note' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans font-serif">{t('editor.visual.blockNote')}</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">{t('editor.visual.clickToEdit')}</span>
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
                          className={`${inlineFieldClassName} font-serif text-sm text-carbon leading-relaxed resize-none min-h-[40px]`}
                          placeholder={t('editor.visual.notePlaceholder')}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className="p-4 bg-carbon/5 border-l-4 border-carbon/40 rounded-r font-serif text-sm text-carbon leading-relaxed cursor-text italic"
                    >
                      {renderFormattedText(block.content, block.id, handleEditLink, t) || <span className="text-carbon/25 italic">{t('editor.visual.noteEmpty')}</span>}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'citation' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">{t('editor.visual.blockCitation')}</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">{t('editor.visual.clickToEdit')}</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="py-3 px-5 border-l-2 border-canela/30 bg-canela/5 rounded-r space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        className={`${inlineFieldClassName} font-serif italic text-sm text-carbon resize-none`}
                        placeholder={t('editor.visual.quotePlaceholder')}
                      />
                      <input
                        value={block.metadata?.author || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { author: e.target.value })}
                        onBlur={() => setEditingBlockId(null)}
                        className={`${inlineFieldClassName} text-[10px] font-sans text-carbon/60 text-right`}
                        placeholder={t('editor.visual.quoteAuthor')}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className="py-4 px-6 border-l-2 border-canela/30 italic text-carbon/85 font-serif text-sm leading-relaxed cursor-text relative"
                    >
                      <p>"{renderFormattedText(block.content, block.id, handleEditLink, t) || t('editor.visual.quoteEmpty')}"</p>
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
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">{t('editor.visual.blockDefinitionBox')}</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">{t('editor.visual.clickToEdit')}</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="p-4 border border-canela/20 bg-canela/5 rounded-sm space-y-2">
                      <input
                        value={block.metadata?.title || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { title: e.target.value })}
                        className={`${inlineFieldClassName} text-xs font-serif font-bold text-canela`}
                        placeholder={t('editor.visual.definitionTitlePlaceholder')}
                      />
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className={`${inlineFieldClassName} font-serif text-sm text-carbon resize-none`}
                        placeholder={t('editor.visual.definitionPlaceholder')}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className="p-4 border border-canela/20 bg-canela/5 rounded-sm font-serif text-sm text-carbon cursor-text"
                    >
                      <div className="ac-label ac-label--sm ac-label--canela mb-1 select-none">
                        {t('editor.visual.definitionHeading', { title: String(block.metadata?.title || t('editor.visual.untitled')) })}
                      </div>
                      <div>{renderFormattedText(block.content, block.id, handleEditLink, t) || <span className="text-carbon/25 italic">{t('editor.visual.definitionEmpty')}</span>}</div>
                    </div>
                  )}
                </div>
              )}

              {block.type === 'formula' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">{t('editor.visual.featuredFormula')}</label>
                    <div className="flex gap-1 items-center">
                      <span className="ac-label ac-label--2xs ac-label--faint mr-1">{t('editor.visual.insert')}</span>
                      {LATEX_SYMBOLS.map(sym => (
                        <Button size="sm" className="font-mono" key={sym.label} onClick={() => insertSymbol('formula-editor-' + block.id, sym.code)}>
                          {sym.label}
                        </Button>
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

              {block.type === 'exercise' && (
                <ExerciseBlockEditor block={block} isReadOnly={isReadOnly} updateBlock={updateBlock} handleTextareaSelect={handleTextareaSelect} handleEditLink={handleEditLink} renderInlineToolbar={renderInlineToolbar} />
              )}

              {block.type === 'advancedMdx' && (
                block.metadata?.editable ? <RegisteredMdxBlockEditor block={block} isReadOnly={isReadOnly} updateBlock={updateBlock} handleTextareaSelect={handleTextareaSelect} handleEditLink={handleEditLink} renderInlineToolbar={renderInlineToolbar} /> :
                <div className="space-y-2"><Callout><>
                      <p className="mb-3 text-xs italic text-carbon/55 select-none">
                        {t('editor.visual.preservedNote')}
                      </p>
                      <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded border border-carbon/10 bg-lienzo p-3 font-mono text-[10px] leading-relaxed text-carbon/65">{block.content}</pre>
                    </></Callout></div>
              )}

              {block.type === 'diagram' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-carbon/10 pb-1 opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block ac-label ac-label--2xs ac-label--faint font-sans">
                      {t('editor.visual.canonicalDiagram', { name: block.content })}
                    </label>
                    {canMutateVisualStructure && (
                      <Button size="sm" onClick={() => {
                          setActiveDiagramBlockId(block.id);
                          setActiveDiagramIndex(null);
                          setDiagramBuilderOpen(true);
                        }}>
                        {t('editor.visual.replace')}
                      </Button>
                    )}
                  </div>
                  <Card className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-sm font-bold text-carbon">{block.content}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-carbon/50">{block.metadata?.path || t('editor.visual.legacyDiagram')}</p>
                      </div>
                      <span className="rounded bg-canela/10 px-2.5 py-1 text-[10px] font-bold text-canela select-none shrink-0">
                        {t('editor.visual.finalCatalog')}
                      </span>
                    </div>
                    {Array.isArray(block.metadata?.targets) && block.metadata.targets.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {block.metadata.targets.map((target: { id: string; label: string }) => (
                          <span key={target.id} className="rounded border border-carbon/15 bg-lienzo px-2 py-0.5 font-mono text-[10px] text-carbon/70 shadow-2xs" title={target.label}>
                            {target.id}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="w-full">
                      <DiagramRuntimePreview filePath={typeof block.metadata?.path === 'string' ? block.metadata.path : null} componentName={block.content} />
                    </div>
                  </Card>
                </div>
              )}

            </div>
  );
};
