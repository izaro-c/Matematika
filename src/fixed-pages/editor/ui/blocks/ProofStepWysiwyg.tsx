import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import type { ProofStepData } from '@/fixed-pages/editor/session/parser';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { ProofStepNumberBadge } from '@/components/content/ProofStepNumberBadge';
import { RichProseSurface } from '../prose/RichProseSurface';
import { bodyHasLogicalJustification, extractJustificationIdsFromBody } from '../blocks/demoJustification';
import { resolveJustification } from '@/lib/justifications/resolveJustification';
import { ProofStepLinkModal } from '../components/ProofStepLinkModal';
import { Button, IconButton, controlClassName } from '@/fixed-pages/editor/ui/primitives';

export interface ProofStepWysiwygProps {
  blockId: string;
  step: ProofStepData;
  displayNumber: number;
  index?: number;
  totalSteps?: number;
  active: boolean;
  isReadOnly?: boolean;
  diagramTargets: DiagramTargetRegistry;
  onActivate: () => void;
  onChangeStep: (next: ProofStepData) => void;
  onMoveStep?: (direction: -1 | 1) => void;
  onDuplicateStep?: () => void;
  onDeleteStep?: () => void;
  onFocusSurface: (surfaceId: string) => void;
  onEditChip?: (
    raw: string,
    text: string,
    attrs: Record<string, unknown>,
    tag: string,
    event: React.MouseEvent,
  ) => void;
}

function selectedTargets(step: ProofStepData): string[] {
  if (Array.isArray(step.target)) return step.target;
  if (typeof step.target === 'string' && step.target.trim()) return [step.target];
  return [];
}

export function ProofStepWysiwyg({
  blockId,
  step,
  displayNumber,
  index = 0,
  totalSteps = 1,
  active,
  isReadOnly = false,
  diagramTargets,
  onActivate,
  onChangeStep,
  onMoveStep,
  onDuplicateStep,
  onDeleteStep,
  onFocusSurface,
  onEditChip,
}: ProofStepWysiwygProps) {
  const { t } = useI18n();
  const targets = selectedTargets(step);
  const cited = extractJustificationIdsFromBody(step.body || '');
  const missingJustification = !bodyHasLogicalJustification(step.body || '');

  const [stepModalOpen, setStepModalOpen] = useState(false);

  const toggleTarget = (id: string) => {
    const next = targets.includes(id) ? targets.filter(t => t !== id) : [...targets, id];
    onChangeStep({
      ...step,
      number: displayNumber,
      target: next.length === 0 ? '' : next.length === 1 ? next[0] : next,
    });
  };

  const moment: 'initial' | 'auto' | 'manual' =
    step.diagramStep === 'initial' ? 'initial'
      : step.diagramStep === undefined || step.diagramStep === '' ? 'auto'
        : 'manual';

  const handleAppendBlockToStep = (type: 'formula' | 'list' | 'table' | 'note' | 'citation' | 'justification') => {
    let snippet = '';
    if (type === 'formula') snippet = '\n<Formula>\n  $$ x = y $$\n</Formula>\n';
    else if (type === 'list') snippet = '\n- Elemento 1\n- Elemento 2\n';
    else if (type === 'table') snippet = '\n| Columna 1 | Columna 2 |\n| --- | --- |\n| Valor 1 | Valor 2 |\n';
    else if (type === 'note') snippet = '\n<Nota>Nota explicativa</Nota>\n';
    else if (type === 'citation') snippet = '\n<Cita autor="Autor">Texto de la cita</Cita>\n';
    else if (type === 'justification') snippet = '\nPor <ConceptLink targetId="axioma" isDependency={true}>axioma o resultado previo</ConceptLink>, afirmamos el paso.\n';

    const currentBody = step.body || '';
    onChangeStep({
      ...step,
      number: displayNumber,
      body: currentBody.trim() ? `${currentBody}\n${snippet}` : snippet,
    });
  };

  return (
    <article
      className={`proof-step group/step relative mt-8 mb-6 w-full rounded-sm transition-all ${
        active
          ? 'is-active border-l-4 border-canela bg-canela/5 py-3 pl-3 pr-2 shadow-sm ring-1 ring-canela/25'
          : 'border-l-4 border-transparent py-2 pl-3 pr-2 opacity-90 hover:bg-carbon/[0.03]'
      }`}
      data-block-id={blockId}
      data-proof-step-number={displayNumber}
      data-diagram-step={step.diagramStep !== undefined ? String(step.diagramStep) : ''}
      onMouseDown={onActivate}
    >
      {/* Controles del Bloque de Paso (Subir, Bajar, Duplicar, Eliminar) */}
      {!isReadOnly && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded border border-carbon/10 bg-lienzo/95 p-1 opacity-0 shadow-sm transition-opacity group-hover/step:opacity-100 group-focus-within/step:opacity-100">
          <IconButton size="sm" label={t('editor.blocks.stepUp')} disabled={index === 0} onClick={(e) => { e.stopPropagation(); onMoveStep?.(-1); }}>
            ↑
          </IconButton>
          <IconButton size="sm" label={t('editor.blocks.stepDown')} disabled={index === totalSteps - 1} onClick={(e) => { e.stopPropagation(); onMoveStep?.(1); }}>
            ↓
          </IconButton>
          <IconButton size="sm" label={t('editor.blocks.stepDuplicate')} onClick={(e) => { e.stopPropagation(); onDuplicateStep?.(); }}>
            ⧉
          </IconButton>
          <IconButton size="sm" label={t('editor.blocks.stepDelete')} onClick={(e) => { e.stopPropagation(); onDeleteStep?.(); }}>
            ✕
          </IconButton>
        </div>
      )}

      {active && (
        <div className="mb-2 font-sans text-[10px] font-bold uppercase tracking-wider text-canela">
          {t('editor.blocks.stepSelected')}
        </div>
      )}
      <div className="mb-4 flex items-center gap-3 lg:gap-4">
        <ProofStepNumberBadge number={displayNumber} size="header" />
        <RichProseSurface
          surfaceId={`${blockId}-title`}
          value={step.title}
          singleLine
          disabled={isReadOnly}
          placeholder={t('editor.blocks.stepClaim')}
          onFocusSurface={onFocusSurface}
          onChange={title => onChangeStep({ ...step, number: displayNumber, title })}
          className="flex-1 border-b border-carbon/20 pb-1 text-xl italic lg:text-2xl [&:empty]:before:italic"
        />
      </div>

      <div className="proof-step-content pl-0 sm:pl-14 lg:pl-20">
        <RichProseSurface
          surfaceId={`${blockId}-body`}
          value={step.body || ''}
          disabled={isReadOnly}
          placeholder={t('editor.blocks.stepBodyPlaceholder')}
          onFocusSurface={onFocusSurface}
          onEditChip={onEditChip}
          onChange={body => onChangeStep({ ...step, number: displayNumber, body })}
          className="min-h-[3rem] text-base"
        />

        {!isReadOnly && active && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 font-sans border-t border-carbon/10 pt-2 text-[10px]">
            <span className="font-bold uppercase tracking-wider text-carbon/40 mr-1">{t('editor.blocks.insertInStep')}</span>
            <Button size="sm" className="font-mono" onClick={() => handleAppendBlockToStep('formula')}>{t('editor.blocks.addFormula')}</Button>
            <Button size="sm" onClick={() => setStepModalOpen(true)}>{t('editor.blocks.addStepRef')}</Button>
            <Button size="sm" onClick={() => handleAppendBlockToStep('justification')}>{t('editor.blocks.addJustification')}</Button>
            <Button size="sm" onClick={() => handleAppendBlockToStep('list')}>{t('editor.blocks.addList')}</Button>
            <Button size="sm" onClick={() => handleAppendBlockToStep('table')}>{t('editor.blocks.addTable')}</Button>
            <Button size="sm" onClick={() => handleAppendBlockToStep('note')}>{t('editor.blocks.addNote')}</Button>
            <Button size="sm" onClick={() => handleAppendBlockToStep('citation')}>{t('editor.blocks.addCitation')}</Button>
          </div>
        )}

        {active && (
          <div className="mt-3 space-y-2 border-t border-carbon/10 pt-3 font-sans">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-carbon/50">{t('editor.blocks.moment')}</span>
              {(['initial', 'auto', 'manual'] as const).map(mode => (
                <Button size="sm" aria-pressed={moment === mode} key={mode} disabled={isReadOnly || (mode === 'initial' && displayNumber !== 1)} onClick={() => {
                    if (mode === 'initial') onChangeStep({ ...step, number: displayNumber, diagramStep: 'initial' });
                    else if (mode === 'auto') {
                      const rest = { ...step };
                      delete rest.diagramStep;
                      onChangeStep({ ...rest, number: displayNumber });
                    } else onChangeStep({ ...step, number: displayNumber, diagramStep: displayNumber });
                  }}>
                  {mode === 'initial' ? t('editor.blocks.momentInitial') : mode === 'auto' ? t('editor.blocks.momentAuto') : t('editor.blocks.momentManual')}
                </Button>
              ))}
              {moment === 'manual' && (
                <input
                  className={`${controlClassName} w-28 font-mono`}
                  value={String(step.diagramStep ?? '')}
                  disabled={isReadOnly}
                  onChange={e => {
                    const v = e.target.value.trim();
                    onChangeStep({
                      ...step,
                      number: displayNumber,
                      diagramStep: v === '' ? undefined : (/^\d+$/.test(v) ? Number(v) : v),
                    });
                  }}
                  placeholder={t('editor.blocks.momentPlaceholder')}
                />
              )}
            </div>

            <div>
              <div className="mb-1 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-carbon/50">{t('editor.blocks.justifications')}</span>
                {cited.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {cited.map(id => {
                      const res = resolveJustification(id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 rounded border border-carbon/15 bg-lienzo px-2 py-0.5 text-[10px] text-carbon font-serif"
                        >
                          <span
                            className="rounded px-1 text-[7px] font-sans font-bold text-lienzo"
                            style={{ backgroundColor: res?.badgeColor || 'var(--theme-mora)' }}
                          >
                            {res?.badge || 'CONCEPTO'}
                          </span>
                          <span className="italic font-medium">{res?.title || id}</span>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[10px] italic text-carbon/50 font-serif">{t('editor.blocks.justificationDefault')}</p>
                )}
                {missingJustification && (
                  <span className="text-[10px] text-granada">{t('editor.blocks.justificationMissing')}</span>
                )}
              </div>

              <div className="mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-carbon/50 block mb-1">{t('editor.blocks.diagramHighlights')}</span>
                {diagramTargets.length === 0 ? (
                  <p className="text-[11px] italic text-carbon/45">{t('editor.blocks.noDiagramElements')}</p>
                ) : (
                  <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
                    {diagramTargets.map(target => {
                      const selected = targets.includes(target.id);
                      return (
                        <Button size="sm" className="font-mono" aria-pressed={selected} key={target.qualifiedId ?? target.id} disabled={isReadOnly} onClick={() => toggleTarget(target.id)}>
                          {target.id}{target.label ? ` (${target.label})` : ''}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ProofStepLinkModal
        isOpen={stepModalOpen}
        initialStep={Math.max(1, displayNumber - 1)}
        maxSteps={Math.max(totalSteps, displayNumber)}
        onClose={() => setStepModalOpen(false)}
        onConfirm={refStep => {
          const currentBody = step.body || '';
          const snippet = ` <ProofStepLink step={${refStep}} />`;
          onChangeStep({
            ...step,
            number: displayNumber,
            body: currentBody.trim() ? `${currentBody}${snippet}` : `<ProofStepLink step={${refStep}} />`,
          });
        }}
      />
    </article>
  );
}
