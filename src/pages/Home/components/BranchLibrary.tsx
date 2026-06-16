import { Link } from 'wouter';
import { db } from '../../../store/content';
import { useProgressStore } from '../../../store/UserProgressStore';

const BRANCHES = [
  {
    id: 'Geometría',
    roman: 'I',
    accent: '#C86446',
    desc: 'Estudio formal de las propiedades métricas y topológicas del espacio.',
    icon: '△',
  },
  {
    id: 'Lógica',
    roman: 'II',
    accent: '#A2C2A2',
    desc: 'Formalización de los sistemas deductivos y reglas de inferencia.',
    icon: '⊢',
  },
  {
    id: 'Análisis',
    roman: 'III',
    accent: '#5D7080',
    desc: 'Estudio del cambio continuo, los límites y las convergencias infinitas.',
    icon: '∫',
  },
  {
    id: 'Álgebra',
    roman: 'IV',
    accent: '#333333',
    desc: 'Abstracción de las operaciones y estructuras sobre conjuntos y espacios.',
    icon: '⊕',
  },
  {
    id: 'Probabilidad',
    roman: 'V',
    accent: '#c49b4f',
    desc: 'Tratamiento axiomático de los fenómenos aleatorios y la incertidumbre.',
    icon: '∑',
  },
];

function itemHref(entry: { type: string; item: { slug?: string; id?: string } }): string {
  if (entry.type === 'lesson') return `/${entry.item.slug}`;
  if (entry.type === 'theorem') return `/teorema/${entry.item.id}`;
  if (entry.type === 'definition') return `/definicion/${entry.item.id}`;
  return '/';
}

const TYPE_LABELS: Record<string, string> = {
  lesson: 'Lección',
  theorem: 'Teorema',
  definition: 'Definición',
};

/**
 * Componente que muestra el catálogo principal de Ramas Matemáticas en la página de inicio.
 * Cada rama lista una muestra de sus conceptos, teoremas y lecciones extraídos
 * del `ContentStore`, junto con el progreso del usuario.
 */
export const BranchLibrary = () => {
  const { readConcepts, completedExercises } = useProgressStore();

  return (
    <main className="max-w-5xl mx-auto px-8 py-16">
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10 border-b border-carbon/15 pb-4">
        <div className="flex items-baseline gap-4">
          <h2 className="text-2xl text-carbon" style={{ fontVariant: 'small-caps' }}>Biblioteca de Ramas</h2>
          <span className="text-xs text-carbon/40 uppercase tracking-widest font-sans">
            {BRANCHES.length} ramas · {db.getAllDefinitions().length + db.theorems.size} entradas
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-sans tracking-widest uppercase text-carbon/60 bg-carbon/5 px-4 py-2 rounded">
          <span>Leídos: <strong className="text-[#2a6a2a]">{readConcepts.length}</strong></span>
          <span>·</span>
          <span>Ejercicios: <strong className="text-[#2a6a2a]">{completedExercises.length}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {BRANCHES.map((branch) => {
          const items = db.getItemsByBranch(branch.id);
          const displayItems = items.slice(0, 5);
          const hasMore = items.length > 5;

          return (
            <article
              key={branch.id}
              className="group elegant-panel relative flex flex-col overflow-hidden cursor-pointer"
            >
              <div className="h-3 w-full border-b border-carbon/20" style={{ backgroundColor: branch.accent }} />
              <div className="absolute top-3 left-0 right-0 h-[1px] bg-carbon/10 pointer-events-none" />

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold mb-1"
                      style={{ color: branch.accent }}
                    >
                      Tomo {branch.roman}
                    </div>
                    <Link href={`/rama/${branch.id.toLowerCase()}`}>
                      <a
                        className="block text-2xl text-carbon leading-none transition-colors hover:underline decoration-1 underline-offset-4"
                        style={{ fontVariant: 'small-caps' }}
                      >
                        {branch.id}
                      </a>
                    </Link>
                  </div>
                  <span
                    className="text-5xl font-serif opacity-10 leading-none select-none group-hover:opacity-20 transition-opacity"
                    style={{ color: branch.accent }}
                  >
                    {branch.icon}
                  </span>
                </div>

                <p
                  className="text-sm italic text-carbon/60 leading-relaxed mb-5 pl-3"
                  style={{ borderLeft: `2px solid ${branch.accent}40` }}
                >
                  {branch.desc}
                </p>

                <div className="mt-auto border-t border-carbon/10 pt-3 flex flex-col gap-0">
                  {displayItems.length > 0 ? (
                    displayItems.map((entry, idx) => (
                      <Link key={idx} href={itemHref(entry)}>
                        <a className="flex items-center justify-between py-1.5 group/row hover:bg-carbon/[0.02] -mx-2 px-2 rounded transition-colors">
                          <span className="text-sm text-carbon/80 group-hover/row:text-carbon font-medium flex items-center gap-2">
                            <span className="text-carbon/30 text-xs">§</span>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(entry.item as any).title || entry.item.id}
                          </span>
                          <span
                            className="text-[9px] uppercase tracking-wider font-sans px-1.5 py-0.5 rounded"
                            style={{ color: branch.accent, backgroundColor: `${branch.accent}15` }}
                          >
                            {TYPE_LABELS[entry.type] || entry.type}
                          </span>
                        </a>
                      </Link>
                    ))
                  ) : (
                    <div className="py-3 text-center">
                      <span className="text-[10px] uppercase tracking-widest text-carbon/30 font-sans">En Preparación</span>
                    </div>
                  )}

                  {hasMore && (
                    <Link href={`/rama/${branch.id.toLowerCase()}`}>
                      <a
                        className="mt-2 py-1.5 text-center text-xs font-sans tracking-widest uppercase transition-colors hover:underline"
                        style={{ color: branch.accent }}
                      >
                        Ver {items.length - 5} entradas más →
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        <article className="relative border border-dashed border-carbon/30 bg-carbon/[0.02] flex flex-col items-center justify-center p-10 text-center min-h-[200px] opacity-70 rounded-[2px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.02)] transition-colors hover:bg-carbon/[0.04] cursor-help">
          <span className="text-4xl text-carbon/40 mb-3 font-serif">+</span>
          <span className="text-xs uppercase tracking-widest text-carbon/50 font-sans font-bold">Nuevas ramas en expansión</span>
        </article>
      </div>
    </main>
  );
};
