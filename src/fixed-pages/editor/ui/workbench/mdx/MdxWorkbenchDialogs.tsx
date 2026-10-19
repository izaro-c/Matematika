import React from 'react';
import { useI18n } from '@/i18n';
import { translateEditorText, type EditorMessage } from '@/fixed-pages/editor/types/editorMessage';
import type { EditorDiagramReference, EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';
import type { useEditorCore } from '@/fixed-pages/editor/session/useEditorCore';
import { toDiagramImportPath } from '@/fixed-pages/editor/review/authoringModel';
import type { buildEditorSafetyPresentation } from '@/fixed-pages/editor/review/safetyPresentation';
import { DiagramRewriteDialog } from '../../../diagrams/ui/DiagramRewriteDialog';
import { DiagramConfirmDialog } from '../../../diagrams/ui/DiagramConfirmDialog';
import { CreatePageDialog } from '../../create/CreatePageDialog';
import { CreateDiagramDialog } from '../../create/CreateDiagramDialog';
import { AddDiagramDialog } from '../../create/AddDiagramDialog';
import { UnsavedChangesDialog } from '../../safety/UnsavedChangesDialog';
import { SaveErrorModal } from '../../safety/SaveErrorModal';

type EditorCore = ReturnType<typeof useEditorCore>;

interface MdxWorkbenchDialogsProps {
  files: FileNode[];
  metadata: Record<string, unknown>;
  currentLang: string;
  validationIssues: EditorValidationIssue[];

  diagramSurfaceOpen: boolean;
  rewriteDiagramPath: string | null;
  setRewriteDiagramPath: (path: string | null) => void;
  openDiagramEditor: (options?: { modeOverride?: DiagramWorkbenchMode | null; asRewrite?: boolean }) => void;

  createPageOpen: boolean;
  setCreatePageOpen: (open: boolean) => void;
  createDiagramOpen: boolean;
  setCreateDiagramOpen: (open: boolean) => void;
  addDiagramOpen: boolean;
  setAddDiagramOpen: (open: boolean) => void;
  setActiveDiagramBlockId: (id: string | null) => void;
  setActiveDiagramIndex: (index: number | null) => void;
  hasPageDiagramLinks: boolean;
  publishedDiagramMode: EditorDiagramReference['mode'];
  handleMetadataChange: (key: string, value: unknown) => void;
  createPage: EditorCore['createPage'];
  createDiagram: EditorCore['createDiagram'];
  bindDiagram: EditorCore['bindDiagram'];
  openFileSafely: (path: string) => void;

  pendingFileNavigation: unknown;
  safetyPresentation: ReturnType<typeof buildEditorSafetyPresentation>;
  cancelPendingNavigation: () => void;
  continuePendingNavigation: () => void;
  handleSaveDocument: () => void;
  saveDraftCurrentFile: () => unknown;
  canSave: boolean;
  canSaveDraft: boolean;

  warningSaveOpen: boolean;
  warningSaveCopy: { title: EditorMessage; message: EditorMessage };
  confirmWarningSave: () => void;
  setWarningSaveOpen: (open: boolean) => void;
  saveErrorModalOpen: boolean;
  setSaveErrorModalOpen: (open: boolean) => void;
  saveErrorMessage: string | null;
  onSelectIssue: (issue: EditorValidationIssue) => void;
  onOpenDiagnostics: () => void;
}

/** Diálogos del editor MDX: crear página o diagrama, añadir un diagrama, cambios sin guardar y errores de guardado. */
export const MdxWorkbenchDialogs: React.FC<MdxWorkbenchDialogsProps> = ({
  files,
  metadata,
  currentLang,
  validationIssues,
  diagramSurfaceOpen,
  rewriteDiagramPath,
  setRewriteDiagramPath,
  openDiagramEditor,
  createPageOpen,
  setCreatePageOpen,
  createDiagramOpen,
  setCreateDiagramOpen,
  addDiagramOpen,
  setAddDiagramOpen,
  setActiveDiagramBlockId,
  setActiveDiagramIndex,
  hasPageDiagramLinks,
  publishedDiagramMode,
  handleMetadataChange,
  createPage,
  createDiagram,
  bindDiagram,
  openFileSafely,
  pendingFileNavigation,
  safetyPresentation,
  cancelPendingNavigation,
  continuePendingNavigation,
  handleSaveDocument,
  saveDraftCurrentFile,
  canSave,
  canSaveDraft,
  warningSaveOpen,
  warningSaveCopy,
  confirmWarningSave,
  setWarningSaveOpen,
  saveErrorModalOpen,
  setSaveErrorModalOpen,
  saveErrorMessage,
  onSelectIssue,
  onOpenDiagnostics,
}) => {
  const { t } = useI18n();

  // Primer diagrama de la página: se activan los indicadores de metadatos que lo anuncian.
  const flagFirstDiagram = () => {
    if (hasPageDiagramLinks) return;
    if ('hasSimulation' in metadata || metadata.type !== 'modelo') handleMetadataChange('hasSimulation', true);
    if ('hasDiagram' in metadata || metadata.type === 'modelo') handleMetadataChange('hasDiagram', true);
  };

  return (
    <>
      {rewriteDiagramPath && !diagramSurfaceOpen && (
        <DiagramRewriteDialog
          path={rewriteDiagramPath}
          initialTitle="Diagrama"
          onClose={() => setRewriteDiagramPath(null)}
          onStart={() => openDiagramEditor({ asRewrite: true })}
        />
      )}

      <CreatePageDialog
        open={createPageOpen}
        onClose={() => setCreatePageOpen(false)}
        onCreate={async (params) => createPage(params)}
        initialLang={currentLang}
      />

      <CreateDiagramDialog
        open={createDiagramOpen}
        onClose={() => setCreateDiagramOpen(false)}
        onCreate={async (params) => {
          const result = await createDiagram(params);
          if (result) {
            setCreateDiagramOpen(false);
            openFileSafely(result.path);
            return true;
          }
          return false;
        }}
      />

      <AddDiagramDialog
        open={addDiagramOpen}
        onClose={() => {
          setAddDiagramOpen(false);
          setActiveDiagramBlockId(null);
          setActiveDiagramIndex(null);
        }}
        files={files}
        onSelectExisting={async (diagramFile) => {
          const componentName = diagramFile.name.replace(/\.tsx$/, '');
          flagFirstDiagram();
          bindDiagram({
            componentName,
            importPath: toDiagramImportPath(diagramFile.path),
            path: diagramFile.path,
            category: typeof diagramFile.type === 'string' ? diagramFile.type : '',
            mode: publishedDiagramMode,
          });
          setActiveDiagramBlockId(null);
          setActiveDiagramIndex(null);
          setAddDiagramOpen(false);
        }}
        onCreateNew={async (params) => {
          const result = await createDiagram(params);
          if (!result) return false;
          flagFirstDiagram();
          bindDiagram({
            componentName: result.componentName,
            importPath: toDiagramImportPath(result.path),
            path: result.path,
            category: params.category,
            mode: publishedDiagramMode,
          });
          setAddDiagramOpen(false);
          openDiagramEditor({ modeOverride: { kind: 'file', path: result.path } });
          return true;
        }}
      />

      {pendingFileNavigation && (
        <UnsavedChangesDialog
          isOpen
          targetLabel={typeof pendingFileNavigation === 'string' ? pendingFileNavigation : 'Página'}
          presentation={safetyPresentation}
          onCancel={() => cancelPendingNavigation()}
          onSave={() => void handleSaveDocument()}
          onSaveDraft={() => void saveDraftCurrentFile()}
          onDiscardAndContinue={() => continuePendingNavigation()}
          canSave={canSave}
          canSaveDraft={canSaveDraft}
        />
      )}

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
      <SaveErrorModal
        isOpen={saveErrorModalOpen}
        onClose={() => setSaveErrorModalOpen(false)}
        issues={validationIssues.filter(issue => issue.severity === 'error')}
        saveMessage={saveErrorMessage}
        onJumpToIssue={onSelectIssue}
        onOpenAvisos={onOpenDiagnostics}
      />
    </>
  );
};
