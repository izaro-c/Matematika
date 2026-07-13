import React from 'react';
import { EDITOR_PANEL_LIMITS } from '../navigation/editorNavigationModel';
import { usePanelResize } from './hooks/usePanelResize';

interface EditorShellProps {
  toolbar: React.ReactNode;
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

export const EditorShell: React.FC<EditorShellProps> = ({
  toolbar,
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
    <div className="flex h-dvh min-h-[32rem] overflow-hidden bg-lienzo font-sans text-carbon">
      {navigationOpen && navigation}
      {navigationOpen && <div {...navigationResize} aria-label="Redimensionar explorador" className="relative z-20 hidden w-1 shrink-0 cursor-col-resize bg-carbon/5 hover:bg-salvia/30 focus:bg-salvia/30 lg:block" />}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {toolbar}
        {safetySummary}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="flex min-w-0 flex-1 overflow-hidden" aria-label="Área de trabajo">{children}</main>
          {inspectorOpen && inspector && <>
            <div {...inspectorResize} aria-label="Redimensionar inspector" className="relative z-20 hidden w-1 shrink-0 cursor-col-resize bg-carbon/5 hover:bg-salvia/30 focus:bg-salvia/30 lg:block" />
            <aside
              aria-label="Inspector contextual"
              className="fixed inset-y-0 right-0 z-40 max-w-[92vw] overflow-hidden border-l border-carbon/15 bg-lienzo shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none"
              style={{ width: inspectorWidth }}
            >
              {inspector}
            </aside>
          </>}
        </div>
        {diagnosticsOpen && diagnostics && <>
          <div {...diagnosticsResize} aria-label="Redimensionar diagnósticos" className="relative z-20 hidden h-1 shrink-0 cursor-row-resize bg-carbon/5 hover:bg-salvia/30 focus:bg-salvia/30 md:block" />
          <div className="max-h-[55dvh] shrink-0 overflow-hidden border-t border-carbon/15" style={{ height: diagnosticsHeight }}>{diagnostics}</div>
        </>}
      </div>
    </div>
  );
};

export default EditorShell;
