/// <reference types="vite/client" />

const EDITOR_AUTH_STORAGE_KEY = 'matematika-editor-api-token';

export function editorApiBaseUrl(): string {
  const configured = import.meta.env.VITE_EDITOR_API_URL;
  return configured ? configured.replace(/\/$/, '') : '';
}

/** True when the production build expects a remote editor API. */
export function editorApiConfigured(): boolean {
  return editorApiBaseUrl().length > 0;
}

/** True when the editor cannot reach any persistence backend. */
export function editorApiUnavailableInProduction(): boolean {
  return import.meta.env.PROD && !editorApiConfigured();
}

export function editorApiPath(pathname: string): string {
  const base = editorApiBaseUrl();
  return base ? `${base}${pathname}` : pathname;
}

export function getEditorAuthToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(EDITOR_AUTH_STORAGE_KEY);
}

export function setEditorAuthToken(token: string): void {
  sessionStorage.setItem(EDITOR_AUTH_STORAGE_KEY, token.trim());
}

export function clearEditorAuthToken(): void {
  sessionStorage.removeItem(EDITOR_AUTH_STORAGE_KEY);
}

export function editorAuthHeaders(): Record<string, string> {
  const token = getEditorAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function editorRequiresAuthForWrites(): boolean {
  return editorApiConfigured();
}

export function editorWriteAccessGranted(): boolean {
  if (!editorRequiresAuthForWrites()) return true;
  return Boolean(getEditorAuthToken());
}
