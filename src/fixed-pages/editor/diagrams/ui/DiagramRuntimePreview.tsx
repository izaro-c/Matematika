import React, { useEffect, useMemo, useState } from 'react';
import { MathProviderBoundary } from '@/lib/page-context/MathStoreContext';
import { useDiagramStepSync } from '@/lib/page-context/DiagramStepSyncContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { StepNavigator } from '@/components/ui/StepNavigator';
import { DiagramRenderer } from '@/diagrams/public';
import { toEditorModel } from '../model/scene/editorModel';
import type { VisualDiagramModel } from '../model/types';
import { DiagramResponsivePreview } from './DiagramResponsivePreview';
import { useI18n } from '@/i18n';
import { Card } from '@/fixed-pages/editor/ui/primitives';

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
  /** When false, reuse the parent MathStore (editor canvas ↔ inspector sync). */
  isolateMathStore?: boolean;
}

interface PreviewMessage {
  key: string;
  params?: Record<string, string | number>;
}

interface PreviewState {
  key: string;
  component: DiagramComponent | null;
  spec: VisualDiagramModel | null;
  message: PreviewMessage;
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

function pendingMessage(filePath: string | null, componentName: string, hasLoader: boolean): PreviewMessage {
  if (hasLoader) return { key: 'editor.diagramEditors.previewLoading' };
  if (!filePath && !componentName) {
    return { key: 'editor.diagramEditors.previewOnlyCatalog' };
  }
  return { key: 'editor.diagramEditors.previewNotInCatalog' };
}

export const DiagramRuntimePreview: React.FC<DiagramRuntimePreviewProps> = ({
  filePath,
  componentName,
  responsiveFrame = false,
  viewportControls = false,
  height = '280px',
  isolateMathStore = true,
}) => {
  const { t } = useI18n();
  const previewKey = `${filePath ?? ''}:${componentName}`;
  const loader = resolveDiagramLoader(diagramModules, filePath, componentName);
  const stepSync = useDiagramStepSync();
  const [activeStepId, setActiveStepId] = useState('');
  const [loadedPreview, setLoadedPreview] = useState<PreviewState>({
    key: '',
    component: null,
    spec: null,
    message: { key: 'editor.diagramEditors.previewLoading' },
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
            message: { key: 'editor.diagramEditors.previewComponentMissing' },
          });
          return;
        }
        setLoadedPreview({ key: previewKey, component: next, spec, message: { key: '' } });
      })
      .catch(error => {
        if (active) {
          setLoadedPreview({
            key: previewKey,
            component: null,
            spec: null,
            message: { key: 'editor.diagramEditors.previewLoadFailed', params: { error: error instanceof Error ? error.message : String(error) } },
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

  const spec = currentPreview.spec;
  const syncedStepId = useMemo(() => {
    if (!spec || !stepSync) return undefined;
    if (stepSync.activeStepId) {
      if (stepSync.activeStepId === 'initial') return spec.steps[0]?.id;
      const match = spec.steps.find(item => item.id === stepSync.activeStepId || item.id === `step${stepSync.activeStepId}`);
      if (match) return match.id;
      if (/^\d+$/.test(stepSync.activeStepId)) {
        const byNumber = spec.steps[Number(stepSync.activeStepId)];
        if (byNumber) return byNumber.id;
      }
    }
    if (stepSync.activeStepIndex != null) {
      const hasInitialStep = spec.steps[0]?.id === 'initial' || spec.steps[0]?.id === 'enunciado' || spec.steps[0]?.id === 'hipotesis';
      const mappedIndex = hasInitialStep ? stepSync.activeStepIndex + 1 : stepSync.activeStepIndex;
      return spec.steps[mappedIndex]?.id ?? spec.steps[spec.steps.length - 1]?.id;
    }
    return undefined;
  }, [spec, stepSync]);

  if (!currentPreview.component && !currentPreview.spec) {
    return <p className="p-4 text-xs text-carbon/60" role="status">{currentPreview.message.params ? t(currentPreview.message.key, currentPreview.message.params) : t(currentPreview.message.key)}</p>;
  }

  const Component = currentPreview.component;
  const localStepId = spec?.steps.some(item => item.id === activeStepId) ? activeStepId : undefined;
  // Prefer reading sync from the proof canvas; fall back to local navigator.
  const effectiveStepId = syncedStepId ?? localStepId ?? spec?.steps[0]?.id;
  const controlledBySync = Boolean(stepSync);
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
              activeStepId={controlledBySync ? undefined : effectiveStepId}
              className="!min-h-0 h-full w-full"
              viewportControls={viewportControls}
            />
          </div>
        )}
        {spec.steps.length > 1 && (
          <StepNavigator
            steps={spec.steps}
            scopeId={`preview-${spec.componentId}`}
            activeStepId={effectiveStepId}
            onStepChange={setActiveStepId}
            compact
          />
        )}
        <p className="px-1 font-mono text-[9px] text-carbon/50 select-none">
          {t('editor.diagramEditors.previewStats', { objects: spec.objects.length, steps: spec.steps.length, links: spec.objects.filter(item => item.target && item.objectType !== 'control').length + spec.groups.filter(item => item.target).length })}
        </p>
      </div>
    );
  } else if (Component) {
    previewContent = (
      <Card className="relative w-full overflow-hidden" style={{ minHeight: height }}>
        <Component />
      </Card>
    );
  }

  const bounded = isolateMathStore
    ? <MathProviderBoundary>{previewContent}</MathProviderBoundary>
    : previewContent;

  return (
    <div className="w-full" data-testid="diagram-runtime-preview">
      <ErrorBoundary
        key={`${filePath}:${componentName}`}
        fallback={<p className="p-4 text-xs text-granada" role="alert">{t('editor.diagramEditors.savedRenderError')}</p>}
      >
        {bounded}
      </ErrorBoundary>
    </div>
  );
};
