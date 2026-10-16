import React from 'react';
import { expressionSourceIds } from '@/diagrams';
import type { VisualDiagramModel, VisualPoint } from '../model/types';
import { DiagramExpressionField } from './panels/DiagramExpressionField';
import { DiagramPanel } from './primitives';
import { useI18n } from '@/i18n';

interface DiagramDerivedPositionEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onExpressionChange: (axis: 'x' | 'y', expression: string) => void;
  xExpressionError?: string;
  yExpressionError?: string;
}

/** Objetos del diagrama que leen las expresiones, sin repetidos y en orden de aparición. */
export function expressionDependencySources(model: VisualDiagramModel, expressions: Array<string | undefined>): string[] {
  const sceneIds = new Set(model.objects.map(item => item.id));
  return [...new Set(expressions.flatMap(expressionSourceIds))].filter(id => sceneIds.has(id));
}

function sceneItemLabel(model: VisualDiagramModel, id: string): string {
  const object = model.objects.find(item => item.id === id);
  return object ? `${object.label} (${id})` : id;
}

export const DiagramDerivedPositionEditor: React.FC<DiagramDerivedPositionEditorProps> = ({
  model,
  point,
  onExpressionChange,
  xExpressionError,
  yExpressionError,
}) => {
  const { t } = useI18n();
  const definition = point.definition.type === 'expression' ? point.definition : undefined;
  const inferredDependencies = expressionDependencySources(model, [definition?.x, definition?.y]);

  return (
    <DiagramPanel
      title={t('editor.diagramEditors.calculatedPosition')}
      badge={t('editor.diagramEditors.byExpressions')}
      collapsible
      defaultOpen
    >
      <p className="text-[10px] leading-relaxed text-carbon/55">
        {t('editor.diagramEditors.derivedPositionHint')}
      </p>
      <div data-inspector-field="xExpression">
        <DiagramExpressionField
          model={model}
          label={t('editor.diagramEditors.xCoordinate')}
          ariaLabel={t('editor.diagramEditors.derivedXExpression')}
          value={definition?.x || ''}
          onChange={value => onExpressionChange('x', value)}
          help={t('editor.diagramEditors.derivedXExample')}
          error={xExpressionError}
        />
      </div>
      <div data-inspector-field="yExpression">
        <DiagramExpressionField
          model={model}
          label={t('editor.diagramEditors.yCoordinate')}
          ariaLabel={t('editor.diagramEditors.derivedYExpression')}
          value={definition?.y || ''}
          onChange={value => onExpressionChange('y', value)}
          help={t('editor.diagramEditors.derivedYExample')}
          error={yExpressionError}
        />
      </div>
      <div className="rounded border border-carbon/10 bg-lienzo px-2 py-1.5">
        <p className="text-[10px] font-bold text-carbon/70">{t('editor.diagramEditors.detectedObjectsTitle')}</p>
        {inferredDependencies.length === 0 ? (
          <p className="mt-1 text-[10px] leading-relaxed text-carbon/45">
            {t('editor.diagramEditors.detectedObjectsHint')}
          </p>
        ) : (
          <ul className="mt-1 space-y-0.5 text-[10px] text-carbon/60">
            {inferredDependencies.map(id => (
              <li key={id}>{sceneItemLabel(model, id)}</li>
            ))}
          </ul>
        )}
      </div>
    </DiagramPanel>
  );
};

export default DiagramDerivedPositionEditor;
