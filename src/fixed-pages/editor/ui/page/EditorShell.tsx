import React from 'react';
import { EDITOR_PANEL_LIMITS } from '@/fixed-pages/editor/session/editorNavigationModel';
import { usePanelResize } from '@/fixed-pages/editor/ui/page/usePanelResize';
import { UI } from '@/design';

interface EditorShellProps {
  toolbar: React.ReactNode;
  subToolbar?: React.ReactNode;
  safetySummary?: React.ReactNode;
  navigation?: React.ReactNode;
  navigationOpen: boolean;
  navigationWidth: number;
  setNavigationWidth: (width: number) => void;
  inspector?: React.ReactNode;
  inspectorOpen: boolean;
  inspectorWidth: number;
  setInspectorWidth: (width: number) => void;
  diagnostics?: React.ReactNode;
  diagnosticsOpen: boolean;
  diagnosticsHeight: number;
  setDiagnosticsHeight: (height: number) => void;
  persistPanelSizes: () => void;
  children: React.ReactNode;
}

const resizeHandle = 'ac-editor-resize-handle hidden shrink-0 lg:block';
const resizeHandleRow = 'ac-editor-resize-handle ac-editor-resize-handle--row hidden shrink-0 md:block';

export const EditorShell: React.FC<EditorShellProps> = ({
  toolbar,
  subToolbar,
  safetySummary,
  navigation,
  navigationOpen,
  navigationWidth,
  setNavigationWidth,
  inspector,
  inspectorOpen,
  inspectorWidth,
  setInspectorWidth,
  diagnostics,
  diagnosticsOpen,
  diagnosticsHeight,
  setDiagnosticsHeight,
  persistPanelSizes,
  children,
}) => {
  const navigationResize = usePanelResize({ direction: 'horizontal', value: navigationWidth, ...EDITOR_PANEL_LIMITS.navigation, onChange: setNavigationWidth, onCommit: persistPanelSizes });
  const inspectorResize = usePanelResize({ direction: 'horizontal', value: inspectorWidth, inverted: true, ...EDITOR_PANEL_LIMITS.inspector, onChange: setInspectorWidth, onCommit: persistPanelSizes });
  const diagnosticsResize = usePanelResize({ direction: 'vertical', value: diagnosticsHeight, inverted: true, ...EDITOR_PANEL_LIMITS.diagnostics, onChange: setDiagnosticsHeight, onCommit: persistPanelSizes });

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-lienzo text-carbon font-sans">
      {toolbar}
      {subToolbar && <div className="relative z-40 w-full">{subToolbar}</div>}
      {safetySummary}
      <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        {navigationOpen && navigation}
        {navigationOpen && (
          <div
            {...navigationResize}
            aria-label="Redimensionar explorador"
            className={`${resizeHandle} w-1`}
          />
        )}
        <main className="flex min-w-0 flex-1 overflow-hidden" aria-label="Área de trabajo">{children}</main>
        {inspectorOpen && inspector && (
          <>
            <div
              {...inspectorResize}
              aria-label="Redimensionar inspector"
              className={`${resizeHandle} w-1`}
            />
            <aside
              aria-label="Panel de detalles"
              className={`${UI.editorPanel} fixed inset-y-0 right-0 z-40 max-w-[92vw] overflow-hidden border-l shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none`}
              style={{ width: inspectorWidth }}
            >
              {inspector}
            </aside>
          </>
        )}
      </div>
      {diagnosticsOpen && diagnostics && (
        <>
          <div
            {...diagnosticsResize}
            aria-label="Redimensionar diagnósticos"
            className={resizeHandleRow}
          />
          <div className={`${UI.editorPanel} max-h-[55dvh] shrink-0 overflow-hidden border-t`} style={{ height: diagnosticsHeight }}>
            {diagnostics}
          </div>
        </>
      )}
    </div>
  );
};

export default EditorShell;
