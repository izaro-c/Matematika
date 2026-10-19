import { objectKind } from '@/diagrams';
import { modelElements, modelPoints, modelSliders } from '../../model/scene/objectLists';
import React, { useState } from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramGroup } from '@/diagrams';
import { useI18n } from '@/i18n';
import { ensureSceneStack } from './sceneStack';
import { LayersTab } from './LayersTab';
import { GroupsTab } from './GroupsTab';

interface GroupsAndLayersManagerProps {
  model: VisualDiagramModel | null;
  selectedIds?: readonly string[];
  pickingGroupId?: string | null;
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
  onSelectObjects?: (ids: string[], additive?: boolean) => void;
  onTogglePickingGroupId?: (groupId: string | null) => void;
}

export const GroupsAndLayersManager: React.FC<GroupsAndLayersManagerProps> = ({
  model,
  selectedIds = [],
  pickingGroupId = null,
  onUpdateModel,
  onSelectObjects,
  onTogglePickingGroupId,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'layers' | 'groups'>('layers');

  if (!model) return null;

  const stacked = ensureSceneStack(model);
  const layers = stacked.layers.slice().sort((a, b) => a.order - b.order);
  const groups: DiagramGroup[] = model.groups || [];

  const allItems = [
    ...modelPoints(stacked).map(p => ({ id: p.id, label: p.label || p.id, kind: 'punto', layerId: p.layerId, order: p.order })),
    ...modelElements(stacked).map(e => ({ id: e.id, label: e.label || e.id, kind: String(objectKind(e)), layerId: e.layerId, order: e.order })),
    ...modelSliders(stacked).map(s => ({ id: s.id, label: s.label || s.id, kind: 'slider', layerId: s.layerId, order: s.order })),
  ];

  return (
    <div className="p-4 space-y-3 font-serif text-xs text-carbon bg-lienzo h-full overflow-y-auto select-none">
      {/* Cabecera unificada con selector Capas / Grupos */}
      <div className="flex items-center justify-between border-b border-carbon/15 pb-3">
        <div>
          <h3 className="font-serif text-base font-bold text-carbon">{t('editor.diagramScene.layersAndGroups')}</h3>
          <p className="text-xs italic text-carbon/50">{t('editor.diagramScene.subtitle')}</p>
        </div>
        <div className="flex bg-carbon/10 p-0.5 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('layers')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'layers' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            {t('editor.diagramScene.layersCount', { count: layers.length })}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'groups' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            {t('editor.diagramScene.groupsCount', { count: groups.length })}
          </button>
        </div>
      </div>

      {/* Ambas pestañas siguen montadas para conservar lo escrito y lo desplegado al cambiar. */}
      <div hidden={activeTab !== 'layers'}>
        <LayersTab
          stacked={stacked}
          layers={layers}
          allItems={allItems}
          onUpdateModel={onUpdateModel}
        />
      </div>
      <div hidden={activeTab !== 'groups'}>
        <GroupsTab
          model={model}
          groups={groups}
          allItems={allItems}
          selectedIds={selectedIds}
          pickingGroupId={pickingGroupId}
          onUpdateModel={onUpdateModel}
          onSelectObjects={onSelectObjects}
          onTogglePickingGroupId={onTogglePickingGroupId}
        />
      </div>
    </div>
  );
};
