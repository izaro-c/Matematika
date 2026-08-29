import { Redirect, Route, Switch, useParams } from "wouter";
import { MathProvider } from "@/lib/page-context/MathStoreContext";
import { Suspense, lazy } from 'react';
import { BiographyLayout } from "@/components/layouts/BiographyLayout";
import { PageLoadingScreen } from "@/components/ui/PageLoadingScreen";
import { db } from '@/data/content';
import { useI18n, isSupportedLanguage, getLanguage, SEGMENT_TO_CANONICAL_TYPE } from '@/i18n';
import { SeoHead } from "@/components/seo/SeoHead";

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
  const { lang: userLang, t } = useI18n();
  const activeLang = isSupportedLanguage(lang) ? (lang as string) : userLang;
  const rawSegment = (segment || '').toLowerCase();
  const canonicalType = SEGMENT_TO_CANONICAL_TYPE[rawSegment];

  if (!canonicalType || !id) {
    return (
      <>
        <SeoHead title={t('notFound', 'title')} noindex={true} />
        <NotFoundPage />
      </>
    );
  }

  const langConfig = getLanguage(activeLang);
  const targetSegment = langConfig.routeSegments[canonicalType] || canonicalType;

  // Auto-traducir o normalizar segmento de ruta si difiere (ej: /eu/ejercicio/... -> /eu/ariketa/...)
  if (rawSegment !== targetSegment.toLowerCase()) {
    return <Redirect to={`/${activeLang}/${targetSegment}/${id}`} replace />;
  }

  // Obtener metadatos de SEO directamente del ContentStore
  let itemTitle: string | undefined;
  let itemDescription: string | undefined;
  let itemAuthors: string[] | undefined;
  let itemTagsOrBranch: string | string[] | undefined;

  switch (canonicalType) {
    case 'teorema': {
      const thm = db.getTheorem(id, activeLang);
      itemTitle = thm?.title; itemDescription = thm?.description; itemAuthors = thm?.authors; itemTagsOrBranch = thm?.branch || thm?.tags;
      break;
    }
    case 'definicion': {
      const def = db.getDefinition(id, activeLang);
      itemTitle = def?.title; itemDescription = def?.description; itemAuthors = def?.authors; itemTagsOrBranch = def?.branch || def?.tags;
      break;
    }
    case 'ejercicio': {
      const ez = db.getExercise(id, activeLang);
      itemTitle = ez?.title; itemDescription = ez?.description; itemTagsOrBranch = ez?.branch || ez?.tags;
      break;
    }
    case 'ejemplo': {
      const ex = db.getExample(id, activeLang);
      itemTitle = ex?.title; itemDescription = ex?.description; itemTagsOrBranch = ex?.branch || ex?.tags;
      break;
    }
    case 'axioma': {
      const ax = db.getAxiom(id, activeLang);
      itemTitle = ax?.title; itemDescription = ax?.description; itemAuthors = ax?.authors; itemTagsOrBranch = ax?.branch || ax?.tags;
      break;
    }
    case 'modelo': {
      const mod = db.getModel(id, activeLang);
      itemTitle = mod?.title; itemDescription = mod?.description; itemTagsOrBranch = mod?.branch || mod?.tags;
      break;
    }
    case 'sistema': {
      const sys = db.getAxiomaticSystem(id, activeLang);
      itemTitle = sys?.title; itemDescription = sys?.description; itemAuthors = sys?.authors; itemTagsOrBranch = sys?.branch || sys?.tags;
      break;
    }
    case 'metodo': {
      const met = db.getMethod(id, activeLang);
      itemTitle = met?.title; itemDescription = met?.description; itemAuthors = met?.authors; itemTagsOrBranch = met?.branch || met?.tags;
      break;
    }
    case 'demo': {
      const demo = db.getDemo(id, activeLang);
      itemTitle = demo?.title; itemDescription = demo?.description; itemAuthors = demo?.authors; itemTagsOrBranch = demo?.branch || demo?.tags;
      break;
    }
    case 'caso': {
      const uc = db.getUseCase(id, activeLang);
      itemTitle = uc?.title; itemDescription = uc?.description; itemTagsOrBranch = uc?.branch || uc?.tags;
      break;
    }
    case 'plan': {
      const plan = db.getStudyPlan(id, activeLang);
      itemTitle = plan?.title; itemDescription = plan?.description; itemTagsOrBranch = plan?.branch || plan?.tags;
      break;
    }
    case 'rama': {
      const taxonomy = db.getBranchTaxonomy(id, activeLang);
      itemTitle = taxonomy.name || taxonomy.id;
      itemDescription = t('hero', 'tagline');
      break;
    }
    case 'bio': {
      const mat = db.getMathematicianById(id, activeLang);
      itemTitle = mat?.name;
      itemDescription = mat?.description;
      break;
    }
    case 'construccion': {
      itemTitle = t('notFound', 'constructionTitle');
      itemDescription = t('construction', 'description');
      break;
    }
  }

  const breadcrumbs = itemTagsOrBranch ? db.getBreadcrumbs(itemTagsOrBranch, undefined, activeLang) : [];
  const seoType = canonicalType === 'definicion' || canonicalType === 'axioma' ? 'defined-term' : 'article';

  const renderComponent = () => {
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
        return <MathProvider><StudyPlanPage /></MathProvider>;
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
      case 'construccion':
        return <ConstructionPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <>
      <SeoHead
        title={itemTitle}
        description={itemDescription}
        type={seoType}
        author={itemAuthors}
        breadcrumbs={breadcrumbs}
        noindex={canonicalType === 'construccion' ? true : undefined}
      />
      {renderComponent()}
    </>
  );
};

/**
 * Dispatcher para rutas de 2 segmentos: `/:first/:second`
 * Soporta:
 * 1. Páginas estáticas localizadas: `/:lang/:page` (ej: `/es/diccionario`, `/eu/hiztegia`, `/eu/grafoa`)
 * 2. Rutas heredadas de contenido sin prefijo: `/:segment/:id` (ej: `/teorema/teorema-pitagoras`, `/definicion/triangulo`)
 */
const TwoSegmentRouteDispatcher: React.FC = () => {
  const { first, second } = useParams<{ first?: string; second?: string }>();
  const { lang: userLang, t } = useI18n();

  const rawFirst = (first || '').toLowerCase();
  const rawSecond = (second || '').toLowerCase();

  // Caso 1: El primer segmento es un idioma válido (ej: /es/diccionario, /eu/hiztegia, /es/construccion/...)
  if (isSupportedLanguage(rawFirst)) {
    const activeLang = rawFirst;
    const canonicalType = SEGMENT_TO_CANONICAL_TYPE[rawSecond];

    if (!canonicalType) {
      return (
        <>
          <SeoHead title={t('notFound', 'title')} noindex={true} />
          <NotFoundPage />
        </>
      );
    }

    const langConfig = getLanguage(activeLang);
    const targetSegment = (langConfig.routeSegments[canonicalType] || canonicalType).toLowerCase();

    if (rawSecond !== targetSegment) {
      return <Redirect to={`/${activeLang}/${targetSegment}`} replace />;
    }

    switch (canonicalType) {
      case 'diccionario':
        return (
          <>
            <SeoHead title={t('glossary', 'title')} description={t('glossary', 'subtitle')} type="website" />
            <DictionaryPage />
          </>
        );
      case 'historia':
        return (
          <>
            <SeoHead title={t('timeline', 'title')} description={t('timeline', 'eyebrow')} type="website" />
            <HistoryTimeline />
          </>
        );
      case 'grafo':
        return (
          <>
            <SeoHead title={t('graph', 'logicExplorer')} description={t('metadata', 'connectionNetworkSubtitle')} type="website" />
            <GraphPage />
          </>
        );
      case 'axiomas':
        return (
          <>
            <SeoHead title={t('graph', 'axiomaticDependencies')} description={t('metadata', 'connectionNetworkSubtitle')} type="website" />
            <AxiomGraphPage />
          </>
        );
      case 'metodo':
        return (
          <>
            <SeoHead title={t('methods', 'title')} description={t('methods', 'description')} type="website" />
            <MethodsPage />
          </>
        );
      default:
        return (
          <>
            <SeoHead title={t('notFound', 'title')} noindex={true} />
            <NotFoundPage />
          </>
        );
    }
  }

  // Caso 2: El primer segmento NO es un idioma -> es una ruta de contenido heredada sin prefijo (ej: /teorema/:id, /definicion/:id)
  const canonicalContent = SEGMENT_TO_CANONICAL_TYPE[rawFirst];
  if (canonicalContent && second) {
    const targetLangConfig = getLanguage(userLang);
    const localizedSegment = targetLangConfig.routeSegments[canonicalContent] || canonicalContent;
    return <Redirect to={`/${userLang}/${localizedSegment}/${second}`} replace />;
  }

  return (
    <>
      <SeoHead title={t('notFound', 'title')} noindex={true} />
      <NotFoundPage />
    </>
  );
};

/**
 * Dispatcher para rutas de 1 segmento: `/:segment`
 * Soporta:
 * 1. Home con prefijo de idioma: `/es`, `/eu`
 * 2. Páginas estáticas heredadas sin prefijo: `/diccionario`, `/historia`, `/grafo`, `/axiomas`, `/metodos`
 */
const SingleSegmentRouteDispatcher: React.FC = () => {
  const { segment } = useParams<{ segment?: string }>();
  const { lang: userLang, t } = useI18n();
  const raw = (segment || '').toLowerCase();

  if (isSupportedLanguage(raw)) {
    return (
      <>
        <SeoHead title={t('notFound', 'siteTitle')} description={t('hero', 'tagline')} />
        <HomePage />
      </>
    );
  }

  const canonical = SEGMENT_TO_CANONICAL_TYPE[raw];
  if (canonical) {
    const targetLangConfig = getLanguage(userLang);
    const localizedSegment = targetLangConfig.routeSegments[canonical] || canonical;
    return <Redirect to={`/${userLang}/${localizedSegment}`} replace />;
  }

  return (
    <>
      <SeoHead title={t('notFound', 'title')} noindex={true} />
      <NotFoundPage />
    </>
  );
};

export const AppRouter = () => {
  const { lang, t } = useI18n();

  return (
    <Suspense fallback={<PageLoadingScreen />}>
      <Switch>
        {/* EDITORES (Rutas con prefijo de idioma /:lang/editor o directas - NUNCA INDEXAR) */}
        <Route path="/:lang/editor">
          <SeoHead title={t('editor', 'docHeroTitle')} noindex={true} />
          <MathProvider>
            <EditorPage />
          </MathProvider>
        </Route>
        <Route path="/editor">
          <SeoHead title={t('editor', 'docHeroTitle')} noindex={true} />
          <MathProvider>
            <EditorPage />
          </MathProvider>
        </Route>

        {/* HOME PRINCIPAL */}
        <Route path="/">
          <SeoHead title={t('notFound', 'siteTitle')} description={t('hero', 'tagline')} />
          <HomePage />
        </Route>

        {/* ALIAS HISTÓRICOS DE LECCIÓN */}
        <Route path="/leccion-:id">
          {(params) => <Redirect to={`/${lang}/metodo/${params.id}`} replace />}
        </Route>

        {/* RUTAS DE 3 SEGMENTOS: /:lang/:segment/:id */}
        <Route path="/:lang/:segment/:id" component={LocalizedContentRouteDispatcher} />

        {/* RUTAS DE 2 SEGMENTOS: /:lang/:page O /:legacySegment/:id */}
        <Route path="/:first/:second" component={TwoSegmentRouteDispatcher} />

        {/* RUTAS DE 1 SEGMENTO: /:lang O /:legacyStaticPage */}
        <Route path="/:segment" component={SingleSegmentRouteDispatcher} />

        {/* 404 CATCH-ALL */}
        <Route path="/:rest*">
          <SeoHead title={t('notFound', 'title')} noindex={true} />
          <NotFoundPage />
        </Route>
      </Switch>
    </Suspense>
  );
};

