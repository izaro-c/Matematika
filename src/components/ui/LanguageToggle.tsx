import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/i18n';

export const LanguageToggle: React.FC = () => {
  const { currentLanguage, languages, setLang, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If only 2 languages, toggle on click directly or open dropdown if more
  const handleToggleOrOpen = () => {
    if (languages.length === 2) {
      const next = languages.find((l) => l.code !== currentLanguage.code) || languages[0];
      setLang(next.code);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggleOrOpen}
        className="ac-hit-target h-12 px-3 flex items-center justify-center gap-1.5 elegant-panel text-carbon font-semibold text-xs tracking-wider focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
        aria-label={`${t('topbar', 'changeLanguage')}: ${currentLanguage.name}`}
        title={`${t('topbar', 'changeLanguage')} (${currentLanguage.name})`}
        aria-expanded={isOpen}
      >
        <span className="text-[11px] uppercase font-serif text-terracota dark:text-ocre">{currentLanguage.shortLabel}</span>
        {languages.length > 2 && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {isOpen && languages.length > 2 && (
        <div className="absolute right-0 mt-2 py-1 w-36 elegant-panel z-50 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLang(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-canela/10 dark:hover:bg-canela/20 transition-colors ${
                lang.code === currentLanguage.code ? 'font-bold text-terracota dark:text-ocre' : 'text-carbon'
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-[10px] text-gris uppercase font-mono">{lang.shortLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
