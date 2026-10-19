import React from 'react';
import { EDITOR_PANEL_LIMITS } from '@/fixed-pages/editor/session/editorNavigationModel';
import { usePanelResize } from '@/fixed-pages/editor/ui/page/usePanelResize';
import { UI } from '@/design';
import { useI18n } from '@/i18n';

/**
 * Esquema único de la página del editor, igual para MDX y para diagramas:
 *
 *   ┌──────────────── header (ruta, versiones, guardado, acciones) ────────────────┐
 *   ├──────────────── toolbar (formato MDX / herramientas de diagrama) ────────────┤
 *   │ navigation │ lienzo (children)                                │ inspector    │
 *   │            ├──────────────────────────────────────────────────┤              │
 *   │            │ diagnostics (avisos)                             │              │
 *   └────────────┴──────────────────────────────────────────────────┴──────────────┘
 *
 * Los avisos van bajo el lienzo y no a lo ancho: así los paneles laterales conservan
 * toda la altura.
 */
interface EditorShellProps {
  header?: React.ReactNode;
  toolbar?: React.ReactNode;
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
  /** Al soltar un separador; las preferencias del editor ya se guardan al cambiar. */
  persistPanelSizes?: () => void;
  /** Nombre accesible del lienzo (por defecto, «Área de trabajo»). */
  mainLabel?: string;
  className?: string;
  children: React.ReactNode;
}

const resizeHandle = 'ac-editor-resize-handle hidden shrink-0 lg:block';
const resizeHandleRow = 'ac-editor-resize-handle ac-editor-resize-handle--row hidden shrink-0 md:block';

export const EditorShell: React.FC<EditorShellProps> = ({
  header,
  toolbar,
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
  mainLabel,
  className = '',
  children,
}) => {
  const { t } = useI18n();
  const navigationResize = usePanelResize({ direction: 'horizontal', value: navigationWidth, ...EDITOR_PANEL_LIMITS.navigation, onChange: setNavigationWidth, onCommit: persistPanelSizes });
  const inspectorResize = usePanelResize({ direction: 'horizontal', value: inspectorWidth, inverted: true, ...EDITOR_PANEL_LIMITS.inspector, onChange: setInspectorWidth, onCommit: persistPanelSizes });
  const diagnosticsResize = usePanelResize({ direction: 'vertical', value: diagnosticsHeight, inverted: true, ...EDITOR_PANEL_LIMITS.diagnostics, onChange: setDiagnosticsHeight, onCommit: persistPanelSizes });

  return (
    <div className={`flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-lienzo text-carbon ${className}`.trim()}>
      {header}
      {toolbar && <div className="relative z-40 w-full">{toolbar}</div>}
      <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        {navigationOpen && navigation}
        {navigationOpen && navigation && (
          <div
            {...navigationResize}
            aria-label={t('editor.nav.resizeExplorer')}
            className={`${resizeHandle} w-1`}
          />
        )}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <main className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden" aria-label={mainLabel ?? t('editor.nav.workspace')}>
            {children}
          </main>
          {diagnosticsOpen && diagnostics && (
            <>
              <div
                {...diagnosticsResize}
                aria-label={t('editor.nav.resizeDiagnostics')}
                className={resizeHandleRow}
              />
              <section
                aria-label={t('editor.nav.warnings')}
                className={`${UI.editorPanel} max-h-[55dvh] shrink-0 overflow-hidden border-t`}
                style={{ height: diagnosticsHeight }}
              >
                {diagnostics}
              </section>
            </>
          )}
        </div>
        {inspectorOpen && inspector && (
          <>
            <div
              {...inspectorResize}
              aria-label={t('editor.nav.resizeInspector')}
              className={`${resizeHandle} w-1`}
            />
            <aside
              aria-label={t('editor.nav.detailsPanel')}
              className={`${UI.editorPanel} fixed inset-y-0 right-0 z-40 flex max-w-[92vw] flex-col overflow-hidden border-l shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none`}
              style={{ width: inspectorWidth }}
            >
              {inspector}
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorShell;
