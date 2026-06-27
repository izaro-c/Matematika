import React from 'react';

import { db } from '@/entities/content';
import { appPath } from '@/shared/lib/routeHelper';
import modelRegistry from '@/entities/content/model_badges_registry.json';

interface ModelBadgeProps {
  modelId: string;
}

export const ModelBadge: React.FC<ModelBadgeProps> = ({ modelId }) => {
  const model = db.getModel(modelId);

  if (!model) return null;

  return (
    <a
      href={appPath(`/modelo/${model.id}`)}
      className="ac-pill"
      title={model.description || `Modelo: ${model.title}`}
      style={{ ['--pill-accent' as string]: 'var(--theme-pavo)', textDecoration: 'none' }}
    >
      <span className="ac-pill-ornament" aria-hidden style={{ color: 'var(--theme-terracota)' }}>☙</span>
      <span className="ac-pill-serif">Modelo: <strong>{model.title}</strong></span>
    </a>
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
