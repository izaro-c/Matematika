import { TopBar } from "@/components/navigation/TopBar";
import { SymbolDictionaryManager } from "@/components/content/SymbolDictionaryManager";
import { db } from "@/data/content";
import { getContentPageAccent, UI, CONTENT_PAGE_ACCENTS } from "@/design";
import { useLocation } from "wouter";
import { createPortal } from "react-dom";
import { isSupportedLanguage, getCanonicalSegmentType, useI18n } from "@/i18n";
import { lazy, Suspense } from "react";
import { useNavigationStore } from "@/lib/stores/NavigationStore";
import { useGlossaryStore } from "@/lib/stores/GlossaryStore";

const SearchOmnibar = lazy(() => import("@/components/navigation/SearchOmnibar").then(m => ({ default: m.SearchOmnibar })));
const MarginaliaPanel = lazy(() => import("@/components/content/MarginaliaPanel").then(m => ({ default: m.MarginaliaPanel })));

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useI18n();
  const [location] = useLocation();
  const isSearchOpen = useNavigationStore((state) => state.isSearchOpen);
  const activeTerms = useGlossaryStore((state) => state.activeTerms);
  const activeFormulaTerms = useGlossaryStore((state) => state.activeFormulaTerms);
  const hasActiveMarginalia = Boolean(activeTerms || activeFormulaTerms);
  const rawParts = location.split('/').filter(Boolean);
  const parts = (rawParts.length > 0 && isSupportedLanguage(rawParts[0])) ? rawParts.slice(1) : rawParts;
  const routePrefix = parts[0] || '';
  const routeId = parts[1] || '';

  const canonical = getCanonicalSegmentType(routePrefix);
  let pageType: string | undefined;
  if (canonical === 'teorema') {
    pageType = routeId ? db.getTheorem(routeId)?.type || 'teorema' : 'teorema';
  } else if (canonical === 'demo') {
    pageType = 'demostracion';
  } else if (canonical === 'sistema') {
    pageType = 'sistema-axiomatico';
  } else if (canonical === 'bio') {
    pageType = 'matematico';
  } else if (canonical === 'plan') {
    pageType = 'plan-de-estudio';
  } else if (canonical === 'caso') {
    pageType = 'caso-de-uso';
  } else if (canonical === 'grafo') {
    pageType = 'definicion';
  } else if (canonical && canonical in CONTENT_PAGE_ACCENTS) {
    pageType = canonical;
  }

  // Ocultar TopBar, MarginaliaPanel y elementos globales flotantes en editores (/editor, /editor_v2)
  const isEditor = location.split('/').includes('editor');

  return (
    <div
      className={`ac-page ${!isEditor ? 'ac-ink-scope' : ''} ${pageType ? 'page-accent-scope' : ''}`}
      data-page-type={pageType}
      style={pageType ? ({ '--page-accent': getContentPageAccent(pageType) } as React.CSSProperties) : undefined}
    >
      {!isEditor && (
        <a href="#contenido-principal" className="ac-skip-link">
          {t('accessibility', 'skipToContent')}
        </a>
      )}
      {!isEditor && <SymbolDictionaryManager />}
      {!isEditor && <TopBar />}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchOmnibar />
        </Suspense>
      )}
      {!isEditor && hasActiveMarginalia && (
        <Suspense fallback={null}>
          <MarginaliaPanel />
        </Suspense>
      )}

      <div id="contenido-principal" className="w-full" tabIndex={-1}>
        {children}
      </div>

      {!isEditor && createPortal(
        <div className={UI.paperGrain} aria-hidden="true" />,
        document.body,
      )}
    </div>
  );
};
