import React from 'react';
import type { EditorDiagramReference } from '@/fixed-pages/editor/session/editorTypes';
import type { DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';
import { DiagramWorkbench } from './DiagramWorkbench';

export type DiagramWorkbenchHostProps = {
  isOpen: boolean;
  mode: DiagramWorkbenchMode;
  metadataType: string;
  onClose: () => void;
  onConfirm: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
  onDirtyChange?: (dirty: boolean) => void;
};

/** Contenedor de superficie diagrama dentro del shell (no modal). */
export const DiagramWorkbenchHost: React.FC<DiagramWorkbenchHostProps> = (props) => {
  const { isOpen, mode, metadataType, onClose, onConfirm, onDirtyChange } = props;
  if (!isOpen) return null;

  return (
    <div
      className="flex h-full w-full min-h-0 flex-col bg-lienzo"
      role="region"
      aria-label="Editor de diagramas"
    >
      <DiagramWorkbench
        mode={mode}
        metadataType={metadataType}
        onClose={onClose}
        onConfirm={onConfirm}
        onDirtyChange={onDirtyChange}
      />
    </div>
  );
};

export default DiagramWorkbenchHost;
