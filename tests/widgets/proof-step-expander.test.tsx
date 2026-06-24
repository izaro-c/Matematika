import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofStep } from '@/widgets/content/ProofStep';
import { ProofStepExpander } from '@/widgets/content/ProofStepExpander';
import { MathProvider } from '@/app/providers/MathStoreContext';

describe('ProofStepExpander', () => {
  it('is collapsed by default and resolves valid Lean blocks', () => {
    render(<ProofStepExpander blockIds={['ala-step1-transport']} />);

    const details = screen.getByText('Ver en Lean').closest('details');
    expect(details?.hasAttribute('open')).toBe(false);
    expect(screen.getByText(/Matematika.Geometry.congruence_ala/)).toBeDefined();
    expect(screen.getByText(/h_transport/)).toBeDefined();
  });

  it('shows a quiet missing-block message', () => {
    render(<ProofStepExpander blockIds={['missing-block']} />);
    expect(screen.getByText(/Bloque Lean no encontrado/)).toBeDefined();
  });
});

describe('ProofStep Lean trace', () => {
  it('renders unchanged without Lean metadata', () => {
    render(
      <MathProvider>
        <ProofStep number={1} title="Paso sin Lean">
          Contenido
        </ProofStep>
      </MathProvider>,
    );

    expect(screen.getByText('Paso sin Lean')).toBeDefined();
    expect(screen.queryByText('Ver en Lean')).toBeNull();
  });

  it('renders the Lean expander when leanBlocks are provided', () => {
    render(
      <MathProvider>
        <ProofStep number={1} title="Paso con Lean" leanBlocks={['ala-step1-transport']}>
          Contenido
        </ProofStep>
      </MathProvider>,
    );

    expect(screen.getByText('Ver en Lean')).toBeDefined();
  });
});
