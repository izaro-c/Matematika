import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import fixture from '../fixtures/diagrams/diagram-spec.json';
import type { DiagramSpec } from '@/diagrams/public';
import { MathProvider } from '@/lib/page-context/MathStoreContext';
import { DiagramFigureContext } from '@/lib/page-context/DiagramFigureContext';

vi.mock('@/diagrams/jsxgraph/MathBoard', () => ({
  MathBoard: ({ children }: { children?: React.ReactNode }) => <div data-testid="math-board">{children}</div>,
}));

import { DiagramRenderer } from '@/diagrams/render/DiagramRenderer';
import { Pitagoras, PitagorasSpec } from '../../content/diagrams/Teoremas/Pitagoras';

describe('DiagramRenderer shared runtime', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders a pure V3 spec', () => {
    const v3 = (fixture as DiagramSpec);
    expect(v3.version).toBe(3);
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
        <DiagramRenderer spec={(fixture as DiagramSpec)} mode="preview" onViewportChange={onViewportChange} />
      </MathProvider>,
    );
    expect(screen.getByTestId('math-board')).toBeTruthy();
    const renderer = document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v3"]');
    expect(renderer).toBeTruthy();
    expect(renderer?.tagName).toBe('FIGURE');
    const board = renderer?.querySelector('[data-testid="math-board"]');
    expect(board).toBeTruthy();
    // El pie de figura va debajo de la lámina, fuera del dibujo.
    expect(renderer?.querySelector('[data-diagram-caption]')?.textContent).toContain('Fig. 1');
    expect(board?.querySelector('[data-diagram-caption]')).toBeNull();
    // jsdom mide 0×0: lámina pequeña, así que las rúbricas van dentro como raíles.
    expect(renderer?.getAttribute('data-diagram-layout')).toBe('rails');
    expect(board?.querySelector('[data-diagram-toolbar-layout="rails"] [aria-label="Controles del viewport"]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Acercar' }));
    expect(renderer?.getAttribute('data-diagram-viewport-bounds')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Ajustar.*contenido/ }));
    expect(onViewportChange).not.toHaveBeenCalled();
  });

  it('keeps the rubric bar below the board on a wide plate', () => {
    const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      { x: 0, y: 0, top: 0, left: 0, right: 900, bottom: 700, width: 900, height: 700, toJSON: () => ({}) } as DOMRect,
    );
    try {
      render(
        <MathProvider>
          <DiagramRenderer spec={(fixture as DiagramSpec)} mode="preview" />
        </MathProvider>,
      );
      const renderer = document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v3"]');
      const board = renderer?.querySelector('[data-testid="math-board"]');
      expect(renderer?.getAttribute('data-diagram-layout')).toBe('bar');
      expect(renderer?.querySelector('[data-diagram-toolbar-layout="bar"] [aria-label="Controles del viewport"]')).toBeTruthy();
      expect(board?.querySelector('[data-diagram-toolbar]')).toBeNull();
    } finally {
      rect.mockRestore();
    }
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
    const spec = {
      ...PitagorasSpec,
      objects: PitagorasSpec.objects.map(object => {
        const color = object.objectType === 'point' ? movableColors.get(object.id) : undefined;
        return color ? { ...object, color } : object;
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
    const baseSpec = (fixture as DiagramSpec);
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

  it('provides accessible viewport controls as printed rubrics', () => {
    render(<DiagramRenderer spec={(fixture as DiagramSpec)} activeStepId="step1" />);
    const fitButton = screen.getByRole('button', { name: /Ajustar.*contenido/ });
    expect(fitButton.textContent).toContain('⌖');
    expect(fitButton.className).toContain('diagram-rubric');

    const zoomIn = screen.getByRole('button', { name: 'Acercar' });
    const zoomOut = screen.getByRole('button', { name: 'Alejar' });
    expect(zoomIn.className).toContain('diagram-rubric--glyph');
    expect(zoomOut.className).toContain('diagram-rubric--glyph');
    expect(screen.getByRole('button', { name: 'Traer a la vista los objetos que quedan fuera' }).textContent).toBe('Recuperar');
    expect(screen.getByRole('button', { name: 'Volver a la vista inicial' }).textContent).toBe('Inicio');
  });

  it('numbers the caption from the figure context', () => {
    render(
      <DiagramFigureContext.Provider value={2}>
        <DiagramRenderer spec={(fixture as DiagramSpec)} activeStepId="step1" />
      </DiagramFigureContext.Provider>,
    );
    const caption = document.querySelector('[data-diagram-caption]');
    expect(caption?.textContent).toContain('Fig. 2');
    expect(caption?.textContent).toContain((fixture as DiagramSpec).title);
  });
});
