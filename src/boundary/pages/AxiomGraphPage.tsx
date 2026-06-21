import React from 'react';
import { AxiomaticTree } from '@/boundary/components/graph/AxiomaticTree';

/**
 * Página principal del explorador de dependencia de axiomas lógicos.
 *
 * Muestra el grafo interactivo (`AxiomaticTree`) donde los usuarios pueden activar/desactivar 
 * axiomas (ej. Paralelas) y observar cómo colapsa o emerge la validez del árbol lógico de la matemática.
 */
export const AxiomGraphPage: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <AxiomaticTree />
    </div>
  );
};
