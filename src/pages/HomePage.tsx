import { Link } from 'wouter';
import { Logo } from '../components/Logo';
import { db } from '../store/ContentStore';
import { useProgressStore } from '../store/UserProgressStore';

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

/** Mapa fixo de tipo de contenido → URL base */
function itemHref(entry: { type: string; item: any }): string {
  if (entry.type === 'lesson') return `/${entry.item.id}`;
  if (entry.type === 'theorem') return `/teorema/${entry.item.id}`;
  if (entry.type === 'definition') return `/definicion/${entry.item.id}`;
  return '/';
}

const TYPE_LABELS: Record<string, string> = {
  lesson: 'Lección',
  theorem: 'Teorema',
  definition: 'Definición',
};

export const HomePage = () => {
  const { readConcepts, completedExercises } = useProgressStore();

  return (
    <div className="min-h-screen bg-arts-and-crafts text-carbon font-serif overflow-y-auto">

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <header className="relative w-full overflow-hidden border-b border-carbon/15">

        <div className="relative z-10 max-w-5xl mx-auto px-8 pt-24 pb-20 flex flex-col items-center text-center">
          {/* Logo + título en inline */}
          <div className="flex items-end gap-3 mb-6">
            <Logo className="w-24 h-24 md:w-[7.5rem] md:h-[7.5rem] opacity-90 mb-1" />
            <h1
              className="text-[4.5rem] md:text-[7rem] text-carbon tracking-tight leading-none"
              style={{ fontVariant: 'small-caps' }}
            >
              atematika
            </h1>
          </div>

          {/* Lema */}
          <p className="text-lg md:text-xl text-carbon/60 italic max-w-xl leading-relaxed mb-10">
            Enciclopedia de estructuras formales — teoremas, definiciones y demostraciones vivas
          </p>

          {/* Separador ornamental */}
          <div className="flex items-center gap-4 w-full max-w-xs opacity-30">
            <div className="flex-1 h-px bg-carbon" />
            <span className="text-carbon text-xs">✦</span>
            <div className="flex-1 h-px bg-carbon" />
          </div>

          {/* Accesos rápidos */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl">
            <Link href="/plan/selectividad">
              <a className="group relative flex-1 bg-terracota text-lienzo px-6 py-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="absolute inset-[3px] border border-lienzo/20 pointer-events-none" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-80 mb-1">Plan de Estudio</span>
                <span className="text-xl font-bold" style={{ fontVariant: 'small-caps' }}>Preparación EBAU</span>
                <span className="mt-2 text-xs opacity-70 group-hover:opacity-100 transition-opacity">Acceder al Temario →</span>
              </a>
            </Link>

            <Link href="/metodos">
              <a className="group relative flex-1 bg-salvia text-lienzo px-6 py-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="absolute inset-[3px] border border-lienzo/20 pointer-events-none" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-80 mb-1">Arsenal Lógico</span>
                <span className="text-xl font-bold" style={{ fontVariant: 'small-caps' }}>Métodos de Prueba</span>
                <span className="mt-2 text-xs opacity-70 group-hover:opacity-100 transition-opacity">Explorar Filosofía →</span>
              </a>
            </Link>

            <Link href="/grafo">
              <a className="group relative flex-1 bg-carbon text-lienzo px-6 py-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="absolute inset-[3px] border border-lienzo/20 pointer-events-none" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-80 mb-1">Mapa Interactivo</span>
                <span className="text-xl font-bold" style={{ fontVariant: 'small-caps' }}>Grafo Visual</span>
                <span className="mt-2 text-xs opacity-70 group-hover:opacity-100 transition-opacity">Ver Conexiones →</span>
              </a>
            </Link>
          </div>
        </div>
      </header>

      {/* ── BIBLIOTECA: RAMAS ──────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-8 py-16">

        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10 border-b border-carbon/15 pb-4">
          <div className="flex items-baseline gap-4">
            <h2 className="text-2xl text-carbon" style={{ fontVariant: 'small-caps' }}>Biblioteca de Ramas</h2>
            <span className="text-xs text-carbon/40 uppercase tracking-widest font-sans">
              {BRANCHES.length} ramas · {db.getAllDefinitions().length + Array.from((db as any).theorems?.values?.() ?? []).length} entradas
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
                className="group relative bg-lienzo border border-carbon/20 flex flex-col transition-all duration-300 hover:border-carbon/50 hover:shadow-md"
              >
                {/* Barra de color superior */}
                <div className="h-0.5 w-full" style={{ backgroundColor: branch.accent }} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Cabecera */}
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
                    {/* Símbolo decorativo */}
                    <span
                      className="text-5xl font-serif opacity-10 leading-none select-none group-hover:opacity-20 transition-opacity"
                      style={{ color: branch.accent }}
                    >
                      {branch.icon}
                    </span>
                  </div>

                  {/* Descripción */}
                  <p
                    className="text-sm italic text-carbon/60 leading-relaxed mb-5 pl-3"
                    style={{ borderLeft: `2px solid ${branch.accent}40` }}
                  >
                    {branch.desc}
                  </p>

                  {/* Índice de entradas */}
                  <div className="mt-auto border-t border-carbon/10 pt-3 flex flex-col gap-0">
                    {displayItems.length > 0 ? (
                      displayItems.map((entry, idx) => (
                        <Link key={idx} href={itemHref(entry)}>
                          <a className="flex items-center justify-between py-1.5 group/row hover:bg-carbon/[0.02] -mx-2 px-2 rounded transition-colors">
                            <span className="text-sm text-carbon/80 group-hover/row:text-carbon font-medium flex items-center gap-2">
                              <span className="text-carbon/30 text-xs">§</span>
                              {entry.item.title || entry.item.id}
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

          {/* Tarjeta de "próximamente" */}
          <article className="relative border border-dashed border-carbon/20 flex flex-col items-center justify-center p-10 text-center min-h-[200px] opacity-50">
            <span className="text-4xl text-carbon/20 mb-3">+</span>
            <span className="text-xs uppercase tracking-widest text-carbon/40 font-sans">Nuevas ramas en expansión</span>
          </article>
        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-carbon/10 mt-8">
        <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-3">
            <Link href="/diccionario">
              <a className="px-5 py-2.5 text-xs uppercase tracking-widest font-sans border border-carbon/20 text-carbon/60 hover:border-carbon hover:text-carbon transition-colors">
                Diccionario
              </a>
            </Link>
            <Link href="/historia">
              <a className="px-5 py-2.5 text-xs uppercase tracking-widest font-sans border border-salvia/30 text-salvia hover:bg-salvia hover:text-lienzo transition-colors">
                Índice Biográfico
              </a>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-carbon/30 text-xs font-sans">
            <div className="w-6 h-px bg-carbon/20" />
            <Logo className="w-5 h-5 opacity-40" />
            <span>Matematika · 2026</span>
            <div className="w-6 h-px bg-carbon/20" />
          </div>
        </div>
      </footer>

    </div>
  );
};
