import React, { Suspense } from 'react';
import { useParams } from 'wouter';
import { db } from '@/data/content';
import { FadeIn } from '@/components/ui/FadeIn';
import { PageLoadingScreen } from '@/components/ui/PageLoadingScreen';
import { DemonstrationHeaderProvider } from '@/lib/page-context/DemonstrationHeaderContext';
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { useI18n } from '@/i18n';
import { NotFoundState } from '@/components/ui/NotFoundState';

/**
 * Página aislada para visualizar una Demostración paso a paso.
 * 
 * Generalmente consumida a través de enlaces directos desde un Teorema, pero 
 * expone el componente MDX interactivo individualmente a pantalla completa.
 */
export const DemoPage: React.FC = () => {
  const { id } = useParams();
  const demoId = id || '';
  const { lang, t } = useI18n();

  const demo = db.getDemo(demoId, lang);

  if (!demo) {
    return <NotFoundState />;
  }

  return (
    <FadeIn>
      <div className="ac-page relative w-full">
        <Suspense fallback={<PageLoadingScreen message={t('common', 'loading')} />}>
          <DemonstrationHeaderProvider key={demoId}>
            <demo.Component />
            <ReadingButton id={demoId} />
          </DemonstrationHeaderProvider>
        </Suspense>
      </div>
    </FadeIn>
  );
};
export default DemoPage;
