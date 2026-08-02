import React, { createContext, useContext, useRef, useState } from 'react';

interface DemonstrationHeaderContextValue {
  claimHeader: () => boolean;
}

export const DemonstrationHeaderContext = createContext<DemonstrationHeaderContextValue | null>(null);

/**
 * Proveedor de contexto para páginas de demostración.
 * Garantiza que solo la primera sección/diagrama renderice la cabecera (ContentHeader)
 * en demostraciones compuestas por múltiples diagramas.
 */
export const DemonstrationHeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const headerClaimedRef = useRef(false);

  const claimHeader = (): boolean => {
    if (headerClaimedRef.current) {
      return false;
    }
    headerClaimedRef.current = true;
    return true;
  };

  return (
    <DemonstrationHeaderContext.Provider value={{ claimHeader }}>
      {children}
    </DemonstrationHeaderContext.Provider>
  );
};

/**
 * Hook para reclamar la autoría del renderizado de la cabecera en CodexLayout.
 * Retorna true solo si es la primera sección de la demostración en reclamarlo.
 *
 * Usa useState con inicializador lazy para que la reclamación ocurra en el estado
 * (no como efecto secundario en el cuerpo del render), evitando leer refs durante render.
 */
export function useDemonstrationHeaderClaim(): boolean {
  const ctx = useContext(DemonstrationHeaderContext);

  const [shouldRenderHeader] = useState<boolean>(() => {
    if (!ctx) {
      // Sin proveedor superior: renderizado aislado, mostrar cabecera.
      return true;
    }
    return ctx.claimHeader();
  });

  return shouldRenderHeader;
}
