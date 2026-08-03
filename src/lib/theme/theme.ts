export function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function setTheme(isDark: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
    try {
      localStorage.setItem('theme', 'dark');
    } catch {
      // Ignore storage errors in restricted contexts
    }
  } else {
    root.classList.remove('dark');
    try {
      localStorage.setItem('theme', 'light');
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }
}
