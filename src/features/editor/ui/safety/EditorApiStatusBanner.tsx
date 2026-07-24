import React, { useEffect, useState } from 'react';
import {
  clearEditorAuthToken,
  editorApiConfigured,
  editorApiUnavailableInProduction,
  editorRequiresAuthForWrites,
  editorWriteAccessGranted,
  getEditorAuthToken,
  setEditorAuthToken,
} from '../../persistence/editorApiBase';

export const EditorApiStatusBanner: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [writeGranted, setWriteGranted] = useState(editorWriteAccessGranted());

  useEffect(() => {
    const stored = getEditorAuthToken();
    if (stored) setTokenInput(stored);
    setWriteGranted(editorWriteAccessGranted());
  }, []);

  if (editorApiUnavailableInProduction()) {
    return (
      <div
        role="status"
        className="border-b border-ocre/30 bg-ocre/10 px-4 py-2 text-xs text-carbon"
      >
        El editor está en modo solo lectura: no hay API de persistencia configurada en este despliegue.
        Para editar y guardar, usa <code className="font-mono">npm run dev</code> en local o configura{' '}
        <code className="font-mono">VITE_EDITOR_API_URL</code> en el build.
      </div>
    );
  }

  if (!editorRequiresAuthForWrites() || writeGranted) return null;

  return (
    <div
      role="region"
      aria-label="Autenticación del editor"
      className="border-b border-terracota/25 bg-terracota/10 px-4 py-3 text-xs text-carbon"
    >
      <p className="font-semibold">Edición en memoria</p>
      <p className="mt-1 text-carbon/70">
        Puedes explorar y modificar documentos en esta sesión. Para guardar en el repositorio,
        introduce el token de edición.
      </p>
      <form
        className="mt-2 flex flex-wrap items-center gap-2"
        onSubmit={event => {
          event.preventDefault();
          if (!tokenInput.trim()) return;
          setEditorAuthToken(tokenInput);
          setWriteGranted(true);
        }}
      >
        <label className="sr-only" htmlFor="editor-api-token">Token de edición</label>
        <input
          id="editor-api-token"
          type="password"
          value={tokenInput}
          onChange={event => setTokenInput(event.target.value)}
          placeholder="Token de edición"
          className="min-w-[12rem] flex-1 rounded border border-carbon/20 bg-lienzo px-2 py-1 font-mono text-[11px]"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded bg-terracota px-3 py-1 font-semibold text-lienzo disabled:opacity-40"
          disabled={!tokenInput.trim()}
        >
          Activar guardado
        </button>
      </form>
    </div>
  );
};

export const EditorApiWriteGuardNotice: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible || !editorApiConfigured() || editorWriteAccessGranted()) return null;
  return (
    <p className="text-[11px] text-terracota">
      Guardado desactivado hasta introducir el token de edición.
    </p>
  );
};

export function useEditorWriteAccess(): boolean {
  const [granted, setGranted] = useState(editorWriteAccessGranted());

  useEffect(() => {
    const sync = () => setGranted(editorWriteAccessGranted());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return granted;
}

export function revokeEditorWriteAccess(): void {
  clearEditorAuthToken();
}
