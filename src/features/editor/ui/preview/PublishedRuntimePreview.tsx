import React, { useRef, useState } from 'react';
import { routePath } from '@/shared/lib/routeHelper';
import { useModalFocus } from '../hooks/useModalFocus';

interface PublishedRuntimePreviewProps {
  open: boolean;
  path: string | null;
  hasPendingChanges: boolean;
  revision: number;
  onClose: () => void;
}

export const PublishedRuntimePreview: React.FC<PublishedRuntimePreviewProps> = ({ open, path, hasPendingChanges, revision, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loadedFrameKey, setLoadedFrameKey] = useState<string | null>(null);
  const dialogRef = useModalFocus<HTMLDivElement>(open, onClose, closeRef);
  const frameKey = path ? `${path}:${revision}` : null;
  const loading = Boolean(frameKey && loadedFrameKey !== frameKey);
  if (!open) return null;
  return (
    <div ref={dialogRef} className="fixed inset-0 z-50 flex flex-col bg-lienzo" role="dialog" aria-modal="true" aria-labelledby="published-preview-title">
      <header className="flex min-h-14 items-center gap-3 border-b border-carbon/15 px-3 sm:px-5">
        <div className="min-w-0 flex-1">
          <h2 id="published-preview-title" className="font-serif text-sm font-bold text-carbon">Runtime publicado compartido</h2>
          <p className="truncate text-[10px] text-carbon/50">{path ?? 'Ruta no disponible'}</p>
        </div>
        {hasPendingChanges && <span className="rounded border border-ocre/25 bg-ocre/5 px-2 py-1 text-[10px] font-bold text-ocre" role="status">Muestra el último guardado · hay cambios pendientes</span>}
        <button ref={closeRef} type="button" onClick={onClose} className="rounded border border-carbon/15 px-3 py-1.5 text-xs font-bold text-carbon/65 hover:bg-carbon/5">Volver al editor</button>
      </header>
      {path ? <div className="relative flex min-h-0 flex-1 flex-col">
        {loading && <div className="absolute inset-x-0 top-0 z-10 bg-ocre/10 px-3 py-2 text-center text-xs font-bold text-ocre" role="status">Cargando runtime publicado…</div>}
        <iframe key={frameKey} src={routePath(path)} title="Página renderizada con el runtime publicado" onLoad={() => setLoadedFrameKey(frameKey)} className="min-h-0 flex-1 border-0 bg-lienzo" />
      </div>
        : <div className="flex flex-1 items-center justify-center p-8 text-center font-serif text-carbon/55">Este tipo de página no tiene una ruta publicada.</div>}
    </div>
  );
};
