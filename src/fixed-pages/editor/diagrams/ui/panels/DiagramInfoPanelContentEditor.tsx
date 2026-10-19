import React, { useState } from 'react';
import type { DiagramInfoPanelBlock, DiagramInfoPanelRule, DiagramColorToken } from '@/diagrams/public';
import type { AnnotationObject } from '@/diagrams';
import type { VisualDiagramModel } from '../../model/types';
import { modelElements, modelPoints, modelSliders } from '../../model/scene/objectLists';
import { DiagramExpressionField } from './DiagramExpressionField';
import { DiagramTemplateField } from '../DiagramTemplateField';
import { COLOR_OPTIONS } from '../../model';
import { DiagramButton, DiagramField, DiagramPanel, DiagramTabBar } from '../primitives';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';
import { Button, Callout, Modal } from '@/fixed-pages/editor/ui/primitives';

interface DiagramInfoPanelContentEditorProps {
  model: VisualDiagramModel;
  panel: AnnotationObject;
  onPanelChange: (update: (panel: AnnotationObject) => AnnotationObject) => void;
}

type PanelContentPatch = Partial<AnnotationObject['content']>;

interface PanelBlockEditorProps {
  model: VisualDiagramModel;
  block: DiagramInfoPanelBlock;
  index: number;
  count: number;
  onChange: (block: DiagramInfoPanelBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function nextBlockId(blocks: readonly DiagramInfoPanelBlock[]): string {
  const used = new Set(blocks.map(block => block.id));
  let index = blocks.length + 1;
  while (used.has(`bloque-${index}`)) index += 1;
  return `bloque-${index}`;
}

/** Anclaje del panel al cambiar de modo: conserva el objeto seguido o la posición en la vista. */
function panelAnchor(model: VisualDiagramModel, panel: AnnotationObject, anchorMode: 'reference' | 'viewport'): AnnotationObject['anchor'] {
  if (anchorMode === 'viewport') {
    return panel.anchor.type === 'viewport' ? panel.anchor : { type: 'viewport', position: [0.08, 0.22] };
  }
  if (panel.anchor.type === 'object') return panel.anchor;
  const fallback = modelPoints(model)[0]?.id;
  return fallback ? { type: 'object', object: fallback } : panel.anchor;
}

const ColorSelector = ({ value, onChange, label }: { value: DiagramColorToken | undefined, onChange: (v: DiagramColorToken | undefined) => void, label: string }) => {
  const { t } = useI18n();
  return (
  <DiagramField label={label}>
    <select
      aria-label={label}
      value={value || ''}
      onChange={e => onChange(e.target.value as DiagramColorToken || undefined)}
    >
      <option value="">{t('editor.diagramPanels.defaultPavo')}</option>
      {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
    </select>
  </DiagramField>
);
};

const PanelBlockEditor: React.FC<PanelBlockEditorProps> = ({
  model,
  block,
  index,
  count,
  onChange,
  onMove,
  onDuplicate,
  onDelete,
}) => {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(index === 0);
  const rules = block.rules ?? [];
  const patchRule = (ruleIndex: number, update: Partial<DiagramInfoPanelRule>) => onChange({
    ...block,
    rules: rules.map((rule, candidate) => candidate === ruleIndex ? { ...rule, ...update } : rule),
  });
  const moveRule = (ruleIndex: number, direction: -1 | 1) => {
    const target = ruleIndex + direction;
    if (target < 0 || target >= rules.length) return;
    const next = [...rules];
    [next[ruleIndex], next[target]] = [next[target], next[ruleIndex]];
    onChange({ ...block, rules: next });
  };

  return (
    <DiagramPanel
      title={`${index + 1} · ${block.title || block.id || t('editor.diagramPanels.untitledBlock')}`}
      collapsible
      open={expanded}
      onOpenChange={setExpanded}
      className="border-b border-carbon/10 bg-transparent"
    >
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('editor.diagramPanels.organizeBlock', { name: block.title || block.id })}>
          <DiagramButton variant="danger" disabled={index === 0} className="!min-h-0 border-carbon/15 bg-carbon/5 px-2 py-1 text-[10px] text-carbon/80 hover:bg-carbon/10" onClick={() => onMove(-1)}>{t('editor.diagramPanels.up')}</DiagramButton>
          <DiagramButton variant="danger" disabled={index === count - 1} className="!min-h-0 border-carbon/15 bg-carbon/5 px-2 py-1 text-[10px] text-carbon/80 hover:bg-carbon/10" onClick={() => onMove(1)}>{t('editor.diagramPanels.down')}</DiagramButton>
          <DiagramButton variant="danger" className="!min-h-0 border-pavo/20 bg-pavo/5 px-2 py-1 text-[10px] text-pavo hover:bg-pavo/10" onClick={onDuplicate}>{t('editor.diagramPanels.duplicate')}</DiagramButton>
          <DiagramButton variant="danger" className="!min-h-0 ml-auto border-granada/20 bg-granada/5 px-2 py-1 text-[10px] text-granada hover:bg-granada/10" onClick={onDelete}>{t('editor.diagramPanels.deleteBlock')}</DiagramButton>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DiagramField label={t('editor.diagramPanels.internalIdentifier')}>
            <input aria-label={t('editor.diagramPanels.blockIdN', { n: index + 1 })} className="font-mono shadow-inner" value={block.id} onChange={event => onChange({ ...block, id: event.target.value })} />
          </DiagramField>
          <DiagramField label={t('editor.diagramPanels.mainHeading')}>
            <input aria-label={t('editor.diagramPanels.blockHeadingN', { n: index + 1 })} className="shadow-inner" value={block.title ?? ''} onChange={event => onChange({ ...block, title: event.target.value || undefined })} placeholder={t('editor.diagramPanels.titleExample')} />
          </DiagramField>
        </div>

        <div className="space-y-1">
          <DiagramTemplateField richText model={model} label={t('editor.diagramPanels.defaultContent')} ariaLabel={t('editor.diagramPanels.blockDefaultContentN', { n: index + 1 })} value={block.text} onChange={text => onChange({ ...block, text })} placeholder={t('editor.diagramPanels.defaultContentHint')} rows={3} />
        </div>

        <ColorSelector label={t('editor.diagramPanels.defaultAccentColor')} value={block.color} onChange={color => onChange({ ...block, color })} />

        {(block.expression || block.text.includes('{value}')) && <DiagramPanel title={t('editor.diagramPanels.valueCompatibility', { value: '{value}' })} collapsible defaultOpen={Boolean(block.expression)} className="border-l-2 border-carbon/10 bg-transparent pl-3">
          <DiagramExpressionField compact model={model} label={t('editor.diagramPanels.inheritedCalculationOf', { name: block.title || block.id })} value={block.expression ?? ''} onChange={expression => onChange({ ...block, expression: expression || undefined })} optional />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DiagramField label={t('editor.diagramPanels.visualUnit')}><input aria-label={t('editor.diagramPanels.baseUnitOf', { id: block.id })} value={block.unit ?? ''} onChange={event => onChange({ ...block, unit: event.target.value || undefined })} /></DiagramField>
            <DiagramField label={t('editor.diagramPanels.precisionDecimals')}><input type="number" min="0" max="12" aria-label={t('editor.diagramPanels.baseDecimalsOf', { id: block.id })} value={block.precision ?? 2} onChange={event => onChange({ ...block, precision: Number(event.target.value) })} /></DiagramField>
          </div>
        </DiagramPanel>}

        <section className="space-y-3 border-t border-carbon/10 pt-3" aria-label={t('editor.diagramPanels.conditionalVariantsOf', { name: block.title || block.id })}>
          <header>
            <h4 className="ac-label ac-label--md ac-label--ocre">{t('editor.diagramPanels.variantsAndSpecificCases')}</h4>
            <p className="mt-1 text-[10px] leading-relaxed text-carbon/60">{t('editor.diagramPanels.variantsHint')}</p>
          </header>

          <div className="space-y-3">
            {rules.map((rule, ruleIndex) => (
              <DiagramPanel
                key={`${block.id}-rule-${ruleIndex}`}
                title={rule.when ? t('editor.diagramPanels.caseWithCondition', { n: ruleIndex + 1, condition: rule.when }) : t('editor.diagramPanels.caseN', { n: ruleIndex + 1 })}
                collapsible
                defaultOpen={false}
                className="border-t border-carbon/10 bg-transparent"
              >
                <div className="flex flex-wrap gap-2">
                  <DiagramButton variant="danger" disabled={ruleIndex === 0} aria-label={t('editor.diagramPanels.moveCaseUp', { n: ruleIndex + 1 })} className="!min-h-0 border-carbon/15 px-2 py-1 text-[10px] font-medium hover:bg-carbon/5" onClick={() => moveRule(ruleIndex, -1)}>{t('editor.diagramPanels.up')}</DiagramButton>
                  <DiagramButton variant="danger" disabled={ruleIndex === rules.length - 1} aria-label={t('editor.diagramPanels.moveCaseDown', { n: ruleIndex + 1 })} className="!min-h-0 border-carbon/15 px-2 py-1 text-[10px] font-medium hover:bg-carbon/5" onClick={() => moveRule(ruleIndex, 1)}>{t('editor.diagramPanels.down')}</DiagramButton>
                  <DiagramButton variant="danger" className="!min-h-0 ml-auto border-granada/20 bg-granada/5 px-2 py-1 text-[10px] text-granada hover:bg-granada/10" onClick={() => onChange({ ...block, rules: rules.filter((_, candidate) => candidate !== ruleIndex) })}>{t('editor.diagramPanels.deleteCase')}</DiagramButton>
                </div>

                <DiagramExpressionField model={model} label={t('editor.diagramPanels.caseWhenLabel')} value={rule.when} onChange={when => patchRule(ruleIndex, { when })} help={t('editor.diagramPanels.caseConditionHelp')} />

                <DiagramTemplateField richText model={model} label={t('editor.diagramPanels.caseTextLabel')} ariaLabel={t('editor.diagramPanels.caseContentN', { n: ruleIndex + 1 })} value={rule.text} onChange={text => patchRule(ruleIndex, { text })} rows={3} />

                <ColorSelector label={t('editor.diagramPanels.specificAccentColor')} value={rule.color} onChange={color => patchRule(ruleIndex, { color })} />

                {(rule.expression || rule.text.includes('{value}')) && <DiagramPanel title={t('editor.diagramPanels.valueCompatibility', { value: '{value}' })} collapsible defaultOpen={Boolean(rule.expression)} className="border-t border-carbon/10 bg-transparent">
                  <DiagramExpressionField compact model={model} label={t('editor.diagramPanels.caseSInheritedCalculation')} ariaLabel={t('editor.diagramPanels.caseFormulaAria', { value: '{value}' })} value={rule.expression ?? ''} onChange={expression => patchRule(ruleIndex, { expression: expression || undefined })} optional />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DiagramField label={t('editor.diagramPanels.visualUnit')}><input aria-label={t('editor.diagramPanels.caseUnitN', { n: ruleIndex + 1 })} className="shadow-inner" value={rule.unit ?? ''} onChange={event => patchRule(ruleIndex, { unit: event.target.value || undefined })} /></DiagramField>
                    <DiagramField label={t('editor.diagramPanels.precisionDecimals')}><input type="number" min="0" max="12" aria-label={t('editor.diagramPanels.caseDecimalsN', { n: ruleIndex + 1 })} className="shadow-inner" value={rule.precision ?? block.precision ?? 2} onChange={event => patchRule(ruleIndex, { precision: Number(event.target.value) })} /></DiagramField>
                  </div>
                </DiagramPanel>}
              </DiagramPanel>
            ))}
          </div>
          <DiagramButton variant="danger" fullWidth className="border-ocre/30 bg-lienzo text-ocre shadow-sm hover:bg-ocre/10" onClick={() => onChange({ ...block, rules: [...rules, { when: '1', text: block.text }] })}>{t('editor.diagramPanels.addConditionalVariant')}</DiagramButton>
        </section>
    </DiagramPanel>
  );
};

export const DiagramInfoPanelContentEditor: React.FC<DiagramInfoPanelContentEditorProps> = ({
  model,
  panel,
  onPanelChange,
}) => {
  const { t } = useI18n();
  const content = panel.content;
  const anchorMode = panel.anchor.type === 'viewport' ? 'viewport' : 'reference';
  const viewportPosition = panel.anchor.type === 'viewport' ? panel.anchor.position : undefined;
  const patchContent = (patch: PanelContentPatch) => onPanelChange(current => {
    const next = { ...current.content, ...patch };
    (Object.keys(patch) as Array<keyof PanelContentPatch>).forEach(key => {
      if (patch[key] === undefined) delete next[key];
    });
    return { ...current, content: next };
  });
  const setViewportPosition = (position: [number, number]) => onPanelChange(current => ({ ...current, anchor: { type: 'viewport', position } }));
  const blocks = content.blocks ?? [];
  const updateBlocks = (next: DiagramInfoPanelBlock[]) => patchContent({ blocks: next.length ? next : undefined });
  const patchBlock = (index: number, block: DiagramInfoPanelBlock) => updateBlocks(blocks.map((candidate, candidateIndex) => candidateIndex === index ? block : candidate));
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    updateBlocks(next);
  };
  const addBlock = () => updateBlocks([...blocks, { id: nextBlockId(blocks), title: 'Nuevo bloque', text: 'Contenido...', rules: [] }]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<'content' | 'blocks' | 'position'>('content');

  return (
    <>
      <DiagramButton
        variant="danger"
        fullWidth
        className="bg-carbon/5 text-carbon hover:bg-carbon/10"
        onClick={() => setIsEditorOpen(true)}
      >
        {t('editor.diagramPanels.editorDialogTitle')}
      </DiagramButton>

      <Modal
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={t('editor.diagramPanels.infoPanel')}
        size="lg"
        footer={<Button variant="primary" onClick={() => setIsEditorOpen(false)}>{t('editor.diagramPanels.done')}</Button>}
      >
        <p className="mb-3 italic">{t('editor.diagramPanels.editorDialogSubtitle')}</p>
          <DiagramTabBar
            variant="tabs"
            aria-label={t('editor.diagramPanels.infoPanelSections')}
            className="mb-3"
            tabs={[
              { id: 'content', label: t('editor.diagramPanels.tabContent') },
              { id: 'blocks', label: t('editor.diagramPanels.tabBlocks', { count: blocks.length }) },
              { id: 'position', label: t('editor.diagramPanels.tabPosition') },
            ]}
            activeTab={editorTab}
            onTabChange={tabId => setEditorTab(tabId as 'content' | 'blocks' | 'position')}
          />

        <div className="min-w-0">
        <div className={editorTab === 'position' ? 'block' : 'hidden'}>
        <DiagramPanel title={t('editor.diagramPanels.positionInTheDiagram')} className="border-transparent bg-transparent">
          <DiagramField label={t('editor.diagramPanels.anchoringType')}>
            <select
              aria-label={t('editor.diagramPanels.panelAnchoringType')}
              className="shadow-inner"
              value={anchorMode}
              onChange={(event) => {
                const nextMode = event.target.value as 'reference' | 'viewport';
                onPanelChange(current => ({ ...current, anchor: panelAnchor(model, current, nextMode) }));
              }}
            >
              <option value="reference">{t('editor.diagramPanels.accompanyAGeometricObject')}</option>
              <option value="viewport">{t('editor.diagramPanels.anchorViewport')}</option>
            </select>
          </DiagramField>
          {anchorMode === 'reference' && <>
            <DiagramField label={t('editor.diagramPanels.objectToFollow')}>
              <select aria-label={t('editor.diagramPanels.panelReferenceObject')} className="shadow-inner" value={panel.anchor.type === 'object' ? panel.anchor.object : ''} onChange={event => { const object = event.target.value; if (object) onPanelChange(current => ({ ...current, anchor: { ...(current.anchor.type === 'object' ? current.anchor : {}), type: 'object', object } })); }}>
                <option value="">{t('editor.diagramPanels.selectAnObject')}</option>
                {[...modelPoints(model), ...modelElements(model).filter(item => item.id !== panel.id), ...modelSliders(model)].map(item => <option key={item.id} value={item.id}>{item.label} ({item.id})</option>)}
              </select>
            </DiagramField>
            <span className="mt-1 block text-[10px] font-normal leading-relaxed text-carbon/45">{t('editor.diagramPanels.followHint')}</span>
          </>}
          {anchorMode === 'viewport' && (
            <div className="space-y-2">
              <DiagramButton
                variant="danger"
                fullWidth
                className="border-carbon/15 bg-lienzo text-left text-xs font-semibold text-carbon shadow-sm hover:border-ocre/60 hover:bg-ocre/5"
                aria-label={t('editor.diagramPanels.alignWithTitle')}
                onClick={() => setViewportPosition([0, 0])}
              >
                {t('editor.diagramPanels.alignTopLeft')}
              </DiagramButton>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DiagramField label={t('editor.diagramPanels.horizontalMargin')}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    aria-label={t('editor.diagramPanels.horizontalPositionAria')}
                    className="shadow-inner"
                    value={Math.round((viewportPosition?.[0] ?? 0.08) * 100)}
                    onChange={(event) => setViewportPosition([Number(event.target.value) / 100, viewportPosition?.[1] ?? 0.22])}
                  />
                </DiagramField>
                <DiagramField label={t('editor.diagramPanels.verticalMargin')}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    aria-label={t('editor.diagramPanels.verticalPositionAria')}
                    className="shadow-inner"
                    value={Math.round((viewportPosition?.[1] ?? 0.22) * 100)}
                    onChange={(event) => setViewportPosition([viewportPosition?.[0] ?? 0.08, Number(event.target.value) / 100])}
                  />
                </DiagramField>
              </div>
            </div>
          )}
        </DiagramPanel>
        </div>

        <div className={editorTab === 'content' ? 'block' : 'hidden'}>
        <DiagramPanel title={t('editor.diagramPanels.headerAndIntroduction')} className="border-transparent bg-transparent">
          <DiagramField label={t('editor.diagramPanels.panelMainTitleAria')}>
            <input aria-label={t('editor.diagramPanels.panelTitle')} className="font-semibold shadow-inner" value={content.title ?? ''} onChange={event => patchContent({ title: event.target.value || undefined })} placeholder={t('editor.diagramPanels.titleExampleTriangles')} />
          </DiagramField>
          <DiagramField label={t('editor.diagramPanels.optionalSubtitle')}>
            <input aria-label={t('editor.diagramPanels.optionalPanelSubtitle')} className="italic shadow-inner" value={content.subtitle ?? ''} onChange={event => patchContent({ subtitle: event.target.value || undefined })} placeholder={t('editor.diagramPanels.subtitleExample')} />
          </DiagramField>
          <DiagramTemplateField richText model={model} label={t('editor.diagramPanels.optionalIntroductoryText')} ariaLabel={t('editor.diagramPanels.panelContent')} value={content.text || ''} onChange={text => patchContent({ text })} placeholder={t('editor.diagramPanels.introPlaceholder')} rows={3} />
        </DiagramPanel>
        </div>

        <div className={editorTab === 'blocks' ? 'block' : 'hidden'}>
        <DiagramPanel title={t('editor.diagramPanels.infoBlocks')} className="border-transparent bg-transparent">
          <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DiagramField label={t('editor.diagramPanels.presentationLayout')}>
              <select aria-label={t('editor.diagramPanels.blockDistribution')} className="shadow-inner" value={content.layout ?? 'stack'} onChange={event => patchContent({ layout: event.target.value as 'stack' | 'columns' })}>
                <option value="stack">{t('editor.diagramPanels.layoutStack')}</option>
                <option value="columns">{t('editor.diagramPanels.flexible2ColumnGrid')}</option>
              </select>
            </DiagramField>
            <Callout className="flex items-center text-[9px]">
              <div>
                {renderRichText(t('editor.diagramPanels.layoutRecommendation'), { b: c => <strong>{c}</strong>, em: c => <em>{c}</em> })}
              </div>
            </Callout>
          </div>

          <DiagramPanel title={t('editor.diagramPanels.formatGuide')} collapsible defaultOpen={false} className="border-l-2 border-pavo/20 bg-transparent pl-3">
            <h4 className="mb-1 text-[10px] font-bold text-pavo">{t('editor.diagramPanels.formatGuideForTexts')}</h4>
            <ul className="list-disc space-y-1 pl-3 text-[9px] text-carbon/70">
              <li>{renderRichText(t('editor.diagramPanels.formatBold'), { b: c => <strong className="font-bold">{c}</strong> })}</li>
              <li>{renderRichText(t('editor.diagramPanels.formatItalic'), { i: c => <em className="italic">{c}</em> })}</li>
              <li>{renderRichText(t('editor.diagramPanels.formatMath'), { code: c => <code>{c}</code> })}</li>
              <li>{t('editor.diagramPanels.formatCalculations')}</li>
              <li>{renderRichText(t('editor.diagramPanels.formatColor'), { code: c => <code>{c}</code> })}</li>
            </ul>
          </DiagramPanel>

          {blocks.length === 0 && <Callout className="text-center">
            <p className="mb-2 text-[11px] font-medium text-carbon/60">{t('editor.diagramPanels.noBlocksTitle')}</p>
            <p className="text-[10px] text-carbon/50">{t('editor.diagramPanels.noBlocksHint')}</p>
          </Callout>}

          <div className="space-y-4">
            {blocks.map((block, index) => (
              <PanelBlockEditor
                key={`${block.id}-${index}`}
                model={model}
                block={block}
                index={index}
                count={blocks.length}
                onChange={next => patchBlock(index, next)}
                onMove={direction => moveBlock(index, direction)}
                onDuplicate={() => updateBlocks([...blocks.slice(0, index + 1), { ...block, id: nextBlockId(blocks), title: block.title ? `${block.title} (copia)` : undefined, rules: block.rules?.map(rule => ({ ...rule })) }, ...blocks.slice(index + 1)])}
                onDelete={() => updateBlocks(blocks.filter((_, candidate) => candidate !== index))}
              />
            ))}
          </div>

          <DiagramButton variant="primary" fullWidth onClick={addBlock}>
            {t('editor.diagramPanels.addBlock')}
          </DiagramButton>
        </DiagramPanel>
        </div>
        </div>
      </Modal>
    </>
  );
};

export default DiagramInfoPanelContentEditor;
