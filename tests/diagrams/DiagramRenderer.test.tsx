import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import v2Fixture from '../fixtures/diagrams/diagram-spec-v2.json';
import { migrateDiagramSpec } from '@/diagrams/public';
import { toWorkingSceneV2 } from '@/diagrams/model/schema/v3Compatibility';
import { MathProvider } from '@/lib/page-context/MathStoreContext';

vi.mock('@/diagrams/jsxgraph/MathBoard', () => ({
  MathBoard: ({ children }: { children?: React.ReactNode }) => <div data-testid="math-board">{children}</div>,
}));

import { DiagramRenderer } from '@/diagrams/render/DiagramRenderer';
import { Pitagoras, PitagorasSpec } from '../../content/diagrams/Teoremas/Pitagoras';

describe('DiagramRenderer shared runtime', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders a pure V3 spec without the test harness projecting to V2 first', () => {
    const v3 = migrateDiagramSpec(v2Fixture).spec;
    expect(v3.version).toBe(3);
    expect(Object.prototype.propertyIsEnumerable.call(v3, 'points')).toBe(false);
    expect(() => render(
      <MathProvider>
        <DiagramRenderer spec={v3} mode="preview" viewportControls={false} />
      </MathProvider>,
    )).not.toThrow();
    expect(screen.getByTestId('math-board')).toBeTruthy();
    expect(document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v3"]')).toBeTruthy();
  });

  it('exposes the versioned renderer path and shared viewport controls', () => {
    const onViewportChange = vi.fn();
    render(
      <MathProvider>
        <DiagramRenderer spec={migrateDiagramSpec(v2Fixture).spec} mode="preview" onViewportChange={onViewportChange} />
      </MathProvider>,
    );
    expect(screen.getByTestId('math-board')).toBeTruthy();
    const renderer = document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v3"]');
    expect(renderer).toBeTruthy();
    expect(renderer?.className).toContain('rounded-[20px]');
    const board = renderer?.querySelector('[data-testid="math-board"]');
    expect(board).toBeTruthy();
    expect(board?.querySelector('[data-diagram-header]')).toBeTruthy();
    expect(renderer?.querySelector('[data-diagram-toolbar] [aria-label="Controles del viewport"]')).toBeTruthy();
    expect(board?.querySelector('[aria-label="Controles del viewport"]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Acercar' }));
    expect(renderer?.getAttribute('data-diagram-viewport-bounds')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Ajustar automáticamente al contenido visible en todos los pasos' }));
    expect(onViewportChange).not.toHaveBeenCalled();
  });

  it('opens the real Pitágoras editor preview without requiring an outer MathProvider', () => {
    expect(() => render(
      <Pitagoras />,
    )).not.toThrow();
    expect(screen.getByTestId('math-board')).toBeTruthy();
    expect([...document.querySelectorAll('[data-interactive-label]')].map(node => node.textContent)).toEqual(['A', 'B']);
    expect(screen.getByText(/Mugitu|Arrastre/).className).not.toContain('text-terracota');
  });

  it('uses each movable element color for its reference in the diagram header', () => {
    const movableColors: ReadonlyMap<string, 'canela' | 'pavo'> = new Map([
      ['A', 'canela'],
      ['B', 'pavo'],
    ]);
    const pitagoras = toWorkingSceneV2(PitagorasSpec);
    const spec = {
      ...pitagoras,
      points: pitagoras.points.map(point => {
        const color = movableColors.get(point.id);
        return color ? { ...point, color } : point;
      }),
    };

    render(<DiagramRenderer spec={spec} viewportControls={false} />);

    const labels = [...document.querySelectorAll<HTMLElement>('[data-interactive-label]')];
    expect(labels.map(label => [label.textContent, label.dataset.interactiveColor])).toEqual([
      ['A', 'canela'],
      ['B', 'pavo'],
    ]);
    expect(labels.map(label => label.style.color)).toEqual([
      'var(--theme-canela)',
      'var(--theme-pavo)',
    ]);
  });

  it('starts a published multi-step diagram at step 1 and only advances through its scoped navigator', () => {
    const baseSpec = migrateDiagramSpec(v2Fixture).spec;
    const spec = {
      ...baseSpec,
      steps: [
        { id: 'step1', label: 'Paso 1', description: 'Figura base', visibleTargets: ['pA'] },
        { id: 'step2', label: 'Paso 2', description: 'Figura avanzada', visibleTargets: ['pA', 'pB'] },
      ],
    };
    render(<DiagramRenderer spec={spec} stepControls />);
    const renderer = document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v3"]');
    expect(renderer?.getAttribute('data-diagram-active-step')).toBe('step1');
    expect(screen.queryByLabelText('Lecturas dinámicas del diagrama')).toBeNull();
    const initialBounds = renderer?.getAttribute('data-diagram-viewport-bounds');

    const nextBtn = screen.getByRole('button', { name: 'Paso siguiente' });
    fireEvent.click(nextBtn);
    expect(renderer?.getAttribute('data-diagram-active-step')).toBe('step2');
    expect(renderer?.getAttribute('data-diagram-viewport-bounds')).toBe(initialBounds);
  });

  it('provides accessible, consistently sized viewport and fit buttons with centered icons', () => {
    render(<DiagramRenderer spec={migrateDiagramSpec(v2Fixture).spec} />);
    const fitButton = screen.getByRole('button', { name: 'Ajustar automáticamente al contenido visible en todos los pasos' });
    expect(fitButton).toBeTruthy();
    expect(fitButton.textContent).toContain('⌖');
    expect(fitButton.className).toContain('h-11');
    expect(fitButton.className).toContain('items-center');
    expect(fitButton.className).toContain('justify-center');

    const zoomIn = screen.getByRole('button', { name: 'Acercar' });
    const zoomOut = screen.getByRole('button', { name: 'Alejar' });
    expect(zoomIn.className).toContain('size-11');
    expect(zoomOut.className).toContain('size-11');
  });
});
