import { useState, useEffect } from 'react';
import { useGlossaryStore, getGlossaryDictionary } from '@/lib/stores/GlossaryStore';
import { db } from '@/data/content';
import type { 
  Theorem, Definition, Mathematician, Method,
  Example, Exercise, UseCase, Axiom, 
  AxiomaticSystem, Model, Demo 
} from '@/data/content';
import katex from 'katex';
import { Link } from 'wouter';
import { ContentTypeBadge } from '@/components/ui/ContentTypeBadge';
import { getContentPageAccent } from '@/design/pageAccents';
import { useI18n } from '@/i18n';


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
  typeLabel?: string;
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
  method?: Method | null;
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
      href: `/teorema/${entity.theorem.slug}`,
    };
  }
  if (entity.definition) return { type: 'definicion', href: `/definicion/${entity.definition.slug}` };
  if (entity.bio) return { type: 'matematico', href: `/bio/${entity.bio.slug}` };
  if (entity.method) return { type: 'metodo', href: `/metodo/${entity.method.slug}` };
  if (entity.example) return { type: 'ejemplo', href: `/ejemplo/${entity.example.slug}` };
  if (entity.exercise) return { type: 'ejercicio', href: `/ejercicio/${entity.exercise.slug}` };
  if (entity.useCase) return { type: 'caso-de-uso', href: `/caso/${entity.useCase.slug}` };
  if (entity.axiom) return { type: 'axioma', href: `/axioma/${entity.axiom.slug}` };
  if (entity.system) return { type: 'sistema-axiomatico', href: `/sistema/${entity.system.slug}` };
  if (entity.model) return { type: 'modelo', href: `/modelo/${entity.model.slug}` };
  if (entity.demo) return { type: 'demostracion', href: `/demo/${entity.demo.slug}` };
  return null;
}

function resolveTermFromDb(activeTerm: string, lang: string = 'es'): TermData | null {
  const k1 = activeTerm;
  const k2 = activeTerm.replace(/_/g, '-');
  const k3 = activeTerm.replace(/-/g, '_');

  const theorem = db.getTheorem(k1, lang) || db.getTheorem(k2, lang) || db.getTheorem(k3, lang);
  const definition = db.getDefinition(k1, lang) || db.getDefinition(k2, lang) || db.getDefinition(k3, lang);
  const bio = db.getMathematicianById(k1, lang) || db.getMathematicianById(k2, lang) || db.getMathematicianById(k3, lang);
  const method = db.getMethod(k1, lang) || db.getMethod(k2, lang) || db.getMethod(k3, lang);
  const example = db.getExample(k1, lang) || db.getExample(k2, lang) || db.getExample(k3, lang);
  const exercise = db.getExercise(k1, lang) || db.getExercise(k2, lang) || db.getExercise(k3, lang);
  const useCase = db.getUseCase(k1, lang) || db.getUseCase(k2, lang) || db.getUseCase(k3, lang);
  const axiom = db.getAxiom(k1, lang) || db.getAxiom(k2, lang) || db.getAxiom(k3, lang);
  const system = db.getAxiomaticSystem(k1, lang) || db.getAxiomaticSystem(k2, lang) || db.getAxiomaticSystem(k3, lang);
  const model = db.getModel(k1, lang) || db.getModel(k2, lang) || db.getModel(k3, lang);
  const demo = db.getDemo(k1, lang) || db.getDemo(k2, lang) || db.getDemo(k3, lang);

  const entity = theorem || definition || bio || method || example || exercise || useCase || axiom || system || model || demo;
  if (!entity) return null;

  const meta = resolveEntityMeta({
    theorem,
    definition,
    bio,
    method,
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

function buildActiveTermDataList(activeTerms: string[] | null, lang: string = 'es'): (TermData & { isDefinition: boolean })[] {
  if (!activeTerms) return [];
  const result: (TermData & { isDefinition: boolean })[] = [];
  const dict = getGlossaryDictionary(lang);

  activeTerms.forEach(activeTerm => {
    let termData = resolveTermFromDb(activeTerm, lang);
    let isDefinition = false;

    if (termData) {
      isDefinition = true;
    } else {
      termData = ((dict[activeTerm] || dict[activeTerm.replace(/-/g, '_')] || dict[activeTerm.replace(/_/g, '-')]) as unknown as TermData) || null;
    }

    if (termData) {
      result.push({ ...termData, isDefinition });
    }
  });

  return result;
}

function computePanelClassName(isSidebar: boolean, isActive: boolean): string {
  let base = 'parchment-panel fixed z-[80] shadow-2xl flex flex-col font-serif transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]';
  if (isSidebar) {
    base += ' inset-y-0 right-0 h-dvh min-h-[100dvh] w-full max-w-md';
    base += isActive ? ' translate-x-0' : ' translate-x-full pointer-events-none';
  } else {
    base += ' top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-xl max-h-[85dvh]';
    base += isActive ? ' opacity-100 scale-100' : ' opacity-0 scale-95 pointer-events-none';
  }
  return base;
}

function buildFormulaData(activeFormulaTerms: string[] | null, lang: string = 'es'): TermData[] | null {
  if (!activeFormulaTerms) return null;
  const dict = getGlossaryDictionary(lang);
  return activeFormulaTerms.map(id => dict[id]).filter(Boolean) as unknown as TermData[];
}

function renderMathString(mathString: string): { __html: string } {
  try {
    return { __html: katex.renderToString(mathString, { displayMode: true, throwOnError: false }) };
  } catch {
    return { __html: mathString };
  }
}

function renderTitleParts(title: string): React.ReactNode {
  // Split on parenthesized groups, keeping the delimiters as captured groups
  const parts = title.split(/(\([^)]*\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('(') && part.endsWith(')')) {
      // Keep the preceding space glued to the opening paren so "Word (X)"
      // doesn't break between "Word" and "(X)"
      return (
        <span key={i} style={{ whiteSpace: 'nowrap' }}>
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
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
  const { lang, t, getLocalizedPath } = useI18n();

  const activeTermDataList = buildActiveTermDataList(activeTerms, lang);
  const formulaData = buildFormulaData(activeFormulaTerms, lang);

  const isTermsActive = activeTerms !== null && activeTerms.length > 0;
  const isFormulaActive = activeFormulaTerms !== null && activeFormulaTerms.length > 0;
  const isActive = isTermsActive || isFormulaActive;

  // Track the active content type ('terms' | 'formula') to preserve the correct content during exit animation
  const [activeContentType, setActiveContentType] = useState<'terms' | 'formula' | null>(() => {
    if (isTermsActive) return 'terms';
    if (isFormulaActive) return 'formula';
    return null;
  });

  const [cachedTerms, setCachedTerms] = useState<(TermData & { isDefinition: boolean })[]>(activeTermDataList);
  const [cachedFormulas, setCachedFormulas] = useState<TermData[] | null>(formulaData);

  useEffect(() => {
    if (isTermsActive && activeTermDataList.length > 0) {
      setActiveContentType('terms');
      setCachedTerms(activeTermDataList);
    } else if (isFormulaActive && formulaData && formulaData.length > 0) {
      setActiveContentType('formula');
      setCachedFormulas(formulaData);
    }
  }, [isTermsActive, isFormulaActive, activeTermDataList, formulaData]);

  const currentType = isTermsActive
    ? 'terms'
    : isFormulaActive
      ? 'formula'
      : activeContentType;

  const displayedTermDataList = isTermsActive ? activeTermDataList : cachedTerms;
  const displayedFormulaData = isFormulaActive ? formulaData : cachedFormulas;

  const isSidebar = displayMode === 'sidebar';
  const panelClassName = computePanelClassName(isSidebar, isActive);

  // Resolver el color del panel a partir del primer término visible (fallback glosario -> piedra)
  const firstType = currentType === 'formula'
    ? (displayedFormulaData?.[0]?.type || 'glosario')
    : (displayedTermDataList[0]?.type || 'glosario');
  const panelAccent = getContentPageAccent(firstType);

  let panelContent: React.ReactNode;
  if (currentType === 'terms' && displayedTermDataList.length > 0) {
    panelContent = (
      <div className="flex flex-col">
        {displayedTermDataList.map((term, idx) => {
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
                {renderTitleParts(term.title.slice(1))}
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
                  <h5 className="page-accent-text ac-label ac-label--sm mb-3">
                    {t('marginalia', 'statement')}
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
                  <Link
                    href={getLocalizedPath(term.href)}
                    onClick={closeTerm}
                    className="page-accent-hover inline-block px-8 py-3 border border-carbon/20 transition-all ac-eyebrow font-bold"
                  >
                    {t('glossary', 'readFullArticle')}
                  </Link>
                </div>
              )}
              {idx < displayedTermDataList.length - 1 && (
                <div className="page-accent-text mt-10 flex justify-center opacity-30 text-xl">❦</div>
              )}
            </article>
          );
        })}
      </div>
    );
  } else if (displayedFormulaData && displayedFormulaData.length > 0) {
    panelContent = (
      <div className="flex flex-col">
        {displayedFormulaData.map((data, idx) => {
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
                {renderTitleParts(data.title.slice(1))}
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
              {idx < displayedFormulaData.length - 1 && (
                <div className="page-accent-text mt-10 flex justify-center opacity-30 text-xl">❦</div>
              )}
            </article>
          );
        })}
      </div>
    );
  } else {
    panelContent = (
      <p className="italic text-ink-muted text-center mt-12">{t('marginalia', 'noSymbolsFound')}</p>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-carbon/30 backdrop-blur-sm z-[70] touch-none transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeTerm}
        aria-hidden="true"
      />

      <div
        className={panelClassName}
        style={{ '--page-accent': panelAccent } as React.CSSProperties}
        role="dialog"
        aria-modal={isActive}
        aria-hidden={!isActive}
        aria-label={t('marginalia', 'dialogAriaLabel')}
      >
        <div className="h-full flex flex-col relative overflow-hidden">
          <div className="absolute top-4 right-4 flex gap-2 text-ink-muted font-sans z-20">
            <button
              type="button"
              onClick={toggleDisplayMode}
              className="ac-hit-target page-accent-hover transition-colors text-sm inline-flex items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
              title={isSidebar ? t('marginalia', 'switchToFloating') : t('marginalia', 'switchToSidebar')}
              aria-label={t('marginalia', 'changeDisplayMode')}
            >
              {isSidebar ? '⧉' : '◫'}
            </button>
            <button
              type="button"
              onClick={closeTerm}
              className="ac-hit-target page-accent-hover transition-colors text-2xl leading-none inline-flex items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
              aria-label={t('marginalia', 'closePanel')}
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain h-full relative">
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
