/**
 * Helper centralizado para la construcción de rutas de la aplicación.
 * Toma en cuenta el BASE_URL configurado por Vite (import.meta.env.BASE_URL)
 * para evitar hardcodings como "/Matematika/...".
 *
 * @param path - Ruta relativa de la aplicación (ej. "/teorema/pitagoras" o "teorema/pitagoras")
 * @returns Ruta absoluta procesada
 */
export function appPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');
  return `${base}${normalized}`;
}

/**
 * Helper centralizado para assets públicos.
 * @param path - Ruta relativa del asset (ej. "/images/logo.png")
 * @returns Ruta absoluta procesada
 */
export function publicAsset(path: string): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase === '/' ? '/' : `${rawBase.replace(/\/$/, '')}/`;
  return `${base}${normalized}`;
}
