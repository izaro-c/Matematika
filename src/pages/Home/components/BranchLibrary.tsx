import { Link } from 'wouter';
import { db } from '../../../store/content';
import { useProgressStore } from '../../../store/UserProgressStore';

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
    accent: '#A2C2A2',
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
    accent: '#333333',
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
    accent: '#5D7080',
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
    accent: '#C86446',
    desc: 'Estudio formal de las propiedades métricas, diferenciales y topológicas del espacio.',
    icon: '△',
  },
  {
    title: 'Matemática Discreta y Computacional',
    slug: 'matematica-discreta-y-computacional',
    roman: 'V',
    codes: ['05', '68'],
    groups: [],
    accent: '#8B5CF6',
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
    accent: '#c49b4f',
    desc: 'Tratamiento axiomático de los fenómenos aleatorios, inferencia y modelado de procesos.',
    icon: '∑',
  },
];

function itemHref(entry: { type: string; item: { slug?: string; id?: string } }): string {
  if (entry.type === 'lesson') return `/${entry.item.slug}`;
  if (entry.type === 'theorem') return `/teorema/${entry.item.id}`;
  if (entry.type === 'definition') return `/definicion/${entry.item.id}`;
  if (entry.type === 'axiom') return `/axioma/${entry.item.id}`;
  if (entry.type === 'exercise') return `/ejercicio/${entry.item.slug}`;
  if (entry.type === 'example') return `/ejemplo/${entry.item.slug}`;
  if (entry.type === 'useCase') return `/caso/${entry.item.slug}`;
  if (entry.type === 'lesson') return `/${entry.item.slug}`;
  return '/';
}

const TYPE_LABELS: Record<string, string> = {
  lesson: 'Lección',
  theorem: 'Teorema',
  definition: 'Definición',
  axiom: 'Axioma',
  exercise: 'Ejercicio',
  example: 'Ejemplo',
};

export const BranchLibrary = () => {
  const { readConcepts, completedExercises } = useProgressStore();

  const totalEntries = db.getAllDefinitions().length + db.theorems.size;

  return (
    <main className="max-w-5xl mx-auto px-8 py-16">
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10 border-b border-carbon/15 pb-4">
        <div className="flex items-baseline gap-4">
          <h2 className="text-2xl text-carbon" style={{ fontVariant: 'small-caps' }}>Biblioteca MSC2020</h2>
          <span className="text-xs text-carbon/40 uppercase tracking-widest font-sans">
            {SECTIONS.length} secciones · {totalEntries} entradas
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-sans tracking-widest uppercase text-carbon/60 bg-carbon/5 px-4 py-2 rounded">
          <span>Leídos: <strong className="text-[#2a6a2a]">{readConcepts.length}</strong></span>
          <span>·</span>
          <span>Ejercicios: <strong className="text-[#2a6a2a]">{completedExercises.length}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {SECTIONS.map((section) => {
          const allItems = section.codes.flatMap(code => db.getItemsByBranch(code));
          const seen = new Map<string, { type: string; item: any }>();
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
            >
              <div className="h-3 w-full border-b border-carbon/20" style={{ backgroundColor: section.accent }} />
              <div className="absolute top-3 left-0 right-0 h-[1px] bg-carbon/10 pointer-events-none" />

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold mb-1"
                      style={{ color: section.accent }}
                    >
                      Sección {section.roman}
                    </div>
                    <Link href={`/rama/${section.slug}`}>
                      <a
                        className="block text-2xl text-carbon leading-none transition-colors hover:underline decoration-1 underline-offset-4"
                        style={{ fontVariant: 'small-caps' }}
                      >
                        {section.title}
                      </a>
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
                  className="text-sm italic text-carbon/60 leading-relaxed mb-3 pl-3"
                  style={{ borderLeft: `2px solid ${section.accent}40` }}
                >
                  {section.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {section.groups.map(group => {
                    const name = (db as any).constructor.mscNames?.[group.id] || group.id;
                    return (
                      <Link key={group.id} href={`/rama/${group.id}`}>
                        <a
                          className="text-[10px] font-sans font-bold tracking-wider px-2 py-0.5 rounded border border-dashed transition-colors hover:bg-carbon/5 flex items-center gap-1"
                          style={{
                            color: section.accent,
                            borderColor: `${section.accent}30`,
                          }}
                        >
                          <span className="opacity-60">{group.codes.join('/')}</span>
                          <span>{name}</span>
                        </a>
                      </Link>
                    );
                  })}
                  {section.codes.map(code => (
                      <Link key={code} href={`/rama/${code}`}>
                        <a
                          className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded border transition-colors hover:bg-carbon/5"
                          style={{
                            color: section.accent,
                            borderColor: `${section.accent}40`,
                          }}
                        >
                          {code}
                        </a>
                      </Link>
                  ))}
                </div>

                <div className="mt-auto border-t border-carbon/10 pt-3 flex flex-col gap-0">
                  {displayItems.length > 0 ? (
                    displayItems.map((entry, idx) => (
                      <Link key={idx} href={itemHref(entry)}>
                        <a className="flex items-center justify-between py-1.5 group/row hover:bg-carbon/[0.02] -mx-2 px-2 rounded transition-colors">
                          <span className="text-sm text-carbon/80 group-hover/row:text-carbon font-medium flex items-center gap-2">
                            <span className="text-carbon/30 text-xs">§</span>
                            {(entry.item as any).title || entry.item.id}
                          </span>
                          <span
                            className="text-[9px] uppercase tracking-wider font-sans px-1.5 py-0.5 rounded"
                            style={{ color: section.accent, backgroundColor: `${section.accent}15` }}
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
                    <Link href={`/rama/${section.slug}`}>
                      <a
                        className="mt-2 py-1.5 text-center text-xs font-sans tracking-widest uppercase transition-colors hover:underline"
                        style={{ color: section.accent }}
                      >
                        Ver {uniqueItems.length - 5} entradas más →
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
