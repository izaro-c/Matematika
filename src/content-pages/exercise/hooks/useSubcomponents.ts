import React, { useMemo } from 'react';
import type { ErrorComunData, ResolucionData, ErrorComunProps, ResolucionProps } from '../types';

export interface ExtractedSubcomponents {
  errorComunData: ErrorComunData | null;
  resolucionData: ResolucionData | null;
  otherChildren: React.ReactNode[];
}

/**
 * Extrae de forma memoizada los subcomponentes didácticos integrados (`ErrorComun` y `Resolucion`)
 * declarados como hijos JSX en cualquier tipo de pregunta.
 */
export function useSubcomponents(children?: React.ReactNode): ExtractedSubcomponents {
  return useMemo(() => {
    let errorComunData: ErrorComunData | null = null;
    let resolucionData: ResolucionData | null = null;
    const otherChildren: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        if (child) otherChildren.push(child);
        return;
      }

      const childType = child.type;
      const typeName = typeof childType === 'function' ? childType.name : '';
      const isErrorComun =
        typeName.includes('ErrorComun') ||
        (child.props && typeof child.props === 'object' && ('titulo' in child.props || 'title' in child.props));

      const isResolucion = typeName.includes('Resolucion');

      if (isErrorComun && !errorComunData) {
        const p = child.props as ErrorComunProps;
        errorComunData = { titulo: p.titulo || p.title, children: p.children };
      } else if (isResolucion && !resolucionData) {
        const p = child.props as ResolucionProps;
        resolucionData = { children: p.children };
      } else {
        otherChildren.push(child);
      }
    });

    return { errorComunData, resolucionData, otherChildren };
  }, [children]);
}
