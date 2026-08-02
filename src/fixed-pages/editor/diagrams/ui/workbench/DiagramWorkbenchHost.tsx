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
};

export const DiagramWorkbenchHost: React.FC<DiagramWorkbenchHostProps> = (props) => {
  const { isOpen, mode, metadataType, onClose, onConfirm } = props;
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-lienzo"
      role="dialog"
      aria-modal="true"
      aria-label="Editor de diagramas"
    >
      <DiagramWorkbench
        mode={mode}
        metadataType={metadataType}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default DiagramWorkbenchHost;
