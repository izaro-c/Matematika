import React from 'react';
import type { EditorDiagramReference } from '@/fixed-pages/editor/session/editorTypes';
import type { DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';
import { DiagramWorkbench } from './DiagramWorkbench';
import { useI18n } from '@/i18n';

export type DiagramWorkbenchHostProps = {
  isOpen: boolean;
  mode: DiagramWorkbenchMode;
  metadataType: string;
  onClose: () => void;
  onConfirm: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
  onDirtyChange?: (dirty: boolean) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  leftPanel?: React.ReactNode;
  leftPanelWidth?: number;
  onLeftPanelWidthChange?: (width: number) => void;
  inspectorWidth?: number;
  onInspectorWidthChange?: (width: number) => void;
  diagnosticsHeight?: number;
  onDiagnosticsHeightChange?: (height: number) => void;
  isDiagnosticsOpen?: boolean;
  onDiagnosticsOpenChange?: (open: boolean) => void;
};

/** Contenedor de superficie diagrama dentro del shell (no modal). */
export const DiagramWorkbenchHost: React.FC<DiagramWorkbenchHostProps> = (props) => {
  const { t } = useI18n();
  const {
    isOpen,
    mode,
    metadataType,
    onClose,
    onConfirm,
    onDirtyChange,
    isSidebarOpen,
    onToggleSidebar,
    leftPanel,
    leftPanelWidth,
    onLeftPanelWidthChange,
    inspectorWidth,
    onInspectorWidthChange,
    diagnosticsHeight,
    onDiagnosticsHeightChange,
    isDiagnosticsOpen,
    onDiagnosticsOpenChange,
  } = props;
  if (!isOpen) return null;

  return (
    <div
      className="flex h-full w-full min-h-0 flex-col bg-lienzo"
      role="region"
      aria-label={t('editor.diagramWorkbench.diagramEditor')}
    >
      <DiagramWorkbench
        mode={mode}
        metadataType={metadataType}
        onClose={onClose}
        onConfirm={onConfirm}
        onDirtyChange={onDirtyChange}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={onToggleSidebar}
        leftPanel={leftPanel}
        leftPanelWidth={leftPanelWidth}
        onLeftPanelWidthChange={onLeftPanelWidthChange}
        inspectorWidth={inspectorWidth}
        onInspectorWidthChange={onInspectorWidthChange}
        diagnosticsHeight={diagnosticsHeight}
        onDiagnosticsHeightChange={onDiagnosticsHeightChange}
        isDiagnosticsOpen={isDiagnosticsOpen}
        onDiagnosticsOpenChange={onDiagnosticsOpenChange}
      />
    </div>
  );
};

export default DiagramWorkbenchHost;
