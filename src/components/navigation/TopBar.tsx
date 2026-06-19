import { useLocation, Link } from 'wouter';
import { useNavigationStore } from '../../store/NavigationStore';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from '../ui/Logo';

export function TopBar() {
  const [location] = useLocation();
  const { toggleSearch } = useNavigationStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] pointer-events-none flex items-center justify-between px-6 py-6">
      {location !== '/' && (
        <div className="pointer-events-auto">
          <Link href="/Matematika">
            <a className="flex items-center justify-center w-12 h-12 elegant-panel" title="Volver a la Biblioteca">
              <Logo className="w-8 h-8" />
            </a>
          </Link>
        </div>
      )}

      <div className="pointer-events-auto flex items-center gap-2 ml-auto">
        <ThemeToggle />
        <button
          onClick={toggleSearch}
          className="w-12 h-12 flex items-center justify-center elegant-panel text-carbon"
          title="Buscar (Cmd + K)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </header>
  );
}
