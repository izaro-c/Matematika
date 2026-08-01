import React from 'react';

export const InspectorEmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center text-pizarra/50 font-serif">
    <svg className="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
    </svg>
    <p className="text-sm italic">
      Selecciona un elemento en el lienzo o en la lista para inspeccionar y editar todas sus propiedades.
    </p>
  </div>
);
