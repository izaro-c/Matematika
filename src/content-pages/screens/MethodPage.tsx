import { useEffect } from 'react';
import { useParams } from 'wouter';
import { db } from '@/data/content';
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { useMetadataStore } from '@/data/metadata/MetadataStore';
import { ContentBody } from '@/components/ui/ContentBody';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentLayout } from '@/components/layouts/ContentLayout';
import { DiagramSlot } from '@/components/ui/skeletons';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { useI18n } from '@/i18n';
import { NotFoundState } from '@/components/ui/NotFoundState';

/** Página canónica para procedimientos matemáticos reutilizables. */
export const MethodPage = () => {
  const { id = '' } = useParams();
  const { lang, currentLanguage } = useI18n();
  const method = db.getMethod(id, lang);
  const isFallback = id ? db.isFallback(id, lang) : false;
  const availableLangs = id ? db.getAvailableLanguages(id) : ['es'];
  const setMetadata = useMetadataStore((state) => state.setMetadata);

  useEffect(() => {
    if (method) {
      setMetadata({
        id: method.id,
        title: method.title,
        type: currentLanguage.dictionary.metadata.types['metodo'] || 'Método',
        tags: method.tags ?? [],
        description: method.description,
      });
    }
    return () => setMetadata(null);
  }, [method, setMetadata, currentLanguage]);

  if (!method) {
    return <NotFoundState />;
  }

  const Diagram = method.Simulation;
  const breadcrumbs = db.getBreadcrumbs(method.branch || method.tags, undefined, lang);

  return (
    <ContentLayout
      pageType="metodo"
      variant="balanced"
      diagram={Diagram ? (
        <DiagramSlot>
          <Diagram />
        </DiagramSlot>
      ) : undefined}
      diagramLabel={method.title}
    >
      <FadeIn className="w-full pb-16 pt-4 text-carbon">
        <ContentHeader
          type="metodo"
          title={method.title}
          description={method.description}
          authors={method.authors ?? []}
          tags={method.tags ?? []}
          nodeId={method.id}
          breadcrumbs={breadcrumbs}
        />

        {isFallback && (
          <UntranslatedFallbackBanner
            availableLangs={availableLangs}
            className="mb-8"
          />
        )}

        <section className="mb-12">
          <ContentBody>
            <method.Component />
          </ContentBody>
        </section>

        <ReadingButton id={method.id} />
      </FadeIn>
    </ContentLayout>
  );
};
