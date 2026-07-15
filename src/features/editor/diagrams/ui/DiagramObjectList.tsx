import React from 'react';
import type { VisualDiagramModel } from '../model/types';
import { KIND_LABELS } from '../model/commands';

interface DiagramObjectListProps {
  model: VisualDiagramModel;
  selectedId: string;
  onSelect: (id: string) => void;
}

function objectStatus(visible: boolean, locked: boolean): string {
  if (!visible) return 'Oculto';
  if (locked) return 'Fijo';
  return '';
}

export const DiagramObjectList: React.FC<DiagramObjectListProps> = ({ model, selectedId, onSelect }) => {
  const items = [
    ...model.points.map(item => ({ item, kind: 'Punto' })),
    ...model.elements.map(item => ({ item, kind: KIND_LABELS[item.kind] })),
    ...model.sliders.map(item => ({ item, kind: 'Control' })),
  ];

  return (
    <section className="rounded border border-carbon/10 bg-lienzo p-3">
      <div className="mb-2 flex items-center justify-between border-b border-carbon/10 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Objetos</p>
        <span className="font-mono text-[9px] text-carbon/40">{items.length}</span>
      </div>
      <p className="mb-2 text-[10px] leading-relaxed text-carbon/50">Esta lista siempre permite recuperar y editar un objeto, aunque esté oculto o no admita selección directa.</p>
      <div className="max-h-64 space-y-1 overflow-y-auto pr-1" role="list" aria-label="Objetos del diagrama">
        {items.map(({ item, kind }) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            aria-current={selectedId === item.id ? 'true' : undefined}
            onClick={() => onSelect(item.id)}
            className={`flex w-full items-center justify-between gap-2 rounded border px-2 py-1.5 text-left ${selectedId === item.id ? 'border-carbon bg-carbon text-lienzo' : 'border-carbon/10 text-carbon hover:bg-carbon/5'}`}
          >
            <span className="min-w-0"><span className="block truncate text-xs font-bold">{item.label}</span><span className={`block truncate text-[9px] ${selectedId === item.id ? 'text-lienzo/65' : 'text-carbon/40'}`}>{kind} · {item.id}</span></span>
            <span className={`shrink-0 text-[9px] ${selectedId === item.id ? 'text-lienzo/65' : 'text-carbon/40'}`}>{objectStatus(item.visible, item.locked)}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default DiagramObjectList;
