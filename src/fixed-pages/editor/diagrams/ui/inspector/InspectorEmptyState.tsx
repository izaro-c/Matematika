import React from 'react';

export const InspectorEmptyState: React.FC = () => (
  <div className="p-4 bg-lienzo h-full flex items-center justify-center">
    <div className="flex flex-col items-center justify-center p-6 text-center text-carbon/60 font-serif border border-carbon/15 bg-lienzo rounded-2xl shadow-2xs space-y-2 max-w-sm">
      <svg className="w-8 h-8 text-carbon/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
      </svg>
      <p className="font-bold text-xs text-carbon">Sin selección</p>
      <p className="text-xs text-carbon/60 leading-relaxed italic">
        Selecciona un elemento en el lienzo o en la lista para inspeccionar y editar sus propiedades.
      </p>
    </div>
  </div>
);
