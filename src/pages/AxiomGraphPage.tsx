import React from 'react';
import { AxiomaticTree } from '@/features/graph/ui/AxiomaticTree';

/**
 * Página principal del explorador de dependencia de axiomas lógicos.
 *
 * Muestra el grafo interactivo con un panel lateral unificado
 * que integra filtros, sandbox y leyenda.
 */
export const AxiomGraphPage: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-lienzo">
      <AxiomaticTree />
    </div>
  );
};
