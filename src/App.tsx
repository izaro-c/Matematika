import { Route, Switch, useLocation, Link } from "wouter";
import { MathProvider } from "./store/MathStoreContext";
import { Suspense, useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXBlocks } from './components/ui/MDXBlocks';
import { HomePage } from "./pages/HomePage";
import { Logo } from "./components/Logo";
import { ThemeToggle } from "./components/ThemeToggle";
import { MarginaliaPanel } from "./components/MarginaliaPanel";
import { PageTransition } from "./components/PageTransition";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SymbolDictionaryManager } from "./components/SymbolDictionaryManager";
import { SearchOmnibar } from "./components/SearchOmnibar";
import { DictionaryPage } from "./pages/DictionaryPage";
import { useNavigationStore } from "./store/NavigationStore";
import { InteractiveLessonLayout } from "./components/InteractiveLessonLayout";
import { BiographyLayout } from "./components/BiographyLayout";
import { HistoryTimeline } from "./pages/HistoryTimeline";
import { EditorPage } from "./pages/EditorPage";
import { BranchPage } from "./pages/BranchPage";
import { TheoremPage } from "./pages/TheoremPage";
import { DefinitionPage } from "./pages/DefinitionPage";
import { ExamplePage } from "./pages/ExamplePage";
import { ExercisePage } from "./pages/ExercisePage";
import { StudyPlanPage } from "./pages/StudyPlanPage";
import { MethodsPage } from "./pages/MethodsPage";
import { UseCasePage } from "./pages/UseCasePage";
import { GraphPage } from "./pages/GraphPage";
import { DemoPage } from "./pages/DemoPage";
import { db } from './store/ContentStore';

function App() {
  const [location] = useLocation();
  const { toggleSearch } = useNavigationStore();
  const lessons = db.getAllLessons();
  const biographies = db.getAllMathematicians();

  // Scroll Sync Listener for Editor Live Preview
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'scroll') {
        const percentage = e.data.percentage;
        // Don't scroll if percentage is invalid or negative
        if (typeof percentage === 'number' && percentage >= 0) {
          const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo({ top: totalScrollableHeight * percentage, behavior: 'instant' as ScrollBehavior });
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <MDXProvider components={MDXBlocks}>
      <SymbolDictionaryManager />
      <ThemeToggle />
      <button
        onClick={toggleSearch}
        className="fixed top-6 right-20 z-50 w-12 h-12 flex items-center justify-center rounded-full border border-carbon/20 bg-lienzo text-carbon shadow-sm hover:shadow-md transition-all hover:scale-105"
        title="Buscar (Cmd + K)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
      <SearchOmnibar />
      <MarginaliaPanel />
      
      {/* Botón Flotante para Volver al Inicio (Solo visible si no estamos en la portada) */}
      {location !== '/' && (
        <div className="fixed top-6 left-6 z-40">
          <Link href="/">
            <a className="block opacity-60 hover:opacity-100 hover:scale-105 transition-all drop-shadow-sm" title="Volver a la Biblioteca">
              <Logo className="w-12 h-12" />
            </a>
          </Link>
        </div>
      )}
      
      <PageTransition>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-lienzo text-carbon font-serif">
              <div className="animate-pulse flex flex-col items-center">
                <Logo className="w-16 h-16 opacity-50 mb-4" />
                <p className="text-pizarra italic text-xl">Consultando el archivo...</p>
              </div>
            </div>
          }>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/editor" component={EditorPage} />
            <Route path="/diccionario" component={DictionaryPage} />
            <Route path="/historia" component={HistoryTimeline} />
            <Route path="/metodos" component={MethodsPage} />
            <Route path="/grafo" component={GraphPage} />
            
            {/* RUTAS DE LECCIONES INTERACTIVAS */}
            {lessons.map(({ id, Component, Simulation }) => (
              <Route key={`lesson-${id}`} path={`/${id}`}>
                <MathProvider>
                  <InteractiveLessonLayout id={id} Component={Component} SimulationFallback={Simulation} />
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

            {/* RUTAS DE DEMOSTRACIONES ESTÁTICAS (SCROLLYTELLING) */}
            <Route path="/demo/:id">
              <MathProvider>
                <DemoPage />
              </MathProvider>
            </Route>

            {/* RUTAS DE BIOGRAFÍAS HISTÓRICAS */}
            {biographies.map((mat) => (
              <Route key={`bio-${mat.slug}`} path={`/bio/${mat.slug}`}>
                <MathProvider>
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

            <Route path="/:rest*" component={() => <div>404</div>} />
          </Switch>
        </Suspense>
        </ErrorBoundary>
      </PageTransition>
    </MDXProvider>
  );
}

export default App;
