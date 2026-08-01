import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

export interface RegisteredDiagramTarget {
  scopeId: string;
  targetId: string;
  objectId: string;
  label: string;
  kind: 'object' | 'step';
}

export interface DiagramTargetRegistryDiagnostic {
  code: 'duplicate-scoped-target' | 'ambiguous-unscoped-target';
  severity: 'error' | 'warning';
  targetId: string;
  message: string;
}

export function qualifiedDiagramTarget(scopeId: string, targetId: string): string {
  return `${scopeId}:${targetId}`;
}

export function matchesScopedDiagramTarget(value: unknown, targetId: string, scopeId: string): boolean {
  const candidates = new Set([targetId, qualifiedDiagramTarget(scopeId, targetId)]);
  if (Array.isArray(value)) return value.some(item => typeof item === 'string' && candidates.has(item));
  return typeof value === 'string' && candidates.has(value);
}

export function validateDiagramTargetRegistrations(targets: readonly RegisteredDiagramTarget[]): DiagramTargetRegistryDiagnostic[] {
  const diagnostics: DiagramTargetRegistryDiagnostic[] = [];
  const scoped = new Map<string, RegisteredDiagramTarget[]>();
  const unscoped = new Map<string, Set<string>>();
  targets.forEach(target => {
    const qualified = qualifiedDiagramTarget(target.scopeId, target.targetId);
    scoped.set(qualified, [...(scoped.get(qualified) ?? []), target]);
    const scopes = unscoped.get(target.targetId) ?? new Set<string>();
    scopes.add(target.scopeId);
    unscoped.set(target.targetId, scopes);
  });
  scoped.forEach((entries, targetId) => {
    if (entries.length > 1) diagnostics.push({
      code: 'duplicate-scoped-target',
      severity: 'error',
      targetId,
      message: `El target ${targetId} aparece ${entries.length} veces en el mismo diagrama.`,
    });
  });
  unscoped.forEach((scopes, targetId) => {
    if (scopes.size > 1) {
      const qualifiedOptions = [...scopes].map(scope => `${scope}:${targetId}`).join(' o ');
      diagnostics.push({
      code: 'ambiguous-unscoped-target',
      severity: 'warning',
      targetId,
      message: `El target ${targetId} existe en varios diagramas; use ${qualifiedOptions}.`,
      });
    }
  });
  return diagnostics;
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
