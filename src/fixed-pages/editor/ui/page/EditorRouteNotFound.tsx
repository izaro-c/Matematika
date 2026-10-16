import React from 'react';

export interface EditorRouteNotFoundProps {
  /** Parte de la ruta tras `/editor/` que no corresponde a ningún recurso. */
  requested: string;
  onBack: () => void;
}

/** Estado vacío para una URL del editor que no apunta a ningún documento ni diagrama. */
export const EditorRouteNotFound: React.FC<EditorRouteNotFoundProps> = ({ requested, onBack }) => (
  <main
    role="alert"
    className="flex flex-1 items-center justify-center bg-lienzo px-4 font-serif text-carbon"
  >
    <div className="max-w-md rounded-2xl border border-carbon/15 bg-lienzo/80 p-6 text-center shadow-sm">
      <h1 className="text-xl font-bold">No se encuentra este recurso</h1>
      <p className="mt-2 text-sm text-carbon/70">
        La dirección <code className="rounded bg-carbon/5 px-1 font-mono text-xs">{requested}</code> no
        corresponde a ningún documento ni diagrama del corpus. Puede que se haya renombrado o borrado.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-5 rounded-xl bg-canela px-5 py-2.5 text-sm font-bold text-lienzo hover:bg-canela/90 focus-visible:outline-2 focus-visible:outline-canela cursor-pointer"
      >
        Volver al catálogo
      </button>
    </div>
  </main>
);
