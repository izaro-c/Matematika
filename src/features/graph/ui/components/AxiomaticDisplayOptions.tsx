import type { CSSProperties } from 'react';
import { CONTENT_TYPE_COLORS } from '@/shared/design/contentTypeColors';

const NODE_TYPES = ['teorema', 'axioma', 'concepto', 'definicion', 'corolario', 'modelo', 'lema'] as const;

interface AxiomaticDisplayOptionsProps {
  visibleTypes: Set<string>;
  onToggleType: (type: string) => void;
  typeLabel: Record<string, string>;
  typeColors: Record<string, string>;
}

export function AxiomaticDisplayOptions({
  visibleTypes,
  onToggleType,
  typeLabel,
  typeColors,
}: AxiomaticDisplayOptionsProps) {
  return (
    <div>
      <section aria-labelledby="visible-layers-title">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="visible-layers-title" className="font-serif text-base font-semibold text-carbon">
              Capas visibles
            </h2>
            <p className="mt-1 font-sans text-[10px] leading-relaxed text-carbon/60">
              Estos controles solo cambian la vista, no la validez lógica.
            </p>
          </div>
          <span className="shrink-0 font-sans text-[9px] tabular-nums text-carbon/50">
            {visibleTypes.size}/{NODE_TYPES.length}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
          {NODE_TYPES.map(type => {
            const isVisible = visibleTypes.has(type);
            const color = typeColors[type] ?? CONTENT_TYPE_COLORS.matematico.cssVar;
            const style = { '--node-filter-color': color } as CSSProperties;

            return (
              <button
                key={type}
                type="button"
                aria-pressed={isVisible}
                onClick={() => onToggleType(type)}
                style={style}
                className={`flex min-h-10 items-center gap-2 border-b px-0.5 text-left font-sans text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terracota ${
                  isVisible
                    ? 'border-carbon/15 text-carbon'
                    : 'border-carbon/10 text-carbon/40 hover:text-carbon/65'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-3.5 shrink-0 items-center justify-center rounded-sm border ${isVisible ? 'bg-[var(--node-filter-color)]' : 'bg-transparent'}`}
                  style={{ borderColor: color }}
                >
                  {isVisible && <span className="text-[8px] leading-none text-lienzo">✓</span>}
                </span>
                <span className="truncate">{typeLabel[type] || type}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="my-6 border-t border-carbon/10" />

      <section aria-labelledby="graph-reading-title">
        <h2 id="graph-reading-title" className="font-serif text-base font-semibold text-carbon">
          Cómo se lee
        </h2>
        <p className="mt-1 font-sans text-[10px] leading-relaxed text-carbon/60">
          El sentido de la flecha expresa necesidad lógica, no orden de lectura.
        </p>

        <div className="my-4 flex items-center gap-3" aria-label="A es necesario para B">
          <span className="flex size-7 items-center justify-center rounded-full border border-pavo bg-pavo/10 font-serif text-[10px] text-carbon">A</span>
          <svg aria-hidden="true" viewBox="0 0 88 16" className="h-4 min-w-0 flex-1 text-carbon/55">
            <path d="M1 8H82" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M76 3L83 8L76 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex size-7 items-center justify-center rounded-full border border-terracota bg-terracota/10 font-serif text-[10px] text-carbon">B</span>
          <span className="font-serif text-[10px] leading-tight text-carbon/65">A es necesario<br />para obtener B</span>
        </div>

        <div className="space-y-3 border-y border-carbon/10 py-3">
          <div className="grid grid-cols-[2.25rem_1fr] items-center gap-2.5 font-sans text-[10px] leading-snug text-carbon/65">
            <span aria-hidden="true" className="block h-[2px] w-8 bg-carbon/55" />
            <span>El origen es un axioma u otro resultado.</span>
            <span aria-hidden="true" className="block h-[2px] w-8 bg-[repeating-linear-gradient(90deg,var(--theme-carbon)_0,var(--theme-carbon)_4px,transparent_4px,transparent_8px)] opacity-55" />
            <span>El origen es un lema.</span>
            <span aria-hidden="true" className="block h-[2px] w-8 bg-[repeating-linear-gradient(90deg,var(--theme-carbon)_0,var(--theme-carbon)_2px,transparent_2px,transparent_5px)] opacity-55" />
            <span>El origen es una definición.</span>
            <span aria-hidden="true" className="block h-[2.5px] w-8 bg-pavo" />
            <span>El origen es un concepto primitivo.</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="graph-states-title" className="mt-5">
        <h2 id="graph-states-title" className="font-serif text-sm font-semibold text-carbon">
          Estados del grafo
        </h2>
        <div className="mt-3 space-y-3 font-sans text-[10px] leading-relaxed text-carbon/65">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-full bg-salvia shadow-sm" />
            <p><strong className="font-semibold text-carbon">Color pleno:</strong> el nodo sigue siendo válido con la base actual.</p>
          </div>
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-full bg-salvia opacity-25" />
            <p><strong className="font-semibold text-carbon">Atenuado:</strong> ya no se deriva de los axiomas activos.</p>
          </div>
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-full border-[3px] border-carbon bg-lienzo" />
            <p><strong className="font-semibold text-carbon">Borde marcado:</strong> es el nodo seleccionado; su cadena lógica queda destacada.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
