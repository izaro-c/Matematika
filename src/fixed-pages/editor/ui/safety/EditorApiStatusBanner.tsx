import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import {
  editorApiUnavailableInProduction,
  editorRequiresAuthForWrites,
  editorWriteAccessGranted,
  getEditorAuthToken,
  setEditorAuthToken,
} from '@/fixed-pages/editor/save/editorApiBase';

export const EditorApiStatusBanner: React.FC = () => {
  const { t } = useI18n();
  const [tokenInput, setTokenInput] = useState(() => getEditorAuthToken() ?? '');
  const [writeGranted, setWriteGranted] = useState(() => editorWriteAccessGranted());

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
      aria-label={t('editor', 'inspectorAriaLabel')}
      className="border-b border-terracota/25 bg-terracota/10 px-4 py-3 text-xs text-carbon"
    >
      <p className="font-semibold">{t('editor', 'memoryEditing')}</p>
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
        <label className="sr-only" htmlFor="editor-api-token">{t('editor', 'editToken')}</label>
        <input
          id="editor-api-token"
          type="password"
          value={tokenInput}
          onChange={event => setTokenInput(event.target.value)}
          placeholder={t('editor', 'editToken')}
          className="min-w-[12rem] flex-1 rounded border border-carbon/20 bg-lienzo px-2 py-1 font-mono text-[11px]"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded bg-terracota px-3 py-1 font-semibold text-lienzo disabled:opacity-40"
          disabled={!tokenInput.trim()}
        >
          {t('editor', 'activateSave')}
        </button>
      </form>
    </div>
  );
};

