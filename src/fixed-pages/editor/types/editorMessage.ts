import type { TranslationDictionary } from '@/i18n/types';

/**
 * Convención de i18n del editor (fase 2 del plan de reforma).
 *
 * - Todas las cadenas visibles del editor viven en `editor.<área>.<clave>` de
 *   `TranslationDictionary` (`common`, `nav`, `landing`, `create`, `mdx`,
 *   `diagram`, `save`, `errors`).
 * - El motor (`session/`, `save/`, `document/`, `diagrams/model|save|checks`)
 *   no redacta frases: devuelve un `EditorMessage` con un código relativo a
 *   `editor.` (p. ej. `{ code: 'save.documentUpToDate' }`) y la interfaz lo
 *   traduce con `translateEditorText`.
 * - Los plurales y las variantes (documento/diagrama) se resuelven eligiendo
 *   el código, nunca concatenando palabras: el euskera declina y pospone.
 */
type EditorAreas = TranslationDictionary['editor'];

export type EditorMessageCode = {
  [Area in keyof EditorAreas & string]: `${Area}.${keyof EditorAreas[Area] & string}`;
}[keyof EditorAreas & string];

export type EditorMessageParams = Record<string, string | number>;

export interface EditorMessage {
  code: EditorMessageCode;
  params?: EditorMessageParams;
}

/**
 * Texto que el motor entrega a la interfaz. La cadena suelta es la forma
 * heredada, sin traducir, y desaparece a medida que avanza la migración (2.3).
 */
export type EditorText = EditorMessage | string;

export function editorMessage(code: EditorMessageCode, params?: EditorMessageParams): EditorMessage {
  return params ? { code, params } : { code };
}

export type EditorTranslate = (key: string, params: EditorMessageParams) => string;

export function translateEditorText(t: EditorTranslate, text: EditorText): string;
export function translateEditorText(t: EditorTranslate, text: EditorText | undefined): string | undefined;
export function translateEditorText(t: EditorTranslate, text: EditorText | undefined): string | undefined {
  if (text === undefined || typeof text === 'string') return text;
  return t(`editor.${text.code}`, text.params ?? {});
}
