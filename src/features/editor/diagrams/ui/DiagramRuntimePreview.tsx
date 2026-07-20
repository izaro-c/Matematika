import React, { useEffect, useState } from 'react';
import { MathProviderBoundary } from '@/shared/lib/MathStoreContext';
import { ErrorBoundary } from '@/widgets/layouts/ErrorBoundary';
import { type DiagramSpecV2 } from '@/shared/diagrams/public';
import { StepNavigator } from '@/shared/ui/StepNavigator';
import { DiagramResponsivePreview } from './DiagramResponsivePreview';

type DiagramModule = Record<string, unknown>;
type DiagramComponent = React.ComponentType;

const diagramModules = import.meta.glob('/src/widgets/diagrams/**/*.tsx');

function moduleKey(filePath: string): string {
  return filePath.startsWith('src/') ? `/${filePath}` : `/src/${filePath}`;
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
}

interface PreviewState {
  key: string;
  component: DiagramComponent | null;
  spec: DiagramSpecV2 | null;
  message: string;
}

function findSpec(module: DiagramModule, componentName: string): DiagramSpecV2 | null {
  const named = module[`${componentName}Spec`];
  const candidates = named ? [named] : Object.values(module);
  const candidate = candidates.find(value => value && typeof value === 'object' && (value as { version?: unknown }).version === 2 && Array.isArray((value as { points?: unknown }).points));
  return candidate ? candidate as DiagramSpecV2 : null;
}

function pendingMessage(filePath: string | null, hasLoader: boolean): string {
  if (!filePath) return 'La vista previa real está disponible para diagramas guardados del catálogo.';
  if (hasLoader) return 'Cargando vista previa…';
  return 'Este recurso no pertenece al catálogo de diagramas finales.';
}

export const DiagramRuntimePreview: React.FC<DiagramRuntimePreviewProps> = ({ filePath, componentName }) => {
  const previewKey = `${filePath ?? ''}:${componentName}`;
  const loader = filePath ? diagramModules[moduleKey(filePath)] : undefined;
  const [activeStepId, setActiveStepId] = useState('');
  const [loadedPreview, setLoadedPreview] = useState<PreviewState>({
    key: '',
    component: null,
    spec: null,
    message: 'Cargando vista previa…',
  });

  useEffect(() => {
    if (!filePath || !loader) return undefined;
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
  }, [componentName, filePath, loader, previewKey]);

  const currentPreview = loadedPreview.key === previewKey
    ? loadedPreview
    : {
        key: previewKey,
        component: null,
        spec: null,
        message: pendingMessage(filePath, Boolean(loader)),
      };

  if (!currentPreview.component && !currentPreview.spec) {
    return <p className="p-4 text-xs text-carbon/60" role="status">{currentPreview.message}</p>;
  }

  const Component = currentPreview.component;
  const spec = currentPreview.spec;
  const effectiveStepId = spec?.steps.some(item => item.id === activeStepId) ? activeStepId : spec?.steps[0]?.id;
  let previewContent: React.ReactNode = null;
  if (spec) {
    previewContent = <div className="space-y-2 p-2">
      <DiagramResponsivePreview model={spec} activeStepId={effectiveStepId} />
      {spec.steps.length > 0 && <StepNavigator steps={spec.steps} scopeId={`preview-${spec.componentId}`} activeStepId={effectiveStepId} onStepChange={setActiveStepId} compact />}
      <p className="px-1 text-[10px] text-carbon/50">{spec.points.length + spec.elements.length + spec.sliders.length} objetos · {spec.steps.length} pasos · {spec.points.filter(item => item.target).length + spec.elements.filter(item => item.target).length + spec.groups.filter(item => item.target).length} vínculos MDX</p>
    </div>;
  } else if (Component) {
    previewContent = <Component />;
  }
  return (
    <div className="min-h-[360px] overflow-hidden rounded border border-carbon/10 bg-lienzo" data-testid="diagram-runtime-preview">
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
