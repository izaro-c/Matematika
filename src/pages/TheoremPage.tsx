import { Suspense, useEffect } from 'react';
import type { Demo, Theorem } from '@/entities/content/types';
import { useParams } from "wouter";
import { db } from "@/entities/content";
import { TriptychLayout } from "@/widgets/layouts/TriptychLayout";
import { ReadingButton } from '@/features/progress/ui/ReadingButton';
import { MetadataSidebar } from '@/features/metadata/ui/MetadataSidebar';
import { FadeIn } from '@/shared/ui/FadeIn';
import { ContentCard } from '@/shared/ui/ContentCard';
import { ContentHeader } from '@/widgets/content/ContentHeader';
import { ContentBody } from '@/shared/ui/ContentBody';
import { MaterialPracticoSection } from '@/widgets/content/MaterialPracticoSection';
import { AplicacionesSection } from '@/shared/ui/AplicacionesSection';
import { SubtleSeparator } from '@/shared/ui/SubtleSeparator';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { useMetadataStore } from '@/features/metadata/MetadataStore';

const TYPE_LABELS: Record<string, string> = {
  teorema: 'Teorema',
  lema: 'Lema',
  corolario: 'Corolario',
};

/**
 * Componente principal para visualizar un Teorema, Lema o Corolario.
 * 
 * Se encarga de:
 * 1. Extraer el slug de la URL.
 * 2. Cargar los metadatos y el componente MDX desde el `ContentStore`.
 * 3. Renderizar la relación de este teorema con lemas previos, corolarios derivados y demostraciones.
 * 4. Componer lectura, metadatos, simulación y contenido relacionado en un tríptico editorial.
 *
 * @returns El nodo React de la página o un estado 404/En Construcción si no se encuentra.
 */
export const TheoremPage = () => {
  const { id } = useParams();
  const slug = id || '';
  const setMetadata = useMetadataStore((state) => state.setMetadata);

  const theorem = db.getTheorem(slug);

  useEffect(() => {
    if (theorem) {
      setMetadata({
        title: theorem.title,
        type: TYPE_LABELS[theorem.type || 'teorema'] || 'Teorema',
        tags: theorem.tags || [],
        description: theorem.description,
        lemmas: theorem.lemmas?.map(lId => {
          const l = db.getTheorem(lId);
          return l ? { id: l.id, title: l.title } : null;
        }).filter(Boolean) as { id: string; title: string }[],
        corollaries: theorem.corollaries?.map(cId => {
          const c = db.getTheorem(cId);
          return c ? { id: c.id, title: c.title } : null;
        }).filter(Boolean) as { id: string; title: string }[],
        demos: theorem.demos?.map(dId => {
          const d = db.demos.get(dId) || Array.from(db.demos.values()).find(demo => demo.slug === dId);
          return d ? { id: d.id, title: d.title } : null;
        }).filter(Boolean) as { id: string; title: string }[],
      });
    }
    return () => setMetadata(null);
  }, [theorem, setMetadata]);

  if (!theorem) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl">El teorema especificado no existe o no ha sido catalogado.</h1>
      </div>
    );
  }

  const corollaries = theorem.corollaries?.map(cId => db.getTheorem(cId)).filter(Boolean) as Theorem[] || [];
  const lemmas = theorem.lemmas?.map(lId => db.getTheorem(lId)).filter(Boolean) as Theorem[] || [];
  const demos = theorem.demos?.map(dId => db.demos.get(dId) || Array.from(db.demos.values()).find(d => d.slug === dId)).filter(Boolean) as Demo[] || [];
  const parentTheorem = theorem.parentTheorem ? db.getTheorem(theorem.parentTheorem) : null;
  const examples = db.getExamplesByTheorem(theorem.id);
  const exercises = db.getExercisesByTheorem(theorem.id);
  const useCases = db.getUseCasesByConcept(theorem.id);

  const displayType = TYPE_LABELS[theorem.type || 'teorema'] || 'Teorema';
  const Simulation = theorem.Simulation;

  const breadcrumbs: { name: string; href?: string }[] = [];
  if (theorem.tags && theorem.tags.length > 0) {
    const mainBranch = theorem.tags[0];
    const taxonomy = db.getBranchTaxonomy(mainBranch);
    breadcrumbs.push(
      ...taxonomy.breadcrumbs.map(b => ({ name: b.name, href: `/rama/${b.slug}` })),
      { name: taxonomy.name || taxonomy.id, href: `/rama/${taxonomy.slug}` }
    );
  }

  const renderMainContent = () => (
    <div className="bg-transparent text-carbon font-serif pb-16">
      <FadeIn className="w-full px-6 md:px-12 pt-4">
        <ContentHeader
          type={theorem.type || 'teorema'}
          typeLabel={displayType}
          title={theorem.title}
          description={theorem.description}
          breadcrumbs={breadcrumbs}
          authors={theorem.authors || []}
          tags={theorem.tags || []}
          color={theorem.color}
          nodeId={theorem.id}
          backLink={parentTheorem ? {
            href: `/teorema/${parentTheorem.id}`,
            label: `← ${TYPE_LABELS[parentTheorem.type || 'teorema'] || 'Teorema'}: ${parentTheorem.title}`,
          } : undefined}
        />

        <ContentBody>
          <theorem.Component />
        </ContentBody>
      </FadeIn>
    </div>
  );

  const renderSecondaryContent = () => (
    <FadeIn>
      {demos.length > 0 && (
        <section className="mb-20">
          <SectionTitle>Demostraciones Disponibles</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {demos.map(demo => (
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
        </section>
      )}

      <MaterialPracticoSection examples={examples} exercises={exercises} />
      <AplicacionesSection useCases={useCases} />

      {lemmas.length > 0 && (
        <section className="my-16">
          <SubtleSeparator />
          <SectionTitle>Lemas Previos</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {lemmas.map(lem => (
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
        </section>
      )}

      {corollaries.length > 0 && (
        <section className="my-16">
          <SubtleSeparator />
          <SectionTitle>Corolarios Derivados</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {corollaries.map(cor => (
              <ContentCard
                key={cor.slug}
                href={`/teorema/${cor.id}`}
                title={cor.title}
                description={cor.description}
                type="corolario"
                layout="row"
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-24">
        <ReadingButton id={slug} />
      </div>
    </FadeIn>
  );

  return (
    <TriptychLayout
      metadata={<MetadataSidebar />}
      diagram={Simulation ? (
        <Suspense fallback={<div className="diagram-loading">Preparando visualización…</div>}>
          <Simulation />
        </Suspense>
      ) : undefined}
      diagramLabel={`Visualización de ${theorem.title}`}
      secondary={renderSecondaryContent()}
    >
      {renderMainContent()}
    </TriptychLayout>
  );
};
