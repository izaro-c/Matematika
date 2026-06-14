import { Route, Switch, useLocation, Link } from "wouter";
import { MathProvider } from "./store/MathStoreContext";
import { HomePage } from "./pages/HomePage";
import { Logo } from "./components/Logo";
import { ThemeToggle } from "./components/ThemeToggle";
import { MarginaliaPanel } from "./components/MarginaliaPanel";
import { PageTransition } from "./components/PageTransition";
import { SymbolDictionaryManager } from "./components/SymbolDictionaryManager";
import { SearchOmnibar } from "./components/SearchOmnibar";
import { DictionaryPage } from "./pages/DictionaryPage";
import { useNavigationStore } from "./store/NavigationStore";
import { InteractiveLessonLayout } from "./components/InteractiveLessonLayout";
import { BiographyLayout } from "./components/BiographyLayout";
import { HistoryTimeline } from "./pages/HistoryTimeline";

// Cargamos dinámicamente tanto las lecciones como las demostraciones
const mdxModules = import.meta.glob('./lessons/*.mdx', { eager: true });
const demoModules = import.meta.glob('./demonstrations/*.mdx', { eager: true });
const bioModules = import.meta.glob('./biographies/*.mdx', { eager: true });

const mapModules = (modules: Record<string, any>, isDemo = false) => {
  return Object.keys(modules).map((filePath) => {
    // Si es demo, quitamos 'Demo' solo del final del slug para que coincida (PitagorasDemo -> pitagoras, pero no rompe MetodosDemostracion)
    const slug = filePath.split('/').pop()?.replace('.mdx', '').replace(/Demo$/, '').toLowerCase() || '';
    return {
      slug,
      Component: (modules[filePath] as any).default,
      Simulation: (modules[filePath] as any).Simulation || null,
      Visualizer: (modules[filePath] as any).Visualizer || null,
      Sidebar: (modules[filePath] as any).Sidebar || null,
      metadata: (modules[filePath] as any).metadata || null
    };
  });
};

const lessons = mapModules(mdxModules);
console.log("LESSONS:", lessons);
const demos = mapModules(demoModules, true);
const biographies = mapModules(bioModules);

function App() {
  const [location] = useLocation();
  const { toggleSearch } = useNavigationStore();

  return (
    <>
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
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/diccionario" component={DictionaryPage} />
          <Route path="/historia" component={HistoryTimeline} />
          
          {/* RUTAS DE LECCIONES INTERACTIVAS */}
          {lessons.map(({ slug, Component, Simulation }) => (
            <Route key={`lesson-${slug}`} path={`/${slug}`}>
              <MathProvider>
                <InteractiveLessonLayout Component={Component} SimulationFallback={Simulation} />
              </MathProvider>
            </Route>
          ))}

          {/* RUTAS DE DEMOSTRACIONES ESTÁTICAS (SCROLLYTELLING) */}
          {demos.map(({ slug, Component }) => (
            <Route key={`demo-${slug}`} path={`/demo/${slug}`}>
              <MathProvider>
                <div className="w-full bg-transparent min-h-screen demo-container">
                  {/* El MDX ahora es dueño de toda la pantalla y dibujará sus propias secciones */}
                  <Component />
                </div>
              </MathProvider>
            </Route>
          ))}

          {/* RUTAS DE BIOGRAFÍAS HISTÓRICAS */}
          {biographies.map(({ slug, Component, Sidebar, metadata }) => (
            <Route key={`bio-${slug}`} path={`/bio/${slug}`}>
              <MathProvider>
                <BiographyLayout Component={Component} Sidebar={Sidebar} metadata={metadata} />
              </MathProvider>
            </Route>
          ))}

          <Route path="/:rest*" component={() => <div>404</div>} />
        </Switch>
      </PageTransition>
    </>
  )
}

export default App
