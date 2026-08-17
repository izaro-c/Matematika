import React, { Suspense } from 'react';
import { useParams, Link } from 'wouter';
import { db } from '@/data/content';
import { FadeIn } from '@/components/ui/FadeIn';
import { PageLoadingScreen } from '@/components/ui/PageLoadingScreen';
import { DemonstrationHeaderProvider } from '@/lib/page-context/DemonstrationHeaderContext';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { useI18n } from '@/i18n';

/**
 * Página aislada para visualizar una Demostración paso a paso.
 * 
 * Generalmente consumida a través de enlaces directos desde un Teorema, pero 
 * expone el componente MDX interactivo individualmente a pantalla completa.
 */
export const DemoPage: React.FC = () => {
  const { id } = useParams();
  const demoId = id || '';
  const { lang, getLocalizedPath, t } = useI18n();

  const demo = db.getDemo(demoId, lang);
  const isFallback = demoId ? db.isFallback(demoId, lang) : false;
  const availableLangs = demoId ? db.getAvailableLanguages(demoId) : ['es'];

  if (!demo) {
    return (
      <div className="min-h-viewport bg-lienzo font-serif flex items-center justify-center text-carbon">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('notFound', 'title')}</h1>
          <Link href={getLocalizedPath('/')} className="page-accent-text hover:underline">
            {t('topbar', 'backToLibrary')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="ac-page relative w-full">
        {isFallback && (
          <div className="max-w-4xl mx-auto px-6 pt-6">
            <UntranslatedFallbackBanner availableLangs={availableLangs} />
          </div>
        )}
        <Suspense fallback={<PageLoadingScreen message={t('common', 'loading')} />}>
          <DemonstrationHeaderProvider key={demoId}>
            <demo.Component />
          </DemonstrationHeaderProvider>
        </Suspense>
      </div>
    </FadeIn>
  );
};
export default DemoPage;
