import React from 'react';
import { DiffReviewPanel } from './DiffReviewPanel';
import { approveDiffReview, buildDiffReview, isDiffReviewStale, type DiffReview } from '../../ux/diffReview';

export interface BuildDiffReviewOptions {
  currentFile: string | null;
  baseSource: string;
  rawBody: string;
  localRevision: number;
  baseVersion: string | null;
  compatibility: string;
  editorMode: string;
  coordinatedView: boolean;
  getExpectedDiffRanges: () => any[];
  saveCurrentFile: () => Promise<boolean>;
}

export function reviewDiffForDocument(
  options: BuildDiffReviewOptions,
  setDiffReview: (review: DiffReview | null) => void,
) {
  const {
    currentFile,
    baseSource,
    rawBody,
    localRevision,
    baseVersion,
    compatibility,
    editorMode,
    coordinatedView,
    getExpectedDiffRanges,
    saveCurrentFile,
  } = options;

  if (!currentFile?.endsWith('.mdx')) {
    void saveCurrentFile();
    return;
  }
  const structuralRanges = getExpectedDiffRanges();
  const explicitCodeEdit =
    structuralRanges.length === 0 &&
    compatibility === 'fully-editable' &&
    (editorMode === 'code' || coordinatedView);
  const expectedRanges = explicitCodeEdit
    ? [
        {
          start: 0,
          end: baseSource.length,
          reason: 'Edición explícita del source completo en la vista de código.',
          operationId: `code-edit:${localRevision}`,
          blockId: 'source',
        },
      ]
    : structuralRanges;

  setDiffReview(
    buildDiffReview({
      documentId: currentFile,
      baseSource,
      candidateSource: rawBody,
      localRevision,
      baseVersion,
      expectedRanges,
    }),
  );
}

export interface EditorDiffControllerProps {
  diffReview: DiffReview | null;
  setDiffReview: (review: DiffReview | null) => void;
  saving: boolean;
  localRevision: number;
  baseVersion: string | null;
  saveCurrentFile: (approval?: any) => Promise<boolean>;
  onSelectDiffChange: (change: any) => void;
}

export const EditorDiffController: React.FC<EditorDiffControllerProps> = ({
  diffReview,
  setDiffReview,
  saving,
  localRevision,
  baseVersion,
  saveCurrentFile,
  onSelectDiffChange,
}) => {
  const isStale = diffReview ? isDiffReviewStale(diffReview, localRevision, baseVersion) : false;

  const applyReviewedDiff = async () => {
    if (!diffReview || isStale || diffReview.status !== 'reviewable') return;
    const approval = approveDiffReview(diffReview);
    if (!approval) return;
    const saved = await saveCurrentFile(approval);
    if (saved) setDiffReview(null);
  };

  return (
    <DiffReviewPanel
      review={diffReview}
      isStale={isStale}
      isApplying={saving}
      onClose={() => setDiffReview(null)}
      onApply={applyReviewedDiff}
      onSelectChange={onSelectDiffChange}
    />
  );
};
