// PROTOTIPO DESECHABLE (fase A.3): variantes de cabecera por ?hdr=a|b|c. Borrar tras decidir.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useLocation } from 'wouter';
import { useNavigationStore } from '@/lib/stores/NavigationStore';
import { routePath } from '@/lib/routes';
import { Logo } from '@/components/ui/Logo';
import { isDarkMode, setTheme } from '@/lib/theme/theme';
import { useI18n, isSupportedLanguage, getCanonicalSegmentType } from '@/i18n';
import { getContentPageAccent, type ContentPageAccentType } from '@/design/pageAccents';

export type HeaderProtoVariant = 'a' | 'b' | 'c' | 'd' | 'e';

export function readHeaderProtoVariant(): HeaderProtoVariant | null {
  if (typeof window === 'undefined') return null;
  const v = new URLSearchParams(window.location.search).get('hdr');
  return v && ['a', 'b', 'c', 'd', 'e'].includes(v) ? (v as HeaderProtoVariant) : null;
}

/** Tipo canónico de ruta → tipo de acento de ContentLayout */
const ROUTE_ACCENT_TYPES: Partial<Record<string, ContentPageAccentType>> = {
  teorema: 'teorema',
  definicion: 'definicion',
  ejemplo: 'ejemplo',
  ejercicio: 'ejercicio',
  axioma: 'axioma',
  modelo: 'modelo',
  sistema: 'sistema-axiomatico',
  metodo: 'metodo',
  demo: 'demostracion',
  bio: 'matematico',
  caso: 'caso-de-uso',
  plan: 'plan-de-estudio',
};

function getRouteAccent(location: string): string {
  const parts = location.split('/').filter(Boolean);
  const segment = isSupportedLanguage(parts[0]) ? parts[1] : parts[0];
  const type = segment ? ROUTE_ACCENT_TYPES[getCanonicalSegmentType(segment) ?? ''] : undefined;
  return type ? getContentPageAccent(type) : '';
}

/** Lee el --page-accent en línea de la página montada; el observador corre antes de pintar */
function usePageAccentFromLayout(): string {
  const [accent, setAccent] = useState('');
  useEffect(() => {
    const read = () => {
      const el = document.querySelector<HTMLElement>('.page-accent-scope');
      setAccent(el?.style.getPropertyValue('--page-accent').trim() ?? '');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return accent;
}

export function TopBarProto({ variant, isHome }: { variant: HeaderProtoVariant; isHome: boolean }) {
  const { toggleSearch } = useNavigationStore();
  const { t, getLocalizedPath, currentLanguage, languages, setLang } = useI18n();
  const [isDark, setIsDark] = useState(isDarkMode);
  const [hidden, setHidden] = useState(false);
  const [location] = useLocation();
  const layoutAccent = usePageAccentFromLayout();
  // La cinta toma el pigmento de la página: el de la ruta desde el primer render,
  // corregido por el de la página montada (lema/corolario comparten ruta con teorema)
  const accent = layoutAccent || getRouteAccent(location);

  useEffect(() => {
    document.documentElement.dataset.hdr = variant;
    return () => { delete document.documentElement.dataset.hdr; };
  }, [variant]);

  useEffect(() => {
    if (variant !== 'b') return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      const next = y > last && y > 64;
      setHidden(next);
      if (next) document.documentElement.dataset.hdrHidden = '';
      else delete document.documentElement.dataset.hdrHidden;
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);

  const nextLang = () => {
    const i = languages.findIndex((l) => l.code === currentLanguage.code);
    setLang(languages[(i + 1) % languages.length].code);
  };

  const toggleTheme = () => {
    setTheme(!isDark);
    setIsDark(!isDark);
  };

  if (variant === 'e') {
    return (
      <Bookmark
        accent={accent}
        isHome={isHome}
        homeHref={routePath(getLocalizedPath('/'))}
        homeLabel={t('topbar', 'backToLibrary')}
        langLabel={currentLanguage.shortLabel.toLowerCase()}
        onLang={nextLang}
        langAria={t('topbar', 'changeLanguage')}
        isDark={isDark}
        onTheme={toggleTheme}
        themeAria={isDark ? t('theme', 'activateDay') : t('theme', 'activateNight')}
        onSearch={toggleSearch}
        searchAria={t('topbar', 'search')}
      />
    );
  }

  return (
    <header
      className="hdr-proto"
      data-variant={variant}
      data-hidden={hidden || undefined}
      style={accent ? ({ '--hdr-accent': accent } as CSSProperties) : undefined}
    >
      {!isHome ? (
        <Link href={routePath(getLocalizedPath('/'))} className="hdr-proto__home" aria-label={t('topbar', 'backToLibrary')}>
          <Logo decorative className="hdr-proto__logo" />
          {(variant === 'a' || variant === 'b') && <span className="ac-rubric hdr-proto__name">Matematika</span>}
        </Link>
      ) : <span />}

      <nav className="hdr-proto__rubrics" aria-label="Preferencias">
        <button type="button" className="ac-rubric hdr-proto__item" onClick={nextLang} aria-label={t('topbar', 'changeLanguage')}>
          {currentLanguage.shortLabel.toLowerCase()}
        </button>
        <span className="hdr-proto__sep" aria-hidden="true">·</span>
        <button
          type="button"
          className="ac-rubric hdr-proto__item"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? t('theme', 'activateDay') : t('theme', 'activateNight')}
        >
          <span aria-hidden="true">{isDark ? '☼' : '☾'}</span>
        </button>
        <span className="hdr-proto__sep" aria-hidden="true">·</span>
        <button type="button" className="ac-rubric hdr-proto__item" onClick={toggleSearch} aria-label={t('topbar', 'search')} title={`${t('topbar', 'search')} (Ctrl + K)`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="20" y1="20" x2="16" y2="16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}

const BOOKMARK_KEY = 'matematika.bookmark.open';

function readBookmarkOpen(): boolean {
  try {
    const v = localStorage.getItem(BOOKMARK_KEY);
    if (v !== null) return v === '1';
  } catch { /* sin almacenamiento: valor por defecto */ }
  // Por defecto abierto en escritorio (vive en el margen) y recogido en móvil (taparía el diagrama)
  return window.matchMedia('(min-width: 1024px)').matches;
}

interface BookmarkProps {
  accent: string;
  isHome: boolean;
  homeHref: string;
  homeLabel: string;
  langLabel: string;
  langAria: string;
  onLang: () => void;
  isDark: boolean;
  themeAria: string;
  onTheme: () => void;
  searchAria: string;
  onSearch: () => void;
}

/** Arrastre mínimo (px) para que la punta cuente como arrastre y no como toque */
const DRAG_THRESHOLD = 4;
/** Arrastre (px) a partir del cual la cinta cambia de estado al soltar */
const DRAG_COMMIT = 24;

function Bookmark(props: BookmarkProps) {
  const [open, setOpen] = useState(readBookmarkOpen);
  const [drag, setDrag] = useState<number | null>(null);
  const ribbonRef = useRef<HTMLElement>(null);
  const dragStart = useRef<number | null>(null);
  const suppressClick = useRef(false);
  // La caída con rebote solo al llegar abierta; no al abrir o cerrar después
  const [settle] = useState(open);

  const commit = (next: boolean) => {
    setOpen(next);
    try { localStorage.setItem(BOOKMARK_KEY, next ? '1' : '0'); } catch { /* sin almacenamiento */ }
  };

  const travel = () => {
    const el = ribbonRef.current;
    return el ? el.offsetHeight - el.querySelector<HTMLElement>('.hdr-bookmark__tail')!.offsetHeight : 0;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragStart.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragStart.current === null) return;
    const dy = e.clientY - dragStart.current;
    if (drag === null && Math.abs(dy) < DRAG_THRESHOLD) return;
    const max = travel();
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

  const onClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    commit(!open);
  };

  return (
    <header
      ref={ribbonRef}
      className="hdr-bookmark"
      data-open={open || undefined}
      data-settle={settle || undefined}
      data-dragging={drag !== null || undefined}
      style={{
        ...(props.accent ? { '--hdr-accent': props.accent } : {}),
        ...(drag !== null ? { '--bookmark-drag': `${drag}px` } : {}),
      } as CSSProperties}
    >
      <nav id="hdr-bookmark-cloth" className="hdr-bookmark__cloth" aria-label="Marcapáginas" inert={!open}>
        {!props.isHome && (
          <Link href={props.homeHref} className="hdr-bookmark__item hdr-bookmark__mark" aria-label={props.homeLabel} title={props.homeLabel}>
            <span aria-hidden="true">M</span>
          </Link>
        )}
        <button type="button" className="ac-rubric hdr-bookmark__item" onClick={props.onLang} aria-label={props.langAria} title={props.langAria}>
          {props.langLabel}
        </button>
        <button type="button" className="hdr-bookmark__item" onClick={props.onTheme} aria-pressed={props.isDark} aria-label={props.themeAria} title={props.themeAria}>
          <span aria-hidden="true">{props.isDark ? '☼' : '☾'}</span>
        </button>
        <button type="button" className="hdr-bookmark__item" onClick={props.onSearch} aria-label={props.searchAria} title={`${props.searchAria} (Ctrl + K)`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="20" y1="20" x2="16" y2="16" />
          </svg>
        </button>
      </nav>
      <button
        type="button"
        className="hdr-bookmark__tail"
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-expanded={open}
        aria-controls="hdr-bookmark-cloth"
        aria-label={open ? 'Recoger el marcapáginas' : 'Desplegar el marcapáginas'}
        title={open ? 'Recoger' : 'Desplegar'}
      />
    </header>
  );
}
