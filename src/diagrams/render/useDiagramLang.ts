import { useI18n } from '@/i18n';

/** Idioma activo para diagramas escritos a mano (escenas 3D, simuladores sin spec). */
export function useDiagramLang(): string {
  return useI18n().lang;
}
