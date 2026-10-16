import type { CSSProperties } from 'react';
import { CONTENT_TYPE_COLORS } from '@/design/contentTypeColors';
import { getAxiomGroup } from '../../lib/graphUtils';
import { useI18n, getLanguage } from '@/i18n';

export interface AxiomOption {
  id: string;
  title: string;
  axiomFamily?: string;
  alternativeGroup?: string;
}

interface AxiomaticAxiomPickerProps {
  axioms: AxiomOption[];
  disabledAxioms: Set<string>;
  baselineAxiomIds: string[];
  onToggle: (id: string) => void;
  onRestoreBaseline: () => void;
  onDeactivateAll: () => void;
}

interface AxiomGroup {
  label: string;
  color: string;
  axioms: AxiomOption[];
}

function groupAxioms(axioms: AxiomOption[], lang?: string): AxiomGroup[] {
  const groups = new Map<string, AxiomGroup>();
  const dict = getLanguage(lang).dictionary.axiomFamilies;
  const groupOrder = [dict.incidencia, dict.orden, dict.congruencia, dict.paralelas, dict.continuidad];

  for (const axiom of axioms) {
    const presentation = getAxiomGroup(axiom.id, lang);
    const familyKey = axiom.axiomFamily ? (axiom.axiomFamily.toLowerCase() as keyof typeof dict) : undefined;
    const label =
      (familyKey && dict[familyKey])
      ?? axiom.axiomFamily
      ?? presentation?.label
      ?? (presentation?.familyKey === 'continuidad' ? dict.continuidad : dict.otros);
    const group = groups.get(label) ?? {
      label,
      color: presentation?.color ?? CONTENT_TYPE_COLORS.axioma.cssVar,
      axioms: [],
    };
    group.axioms.push(axiom);
    groups.set(label, group);
  }

  return [...groups.values()].sort((left, right) => {
    const leftIndex = groupOrder.indexOf(left.label);
    const rightIndex = groupOrder.indexOf(right.label);
    if (leftIndex >= 0 && rightIndex >= 0) return leftIndex - rightIndex;
    if (leftIndex >= 0) return -1;
    if (rightIndex >= 0) return 1;
    return left.label.localeCompare(right.label, lang ?? 'es');
  });
}

function formatAlternativeGroup(groupId: string): string {
  const words = groupId.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Casilla dibujada a tinta: filete del color de la familia; marcada, se rellena dejando un margen de papel. */
const INK_INPUT_CLASS = 'mt-[0.2em] size-3.5 shrink-0 cursor-pointer appearance-none border border-[color-mix(in_srgb,var(--axiom-group-color)_70%,var(--theme-carbon))] bg-transparent checked:bg-[var(--axiom-group-color)] checked:shadow-[inset_0_0_0_2px_var(--axiomatic-panel-bg,var(--theme-lienzo))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota';

interface AxiomChoiceProps {
  type: 'checkbox' | 'radio';
  name?: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function AxiomChoice({ type, name, label, checked, onChange }: AxiomChoiceProps) {
  return (
    <label
      className={`flex min-h-9 cursor-pointer items-start gap-2.5 py-1 font-serif text-[14px] leading-snug transition-colors ${
        checked ? 'text-ink' : 'italic text-ink-subtle hover:text-ink-muted'
      }`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className={`${INK_INPUT_CLASS} ${type === 'radio' ? 'rounded-full' : ''}`}
      />
      <span>{label}</span>
    </label>
  );
}

const TEXT_ACTION_CLASS = 'ac-rubric whitespace-nowrap text-left text-[13px] text-terracota transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota disabled:cursor-default disabled:text-ink-subtle disabled:opacity-60';

export function AxiomaticAxiomPicker({
  axioms,
  disabledAxioms,
  baselineAxiomIds,
  onToggle,
  onRestoreBaseline,
  onDeactivateAll,
}: AxiomaticAxiomPickerProps) {
  const { t, lang } = useI18n();
  const activeCount = axioms.length - disabledAxioms.size;
  const groups = groupAxioms(axioms, lang);
  const activeAxiomIds = new Set(axioms.filter((axiom) => !disabledAxioms.has(axiom.id)).map((axiom) => axiom.id));
  const baselineIds = new Set(baselineAxiomIds);
  const isBaselineActive = activeAxiomIds.size === baselineIds.size
    && [...activeAxiomIds].every((id) => baselineIds.has(id));

  return (
    <section aria-labelledby="axiom-picker-title">
      <h2 id="axiom-picker-title" className="text-lg leading-tight text-ink">
        {t('graph', 'axiomaticAdjustment')}
      </h2>

      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <button type="button" onClick={onRestoreBaseline} disabled={isBaselineActive} className={TEXT_ACTION_CLASS}>
          {t('graph', 'restoreNeutralBase')}
        </button>
        <button type="button" onClick={onDeactivateAll} disabled={activeCount === 0} className={TEXT_ACTION_CLASS}>
          {t('graph', 'clearBase')}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {groups.map(group => {
          const groupActiveCount = group.axioms.filter(axiom => !disabledAxioms.has(axiom.id)).length;
          const groupStyle = { '--axiom-group-color': group.color } as CSSProperties;
          const independentAxioms = group.axioms.filter((axiom) => !axiom.alternativeGroup);
          const alternatives = new Map<string, AxiomOption[]>();
          for (const axiom of group.axioms) {
            if (!axiom.alternativeGroup) continue;
            const options = alternatives.get(axiom.alternativeGroup) ?? [];
            options.push(axiom);
            alternatives.set(axiom.alternativeGroup, options);
          }
          const showAlternativeLabels = independentAxioms.length > 0 || alternatives.size > 1;
          return (
            <details key={group.label} open className="group" style={groupStyle}>
              <summary className="flex min-h-9 cursor-pointer list-none items-baseline gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="w-3 shrink-0 text-[10px] text-ink-subtle transition-transform group-open:rotate-90">▸</span>
                <span className="ac-rubric min-w-0 flex-1 text-[15px] [--ac-rubric-color:color-mix(in_srgb,var(--axiom-group-color)_72%,var(--theme-carbon))]">
                  {group.label}
                </span>
                <span className="font-serif text-[13px] text-ink-subtle [font-variant-numeric:oldstyle-nums]">
                  {groupActiveCount}/{group.axioms.length}
                </span>
              </summary>

              <fieldset className="pb-1 pl-5">
                <legend className="sr-only">{t('graph', 'axiomsOf', { group: group.label })}</legend>
                {independentAxioms.map(axiom => (
                  <AxiomChoice
                    key={axiom.id}
                    type="checkbox"
                    label={axiom.title}
                    checked={!disabledAxioms.has(axiom.id)}
                    onChange={() => onToggle(axiom.id)}
                  />
                ))}
                {[...alternatives.entries()].map(([alternativeGroup, options]) => {
                  const activeOptions = options.filter((axiom) => !disabledAxioms.has(axiom.id));
                  const radioName = `axiom-alternative-${alternativeGroup}`;
                  return (
                    <div key={alternativeGroup} role="group" aria-label={formatAlternativeGroup(alternativeGroup)}>
                      {showAlternativeLabels && (
                        <p className="pb-0.5 pt-2 font-serif text-[13px] italic text-ink-muted">
                          {formatAlternativeGroup(alternativeGroup)}
                        </p>
                      )}
                      <AxiomChoice
                        type="radio"
                        name={radioName}
                        label={t('graph', 'noneUndecided')}
                        checked={activeOptions.length === 0}
                        onChange={() => {
                          for (const axiom of activeOptions) onToggle(axiom.id);
                        }}
                      />
                      {options.map((axiom) => (
                        <AxiomChoice
                          key={axiom.id}
                          type="radio"
                          name={radioName}
                          label={axiom.title}
                          checked={!disabledAxioms.has(axiom.id)}
                          onChange={() => onToggle(axiom.id)}
                        />
                      ))}
                    </div>
                  );
                })}
              </fieldset>
            </details>
          );
        })}
      </div>
    </section>
  );
}
