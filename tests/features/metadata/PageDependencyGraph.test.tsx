import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const graphProps = vi.hoisted(() => ({ current: {} as Record<string, unknown> }));

vi.mock('react-force-graph-2d', () => ({
  default: (props: Record<string, unknown>) => {
    graphProps.current = props;
    return <div data-testid="force-graph" />;
  },
}));

vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()],
}));

vi.mock('@/entities/content', () => ({
  db: {
    getTheorem: vi.fn(),
    getDefinition: vi.fn(),
    getMathematicianById: vi.fn(),
    axioms: new Map(),
    models: new Map(),
    demos: new Map(),
  },
}));

vi.mock('@/features/glossary/GlossaryStore', () => ({ dictionary: {} }));

vi.mock('@/shared/hooks/useThemeColors', () => ({
  useThemeColors: () => ({
    lienzo: '#F8F6F1',
    carbon: '#333333',
    getHex: () => '#A94E35',
  }),
}));

import { PageDependencyGraph } from '@/features/metadata/ui/PageDependencyGraph';

describe('PageDependencyGraph', () => {
  beforeEach(() => {
    graphProps.current = {};
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300);
  });

  it('dibuja arista y flecha con el mismo contraste y separa la punta del nodo destino', () => {
    render(
      <PageDependencyGraph
        currentId="teorema-central"
        currentTitle="Teorema central"
        currentType="teorema"
        corollaries={[{ id: 'corolario-local', title: 'Corolario local' }]}
      />,
    );

    expect(screen.getByTestId('force-graph')).toBeTruthy();
    const edgeColor = (graphProps.current.linkColor as () => string)();
    const arrowColor = (graphProps.current.linkDirectionalArrowColor as () => string)();

    expect(edgeColor).toBe('#3333338C');
    expect(arrowColor).toBe(edgeColor);
    expect(graphProps.current.linkWidth).toBe(1.25);
    expect(graphProps.current.linkDirectionalArrowLength).toBe(5);
    expect(graphProps.current.linkDirectionalArrowRelPos).toBeCloseTo(0.82);
  });
});
