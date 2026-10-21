import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useLocation, Link } from 'wouter';
import { useNavigationStore } from '@/lib/stores/NavigationStore';
import { routePath } from '@/lib/routes';
import { isDarkMode, setTheme } from '@/lib/theme/theme';
import { useI18n, isSupportedLanguage } from '@/i18n';

const BOOKMARK_KEY = 'matematika.bookmark.open';
/** Arrastre mínimo (px) para que la punta cuente como arrastre y no como toque */
const DRAG_THRESHOLD = 4;
/** Arrastre (px) a partir del cual la cinta cambia de estado al soltar */
const DRAG_COMMIT = 24;

function readBookmarkOpen(): boolean {
  try {
    const v = localStorage.getItem(BOOKMARK_KEY);
    if (v !== null) return v === '1';
  } catch { /* sin almacenamiento: valor por defecto */ }
  // Abierto en escritorio (vive en el margen); recogido en móvil (taparía el diagrama)
  return window.matchMedia('(min-width: 1024px)').matches;
}

/**
 * Cabecera global: marcapáginas de tela del color de la página (hereda el
 * --page-accent que AppShell fija según la ruta), colgado de la esquina superior
 * derecha. Se recoge dejando solo la punta, que se toca o se arrastra.
 */
export function TopBar() {
  const [location] = useLocation();
  const { toggleSearch } = useNavigationStore();
  const { t, getLocalizedPath, currentLanguage, languages, setLang } = useI18n();
  const [isDark, setIsDark] = useState(isDarkMode);
  const [open, setOpen] = useState(readBookmarkOpen);
  const [drag, setDrag] = useState<number | null>(null);
  // La caída con rebote solo al llegar abierta; no al abrir o cerrar después
  const [settle] = useState(open);
  const ribbonRef = useRef<HTMLElement>(null);
  const tailRef = useRef<HTMLButtonElement>(null);
  const dragStart = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const cleanParts = location.split('/').filter(Boolean);
  const isHome = location === '/' || cleanParts.length === 0 || (cleanParts.length === 1 && isSupportedLanguage(cleanParts[0]));

  const commit = (next: boolean) => {
    setOpen(next);
    try { localStorage.setItem(BOOKMARK_KEY, next ? '1' : '0'); } catch { /* sin almacenamiento */ }
  };

  const nextLang = () => {
    const i = languages.findIndex((l) => l.code === currentLanguage.code);
    setLang(languages[(i + 1) % languages.length].code);
  };

  const toggleTheme = () => {
    setTheme(!isDark);
    setIsDark(!isDark);
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    dragStart.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (dragStart.current === null) return;
    const dy = e.clientY - dragStart.current;
    if (drag === null && Math.abs(dy) < DRAG_THRESHOLD) return;
    const max = (ribbonRef.current?.offsetHeight ?? 0) - (tailRef.current?.offsetHeight ?? 0);
    setDrag(open ? Math.min(0, Math.max(-max, dy)) : Math.max(0, Math.min(max, dy)));
  };

  const onPointerUp = () => {
    if (drag !== null) {
      suppressClick.current = true;
      if (open && drag < -DRAG_COMMIT) commit(false);
      else if (!open && drag > DRAG_COMMIT) commit(true);
    }
    dragStart.current = null;
    setDrag(null);
  };

  const onTailClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    commit(!open);
  };

  const themeLabel = isDark ? t('theme', 'activateDay') : t('theme', 'activateNight');
  const langLabel = `${t('topbar', 'changeLanguage')}: ${currentLanguage.name}`;

  return (
    <header
      ref={ribbonRef}
      className="ac-bookmark"
      data-open={open || undefined}
      data-settle={settle || undefined}
      data-dragging={drag !== null || undefined}
      style={drag !== null ? ({ '--bookmark-drag': `${drag}px` } as CSSProperties) : undefined}
    >
      <nav id="ac-bookmark-cloth" className="ac-bookmark__cloth" aria-label={t('topbar', 'bookmark')} inert={!open}>
        {!isHome && (
          <Link
            href={routePath(getLocalizedPath('/'))}
            className="ac-bookmark__item ac-bookmark__mark"
            aria-label={t('topbar', 'backToLibrary')}
            title={t('topbar', 'backToLibrary')}
          >
            <span aria-hidden="true">M</span>
          </Link>
        )}
        <button type="button" className="ac-rubric ac-bookmark__item" onClick={nextLang} aria-label={langLabel} title={langLabel}>
          {currentLanguage.shortLabel.toLowerCase()}
        </button>
        <button type="button" className="ac-bookmark__item" onClick={toggleTheme} aria-pressed={isDark} aria-label={themeLabel} title={themeLabel}>
          <span aria-hidden="true">{isDark ? '☼' : '☾'}</span>
        </button>
        <button
          type="button"
          className="ac-bookmark__item"
          onClick={toggleSearch}
          aria-label={t('topbar', 'search')}
          title={`${t('topbar', 'search')} (Ctrl + K)`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="20" y1="20" x2="16" y2="16" />
          </svg>
        </button>
      </nav>
      <button
        ref={tailRef}
        type="button"
        className="ac-bookmark__tail"
        onClick={onTailClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-expanded={open}
        aria-controls="ac-bookmark-cloth"
        aria-label={open ? t('topbar', 'closeBookmark') : t('topbar', 'openBookmark')}
        title={open ? t('topbar', 'closeBookmark') : t('topbar', 'openBookmark')}
      />
    </header>
  );
}
