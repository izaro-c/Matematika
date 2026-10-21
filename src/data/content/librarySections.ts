import { mscParent } from './msc2020';

export type LibrarySectionKey = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';

export interface LibrarySection {
  key: LibrarySectionKey;
  slug: string;
  codes: string[];
  groups: { id: string; codes: string[] }[];
  accent: 'musgo' | 'carbon' | 'mora' | 'terracota' | 'canela' | 'pavo' | 'granada';
  symbol: string;
}

/** Las siete ramas de la biblioteca: color de su tela, símbolo y numeral. */
export const LIBRARY_SECTIONS: LibrarySection[] = [
  { key: 'I', slug: 'fundamentos-y-logica', codes: ['03', '08'], groups: [], accent: 'musgo', symbol: '⊢' },
  {
    key: 'II',
    slug: 'algebra-y-teoria-de-numeros',
    codes: ['11', '15', '14', '12', '13', '18', '20'],
    groups: [
      { id: 'geometria-algebraica', codes: ['14'] },
      { id: 'algebra-abstracta', codes: ['12', '13'] },
      { id: 'teoria-de-grupos-y-categorias', codes: ['18', '20'] },
    ],
    accent: 'carbon',
    symbol: '⊕',
  },
  {
    key: 'III',
    slug: 'analisis-matematico',
    codes: ['26', '30', '34', '46'],
    groups: [
      { id: 'analisis-real-y-funciones', codes: ['26'] },
      { id: 'analisis-complejo', codes: ['30'] },
      { id: 'ecuaciones-diferenciales', codes: ['34'] },
      { id: 'analisis-funcional-y-armonico', codes: ['46'] },
    ],
    accent: 'mora',
    symbol: '∫',
  },
  {
    key: 'IV',
    slug: 'geometria-y-topologia',
    codes: ['51', '53', '54', '55'],
    groups: [
      { id: 'geometria-clasica-y-diferencial', codes: ['51', '53'] },
      { id: 'topologia-general-y-algebraica', codes: ['54', '55'] },
    ],
    accent: 'terracota',
    symbol: '△',
  },
  { key: 'V', slug: 'matematica-discreta-y-computacional', codes: ['05', '68'], groups: [], accent: 'canela', symbol: '∑' },
  {
    key: 'VI',
    slug: 'probabilidad-estadistica-y-aplicaciones',
    codes: ['49', '60', '62', '65', '70', '74', '76', '78', '80', '81', '82', '83', '85', '86', '90', '91', '92'],
    groups: [
      { id: 'optimizacion-y-teoria-de-juegos', codes: ['49', '90', '91'] },
      { id: 'fisica-matematica-y-biologia', codes: ['70', '74', '76', '78', '80', '81', '82', '83', '85', '86', '92'] },
    ],
    accent: 'pavo',
    symbol: '⨀',
  },
  { key: 'VII', slug: 'metadatos-y-divulgacion', codes: ['00', '01', '97'], groups: [], accent: 'granada', symbol: '∞' },
];

/** Rama de la biblioteca a la que pertenece un código MSC o una agrupación, subiendo por la jerarquía. */
export function getLibrarySection(code: string): LibrarySection | undefined {
  const seen = new Set<string>();
  let cur: string | undefined = code;
  while (cur && !seen.has(cur)) {
    const section = LIBRARY_SECTIONS.find(s => s.slug === cur);
    if (section) return section;
    seen.add(cur);
    cur = mscParent[cur];
  }
  return undefined;
}
