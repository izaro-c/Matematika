import type { Demo, Theorem } from '../store/content/types';
import { useParams, Link } from "wouter";
import { db } from "../store/content";
import { Suspense } from 'react';
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { ReadingButton } from '../components/ui/ReadingButton';
import { ModelBadgeList } from '../components/ui/ModelBadge';
import { FadeIn } from '../components/ui/FadeIn';
import { EmptyState } from '../components/ui/EmptyState';
import { ContentCard } from '../components/ui/ContentCard';
import { MaterialPracticoSection } from '../components/ui/MaterialPracticoSection';
import { AplicacionesSection } from '../components/ui/AplicacionesSection';

/**
 * Página principal para un Teorema (Theorem).
 * Carga su contenido MDX, renderiza simulaciones asociadas de manera reactiva
 * y muestra componentes de demostraciones, ejemplos y casos de uso conectados.
 */
export const TheoremPage = () => {
  const { id } = useParams();
  const slug = id || '';
  
  const theorem = db.getTheorem(slug);
  if (!theorem) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl">El teorema especificado no existe o no ha sido catalogado.</h1>
      </div>
    );
  }

  // Resolver metadatos relacionales
  const corollaries = theorem.corollaries?.map(cId => db.getTheorem(cId)).filter(Boolean) || [];
  const lemmas = theorem.lemmas?.map(lId => db.getTheorem(lId)).filter(Boolean) || [];
  const demos = theorem.demos?.map(dId => db.demos.get(dId) || Array.from(db.demos.values()).find(d => d.slug === dId)).filter(Boolean) || [];
  const parentTheorem = theorem.parentTheorem ? db.getTheorem(theorem.parentTheorem) : null;
  const examples = db.getExamplesByTheorem(theorem.id);
  const exercises = db.getExercisesByTheorem(theorem.id);
  const useCases = db.getUseCasesByConcept(theorem.id);
  
  const typeLabels: Record<string, string> = {
    'theorem': 'Teorema',
    'lemma': 'Lema',
    'corollary': 'Corolario'
  };
  
  const displayType = typeLabels[theorem.type || 'theorem'];

  let breadcrumbs: {name: string, slug: string}[] = [];
  if (theorem.tags && theorem.tags.length > 0) {
    const mainBranch = theorem.tags[0];
    const taxonomy = db.getBranchTaxonomy(mainBranch);
    breadcrumbs = taxonomy.breadcrumbs.concat([{ name: taxonomy.name || taxonomy.id, slug: taxonomy.slug }]);
  }

  const renderContent = () => (
    <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
        <FadeIn className="max-w-4xl mx-auto px-6 md:px-12 pt-24">
        
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

        {/* Retorno al Teorema Padre */}
        {parentTheorem && (
          <div className="mb-12">
            <Link href={`/teorema/${parentTheorem.id}`}>
              <a className="inline-flex items-center text-sm font-sans tracking-widest uppercase text-carbon/60 hover:text-carbon border border-carbon/20 px-4 py-2 hover:bg-carbon/5 transition-colors">
                &larr; Retornar al {typeLabels[parentTheorem.type || 'theorem']}: {parentTheorem.title}
              </a>
            </Link>
          </div>
        )}

        {/* Cabecera del Teorema */}
        <div className="mb-16 border-b border-carbon/10 pb-12">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
            <span className={`text-sm uppercase tracking-widest font-sans font-bold text-${theorem.color || 'carbon'}/80`}>
              {displayType}
            </span>
            <ModelBadgeList nodeId={theorem.id} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6" style={{ fontVariant: 'small-caps' }}>
            {theorem.title}
          </h1>
          <p className="text-xl text-carbon/70 italic border-l-4 border-carbon/20 pl-6 leading-relaxed">
            {theorem.description}
          </p>

          {theorem.authors && theorem.authors.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {theorem.authors.map(authorId => {
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
            <theorem.Component />
          </Suspense>
        </div>

        {/* Demostraciones */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold mb-8 border-b border-carbon/10 pb-4" style={{ fontVariant: 'small-caps' }}>
            Demostraciones Disponibles
          </h2>
          {demos.length > 0 ? (
            <div className="flex flex-col gap-4">
              {demos.filter((d): d is Demo => !!d).map((demo) => (
                <ContentCard
                  key={demo.slug}
                  href={`/demo/${demo.id}`}
                  title={demo.title}
                  description={demo.description}
                  type="demostracion"
                  layout="row"
                  actionLabel="Explorar Demostración"
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No hay demostraciones documentadas para este teorema." icon="▤" />
          )}
        </div>

        <MaterialPracticoSection examples={examples} exercises={exercises} />
        <AplicacionesSection useCases={useCases} />

        {/* Referencias Relacionales (Lemas) */}
        {lemmas.length > 0 && (
          <div className="mt-24 border-t border-carbon/20 pt-16">
            <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontVariant: 'small-caps' }}>
              Lemas Previos
            </h2>
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
              {lemmas.filter((l): l is Theorem => !!l).map((lem) => (
                <ContentCard
                  key={lem.slug}
                  href={`/teorema/${lem.id}`}
                  title={lem.title}
                  description={lem.description}
                  type="lema"
                  layout="row"
                />
              ))}
            </div>
          </div>
        )}

        {/* Referencias Relacionales (Corolarios) */}
        <div className="mt-24 border-t border-carbon/20 pt-16">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontVariant: 'small-caps' }}>
            Corolarios Derivados
          </h2>
          {corollaries.length > 0 ? (
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
              {corollaries.filter((c): c is Theorem => !!c).map((cor) => (
                <ContentCard
                  key={cor.slug}
                  href={`/teorema/${cor.id}`}
                  title={cor.title}
                  description={cor.description}
                  type="corolario"
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No hay corolarios derivados de este teorema." icon="◇" />
          )}
        </div>

        {/* Botón de Lectura */}
        <ReadingButton id={slug} />

        </FadeIn>
      </div>
    );

  return (
    <SimulationLayout simulationComponent={theorem.Simulation}>
      {renderContent()}
    </SimulationLayout>
  );
};
