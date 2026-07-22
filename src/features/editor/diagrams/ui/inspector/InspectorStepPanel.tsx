import React from 'react';
import type { VisualStep } from '../../model/types';
import type { InspectorHandlers } from './useInspectorHandlers';

interface InspectorStepPanelProps {
  step: VisualStep;
  handlers: Pick<InspectorHandlers, 'handleStepChange'>;
}

export const InspectorStepPanel: React.FC<InspectorStepPanelProps> = ({
  step: selectedStep,
  handlers: { handleStepChange },
}) => (
  <div className="space-y-3">
    <div>
      <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
      <input
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
        value={selectedStep.label}
        onChange={(e) => handleStepChange({ label: e.target.value })}
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-carbon mb-1">Descripción</label>
      <textarea
        className="w-full h-16 rounded border border-carbon/15 bg-lienzo p-1.5 text-xs resize-none"
        value={selectedStep.description}
        onChange={(e) => handleStepChange({ description: e.target.value })}
      />
    </div>
  </div>
);
