import { useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@/widgets/mdx/MDXBlocks';
import { PageTransition } from "@/widgets/layouts/PageTransition";
import { ErrorBoundary } from "@/widgets/layouts/ErrorBoundary";
import { AppShell } from "@/widgets/layouts/AppShell";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { AppRouter } from "@/app/routes/AppRouter";
import { Router } from "wouter";

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

  // Tratamiento riguroso de la variable de entorno para compatibilidad Vite-Wouter.
  const rawBase = import.meta.env.BASE_URL;
  const wouterBase = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

  return (
    <Router base={wouterBase}>
      <MDXProvider components={MDXComponents}>
        <AppShell>
          <PageTransition>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </PageTransition>
        </AppShell>
      </MDXProvider>
    </Router>
  );
}

export default App;
