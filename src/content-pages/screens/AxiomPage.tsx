import { useEffect } from 'react';
import { useParams } from 'wouter';
import { db } from '@/data/content';
import { ContentDiagram, ContentLayout } from '@/components/layouts/ContentLayout';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { ContentBody } from '@/components/ui/ContentBody';
import { useMetadataStore } from '@/data/metadata/MetadataStore';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { useI18n } from '@/i18n';

/**
 * Página principal para visualizar un Axioma en detalle.
 * 
 * Se encarga de extraer el slug de la URL, cargar los datos de `ContentStore`
 * y renderizar el contenido estático junto a su simulación gráfica si estuviera disponible.
 */
export function AxiomPage() {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const slug = id || '';
  const axiom = slug ? db.getAxiom(slug, lang) : undefined;
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];
  const setMetadata = useMetadataStore((state) => state.setMetadata);

  useEffect(() => {
    if (axiom) {
      setMetadata({
        title: axiom.title,
        type: 'Axioma',
        tags: axiom.tags || [],
      });
    }
    return () => setMetadata(null);
  }, [axiom, setMetadata]);

  if (!axiom) {
    return (
      <div className="min-h-viewport flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">{t('notFound', 'title')}</h1>
        <p className="text-mora mb-6">{t('notFound', 'description')}</p>
      </div>
    );
  }

  const breadcrumbs = db.getBreadcrumbs(axiom.branch || axiom.tags, { name: t('navigation', 'axioms'), href: getLocalizedPath('/axiomas') }, lang);

  const content = (
    <div className="min-h-viewport bg-transparent text-carbon font-serif pb-32">
      <FadeIn className="w-full px-6 md:px-12 pt-4 pb-16">
        <ContentHeader
          type="axioma"
          title={axiom.title}
          description={axiom.description}
          breadcrumbs={breadcrumbs}
          authors={axiom.authors || []}
          tags={axiom.tags || []}
          nodeId={axiom.id}
        />

        {isFallback && (
          <UntranslatedFallbackBanner
            availableLangs={availableLangs}
            className="mb-8"
          />
        )}

        <section className="mt-8 mb-8">
          <ContentBody>
            <axiom.Component />
          </ContentBody>
        </section>

        <ReadingButton id={axiom.id} />
      </FadeIn>
    </div>
  );

  return (
    <ContentLayout
      pageType="axioma"
      diagram={
        axiom.Simulation ? (
          <ContentDiagram component={axiom.Simulation} />
        ) : undefined
      }
    >
      {content}
    </ContentLayout>
  );
}
