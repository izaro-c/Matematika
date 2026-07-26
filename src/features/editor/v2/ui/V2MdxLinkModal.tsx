import React, { useState } from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider } from '../../diagrams/model/types';
import { DiagramReferencesPanel } from '../../diagrams/ui/DiagramReferencesPanel';

interface V2MdxLinkModalProps {
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

export const V2MdxLinkModal: React.FC<V2MdxLinkModalProps> = ({
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
  const [copiedTargetId, setCopiedTargetId] = useState<string | null>(null);

  if (!isOpen || !model) return null;

  const targets = [
    ...model.points.map(p => ({
      id: p.id,
      label: p.label || p.id,
      type: 'Punto',
      color: p.color || 'salvia',
      target: p.target !== false,
      groupIds: p.groupIds || [],
      kind: 'point' as const,
    })),
    ...model.elements.map(e => ({
      id: e.id,
      label: e.label || e.id,
      type: e.kind,
      color: e.color || 'salvia',
      target: e.target !== false,
      groupIds: e.groupIds || [],
      kind: 'element' as const,
    })),
    ...model.sliders.map(s => ({
      id: s.id,
      label: s.label || s.id,
      type: 'Deslizador',
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
            <h2 className="font-bold text-base text-carbon">Gestor de Enlaces y Referencias MDX</h2>
            <p className="text-xs text-pizarra/70 italic">
              {sandboxMode
                ? 'Sandbox: solo copia snippets JSX al portapapeles; no vincula páginas MDX del corpus.'
                : 'Configura qué elementos se pueden referenciar y edita sus IDs de grupos para intercalar en lecciones.'}
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
            <h4 className="font-bold text-sm text-carbon">Etiqueta del Componente en MDX</h4>
            <div className="flex items-center justify-between bg-carbon/10 p-2 rounded-lg border border-carbon/10 font-mono text-xs">
              <code>{componentSnippet}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(componentSnippet, 'comp')}
                className="px-2.5 py-1 bg-salvia text-lienzo rounded-lg text-[11px] font-bold hover:bg-salvia/90 transition-all cursor-pointer shadow-2xs"
              >
                {copiedTargetId === 'comp' ? '¡Copiado!' : 'Copiar JSX'}
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
              Elementos Destacables en Texto (`InteractiveElement`)
            </h4>
            <p className="text-[11px] text-pizarra/70 italic mb-2">
              Edita la referenciabilidad (`target`) y los `groupIds` de cada objeto.
            </p>
            <div className="space-y-2 max-h-80 overflow-y-auto p-2 bg-carbon/5 rounded-xl border border-carbon/10">
              {targets.map(t => {
                const snippet = `<InteractiveElement target="${t.id}" color="${t.color}">${t.label}</InteractiveElement>`;
                return (
                  <div
                    key={t.id}
                    className={`p-2.5 rounded-xl border transition-all bg-carbon/5 ${
                      t.target ? 'border-salvia/30 shadow-2xs' : 'border-carbon/10 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={t.target}
                          onChange={() => handleToggleTarget(t.id, t.kind, t.target)}
                          className="rounded text-salvia border-carbon/20 focus:ring-salvia cursor-pointer"
                          title="Permitir referencia interactiva"
                        />
                        <span className="font-mono font-bold text-xs text-salvia">{t.id}</span>
                        <span className="text-carbon/80 truncate font-bold">({t.label})</span>
                        <span className="text-[10px] font-mono text-carbon/40 bg-carbon/5 px-1.5 py-0.5 rounded">
                          {t.type}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(snippet, t.id)}
                        className="px-2.5 py-1 bg-carbon/10 text-carbon hover:bg-salvia hover:text-lienzo rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {copiedTargetId === t.id ? '¡Copiado!' : 'Copiar Elemento'}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 mt-1 pt-1 border-t border-carbon/5">
                      <span className="text-[10px] font-bold text-carbon/60 shrink-0">IDs de Grupos:</span>
                      <input
                        type="text"
                        key={`${t.id}-${t.groupIds.join(',')}`}
                        value={t.groupIds.join(', ')}
                        onChange={e => handleUpdateGroupIds(t.id, t.kind, e.target.value)}
                        placeholder="Sin grupos (ej. grp1, grp2)"
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
