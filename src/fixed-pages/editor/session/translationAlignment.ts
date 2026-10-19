import type { Block } from './parser';

/**
 * Alineación por bloques entre una versión original y su traducción, para la vista
 * en paralelo. Los bloques se emparejan por su forma (tipo, componente y nivel), no
 * por su texto, con la subsecuencia común más larga: un bloque añadido o quitado en
 * una de las dos versiones no desplaza al resto.
 */

export type TranslationRowStatus =
  /** El texto difiere del original. */
  | 'translated'
  /** El texto es idéntico al original (copiado al crear la traducción y sin tocar). */
  | 'untranslated'
  /** Idéntico, pero sin texto que traducir (fórmulas, separadores…). */
  | 'neutral'
  /** El bloque del original no tiene pareja en la traducción. */
  | 'missing'
  /** El bloque solo existe en la traducción. */
  | 'extra';

export interface TranslationRow {
  key: string;
  source: Block | null;
  target: Block | null;
  status: TranslationRowStatus;
}

export interface TranslationAlignment {
  rows: TranslationRow[];
  untranslated: number;
  missing: number;
}

const TRANSLATABLE_ATTRIBUTES = /\b(?:title|label|caption|alt|description)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

function leadingComponent(content: string): string {
  return /^\s*<([A-Z][\w.]*)/.exec(content)?.[1] ?? '';
}

export function blockShape(block: Block): string {
  const component = typeof block.metadata?.component === 'string' ? block.metadata.component : leadingComponent(block.content);
  const level = block.type === 'heading' ? String(block.metadata?.level ?? '') : '';
  return `${block.type}:${component}:${level}`;
}

function normalized(content: string): string {
  return content.replace(/\s+/g, ' ').trim();
}

/** ¿Tiene el bloque palabras que traducir? Se descartan fórmulas, código y la sintaxis JSX. */
export function hasTranslatableText(content: string): boolean {
  const attributes = Array.from(content.matchAll(TRANSLATABLE_ATTRIBUTES), match => match[1] ?? match[2] ?? '').join(' ');
  const prose = content
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]*>/g, ' ');
  return /\p{L}/u.test(`${prose} ${attributes}`);
}

function pairStatus(source: Block, target: Block): TranslationRowStatus {
  if (normalized(source.content) !== normalized(target.content)) return 'translated';
  return hasTranslatableText(source.content) ? 'untranslated' : 'neutral';
}

export function alignTranslationBlocks(source: readonly Block[], target: readonly Block[]): TranslationAlignment {
  const a = source.map(blockShape);
  const b = target.map(blockShape);
  // lcs[i][j] = longitud de la subsecuencia común de a[i..] y b[j..].
  const lcs = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const rows: TranslationRow[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      rows.push({ key: `${source[i].id}|${target[j].id}`, source: source[i], target: target[j], status: pairStatus(source[i], target[j]) });
      i++;
      j++;
    } else if (j >= b.length || (i < a.length && lcs[i + 1][j] >= lcs[i][j + 1])) {
      rows.push({ key: `${source[i].id}|`, source: source[i], target: null, status: 'missing' });
      i++;
    } else {
      rows.push({ key: `|${target[j].id}`, source: null, target: target[j], status: 'extra' });
      j++;
    }
  }

  return {
    rows,
    untranslated: rows.filter(row => row.status === 'untranslated').length,
    missing: rows.filter(row => row.status === 'missing').length,
  };
}
