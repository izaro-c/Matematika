import { describe, it, expect, beforeEach } from 'vitest';
import { isDarkMode, setTheme } from '../src/lib/theme/theme';

describe('theme persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('setTheme(true) adds dark class and sets localStorage item', () => {
    setTheme(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(isDarkMode()).toBe(true);
  });

  it('setTheme(false) removes dark class and sets localStorage item', () => {
    setTheme(true);
    setTheme(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(isDarkMode()).toBe(false);
  });
});
