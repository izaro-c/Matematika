import React, { useState } from 'react';
import type { ConstructionKind, ConstructionRefKey, VisualDiagramModel } from '../../diagrams/model/types';
import { CONSTRUCTION_OPTIONS } from '../../diagrams/model';
import { applyGuidedConstruction, validConstructionRefs } from '../../diagrams/model/guidedConstructions';
import { IconClose, IconSparkles } from './V2Icons';

interface V2GuidedConstructionsModalProps {
  isOpen: boolean;
  model: VisualDiagramModel | null;
  onClose: () => void;
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
}

export const V2GuidedConstructionsModal: React.FC<V2GuidedConstructionsModalProps> = ({
  isOpen,
  model,
  onClose,
  onUpdateModel,
}) => {
  const [kind, setKind] = useState<ConstructionKind>('mediatriz');
  const [refs, setRefs] = useState<Record<ConstructionRefKey, string>>({
    a: '',
    b: '',
    c: '',
  });
  const [error, setError] = useState('');

  if (!isOpen || !model) return null;

  const selectedOption = CONSTRUCTION_OPTIONS.find(o => o.value === kind) || CONSTRUCTION_OPTIONS[0];

  const handleKindChange = (newKind: ConstructionKind) => {
    setKind(newKind);
    setRefs({ a: '', b: '', c: '' });
    setError('');
  };

  const isReady = validConstructionRefs(kind, refs);

  const handleCreate = () => {
    if (!validConstructionRefs(kind, refs)) {
      setError('Elige puntos distintos para cada ranura.');
      return;
    }
    const { model: nextModel } = applyGuidedConstruction(model, kind, refs);
    onUpdateModel(nextModel, `Construcción guiada: ${selectedOption.label}`);
    onClose();
  };

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/60 backdrop-blur-xs p-4 font-serif">
      <div role="dialog" aria-modal="true" className="w-full max-w-md bg-lienzo rounded-2xl border border-carbon/20 shadow-2xl p-4 space-y-4 animate-in fade-in zoom-in duration-150 text-carbon">
        <div className="flex items-center justify-between border-b border-carbon/10 pb-2">
          <div className="flex items-center space-x-2 text-salvia font-bold text-sm">
            <IconSparkles className="w-4 h-4" />
            <h3>Construcciones Guiadas</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-carbon/40 hover:text-carbon p-1 rounded-lg transition-colors cursor-pointer"
          >
            <IconClose />
          </button>
        </div>

        <p className="text-xs text-carbon/70 leading-relaxed">
          Genera automáticamente los puntos auxiliares, arcos, mediatrices o bisectrices necesarios conservándolos como objetos totalmente editables.
        </p>

        <div>
          <label className="block text-xs font-bold text-carbon/80 mb-1">
            Tipo de Construcción:
          </label>
          <select
            value={kind}
            onChange={e => handleKindChange(e.target.value as ConstructionKind)}
            className="w-full bg-carbon/5 border border-carbon/20 rounded-xl p-2 text-xs text-carbon focus:ring-1 focus:ring-salvia"
          >
            {CONSTRUCTION_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-salvia/10 rounded-xl border border-salvia/20 text-xs text-salvia font-medium">
          {selectedOption.description}
        </div>

        <div className="space-y-2.5">
          {selectedOption.slots.map((slot, index) => (
            <div key={slot.key}>
              <label className="block text-xs font-bold text-carbon/80 mb-1">
                {index + 1}. {slot.label}:
              </label>
              <select
                value={refs[slot.key] || ''}
                onChange={e => setRefs(prev => ({ ...prev, [slot.key]: e.target.value }))}
                className="w-full bg-carbon/5 border border-carbon/20 rounded-lg p-2 text-xs text-carbon"
              >
                <option value="">Seleccione un punto del diagrama...</option>
                {model.points.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.label || p.id} ({p.id})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-carbon/10">
          {error && <p className="text-[11px] font-medium text-granada">{error}</p>}
          <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-carbon/20 text-xs font-bold text-carbon/70 hover:bg-carbon/5 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!isReady}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-salvia text-lienzo text-xs font-bold shadow-xs hover:bg-salvia/90 disabled:opacity-40 transition-all cursor-pointer"
          >
            <IconSparkles />
            <span>Crear {selectedOption.label}</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};
