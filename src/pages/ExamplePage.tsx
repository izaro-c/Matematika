/**
 * ExamplePage.tsx
 *
 * Página de ejemplo resuelto. Muestra la solución paso a paso
 * usando el componente <Paso> para revelar cada etapa individualmente.
 *
 * Muestra:
 * - Cabecera con título, dificultad y enlace al teorema relacionado
 * - Contenido MDX con Paso, Solucion, fórmulas, etc.
 * - Enlace a ejercicios relacionados al final
 */
import { useParams, Link } from 'wouter';
import { Suspense } from 'react';
import { db } from '../store/content';
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { KatexText } from '../components/ui/KatexText';
import { ReadingButton } from '../components/ui/ReadingButton';

export const ExamplePage: React.FC = () => {
  const { id } = useParams();
  const slug = id || '';
  const example = db.getExample(slug);

  if (!example) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl italic text-carbon/50">Ejemplo no encontrado.</h1>
      </div>
    );
  }

  const relatedTheorem = example.relatedTheorem ? db.getTheorem(example.relatedTheorem) : null;
  const relatedExercises = relatedTheorem ? db.getExercisesByTheorem(relatedTheorem.id) : [];

  const DIFF_COLORS: Record<string, string> = {
    básico: '#2a6a2a',
    intermedio: '#c49b4f',
    avanzado: '#A42A04',
  };
  const diffColor = DIFF_COLORS[example.difficulty ?? 'básico'] ?? '#333';

  return (
    <SimulationLayout simulationComponent={example.Simulation}>
      <div className="min-h-screen bg-transparent text-carbon font-serif">
        <div className="max-w-3xl mx-auto px-6 md:px-10 pt-16 pb-32">

        {/* Migas de pan */}
        <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest text-carbon/35 mb-10">
          <Link href="/"><a className="hover:text-carbon transition-colors">Biblioteca</a></Link>
          {relatedTheorem && (
            <>
              <span>/</span>
              <Link href={`/teorema/${relatedTheorem.id}`}>
                <a className="hover:text-carbon transition-colors">{relatedTheorem.title}</a>
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-carbon/60">Ejemplo</span>
        </div>

        {/* Cabecera */}
        <div className="mb-12 pb-8 border-b border-carbon/10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-1 rounded"
              style={{ color: diffColor, backgroundColor: `${diffColor}15` }}
            >
              {example.difficulty ?? 'básico'}
            </span>
            <span className="text-[10px] font-sans uppercase tracking-widest text-carbon/35 border border-carbon/15 px-2 py-1 rounded">
              Ejemplo Resuelto
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold text-carbon leading-tight mb-4"
            style={{ fontVariant: 'small-caps' }}
          >
            {example.title}
          </h1>

          {example.description && (
            <p className="text-base italic text-carbon/60 border-l-4 border-carbon/15 pl-5 leading-relaxed">
              <KatexText text={example.description} />
            </p>
          )}

          {relatedTheorem && (
            <Link href={`/teorema/${relatedTheorem.id}`}>
              <a className="inline-flex items-center gap-2 mt-5 text-xs font-sans uppercase tracking-widest text-terracota/70 hover:text-terracota transition-colors border border-terracota/20 hover:border-terracota/40 px-3 py-1.5">
                ← {relatedTheorem.title}
              </a>
            </Link>
          )}
        </div>

        {/* Separador ornamental */}
        <div className="flex items-center gap-4 mb-10 opacity-25">
          <div className="flex-1 h-px bg-carbon" />
          <span className="text-xs">✦</span>
          <div className="flex-1 h-px bg-carbon" />
        </div>

        {/* Contenido MDX */}
        <div className="[&_h2]:text-xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-carbon [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-carbon/10 [&_h2]:pb-2 [&_p]:text-carbon/80 [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-carbon">
          <Suspense fallback={<div className="animate-pulse h-40 bg-carbon/5 rounded" />}>
            <example.Component />
          </Suspense>
        </div>

        {/* Separador */}
        <div className="flex items-center gap-4 mt-16 mb-10 opacity-15">
          <div className="flex-1 h-px bg-carbon" />
          <span className="text-xs">❦</span>
          <div className="flex-1 h-px bg-carbon" />
        </div>

        {/* Ejercicios relacionados */}
        {relatedExercises.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-carbon/40 mb-4">
              Practica con ejercicios relacionados
            </h3>
            <div className="flex flex-col gap-3">
              {relatedExercises.map(ex => (
                <Link key={ex.id} href={`/ejercicio/${ex.id}`}>
                  <a className="flex items-center justify-between p-4 border border-carbon/15 hover:border-carbon/40 hover:shadow-sm transition-all group">
                    <div>
                      <span className="text-sm font-medium text-carbon group-hover:text-terracota transition-colors">
                        {ex.title}
                      </span>
                      {ex.description && (
                        <p className="text-xs text-carbon/45 italic mt-0.5">{ex.description}</p>
                      )}
                    </div>
                    <span className="text-xs font-sans text-carbon/30 group-hover:text-carbon/60 transition-colors shrink-0 ml-4">
                      Practicar →
                    </span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Botón de Lectura */}
        <ReadingButton id={slug} />

      </div>
    </div>
    </SimulationLayout>
  );
};
