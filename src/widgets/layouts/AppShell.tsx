import { TopBar } from "@/widgets/navigation/TopBar";
import { SearchOmnibar } from "@/widgets/navigation/SearchOmnibar";
import { MarginaliaPanel } from "@/widgets/content/MarginaliaPanel";
import { SymbolDictionaryManager } from "@/widgets/content/SymbolDictionaryManager";
import { db } from "@/entities/content";
import { getContentPageAccent } from "@/shared/design";
import { useLocation } from "wouter";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const [, routePrefix, routeId] = location.split('/');

  let pageType: string | undefined;
  switch (routePrefix) {
    case 'axiomas':
    case 'axioma':
      pageType = 'axioma';
      break;
    case 'modelo':
      pageType = 'modelo';
      break;
    case 'sistema':
      pageType = 'sistema-axiomatico';
      break;
    case 'grafo':
      pageType = 'definicion';
      break;
    case 'teorema':
      pageType = routeId ? db.getTheorem(routeId)?.type || 'teorema' : 'teorema';
      break;
    case 'definicion':
      pageType = 'definicion';
      break;
    case 'ejemplo':
      pageType = 'ejemplo';
      break;
    case 'ejercicio':
      pageType = 'ejercicio';
      break;
    case 'demo':
      pageType = 'demostracion';
      break;
    case 'bio':
      pageType = 'matematico';
      break;
    case 'plan':
      pageType = 'plan-de-estudio';
      break;
    case 'caso':
      pageType = 'caso-de-uso';
      break;
    default:
      if (db.getAllLessons().some((lesson) => lesson.slug === routePrefix)) {
        pageType = 'leccion';
      }
  }

  return (
    <div
      className={`min-h-screen bg-lienzo text-carbon font-serif ${pageType ? 'page-accent-scope' : ''}`}
      data-page-type={pageType}
      style={pageType ? ({ '--page-accent': getContentPageAccent(pageType) } as React.CSSProperties) : undefined}
    >
      <SymbolDictionaryManager />
      <TopBar />
      <SearchOmnibar />
      <MarginaliaPanel />

      <div className="w-full">{children}</div>
    </div>
  );
};
