import React from 'react';
import { useI18n } from '@/i18n';
import type { Block } from '@/fixed-pages/editor/session/parser';
import type { ProofStepData } from '@/fixed-pages/editor/session/parser';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { ProofStepWysiwyg } from './ProofStepWysiwyg';
import { proofStepUpdatePayload, stepFromDemoBlock } from '../prose/demoGrouping';
import { Button } from '@/fixed-pages/editor/ui/primitives';

export interface DemonstrationCanvasProps {
  blocks: Block[];
  activeBlockId: string | null;
  isReadOnly?: boolean;
  diagramTargets: DiagramTargetRegistry;
  onActivate: (blockId: string, step: ProofStepData, index: number) => void;
  onUpdateStep: (blockId: string, step: ProofStepData) => void;
  onInsertAfter: (blockId: string) => void;
  onMoveStep?: (blockId: string, direction: -1 | 1) => void;
  onDuplicateStep?: (blockId: string) => void;
  onDeleteStep?: (blockId: string) => void;
  onFocusSurface: (surfaceId: string) => void;
  onEditChip?: (
    blockId: string,
    raw: string,
    text: string,
    attrs: Record<string, unknown>,
    tag: string,
    event: React.MouseEvent,
  ) => void;
}

export function DemonstrationCanvas({
  blocks,
  activeBlockId,
  isReadOnly = false,
  diagramTargets,
  onActivate,
  onUpdateStep,
  onInsertAfter,
  onMoveStep,
  onDuplicateStep,
  onDeleteStep,
  onFocusSurface,
  onEditChip,
}: DemonstrationCanvasProps) {
  const { t } = useI18n();
  if (blocks.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-terracota/30 bg-terracota/5 px-6 py-10 text-center">
        <p className="font-serif text-sm italic text-terracota/80">{t('editor.blocks.demoEmpty')}</p>
      </div>
    );
  }

  return (
    <section className="demonstration-canvas space-y-0" aria-label={t('editor.blocks.demoLabel')}>
      {blocks.map((block, index) => {
        const step = stepFromDemoBlock(block);
        const displayNumber = index + 1;
        const active = activeBlockId === block.id;
        return (
          <React.Fragment key={block.id}>
            <ProofStepWysiwyg
              blockId={block.id}
              step={step}
              displayNumber={displayNumber}
              index={index}
              totalSteps={blocks.length}
              active={active}
              isReadOnly={isReadOnly}
              diagramTargets={diagramTargets}
              onActivate={() => onActivate(block.id, { ...step, number: displayNumber }, index)}
              onChangeStep={next => onUpdateStep(block.id, { ...next, number: displayNumber })}
              onMoveStep={dir => onMoveStep?.(block.id, dir)}
              onDuplicateStep={() => onDuplicateStep?.(block.id)}
              onDeleteStep={() => onDeleteStep?.(block.id)}
              onFocusSurface={onFocusSurface}
              onEditChip={onEditChip ? (raw, text, attrs, tag, event) => onEditChip(block.id, raw, text, attrs, tag, event) : undefined}
            />
            {!isReadOnly && (
              <div className="group/gap relative flex h-6 items-center justify-center">
                <div className="absolute inset-x-8 h-px bg-carbon/10 opacity-0 transition-opacity group-hover/gap:opacity-100" />
                <Button size="sm" className="relative" onClick={() => onInsertAfter(block.id)}>
                  {t('editor.blocks.addStep')}
                </Button>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </section>
  );
}

export function applyStepUpdate(
  updateBlock: (id: string, content: string, metadata?: Record<string, unknown>) => void,
  blockId: string,
  step: ProofStepData,
) {
  const payload = proofStepUpdatePayload(step);
  updateBlock(blockId, payload.content, payload.metadata);
}
