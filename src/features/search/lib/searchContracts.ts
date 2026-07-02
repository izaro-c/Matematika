import type { IFuseOptions } from 'fuse.js';
import { db } from '@/entities/content';
import { mscNames } from '@/entities/content/msc2020';
import { dictionary } from '@/shared/lib/glossaryDictionary';
import { routePath } from '@/shared/lib/routeHelper';

export type SearchResultType =
  | 'teorema'
  | 'lección'
  | 'definición'
  | 'ejemplo'
  | 'ejercicio'
  | 'demo'
  | 'glosario'
  | 'matemático'
  | 'caso_uso'
  | 'axioma'
  | 'msc2020'
  | 'modelo';

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  href: string;
};

export const ALL_TYPES: SearchResultType[] = [
  'teorema', 'lección', 'definición', 'axioma', 'modelo',
  'ejemplo', 'ejercicio', 'demo', 'matemático', 'caso_uso', 'glosario', 'msc2020',
];

export const TYPE_ICONS: Record<SearchResultType, string> = {
  teorema: 'T',
  lección: '§',
  definición: 'D',
  ejemplo: 'E',
  ejercicio: 'P',
  demo: '∴',
  glosario: 'Σ',
  matemático: '✦',
  caso_uso: '◈',
  axioma: ' A',
  msc2020: '⊞',
  modelo: 'M',
};

export const TYPE_COLORS: Record<SearchResultType, string> = {
  teorema: 'var(--theme-salvia)', lección: 'var(--theme-pavo)', definición: 'var(--theme-ocre)',
  axioma: 'var(--theme-carbon)', modelo: 'var(--theme-pavo)', ejemplo: 'var(--theme-salvia)', ejercicio: 'var(--theme-terracota)',
  demo: 'var(--theme-pavo)', matemático: 'var(--theme-ocre)', caso_uso: 'var(--theme-salvia)',
  glosario: 'var(--theme-ocre)', msc2020: 'var(--theme-pavo)',
};

export const SEARCH_FUSE_OPTIONS: IFuseOptions<SearchResult> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'subtitle', weight: 1 },
  ],
  threshold: 0.35,
  includeMatches: true,
  minMatchCharLength: 2,
};

export function buildSearchIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  for (const thm of db.theorems.values()) {
    index.push({
      id: `thm-${thm.id}`,
      type: 'teorema',
      title: thm.title,
      subtitle: thm.description,
      href: routePath(`/teorema/${thm.slug}`),
    });
  }

  for (const lesson of db.lessons.values()) {
    index.push({
      id: `lesson-${lesson.id}`,
      type: 'lección',
      title: lesson.title || lesson.id,
      href: routePath(`/${lesson.slug}`),
    });
  }

  for (const def of db.definitions.values()) {
    index.push({
      id: `def-${def.id}`,
      type: 'definición',
      title: def.title,
      subtitle: def.description,
      href: routePath(`/definicion/${def.slug}`),
    });
  }

  for (const ex of db.examples.values()) {
    index.push({
      id: `ex-${ex.id}`,
      type: 'ejemplo',
      title: ex.title,
      subtitle: ex.description,
      href: routePath(`/ejemplo/${ex.slug}`),
    });
  }

  for (const ez of db.exercises.values()) {
    index.push({
      id: `ez-${ez.id}`,
      type: 'ejercicio',
      title: ez.title,
      subtitle: ez.description,
      href: routePath(`/ejercicio/${ez.slug}`),
    });
  }

  for (const demo of db.demos.values()) {
    index.push({
      id: `demo-${demo.id}`,
      type: 'demo',
      title: demo.title,
      subtitle: demo.description,
      href: routePath(`/demo/${demo.slug}`),
    });
  }

  for (const bio of db.mathematicians.values()) {
    index.push({
      id: `bio-${bio.id}`,
      type: 'matemático',
      title: bio.name,
      subtitle: bio.description,
      href: routePath(`/bio/${bio.slug}`),
    });
  }

  for (const uc of db.usecases.values()) {
    index.push({
      id: `uc-${uc.id}`,
      type: 'caso_uso',
      title: uc.title,
      subtitle: uc.description,
      href: routePath(`/caso/${uc.slug}`),
    });
  }

  for (const axm of db.axioms.values()) {
    index.push({
      id: `axm-${axm.id}`,
      type: 'axioma',
      title: axm.title,
      subtitle: axm.description,
      href: routePath(`/axioma/${axm.slug}`),
    });
  }

  for (const model of db.models.values()) {
    index.push({
      id: `model-${model.id}`,
      type: 'modelo',
      title: model.title,
      subtitle: model.description,
      href: routePath(`/modelo/${model.slug}`),
    });
  }

  for (const [key, term] of Object.entries(dictionary)) {
    index.push({
      id: `glossary-${key}`,
      type: 'glosario',
      title: term.title,
      subtitle: term.definition.slice(0, 120),
      href: key,
    });
  }

  for (const [code, name] of Object.entries(mscNames)) {
    index.push({
      id: `msc-${code}`,
      type: 'msc2020',
      title: `${code} — ${name}`,
      subtitle: `Clasificación MSC2020`,
      href: '',
    });
  }

  return index;
}

export const SEARCH_INDEX = buildSearchIndex();
