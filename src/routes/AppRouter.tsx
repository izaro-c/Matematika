import { Router, Route, Switch } from "wouter";
import { MathProvider } from "../store/MathStoreContext";
import { Suspense, lazy } from 'react';
import { HomePage } from "../pages/Home/HomePage";
import { DictionaryPage } from "../pages/DictionaryPage";
import { HistoryTimeline } from "../pages/HistoryTimeline";
import { BranchPage } from "../pages/BranchPage";
import { TheoremPage } from "../pages/TheoremPage";
import { DefinitionPage } from "../pages/DefinitionPage";
import { ExamplePage } from "../pages/ExamplePage";
import { ExercisePage } from "../pages/ExercisePage";
import { StudyPlanPage } from "../pages/StudyPlanPage";
import { MethodsPage } from "../pages/MethodsPage";
import { UseCasePage } from "../pages/UseCasePage";
import { AxiomPage } from "../pages/AxiomPage";
import { ModelPage } from "../pages/ModelPage";
import { AxiomaticSystemPage } from "../pages/AxiomaticSystemPage";
import { DemoPage } from "../pages/DemoPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ConstructionPage } from "../pages/ConstructionPage";
import { InteractiveLessonLayout } from "../components/layout/InteractiveLessonLayout";
import { BiographyLayout } from "../components/layout/BiographyLayout";
import { Logo } from "../components/ui/Logo";
import { db } from '../store/content';

const EditorPage = lazy(() => import("../pages/Editor/EditorPage").then(m => ({ default: m.EditorPage })));
const GraphPage = lazy(() => import("../pages/GraphPage").then(m => ({ default: m.GraphPage })));
const AxiomGraphPage = lazy(() => import("../pages/AxiomGraphPage").then(m => ({ default: m.AxiomGraphPage })));

/**
 * Componente principal de enrutamiento de la aplicación.
 * * Lee dinámicamente el contenido indexado en el `ContentStore` y
 * genera las rutas necesarias para Lecciones y Biografías. Además,
 * define las rutas estáticas para páginas especiales (Grafo, Diccionario, etc.).
 * * @returns {JSX.Element} Un componente de wouter con todas las rutas.
 */
export const AppRouter = () => {
  const lessons = db.getAllLessons();
  const biographies = db.getAllMathematicians();

  // Tratamiento riguroso de la variable de entorno para compatibilidad Vite-Wouter.
  // Vite exporta "/repo/" pero Wouter exige "/repo" para calcular el offset correctamente.
  const rawBase = import.meta.env.BASE_URL;
  const wouterBase = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-lienzo text-carbon font-serif">
        <div className="animate-pulse flex flex-col items-center">
          <Logo className="w-16 h-16 opacity-50 mb-4" />
          <p className="text-pizarra italic text-xl">Consultando el archivo...</p>
        </div>
      </div>
    }>
      {/* El Router inyecta el prefijo base a todas las definiciones de Route subyacentes */}
      <Router base={wouterBase}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/editor" component={EditorPage} />
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

          {/* RUTAS DE LECCIONES INTERACTIVAS */}
          {lessons.map(({ id, slug, Component, Simulation }) => (
            <Route key={`lesson-${id}`} path={`/${slug}`}>
              <MathProvider>
                <InteractiveLessonLayout id={id} Component={Component} SimulationFallback={Simulation || null} />
              </MathProvider>
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
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <BiographyLayout Component={mat.Component} metadata={mat as any} />
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
      </Router>
    </Suspense>
  );
};