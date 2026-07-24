import type { CSSProperties } from 'react';
import { CONTENT_TYPE_COLORS } from '@/shared/design/contentTypeColors';
import { getAxiomGroup } from '../../lib/graphUtils';

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

function groupAxioms(axioms: AxiomOption[]): AxiomGroup[] {
  const groups = new Map<string, AxiomGroup>();
  const groupOrder = ['Incidencia', 'Orden', 'Congruencia', 'Paralelas', 'Continuidad'];

  for (const axiom of axioms) {
    const presentation = getAxiomGroup(axiom.id);
    const isContinuityAxiom = axiom.id === 'axioma-arquimedes' || axiom.id === 'axioma-completitud';
    const label = axiom.axiomFamily
      ?? presentation?.label
      ?? (isContinuityAxiom ? 'Continuidad' : 'Otros axiomas');
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
    return left.label.localeCompare(right.label, 'es');
  });
}

function formatAlternativeGroup(groupId: string): string {
  const words = groupId.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function AxiomaticAxiomPicker({
  axioms,
  disabledAxioms,
  baselineAxiomIds,
  onToggle,
  onRestoreBaseline,
  onDeactivateAll,
}: AxiomaticAxiomPickerProps) {
  const activeCount = axioms.length - disabledAxioms.size;
  const groups = groupAxioms(axioms);
  const activeAxiomIds = new Set(axioms.filter((axiom) => !disabledAxioms.has(axiom.id)).map((axiom) => axiom.id));
  const baselineIds = new Set(baselineAxiomIds);
  const isBaselineActive = activeAxiomIds.size === baselineIds.size
    && [...activeAxiomIds].every((id) => baselineIds.has(id));

  return (
    <section aria-labelledby="axiom-picker-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="axiom-picker-title" className="font-serif text-base font-semibold text-carbon">
            Ajuste axiomático
          </h2>
          <p className="mt-1 font-sans text-[10px] leading-relaxed text-carbon/60">
            Las alternativas incompatibles se eligen por separado.
          </p>
        </div>
        <span className="shrink-0 font-sans text-[9px] tabular-nums text-carbon/50">
          {activeCount}/{axioms.length}
        </span>
      </div>

      <div className="mt-3 flex gap-4 border-y border-carbon/10 py-2">
        <button
          type="button"
          onClick={onRestoreBaseline}
          disabled={isBaselineActive}
          className="font-sans text-[10px] font-semibold text-terracota transition-colors hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota disabled:cursor-default disabled:text-carbon/30"
        >
          Restaurar base neutral
        </button>
        <button
          type="button"
          onClick={onDeactivateAll}
          disabled={activeCount === 0}
          className="font-sans text-[10px] font-semibold text-carbon/55 transition-colors hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota disabled:cursor-default disabled:text-carbon/30"
        >
          Vaciar base
        </button>
      </div>

      <div className="mt-2">
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
            <details key={group.label} className="group border-b border-carbon/10" style={groupStyle}>
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 py-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terracota [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[var(--axiom-group-color)]" />
                <span className="min-w-0 flex-1 font-serif text-xs font-semibold text-carbon">{group.label}</span>
                <span className="font-sans text-[9px] tabular-nums text-carbon/45">
                  {groupActiveCount}/{group.axioms.length}
                </span>
                <span aria-hidden="true" className="text-xs text-carbon/40 transition-transform group-open:rotate-180">⌄</span>
              </summary>

              <fieldset className="pb-2 pl-4">
                <legend className="sr-only">Axiomas de {group.label}</legend>
                {independentAxioms.map(axiom => {
                  const isActive = !disabledAxioms.has(axiom.id);
                  return (
                    <label
                      key={axiom.id}
                      className={`flex min-h-10 cursor-pointer items-start gap-2.5 border-l-2 px-2 py-2 transition-colors ${
                        isActive
                          ? 'border-[var(--axiom-group-color)] bg-[color-mix(in_srgb,var(--axiom-group-color)_7%,transparent)] text-carbon'
                          : 'border-transparent text-carbon/55 hover:bg-carbon/[0.025] hover:text-carbon'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => onToggle(axiom.id)}
                        className="mt-0.5 size-3.5 shrink-0 cursor-pointer"
                        style={{ accentColor: group.color }}
                      />
                      <span className="font-serif text-[11px] leading-tight">{axiom.title}</span>
                    </label>
                  );
                })}
                {[...alternatives.entries()].map(([alternativeGroup, options]) => {
                  const activeOptions = options.filter((axiom) => !disabledAxioms.has(axiom.id));
                  return (
                    <div key={alternativeGroup} role="group" aria-label={formatAlternativeGroup(alternativeGroup)}>
                      {showAlternativeLabels && (
                        <p className="ac-label ac-label--2xs ac-label--soft px-2 pb-1 pt-2 block">
                          {formatAlternativeGroup(alternativeGroup)}
                        </p>
                      )}
                      <label
                        className={`flex min-h-10 cursor-pointer items-start gap-2.5 border-l-2 px-2 py-2 transition-colors ${
                          activeOptions.length === 0
                            ? 'border-[var(--axiom-group-color)] bg-[color-mix(in_srgb,var(--axiom-group-color)_7%,transparent)] text-carbon'
                            : 'border-transparent text-carbon/55 hover:bg-carbon/[0.025] hover:text-carbon'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`axiom-alternative-${alternativeGroup}`}
                          checked={activeOptions.length === 0}
                          onChange={() => {
                            for (const axiom of activeOptions) onToggle(axiom.id);
                          }}
                          className="mt-0.5 size-3.5 shrink-0 cursor-pointer"
                          style={{ accentColor: group.color }}
                        />
                        <span className="font-serif text-[11px] leading-tight">Ninguno — sin decidir</span>
                      </label>
                      {options.map((axiom) => {
                        const isActive = !disabledAxioms.has(axiom.id);
                        return (
                          <label
                            key={axiom.id}
                            className={`flex min-h-10 cursor-pointer items-start gap-2.5 border-l-2 px-2 py-2 transition-colors ${
                              isActive
                                ? 'border-[var(--axiom-group-color)] bg-[color-mix(in_srgb,var(--axiom-group-color)_7%,transparent)] text-carbon'
                                : 'border-transparent text-carbon/55 hover:bg-carbon/[0.025] hover:text-carbon'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`axiom-alternative-${alternativeGroup}`}
                              checked={isActive}
                              onChange={() => onToggle(axiom.id)}
                              className="mt-0.5 size-3.5 shrink-0 cursor-pointer"
                              style={{ accentColor: group.color }}
                            />
                            <span className="font-serif text-[11px] leading-tight">{axiom.title}</span>
                          </label>
                        );
                      })}
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
