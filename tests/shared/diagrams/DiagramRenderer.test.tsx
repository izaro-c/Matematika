import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import v2Fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import { migrateDiagramSpec } from '../../../src/shared/diagrams/public';
import { MathProvider } from '../../../src/shared/lib/MathStoreContext';

vi.mock('../../../src/shared/diagrams/core/MathBoard', () => ({
  MathBoard: ({ children }: { children?: React.ReactNode }) => <div data-testid="math-board">{children}</div>,
}));

import { DiagramRenderer } from '../../../src/shared/diagrams/runtime/DiagramRenderer';
import { Pitagoras, PitagorasSpec } from '../../../src/widgets/diagrams/Teoremas/Pitagoras';
import { DiagramStepsEditor } from '../../../src/features/editor/diagrams/ui/DiagramStepsEditor';

describe('DiagramRenderer shared runtime', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exposes the versioned renderer path and shared viewport controls', () => {
    const onViewportChange = vi.fn();
    render(
      <MathProvider>
        <DiagramRenderer spec={migrateDiagramSpec(v2Fixture).spec} mode="preview" onViewportChange={onViewportChange} />
      </MathProvider>,
    );
    expect(screen.getByTestId('math-board')).toBeTruthy();
    const renderer = document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v2"]');
    expect(renderer).toBeTruthy();
    expect(renderer?.className).toContain('rounded-[20px]');
    const board = renderer?.querySelector('[data-testid="math-board"]');
    expect(board).toBeTruthy();
    expect(board?.querySelector('[data-diagram-header]')).toBeTruthy();
    expect(renderer?.querySelector('[data-diagram-toolbar] [aria-label="Controles del viewport"]')).toBeTruthy();
    expect(board?.querySelector('[aria-label="Controles del viewport"]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Acercar' }));
    expect(onViewportChange).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Ajustar todos los objetos al viewport' }));
    expect(onViewportChange).toHaveBeenCalledTimes(2);
  });

  it('opens the real Pitágoras editor preview without requiring an outer MathProvider', () => {
    expect(() => render(
      <Pitagoras />,
    )).not.toThrow();
    expect(screen.getByTestId('math-board')).toBeTruthy();
    expect([...document.querySelectorAll('[data-interactive-label]')].map(node => node.textContent)).toEqual(['A', 'B']);
    expect(screen.getByText(/Arrastre/).className).not.toContain('text-terracota');
  });

  it('uses each movable element color for its reference in the diagram header', () => {
    const movableColors: ReadonlyMap<string, 'salvia' | 'pavo'> = new Map([
      ['A', 'salvia'],
      ['B', 'pavo'],
    ]);
    const spec = {
      ...PitagorasSpec,
      points: PitagorasSpec.points.map(point => {
        const color = movableColors.get(point.id);
        return color ? { ...point, color } : point;
      }),
    };

    render(<DiagramRenderer spec={spec} viewportControls={false} />);

    const labels = [...document.querySelectorAll<HTMLElement>('[data-interactive-label]')];
    expect(labels.map(label => [label.textContent, label.dataset.interactiveColor])).toEqual([
      ['A', 'salvia'],
      ['B', 'pavo'],
    ]);
    expect(labels.map(label => label.style.color)).toEqual([
      'var(--theme-salvia)',
      'var(--theme-pavo)',
    ]);
  });

  it('opens a real multi-step editor without requiring an outer MathProvider', () => {
    expect(() => render(
      <DiagramStepsEditor
        model={migrateDiagramSpec(v2Fixture).spec}
        activeStepId="step1"
        onActiveStepChange={vi.fn()}
        onModelEdit={vi.fn()}
        onSelectObject={vi.fn()}
      />,
    )).not.toThrow();
    expect(screen.getByRole('navigation', { name: 'Navegación de pasos del diagrama' })).toBeTruthy();
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
    render(<DiagramRenderer spec={spec} />);
    const renderer = document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v2"]');
    expect(renderer?.getAttribute('data-diagram-active-step')).toBe('step1');
    expect(screen.queryByLabelText('Lecturas dinámicas del diagrama')).toBeNull();
    const initialBounds = renderer?.getAttribute('data-diagram-viewport-bounds');

    const nextBtn = screen.getByRole('button', { name: 'Paso siguiente' });
    fireEvent.click(nextBtn);
    expect(renderer?.getAttribute('data-diagram-active-step')).toBe('step2');
    expect(renderer?.getAttribute('data-diagram-viewport-bounds')).toBe(initialBounds);
  });
});
