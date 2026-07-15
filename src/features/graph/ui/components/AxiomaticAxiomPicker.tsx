import type { CSSProperties } from 'react';
import { CONTENT_TYPE_COLORS } from '@/shared/design/contentTypeColors';
import { getAxiomGroup } from '../../lib/graphUtils';

export interface AxiomOption {
  id: string;
  title: string;
}

interface AxiomaticAxiomPickerProps {
  axioms: AxiomOption[];
  disabledAxioms: Set<string>;
  onToggle: (id: string) => void;
  onActivateAll: () => void;
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
    const label = presentation?.label ?? (isContinuityAxiom ? 'Continuidad' : 'Otros axiomas');
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
    return (leftIndex < 0 ? groupOrder.length : leftIndex)
      - (rightIndex < 0 ? groupOrder.length : rightIndex);
  });
}

export function AxiomaticAxiomPicker({
  axioms,
  disabledAxioms,
  onToggle,
  onActivateAll,
  onDeactivateAll,
}: AxiomaticAxiomPickerProps) {
  const activeCount = axioms.length - disabledAxioms.size;
  const groups = groupAxioms(axioms);

  return (
    <section aria-labelledby="axiom-picker-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="axiom-picker-title" className="font-serif text-base font-semibold text-carbon">
            Ajuste axiomático
          </h2>
          <p className="mt-1 font-sans text-[10px] leading-relaxed text-carbon/60">
            Se puede afinar la base por familias.
          </p>
        </div>
        <span className="shrink-0 font-sans text-[9px] tabular-nums text-carbon/50">
          {activeCount}/{axioms.length}
        </span>
      </div>

      <div className="mt-3 flex gap-4 border-y border-carbon/10 py-2">
        <button
          type="button"
          onClick={onActivateAll}
          disabled={activeCount === axioms.length}
          className="font-sans text-[10px] font-semibold text-terracota transition-colors hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota disabled:cursor-default disabled:text-carbon/30"
        >
          Activar todos
        </button>
        <button
          type="button"
          onClick={onDeactivateAll}
          disabled={activeCount === 0}
          className="font-sans text-[10px] font-semibold text-carbon/55 transition-colors hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota disabled:cursor-default disabled:text-carbon/30"
        >
          Desactivar todos
        </button>
      </div>

      <div className="mt-2">
        {groups.map(group => {
          const groupActiveCount = group.axioms.filter(axiom => !disabledAxioms.has(axiom.id)).length;
          const groupStyle = { '--axiom-group-color': group.color } as CSSProperties;

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
                {group.axioms.map(axiom => {
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
              </fieldset>
            </details>
          );
        })}
      </div>
    </section>
  );
}
