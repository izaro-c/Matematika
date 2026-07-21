import React, { Suspense } from 'react';
import { useRoute, Link } from 'wouter';
import { db } from '@/entities/content';
import { FadeIn } from '@/shared/ui/FadeIn';
import { DemonstrationHeaderProvider } from '@/shared/lib/DemonstrationHeaderContext';

/**
 * Página aislada para visualizar una Demostración paso a paso.
 * 
 * Generalmente consumida a través de enlaces directos desde un Teorema, pero 
 * expone el componente MDX interactivo individualmente a pantalla completa.
 */
export const DemoPage: React.FC = () => {
  const [, params] = useRoute('/demo/:id');
  const demoId = params?.id || '';

  const demo = db.getDemo(demoId);
  if (!demo) {
    return (
      <div className="min-h-screen bg-lienzo font-serif flex items-center justify-center text-carbon">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Demostración no encontrada</h1>
          <Link href="/" className="page-accent-text hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="min-h-screen bg-lienzo font-serif text-carbon relative w-full">
        <Suspense fallback={
          <div className="py-20 text-center text-carbon/50 italic animate-pulse">
            Desenrollando pergamino...
          </div>
        }>
          <DemonstrationHeaderProvider key={demoId}>
            <demo.Component />
          </DemonstrationHeaderProvider>
        </Suspense>
      </div>
    </FadeIn>
  );
};
export default DemoPage;
