import type { useI18n } from '@/i18n';

type Translate = ReturnType<typeof useI18n>['t'];

/**
 * Fechas de vida con una sola era cuando las dos fechas la comparten:
 * «325–265 a. C.», «1862–1943»; si cruzan la era, cada una con la suya.
 */
export function formatLifeDates(t: Translate, birthYear?: number, deathYear?: number): string | null {
  if (birthYear === undefined && deathYear === undefined) return null;
  const bc = (year: string) => t('biography', 'bc', { year });
  const one = (year: number) => (year < 0 ? bc(String(-year)) : String(year));
  if (birthYear === undefined) return `– ${one(deathYear!)}`;
  if (deathYear === undefined) return `${one(birthYear)} –`;
  if (birthYear < 0 && deathYear < 0) return bc(`${-birthYear}–${-deathYear}`);
  if (birthYear >= 0) return `${birthYear}–${deathYear}`;
  return `${bc(String(-birthYear))} – ${t('biography', 'ad', { year: deathYear })}`;
}
