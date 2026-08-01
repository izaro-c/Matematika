import { useEffect, useMemo } from 'react';
import type { useDiagramState } from './useDiagramState';
import type { TemplateKind } from '../model/types';
import { createTemplateModel, normalizeVisualModel } from '../model';

export type DiagramWorkbenchMode =
  | { kind: 'file'; path: string }
  | { kind: 'inline'; source: string; componentName?: string; model?: Record<string, unknown> | null }
  | { kind: 'new'; componentName: string }
  | { kind: 'rewrite'; path: string; componentName: string; title: string; template: TemplateKind };

type DiagramLoaders = Pick<ReturnType<typeof useDiagramState>,
  'loadDiagram' | 'loadInlineDiagram' | 'loadNewDiagram' | 'loadDiagramForRewrite'>;

interface UseDiagramWorkbenchLoaderOptions extends DiagramLoaders {
  isOpen: boolean;
  mode: DiagramWorkbenchMode;
  metadataType: string;
}

function componentNameFromPath(path: string | null): string {
  const base = (path?.split('/').pop() || 'DiagramaInteractivo').replace(/\.tsx$/, '');
  const cleaned = base.replace(/\W/g, '');
  return cleaned || 'DiagramaInteractivo';
}

function componentNameFromSource(source: string | undefined, fallback: string): string {
  const match = source?.match(/export\s+const\s+([A-Z]\w*)\b/);
  return match?.[1] || fallback;
}

export function useDiagramWorkbenchLoader({
  isOpen,
  mode,
  metadataType,
  loadDiagram,
  loadInlineDiagram,
  loadNewDiagram,
  loadDiagramForRewrite,
}: UseDiagramWorkbenchLoaderOptions): void {
  const inlineModel = useMemo(() => (
    mode.kind === 'inline' ? normalizeVisualModel(mode.model, metadataType) : null
  ), [mode, metadataType]);
  const newModel = useMemo(() => {
    if (!isOpen) return null;
    if (mode.kind === 'new') return createTemplateModel('circunferencia', 'Diagrama interactivo', metadataType);
    if (mode.kind === 'rewrite') return createTemplateModel(mode.template, mode.title, metadataType);
    return null;
  }, [isOpen, metadataType, mode]);

  useEffect(() => {
    if (!isOpen) return;
    if (mode.kind === 'file') {
      void loadDiagram(mode.path, componentNameFromPath(mode.path));
      return;
    }
    if (mode.kind === 'inline') {
      const fallbackName = mode.componentName || componentNameFromPath(null);
      loadInlineDiagram(mode.source, mode.componentName || componentNameFromSource(mode.source, fallbackName), inlineModel);
      return;
    }
    if (mode.kind === 'rewrite' && newModel) {
      void loadDiagramForRewrite(mode.path, mode.componentName, newModel);
      return;
    }
    if (newModel) loadNewDiagram(mode.componentName, newModel);
  }, [isOpen, mode, inlineModel, newModel, loadDiagram, loadInlineDiagram, loadNewDiagram, loadDiagramForRewrite]);
}
