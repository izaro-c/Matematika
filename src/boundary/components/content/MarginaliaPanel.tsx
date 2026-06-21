import { useGlossaryStore, dictionary } from '@/controller/store/GlossaryStore';
import { db } from '@/database/dao/content';
import katex from 'katex';
import { Link } from 'wouter';
import { ContentTypeBadge } from '@/boundary/components/ui/ContentTypeBadge';

interface TermData {
  title: string;
  definition: string;
  statement?: string;
  id: string;
  type?: string;
  typeLabel?: string;
  href?: string;
  equation?: string;
}

export const MarginaliaPanel = () => {
  const { activeTerms, activeFormulaTerms, closeTerm, displayMode, toggleDisplayMode } = useGlossaryStore();

  const activeTermDataList: (TermData & { isDefinition: boolean })[] = [];

  if (activeTerms) {
    activeTerms.forEach(activeTerm => {
      let termData: TermData | null = (dictionary[activeTerm] as any as TermData) || null;
      let isDefinition = false;

      if (!termData) {
        const theorem = db.getTheorem(activeTerm);
        const definition = db.getDefinition(activeTerm);
        const bio = db.getMathematicianById(activeTerm);
        const lesson = db.lessons.get(activeTerm);
        const example = db.examples.get(activeTerm);
        const exercise = db.exercises.get(activeTerm);
        const useCase = db.usecases.get(activeTerm);
        const axiom = db.axioms.get(activeTerm);
        const system = db.getAxiomaticSystem(activeTerm);
        const model = db.models.get(activeTerm);
        const demo = db.demos.get(activeTerm);

        const entity = theorem || definition || bio || lesson || example || exercise || useCase || axiom || system || model || demo;

        if (entity) {
          let typeLabel = 'Concepto';
          let type = 'leccion';
          let href = '/';

          if (theorem) {
            const t = theorem.type as string;
            type = (t === 'lema' || t === 'lemma') ? 'lema' : (t === 'corolario' || t === 'corollary') ? 'corolario' : 'teorema';
            typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
            href = `/Matematika/teorema/${theorem.slug}`;
          } else if (definition) {
            type = 'definicion'; typeLabel = 'Definición';
            href = `/Matematika/definicion/${definition.slug}`;
          } else if (bio) {
            type = 'matematico'; typeLabel = 'Matemático';
            href = `/Matematika/bio/${bio.slug}`;
          } else if (lesson) {
            type = 'leccion'; typeLabel = 'Lección';
            href = `/Matematika/${lesson.slug}`;
          } else if (example) {
            type = 'ejemplo'; typeLabel = 'Ejemplo';
            href = `/Matematika/ejemplo/${example.slug}`;
          } else if (exercise) {
            type = 'ejercicio'; typeLabel = 'Ejercicio';
            href = `/Matematika/ejercicio/${exercise.slug}`;
          } else if (useCase) {
            type = 'caso-de-uso'; typeLabel = 'Caso de Uso';
            href = `/Matematika/caso/${useCase.slug}`;
          } else if (axiom) {
            type = 'axioma'; typeLabel = 'Axioma';
            href = `/Matematika/axioma/${axiom.slug}`;
          } else if (system) {
            type = 'sistema-axiomatico'; typeLabel = 'Sistema Axiomático';
            href = `/Matematika/sistema/${system.slug}`;
          } else if (model) {
            type = 'modelo'; typeLabel = 'Modelo';
            href = `/Matematika/modelo/${model.slug}`;
          } else if (demo) {
            type = 'demostracion'; typeLabel = 'Demostración';
            href = `/Matematika/demo/${demo.slug}`;
          }

          const e = entity as any;
          termData = {
            title: (e.title as string) || (e.name as string),
            definition: e.description as string,
            statement: e.statement as string | undefined,
            id: entity.slug,
            type,
            typeLabel,
            href,
          };
          isDefinition = true;
        }
      }

      if (termData) {
        activeTermDataList.push({ ...termData, isDefinition });
      }
    });
  }

  const formulaData = activeFormulaTerms ? activeFormulaTerms.map(id => dictionary[id]).filter(Boolean) : null;
  const isActive = (activeTerms !== null && activeTerms.length > 0) || (activeFormulaTerms !== null && activeFormulaTerms.length > 0);

  const renderMath = (mathString: string) => {
    try {
      return { __html: katex.renderToString(mathString, { displayMode: true, throwOnError: false }) };
    } catch {
      return { __html: mathString };
    }
  };

  const renderTextWithMath = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\$.*?\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        try {
          return <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { throwOnError: false, displayMode: false }) }} />;
        } catch {
          return <span key={i}>{part}</span>;
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  const isSidebar = displayMode === 'sidebar';

  return (
    <>
      <div
        className={`fixed inset-0 bg-carbon/30 backdrop-blur-sm z-40 transition-opacity duration-500
          ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeTerm}
      />

      <div
        className={`parchment-panel fixed z-50 shadow-2xl overflow-y-auto flex flex-col font-serif
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isSidebar
            ? `top-0 right-0 h-full w-full max-w-md ${isActive ? 'translate-x-0' : 'translate-x-full'}`
            : `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-xl max-h-[85vh] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`
          }`}
      >
        {/* Esquinas ornamentales */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-terracota/40 pointer-events-none" aria-hidden />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-terracota/40 pointer-events-none" aria-hidden />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-terracota/40 pointer-events-none" aria-hidden />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-terracota/40 pointer-events-none" aria-hidden />

        <div className="p-10 md:p-12 h-full flex flex-col relative">
          <div className="absolute top-5 right-5 flex gap-3 text-carbon/40 font-sans z-10">
            <button
              onClick={toggleDisplayMode}
              className="hover:text-terracota transition-colors text-sm p-2 rounded-sm hover:bg-carbon/5"
              title={isSidebar ? 'Cambiar a ventana flotante' : 'Cambiar a panel lateral'}
              aria-label="Cambiar modo de visualización"
            >
              {isSidebar ? '⧉' : '◫'}
            </button>
            <button
              onClick={closeTerm}
              className="hover:text-terracota transition-colors text-2xl leading-none p-2 rounded-sm hover:bg-carbon/5"
              aria-label="Cerrar panel"
            >
              ×
            </button>
          </div>

          <div className="mt-6">
            {activeTermDataList.length > 0 ? (
              <div className="flex flex-col">
                {activeTermDataList.map((term, idx) => (
                  <article key={idx} className="mb-12 last:mb-0">
                    {/* Badge tipo */}
                    {term.type && (
                      <div className="mb-4">
                        <ContentTypeBadge type={term.type} label={term.typeLabel} />
                      </div>
                    )}

                    {/* Capitular + título */}
                    <h2
                      className="text-4xl md:text-5xl text-carbon mb-4 font-bold leading-tight"
                      style={{ fontVariant: 'small-caps' }}
                    >
                      <span className="float-left text-5xl md:text-6xl font-serif text-terracota font-bold pr-3 pl-1 leading-[0.7] mt-2 select-none">
                        {term.title.charAt(0)}
                      </span>
                      {term.title.slice(1)}
                    </h2>

                    {/* Separador ornamental */}
                    <div className="flex items-center gap-3 my-6 opacity-50">
                      <div className="w-12 h-px bg-terracota/60" />
                      <span className="text-terracota/60 text-xs">✦</span>
                      <div className="flex-1 h-px bg-carbon/15" />
                    </div>

                    {/* Definición */}
                    <p className="text-lg text-carbon/85 leading-relaxed italic border-l-2 border-terracota/30 pl-5 mb-6">
                      {term.definition}
                    </p>

                    {/* Enunciado formal */}
                    {term.statement && (
                      <div className="mt-6 p-5 bg-terracota/[0.04] border-l-4 border-terracota/60">
                        <h5 className="text-terracota font-sans font-bold text-[10px] uppercase tracking-widest mb-3">
                          Enunciado
                        </h5>
                        <p className="italic text-carbon/90 m-0 leading-relaxed text-base">
                          {renderTextWithMath(term.statement)}
                        </p>
                      </div>
                    )}

                    {/* Ecuación */}
                    {term.equation && (
                      <div
                        className="mt-6 p-5 bg-carbon/[0.03] border border-carbon/10 text-center font-mono text-xl text-carbon overflow-x-auto"
                        dangerouslySetInnerHTML={renderMath(term.equation)}
                      />
                    )}

                    {/* CTA */}
                    {term.isDefinition && term.href && (
                      <div className="mt-10 text-center">
                        <Link href={term.href}>
                          <a
                            onClick={closeTerm}
                            className="inline-block px-8 py-3 border border-carbon/20 hover:border-terracota hover:text-terracota transition-all text-xs font-sans tracking-widest uppercase font-bold"
                          >
                            Leer Artículo Completo →
                          </a>
                        </Link>
                      </div>
                    )}

                    {/* Separador inferior si hay múltiples términos */}
                    {idx < activeTermDataList.length - 1 && (
                      <div className="mt-10 flex justify-center opacity-30 text-terracota text-xl">❦</div>
                    )}
                  </article>
                ))}
              </div>
            ) : formulaData && formulaData.length > 0 ? (
              <div className="flex flex-col">
                {formulaData.map((data, idx) => (
                  <article key={idx} className="mb-12 last:mb-0">
                    <h2 className="text-4xl text-carbon mb-4 font-bold" style={{ fontVariant: 'small-caps' }}>
                      <span className="float-left text-5xl font-serif text-terracota font-bold pr-3 pl-1 leading-[0.7] mt-2 select-none">
                        {data.title.charAt(0)}
                      </span>
                      {data.title.slice(1)}
                    </h2>
                    <div className="flex items-center gap-3 my-6 opacity-50">
                      <div className="w-12 h-px bg-terracota/60" />
                      <span className="text-terracota/60 text-xs">✦</span>
                      <div className="flex-1 h-px bg-carbon/15" />
                    </div>
                    <p className="text-lg text-carbon/85 leading-relaxed italic border-l-2 border-terracota/30 pl-5">
                      {data.definition}
                    </p>
                    {data.equation && (
                      <div
                        className="mt-6 p-5 bg-carbon/[0.03] border border-carbon/10 text-center font-mono text-xl text-carbon overflow-x-auto"
                        dangerouslySetInnerHTML={renderMath(data.equation)}
                      />
                    )}
                    {idx < formulaData.length - 1 && (
                      <div className="mt-10 flex justify-center opacity-30 text-terracota text-xl">❦</div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="italic text-carbon/50 text-center mt-12">No se han encontrado símbolos reconocidos en esta expresión.</p>
            )}
          </div>

          {isSidebar && (
            <div className="mt-auto pt-8 pb-2 flex justify-center opacity-30 text-terracota text-sm">❦</div>
          )}
        </div>
      </div>
    </>
  );
};
