import React from 'react';
import type { InspectorSection, InspectorSelectionSummary } from './inspectorUtils';

interface InspectorHeaderProps {
  selectionSummary: InspectorSelectionSummary | null;
  selectedIds: readonly string[];
  hasSelection: boolean;
  selectedStep: boolean;
  activeInspectorSection: InspectorSection;
  inspectorSection: InspectorSection;
  onSectionChange: (section: InspectorSection) => void;
  onCopySelection?: () => void;
}

export const InspectorHeader: React.FC<InspectorHeaderProps> = ({
  selectionSummary,
  selectedIds,
  hasSelection,
  selectedStep,
  activeInspectorSection,
  inspectorSection,
  onSectionChange,
  onCopySelection,
}) => (
  <>
    <header className="sticky top-0 z-20 mb-3 border-b border-carbon/10 bg-lienzo py-3">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Propiedades</h4>
      {selectionSummary && <div className="mt-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-carbon">{selectionSummary.label}</p><p className="truncate text-[10px] text-carbon/50">{selectionSummary.type} · <code>{selectionSummary.id}</code>{selectedIds.length > 1 ? ` · ${selectedIds.length} seleccionados` : ''}</p></div>
          {selectedIds.length > 1 && <button type="button" className="min-h-9 rounded bg-carbon px-2 text-[10px] font-bold text-lienzo" onClick={onCopySelection}>Copiar {selectedIds.length}</button>}
        </div>
      </div>}
    </header>

    {hasSelection && <nav className="sticky top-[4.6rem] z-10 mb-3 flex gap-1 overflow-x-auto border-b border-carbon/10 bg-lienzo pb-2" aria-label="Secciones de propiedades">
      {([
        ['general', 'Esencial'],
        ...(!selectedStep ? [['geometry', 'Geometría']] : []),
        ...(!selectedStep ? [['appearance', 'Estilo']] : []),
        ...(!selectedStep ? [['advanced', 'Interacción']] : []),
      ] as Array<[typeof inspectorSection, string]>).map(([id, label]) => <button key={id} type="button" aria-current={activeInspectorSection === id ? 'page' : undefined} onClick={() => onSectionChange(id)} className={`min-h-9 whitespace-nowrap rounded px-2 text-[10px] font-bold ${activeInspectorSection === id ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}>{label}</button>)}
    </nav>}

    {!hasSelection && (
      <div className="rounded border border-dashed border-carbon/20 bg-carbon/[0.02] p-4 text-center">
        <p className="text-sm font-bold text-carbon/70">Seleccione un objeto</p>
        <p className="mt-1 text-xs leading-relaxed text-carbon/50">Puede hacerlo en el lienzo o en el árbol de escena. Aquí aparecerán únicamente las propiedades compatibles con su tipo.</p>
      </div>
    )}
  </>
);
