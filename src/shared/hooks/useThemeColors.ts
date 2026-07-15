/**
 * useThemeColors — hook reactivo que lee CSS vars en runtime.
 *
 * Problema: los APIs de canvas (CanvasRenderingContext2D, ForceGraph2D)
 * necesitan hex literales, no CSS vars. Pero si hardcodeamos hex, el modo
 * oscuro no funciona porque las vars cambian pero el canvas no.
 *
 * Solución: getComputedStyle() devuelve el valor COMPUTADO actual de cada
 * var, incluyendo los overrides del modo oscuro. Este hook:
 *   1. Lee los valores actuales al montar
 *   2. Se re-ejecuta cuando cambia la clase .dark en <html>
 *   3. Se re-ejecuta cuando cambia la media query prefers-color-scheme
 *
 * Uso:
 *   const { getHex, lienzo, carbon } = useThemeColors();
 *   <ForceGraph2D backgroundColor={lienzo} ... />
 *   ctx.fillStyle = getHex('teorema');
 */

import { useState, useEffect, useCallback } from 'react';
import { getTypeCssVar } from '@/shared/design/contentTypeColors';

// Nombres de variables CSS que queremos resolver
const CSS_VARS = [
  '--theme-lienzo',
  '--theme-carbon',
  '--theme-terracota',
  '--theme-ocre',
  '--theme-granada',
  '--theme-musgo',
  '--theme-salvia',
  '--theme-pavo',
  '--theme-pizarra',
] as const;

export type ThemeColorSnapshot = {
  /** Hex del fondo (lienzo) — para backgroundColor del canvas */
  lienzo:  string;
  /** Hex del texto (carbon) */
  carbon:  string;
  /** Devuelve el hex actual del tipo de contenido según el tema activo */
  getHex:  (contentType: string) => string;
  /** Mapa completo de var CSS → hex computado */
  resolved: Record<string, string>;
};

function resolve(): Record<string, string> {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(
    CSS_VARS.map((v) => [v, style.getPropertyValue(v).trim()]),
  );
}

function snapshot(resolved: Record<string, string>): ThemeColorSnapshot {
  // Función que reemplaza la var CSS de un tipo por su valor computado actual
  const getHex = (contentType: string): string => {
    const cssVar = getTypeCssVar(contentType);
    // cssVar es 'var(--theme-X)', extraer el nombre
    const varName = cssVar.slice(4, -1); // quita 'var(' y ')'
    return resolved[varName] || resolved['--theme-carbon'] || 'currentColor';
  };

  return {
    lienzo:   resolved['--theme-lienzo'] || 'transparent',
    carbon:   resolved['--theme-carbon'] || 'currentColor',
    getHex,
    resolved,
  };
}

export function useThemeColors(): ThemeColorSnapshot {
  const [colors, setColors] = useState<ThemeColorSnapshot>(() =>
    snapshot(resolve()),
  );

  const refresh = useCallback(() => setColors(snapshot(resolve())), []);

  useEffect(() => {
    // Observar cambios en la clase del elemento raíz (toggle .dark)
    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Observar cambios en la media query del sistema
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', refresh);

    return () => {
      observer.disconnect();
      media.removeEventListener('change', refresh);
    };
  }, [refresh]);

  return colors;
}
