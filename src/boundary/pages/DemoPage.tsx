import React, { Suspense } from 'react';
import { useRoute, Link } from 'wouter';
import { db } from '@/database/dao/content';
import { FadeIn } from '@/boundary/components/ui/FadeIn';
import { ContentHeader } from '@/boundary/components/ui/ContentHeader';

/**
 * Página aislada para visualizar una Demostración paso a paso.
 * 
 * Generalmente consumida a través de enlaces directos desde un Teorema, pero 
 * expone el componente MDX interactivo individualmente.
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
          <Link href="/"><a className="text-terracota hover:underline">Volver al inicio</a></Link>
        </div>
      </div>
    );
  }

  const parentTheorem = demo.parentTheorem ? db.getTheorem(demo.parentTheorem) : null;
  const breadcrumbs = parentTheorem
    ? [{ name: parentTheorem.title, href: `/teorema/${parentTheorem.id}` }]
    : [];

  return (
    <FadeIn>
      <div className="min-h-screen bg-lienzo bg-arts-and-crafts font-serif text-carbon selection:bg-terracota/20 relative w-full">
        <div className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-12">
          <ContentHeader
            type="demostracion"
            typeLabel="Demostración"
            title={demo.title}
            description={demo.description}
            breadcrumbs={breadcrumbs}
            authors={demo.authors || []}
            color="var(--theme-pizarra)"
            nodeId={demo.id}
            backLink={parentTheorem ? {
              href: `/teorema/${parentTheorem.id}`,
              label: `← ${parentTheorem.title}`,
            } : undefined}
            badgesSlot={demo.proofMethod ? (() => {
              const methodLabels: Record<string, string> = {
                directo: 'Método Directo',
                contradiccion: 'Contradicción',
                induccion: 'Inducción',
                contraposicion: 'Contraposición',
                constructivo: 'Constructivo',
                geometrico: 'Geométrico',
                exhaustivo: 'Exhaustivo',
              };
              const methodId = `leccion-metodo-${demo.proofMethod}`;
              return (
                <Link href={`/${methodId}`}>
                  <a className="text-[10px] font-sans uppercase tracking-widest text-terracota border border-terracota/30 px-2 py-1 rounded-sm hover:bg-terracota/10 hover:border-terracota transition-colors">
                    {methodLabels[demo.proofMethod] || demo.proofMethod}
                  </a>
                </Link>
              );
            })() : undefined}
          />
        </div>

        <div className={`mx-auto bg-lienzo shadow-xl border border-carbon/15 relative mb-32 ${demo.layout === 'split' ? 'max-w-7xl' : 'max-w-4xl p-8 md:p-16'}`}>
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-terracota/30 hidden md:block" aria-hidden />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-terracota/30 hidden md:block" aria-hidden />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-terracota/30 hidden md:block" aria-hidden />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-terracota/30 hidden md:block" aria-hidden />

          <Suspense fallback={
            <div className="py-20 text-center text-carbon/50 italic animate-pulse">
              Desenrollando pergamino...
            </div>
          }>
            <div className={demo.layout !== 'split' ? 'prose prose-pizarra prose-lg max-w-none' : ''}>
              <demo.Component />
            </div>
          </Suspense>
        </div>
      </div>
    </FadeIn>
  );
};
