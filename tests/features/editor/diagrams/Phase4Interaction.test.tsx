import React, { useEffect, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MathProvider, useMathStore } from '../../../../src/lib/page-context/MathStoreContext';
import { useDiagramTargetRegistry } from '../../../../src/lib/page-context/DiagramTargetRegistryContext';
import { InteractiveElement } from '../../../../src/components/ui/VisualBind';
import { StepNavigator } from '../../../../src/components/ui/StepNavigator';
import { DemonstrationBlock } from '../../../../src/fixed-pages/editor/ui/blocks/DemonstrationBlock';
import { createTemplateModel } from '../../../../src/fixed-pages/editor/diagrams/model';
import { DemonstrationSection } from '../../../../src/components/content/DemonstrationSection';
import { ProofStep } from '../../../../src/components/content/ProofStep';

afterEach(() => {
  vi.useRealTimers();
});

function HighlightWitness() {
  const highlight = useMathStore(state => state.variables.highlight);
  return <output aria-label="highlight actual">{String(highlight ?? '')}</output>;
}

function RegisterTarget() {
  const registry = useDiagramTargetRegistry();
  useEffect(() => registry.register('demo-accesible', [{ targetId: 'segAB', objectId: 'seg1', label: 'Segmento AB', kind: 'object' }]), [registry]);
  return null;
}

describe('Phase 4 accessible interaction', () => {
  it('operates an external diagram target with focus, Enter and Space', () => {
    render(
      <MathProvider>
        <RegisterTarget />
        <InteractiveElement target="segAB">segmento AB</InteractiveElement>
        <HighlightWitness />
      </MathProvider>,
    );
    const control = screen.getByRole('button', { name: 'Resaltar segAB en el diagrama' });
    fireEvent.focus(control);
    expect(screen.getByLabelText('highlight actual').textContent).toBe('demo-accesible:segAB');
    fireEvent.blur(control);
    expect(screen.getByLabelText('highlight actual').textContent).toBe('');
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(screen.getByLabelText('highlight actual').textContent).toBe('demo-accesible:segAB');
    fireEvent.keyDown(control, { key: ' ' });
    expect(screen.getByLabelText('highlight actual').textContent).toBe('demo-accesible:segAB');
  });

  it('reproduces, pauses, navigates and resets with labelled controls', () => {
    vi.useFakeTimers();
    const steps = createTemplateModel('demostracion-pasos', 'Navegación', 'demostracion').steps
      .map(item => ({ ...item, durationMs: 300 }));
    function Harness() {
      const [active, setActive] = useState(steps[0].id);
      return <><StepNavigator steps={steps} activeStepId={active} onStepChange={setActive} /><output aria-label="paso activo">{active}</output></>;
    }
    render(<MathProvider><Harness /></MathProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Paso siguiente' }));
    expect(screen.getByLabelText('paso activo').textContent).toBe('step2');
    fireEvent.click(screen.getByRole('button', { name: 'Paso anterior' }));
    expect(screen.getByLabelText('paso activo').textContent).toBe('step1');
    fireEvent.click(screen.getByRole('button', { name: 'Reproducir secuencia' }));
    expect(screen.getByRole('button', { name: 'Pausar reproducción' }).getAttribute('aria-pressed')).toBe('true');
    act(() => { vi.advanceTimersByTime(310); });
    expect(screen.getByLabelText('paso activo').textContent).toBe('step2');
    act(() => { vi.advanceTimersByTime(310); });
    expect(screen.getByLabelText('paso activo').textContent).toBe('step3');
    act(() => { vi.advanceTimersByTime(310); });
    expect(screen.getByRole('button', { name: 'Reproducir secuencia' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar secuencia' }));
    expect(screen.getByLabelText('paso activo').textContent).toBe('step1');
  });

  it('shows Lean traces as read-only information beside, not instead of, justification', () => {
    render(
      <DemonstrationBlock
        steps={[{
          number: 1,
          title: 'Paso formalizado',
          target: 'segAB',
          body: '<InteractiveElement target="segAB">AB</InteractiveElement>',
          justificacion: 'Por definición de segmento',
          justificationType: 'definicion',
          leanBlocksExpression: 'metadata.stepTacticMap["1"]',
        }]}
        diagramTargets={[]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Traza Lean del paso 1').textContent).toContain('solo lectura');
    expect((screen.getByDisplayValue('Por definición de segmento') as HTMLInputElement).value).toBe('Por definición de segmento');
    expect(screen.queryByDisplayValue('metadata.stepTacticMap["1"]')).toBeNull();
  });

  it('keeps proof-step scrollytelling without showing StepNavigator on demonstration pages', () => {
    render(
      <MathProvider>
        <DemonstrationSection>
          <ProofStep number={1} title="Hipótesis" target="segAB">AB es el segmento dado.</ProofStep>
        </DemonstrationSection>
      </MathProvider>,
    );
    expect(screen.getByText('Hipótesis')).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Navegación de pasos del diagrama' })).toBeNull();
  });
});
