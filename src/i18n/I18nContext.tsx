import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, getLanguage, isSupportedLanguage, SEGMENT_TO_CANONICAL_TYPE } from './config';
import type { LanguageConfig, RouteSegmentMap } from './types';

export type TranslationParams = Record<string, string | number>;

export interface I18nContextType {
  lang: string;
  currentLanguage: LanguageConfig;
  languages: LanguageConfig[];
  setLang: (lang: string) => void;
  t: (...args: [...string[], TranslationParams] | string[]) => string;
  getRouteSegment: (segmentKey: keyof RouteSegmentMap, targetLang?: string) => string;
  getLocalizedPath: (rawPath: string, targetLang?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'matematika_user_lang';

function resolveNestedValue(dict: Record<string, unknown>, keys: string[]): string | undefined {
  let current: unknown = dict;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

function interpolateParams(text: string, params?: TranslationParams): string {
  if (!params || typeof text !== 'string') return text;

  return text.replace(/\{(\s*[\w.-]+\s*)\}/g, (match, rawKey) => {
    const key = rawKey.trim();
    if (key in params && params[key] !== undefined && params[key] !== null) {
      return String(params[key]);
    }
    if (key === 'count') {
      const fallback = params.count ?? params.total ?? params.filtered ?? params.value ?? params.items ?? params.length;
      if (fallback !== undefined && fallback !== null) return String(fallback);
    }
    if (key === 'total') {
      const fallback = params.total ?? params.count ?? params.value;
      if (fallback !== undefined && fallback !== null) return String(fallback);
    }
    if (key === 'correct') {
      const fallback = params.correct ?? params.count ?? params.value;
      if (fallback !== undefined && fallback !== null) return String(fallback);
    }
    if (key === 'filtered') {
      const fallback = params.filtered ?? params.count ?? params.value;
      if (fallback !== undefined && fallback !== null) return String(fallback);
    }
    if (key === 'value') {
      const fallback = params.value ?? params.count ?? params.total;
      if (fallback !== undefined && fallback !== null) return String(fallback);
    }
    return match;
  });
}

function resolveTranslation(
  currentDict: Record<string, any>,
  defaultDict: Record<string, any>,
  args: any[]
): string {
  if (args.length === 0) return '';

  let params: TranslationParams | undefined;
  let keyArgs: any[];

  const lastArg = args[args.length - 1];
  if (lastArg !== null && typeof lastArg === 'object' && !Array.isArray(lastArg)) {
    params = lastArg;
    keyArgs = args.slice(0, -1);
  } else if (
    args.length > 1 &&
    (typeof lastArg === 'number' || typeof lastArg === 'string')
  ) {
    const candidateKeys = args.slice(0, -1).flatMap(arg => String(arg).split('.')).filter(Boolean);
    const candidateText = resolveNestedValue(currentDict, candidateKeys) ?? resolveNestedValue(defaultDict, candidateKeys);
    if (candidateText !== undefined) {
      params = { count: lastArg, total: lastArg, value: lastArg };
      keyArgs = args.slice(0, -1);
    } else {
      keyArgs = args;
    }
  } else {
    keyArgs = args;
  }

  const keys = keyArgs.flatMap(arg => String(arg).split('.')).filter(Boolean);
  const rawText = resolveNestedValue(currentDict, keys) ?? resolveNestedValue(defaultDict, keys) ?? keys.join('.');
  return interpolateParams(rawText, params);
}

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

  const t = useCallback((...args: unknown[]): string => {
    return resolveTranslation(currentLanguage.dictionary, DEFAULT_LANGUAGE.dictionary, args);
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
      t: (...args: unknown[]) => resolveTranslation(DEFAULT_LANGUAGE.dictionary, DEFAULT_LANGUAGE.dictionary, args),
      getRouteSegment: (segmentKey: keyof RouteSegmentMap, targetLang?: string) => {
        const targetConfig = getLanguage(targetLang || DEFAULT_LANGUAGE.code);
        return targetConfig.routeSegments[segmentKey] || segmentKey;
      },
      getLocalizedPath: (rawPath: string, targetLang?: string) => {
        return localizePath(rawPath, targetLang || DEFAULT_LANGUAGE.code);
      },
    };
  }
  return context;
}