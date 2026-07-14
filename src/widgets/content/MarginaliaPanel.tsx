import { useGlossaryStore, dictionary } from '@/features/glossary/GlossaryStore';
import { db } from '@/entities/content';
import type { 
  Theorem, Definition, Mathematician, Lesson, 
  Example, Exercise, UseCase, Axiom, 
  AxiomaticSystem, Model, Demo 
} from '@/entities/content';
import katex from 'katex';
import { Link } from 'wouter';
import { ContentTypeBadge } from '@/shared/ui/ContentTypeBadge';
import { routePath } from '@/shared/lib/routeHelper';
import { getContentPageAccent } from '@/shared/design/pageAccents';


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

interface TermMeta {
  type: string;
  typeLabel: string;
  href: string;
}

function getTheoremType(t: string): string {
  if (t === 'lema' || t === 'lemma') return 'lema';
  if (t === 'corolario' || t === 'corollary') return 'corolario';
  return 'teorema';
}

interface EntityWrapper {
  theorem?: Theorem | null;
  definition?: Definition | null;
  bio?: Mathematician | null;
  lesson?: Lesson | null;
  example?: Example | null;
  exercise?: Exercise | null;
  useCase?: UseCase | null;
  axiom?: Axiom | null;
  system?: AxiomaticSystem | null;
  model?: Model | null;
  demo?: Demo | null;
  slug?: string;
}

function resolveEntityMeta(entity: EntityWrapper): TermMeta | null {
  if (entity.theorem) {
    const t = entity.theorem.type || 'teorema';
    const type = getTheoremType(t);
    return {
      type,
      typeLabel: type.charAt(0).toUpperCase() + type.slice(1),
      href: routePath(`/teorema/${entity.theorem.slug}`),
    };
  }
  if (entity.definition) return { type: 'definicion', typeLabel: 'Definición', href: routePath(`/definicion/${entity.definition.slug}`) };
  if (entity.bio) return { type: 'matematico', typeLabel: 'Matemático', href: routePath(`/bio/${entity.bio.slug}`) };
  if (entity.lesson) return { type: 'leccion', typeLabel: 'Lección', href: routePath(`/${entity.lesson.slug}`) };
  if (entity.example) return { type: 'ejemplo', typeLabel: 'Ejemplo', href: routePath(`/ejemplo/${entity.example.slug}`) };
  if (entity.exercise) return { type: 'ejercicio', typeLabel: 'Ejercicio', href: routePath(`/ejercicio/${entity.exercise.slug}`) };
  if (entity.useCase) return { type: 'caso-de-uso', typeLabel: 'Caso de Uso', href: routePath(`/caso/${entity.useCase.slug}`) };
  if (entity.axiom) return { type: 'axioma', typeLabel: 'Axioma', href: routePath(`/axioma/${entity.axiom.slug}`) };
  if (entity.system) return { type: 'sistema-axiomatico', typeLabel: 'Sistema Axiomático', href: routePath(`/sistema/${entity.system.slug}`) };
  if (entity.model) return { type: 'modelo', typeLabel: 'Modelo', href: routePath(`/modelo/${entity.model.slug}`) };
  if (entity.demo) return { type: 'demostracion', typeLabel: 'Demostración', href: routePath(`/demo/${entity.demo.slug}`) };
  return null;
}

function resolveTermFromDb(activeTerm: string): TermData | null {
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
  if (!entity) return null;

  const meta = resolveEntityMeta({
    theorem,
    definition,
    bio,
    lesson,
    example,
    exercise,
    useCase,
    axiom,
    system,
    model,
    demo,
  });

  type UnifiedEntity = {
    title?: string;
    name?: string;
    description?: string;
    statement?: string;
  };

  const e = entity as unknown as UnifiedEntity;
  return {
    title: (e.title || e.name) ?? '',
    definition: e.description ?? '',
    statement: e.statement,
    id: entity.slug,
    type: meta?.type,
    typeLabel: meta?.typeLabel,
    href: meta?.href,
  };
}

function buildActiveTermDataList(activeTerms: string[] | null): (TermData & { isDefinition: boolean })[] {
  if (!activeTerms) return [];
  const result: (TermData & { isDefinition: boolean })[] = [];

  activeTerms.forEach(activeTerm => {
    let termData: TermData | null = (dictionary[activeTerm] as unknown as TermData) || null;
    let isDefinition = false;

    if (!termData) {
      termData = resolveTermFromDb(activeTerm);
      if (termData) {
        isDefinition = true;
      }
    }

    if (termData) {
      result.push({ ...termData, isDefinition });
    }
  });

  return result;
}

function computePanelClassName(isSidebar: boolean, isActive: boolean): string {
  let base = 'parchment-panel fixed z-50 shadow-2xl flex flex-col font-serif transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]';
  if (isSidebar) {
    base += ' top-0 right-0 h-full w-full max-w-md';
    base += isActive ? ' translate-x-0' : ' translate-x-full';
  } else {
    base += ' top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-xl max-h-[85vh]';
    base += isActive ? ' opacity-100 scale-100' : ' opacity-0 scale-95 pointer-events-none';
  }
  return base;
}

function buildFormulaData(activeFormulaTerms: string[] | null): TermData[] | null {
  if (!activeFormulaTerms) return null;
  return activeFormulaTerms.map(id => dictionary[id]).filter(Boolean) as unknown as TermData[];
}

function renderMathString(mathString: string): { __html: string } {
  try {
    return { __html: katex.renderToString(mathString, { displayMode: true, throwOnError: false }) };
  } catch {
    return { __html: mathString };
  }
}

function renderTextWithMath(text: string): React.ReactNode {
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
}

export const MarginaliaPanel = () => {
  const { activeTerms, activeFormulaTerms, closeTerm, displayMode, toggleDisplayMode } = useGlossaryStore();

  const activeTermDataList = buildActiveTermDataList(activeTerms);
  const formulaData = buildFormulaData(activeFormulaTerms);

  const isActive = (activeTerms !== null && activeTerms.length > 0) ||
                   (activeFormulaTerms !== null && activeFormulaTerms.length > 0);

  const isSidebar = displayMode === 'sidebar';
  const panelClassName = computePanelClassName(isSidebar, isActive);

  // Resolver el color del panel a partir del primer término visible (fallback glosario -> piedra)
  const firstType = activeTermDataList[0]?.type || formulaData?.[0]?.type || 'glosario';
  const panelAccent = getContentPageAccent(firstType);

  let panelContent: React.ReactNode;
  if (activeTermDataList.length > 0) {
    panelContent = (
      <div className="flex flex-col">
        {activeTermDataList.map((term, idx) => {
          const accent = getContentPageAccent(term.type);
          return (
            <article
              key={idx}
              className="mb-12 last:mb-0"
              style={{ '--page-accent': accent } as React.CSSProperties}
            >
              {term.type && (
                <div className="mb-4">
                  <ContentTypeBadge type={term.type} label={term.typeLabel} />
                </div>
              )}
              <h2
                className="text-4xl md:text-5xl text-carbon mb-4 font-bold leading-tight"
              >
                <span className="page-accent-text float-left text-5xl md:text-6xl font-serif font-bold pr-3 pl-1 leading-[0.7] mt-2 select-none">
                  {term.title.charAt(0)}
                </span>
                {term.title.slice(1)}
              </h2>
              <div className="flex items-center gap-3 my-6 opacity-50">
                <div className="page-accent-bg w-12 h-px opacity-60" />
                <span className="page-accent-text opacity-60 text-xs">✦</span>
                <div className="flex-1 h-px bg-carbon/15" />
              </div>
              <p className="page-accent-border text-lg text-carbon/85 leading-relaxed italic border-l-2 pl-5 mb-6">
                {term.definition}
              </p>
              {term.statement && (
                <div className="page-accent-border mt-6 p-5 border-l-4" style={{ backgroundColor: 'color-mix(in srgb, var(--page-accent) 4%, transparent)' }}>
                  <h5 className="page-accent-text font-sans font-bold text-[10px] uppercase tracking-widest mb-3">
                    Enunciado
                  </h5>
                  <p className="italic text-carbon/90 m-0 leading-relaxed text-base">
                    {renderTextWithMath(term.statement)}
                  </p>
                </div>
              )}
              {term.equation && (
                <div
                  className="mt-6 p-5 bg-carbon/[0.03] border border-carbon/10 text-center font-mono text-xl text-carbon overflow-x-auto"
                  dangerouslySetInnerHTML={renderMathString(term.equation)}
                />
              )}
              {term.isDefinition && term.href && (
                <div className="mt-10 text-center">
                  <Link href={term.href}>
                    <a
                      onClick={closeTerm}
                      className="page-accent-hover inline-block px-8 py-3 border border-carbon/20 transition-all text-xs font-sans tracking-widest uppercase font-bold"
                    >
                      Leer Artículo Completo →
                    </a>
                  </Link>
                </div>
              )}
              {idx < activeTermDataList.length - 1 && (
                <div className="page-accent-text mt-10 flex justify-center opacity-30 text-xl">❦</div>
              )}
            </article>
          );
        })}
      </div>
    );
  } else if (formulaData && formulaData.length > 0) {
    panelContent = (
      <div className="flex flex-col">
        {formulaData.map((data, idx) => {
          const accent = getContentPageAccent(data.type ?? 'glosario');
          return (
            <article
              key={idx}
              className="mb-12 last:mb-0"
              style={{ '--page-accent': accent } as React.CSSProperties}
            >
              <h2 className="text-4xl text-carbon mb-4 font-bold">
                <span className="page-accent-text float-left text-5xl font-serif font-bold pr-3 pl-1 leading-[0.7] mt-2 select-none">
                  {data.title.charAt(0)}
                </span>
                {data.title.slice(1)}
              </h2>
              <div className="flex items-center gap-3 my-6 opacity-50">
                <div className="page-accent-bg w-12 h-px opacity-60" />
                <span className="page-accent-text opacity-60 text-xs">✦</span>
                <div className="flex-1 h-px bg-carbon/15" />
              </div>
              <p className="page-accent-border text-lg text-carbon/85 leading-relaxed italic border-l-2 pl-5">
                {data.definition}
              </p>
              {data.equation && (
                <div
                  className="mt-6 p-5 bg-carbon/[0.03] border border-carbon/10 text-center font-mono text-xl text-carbon overflow-x-auto"
                  dangerouslySetInnerHTML={renderMathString(data.equation)}
                />
              )}
              {idx < formulaData.length - 1 && (
                <div className="page-accent-text mt-10 flex justify-center opacity-30 text-xl">❦</div>
              )}
            </article>
          );
        })}
      </div>
    );
  } else {
    panelContent = (
      <p className="italic text-carbon/50 text-center mt-12">No se han encontrado símbolos reconocidos en esta expresión.</p>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-carbon/30 backdrop-blur-sm z-40 transition-opacity duration-500
          ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeTerm}
      />

      <div className={panelClassName} style={{ '--page-accent': panelAccent } as React.CSSProperties}>
        <div className="h-full flex flex-col relative overflow-hidden">
          <div className="absolute top-5 right-5 flex gap-3 text-carbon/40 font-sans z-20">
            <button
              onClick={toggleDisplayMode}
              className="page-accent-hover transition-colors text-sm p-2 rounded-sm"
              title={isSidebar ? 'Cambiar a ventana flotante' : 'Cambiar a panel lateral'}
              aria-label="Cambiar modo de visualización"
            >
              {isSidebar ? '⧉' : '◫'}
            </button>
            <button
              onClick={closeTerm}
              className="page-accent-hover transition-colors text-2xl leading-none p-2 rounded-sm"
              aria-label="Cerrar panel"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto h-full relative">
            <div className="p-10 md:p-12 min-h-full flex flex-col relative">
              <div className="page-accent-border absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 opacity-40 pointer-events-none" aria-hidden />
              <div className="page-accent-border absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 opacity-40 pointer-events-none" aria-hidden />
              <div className="page-accent-border absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 opacity-40 pointer-events-none" aria-hidden />
              <div className="page-accent-border absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 opacity-40 pointer-events-none" aria-hidden />

              <div className="mt-2 flex-1">
                {panelContent}
              </div>

              {isSidebar && (
                <div className="page-accent-text mt-auto pt-8 flex-none flex justify-center opacity-30 text-sm">❦</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
