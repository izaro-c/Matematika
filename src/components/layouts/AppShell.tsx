import { TopBar } from "@/components/navigation/TopBar";
import { MarginaliaPanel } from "@/components/content/MarginaliaPanel";
import { SymbolDictionaryManager } from "@/components/content/SymbolDictionaryManager";
import { db } from "@/data/content";
import { resolveBranchCode } from "@/data/content/msc2020";
import { getLibrarySection } from "@/data/content/librarySections";
import { getContentPageAccent, UI, CONTENT_PAGE_ACCENTS } from "@/design";
import { useLocation } from "wouter";
import { createPortal } from "react-dom";
import { isSupportedLanguage, getCanonicalSegmentType, useI18n } from "@/i18n";
import { lazy, Suspense } from "react";
import { useNavigationStore } from "@/lib/stores/NavigationStore";

const SearchOmnibar = lazy(() => import("@/components/navigation/SearchOmnibar").then(m => ({ default: m.SearchOmnibar })));

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useI18n();
  const [location] = useLocation();
  const isSearchOpen = useNavigationStore((state) => state.isSearchOpen);
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

  // En una rama, el marcapáginas es de la misma tela que el uñero y los tomos
  const branchAccent = canonical === 'rama' && routeId ? getLibrarySection(resolveBranchCode(routeId))?.accent : undefined;
  // El índice biográfico lleva el marcapáginas del color de las biografías
  const historyAccent = canonical === 'historia' ? getContentPageAccent('matematico') : undefined;

  // Ocultar TopBar, MarginaliaPanel y elementos globales flotantes en editores (/editor)
  const isEditor = location.split('/').includes('editor');

  return (
    <div
      className={`ac-page ${!isEditor ? 'ac-ink-scope' : ''} ${pageType ? 'page-accent-scope' : ''}`}
      data-page-type={pageType}
      data-branch-accent={branchAccent}
      style={
        pageType ? ({ '--page-accent': getContentPageAccent(pageType) } as React.CSSProperties)
        : branchAccent ? ({ '--bookmark-pigment': `var(--cloth-${branchAccent})` } as React.CSSProperties)
        : historyAccent ? ({ '--page-accent': historyAccent } as React.CSSProperties)
        : undefined
      }
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
      {!isEditor && (
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
