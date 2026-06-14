import React from 'react';
import { useGlossaryStore, dictionary } from '../store/GlossaryStore';
import katex from 'katex';

export const MarginaliaPanel = () => {
  const { activeTerm, activeFormulaTerms, closeTerm, displayMode, toggleDisplayMode } = useGlossaryStore();

  const termData = activeTerm ? dictionary[activeTerm] : null;
  const formulaData = activeFormulaTerms ? activeFormulaTerms.map(id => dictionary[id]).filter(Boolean) : null;

  const isActive = activeTerm !== null || activeFormulaTerms !== null;

  const renderMath = (mathString: string) => {
    try {
      return { __html: katex.renderToString(mathString, { displayMode: true, throwOnError: false }) };
    } catch (e) {
      return { __html: mathString };
    }
  };

  const isSidebar = displayMode === 'sidebar';

  return (
    <>
      <div 
        className={`fixed inset-0 bg-carbon/20 backdrop-blur-sm z-40 transition-opacity duration-500
          ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeTerm}
      />

      <div 
        className={`fixed z-50 bg-lienzo shadow-2xl overflow-y-auto flex flex-col font-serif
          transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${isSidebar 
            ? `top-0 right-0 h-full w-full max-w-sm border-l-4 border-double border-carbon/20 ${isActive ? 'translate-x-0' : 'translate-x-full'}` 
            : `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg max-h-[80vh] rounded-xl border-2 border-carbon/10 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`
          }`}
      >
        <div className="p-8 h-full flex flex-col relative">
          <div className="absolute top-4 right-4 flex gap-4 text-carbon/40 font-sans z-10">
            <button 
              onClick={toggleDisplayMode}
              className="hover:text-terracota transition-colors text-sm"
              title={isSidebar ? "Cambiar a ventana flotante" : "Cambiar a panel lateral"}
            >
              {isSidebar ? '⧉' : '◫'}
            </button>
            <button 
              onClick={closeTerm}
              className="hover:text-terracota transition-colors text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="mt-8">
            {termData ? (
              // Vista de TÉRMINO ÚNICO
              <div className="mb-12">
                <h2 className="text-4xl text-carbon mb-6 font-bold" style={{ fontVariant: 'small-caps' }}>
                  {termData.title}
                </h2>
                <div className="w-12 h-[1px] bg-terracota/50 mb-6" />
                <p className="text-lg text-carbon/80 leading-relaxed italic border-l-2 border-carbon/10 pl-4">
                  {termData.definition}
                </p>
                {termData.equation && (
                  <div 
                    className="mt-8 p-4 bg-carbon/5 border border-carbon/10 text-center font-mono text-xl text-carbon shadow-inner overflow-x-auto"
                    dangerouslySetInnerHTML={renderMath(termData.equation)}
                  />
                )}
              </div>
            ) : formulaData && formulaData.length > 0 ? (
              // Vista de FÓRMULA (Múltiples Términos con misma estética)
              <div className="flex flex-col">
                {formulaData.map((data, idx) => (
                  <div key={idx} className="mb-12 last:mb-0">
                    <h2 className="text-4xl text-carbon mb-6 font-bold" style={{ fontVariant: 'small-caps' }}>
                      {data.title}
                    </h2>
                    <div className="w-12 h-[1px] bg-terracota/50 mb-6" />
                    <p className="text-lg text-carbon/80 leading-relaxed italic border-l-2 border-carbon/10 pl-4">
                      {data.definition}
                    </p>
                    {data.equation && (
                      <div 
                        className="mt-8 p-4 bg-carbon/5 border border-carbon/10 text-center font-mono text-xl text-carbon shadow-inner overflow-x-auto"
                        dangerouslySetInnerHTML={renderMath(data.equation)}
                      />
                    )}
                    {idx < formulaData.length - 1 && (
                      <div className="mt-12 flex justify-center opacity-20 text-carbon text-2xl">
                        ❧
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-carbon/50 text-center mt-12">No se han encontrado símbolos reconocidos en esta expresión.</p>
            )}
          </div>
          
          {isSidebar && (
            <div className="mt-auto pt-12 pb-4 flex justify-center opacity-30 text-carbon">
              ❦
            </div>
          )}
        </div>
      </div>
    </>
  );
};
