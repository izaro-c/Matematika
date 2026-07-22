import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import { ProofStep } from '@/widgets/content/ProofStep';
import { ProofStepLink } from '@/widgets/content/ProofStepLink';
import { CodexLayout } from '@/widgets/layouts/CodexLayout';

const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');

function Harness() {
  return (
    <MathProvider>
      <CodexLayout>
        <ProofStep number={1} title="Primero" target="step-1" />
        <ProofStep number={2} title="Segundo" target="step-2">
          Por el paso <ProofStepLink step={1} />, concluimos.
        </ProofStep>
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
  if (originalScrollIntoView) {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView);
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
  }
});

describe('ProofStepLink', () => {
  it('renders the referenced step number inside the Arts & Crafts badge', () => {
    render(<Harness />);

    const link = screen.getByRole('button', { name: 'Ir al paso 1' });
    expect(link.getAttribute('data-proof-step-link')).toBe('1');
    expect(link.querySelector('.page-accent-text')?.textContent).toBe('1');
  });

  it('scrolls smoothly to the referenced proof step and syncs diagram state', () => {
    render(<Harness />);

    const targetStep = document.getElementById('proof-step-1');
    expect(targetStep).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Ir al paso 1' }));

    expect(targetStep?.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
    expect(document.querySelectorAll<HTMLElement>('.proof-step')[0].classList.contains('is-active')).toBe(true);
  });
});
