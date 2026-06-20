import type { Demo, Theorem } from '../store/content/types';
import { useParams } from "wouter";
import { db } from "../store/content";
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { ReadingButton } from '../components/ui/ReadingButton';
import { FadeIn } from '../components/ui/FadeIn';
import { ContentCard } from '../components/ui/ContentCard';
import { ContentHeader } from '../components/ui/ContentHeader';
import { ContentBody } from '../components/ui/ContentBody';
import { MaterialPracticoSection } from '../components/ui/MaterialPracticoSection';
import { AplicacionesSection } from '../components/ui/AplicacionesSection';
import { SubtleSeparator } from '../components/ui/SubtleSeparator';

const TYPE_LABELS: Record<string, string> = {
  teorema: 'Teorema',
  lema: 'Lema',
  corolario: 'Corolario',
};

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

  const corollaries = theorem.corollaries?.map(cId => db.getTheorem(cId)).filter(Boolean) as Theorem[] || [];
  const lemmas = theorem.lemmas?.map(lId => db.getTheorem(lId)).filter(Boolean) as Theorem[] || [];
  const demos = theorem.demos?.map(dId => db.demos.get(dId) || Array.from(db.demos.values()).find(d => d.slug === dId)).filter(Boolean) as Demo[] || [];
  const parentTheorem = theorem.parentTheorem ? db.getTheorem(theorem.parentTheorem) : null;
  const examples = db.getExamplesByTheorem(theorem.id);
  const exercises = db.getExercisesByTheorem(theorem.id);
  const useCases = db.getUseCasesByConcept(theorem.id);

  const displayType = TYPE_LABELS[theorem.type || 'teorema'] || 'Teorema';

  const breadcrumbs: { name: string; href?: string }[] = [];
  if (theorem.tags && theorem.tags.length > 0) {
    const mainBranch = theorem.tags[0];
    const taxonomy = db.getBranchTaxonomy(mainBranch);
    breadcrumbs.push(
      ...taxonomy.breadcrumbs.map(b => ({ name: b.name, href: `/rama/${b.slug}` })),
      { name: taxonomy.name || taxonomy.id, href: `/rama/${taxonomy.slug}` }
    );
  }

  const renderContent = () => (
    <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
      <FadeIn className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
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

        {demos.length > 0 && (
          <section className="mb-24 mt-24">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-8 border-b border-carbon/10 pb-4" style={{ fontVariant: 'small-caps' }}>
              Demostraciones Disponibles
            </h2>
            <div className="flex flex-col gap-4">
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
          <section className="mt-24">
            <SubtleSeparator />
            <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontVariant: 'small-caps' }}>
              Lemas Previos
            </h2>
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
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
          <section className="mt-24">
            <SubtleSeparator />
            <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontVariant: 'small-caps' }}>
              Corolarios Derivados
            </h2>
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
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
