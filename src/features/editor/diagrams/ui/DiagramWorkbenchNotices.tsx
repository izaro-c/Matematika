import React from 'react';
import type { DiagramWorkbenchMode } from '../hooks/useDiagramWorkbenchLoader';

interface DiagramWorkbenchNoticesProps {
  clipboardStatus: string;
  mode: DiagramWorkbenchMode;
}

export const DiagramWorkbenchNotices: React.FC<DiagramWorkbenchNoticesProps> = ({ clipboardStatus, mode }) => <>
  {clipboardStatus && <div className="shrink-0 border-b border-salvia/25 bg-salvia/10 px-4 py-1.5 text-[10px] text-carbon" role="status">{clipboardStatus}</div>}
  {mode.kind === 'rewrite' && (
    <div className="shrink-0 border-b border-ocre/25 bg-ocre/10 px-4 py-2 text-xs text-carbon" role="status">
      <strong className="text-ocre">Reescritura visual desde cero.</strong>{' '}
      El TSX actual permanece intacto mientras trabaja. Al guardar, se sustituirá por este modelo visual exacto y se conservará un backup recuperable.
    </div>
  )}
</>;
