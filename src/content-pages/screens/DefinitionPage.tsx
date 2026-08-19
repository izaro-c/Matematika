import { useEffect } from "react";
import { useParams } from "wouter";
import { db } from "@/data/content";
import { ContentDiagram, ContentLayout } from "@/components/layouts/ContentLayout";
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { useMetadataStore } from '@/data/metadata/MetadataStore';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { MaterialPracticoSection } from '@/components/content/MaterialPracticoSection';
import { AplicacionesSection } from '@/components/content/AplicacionesSection';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { NotFoundState } from '@/components/ui/NotFoundState';
import { useI18n } from '@/i18n';

/**
 * Página para visualizar una Definición Matemática estricta.
 *
 * Busca los metadatos de la definición en el `ContentStore` y renderiza el contenido (texto MDX y simulaciones).
 * Además expone de manera contextual ejemplos, ejercicios y casos de uso prácticos vinculados.
 */
export const DefinitionPage = () => {
  const { id } = useParams();
  const slug = id || '';
  const { lang, currentLanguage } = useI18n();
  const setMetadata = useMetadataStore((state) => state.setMetadata);

  const definition = db.getDefinition(slug, lang);
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];

  useEffect(() => {
    if (definition) {
      setMetadata({
        id: definition.id,
        title: definition.title,
        type: currentLanguage.dictionary.metadata.types['definicion'] || 'Definición',
        tags: definition.tags || [],
        description: definition.description,
      });
    }
    return () => setMetadata(null);
  }, [definition, setMetadata, currentLanguage]);

  if (!definition) {
    return <NotFoundState missingId={slug} />;
  }

  const examples = db.getExamplesByTheorem(definition.id, lang);
  const exercises = db.getExercisesByTheorem(definition.id, lang);
  const useCases = db.getUseCasesByConcept(definition.id, lang);
  const Simulation = definition.Simulation;

  const breadcrumbs = db.getBreadcrumbs(definition.branch || definition.tags, undefined, lang);

  const hasSecondaryContent =
    examples.length > 0 ||
    exercises.length > 0 ||
    useCases.length > 0;

  const renderSecondaryContent = () => (
    <FadeIn>
      <MaterialPracticoSection
        examples={examples}
        exercises={exercises}
      />

      {useCases.length > 0 && (
        <AplicacionesSection
          useCases={useCases}
        />
      )}
    </FadeIn>
  );

  return (
    <ContentLayout
      pageType="definicion"
      diagram={Simulation ? <ContentDiagram component={Simulation} /> : undefined}
      secondary={hasSecondaryContent ? renderSecondaryContent() : undefined}
    >
      <div className="bg-transparent text-carbon font-serif pb-16">
        <FadeIn className="w-full pt-4">
          {isFallback && <UntranslatedFallbackBanner availableLangs={availableLangs} />}
          <ContentHeader
            type="definicion"
            title={definition.title}
            description={definition.description}
            breadcrumbs={breadcrumbs}
            authors={definition.authors || []}
            tags={definition.tags || []}
            nodeId={definition.id}
          />

          <section className="mt-8 mb-8">
            <ContentBody>
              <definition.Component />
            </ContentBody>
          </section>

          <ReadingButton id={slug} />
        </FadeIn>
      </div>
    </ContentLayout>
  );
};
