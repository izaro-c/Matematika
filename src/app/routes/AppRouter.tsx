import { Redirect, Route, Switch } from "wouter";
import { MathProvider } from "@/shared/lib/MathStoreContext";
import { Suspense, lazy } from 'react';
import { BiographyLayout } from "@/widgets/layouts/BiographyLayout";
import { Logo } from "@/shared/ui/Logo";
import { db } from '@/entities/content';

const HomePage = lazy(() => import("@/pages/Home/HomePage").then(m => ({ default: m.HomePage })));
const DictionaryPage = lazy(() => import("@/pages/DictionaryPage").then(m => ({ default: m.DictionaryPage })));
const HistoryTimeline = lazy(() => import("@/pages/HistoryTimeline").then(m => ({ default: m.HistoryTimeline })));
const BranchPage = lazy(() => import("@/pages/BranchPage").then(m => ({ default: m.BranchPage })));
const TheoremPage = lazy(() => import("@/pages/TheoremPage").then(m => ({ default: m.TheoremPage })));
const DefinitionPage = lazy(() => import("@/pages/DefinitionPage").then(m => ({ default: m.DefinitionPage })));
const ExamplePage = lazy(() => import("@/pages/ExamplePage").then(m => ({ default: m.ExamplePage })));
const ExercisePage = lazy(() => import("@/pages/ExercisePage").then(m => ({ default: m.ExercisePage })));
const StudyPlanPage = lazy(() => import("@/pages/StudyPlanPage").then(m => ({ default: m.StudyPlanPage })));
const MethodsPage = lazy(() => import("@/pages/MethodsPage").then(m => ({ default: m.MethodsPage })));
const MethodPage = lazy(() => import("@/pages/MethodPage").then(m => ({ default: m.MethodPage })));
const UseCasePage = lazy(() => import("@/pages/UseCasePage").then(m => ({ default: m.UseCasePage })));
const AxiomPage = lazy(() => import("@/pages/AxiomPage").then(m => ({ default: m.AxiomPage })));
const ModelPage = lazy(() => import("@/pages/ModelPage").then(m => ({ default: m.ModelPage })));
const AxiomaticSystemPage = lazy(() => import("@/pages/AxiomaticSystemPage").then(m => ({ default: m.AxiomaticSystemPage })));
const DemoPage = lazy(() => import("@/pages/DemoPage").then(m => ({ default: m.DemoPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const ConstructionPage = lazy(() => import("@/pages/ConstructionPage").then(m => ({ default: m.ConstructionPage })));

const EditorPage = lazy(() => import("@/features/editor/ui/EditorPage").then(m => ({ default: m.EditorPage })));
const GraphPage = lazy(() => import("@/pages/GraphPage").then(m => ({ default: m.GraphPage })));
const AxiomGraphPage = lazy(() => import("@/pages/AxiomGraphPage").then(m => ({ default: m.AxiomGraphPage })));

/**
 * Componente principal de enrutamiento de la aplicación.
 * * Lee dinámicamente el contenido indexado en el `ContentStore` y
 * genera las rutas necesarias para contenido y biografías. Además,
 * define las rutas estáticas para páginas especiales (Grafo, Diccionario, etc.).
 * * @returns {JSX.Element} Un componente de wouter con todas las rutas.
 */
export const AppRouter = () => {
  const methods = db.getAllMethods();
  const biographies = db.getAllMathematicians();

  return (
    <Suspense fallback={
      <div className="min-h-viewport flex items-center justify-center bg-lienzo text-carbon font-serif">
        <div className="animate-pulse flex flex-col items-center">
          <Logo className="w-16 h-16 opacity-50 mb-4" />
          <p className="text-pizarra italic text-xl">Consultando el archivo...</p>
        </div>
      </div>
    }>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/editor">
          <MathProvider>
            <EditorPage />
          </MathProvider>
        </Route>
          <Route path="/diccionario" component={DictionaryPage} />
          <Route path="/historia" component={HistoryTimeline} />
          <Route path="/metodos" component={MethodsPage} />
          <Route path="/grafo" component={GraphPage} />
          <Route path="/axiomas" component={AxiomGraphPage} />
          <Route path="/construccion/:id" component={ConstructionPage} />

          {/* RUTAS DE AXIOMAS Y MODELOS */}
          <Route path="/axioma/:id">
            <MathProvider>
              <AxiomPage />
            </MathProvider>
          </Route>
          <Route path="/modelo/:id">
            <MathProvider>
              <ModelPage />
            </MathProvider>
          </Route>
          <Route path="/sistema/:id">
            <MathProvider>
              <AxiomaticSystemPage />
            </MathProvider>
          </Route>

          {/* MÉTODOS Y ALIAS DE LAS ANTIGUAS URL DE LECCIÓN */}
          <Route path="/metodo/:id">
            <MathProvider>
              <MethodPage />
            </MathProvider>
          </Route>
          {methods.map(({ id }) => (
            <Route key={`legacy-method-${id}`} path={`/leccion-${id}`}>
              <Redirect to={`/metodo/${id}`} replace />
            </Route>
          ))}

          {/* RUTAS DE TEOREMAS */}
          <Route path="/teorema/:id">
            <MathProvider>
              <TheoremPage />
            </MathProvider>
          </Route>

          {/* RUTAS DE DEFINICIONES */}
          <Route path="/definicion/:id">
            <MathProvider>
              <DefinitionPage />
            </MathProvider>
          </Route>

          {/* RUTAS DE EJEMPLOS Y EJERCICIOS */}
          <Route path="/ejemplo/:id">
            <MathProvider>
              <ExamplePage />
            </MathProvider>
          </Route>

          <Route path="/ejercicio/:id">
            <MathProvider>
              <ExercisePage />
            </MathProvider>
          </Route>

          {/* RUTAS DE DEMOSTRACIONES ESTÁTICAS */}
          <Route path="/demo/:id">
            <MathProvider>
              <DemoPage />
            </MathProvider>
          </Route>

          {/* RUTAS DE BIOGRAFÍAS HISTÓRICAS */}
          {biographies.map((mat) => (
            <Route key={`bio-${mat.slug}`} path={`/bio/${mat.slug}`}>
              <MathProvider>
                <BiographyLayout Component={mat.Component} metadata={mat} />
              </MathProvider>
            </Route>
          ))}

          {/* RUTAS DE RAMAS Y PLANES DE ESTUDIO */}
          <Route path="/rama/:id" component={BranchPage} />
          <Route path="/plan/:id" component={StudyPlanPage} />

          {/* RUTAS DE CASOS DE USO REAL */}
          <Route path="/caso/:id">
            <MathProvider>
              <UseCasePage />
            </MathProvider>
          </Route>

          <Route path="/:rest*" component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
};
