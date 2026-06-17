import React from 'react';
import { db } from '../../store/content';
import modelRegistry from '../../store/model_badges_registry.json';

interface ModelBadgeProps {
  modelId: string;
}

export const ModelBadge: React.FC<ModelBadgeProps> = ({ modelId }) => {
  const model = db.getModel(modelId);
  
  if (!model) return null;

  // Diseño Arts and Crafts (clásico, enciclopedia, sello de papel)
  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1 bg-lienzo border border-carbon/20 shadow-sm transition-all hover:bg-carbon/5 hover:border-carbon/40 cursor-default"
      title={model.description}
      style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.05)' }} // Sutil sombra dura clásica
    >
      <span className="text-terracota font-serif leading-none mt-1">☙</span>
      <span className="text-[11px] font-serif uppercase tracking-widest text-carbon/90" style={{ fontVariant: 'small-caps' }}>
        Modelo: <span className="font-bold">{model.title}</span>
      </span>
    </div>
  );
};

interface ModelBadgeListProps {
  nodeId: string;
  className?: string;
}

export const ModelBadgeList: React.FC<ModelBadgeListProps> = ({ nodeId, className = '' }) => {
  const registry = modelRegistry as Record<string, string[]>;
  const models = registry[nodeId] || [];

  if (models.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {models.map(modelId => (
        <ModelBadge key={modelId} modelId={modelId} />
      ))}
    </div>
  );
};
