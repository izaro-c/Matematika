import { useLocation, Link } from 'wouter';
import { useNavigationStore } from '@/lib/stores/NavigationStore';
import { routePath } from '@/lib/routes';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Logo } from '@/components/ui/Logo';
import { useI18n, isSupportedLanguage } from '@/i18n';

export function TopBar() {
  const [location] = useLocation();
  const { toggleSearch } = useNavigationStore();
  const { t, getLocalizedPath } = useI18n();

  const cleanParts = location.split('/').filter(Boolean);
  const isHome = location === '/' || cleanParts.length === 0 || (cleanParts.length === 1 && isSupportedLanguage(cleanParts[0]));


  return (
    <header className="fixed top-0 left-0 right-0 z-[60] pointer-events-none flex items-center justify-between px-6 py-6">
      {!isHome && (
        <div className="pointer-events-auto">
          <Link
            href={routePath(getLocalizedPath('/'))}
            className="flex items-center justify-center w-12 h-12 elegant-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
            aria-label={t('topbar', 'backToLibrary')}
            title={t('topbar', 'backToLibrary')}
          >
            <Logo decorative className="w-8 h-8" />
          </Link>
        </div>
      )}

      <div className="pointer-events-auto flex items-center gap-2 ml-auto">
        <LanguageToggle />
        <ThemeToggle />
        <button
          type="button"
          onClick={toggleSearch}
          className="ac-hit-target w-12 h-12 flex items-center justify-center elegant-panel text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
          aria-label={t('topbar', 'search')}
          title={`${t('topbar', 'search')} (Cmd + K)`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </header>
  );
}
