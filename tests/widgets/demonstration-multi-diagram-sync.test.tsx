import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import { DemonstrationSection } from '@/widgets/content/DemonstrationSection';
import { ProofStep } from '@/widgets/content/ProofStep';

const originalScrollY = window.scrollY;
const originalInnerHeight = window.innerHeight;
const originalBodyOffsetHeight = Object.getOwnPropertyDescriptor(document.body, 'offsetHeight');

afterEach(() => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: originalScrollY });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
  if (originalBodyOffsetHeight) {
    Object.defineProperty(document.body, 'offsetHeight', originalBodyOffsetHeight);
  } else {
    Reflect.deleteProperty(document.body, 'offsetHeight');
  }
});

describe('DemonstrationSection with multiple diagrams', () => {
  it('keeps one sticky layout and changes the diagram with the active proof step', () => {
    render(
      <MathProvider>
        <DemonstrationSection diagrams={{
          step1: <div data-testid="commensurable-diagram">Conmensurable</div>,
          step2: <div key="incommensurable" data-testid="incommensurable-diagram">Inconmensurable</div>,
          step3: <div key="incommensurable" data-testid="incommensurable-diagram">Inconmensurable</div>,
        }}>
          <ProofStep number={1} title="Caso conmensurable" target="step1" />
          <ProofStep number={2} title="Caso inconmensurable" target="step2" />
          <ProofStep number={3} title="Conclusión" target="step3" />
        </DemonstrationSection>
      </MathProvider>,
    );

    expect(document.querySelectorAll('.codex-layout')).toHaveLength(1);
    expect(document.querySelectorAll('.codex-diagram')).toHaveLength(1);
    const commensurableDiagram = screen.getByTestId('commensurable-diagram');
    const incommensurableDiagram = screen.getByTestId('incommensurable-diagram');
    expect(commensurableDiagram.closest('[data-diagram-transition-state]')?.getAttribute('data-diagram-transition-state')).toBe('current');
    expect(incommensurableDiagram.closest('[data-diagram-transition-state]')?.getAttribute('data-diagram-transition-state')).toBe('inactive');

    const proofSteps = document.querySelectorAll<HTMLElement>('.proof-step');
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
    Object.defineProperty(document.body, 'offsetHeight', { configurable: true, value: 2000 });
    Object.defineProperty(proofSteps[0], 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: -300, bottom: -100, left: 0, right: 100, width: 100, height: 200, x: 0, y: -300, toJSON: () => ({}) }),
    });
    Object.defineProperty(proofSteps[1], 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 200, bottom: 400, left: 0, right: 100, width: 100, height: 200, x: 0, y: 200, toJSON: () => ({}) }),
    });
    Object.defineProperty(proofSteps[2], 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 650, bottom: 800, left: 0, right: 100, width: 100, height: 150, x: 0, y: 650, toJSON: () => ({}) }),
    });

    fireEvent.scroll(window);

    expect(proofSteps[1].classList.contains('is-active')).toBe(true);
    expect(commensurableDiagram.closest('[data-diagram-transition-state]')?.getAttribute('data-diagram-transition-state')).toBe('inactive');
    expect(incommensurableDiagram.closest('[data-diagram-transition-state]')?.getAttribute('data-diagram-transition-state')).toBe('current');
    expect(document.querySelector('.diagram-transition-frame.is-current')).toBeTruthy();
    const diagramAtStep2 = incommensurableDiagram;

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1200 });
    fireEvent.scroll(window);

    expect(proofSteps[2].classList.contains('is-active')).toBe(true);
    expect(screen.getByTestId('incommensurable-diagram')).toBe(diagramAtStep2);

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    Object.defineProperty(proofSteps[0], 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 100, bottom: 300, left: 0, right: 100, width: 100, height: 200, x: 0, y: 100, toJSON: () => ({}) }),
    });
    Object.defineProperty(proofSteps[1], 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 500, bottom: 700, left: 0, right: 100, width: 100, height: 200, x: 0, y: 500, toJSON: () => ({}) }),
    });
    fireEvent.scroll(window);

    expect(proofSteps[0].classList.contains('is-active')).toBe(true);
    expect(commensurableDiagram.closest('[data-diagram-transition-state]')?.getAttribute('data-diagram-transition-state')).toBe('current');
    expect(incommensurableDiagram.closest('[data-diagram-transition-state]')?.getAttribute('data-diagram-transition-state')).toBe('inactive');
  });
});
