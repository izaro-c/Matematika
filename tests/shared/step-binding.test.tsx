import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import { StepBind, useStepBinding } from '@/shared/ui/StepBinding';

function Probe({ scopeId }: { scopeId?: string }) {
  const { activeStep } = useStepBinding(scopeId);
  return <output data-testid={`probe-${scopeId ?? 'global'}`}>{activeStep ?? 'ninguno'}</output>;
}

describe('StepBind', () => {
  it('sincroniza un paso desde puntero, teclado y clic', () => {
    render(
      <MathProvider>
        <StepBind step="hipotesis">Hipótesis</StepBind>
        <Probe />
      </MathProvider>,
    );

    const control = screen.getByRole('button', { name: 'Hipótesis' });
    fireEvent.pointerEnter(control);
    expect(screen.getByText('hipotesis')).toBeTruthy();
    expect(control.getAttribute('aria-pressed')).toBe('true');

    fireEvent.pointerLeave(control);
    expect(screen.getByText('ninguno')).toBeTruthy();

    fireEvent.focus(control);
    expect(screen.getByText('hipotesis')).toBeTruthy();
    fireEvent.blur(control);
    expect(screen.getByText('ninguno')).toBeTruthy();

    fireEvent.click(control);
    expect(screen.getByText('hipotesis')).toBeTruthy();
  });

  it('aísla pasos de diagramas distintos mediante scopeId', () => {
    render(
      <MathProvider>
        <StepBind step="uno" scopeId="diagrama-a">Activar A</StepBind>
        <Probe scopeId="diagrama-a" />
        <Probe scopeId="diagrama-b" />
      </MathProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Activar A' }));
    expect(screen.getByTestId('probe-diagrama-a').textContent).toBe('uno');
    expect(screen.getByTestId('probe-diagrama-b').textContent).toBe('ninguno');
  });
});
