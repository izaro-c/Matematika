import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

export interface RegisteredDiagramTarget {
  scopeId: string;
  targetId: string;
  objectId: string;
  label: string;
  kind: 'object' | 'step';
}

export function qualifiedDiagramTarget(scopeId: string, targetId: string): string {
  return `${scopeId}:${targetId}`;
}

export function matchesScopedDiagramTarget(value: unknown, targetId: string, scopeId: string): boolean {
  const candidates = new Set([targetId, qualifiedDiagramTarget(scopeId, targetId)]);
  if (Array.isArray(value)) return value.some(item => typeof item === 'string' && candidates.has(item));
  return typeof value === 'string' && candidates.has(value);
}

interface DiagramTargetRegistryApi {
  register: (scopeId: string, targets: readonly Omit<RegisteredDiagramTarget, 'scopeId'>[]) => () => void;
  resolve: (targetId: string) => string;
  snapshot: () => RegisteredDiagramTarget[];
}

const fallbackRegistry: DiagramTargetRegistryApi = {
  register: () => () => undefined,
  resolve: targetId => targetId,
  snapshot: () => [],
};

const DiagramTargetRegistryContext = createContext<DiagramTargetRegistryApi>(fallbackRegistry);

export const DiagramTargetRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const registrations = useRef(new Map<string, RegisteredDiagramTarget[]>());
  const register = useCallback<DiagramTargetRegistryApi['register']>((scopeId, targets) => {
    registrations.current.set(scopeId, targets.map(target => ({ ...target, scopeId })));
    return () => { registrations.current.delete(scopeId); };
  }, []);
  const snapshot = useCallback(() => [...registrations.current.values()].flat(), []);
  const resolve = useCallback((targetId: string) => {
    if (targetId.includes(':')) return targetId;
    const matches = snapshot().filter(target => target.targetId === targetId);
    return matches.length === 1
      ? qualifiedDiagramTarget(matches[0].scopeId, targetId)
      : targetId;
  }, [snapshot]);
  const value = useMemo(() => ({ register, resolve, snapshot }), [register, resolve, snapshot]);
  return <DiagramTargetRegistryContext.Provider value={value}>{children}</DiagramTargetRegistryContext.Provider>;
};

export function useDiagramTargetRegistry(): DiagramTargetRegistryApi {
  return useContext(DiagramTargetRegistryContext);
}
