import React from 'react';
import { useI18n } from '@/i18n';
import type { VisualDiagramModel, VisualStep } from '../../model/types';
import type { ElementUpdate, PointUpdate, SliderUpdate } from '../inspector/types';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';
import { WorkbenchAsideTabs } from '@/fixed-pages/editor/ui/workbench/WorkbenchAsideTabs';
import { WorkbenchSceneTree } from './WorkbenchSceneTree';
import { WorkbenchElementInspector } from './WorkbenchElementInspector';
import { GroupsAndLayersManager } from '../scene/GroupsAndLayersManager';
import { WorkbenchStepsEditor } from '../toolbar/WorkbenchStepsEditor';

export type InspectorTab = 'scene' | 'layers' | 'properties' | 'steps';

interface DiagramInspectorTabsProps {
  model: VisualDiagramModel | null;
  /** Modelo con los textos de la lengua en edición. */
  editingModel: VisualDiagramModel | null;
  objectCount: number;
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  selectedIds: readonly string[];
  primarySelectedId: string;
  diagramLang: string;
  isTranslating: boolean;
  pickingGroupId: string | null;
  pickingStepIndex: number | null;
  activeStepIndex: number | null;
  onSelectObjects: (ids: string[], additive?: boolean) => void;
  onSelectId: (id: string) => void;
  onUpdatePoint: (id: string, updates: PointUpdate) => void;
  onUpdateElement: (id: string, updates: ElementUpdate) => void;
  onUpdateSlider: (id: string, updates: SliderUpdate) => void;
  onUpdateModel: (model: VisualDiagramModel, label: string) => void;
  onDeleteSelected: (id: string) => void;
  onDeleteSelection: () => void;
  onCopySelection: () => void;
  onTogglePickingGroupId: (id: string | null) => void;
  onTogglePickingStepIndex: (index: number | null) => void;
  onSelectStepIndex: (index: number | null) => void;
  onAddStep: () => void;
  onToggleObjectInAllSteps: (objectId: string, makeVisible: boolean) => void;
  commitEdit: (model: VisualDiagramModel, command: { label: string }) => void;
  handleVisualEdit: (model: VisualDiagramModel, command: { label: string }) => void;
}

/** Pestañas del inspector de diagramas: objetos, capas, propiedades y pasos. */
export const DiagramInspectorTabs: React.FC<DiagramInspectorTabsProps> = ({
  model, editingModel, objectCount, activeTab, onTabChange, selectedIds, primarySelectedId,
  diagramLang, isTranslating, pickingGroupId, pickingStepIndex, activeStepIndex,
  onSelectObjects, onSelectId, onUpdatePoint, onUpdateElement, onUpdateSlider, onUpdateModel,
  onDeleteSelected, onDeleteSelection, onCopySelection, onTogglePickingGroupId, onTogglePickingStepIndex,
  onSelectStepIndex, onAddStep, onToggleObjectInAllSteps, commitEdit, handleVisualEdit,
}) => {
  const { t } = useI18n();
  return (
      <WorkbenchAsideTabs
        aria-label={t('editor.diagramWorkbench.diagramInspectorSections')}
        tabs={[
          { id: 'scene', label: t('editor.diagramWorkbench.tabObjects', { count: objectCount }) },
          { id: 'layers', label: t('editor.diagramWorkbench.tabLayers') },
          { id: 'properties', label: t('editor.diagramWorkbench.tabProperties') },
          { id: 'steps', label: t('editor.diagramWorkbench.tabSteps', { count: (model?.steps || []).length }) },
        ]}
        activeTab={activeTab}
        onTabChange={id => onTabChange(id as InspectorTab)}
      >
        {activeTab === 'scene' && (
          <WorkbenchSceneTree
            model={editingModel}
            selectedIds={selectedIds}
            onSelectObjects={onSelectObjects}
            onUpdatePoint={onUpdatePoint}
            onUpdateElement={onUpdateElement}
            onUpdateSlider={onUpdateSlider}
            onUpdateModel={onUpdateModel}
            onCopySelection={onCopySelection}
            onDeleteSelection={onDeleteSelection}
          />
        )}

        {activeTab === 'layers' && (
          <GroupsAndLayersManager
            model={model}
            selectedIds={selectedIds}
            pickingGroupId={pickingGroupId}
            onUpdateModel={onUpdateModel}
            onSelectObjects={onSelectObjects}
            onTogglePickingGroupId={onTogglePickingGroupId}
          />
        )}

        {activeTab === 'properties' && isTranslating && (
          <p className="mx-4 mt-3 rounded-xl border border-canela/30 bg-canela/10 px-3 py-2 text-[11px] leading-snug text-carbon/75" role="status">
            {renderRichText(t('editor.diagramWorkbench.editingTextsIn', { language: diagramLang.toUpperCase() }), { b: c => <strong>{c}</strong> })}
          </p>
        )}
        {activeTab === 'properties' && (
          <WorkbenchElementInspector
            model={editingModel}
            selectedId={primarySelectedId}
            onUpdatePoint={onUpdatePoint}
            onUpdateElement={onUpdateElement}
            onUpdateSlider={onUpdateSlider}
            onDeleteSelected={onDeleteSelected}
            onUpdateModel={onUpdateModel}
            onSelectId={onSelectId}
          />
        )}

        {activeTab === 'steps' && (
          <WorkbenchStepsEditor
            model={editingModel}
            activeStepIndex={activeStepIndex}
            selectedIds={selectedIds}
            pickingStepIndex={pickingStepIndex}
            onSelectStepIndex={onSelectStepIndex}
            onAddStep={onAddStep}
            onUpdateStep={(idx, updates) => {
              if (!editingModel) return;
              const nextSteps = [...(editingModel.steps || [])];
              nextSteps[idx] = { ...nextSteps[idx], ...updates };
              commitEdit({ ...editingModel, steps: nextSteps }, { label: `Editar paso ${idx + 1}` });
            }}
            onDeleteStep={idx => {
              if (!model) return;
              const nextSteps = (model.steps || []).filter((_: VisualStep, i: number) => i !== idx);
              handleVisualEdit({ ...model, steps: nextSteps }, { label: `Eliminar paso ${idx + 1}` });
              if (activeStepIndex === null) return;
              if (activeStepIndex === idx) {
                onSelectStepIndex(null);
              } else if (activeStepIndex > idx) {
                onSelectStepIndex(activeStepIndex - 1);
              }
            }}
            onToggleObjectInAllSteps={onToggleObjectInAllSteps}
            onUpdateModel={onUpdateModel}
            onSelectObjects={onSelectObjects}
            onTogglePickingStepIndex={onTogglePickingStepIndex}
          />
        )}
      </WorkbenchAsideTabs>
  );
};
