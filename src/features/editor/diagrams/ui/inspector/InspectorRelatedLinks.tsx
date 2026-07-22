import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import { constraintPresentation } from '../../model/constraintOptions';
import { sceneItemLabel } from './inspectorUtils';
import type { InspectorSection } from './inspectorUtils';

interface InspectorRelatedLinksProps {
  model: VisualDiagramModel;
  activeSection: InspectorSection;
  relatedConstraints: NonNullable<VisualDiagramModel['constraints']>;
  relatedDependencies: NonNullable<VisualDiagramModel['dependencies']>;
}

export const InspectorRelatedLinks: React.FC<InspectorRelatedLinksProps> = ({
  model,
  activeSection: activeInspectorSection,
  relatedConstraints,
  relatedDependencies,
}) => {
  if (activeInspectorSection !== 'advanced' || (relatedConstraints.length === 0 && relatedDependencies.length === 0)) {
    return null;
  }

  return (
    <details className="mt-4 border-t border-carbon/10 pt-3">
      <summary className="cursor-pointer list-none text-[10px] font-bold uppercase tracking-widest text-carbon/45 [&::-webkit-details-marker]:hidden">
        Enlaces de construcción <span className="float-right font-mono font-normal">{relatedConstraints.length + relatedDependencies.length} enlaces ▾</span>
      </summary>
      <div className="mt-2 border-l-2 border-carbon/10 pl-3">
        <p className="text-[10px] leading-relaxed text-carbon/55">Solo se muestran las relaciones que afectan al objeto seleccionado. Las dependencias se actualizan al cambiar sus referencias.</p>
        {relatedConstraints.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {relatedConstraints.map(constraint => (
              <li key={constraint.id} className="py-1 text-[10px] text-carbon/65">
                <strong>{constraintPresentation(constraint.kind).label}</strong>: {constraint.refs.map(ref => sceneItemLabel(model, ref)).join(' → ')}
                {!constraint.enabled && <span className="ml-1 text-carbon/40">(pausada)</span>}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[9px] text-carbon/40">{relatedDependencies.length} dependencias automáticas relacionadas.</p>
      </div>
    </details>
  );
};
