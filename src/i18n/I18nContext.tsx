import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, getLanguage, isSupportedLanguage, SEGMENT_TO_CANONICAL_TYPE } from './config';
import type { LanguageConfig, RouteSegmentMap, TranslationDictionary } from './types';

interface I18nContextType {
  lang: string;
  currentLanguage: LanguageConfig;
  languages: LanguageConfig[];
  setLang: (code: string) => void;
  t: <K1 extends keyof TranslationDictionary, K2 extends keyof TranslationDictionary[K1]>(
    section: K1,
    key: K2,
    params?: Record<string, string | number>
  ) => string;
  getRouteSegment: (segmentKey: keyof RouteSegmentMap, langCode?: string) => string;
  getLocalizedPath: (pathWithoutLang: string, targetLang?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'matematika_user_lang';

export function getInitialLanguage(): string {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE.code;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isSupportedLanguage(saved)) return saved;
    const browserLang = navigator.language.split('-')[0];
    if (isSupportedLanguage(browserLang)) return browserLang;
  } catch {
    // fallback
  }
  return DEFAULT_LANGUAGE.code;
}

export function localizePath(rawPath: string, targetLang: string = DEFAULT_LANGUAGE.code): string {
  const target = targetLang || DEFAULT_LANGUAGE.code;
  const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  if (cleanPath === '/' || cleanPath === '') return `/${target}`;
  const parts = cleanPath.split('/').filter(Boolean);
  if (parts.length === 0) return `/${target}`;
  if (isSupportedLanguage(parts[0])) parts.shift();
  if (parts.length === 0) return `/${target}`;
  const canonical = SEGMENT_TO_CANONICAL_TYPE[parts[0].toLowerCase()];
  if (canonical) {
    const targetConfig = getLanguage(target);
    parts[0] = targetConfig.routeSegments[canonical] || parts[0];
  }
  return `/${target}/${parts.join('/')}`;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persistedLang, setPersistedLang] = useState<string>(getInitialLanguage);
  const [location, setLocation] = useLocation();

  // Derive current language from URL if present, otherwise fallback to persisted user preference
  const urlSegments = location.split('/').filter(Boolean);
  const langCode = (urlSegments.length > 0 && isSupportedLanguage(urlSegments[0]))
    ? urlSegments[0]
    : persistedLang;

  const currentLanguage = useMemo(() => getLanguage(langCode), [langCode]);

  const setLang = useCallback((newLang: string) => {
    if (!isSupportedLanguage(newLang)) return;
    setPersistedLang(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }

    // Rewrite current URL to new language prefix and translated segments
    const segments = location.split('/').filter(Boolean);
    if (segments.length === 0) {
      setLocation(`/${newLang}`);
      return;
    }

    let remainingSegments = segments;
    if (isSupportedLanguage(segments[0])) {
      remainingSegments = segments.slice(1);
    }

    if (remainingSegments.length === 0) {
      setLocation(`/${newLang}`);
      return;
    }

    const firstSegment = remainingSegments[0].toLowerCase();
    const canonicalType = SEGMENT_TO_CANONICAL_TYPE[firstSegment];
    if (canonicalType) {
      const targetConfig = getLanguage(newLang);
      const translatedSegment = targetConfig.routeSegments[canonicalType] || firstSegment;
      remainingSegments = [translatedSegment, ...remainingSegments.slice(1)];
    }

    setLocation(`/${newLang}/${remainingSegments.join('/')}`);
  }, [location, setLocation]);

  const t = useCallback(<K1 extends keyof TranslationDictionary, K2 extends keyof TranslationDictionary[K1]>(
    section: K1,
    key: K2,
    params?: Record<string, string | number>
  ): string => {
    const dict = currentLanguage.dictionary;
    const sectionDict = dict[section] as unknown as Record<string, string> | undefined;
    let text = sectionDict?.[key as string] || (DEFAULT_LANGUAGE.dictionary[section] as unknown as Record<string, string>)?.[key as string] || String(key);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        const valStr = String(v);
        if (!valStr) {
          text = text.replace(new RegExp(`{${k}}`, 'g'), '');
          return;
        }
        const placeholder = `{${k}}`;
        let index = text.indexOf(placeholder);
        while (index !== -1) {
          text = text.slice(0, index) + valStr + text.slice(index + placeholder.length);
          index = text.indexOf(placeholder, index + valStr.length);
        }
      });
    }
    return text;
  }, [currentLanguage]);

  const getRouteSegment = useCallback((segmentKey: keyof RouteSegmentMap, targetLang?: string): string => {
    const targetConfig = getLanguage(targetLang || langCode);
    return targetConfig.routeSegments[segmentKey] || segmentKey;
  }, [langCode]);

  const getLocalizedPath = useCallback((rawPath: string, targetLang?: string): string => {
    return localizePath(rawPath, targetLang || langCode);
  }, [langCode]);

  const value = useMemo<I18nContextType>(() => ({
    lang: langCode,
    currentLanguage,
    languages: SUPPORTED_LANGUAGES,
    setLang,
    t,
    getRouteSegment,
    getLocalizedPath,
  }), [langCode, currentLanguage, setLang, t, getRouteSegment, getLocalizedPath]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      lang: DEFAULT_LANGUAGE.code,
      currentLanguage: DEFAULT_LANGUAGE,
      languages: SUPPORTED_LANGUAGES,
      setLang: () => {},
      t: (section, key, params) => {
        let text = (DEFAULT_LANGUAGE.dictionary[section] as unknown as Record<string, string>)?.[key as string] || '';
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            const valStr = String(v);
            if (!valStr) {
              text = text.replace(new RegExp(`{${k}}`, 'g'), '');
              return;
            }
            const placeholder = `{${k}}`;
            let index = text.indexOf(placeholder);
            while (index !== -1) {
              text = text.slice(0, index) + valStr + text.slice(index + placeholder.length);
              index = text.indexOf(placeholder, index + valStr.length);
            }
          });
        }
        return text;
      },
      getRouteSegment: (segmentKey, targetLang) => {
        const targetConfig = getLanguage(targetLang || DEFAULT_LANGUAGE.code);
        return targetConfig.routeSegments[segmentKey] || segmentKey;
      },
      getLocalizedPath: (rawPath, targetLang) => {
        return localizePath(rawPath, targetLang || DEFAULT_LANGUAGE.code);
      },
    };
  }
  return context;
}
