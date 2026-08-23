import { Redirect, Route, Switch, useParams } from "wouter";
import { MathProvider } from "@/lib/page-context/MathStoreContext";
import { Suspense, lazy } from 'react';
import { BiographyLayout } from "@/components/layouts/BiographyLayout";
import { PageLoadingScreen } from "@/components/ui/PageLoadingScreen";
import { db } from '@/data/content';
import { useI18n, isSupportedLanguage, getLanguage, SEGMENT_TO_CANONICAL_TYPE } from '@/i18n';

const HomePage = lazy(() => import("@/fixed-pages/home/HomePage").then(m => ({ default: m.HomePage })));
const DictionaryPage = lazy(() => import("@/fixed-pages/glossary/DictionaryPage").then(m => ({ default: m.DictionaryPage })));
const HistoryTimeline = lazy(() => import("@/fixed-pages/mathematicians/HistoryTimeline").then(m => ({ default: m.HistoryTimeline })));
const BranchPage = lazy(() => import("@/content-pages/screens/BranchPage").then(m => ({ default: m.BranchPage })));
const TheoremPage = lazy(() => import("@/content-pages/screens/TheoremPage").then(m => ({ default: m.TheoremPage })));
const DefinitionPage = lazy(() => import("@/content-pages/screens/DefinitionPage").then(m => ({ default: m.DefinitionPage })));
const ExamplePage = lazy(() => import("@/content-pages/screens/ExamplePage").then(m => ({ default: m.ExamplePage })));
const ExercisePage = lazy(() => import("@/content-pages/screens/ExercisePage").then(m => ({ default: m.ExercisePage })));
const StudyPlanPage = lazy(() => import("@/content-pages/screens/StudyPlanPage").then(m => ({ default: m.StudyPlanPage })));
const MethodsPage = lazy(() => import("@/content-pages/screens/MethodsPage").then(m => ({ default: m.MethodsPage })));
const MethodPage = lazy(() => import("@/content-pages/screens/MethodPage").then(m => ({ default: m.MethodPage })));
const UseCasePage = lazy(() => import("@/content-pages/screens/UseCasePage").then(m => ({ default: m.UseCasePage })));
const AxiomPage = lazy(() => import("@/content-pages/screens/AxiomPage").then(m => ({ default: m.AxiomPage })));
const ModelPage = lazy(() => import("@/content-pages/screens/ModelPage").then(m => ({ default: m.ModelPage })));
const AxiomaticSystemPage = lazy(() => import("@/content-pages/screens/AxiomaticSystemPage").then(m => ({ default: m.AxiomaticSystemPage })));
const DemoPage = lazy(() => import("@/content-pages/screens/DemoPage").then(m => ({ default: m.DemoPage })));
const NotFoundPage = lazy(() => import("@/content-pages/screens/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const ConstructionPage = lazy(() => import("@/content-pages/screens/ConstructionPage").then(m => ({ default: m.ConstructionPage })));

const EditorPage = lazy(() => import("@/fixed-pages/editor/ui/page/EditorPage").then(m => ({ default: m.EditorPage })));
const GraphPage = lazy(() => import("@/fixed-pages/graph/GraphPage").then(m => ({ default: m.GraphPage })));
const AxiomGraphPage = lazy(() => import("@/fixed-pages/graph/AxiomGraphPage").then(m => ({ default: m.AxiomGraphPage })));

/**
 * Dispatcher genérico para rutas de 3 segmentos: `/:lang/:segment/:id`
 * Normaliza automáticamente el segmento de ruta al idioma activo si no coincide.
 */
const LocalizedContentRouteDispatcher: React.FC = () => {
  const { lang, segment, id } = useParams<{ lang?: string; segment?: string; id?: string }>();
  const { lang: userLang } = useI18n();
  const activeLang = isSupportedLanguage(lang) ? (lang as string) : userLang;
  const rawSegment = (segment || '').toLowerCase();
  const canonicalType = SEGMENT_TO_CANONICAL_TYPE[rawSegment];

  if (!canonicalType || !id) {
    return <NotFoundPage />;
  }

  const langConfig = getLanguage(activeLang);
  const targetSegment = langConfig.routeSegments[canonicalType] || canonicalType;

  // Auto-traducir o normalizar segmento de ruta si difiere (ej: /eu/ejercicio/... -> /eu/ariketa/...)
  if (rawSegment !== targetSegment.toLowerCase()) {
    return <Redirect to={`/${activeLang}/${targetSegment}/${id}`} replace />;
  }

  switch (canonicalType) {
    case 'teorema':
      return <MathProvider><TheoremPage /></MathProvider>;
    case 'definicion':
      return <MathProvider><DefinitionPage /></MathProvider>;
    case 'ejercicio':
      return <MathProvider><ExercisePage /></MathProvider>;
    case 'ejemplo':
      return <MathProvider><ExamplePage /></MathProvider>;
    case 'axioma':
      return <MathProvider><AxiomPage /></MathProvider>;
    case 'modelo':
      return <MathProvider><ModelPage /></MathProvider>;
    case 'sistema':
      return <MathProvider><AxiomaticSystemPage /></MathProvider>;
    case 'metodo':
      return <MathProvider><MethodPage /></MathProvider>;
    case 'demo':
      return <MathProvider><DemoPage /></MathProvider>;
    case 'caso':
      return <MathProvider><UseCasePage /></MathProvider>;
    case 'plan':
      return <StudyPlanPage />;
    case 'rama':
      return <BranchPage />;
    case 'bio': {
      const mat = db.getMathematicianById(id, activeLang);
      if (!mat) return <NotFoundPage />;
      return (
        <MathProvider>
          <BiographyLayout Component={mat.Component} metadata={mat} />
        </MathProvider>
      );
    }
    default:
      return <NotFoundPage />;
  }
};

/**
 * Dispatcher para rutas de 2 segmentos: `/:first/:second`
 * Soporta:
 * 1. Páginas estáticas localizadas: `/:lang/:page` (ej: `/es/diccionario`, `/eu/hiztegia`, `/eu/grafoa`)
 * 2. Rutas heredadas de contenido sin prefijo: `/:segment/:id` (ej: `/teorema/teorema-pitagoras`, `/definicion/triangulo`)
 */
const TwoSegmentRouteDispatcher: React.FC = () => {
  const { first, second } = useParams<{ first?: string; second?: string }>();
  const { lang: userLang } = useI18n();

  const rawFirst = (first || '').toLowerCase();
  const rawSecond = (second || '').toLowerCase();

  // Caso 1: El primer segmento es un idioma válido (ej: /es/diccionario, /eu/hiztegia, /es/construccion/...)
  if (isSupportedLanguage(rawFirst)) {
    const activeLang = rawFirst;
    const canonicalType = SEGMENT_TO_CANONICAL_TYPE[rawSecond];

    if (!canonicalType) {
      return <NotFoundPage />;
    }

    const langConfig = getLanguage(activeLang);
    const targetSegment = (langConfig.routeSegments[canonicalType] || canonicalType).toLowerCase();

    if (rawSecond !== targetSegment) {
      return <Redirect to={`/${activeLang}/${targetSegment}`} replace />;
    }

    switch (canonicalType) {
      case 'diccionario':
        return <DictionaryPage />;
      case 'historia':
        return <HistoryTimeline />;
      case 'grafo':
        return <GraphPage />;
      case 'axiomas':
        return <AxiomGraphPage />;
      case 'metodo':
        return <MethodsPage />;
      default:
        return <NotFoundPage />;
    }
  }

  // Caso 2: El primer segmento NO es un idioma -> es una ruta de contenido heredada sin prefijo (ej: /teorema/:id, /definicion/:id)
  const canonicalContent = SEGMENT_TO_CANONICAL_TYPE[rawFirst];
  if (canonicalContent && second) {
    const targetLangConfig = getLanguage(userLang);
    const localizedSegment = targetLangConfig.routeSegments[canonicalContent] || canonicalContent;
    return <Redirect to={`/${userLang}/${localizedSegment}/${second}`} replace />;
  }

  return <NotFoundPage />;
};

/**
 * Dispatcher para rutas de 1 segmento: `/:segment`
 * Soporta:
 * 1. Home con prefijo de idioma: `/es`, `/eu`
 * 2. Páginas estáticas heredadas sin prefijo: `/diccionario`, `/historia`, `/grafo`, `/axiomas`, `/metodos`
 */
const SingleSegmentRouteDispatcher: React.FC = () => {
  const { segment } = useParams<{ segment?: string }>();
  const { lang: userLang } = useI18n();
  const raw = (segment || '').toLowerCase();

  if (isSupportedLanguage(raw)) {
    return <HomePage />;
  }

  const canonical = SEGMENT_TO_CANONICAL_TYPE[raw];
  if (canonical) {
    const targetLangConfig = getLanguage(userLang);
    const localizedSegment = targetLangConfig.routeSegments[canonical] || canonical;
    return <Redirect to={`/${userLang}/${localizedSegment}`} replace />;
  }

  return <NotFoundPage />;
};

export const AppRouter = () => {
  const { lang } = useI18n();
  const methods = db.getAllMethods();

  return (
    <Suspense fallback={<PageLoadingScreen />}>
      <Switch>
        {/* EDITORES (Rutas con prefijo de idioma /:lang/editor o directas) */}
        <Route path="/:lang/editor">
          <MathProvider>
            <EditorPage />
          </MathProvider>
        </Route>
        <Route path="/editor">
          <MathProvider>
            <EditorPage />
          </MathProvider>
        </Route>

        {/* HOME PRINCIPAL */}
        <Route path="/" component={HomePage} />

        {/* CONSTRUCCIÓN */}
        <Route path="/:lang/construccion/:id" component={ConstructionPage} />
        <Route path="/construccion/:id">
          {(params) => <Redirect to={`/${lang}/construccion/${params.id}`} replace />}
        </Route>

        {/* ALIAS HISTÓRICOS DE LECCIÓN */}
        {methods.map(({ id }) => (
          <Route key={`legacy-method-${id}`} path={`/leccion-${id}`}>
            <Redirect to={`/${lang}/metodo/${id}`} replace />
          </Route>
        ))}

        {/* RUTAS DE 3 SEGMENTOS: /:lang/:segment/:id */}
        <Route path="/:lang/:segment/:id" component={LocalizedContentRouteDispatcher} />

        {/* RUTAS DE 2 SEGMENTOS: /:lang/:page O /:legacySegment/:id */}
        <Route path="/:first/:second" component={TwoSegmentRouteDispatcher} />

        {/* RUTAS DE 1 SEGMENTO: /:lang O /:legacyStaticPage */}
        <Route path="/:segment" component={SingleSegmentRouteDispatcher} />

        {/* 404 CATCH-ALL */}
        <Route path="/:rest*" component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
};
