import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { AppRouter } from "@/app/routes/AppRouter";
import { AppShell } from "@/components/layouts/AppShell";
import { MDXComponents } from '@/components/mdx/MDXBlocks';
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { I18nProvider } from "@/i18n";
import { MDXProvider } from '@mdx-js/react';
import { useEffect } from 'react';
import { Router } from "wouter";

/**
 * App
 *
 * Componente raíz de la aplicación.
 * Provee el contexto i18n (`I18nProvider`), MDX (`MDXProvider`) y envuelve la navegación (`AppRouter`).
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

  const rawBase = import.meta.env.BASE_URL;
  const wouterBase = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

  return (
    <Router base={wouterBase}>
      <I18nProvider>
        <MDXProvider components={MDXComponents}>
          <AppShell>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </AppShell>
        </MDXProvider>
      </I18nProvider>
    </Router>
  );
}

export default App;
