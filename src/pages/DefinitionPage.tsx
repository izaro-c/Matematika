import { useParams } from "wouter";
import { db } from "../store/content";
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { ReadingButton } from '../components/ui/ReadingButton';
import { FadeIn } from '../components/ui/FadeIn';
import { ContentHeader } from '../components/ui/ContentHeader';
import { ContentBody } from '../components/ui/ContentBody';
import { MaterialPracticoSection } from '../components/ui/MaterialPracticoSection';
import { AplicacionesSection } from '../components/ui/AplicacionesSection';

export const DefinitionPage = () => {
  const { id } = useParams();
  const slug = id || '';

  const definition = db.getDefinition(slug);
  if (!definition) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl">La definición especificada no existe o no ha sido catalogada.</h1>
      </div>
    );
  }

  const examples = db.getExamplesByTheorem(definition.id);
  const exercises = db.getExercisesByTheorem(definition.id);
  const useCases = db.getUseCasesByConcept(definition.id);

  const breadcrumbs: { name: string; href?: string }[] = [];
  if (definition.tags && definition.tags.length > 0) {
    const mainBranch = definition.tags[0];
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
          type="definicion"
          title={definition.title}
          description={definition.description}
          breadcrumbs={breadcrumbs}
          authors={definition.authors || []}
          tags={definition.tags || []}
          color={definition.color}
          nodeId={definition.id}
        />

        <ContentBody>
          <definition.Component />
        </ContentBody>

        <MaterialPracticoSection examples={examples} exercises={exercises} />
        <AplicacionesSection useCases={useCases} />

        <ReadingButton id={slug} />
      </FadeIn>
    </div>
  );

  return (
    <SimulationLayout simulationComponent={definition.Simulation}>
      {renderContent()}
    </SimulationLayout>
  );
};
