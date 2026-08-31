import { describe, expect, it } from 'vitest';
import {
  getKnowledgeGraphGroupPresentation,
  getKnowledgeGraphLegendTypes,
} from '@/fixed-pages/graph/lib/graphUtils';
import { CONTENT_TYPE_CONFIG } from '@/lib/theme/constants';

describe('knowledge graph presentation', () => {
  it('builds the legend only from node groups that are present in deductive order', () => {
    expect(getKnowledgeGraphLegendTypes([
      'central',
      'branch',
      'axioma',
      'definition',
      'teorema',
      'mathematician',
    ])).toEqual([
      'axioma',
      'definicion',
      'teorema',
      'matematico',
    ]);
  });

  it('normalizes English graph groups for shared search results', () => {
    expect(getKnowledgeGraphGroupPresentation('definition').label).toBe('Definición');
    expect(getKnowledgeGraphGroupPresentation('mathematician').label).toBe('Matemático');
    expect(getKnowledgeGraphGroupPresentation('branch').label).toBe('Rama');
  });

  it('assigns a distinct palette role to every visible legend type without repetition', () => {
    const types = getKnowledgeGraphLegendTypes([
      'axioma',
      'sistema-axiomatico',
      'definition',
      'teorema',
      'metodo',
      'caso-de-uso',
      'modelo',
      'mathematician',
    ]);
    const colors = types.map(type => CONTENT_TYPE_CONFIG[type].graphColor);

    expect(new Set(colors).size).toBe(colors.length);
    expect(CONTENT_TYPE_CONFIG.axioma.graphColor).toBe('var(--theme-ocre)');
    expect(CONTENT_TYPE_CONFIG['sistema-axiomatico'].graphColor).toBe('var(--theme-carbon)');
    expect(CONTENT_TYPE_CONFIG.definicion.graphColor).toBe('var(--theme-musgo)');
    expect(CONTENT_TYPE_CONFIG.teorema.graphColor).toBe('var(--theme-terracota)');
    expect(CONTENT_TYPE_CONFIG.metodo.graphColor).toBe('var(--theme-granada)');
    expect(CONTENT_TYPE_CONFIG['caso-de-uso'].graphColor).toBe('var(--theme-canela)');
    expect(CONTENT_TYPE_CONFIG.modelo.graphColor).toBe('var(--theme-pavo)');
    expect(CONTENT_TYPE_CONFIG.matematico.graphColor).toBe('var(--theme-mora)');
  });

  it('includes metodo and caso-de-uso in legend when present in deductive order', () => {
    const types = getKnowledgeGraphLegendTypes([
      'teorema',
      'metodo',
      'caso-de-uso',
      'sistema-axiomatico',
    ]);
    expect(types).toEqual([
      'sistema-axiomatico',
      'teorema',
      'metodo',
      'caso-de-uso',
    ]);
  });
});

import { buildKnowledgeGraphData } from '@/fixed-pages/graph/lib/knowledgeGraphBuilder';

describe('buildKnowledgeGraphData', () => {
  it('generates a connected graph with central node, branches, theorems, methods and use cases', () => {
    const graph = buildKnowledgeGraphData('es');

    expect(graph.nodes.length).toBeGreaterThan(50);
    expect(graph.links.length).toBeGreaterThan(50);

    const centralNode = graph.nodes.find(n => n.id === 'matematicas');
    expect(centralNode).toBeDefined();
    expect(centralNode?.group).toBe('central');

    // Check that branches and subbranches are generated
    const branchNodes = graph.nodes.filter(n => n.group === 'branch');
    expect(branchNodes.length).toBeGreaterThan(5);

    const hasSubBranches = branchNodes.some(n => n.id.startsWith('subrama-'));
    expect(hasSubBranches).toBe(true);

    const hasRootBranches = branchNodes.some(n => n.id.startsWith('rama-'));
    expect(hasRootBranches).toBe(true);

    // Check that methods and usecases are included in nodes
    const methodNodes = graph.nodes.filter(n => n.group === 'metodo');
    expect(methodNodes.length).toBeGreaterThan(0);

    const useCaseNodes = graph.nodes.filter(n => n.group === 'caso-de-uso');
    expect(useCaseNodes.length).toBeGreaterThan(0);

    // Verify all links connect existing nodes without broken references
    const nodeIds = new Set(graph.nodes.map(n => n.id));
    for (const link of graph.links) {
      const source = typeof link.source === 'object' ? link.source.id : link.source;
      const target = typeof link.target === 'object' ? link.target.id : link.target;
      expect(nodeIds.has(source)).toBe(true);
      expect(nodeIds.has(target)).toBe(true);
      expect(source).not.toBe(target);
    }
  });

  it('connects Euclidean / Absolute geometry items to their MSC subbranches', () => {
    const graph = buildKnowledgeGraphData('es');
    const pitagoras = graph.nodes.find(n => n.id === 'teorema-pitagoras');
    expect(pitagoras).toBeDefined();

    const pitagorasLinks = graph.links.filter(
      l => l.source === 'teorema-pitagoras' || l.target === 'teorema-pitagoras'
    );
    expect(pitagorasLinks.length).toBeGreaterThan(0);
  });
});
