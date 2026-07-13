import React, { useEffect, useState } from 'react';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import { ErrorBoundary } from '@/widgets/layouts/ErrorBoundary';

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
  message: string;
}

function pendingMessage(filePath: string | null, hasLoader: boolean): string {
  if (!filePath) return 'La vista previa real está disponible para diagramas guardados del catálogo.';
  if (hasLoader) return 'Cargando vista previa…';
  return 'Este recurso no pertenece al catálogo de diagramas finales.';
}

export const DiagramRuntimePreview: React.FC<DiagramRuntimePreviewProps> = ({ filePath, componentName }) => {
  const previewKey = `${filePath ?? ''}:${componentName}`;
  const loader = filePath ? diagramModules[moduleKey(filePath)] : undefined;
  const [loadedPreview, setLoadedPreview] = useState<PreviewState>({
    key: '',
    component: null,
    message: 'Cargando vista previa…',
  });

  useEffect(() => {
    if (!filePath || !loader) return undefined;
    let active = true;
    loader()
      .then(loaded => {
        if (!active) return;
        const next = findComponent(loaded as DiagramModule, componentName);
        if (!next) {
          setLoadedPreview({
            key: previewKey,
            component: null,
            message: 'No se encontró el componente exportado para la vista previa.',
          });
          return;
        }
        setLoadedPreview({ key: previewKey, component: next, message: '' });
      })
      .catch(error => {
        if (active) {
          setLoadedPreview({
            key: previewKey,
            component: null,
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
        message: pendingMessage(filePath, Boolean(loader)),
      };

  if (!currentPreview.component) {
    return <p className="p-4 text-xs text-carbon/60" role="status">{currentPreview.message}</p>;
  }

  const Component = currentPreview.component;
  return (
    <div className="min-h-[360px] overflow-hidden rounded border border-carbon/10 bg-lienzo" data-testid="diagram-runtime-preview">
      <ErrorBoundary
        key={`${filePath}:${componentName}`}
        fallback={<p className="p-4 text-xs text-granada" role="alert">El diagrama guardado produjo un error al renderizarse.</p>}
      >
        <MathProvider>
          <Component />
        </MathProvider>
      </ErrorBoundary>
    </div>
  );
};
