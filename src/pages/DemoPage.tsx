import React, { Suspense } from 'react';
import { useRoute, Link } from 'wouter';
import { db } from '../store/ContentStore';

export const DemoPage: React.FC = () => {
  const [, params] = useRoute('/demo/:id');
  const demoId = params?.id || '';
  
  const demo = db.getDemo(demoId);
  if (!demo) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] font-serif flex items-center justify-center text-carbon">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Demostración no encontrada</h1>
          <Link href="/"><a className="text-terracota hover:underline">Volver al inicio</a></Link>
        </div>
      </div>
    );
  }

  const parentTheorem = demo.parentTheorem ? db.getTheorem(demo.parentTheorem) : null;

  return (
    <div className="min-h-screen bg-lienzo bg-arts-and-crafts font-serif text-carbon selection:bg-terracota/20 relative w-full">
      
      {/* Contenedor centralizado solo para la cabecera */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        
        {/* RETORNO AL TEOREMA (Elegante y en la parte superior) */}
        {parentTheorem && (
          <div className="mb-16 flex justify-center">
            <Link href={`/teorema/${parentTheorem.id}`}>
              <a className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-carbon/50 hover:text-carbon transition-colors border-b border-transparent hover:border-carbon pb-1">
                &larr; Volver al {parentTheorem.title}
              </a>
            </Link>
          </div>
        )}

        {/* CABECERA AUTOMÁTICA CLÁSICA */}
        <div className="text-center mb-16 relative">
          <span className="text-sm font-sans tracking-widest uppercase text-terracota/80 font-bold mb-4 block">
            Demostración
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-pizarra leading-tight" style={{ fontVariant: 'small-caps' }}>
            {demo.title}
          </h1>
          {demo.description && (
            <p className="text-lg text-carbon/70 italic max-w-2xl mx-auto">
              {demo.description}
            </p>
          )}
          
          <div className="flex justify-center items-center gap-4 mt-8">
            {demo.authors && demo.authors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans uppercase tracking-widest text-carbon/50">Por:</span>
                {demo.authors.map((authorId, idx) => {
                  const author = db.getMathematicianById(authorId);
                  return (
                    <span key={authorId} className="font-bold text-carbon border-b border-carbon/20 pb-0.5">
                      <Link href={`/bio/${author?.slug || authorId}`}>
                        <a className="hover:text-terracota transition-colors">{author?.name || authorId}</a>
                      </Link>
                      {idx < demo.authors!.length - 1 ? ', ' : ''}
                    </span>
                  );
                })}
              </div>
            )}
            
            {demo.authors && demo.authors.length > 0 && demo.proofMethod && (
              <span className="text-carbon/20">&bull;</span>
            )}

            {demo.proofMethod && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans uppercase tracking-widest text-carbon/50">Método:</span>
                <Link href={`/leccion/${demo.proofMethod}`}>
                  <a className="font-bold text-carbon border-b border-carbon/20 pb-0.5 hover:text-salvia transition-colors">
                    {db.getLesson(demo.proofMethod)?.title || demo.proofMethod.replace('-', ' ')}
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* SEPARADOR ORNAMENTAL */}
        <div className="flex justify-center items-center gap-4 mb-20 opacity-40">
          <div className="h-px w-16 bg-carbon"></div>
          <div className="w-2 h-2 rounded-full bg-terracota"></div>
          <div className="h-px w-16 bg-carbon"></div>
        </div>

      </div>

      {/* Contenido MDX de la demostración envuelto en tarjeta Papiro */}
      <div className={`mx-auto bg-lienzo shadow-xl border border-carbon/15 relative mb-32 ${demo.layout === 'split' ? 'max-w-7xl' : 'max-w-4xl p-12 md:p-20'}`}>
        {/* Esquinas decorativas sutiles */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-terracota/30 hidden md:block"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-terracota/30 hidden md:block"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-terracota/30 hidden md:block"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-terracota/30 hidden md:block"></div>

        <Suspense fallback={
          <div className="py-20 text-center text-carbon/50 italic animate-pulse">
            Desenrollando pergaminos...
          </div>
        }>
          <div className={demo.layout !== 'split' ? 'prose prose-pizarra prose-lg max-w-none' : ''}>
            <demo.Component />
          </div>
        </Suspense>
      </div>
    </div>
  );
};
