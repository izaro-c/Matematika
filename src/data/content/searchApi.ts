import type { IFuseOptions } from 'fuse.js';
import { db } from '@/data/content';
import { mscNames, getMscName } from '@/data/content/msc2020';
import {
  PAGE_ACCENTS,
  type PageAccentType,
} from '@/design';
import { getGlossaryDictionary } from '@content/glossary/dictionary';
import { routePath } from '@/lib/routes';

export type SearchResultType = PageAccentType;

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  href: string;
};

export const ALL_TYPES: SearchResultType[] = [
  'teorema', 'método', 'definición', 'axioma', 'modelo',
  'ejemplo', 'ejercicio', 'demo', 'matemático', 'caso_uso', 'glosario', 'msc2020',
];

export const TYPE_ICONS: Record<SearchResultType, string> = {
  teorema: '✦',
  método: '↦',
  definición: '◆',
  axioma: '◈',
  modelo: '☙',
  ejemplo: '▸',
  ejercicio: '✎',
  demo: '❧',
  matemático: '❦',
  caso_uso: '◎',
  glosario: '§',
  msc2020: '⑂',
};

export const TYPE_COLORS: Record<SearchResultType, string> = PAGE_ACCENTS;

export const TYPE_LABELS: Record<SearchResultType, string> = {
  teorema: 'Teoremas',
  método: 'Métodos',
  definición: 'Definiciones',
  axioma: 'Axiomas',
  modelo: 'Modelos',
  ejemplo: 'Ejemplos',
  ejercicio: 'Ejercicios',
  demo: 'Demostraciones',
  matemático: 'Biografías',
  caso_uso: 'Casos de uso',
  glosario: 'Glosario',
  msc2020: 'Ramas MSC2020',
};

export const TYPE_RESULT_LABELS: Record<SearchResultType, string> = {
  teorema: 'Teorema',
  método: 'Método',
  definición: 'Definición',
  axioma: 'Axioma',
  modelo: 'Modelo',
  ejemplo: 'Ejemplo',
  ejercicio: 'Ejercicio',
  demo: 'Demostración',
  matemático: 'Matemático',
  caso_uso: 'Caso de uso',
  glosario: 'Término',
  msc2020: 'Rama MSC2020',
};

export const SEARCH_FUSE_OPTIONS: IFuseOptions<SearchResult> = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'subtitle', weight: 0.3 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  ignoreDiacritics: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

export function buildSearchIndex(lang?: string): SearchResult[] {
  const index: SearchResult[] = [];

  for (const thm of db.getAllTheorems(lang)) {
    index.push({
      id: `thm-${thm.id}`,
      type: 'teorema',
      title: thm.title,
      subtitle: thm.description,
      href: routePath(`/teorema/${thm.slug}`),
    });
  }

  for (const method of db.getAllMethods(lang)) {
    index.push({
      id: `method-${method.id}`,
      type: 'método',
      title: method.title,
      subtitle: method.description,
      href: routePath(`/metodo/${method.slug}`),
    });
  }

  for (const def of db.getAllDefinitions(lang)) {
    index.push({
      id: `def-${def.id}`,
      type: 'definición',
      title: def.title,
      subtitle: def.description,
      href: routePath(`/definicion/${def.slug}`),
    });
  }

  for (const ex of db.getAllExamples(lang)) {
    index.push({
      id: `ex-${ex.id}`,
      type: 'ejemplo',
      title: ex.title,
      subtitle: ex.description,
      href: routePath(`/ejemplo/${ex.slug}`),
    });
  }

  for (const ez of db.getAllExercises(lang)) {
    index.push({
      id: `ez-${ez.id}`,
      type: 'ejercicio',
      title: ez.title,
      subtitle: ez.description,
      href: routePath(`/ejercicio/${ez.slug}`),
    });
  }

  for (const demo of db.getAllDemos(lang)) {
    index.push({
      id: `demo-${demo.id}`,
      type: 'demo',
      title: demo.title,
      subtitle: demo.description,
      href: routePath(`/demo/${demo.slug}`),
    });
  }

  for (const bio of db.getAllMathematicians(lang)) {
    index.push({
      id: `bio-${bio.id}`,
      type: 'matemático',
      title: bio.name,
      subtitle: bio.description,
      href: routePath(`/bio/${bio.slug}`),
    });
  }

  for (const uc of db.getAllUseCases(lang)) {
    index.push({
      id: `uc-${uc.id}`,
      type: 'caso_uso',
      title: uc.title,
      subtitle: uc.description,
      href: routePath(`/caso/${uc.slug}`),
    });
  }

  for (const axm of db.getAllAxioms(lang)) {
    index.push({
      id: `axm-${axm.id}`,
      type: 'axioma',
      title: axm.title,
      subtitle: axm.description,
      href: routePath(`/axioma/${axm.slug}`),
    });
  }

  for (const model of db.getAllModels(lang)) {
    index.push({
      id: `model-${model.id}`,
      type: 'modelo',
      title: model.title,
      subtitle: model.description,
      href: routePath(`/modelo/${model.slug}`),
    });
  }

  const glossaryDict = getGlossaryDictionary(lang);
  for (const [key, term] of Object.entries(glossaryDict)) {
    index.push({
      id: `glossary-${key}`,
      type: 'glosario',
      title: term.title,
      subtitle: term.definition.slice(0, 120),
      href: key,
    });
  }

  for (const [code, defaultName] of Object.entries(mscNames)) {
    const localizedName = lang ? getMscName(code, lang) : defaultName;
    index.push({
      id: `msc-${code}`,
      type: 'msc2020',
      title: `${code} — ${localizedName}`,
      subtitle: 'Clasificación MSC2020',
      href: routePath(`/rama/${code}`),
    });
  }

  return index;
}

const searchIndexes: Record<string, SearchResult[]> = {};

export function getSearchIndex(lang?: string): SearchResult[] {
  const key = lang || 'es';
  if (!searchIndexes[key]) {
    searchIndexes[key] = buildSearchIndex(lang);
  }
  return searchIndexes[key];
}

export const SEARCH_INDEX = buildSearchIndex();
