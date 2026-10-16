import { objectKind } from '@/diagrams';
import { modelElements, modelPoints, modelSliders } from '../../model/scene/objectLists';
import React, { useState } from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider } from '../../model/types';
import { DiagramReferencesPanel } from '../DiagramReferencesPanel';
import { useI18n } from '@/i18n';
import { objectTypeLabel } from '@/fixed-pages/editor/diagrams/ui/diagramLabels';

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
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-xs p-4 font-serif">
      <div role="dialog" aria-modal="true" className="w-full max-w-3xl bg-lienzo rounded-2xl border border-carbon/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200 text-carbon">
        <div className="flex items-center justify-between p-4 border-b border-carbon/10 bg-carbon/5">
          <div>
            <h2 className="font-bold text-base text-carbon">{t('editor.diagramModals.mdxLinksAndReferences')}</h2>
            <p className="text-xs text-mora/70 italic">
              {sandboxMode
                ? t('editor.diagramModals.sandboxSnippetsNote')
                : t('editor.diagramModals.linksIntro')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-carbon/60 hover:text-carbon p-1 rounded-lg text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs text-carbon overflow-y-auto flex-1">
          {/* Inserción de Componente Principal */}
          <div className="p-3 bg-carbon/5 border border-carbon/15 rounded-xl space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-sm text-carbon">{t('editor.diagramModals.componentLabelInMdx')}</h4>
            <div className="flex items-center justify-between bg-carbon/10 p-2 rounded-lg border border-carbon/10 font-mono text-xs">
              <code>{componentSnippet}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(componentSnippet, 'comp')}
                className="px-2.5 py-1 bg-canela text-lienzo rounded-lg text-[11px] font-bold hover:bg-canela/90 transition-all cursor-pointer shadow-2xs"
              >
                {copiedTargetId === 'comp' ? t('editor.diagramModals.copied') : t('editor.diagramModals.copyJsx')}
              </button>
            </div>
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
            <div className="space-y-2 max-h-80 overflow-y-auto p-2 bg-carbon/5 rounded-xl border border-carbon/10">
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
                      <button
                        type="button"
                        onClick={() => copyToClipboard(snippet, tg.id)}
                        className="px-2.5 py-1 bg-carbon/10 text-carbon hover:bg-canela hover:text-lienzo rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {copiedTargetId === tg.id ? t('editor.diagramModals.copied') : t('editor.diagramModals.copyElement')}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 mt-1 pt-1 border-t border-carbon/5">
                      <span className="text-[10px] font-bold text-carbon/60 shrink-0">{t('editor.diagramModals.groupIds')}</span>
                      <input
                        type="text"
                        key={`${tg.id}-${tg.groupIds.join(',')}`}
                        value={tg.groupIds.join(', ')}
                        onChange={e => handleUpdateGroupIds(tg.id, tg.kind, e.target.value)}
                        placeholder={t('editor.diagramModals.groupIdsPlaceholder')}
                        className="flex-1 bg-lienzo border border-carbon/20 rounded px-2 py-0.5 font-mono text-[10px] text-carbon"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
