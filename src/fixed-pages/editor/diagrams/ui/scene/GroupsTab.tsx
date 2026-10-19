import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramGroup } from '@/diagrams';
import { generateUniqueDiagramId, sanitizeDiagramId } from '../../model/elements/diagramElements';
import { allDiagramIds, renameDiagramId } from '../../model/tools/graphCommands';
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconUnlock,
  IconPlus,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
} from '../toolbar/WorkbenchIcons';
import { DiagramObjectLabel } from '../workbench/WorkbenchSceneTree';
import type { SceneItem } from './LayersTab';
import { Button, Card, IconButton, RowButton, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface GroupsTabProps {
  model: VisualDiagramModel;
  groups: DiagramGroup[];
  allItems: SceneItem[];
  selectedIds: readonly string[];
  pickingGroupId: string | null;
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
  onSelectObjects?: (ids: string[], additive?: boolean) => void;
  onTogglePickingGroupId?: (groupId: string | null) => void;
}

/** Pestaña «Grupos»: alta, miembros (también desde el lienzo), visibilidad, bloqueo y enlace desde MDX. */
export const GroupsTab: React.FC<GroupsTabProps> = ({
  model, groups, allItems, selectedIds, pickingGroupId, onUpdateModel, onSelectObjects, onTogglePickingGroupId,
}) => {
  const { t } = useI18n();
  const [newGroupLabel, setNewGroupLabel] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const handleAddGroup = () => {
    const label = newGroupLabel.trim();
    if (!label) return;
    const id = generateUniqueDiagramId(label, allDiagramIds(model), 'grp');
    const newGroup: DiagramGroup = {
      id,
      label,
      memberIds: [],
      visible: true,
      locked: false,
      selection: { selectable: true, role: 'primary' },
      target: true,
      targetId: id,
    };
    onUpdateModel({ ...model, groups: [...groups, newGroup] }, `Añadir grupo ${label}`);
    setNewGroupLabel('');
    setExpandedGroupId(id);
  };

  const handleRenameGroupId = (oldId: string, candidateNewId: string) => {
    const newId = sanitizeDiagramId(candidateNewId, oldId);
    if (!newId || newId === oldId) return;
    if (allDiagramIds(model).has(newId)) return;

    onUpdateModel(
      renameDiagramId(model, oldId, newId),
      `Renombrar ID de grupo ${oldId} a ${newId}`
    );
  };


  const handleRenameGroupLabel = (groupId: string, newLabel: string) => {
    const nextGroups = groups.map(g => (g.id === groupId ? { ...g, label: newLabel } : g));
    onUpdateModel({ ...model, groups: nextGroups }, `Renombrar nombre de grupo ${groupId}`);
  };

  const handleDeleteGroup = (groupId: string) => {
    const nextGroups = groups.filter(g => g.id !== groupId);
    const nextObjects = model.objects.map(object => ({
      ...object,
      groupIds: (object.groupIds || []).filter(gid => gid !== groupId),
    }));
    onUpdateModel(
      { ...model, groups: nextGroups, objects: nextObjects },
      `Eliminar grupo ${groupId}`
    );
  };

  const handleToggleGroupVisible = (groupId: string) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, visible: group.visible === false } : group),
    }, `Alternar visibilidad de grupo ${groupId}`);
  };

  const handleToggleGroupLock = (groupId: string) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, locked: !group.locked } : group),
    }, `Alternar bloqueo de grupo ${groupId}`);
  };

  const handleToggleGroupTarget = (groupId: string, targetEnabled: boolean) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, target: targetEnabled, targetId: targetEnabled ? (group.targetId || group.id) : undefined } : group),
    }, `Alternar target de grupo ${groupId}`);
  };

  const handleUpdateGroupTargetId = (groupId: string, candidateTargetId: string) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, targetId: candidateTargetId.trim() || group.id } : group),
    }, `Actualizar targetId de grupo ${groupId}`);
  };

  const handleUpdateGroupColor = (groupId: string, color: string | undefined) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, color: color as DiagramGroup['color'] } : group),
    }, `Actualizar color de grupo ${groupId}`);
  };

  const handleToggleGroupMember = (groupId: string, itemId: string) => {
    const grp = groups.find(g => g.id === groupId);
    if (!grp) return;
    const isMember = (grp.memberIds || []).includes(itemId);
    const nextMemberIds = isMember
      ? (grp.memberIds || []).filter(id => id !== itemId)
      : [...(grp.memberIds || []), itemId];

    const nextGroups = groups.map(g => (g.id === groupId ? { ...g, memberIds: nextMemberIds } : g));

    const nextObjects = model.objects.map(object => {
      if (object.id !== itemId) return object;
      const gIds = object.groupIds || [];
      return {
        ...object,
        groupIds: isMember ? gIds.filter(id => id !== groupId) : [...new Set([...gIds, groupId])],
      };
    });

    onUpdateModel(
      { ...model, groups: nextGroups, objects: nextObjects },
      `Modificar miembros de grupo ${groupId}`
    );
  };

  const handleAddSelectedToGroup = (groupId: string) => {
    if (!selectedIds.length) return;
    const grp = groups.find(g => g.id === groupId);
    if (!grp) return;
    const nextMemberIds = [...new Set([...(grp.memberIds || []), ...selectedIds])];
    const nextGroups = groups.map(g => (g.id === groupId ? { ...g, memberIds: nextMemberIds } : g));
    const selSet = new Set(selectedIds);

    const updateGroupIds = <T extends { id: string; groupIds?: string[] }>(items: T[]): T[] => items.map(item => {
      if (!selSet.has(item.id)) return item;
      return { ...item, groupIds: [...new Set([...(item.groupIds || []), groupId])] };
    });

    onUpdateModel({
      ...model,
      groups: nextGroups,
      objects: updateGroupIds(model.objects),
    }, `Añadir seleccionados a grupo ${groupId}`);
  };

  const handleRemoveSelectedFromGroup = (groupId: string) => {
    if (!selectedIds.length) return;
    const grp = groups.find(g => g.id === groupId);
    if (!grp) return;
    const selSet = new Set(selectedIds);
    const nextMemberIds = (grp.memberIds || []).filter(id => !selSet.has(id));
    const nextGroups = groups.map(g => (g.id === groupId ? { ...g, memberIds: nextMemberIds } : g));

    const removeGroupIds = <T extends { id: string; groupIds?: string[] }>(items: T[]): T[] => items.map(item => {
      if (!selSet.has(item.id)) return item;
      return { ...item, groupIds: (item.groupIds || []).filter(gid => gid !== groupId) };
    });

    onUpdateModel({
      ...model,
      groups: nextGroups,
      objects: removeGroupIds(model.objects),
    }, `Quitar seleccionados de grupo ${groupId}`);
  };

  return (
      <div className="space-y-3">
        {/* Formulario Añadir Grupo */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newGroupLabel}
            onChange={e => setNewGroupLabel(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAddGroup();
            }}
            placeholder={t('editor.diagramScene.newGroup')}
            className={`${controlClassName} flex-1`}
          />
          <Button size="sm" variant="primary" className="shrink-0" onClick={handleAddGroup} disabled={!newGroupLabel.trim()}>
            <IconPlus className="w-3.5 h-3.5" />
            <span>{t('editor.diagramScene.group')}</span>
          </Button>
        </div>

        {/* Lista de Grupos */}
        <div className="space-y-2">
          {groups.length === 0 ? (
            <Card dashed className="text-center space-y-1">
              <p className="font-serif text-xs font-bold text-carbon">{t('editor.diagramScene.noGroupsCreated')}</p>
              <p className="text-xs italic font-sans text-carbon/50">{t('editor.diagramScene.noGroupsHint')}</p>
            </Card>
          ) : (
            groups.map(grp => {
              const isExpanded = expandedGroupId === grp.id;
              const memberCount = (grp.memberIds || []).length;

              return (
                <Card className="overflow-hidden" key={grp.id}>
                  {/* Header del Grupo */}
                  <div className="flex items-center justify-between p-2.5 bg-carbon/5">
                    <RowButton className="min-w-0 flex-1" onClick={() => setExpandedGroupId(isExpanded ? null : grp.id)}>
                      <span className="text-carbon/50 hover:text-carbon transition-colors">
                        {isExpanded ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
                      </span>
                      <span className="font-mono text-[10px] bg-pavo/10 text-pavo font-bold px-1.5 py-0.5 rounded border border-pavo/20 shrink-0">
                        {grp.id}
                      </span>
                      <span className="font-serif font-bold text-xs truncate text-carbon">{grp.label}</span>
                      {grp.target !== false && (
                        <span className="font-mono text-[9px] bg-canela/10 text-canela font-bold px-1.5 py-0.2 rounded border border-canela/20 shrink-0" title={t('editor.diagramScene.publicTarget', { id: grp.targetId || grp.id })}>
                          {'target'}
                        </span>
                      )}
                      <span className="text-[10px] text-carbon/50 font-mono bg-carbon/10 px-1.5 py-0.2 rounded border border-carbon/10 shrink-0">
                        {t(memberCount === 1 ? 'editor.diagramScene.membersCountOne' : 'editor.diagramScene.membersCountOther', { count: memberCount })}
                      </span>
                    </RowButton>

                    <div className="flex items-center space-x-1 shrink-0">
                      <Button size="sm" aria-pressed={grp.visible !== false} onClick={() => handleToggleGroupVisible(grp.id)} title={grp.visible !== false ? t('editor.diagramScene.hideGroup') : t('editor.diagramScene.showGroup')} aria-label={grp.visible !== false ? t('editor.diagramScene.hideGroupNamed', { label: grp.label }) : t('editor.diagramScene.showGroupNamed', { label: grp.label })}>
                        {grp.visible !== false ? <IconEye /> : <IconEyeOff />}
                      </Button>
                      <Button size="sm" aria-pressed={grp.locked} onClick={() => handleToggleGroupLock(grp.id)} title={grp.locked ? t('editor.diagramScene.unlockGroup') : t('editor.diagramScene.lockGroup')} aria-label={grp.locked ? t('editor.diagramScene.unlockGroupNamed', { label: grp.label }) : t('editor.diagramScene.lockGroupNamed', { label: grp.label })}>
                        {grp.locked ? <IconLock /> : <IconUnlock />}
                      </Button>
                      <IconButton size="sm" tone="danger" label={t('editor.diagramScene.deleteGroupNamed', { label: grp.label })} title={t('editor.diagramScene.deleteGroup')} onClick={() => handleDeleteGroup(grp.id)}>
                        <IconTrash className="w-3.5 h-3.5" />
                      </IconButton>
                    </div>
                  </div>

                  {/* Cuerpo Expandido del Grupo */}
                  {isExpanded && (
                    <div className="p-3 border-t border-carbon/10 bg-lienzo space-y-3">
                      <Card className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">{t('editor.diagramScene.groupId')}</label>
                          <input
                            type="text"
                            defaultValue={grp.id}
                            key={`grp-id-${grp.id}`}
                            onBlur={e => handleRenameGroupId(grp.id, e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleRenameGroupId(grp.id, e.currentTarget.value);
                            }}
                            className={`${controlClassName} font-mono`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">{t('editor.diagramScene.name')}</label>
                          <input
                            type="text"
                            value={grp.label}
                            onChange={e => handleRenameGroupLabel(grp.id, e.target.value)}
                            className={controlClassName}
                          />
                        </div>
                      </Card>

                      {/* Enlazable desde MDX (Target) */}
                      <Card className="space-y-2">
                        <label className="flex items-center justify-between text-xs font-bold text-carbon cursor-pointer select-none">
                          <span>{t('editor.diagramScene.mdxLinkable')}</span>
                          <input
                            type="checkbox"
                            checked={grp.target !== false}
                            onChange={e => handleToggleGroupTarget(grp.id, e.target.checked)}
                            className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
                          />
                        </label>
                        {grp.target !== false && (
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-carbon/10">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">{t('editor.diagramScene.targetId')}</label>
                              <input
                                type="text"
                                value={grp.targetId ?? grp.id}
                                onChange={e => handleUpdateGroupTargetId(grp.id, e.target.value)}
                                placeholder={grp.id}
                                className={`${controlClassName} font-mono`}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">{t('editor.diagramScene.highlightColor')}</label>
                              <select
                                value={grp.color || ''}
                                onChange={e => handleUpdateGroupColor(grp.id, e.target.value || undefined)}
                                className={controlClassName}
                              >
                                <option value="">{t('editor.diagramScene.automaticByMembers')}</option>
                                <option value="canela">{'canela'}</option>
                                <option value="terracota">{'terracota'}</option>
                                <option value="ocre">{'ocre'}</option>
                                <option value="pavo">{'pavo'}</option>
                                <option value="mora">{'mora'}</option>
                                <option value="granada">{'granada'}</option>
                                <option value="musgo">{'musgo'}</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </Card>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-carbon/10 pb-2">
                          <span className="text-[10px] font-bold text-carbon/60 uppercase tracking-wider">
                            {t('editor.diagramScene.groupMembersCount', { count: memberCount })}
                          </span>
                          <div className="flex flex-wrap items-center gap-1">
                            {onTogglePickingGroupId && (
                              <Button size="sm" aria-pressed={pickingGroupId === grp.id} onClick={() => onTogglePickingGroupId(pickingGroupId === grp.id ? null : grp.id)} title={t('editor.diagramScene.pickMembersHint')}>
                                {pickingGroupId === grp.id ? t('editor.diagramScene.selectingOnTheCanvas') : t('editor.diagramScene.selectOnTheCanvas')}
                              </Button>
                            )}
                            {selectedIds.length > 0 && (
                              <>
                                <Button size="sm" onClick={() => handleAddSelectedToGroup(grp.id)} title={t('editor.diagramScene.addSelectedTitle')}>
                                  {t('editor.diagramScene.addSelected', { count: selectedIds.length })}
                                </Button>
                                <Button size="sm" onClick={() => handleRemoveSelectedFromGroup(grp.id)} title={t('editor.diagramScene.removeSelectedTitle')}>
                                  {t('editor.diagramScene.removeSelected', { count: selectedIds.length })}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <Card className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                          {allItems.map(item => {
                            const isMember = (grp.memberIds || []).includes(item.id);
                            const isCanvasSelected = selectedIds.includes(item.id);
                            return (
                              <Button
                                key={item.id}
                                size="sm"
                                aria-pressed={isMember}
                                className={isCanvasSelected ? 'font-mono ring-1 ring-carbon' : 'font-mono'}
                                onClick={() => {
                                  handleToggleGroupMember(grp.id, item.id);
                                  onSelectObjects?.([item.id]);
                                }}
                                title={isMember ? t('editor.diagramScene.removeFromGroup', { label: item.label, id: item.id }) : t('editor.diagramScene.addToGroup', { label: item.label, id: item.id })}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isMember ? 'bg-lienzo' : 'bg-carbon/30'}`} />
                                <DiagramObjectLabel label={item.label} id={item.id} className="text-[10px]" />
                                <span className={`text-[8px] uppercase font-sans px-1 py-0.2 rounded ${
                                  isMember ? 'bg-lienzo/20 text-lienzo' : 'bg-carbon/10 text-carbon/50'
                                }`}>
                                  {item.kind}
                                </span>
                              </Button>
                            );
                          })}
                        </Card>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
  );
};
