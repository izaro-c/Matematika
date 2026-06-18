import { useLocation, Link } from "wouter";
import { useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from './components/ui/MDXBlocks';
import { Logo } from "./components/ui/Logo";
import { ThemeToggle } from "./components/navigation/ThemeToggle";
import { MarginaliaPanel } from "./components/content/MarginaliaPanel";
import { PageTransition } from "./components/layout/PageTransition";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { SymbolDictionaryManager } from "./components/content/SymbolDictionaryManager";
import { SearchOmnibar } from "./components/navigation/SearchOmnibar";
import { useNavigationStore } from "./store/NavigationStore";
import { AppRouter } from "./routes/AppRouter";

/**
 * App
 *
 * Componente raíz de la aplicación.
 * Provee el contexto MDX (`MDXProvider`) y envuelve la navegación (`AppRouter`).
 * Renderiza elementos persistentes de la UI como el botón de búsqueda, 
 * el panel de marginalia y el botón para alternar el tema.
 */
function App() {
  const [location] = useLocation();
  const { toggleSearch } = useNavigationStore();

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
    <MDXProvider components={MDXComponents}>
      <SymbolDictionaryManager />
      <ThemeToggle />
      <button
        onClick={toggleSearch}
        className="fixed top-6 right-8 md:right-12 z-50 w-12 h-12 flex items-center justify-center elegant-panel text-carbon"
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
          <Link href="/Matematika">
            <a className="flex items-center justify-center w-12 h-12 elegant-panel" title="Volver a la Biblioteca">
              <Logo className="w-8 h-8" />
            </a>
          </Link>
        </div>
      )}

      <PageTransition>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </PageTransition>
    </MDXProvider>
  );
}

export default App;
