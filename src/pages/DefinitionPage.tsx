import { useParams, Link } from "wouter";
import { db } from "../store/content";
import { Suspense } from 'react';
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { ReadingButton } from '../components/ui/ReadingButton';
import { ModelBadgeList } from '../components/ui/ModelBadge';
import { MaterialPracticoSection } from '../components/ui/MaterialPracticoSection';
import { AplicacionesSection } from '../components/ui/AplicacionesSection';

/**
 * Página principal para leer una Definición matemática (Definition).
 * Carga su contenido MDX, renderiza simulaciones opcionales,
 * y muestra ejemplos y ejercicios asociados.
 */
export const DefinitionPage = () => {
  const { id } = useParams();
  const slug = id || '';
  
  const definition = db.getDefinition(slug);
  const examples = db.getExamplesByTheorem(definition?.id || '');
  const exercises = db.getExercisesByTheorem(definition?.id || '');
  const useCases = db.getUseCasesByConcept(definition?.id || '');

  if (!definition) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl">La definición especificada no existe o no ha sido catalogada.</h1>
      </div>
    );
  }

  let breadcrumbs: {name: string, slug: string}[] = [];
  if (definition.tags && definition.tags.length > 0) {
    const mainBranch = definition.tags[0];
    const taxonomy = db.getBranchTaxonomy(mainBranch);
    breadcrumbs = taxonomy.breadcrumbs.concat([{ name: taxonomy.name || taxonomy.id, slug: taxonomy.slug }]);
  }

  const renderContent = () => (
    <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-24">
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="mb-12 flex flex-wrap items-center gap-2 text-sm font-sans tracking-widest uppercase text-carbon/40">
            <Link href="/">
              <a className="hover:text-carbon transition-colors">Biblioteca</a>
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.slug} className="flex items-center gap-2">
                <span>/</span>
                <Link href={`/rama/${crumb.slug}`}>
                  <a className="hover:text-carbon transition-colors">{crumb.name}</a>
                </Link>
              </span>
            ))}
          </div>
        )}

        {/* Cabecera de la Definición */}
        <div className="mb-16 border-b border-carbon/10 pb-12">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
            <span className={`text-sm uppercase tracking-widest font-sans font-bold text-${definition.color || 'carbon'}/80`}>
              Definición
            </span>
            <ModelBadgeList nodeId={definition.id} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6" style={{ fontVariant: 'small-caps' }}>
            {definition.title}
          </h1>
          {definition.description && (
            <p className="text-xl text-carbon/70 italic border-l-4 border-carbon/20 pl-6 leading-relaxed">
              {definition.description}
            </p>
          )}

          {definition.authors && definition.authors.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {definition.authors.map(authorId => {
                const author = db.getMathematicianById(authorId);
                return author ? (
                  <Link key={authorId} href={`/bio/${author.slug}`}>
                    <a className="inline-flex items-center gap-3 px-4 py-2 border border-carbon/10 bg-carbon/5 hover:bg-carbon hover:text-lienzo transition-colors rounded-full">
                      <span className="font-sans text-xs uppercase tracking-widest font-bold">Autor:</span>
                      <span className="font-bold" style={{ fontVariant: 'small-caps' }}>{author.name}</span>
                    </a>
                  </Link>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Contenido Principal (MDX) */}
        <div className="prose prose-pizarra prose-lg max-w-none">
          <Suspense fallback={<div className="animate-pulse h-64 bg-carbon/5 rounded"></div>}>
            <definition.Component />
          </Suspense>
        </div>

        <MaterialPracticoSection examples={examples} exercises={exercises} />
        <AplicacionesSection useCases={useCases} />

        {/* Botón de Lectura */}
        <ReadingButton id={slug} />

      </div>
    </div>
  );

  return (
    <SimulationLayout simulationComponent={definition.Simulation}>
      {renderContent()}
    </SimulationLayout>
  );
};
