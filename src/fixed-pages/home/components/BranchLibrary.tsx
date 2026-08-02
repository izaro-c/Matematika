import { Link } from 'wouter';
import { db } from '@/data/content';
import { mscNames } from '@/data/content/msc2020';
import { useProgressStore } from '@/lib/stores/UserProgressStore';

interface SectionDef {
  title: string;
  slug: string;
  roman: string;
  codes: string[];
  groups: { id: string; codes: string[] }[];
  accent: string;
  desc: string;
  icon: string;
}

const SECTIONS: SectionDef[] = [
  {
    title: 'Fundamentos y Lógica',
    slug: 'fundamentos-y-logica',
    roman: 'I',
    codes: ['03', '08'],
    groups: [],
    accent: 'var(--theme-musgo)',
    desc: 'Formalización de los sistemas deductivos, teoría de la demostración y fundamentos de la matemática.',
    icon: '⊢',
  },
  {
    title: 'Álgebra y Teoría de Números',
    slug: 'algebra-y-teoria-de-numeros',
    roman: 'II',
    codes: ['11', '15', '14', '12', '13', '18', '20'],
    groups: [
      { id: 'geometria-algebraica', codes: ['14'] },
      { id: 'algebra-abstracta', codes: ['12', '13'] },
      { id: 'teoria-de-grupos-y-categorias', codes: ['18', '20'] },
    ],
    accent: 'var(--theme-carbon)',
    desc: 'Abstracción de las operaciones y estructuras algebraicas sobre conjuntos y espacios.',
    icon: '⊕',
  },
  {
    title: 'Análisis Matemático',
    slug: 'analisis-matematico',
    roman: 'III',
    codes: ['26', '30', '34', '46'],
    groups: [
      { id: 'analisis-real-y-funciones', codes: ['26'] },
      { id: 'analisis-complejo', codes: ['30'] },
      { id: 'ecuaciones-diferenciales', codes: ['34'] },
      { id: 'analisis-funcional-y-armonico', codes: ['46'] },
    ],
    accent: 'var(--theme-pizarra)',
    desc: 'Estudio del cambio continuo, los límites, las funciones y las convergencias infinitas.',
    icon: '∫',
  },
  {
    title: 'Geometría y Topología',
    slug: 'geometria-y-topologia',
    roman: 'IV',
    codes: ['51', '53', '54', '55'],
    groups: [
      { id: 'geometria-clasica-y-diferencial', codes: ['51', '53'] },
      { id: 'topologia-general-y-algebraica', codes: ['54', '55'] },
    ],
    accent: 'var(--theme-terracota)',
    desc: 'Estudio formal de las propiedades métricas, diferenciales y topológicas del espacio.',
    icon: '△',
  },
  {
    title: 'Matemática Discreta y Computacional',
    slug: 'matematica-discreta-y-computacional',
    roman: 'V',
    codes: ['05', '68'],
    groups: [],
    accent: 'var(--theme-pavo)',
    desc: 'Estructuras discretas, combinatoria, teoría de grafos y fundamentos algorítmicos.',
    icon: '◇',
  },
  {
    title: 'Probabilidad, Estadística y Aplicaciones',
    slug: 'probabilidad-estadistica-y-aplicaciones',
    roman: 'VI',
    codes: ['60', '62', '65', '49', '90', '91', '70', '74', '76', '78', '80', '81', '82', '83', '85', '86', '92'],
    groups: [
      { id: 'optimizacion-y-teoria-de-juegos', codes: ['49', '90', '91'] },
      { id: 'fisica-matematica-y-biologia', codes: ['70', '74', '76', '78', '80', '81', '82', '83', '85', '86', '92'] },
    ],
    accent: 'var(--theme-ocre)',
    desc: 'Tratamiento axiomático de los fenómenos aleatorios, inferencia y modelado de procesos.',
    icon: '∑',
  },
];

function itemHref(entry: { type: string; item: { slug?: string; id?: string } }): string {
  if (entry.type === 'method') return `/metodo/${entry.item.slug}`;
  if (entry.type === 'theorem') return `/teorema/${entry.item.id}`;
  if (entry.type === 'definition') return `/definicion/${entry.item.id}`;
  if (entry.type === 'axiom') return `/axioma/${entry.item.id}`;
  if (entry.type === 'model') return `/modelo/${entry.item.id}`;
  if (entry.type === 'exercise') return `/ejercicio/${entry.item.slug}`;
  if (entry.type === 'example') return `/ejemplo/${entry.item.slug}`;
  if (entry.type === 'useCase') return `/caso/${entry.item.slug}`;
  return '/';
}

const TYPE_LABELS: Record<string, string> = {
  method: 'Método',
  theorem: 'Teorema',
  definition: 'Definición',
  axiom: 'Axioma',
  model: 'Modelo',
  exercise: 'Ejercicio',
  example: 'Ejemplo',
};

/** Chips = sans de sistema como en GH Pages (prod no usa Source Sans 3). */
const BRANCH_CHIP =
  'inline-flex items-center gap-1.5 min-h-6 px-2.5 py-0.5 rounded border text-xs leading-tight font-[ui-sans-serif,system-ui,-apple-system,sans-serif] font-semibold tracking-wide proportional-nums transition-colors hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota';

function chipInk(accent: string) {
  return {
    color: `color-mix(in srgb, ${accent} calc(100% - var(--ink-pigment-mix)), var(--ink-text))`,
    borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
  };
}

function sortCodes(codes: string[]) {
  return [...codes].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export const BranchLibrary = () => {
  const { readConcepts, completedExercises } = useProgressStore();

  const totalEntries = db.getAllDefinitions().length + db.theorems.size;

  return (
    <main className="max-w-5xl mx-auto px-8 py-16">
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10 border-b border-carbon/15 pb-4">
        <div className="flex items-baseline gap-4 flex-wrap">
          <h2 className="text-2xl text-ink">Biblioteca MSC2020</h2>
          <span className="text-sm text-ink-muted tracking-wide font-sans tabular-nums">
            {SECTIONS.length} secciones · {totalEntries} entradas
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-sans tracking-wide text-ink-muted bg-carbon/5 px-4 py-2.5 rounded tabular-nums">
          <span>Leídos: <strong className="text-salvia font-semibold">{readConcepts.length}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Ejercicios: <strong className="text-salvia font-semibold">{completedExercises.length}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {SECTIONS.map((section) => {
          const allItems = section.codes.flatMap(code => db.getItemsByBranch(code));
          const seen = new Map<string, { type: string; item: { id: string; title?: string } }>();
          for (const entry of allItems) {
            if (!seen.has(entry.item.id)) {
              seen.set(entry.item.id, entry);
            }
          }
          const uniqueItems = Array.from(seen.values());
          const displayItems = uniqueItems.slice(0, 5);
          const hasMore = uniqueItems.length > 5;

          return (
            <article
              key={section.title}
              className="group elegant-panel relative flex flex-col overflow-hidden cursor-pointer"
              style={{ ['--hover-accent' as string]: section.accent }}
            >
              <div className="h-3 w-full border-b border-carbon/20" style={{ backgroundColor: section.accent }} />
              <div className="absolute top-3 left-0 right-0 h-[1px] bg-carbon/10 pointer-events-none" />

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div
                      className="ac-label ac-label--sm mb-1"
                      style={{ color: section.accent }}
                    >
                      Sección {section.roman}
                    </div>
                    <Link
                      href={`/rama/${section.slug}`}
                      className="block text-2xl text-ink leading-none transition-colors hover:underline decoration-1 underline-offset-4"
                    >
                      {section.title}
                    </Link>
                  </div>
                  <span
                    className="text-5xl font-serif opacity-10 leading-none select-none group-hover:opacity-20 transition-opacity"
                    style={{ color: section.accent }}
                  >
                    {section.icon}
                  </span>
                </div>

                <p
                  className="text-sm italic text-ink-muted leading-relaxed mb-3 pl-3"
                  style={{ borderLeft: `2px solid color-mix(in srgb, ${section.accent} 40%, transparent)` }}
                >
                  {section.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {section.groups.map(group => (
                      <Link
                        key={group.id}
                        href={`/rama/${group.id}`}
                        className={`${BRANCH_CHIP} border-dashed`}
                        style={chipInk(section.accent)}
                      >
                        <span className="opacity-70">{sortCodes(group.codes).join('/')}</span>
                        <span>{mscNames[group.id] || group.id}</span>
                      </Link>
                  ))}
                  {sortCodes(section.codes).map(code => (
                      <Link
                        key={code}
                        href={`/rama/${code}`}
                        className={`${BRANCH_CHIP} justify-center`}
                        style={chipInk(section.accent)}
                      >
                        {code}
                      </Link>
                  ))}
                </div>

                <div className="mt-auto border-t border-carbon/10 pt-3 flex flex-col gap-0">
                  {displayItems.length > 0 ? (
                    displayItems.map((entry, idx) => (
                      <Link
                        key={idx}
                        href={itemHref(entry)}
                        className="flex items-center justify-between py-2.5 min-h-11 group/row hover:bg-carbon/[0.02] -mx-2 px-2 rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
                      >
                        <span className="text-sm text-ink-body group-hover/row:text-ink font-medium flex items-center gap-2">
                          <span className="text-ink-subtle text-xs" aria-hidden="true">§</span>
                          {entry.item.title || entry.item.id}
                        </span>
                        <span
                          className="ac-label ac-label--xs px-1.5 py-0.5 rounded"
                          style={{
                            color: `color-mix(in srgb, ${section.accent} calc(100% - var(--ink-pigment-mix)), var(--ink-text))`,
                            backgroundColor: `color-mix(in srgb, ${section.accent} 12%, transparent)`,
                          }}
                        >
                          {TYPE_LABELS[entry.type] || entry.type}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="py-3 text-center">
                      <span className="ac-eyebrow ac-eyebrow--sm ac-eyebrow--faint">En Preparación</span>
                    </div>
                  )}

                  {hasMore && (
                    <Link
                      href={`/rama/${section.slug}`}
                      className="mt-2 py-1.5 text-center ac-eyebrow transition-colors hover:underline"
                      style={{ color: section.accent }}
                    >
                      Ver {uniqueItems.length - 5} entradas más →
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};
