import { describe, expect, it } from 'vitest';
import {
  getKnowledgeGraphGroupPresentation,
  getKnowledgeGraphLegendTypes,
} from '@/features/graph/lib/graphUtils';
import { CONTENT_TYPE_CONFIG } from '@/shared/lib/constants';

describe('knowledge graph presentation', () => {
  it('builds the legend only from node groups that are present', () => {
    expect(getKnowledgeGraphLegendTypes([
      'central',
      'branch',
      'axioma',
      'definition',
      'teorema',
      'mathematician',
    ])).toEqual([
      'teorema',
      'axioma',
      'definicion',
      'matematico',
    ]);
  });

  it('normalizes English graph groups for shared search results', () => {
    expect(getKnowledgeGraphGroupPresentation('definition').label).toBe('Definición');
    expect(getKnowledgeGraphGroupPresentation('mathematician').label).toBe('Matemático');
    expect(getKnowledgeGraphGroupPresentation('branch').label).toBe('Rama');
  });

  it('assigns a distinct palette role to every visible legend type', () => {
    const types = getKnowledgeGraphLegendTypes([
      'axioma',
      'definition',
      'teorema',
      'lema',
      'corolario',
      'modelo',
      'mathematician',
    ]);
    const colors = types.map(type => CONTENT_TYPE_CONFIG[type].graphColor);

    expect(new Set(colors).size).toBe(colors.length);
    expect(CONTENT_TYPE_CONFIG.definicion.graphColor).toBe('var(--theme-musgo)');
    expect(CONTENT_TYPE_CONFIG.corolario.graphColor).toBe('var(--theme-salvia)');
    expect(CONTENT_TYPE_CONFIG.lema.graphColor).toBe('var(--theme-granada)');
    expect(CONTENT_TYPE_CONFIG.matematico.graphColor).toBe('var(--theme-pizarra)');
  });
});
