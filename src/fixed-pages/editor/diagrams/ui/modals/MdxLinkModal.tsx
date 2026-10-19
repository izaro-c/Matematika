import { objectKind } from '@/diagrams';
import { modelElements, modelPoints, modelSliders } from '../../model/scene/objectLists';
import React, { useState } from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider } from '../../model/types';
import { DiagramReferencesPanel } from '../DiagramReferencesPanel';
import { useI18n } from '@/i18n';
import { objectTypeLabel } from '@/fixed-pages/editor/diagrams/ui/diagramLabels';
import { Button, Card, Modal, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface MdxLinkModalProps {
  isOpen: boolean;
  model: VisualDiagramModel | null;
  componentName: string;
  onClose: () => void;
  onUpdatePoint?: (id: string, updates: Partial<VisualPoint>) => void;
  onUpdateElement?: (id: string, updates: Partial<VisualElement>) => void;
  onUpdateSlider?: (id: string, updates: Partial<VisualSlider>) => void;
  sandboxMode?: boolean;
  filePath?: string | null;
  diagramMode?: 'simulation' | 'diagram' | 'inline';
  onLinkToMdxPage?: (mdxPath: string, mode: 'simulation' | 'diagram' | 'inline') => void | Promise<void>;
}

export const MdxLinkModal: React.FC<MdxLinkModalProps> = ({
  isOpen,
  model,
  componentName,
  onClose,
  onUpdatePoint,
  onUpdateElement,
  onUpdateSlider,
  sandboxMode = false,
  filePath = null,
  diagramMode = 'diagram',
  onLinkToMdxPage,
}) => {
  const { t } = useI18n();
  const [copiedTargetId, setCopiedTargetId] = useState<string | null>(null);

  if (!isOpen || !model) return null;

  const targets = [
    ...modelPoints(model).map(p => ({
      id: p.id,
      label: p.label || p.id,
      type: 'point',
      color: p.color || 'canela',
      target: p.target !== false,
      groupIds: p.groupIds || [],
      kind: 'point' as const,
    })),
    ...modelElements(model).map(e => ({
      id: e.id,
      label: e.label || e.id,
      type: objectKind(e),
      color: e.color || 'canela',
      target: e.target !== false,
      groupIds: e.groupIds || [],
      kind: 'element' as const,
    })),
    ...modelSliders(model).map(s => ({
      id: s.id,
      label: s.label || s.id,
      type: 'slider',
      color: s.color || 'pavo',
      target: s.target !== false,
      groupIds: s.groupIds || [],
      kind: 'slider' as const,
    })),
  ];

  const componentSnippet = `<${componentName || 'DiagramaInteractivo'} />`;

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTargetId(id);
      setTimeout(() => setCopiedTargetId(null), 2000);
    } catch {
      console.error('Error al copiar');
    }
  };

  const handleToggleTarget = (id: string, kind: 'point' | 'element' | 'slider', current: boolean) => {
    if (kind === 'point' && onUpdatePoint) {
      onUpdatePoint(id, { target: !current });
    } else if (kind === 'element' && onUpdateElement) {
      onUpdateElement(id, { target: !current });
    } else if (kind === 'slider' && onUpdateSlider) {
      onUpdateSlider(id, { target: !current });
    }
  };

  const handleUpdateGroupIds = (id: string, kind: 'point' | 'element' | 'slider', groupIdsStr: string) => {
    const list = groupIdsStr.split(',').map(s => s.trim()).filter(Boolean);
    if (kind === 'point' && onUpdatePoint) {
      onUpdatePoint(id, { groupIds: list });
    } else if (kind === 'element' && onUpdateElement) {
      onUpdateElement(id, { groupIds: list });
    } else if (kind === 'slider' && onUpdateSlider) {
      onUpdateSlider(id, { groupIds: list });
    }
  };

  return (
    <Modal open onClose={onClose} title={t('editor.diagramModals.mdxLinksAndReferences')} size="lg">
      <div className="space-y-4">
        <p className="italic">
          {sandboxMode
            ? t('editor.diagramModals.sandboxSnippetsNote')
            : t('editor.diagramModals.linksIntro')}
        </p>
          {/* Inserción de Componente Principal */}
          <div className="space-y-1.5 border-b border-[color:var(--ed-rule-faint)] pb-3">
            <h4 className="font-bold text-sm text-carbon">{t('editor.diagramModals.componentLabelInMdx')}</h4>
            <Card className="flex items-center justify-between text-xs">
              <code>{componentSnippet}</code>
              <Button size="sm" variant="primary" onClick={() => copyToClipboard(componentSnippet, 'comp')}>
                {copiedTargetId === 'comp' ? t('editor.diagramModals.copied') : t('editor.diagramModals.copyJsx')}
              </Button>
            </Card>
          </div>

          {!sandboxMode && (
            <DiagramReferencesPanel
              filePath={filePath}
              diagramMode={diagramMode}
              onLinkToMdxPage={onLinkToMdxPage}
            />
          )}

          {/* Enlaces a Elementos Interactivos del Diagrama */}
          <div>
            <h4 className="font-bold text-sm text-carbon mb-1">
              {t('editor.diagramModals.highlightableTitle')}
            </h4>
            <p className="text-[11px] text-mora/70 italic mb-2">
              {t('editor.diagramModals.highlightableHint')}
            </p>
            <Card className="space-y-2 max-h-80 overflow-y-auto">
              {targets.map(tg => {
                const snippet = `<InteractiveElement target="${tg.id}" color="${tg.color}">${tg.label}</InteractiveElement>`;
                return (
                  <div
                    key={tg.id}
                    className={`p-2.5 rounded-xl border transition-all bg-carbon/5 ${
                      tg.target ? 'border-canela/30 shadow-2xs' : 'border-carbon/10 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={tg.target}
                          onChange={() => handleToggleTarget(tg.id, tg.kind, tg.target)}
                          className="rounded text-canela border-carbon/20 focus:ring-canela cursor-pointer"
                          title={t('editor.diagramModals.allowInteractiveReference')}
                        />
                        <span className="font-mono font-bold text-xs text-canela">{tg.id}</span>
                        <span className="text-carbon/80 truncate font-bold">({tg.label})</span>
                        <span className="text-[10px] font-mono text-carbon/40 bg-carbon/5 px-1.5 py-0.5 rounded">
                          {objectTypeLabel(t, tg.type)}
                        </span>
                      </div>
                      <Button size="sm" variant="primary" onClick={() => copyToClipboard(snippet, tg.id)}>
                        {copiedTargetId === tg.id ? t('editor.diagramModals.copied') : t('editor.diagramModals.copyElement')}
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2 mt-1 pt-1 border-t border-carbon/5">
                      <span className="text-[10px] font-bold text-carbon/60 shrink-0">{t('editor.diagramModals.groupIds')}</span>
                      <input
                        type="text"
                        key={`${tg.id}-${tg.groupIds.join(',')}`}
                        value={tg.groupIds.join(', ')}
                        onChange={e => handleUpdateGroupIds(tg.id, tg.kind, e.target.value)}
                        placeholder={t('editor.diagramModals.groupIdsPlaceholder')}
                        className={`${controlClassName} flex-1 font-mono`}
                      />
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
      </div>
    </Modal>
  );
};
