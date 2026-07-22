import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import { ProofStep } from '@/widgets/content/ProofStep';
import { CodexLayout } from '@/widgets/layouts/CodexLayout';
import type { DiagramStep } from '@/shared/diagrams/spec';
import { createTemplateModel } from '@/features/editor/diagrams/model';

vi.mock('@/shared/diagrams/core/MathBoard', () => ({
  MathBoard: ({ children }: { children?: React.ReactNode }) => <div data-testid="math-board">{children}</div>,
}));

import { DiagramRenderer } from '@/shared/diagrams/runtime/DiagramRenderer';

const steps: DiagramStep[] = [
  { id: 'construction', label: 'Construcción', description: '', visibleTargets: [], durationMs: 300 },
  { id: 'deduction', label: 'Deducción', description: '', visibleTargets: [], durationMs: 300 },
  { id: 'conclusion', label: 'Conclusión', description: '', visibleTargets: [], durationMs: 300 },
];
const diagramSpec = {
  ...createTemplateModel('demostracion-pasos', 'Demostración sincronizada', 'demostracion'),
  componentId: 'proof-diagram',
  steps,
};

const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');
const originalScrollY = window.scrollY;
const originalInnerHeight = window.innerHeight;
const originalBodyOffsetHeight = Object.getOwnPropertyDescriptor(document.body, 'offsetHeight');

function SyncHarness() {
  return (
    <MathProvider>
      <CodexLayout diagram={<DiagramRenderer spec={diagramSpec} viewportControls={false} />}>
        <ProofStep number={1} title="Construcción" target={['point-a', 'point-b']} />
        <ProofStep number={2} title="Deducción" target={['intermediate-result']} />
        <ProofStep number={3} title="Conclusión" target={['result']} />
      </CodexLayout>
    </MathProvider>
  );
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.useRealTimers();
  if (originalScrollIntoView) {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView);
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
  }
  Object.defineProperty(window, 'scrollY', { configurable: true, value: originalScrollY });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
  if (originalBodyOffsetHeight) {
    Object.defineProperty(document.body, 'offsetHeight', originalBodyOffsetHeight);
  } else {
    Reflect.deleteProperty(document.body, 'offsetHeight');
  }
});

describe('Codex diagram and proof-step synchronization', () => {
  it('shows the corresponding proof step when the diagram advances', () => {
    render(<SyncHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'Paso siguiente' }));

    const proofSteps = document.querySelectorAll<HTMLElement>('.proof-step');
    expect(proofSteps[1].classList.contains('is-active')).toBe(true);
    expect(document.querySelector('[data-diagram-renderer]')?.getAttribute('data-diagram-active-step')).toBe('deduction');
    expect(screen.getByText(/2 \/ 3/)).toBeTruthy();
  });

  it('shows the corresponding diagram state when a proof step reaches the reading focus', () => {
    render(<SyncHarness />);
    const proofSteps = document.querySelectorAll<HTMLElement>('.proof-step');
    // step0 ha salido por arriba (top negativo) → activeIndex mínimo posible.
    vi.spyOn(proofSteps[0], 'getBoundingClientRect').mockReturnValue({
      top: -300, bottom: -100, left: 0, right: 100, width: 100, height: 200, x: 0, y: -300, toJSON: () => ({}),
    });
    // step1.top=200 ≤ activationLine (35% × 800 = 280) → debe activarse.
    vi.spyOn(proofSteps[1], 'getBoundingClientRect').mockReturnValue({
      top: 200, bottom: 400, left: 0, right: 100, width: 100, height: 200, x: 0, y: 200, toJSON: () => ({}),
    });
    vi.spyOn(proofSteps[2], 'getBoundingClientRect').mockReturnValue({
      top: 600, bottom: 800, left: 0, right: 100, width: 100, height: 200, x: 0, y: 600, toJSON: () => ({}),
    });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    Object.defineProperty(document.body, 'offsetHeight', { configurable: true, value: 2000 });

    fireEvent.scroll(window);

    expect(proofSteps[1].classList.contains('is-active')).toBe(true);
    expect(document.querySelector('[data-diagram-renderer]')?.getAttribute('data-diagram-active-step')).toBe('deduction');
    expect(screen.getByText(/2 \/ 3/)).toBeTruthy();
  });

  it('activates the final proof step when it cannot cross the reading line at the end of the page', () => {
    render(<SyncHarness />);
    const proofSteps = document.querySelectorAll<HTMLElement>('.proof-step');
    vi.spyOn(proofSteps[0], 'getBoundingClientRect').mockReturnValue({
      top: -500, bottom: -300, left: 0, right: 100, width: 100, height: 200, x: 0, y: -500, toJSON: () => ({}),
    });
    vi.spyOn(proofSteps[1], 'getBoundingClientRect').mockReturnValue({
      top: 120, bottom: 320, left: 0, right: 100, width: 100, height: 200, x: 0, y: 120, toJSON: () => ({}),
    });
    vi.spyOn(proofSteps[2], 'getBoundingClientRect').mockReturnValue({
      top: 650, bottom: 800, left: 0, right: 100, width: 100, height: 150, x: 0, y: 650, toJSON: () => ({}),
    });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1200 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    Object.defineProperty(document.body, 'offsetHeight', { configurable: true, value: 2000 });

    fireEvent.scroll(window);

    expect(proofSteps[2].classList.contains('is-active')).toBe(true);
    expect(document.querySelector('[data-diagram-renderer]')?.getAttribute('data-diagram-active-step')).toBe('conclusion');
    expect(screen.getByText(/3 \/ 3/)).toBeTruthy();
  });

  it('keeps diagram and proof content together throughout automatic playback', () => {
    vi.useFakeTimers();
    render(<SyncHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'Reproducir secuencia' }));
    act(() => { vi.advanceTimersByTime(310); });
    expect(document.querySelectorAll<HTMLElement>('.proof-step')[1].classList.contains('is-active')).toBe(true);
    act(() => { vi.advanceTimersByTime(310); });

    const proofSteps = document.querySelectorAll<HTMLElement>('.proof-step');
    expect(proofSteps[2].classList.contains('is-active')).toBe(true);
    expect(document.querySelector('[data-diagram-renderer]')?.getAttribute('data-diagram-active-step')).toBe('conclusion');
    expect(screen.getByText(/3 \/ 3/)).toBeTruthy();
  });
});
