import React, { useEffect, useState } from 'react';
import { MathProviderBoundary } from '@/lib/page-context/MathStoreContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { StepNavigator } from '@/components/ui/StepNavigator';
import { DiagramRenderer } from '@/diagrams/public';
import { toEditorModel } from '../model/scene/editorModel';
import type { VisualDiagramModel } from '../model/types';
import { DiagramResponsivePreview } from './DiagramResponsivePreview';

type DiagramModule = Record<string, unknown>;
type DiagramComponent = React.ComponentType;
type DiagramLoader = () => Promise<unknown>;

const diagramModules = import.meta.glob('/content/diagrams/**/*.tsx') as Record<string, DiagramLoader>;

/** Normalize editor/import paths to the Vite glob key shape `/content/diagrams/...tsx`. */
export function normalizeDiagramModulePath(filePath: string): string {
  let normalized = filePath.trim()
    .replace(/^\/?(?:Matematika\/)?/, '')
    .replace(/^@content\//, 'content/')
    .replace(/^@\//, '')
    .replace(/^src\//, '');
  if (!normalized.endsWith('.tsx')) normalized = `${normalized}.tsx`;
  const contentIndex = normalized.indexOf('content/diagrams/');
  if (contentIndex >= 0) normalized = normalized.slice(contentIndex);
  return normalized;
}

export function resolveDiagramLoader(
  modules: Record<string, DiagramLoader>,
  filePath: string | null,
  componentName: string,
): DiagramLoader | undefined {
  if (filePath) {
    const normalized = normalizeDiagramModulePath(filePath);
    const exact = modules[`/${normalized}`] ?? modules[normalized];
    if (exact) return exact;
    const suffix = Object.entries(modules).find(([key]) => (
      key.endsWith(`/${normalized}`) || key.endsWith(normalized)
    ));
    if (suffix) return suffix[1];
  }
  if (!componentName) return undefined;
  const byName = Object.entries(modules).find(([key]) => key.endsWith(`/${componentName}.tsx`));
  return byName?.[1];
}

function findComponent(module: DiagramModule, componentName: string): DiagramComponent | null {
  const named = module[componentName];
  if (typeof named === 'function') return named as DiagramComponent;
  if (typeof module.default === 'function') return module.default as DiagramComponent;
  const candidate = Object.entries(module).find(([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function');
  return candidate ? candidate[1] as DiagramComponent : null;
}

export interface DiagramRuntimePreviewProps {
  filePath: string | null;
  componentName: string;
  responsiveFrame?: boolean;
  viewportControls?: boolean;
  height?: string;
}

interface PreviewState {
  key: string;
  component: DiagramComponent | null;
  spec: VisualDiagramModel | null;
  message: string;
}

function findSpec(module: DiagramModule, componentName: string): VisualDiagramModel | null {
  const named = module[`${componentName}Spec`];
  const candidates = named ? [named] : Object.values(module);
  for (const value of candidates) {
    if (!value || typeof value !== 'object') continue;
    const model = toEditorModel(value);
    if (model) return model;
  }
  return null;
}

function pendingMessage(filePath: string | null, componentName: string, hasLoader: boolean): string {
  if (hasLoader) return 'Cargando vista previa…';
  if (!filePath && !componentName) {
    return 'La vista previa real está disponible para diagramas guardados del catálogo.';
  }
  return 'Este recurso no pertenece al catálogo de diagramas finales.';
}

export const DiagramRuntimePreview: React.FC<DiagramRuntimePreviewProps> = ({
  filePath,
  componentName,
  responsiveFrame = false,
  viewportControls = false,
  height = '280px',
}) => {
  const previewKey = `${filePath ?? ''}:${componentName}`;
  const loader = resolveDiagramLoader(diagramModules, filePath, componentName);
  const [activeStepId, setActiveStepId] = useState('');
  const [loadedPreview, setLoadedPreview] = useState<PreviewState>({
    key: '',
    component: null,
    spec: null,
    message: 'Cargando vista previa…',
  });

  useEffect(() => {
    if (!loader) return undefined;
    let active = true;
    loader()
      .then(loaded => {
        if (!active) return;
        const next = findComponent(loaded as DiagramModule, componentName);
        const spec = findSpec(loaded as DiagramModule, componentName);
        if (!next) {
          setLoadedPreview({
            key: previewKey,
            component: null,
            spec,
            message: 'No se encontró el componente exportado para la vista previa.',
          });
          return;
        }
        setLoadedPreview({ key: previewKey, component: next, spec, message: '' });
      })
      .catch(error => {
        if (active) {
          setLoadedPreview({
            key: previewKey,
            component: null,
            spec: null,
            message: `No se pudo cargar la vista previa: ${error instanceof Error ? error.message : String(error)}`,
          });
        }
      });
    return () => { active = false; };
  }, [componentName, loader, previewKey]);

  const currentPreview = loadedPreview.key === previewKey
    ? loadedPreview
    : {
        key: previewKey,
        component: null,
        spec: null,
        message: pendingMessage(filePath, componentName, Boolean(loader)),
      };

  if (!currentPreview.component && !currentPreview.spec) {
    return <p className="p-4 text-xs text-carbon/60" role="status">{currentPreview.message}</p>;
  }

  const Component = currentPreview.component;
  const spec = currentPreview.spec;
  const effectiveStepId = spec?.steps.some(item => item.id === activeStepId) ? activeStepId : spec?.steps[0]?.id;
  let previewContent: React.ReactNode = null;
  if (spec) {
    previewContent = (
      <div className="space-y-1.5">
        {responsiveFrame ? (
          <DiagramResponsivePreview model={spec} activeStepId={effectiveStepId} />
        ) : (
          <div
            className="relative w-full overflow-hidden select-none"
            style={{ height }}
            data-diagram-embedded-surface="true"
          >
            <DiagramRenderer
              spec={spec}
              mode="runtime"
              activeStepId={effectiveStepId}
              className="!min-h-0 h-full w-full"
              viewportControls={viewportControls}
            />
          </div>
        )}
        {spec.steps.length > 1 && (
          <StepNavigator steps={spec.steps} scopeId={`preview-${spec.componentId}`} activeStepId={effectiveStepId} onStepChange={setActiveStepId} compact />
        )}
        <p className="px-1 font-mono text-[9px] text-carbon/50 select-none">
          {spec.points.length + spec.elements.length + spec.sliders.length} objetos · {spec.steps.length} pasos · {spec.points.filter(item => item.target).length + spec.elements.filter(item => item.target).length + spec.groups.filter(item => item.target).length} vínculos MDX
        </p>
      </div>
    );
  } else if (Component) {
    previewContent = (
      <div
        className="relative w-full overflow-hidden rounded-xl border border-carbon/15 bg-lienzo p-2"
        style={{ minHeight: height }}
      >
        <Component />
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="diagram-runtime-preview">
      <ErrorBoundary
        key={`${filePath}:${componentName}`}
        fallback={<p className="p-4 text-xs text-granada" role="alert">El diagrama guardado produjo un error al renderizarse.</p>}
      >
        <MathProviderBoundary>
          {previewContent}
        </MathProviderBoundary>
      </ErrorBoundary>
    </div>
  );
};
