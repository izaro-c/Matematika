/**
 * Resuelve la URL base del sitio web a partir de las variables de entorno.
 * Prioridad:
 * 1. VITE_SITE_URL (o process.env.VITE_SITE_URL en scripts Node)
 * 2. SITE_URL (o process.env.SITE_URL en scripts Node)
 * 3. Default: https://izaro-c.github.io/Matematika (extraído del homepage de package.json)
 */
export function getSiteUrl(): string {
  let envUrl: string | undefined;

  if (typeof import.meta !== 'undefined' && import.meta.env) {
    envUrl = import.meta.env.VITE_SITE_URL as string | undefined;
  }

  const globalProcess = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process;
  if (!envUrl && globalProcess?.env) {
    envUrl = globalProcess.env.VITE_SITE_URL || globalProcess.env.SITE_URL;
  }

  const defaultUrl = 'https://izaro-c.github.io/Matematika';
  const url = envUrl || defaultUrl;
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Devuelve la URL absoluta para una ruta dada.
 * @param path Ruta relativa (ej: "/es/teorema/pitagoras")
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
