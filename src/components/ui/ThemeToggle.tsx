import { useEffect, useState } from 'react';
import { isDarkMode, setTheme } from '@/lib/theme/theme';

/**
 * Alterna Papiro / Códice Nocturno (clase `dark` en <html>).
 */
export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(isDarkMode);

  useEffect(() => {
    setIsDark(isDarkMode());
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setTheme(nextDark);
    setIsDark(nextDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="ac-hit-target w-12 h-12 flex items-center justify-center elegant-panel text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
      aria-label={isDark ? 'Activar modo Papiro (día)' : 'Activar Códice Nocturno'}
      aria-pressed={isDark}
      title={isDark ? 'Volver al Papiro (Modo Día)' : 'Leer el Códice Nocturno (Modo Noche)'}
    >
      {isDark ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.5"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="M4.93 4.93l1.41 1.41"></path>
          <path d="M17.66 17.66l1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="M6.34 17.66l-1.41 1.41"></path>
          <path d="M19.07 4.93l-1.41 1.41"></path>
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fillOpacity="0.5"></path>
        </svg>
      )}
    </button>
  );
};
