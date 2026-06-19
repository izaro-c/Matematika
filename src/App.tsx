import { useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from './components/ui/MDXBlocks';
import { MarginaliaPanel } from "./components/content/MarginaliaPanel";
import { PageTransition } from "./components/layout/PageTransition";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { SymbolDictionaryManager } from "./components/content/SymbolDictionaryManager";
import { SearchOmnibar } from "./components/navigation/SearchOmnibar";
import { TopBar } from "./components/navigation/TopBar";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
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
  useKeyboardShortcuts();

  // Scroll Sync Listener for Editor Live Preview
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'scroll') {
        const percentage = e.data.percentage;
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
      <TopBar />
      <SearchOmnibar />
      <MarginaliaPanel />

      <PageTransition>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </PageTransition>
    </MDXProvider>
  );
}

export default App;
