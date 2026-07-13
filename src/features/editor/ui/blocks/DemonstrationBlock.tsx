import React from 'react';
import { ProofStepData } from '../../core/parser';
import type { DiagramTargetRegistry } from '../../core/editorTypes';

interface DemonstrationBlockProps {
  steps: ProofStepData[];
  diagramTargets?: DiagramTargetRegistry;
  onChange: (updatedSteps: ProofStepData[]) => void;
}

const JUSTIFICATION_TYPES: Array<{ value: NonNullable<ProofStepData['justificationType']>; label: string }> = [
  { value: 'hipotesis', label: 'Hipótesis' },
  { value: 'axioma', label: 'Axioma/Postulado' },
  { value: 'teorema', label: 'Teorema previo' },
  { value: 'definicion', label: 'Definición' },
  { value: 'paso-previo', label: 'Paso previo' },
  { value: 'regla-logica', label: 'Regla lógica' },
  { value: 'construccion', label: 'Construcción' },
];

export const DemonstrationBlock: React.FC<DemonstrationBlockProps> = ({ steps, diagramTargets = [], onChange }) => {
  const handleStepChange = (index: number, field: keyof ProofStepData, value: string | number) => {
    const updated = steps.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange(updated);
  };

  const handleAddStep = () => {
    const newStep: ProofStepData = {
      number: steps.length + 1,
      title: '',
      target: '',
      body: '',
      justificacion: '',
      justificationType: 'paso-previo',
      dependencyId: ''
    };
    onChange([...steps, newStep]);
  };

  const handleDuplicateStep = (index: number) => {
    const duplicated = {
      ...steps[index],
      number: index + 2,
      title: `${steps[index].title || 'Paso'} (copia)`
    };
    const updated = [...steps];
    updated.splice(index + 1, 0, duplicated);
    onChange(updated.map((s, i) => ({ ...s, number: i + 1 })));
  };

  const handleRemoveStep = (index: number) => {
    const updated = steps
      .filter((_, i) => i !== index)
      // Re-numerar los pasos de forma secuencial
      .map((s, i) => ({ ...s, number: i + 1 }));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-carbon/10 pb-1.5">
        <div>
          <label className="block text-[9px] font-bold text-carbon/40 uppercase tracking-widest">
            Editor de demostración
          </label>
          <p className="mt-1 text-[10px] italic text-carbon/45">Cada paso debe decir qué prueba, por qué es válido y qué elemento visual acompaña la lectura.</p>
        </div>
        <button
          type="button"
          onClick={handleAddStep}
          className="text-[10px] bg-terracota text-lienzo px-3 py-1 rounded shadow-sm hover:bg-terracota/80 transition-all font-bold"
        >
          + Añadir Paso Lógico
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="p-6 bg-terracota/5 border border-dashed border-terracota/20 rounded text-center">
          <p className="text-xs italic text-terracota/60">No hay pasos lógicos en esta demostración. Haz clic arriba para añadir uno.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, index) => {
            const hasNoJustification = !step.justificacion.trim();
            const hasNoInteractiveBody = !step.body?.includes('<InteractiveElement') && !step.body?.includes('highlightTarget=');
            return (
              <div 
                key={index} 
                className={`p-4 bg-lienzo border rounded shadow-sm flex flex-col gap-3 relative transition-all duration-200 ${
                  hasNoJustification 
                    ? 'border-granada/30 bg-granada/5 shadow-inner' 
                    : 'border-carbon/15 hover:border-carbon/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-carbon/50 font-mono">
                    Paso {step.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDuplicateStep(index)}
                      className="text-[10px] text-carbon/45 hover:text-carbon"
                      title="Duplicar paso"
                    >
                      Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-[10px] text-carbon/40 hover:text-terracota"
                      title="Eliminar Paso"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-wider mb-1">Objetivo del paso</label>
                    <input
                      type="text"
                      className="w-full bg-carbon/5 border border-carbon/15 text-carbon p-1.5 rounded text-xs focus:outline-none focus:border-terracota"
                      placeholder="Ej: Los triángulos son congruentes"
                      value={step.title}
                      onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-wider mb-1">Target del diagrama</label>
                    <select
                      className="w-full bg-carbon/5 border border-carbon/15 text-carbon p-1.5 rounded text-xs focus:outline-none focus:border-terracota"
                      value={step.target || ''}
                      onChange={(e) => handleStepChange(index, 'target', e.target.value)}
                    >
                      <option value="">Sin target</option>
                      {diagramTargets.map(target => (
                        <option key={target.id} value={target.id}>{target.id} · {target.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-wider mb-1">Tipo de justificación</label>
                    <select
                      className="w-full bg-carbon/5 border border-carbon/15 text-carbon p-1.5 rounded text-xs focus:outline-none focus:border-terracota"
                      value={step.justificationType || 'paso-previo'}
                      onChange={(e) => handleStepChange(index, 'justificationType', e.target.value)}
                    >
                      {JUSTIFICATION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-wider mb-1">Dependencia enlazada</label>
                    <input
                      type="text"
                      className="w-full bg-carbon/5 border border-carbon/15 text-carbon p-1.5 rounded text-xs focus:outline-none focus:border-terracota font-mono"
                      placeholder="id-kebab-case"
                      value={step.dependencyId || ''}
                      onChange={(e) => handleStepChange(index, 'dependencyId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-wider mb-1 flex justify-between">
                      <span>Justificación</span>
                      {hasNoJustification && (
                        <span className="text-[7px] text-granada font-bold uppercase animate-pulse">Obligatoria</span>
                      )}
                    </label>
                    <input
                      type="text"
                      className={`w-full p-1.5 rounded text-xs focus:outline-none ${
                        hasNoJustification
                          ? 'bg-granada/5 border border-granada/30 focus:border-granada'
                          : 'bg-carbon/5 border border-carbon/15 text-carbon focus:border-terracota'
                      }`}
                      placeholder="Ej: Definición de mediatriz"
                      value={step.justificacion}
                      onChange={(e) => handleStepChange(index, 'justificacion', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-wider mb-1">Cuerpo visible del paso</label>
                  <textarea
                    className="min-h-20 w-full rounded border border-carbon/15 bg-carbon/5 p-2 text-xs leading-relaxed text-carbon focus:outline-none focus:border-terracota"
                    placeholder="Escriba el argumento del paso. Use el enlazador para ConceptLink e InteractiveElement."
                    value={step.body || ''}
                    onChange={(e) => handleStepChange(index, 'body', e.target.value)}
                  />
                  {hasNoInteractiveBody && (
                    <p className="mt-1 text-[10px] italic text-ocre">Aviso: este paso no enlaza ningún InteractiveElement o highlightTarget.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
