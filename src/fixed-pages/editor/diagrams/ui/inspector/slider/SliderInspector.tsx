import React from 'react';
import { AccordionSection } from '../accordion';
import { InspectorHeader } from '../WorkbenchInspectorHeader';
import { PALETTE_TOKENS } from '../paletteTokens';
import type { SliderPanelProps } from '../types';
import { omitKeys, type DiagramControlAction, type DiagramControlEasing, type DiagramControlEffect } from '@/diagrams/model';
import { handleRenameId } from '../utils';
import { modelSliders } from '@/fixed-pages/editor/diagrams/model';
import { parseOptionalNumber } from '../../workbenchSelection';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';

export const SliderInspector: React.FC<SliderPanelProps & {
  openAccordion: Record<string, boolean>;
  onToggleAccordion: (sec: string) => void;
}> = ({
  model,
  slider,
  onUpdateSlider,
  onDeleteSelected,
  onUpdateModel,
  onSelectId,
  openAccordion,
  onToggleAccordion,
}) => {
  const { t } = useI18n();
  const colorToken = PALETTE_TOKENS.find(c => c.id === slider.color) || PALETTE_TOKENS[5];
  const isButton = slider.variant === 'button';
  const action: DiagramControlAction = slider.action ?? defaultControlAction(slider);
  const otherControls = modelSliders(model).filter(item => item.id !== slider.id);
  const updateAction = (update: Partial<DiagramControlAction>) => onUpdateSlider(slider.id, { action: { ...action, ...update } });
  const setVariant = (variant: 'slider' | 'button') => onUpdateSlider(slider.id, current => {
    if (variant === 'button') return { ...current, variant, action };
    return { ...omitKeys(current, 'action'), variant };
  });
  const updateRange = (update: Partial<typeof slider.range>) => onUpdateSlider(slider.id, current => ({ ...current, range: { ...current.range, ...update } }));
  const effects = action.effects ?? [];
  const setEffects = (next: DiagramControlEffect[]) => updateAction({ effects: next.length > 0 ? next : undefined });
  const updateEffect = (index: number, update: Partial<DiagramControlEffect>) => setEffects(effects.map((effect, effectIndex) => {
    if (effectIndex !== index) return effect;
    const merged = { ...effect, ...update };
    if (!merged.from) delete merged.from;
    if (!merged.when) delete merged.when;
    return merged;
  }));

  return (
    <div className="p-3 space-y-3 text-xs font-serif text-carbon">
      <InspectorHeader
        title={isButton ? t('editor.diagramInspector.buttonTitle', { id: slider.id }) : t('editor.diagramInspector.sliderTitle', { id: slider.id })}
        colorClass={colorToken.bgClass}
        onDelete={() => onDeleteSelected(slider.id)}
      />

      <AccordionSection sec="identity" title={t('editor.diagramInspector.identityAndName')} isOpen={openAccordion.identity} onToggle={onToggleAccordion}>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              {t('editor.diagramInspector.identifierId')}
            </label>
            <input
              type="text"
              defaultValue={slider.id}
              key={`id-input-${slider.id}`}
              onBlur={e => handleRenameId(model, slider.id, e.target.value, onUpdateModel, onSelectId)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRenameId(model, slider.id, e.currentTarget.value, onUpdateModel, onSelectId);
              }}
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              {t('editor.diagramInspector.parameterName')}
            </label>
            <input
              type="text"
              value={slider.label || ''}
              onChange={e => onUpdateSlider(slider.id, { label: e.target.value })}
              placeholder={t('editor.diagramInspector.parameterNamePlaceholder')}
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection sec="behavior" title={t('editor.diagramInspector.controlType')} isOpen={openAccordion.behavior} onToggle={onToggleAccordion}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-carbon/15 bg-lienzo p-1">
            {(['slider', 'button'] as const).map(variant => (
              <button
                key={variant}
                type="button"
                aria-pressed={slider.variant === variant}
                onClick={() => setVariant(variant)}
                className={`rounded-md px-2 py-1 text-xs font-bold transition-colors ${slider.variant === variant ? 'bg-canela/15 text-canela' : 'text-carbon/60 hover:text-carbon'}`}
              >
                {variant === 'slider' ? t('editor.diagramInspector.slider') : t('editor.diagramInspector.animatedButton')}
              </button>
            ))}
          </div>
          {isButton ? (
            <div className="space-y-3">
              <p className="text-[11px] leading-snug text-carbon/60">
                {renderRichText(t('editor.diagramInspector.buttonSliderHelp', { min: slider.range.min, id: slider.id }), { code: c => <span className="font-mono">{c}</span> })}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">{t('editor.diagramInspector.target')}</label>
                  <input
                    type="number"
                    step={slider.range.step ?? 0.1}
                    value={action.to}
                    onChange={e => updateAction({ to: parseOptionalNumber(e.target.value, action.to) })}
                    className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">{t('editor.diagramInspector.durationMs')}</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    max="60000"
                    value={action.durationMs}
                    onChange={e => updateAction({ durationMs: Math.max(0, Math.min(60000, Math.round(parseOptionalNumber(e.target.value, action.durationMs)))) })}
                    className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">{t('editor.diagramInspector.returnMs')}</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    max="60000"
                    placeholder={String(action.durationMs)}
                    value={action.returnDurationMs ?? ''}
                    onChange={e => {
                      const raw = e.target.value.trim();
                      if (!raw) {
                        const next = { ...action };
                        delete next.returnDurationMs;
                        onUpdateSlider(slider.id, { action: next });
                        return;
                      }
                      updateAction({ returnDurationMs: Math.max(0, Math.min(60000, Math.round(parseOptionalNumber(raw, action.durationMs)))) });
                    }}
                    className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">{t('editor.diagramInspector.curve')}</label>
                  <select
                    value={action.easing}
                    onChange={e => updateAction({ easing: e.target.value as DiagramControlEasing })}
                    className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs focus:border-canela focus:outline-none"
                  >
                    <option value="linear">{t('editor.diagramInspector.linearTime')}</option>
                    <option value="ease-in">{t('editor.diagramInspector.accelerated')}</option>
                    <option value="ease-out">{t('editor.diagramInspector.decelerated')}</option>
                    <option value="ease-in-out">{t('editor.diagramInspector.smooth')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">{t('editor.diagramInspector.onPressingAgain')}</label>
                  <select
                    value={action.behavior}
                    onChange={e => updateAction({ behavior: e.target.value as DiagramControlAction['behavior'] })}
                    className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs focus:border-canela focus:outline-none"
                  >
                    <option value="toggle">{t('editor.diagramInspector.returnToMinimum')}</option>
                    <option value="restart">{t('editor.diagramInspector.restartAndRepeat')}</option>
                  </select>
                </div>
              </div>
              {otherControls.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-carbon/75 tracking-tight">{t('editor.diagramInspector.effectsOnOtherControls')}</label>
                    <button
                      type="button"
                      onClick={() => setEffects([...effects, { on: 'press', control: otherControls[0].id, do: 'reset' }])}
                      className="rounded-full border border-carbon/15 px-2 py-0.5 text-[10px] font-bold text-carbon/70 hover:border-canela hover:text-canela"
                    >
                      {t('editor.diagramInspector.effect')}
                    </button>
                  </div>
                  {effects.map((effect, index) => (
                    <div key={index} className="space-y-1.5 rounded-lg border border-carbon/10 bg-lienzo p-2">
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1">
                        <select
                          aria-label={t('editor.diagramInspector.moment')}
                          value={effect.on}
                          onChange={e => updateEffect(index, { on: e.target.value as DiagramControlEffect['on'] })}
                          className="rounded border border-carbon/15 bg-lienzo px-1 py-0.5 text-[11px]"
                        >
                          <option value="press">{t('editor.diagramInspector.onPress')}</option>
                          {action.behavior === 'toggle' && <option value="release">{t('editor.diagramInspector.onDeactivation')}</option>}
                          <option value="complete">{t('editor.diagramInspector.onFinish')}</option>
                        </select>
                        <select
                          aria-label={t('editor.diagramInspector.action')}
                          value={effect.do}
                          onChange={e => updateEffect(index, { do: e.target.value as DiagramControlEffect['do'] })}
                          className="rounded border border-carbon/15 bg-lienzo px-1 py-0.5 text-[11px]"
                        >
                          <option value="reset">{t('editor.diagramInspector.reset')}</option>
                          <option value="play">{t('editor.diagramInspector.animate')}</option>
                        </select>
                        <select
                          aria-label={t('editor.diagramInspector.control')}
                          value={effect.control}
                          onChange={e => updateEffect(index, { control: e.target.value })}
                          className="rounded border border-carbon/15 bg-lienzo px-1 py-0.5 font-mono text-[11px]"
                        >
                          {otherControls.map(control => <option key={control.id} value={control.id}>{control.id}</option>)}
                        </select>
                        <button
                          type="button"
                          aria-label={t('editor.diagramInspector.deleteEffect')}
                          onClick={() => setEffects(effects.filter((_, effectIndex) => effectIndex !== index))}
                          className="px-1 text-carbon/50 hover:text-granada"
                        >
                          ×
                        </button>
                      </div>
                      {effect.do === 'play' && (
                        <input
                          type="text"
                          placeholder={t('editor.diagramInspector.effectFromExpression')}
                          defaultValue={effect.from ?? ''}
                          key={`from-${index}-${effect.from ?? ''}`}
                          onBlur={e => updateEffect(index, { from: e.target.value.trim() || undefined })}
                          className="w-full rounded border border-carbon/15 bg-lienzo px-1.5 py-0.5 font-mono text-[11px] placeholder-carbon/30"
                        />
                      )}
                      <input
                        type="text"
                        placeholder={t('editor.diagramInspector.onlyIfExpressionOptional')}
                        defaultValue={effect.when ?? ''}
                        key={`when-${index}-${effect.when ?? ''}`}
                        onBlur={e => updateEffect(index, { when: e.target.value.trim() || undefined })}
                        className="w-full rounded border border-carbon/15 bg-lienzo px-1.5 py-0.5 font-mono text-[11px] placeholder-carbon/30"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </AccordionSection>

      <AccordionSection sec="geometry" title={t('editor.diagramInspector.valueAndNumericRange')} isOpen={openAccordion.geometry} onToggle={onToggleAccordion}>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-carbon/75 tracking-tight">{t('editor.diagramInspector.currentValue')}</label>
              <span className="font-mono text-xs font-bold text-canela bg-canela/10 px-2 py-0.5 rounded border border-canela/20">{slider.value}</span>
            </div>
            <input
              type="range"
              min={slider.range.min ?? -10}
              max={slider.range.max ?? 10}
              step={slider.range.step ?? 0.1}
              value={slider.value ?? 0}
              onChange={e => onUpdateSlider(slider.id, { value: parseOptionalNumber(e.target.value, slider.value ?? 0) })}
              className="w-full cursor-pointer accent-canela"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-carbon/10">
            <div>
              <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.minimum')}
              </label>
              <input
                type="number"
                value={slider.range.min ?? -5}
                onChange={e => updateRange({ min: parseOptionalNumber(e.target.value, slider.range.min ?? -5) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.maximum')}
              </label>
              <input
                type="number"
                value={slider.range.max ?? 5}
                onChange={e => updateRange({ max: parseOptionalNumber(e.target.value, slider.range.max ?? 5) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.step')}
              </label>
              <input
                type="number"
                step="0.01"
                value={slider.range.step ?? 0.1}
                onChange={e => updateRange({ step: parseOptionalNumber(e.target.value, slider.range.step ?? 0.1) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.length')}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={slider.width ?? 2.6}
                onChange={e => onUpdateSlider(slider.id, { width: parseOptionalNumber(e.target.value, 2.6) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none"
              />
            </div>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};

function defaultControlAction(slider: SliderPanelProps['slider']): DiagramControlAction {
  return { to: slider.range.max, durationMs: 1200, easing: 'ease-in-out', behavior: 'toggle' };
}
