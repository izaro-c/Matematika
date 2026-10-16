import type { CSSProperties } from 'react';
import type { ModelInfo, SystemInfo } from '@/data/graph/graphTypes';
import { useI18n } from '@/i18n';

interface AxiomaticUniversePickerProps {
  systems: SystemInfo[];
  inactiveSystems: string[];
  onToggleSystem: (id: string) => void;
  models: ModelInfo[];
  inactiveModels: string[];
  onToggleModel: (id: string) => void;
}

interface FrameworkIndexProps<T extends ModelInfo | SystemInfo> {
  label: string;
  options: T[];
  activeId?: string;
  color: string;
  onSelect: (id: string) => void;
}

/** Sistemas y modelos comparten `name`: elegir uno descarta el resto, como en un índice. */
const FRAMEWORK_RADIO_NAME = 'axiomatic-framework';

function FrameworkIndex<T extends ModelInfo | SystemInfo>({
  label,
  options,
  activeId,
  color,
  onSelect,
}: FrameworkIndexProps<T>) {
  const { t } = useI18n();
  const style = { '--framework-color': color } as CSSProperties;

  return (
    <fieldset style={style}>
      <legend className="ac-rubric mb-1 text-[13px]">{label}</legend>
      <ul>
        {options.map(option => {
          const isSelected = option.id === activeId;
          return (
            <li key={option.id}>
              <label
                className={`group/option flex min-h-8 cursor-pointer items-baseline gap-1.5 py-0.5 font-serif text-[15px] leading-snug transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracota ${
                  isSelected ? 'font-semibold text-ink' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {/* onClick (no onChange): volver a pulsar el marco activo lo reaplica tras ajustes manuales. */}
                <input
                  type="radio"
                  name={FRAMEWORK_RADIO_NAME}
                  checked={isSelected}
                  readOnly
                  onClick={() => onSelect(option.id)}
                  className="sr-only"
                />
                <span aria-hidden="true" className="w-4 shrink-0 font-normal text-[var(--framework-color)]">
                  {isSelected ? '☞' : ''}
                </span>
                <span className="min-w-0">{option.title}</span>
                <span aria-hidden="true" className="mx-1 min-w-4 flex-1 self-end border-b border-dotted border-carbon/30 mb-[0.4em]" />
                <span className="shrink-0 font-normal text-[13px] text-ink-subtle [font-variant-numeric:oldstyle-nums]">
                  {option.axioms.length}
                  <span className="sr-only"> {t('graph', 'axAbbr')}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export function AxiomaticUniversePicker({
  systems,
  inactiveSystems,
  onToggleSystem,
  models,
  inactiveModels,
  onToggleModel,
}: AxiomaticUniversePickerProps) {
  const { t } = useI18n();
  const activeSystem = systems.find(system => !inactiveSystems.includes(system.id));
  const activeModel = models.find(model => !inactiveModels.includes(model.id));

  return (
    <section aria-labelledby="framework-picker-title">
      <h2 id="framework-picker-title" className="text-lg leading-tight text-ink">
        {t('graph', 'startFromFramework')}
      </h2>
      <p className="mt-1 font-serif text-[13px] italic leading-snug text-ink-muted">
        {t('graph', 'frameworkChoiceHint')}
      </p>

      <div className="mt-4 space-y-4">
        <FrameworkIndex
          label={t('graph', 'axiomaticSystem')}
          options={systems}
          activeId={activeSystem?.id}
          color="var(--theme-terracota)"
          onSelect={onToggleSystem}
        />
        <FrameworkIndex
          label={t('graph', 'concreteModel')}
          options={models}
          activeId={activeModel?.id}
          color="var(--theme-pavo)"
          onSelect={onToggleModel}
        />
      </div>
    </section>
  );
}
