import React from 'react';
import type { EditorDiagramReference } from '../../core/editorTypes';
import type { DiagramWorkbenchMode } from '../hooks/useDiagramWorkbenchLoader';
import { DiagramWorkbench } from './DiagramWorkbench';
import { preferLegacyDiagramWorkbench } from './diagramWorkbenchVariant';
import { EditorV2Main } from '../../v2/ui/EditorV2Main';

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

  if (preferLegacyDiagramWorkbench(window.location.search)) {
    return (
      <DiagramWorkbench
        isOpen={isOpen}
        mode={mode}
        metadataType={metadataType}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );
  }

  return (
    <EditorV2Main
      mode={mode}
      metadataType={metadataType}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default DiagramWorkbenchHost;
