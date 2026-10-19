import React from 'react';
import { useI18n } from '@/i18n';
import { translateEditorText, type EditorMessage } from '@/fixed-pages/editor/types/editorMessage';
import type { DiagramState } from '@/fixed-pages/editor/diagrams/history/types';
import type { useDiagramState } from '@/fixed-pages/editor/diagrams/history/useDiagramState';
import type { TemplateKind, VisualDiagramModel } from '../../model/types';
import type { ElementUpdate, PointUpdate, SliderUpdate } from '../inspector/types';
import { PresetsModal } from '../modals/PresetsModal';
import { CodeModal } from '../modals/CodeModal';
import { DiagramSettingsModal } from '../modals/DiagramSettingsModal';
import { MdxLinkModal } from '../modals/MdxLinkModal';
import { GuidedConstructionsModal } from '../modals/GuidedConstructionsModal';
import { DiagramConfirmDialog } from '../DiagramConfirmDialog';
import { DiagramDivergenceDialog } from '../DiagramDivergenceDialog';
import { Callout } from '@/fixed-pages/editor/ui/primitives';

type DiagramStateApi = ReturnType<typeof useDiagramState>;

interface DiagramWorkbenchDialogsProps {
  model: VisualDiagramModel | null;
  state: DiagramState;
  sandboxMode: boolean;
  presetsOpen: boolean;
  setPresetsOpen: (open: boolean) => void;
  codeOpen: boolean;
  setCodeOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  mdxLinksOpen: boolean;
  setMdxLinksOpen: (open: boolean) => void;
  guidedOpen: boolean;
  setGuidedOpen: (open: boolean) => void;
  warningSaveOpen: boolean;
  setWarningSaveOpen: (open: boolean) => void;
  warningSaveCopy: { title: EditorMessage; message: EditorMessage };
  confirmWarningSave: () => void;
  pendingDeleteIds: string[] | null;
  setPendingDeleteIds: (ids: string[] | null) => void;
  confirmDeleteIds: () => void;
  divergenceDismissed: boolean;
  setDivergenceDismissed: (dismissed: boolean) => void;
  statusMessage: string;
  setStatusMessage: (message: string) => void;
  handleSelectPreset: (kind: TemplateKind, title: string) => void;
  handleSourceEdit: DiagramStateApi['handleSourceEdit'];
  handleVisualEdit: DiagramStateApi['handleVisualEdit'];
  handleUpdateModel: (model: VisualDiagramModel, label: string) => void;
  handleUpdatePoint: (id: string, updates: PointUpdate) => void;
  handleUpdateElement: (id: string, updates: ElementUpdate) => void;
  handleUpdateSlider: (id: string, updates: SliderUpdate) => void;
  linkToMdxPage: DiagramStateApi['linkToMdxPage'];
  resolveDivergence: DiagramStateApi['resolveDivergence'];
}

/** Modales y confirmaciones del banco de diagramas: plantillas, código, ajustes, enlaces MDX, borrado y divergencia. */
export const DiagramWorkbenchDialogs: React.FC<DiagramWorkbenchDialogsProps> = ({
  model, state, sandboxMode,
  presetsOpen, setPresetsOpen, codeOpen, setCodeOpen, settingsOpen, setSettingsOpen,
  mdxLinksOpen, setMdxLinksOpen, guidedOpen, setGuidedOpen,
  warningSaveOpen, setWarningSaveOpen, warningSaveCopy, confirmWarningSave,
  pendingDeleteIds, setPendingDeleteIds, confirmDeleteIds,
  divergenceDismissed, setDivergenceDismissed, statusMessage, setStatusMessage,
  handleSelectPreset, handleSourceEdit, handleVisualEdit, handleUpdateModel,
  handleUpdatePoint, handleUpdateElement, handleUpdateSlider, linkToMdxPage, resolveDivergence,
}) => {
  const { t } = useI18n();
  return (
    <>
    <PresetsModal
      isOpen={presetsOpen}
      onClose={() => setPresetsOpen(false)}
      onSelectPreset={handleSelectPreset}
    />

    <CodeModal
      isOpen={codeOpen}
      model={model}
      componentName={state.componentName}
      sandboxMode={sandboxMode}
      source={state.currentSource}
      onSourceChange={handleSourceEdit}
      onClose={() => setCodeOpen(false)}
    />

    <DiagramSettingsModal
      isOpen={settingsOpen}
      model={model}
      onClose={() => setSettingsOpen(false)}
      onUpdateModel={(updates, label) => {
        if (!model) return;
        handleVisualEdit({ ...model, ...updates }, { label });
      }}
    />

    <MdxLinkModal
      isOpen={mdxLinksOpen}
      model={model}
      componentName={state.componentName}
      onClose={() => setMdxLinksOpen(false)}
      onUpdatePoint={handleUpdatePoint}
      onUpdateElement={handleUpdateElement}
      onUpdateSlider={handleUpdateSlider}
      sandboxMode={sandboxMode}
      filePath={state.filePath}
      diagramMode={model?.mode}
      onLinkToMdxPage={(mdxPath, diagramMode) => {
        void linkToMdxPage(mdxPath, diagramMode);
      }}
    />

    <GuidedConstructionsModal
      isOpen={guidedOpen}
      model={model}
      onClose={() => setGuidedOpen(false)}
      onUpdateModel={handleUpdateModel}
    />

    <DiagramConfirmDialog
      isOpen={warningSaveOpen}
      title={translateEditorText(t, warningSaveCopy.title)}
      message={translateEditorText(t, warningSaveCopy.message)}
      confirmLabel={t('editor.save.saveAnyway')}
      cancelLabel={t('editor.common.cancel')}
      variant="warning"
      onConfirm={confirmWarningSave}
      onCancel={() => setWarningSaveOpen(false)}
    />

    <DiagramConfirmDialog
      isOpen={Boolean(pendingDeleteIds?.length)}
      title={pendingDeleteIds?.length === 1 ? t('editor.diagramWorkbench.deleteObject') : t('editor.diagramWorkbench.deleteSelection')}
      message={
        pendingDeleteIds?.length === 1
          ? t('editor.diagramWorkbench.deleteOneMessage', { id: pendingDeleteIds[0] })
          : t('editor.diagramWorkbench.deleteManyMessage', { count: pendingDeleteIds?.length ?? 0 })
      }
      confirmLabel={t('editor.diagramWorkbench.delete')}
      cancelLabel={t('editor.diagramWorkbench.cancel')}
      onConfirm={confirmDeleteIds}
      onCancel={() => setPendingDeleteIds(null)}
    />

    {state.status === 'diverged' && !divergenceDismissed && model && (
      <DiagramDivergenceDialog
        isOpen
        model={model}
        source={state.currentSource}
        onResolve={authority => {
          resolveDivergence(authority);
          setDivergenceDismissed(false);
        }}
        onClose={() => setDivergenceDismissed(true)}
      />
    )}

    {statusMessage && (
      <Callout className="text-xs" role="status" onAnimationEnd={() => setStatusMessage('')}>
        {statusMessage}
      </Callout>
    )}
    </>
  );
};
