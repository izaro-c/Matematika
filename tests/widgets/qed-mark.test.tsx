import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import { DemonstrationSection } from '@/widgets/content/DemonstrationSection';
import { ProofStep } from '@/widgets/content/ProofStep';
import { Demostracion } from '@/widgets/mdx/MDXBlocks';
import { insertQedAfterLastProofStep } from '@/widgets/content/insertQedAfterLastProofStep';
import { QedMark } from '@/widgets/content/QedMark';

describe('QedMark', () => {
  it('renders an accessible end-of-proof marker', () => {
    render(<QedMark />);
    expect(screen.getByLabelText('Fin de la demostración')).toBeTruthy();
    expect(document.querySelector('.demonstration-qed span')).toBeTruthy();
  });
});

describe('insertQedAfterLastProofStep', () => {
  it('inserts QedMark after the last ProofStep only', () => {
    const content = insertQedAfterLastProofStep(
      <>
        <p>Enunciado previo</p>
        <ProofStep number={1} title="Paso 1">Contenido 1</ProofStep>
        <ProofStep number={2} title="Paso 2">Contenido 2</ProofStep>
        <p>Análisis posterior</p>
      </>,
    );

    const { container } = render(<MathProvider>{content}</MathProvider>);
    const proofSteps = container.querySelectorAll('.proof-step');
    const qed = container.querySelector('.demonstration-qed');

    expect(proofSteps).toHaveLength(2);
    expect(qed).toBeTruthy();
    expect(proofSteps[1].nextElementSibling).toBe(qed);
  });

  it('returns children unchanged when there are no ProofSteps', () => {
    const children = <p>Solo texto</p>;
    expect(insertQedAfterLastProofStep(children)).toBe(children);
  });
});

describe('DemonstrationSection QED', () => {
  it('appends QedMark after the final proof step', () => {
    render(
      <MathProvider>
        <DemonstrationSection>
          <ProofStep number={1} title="Paso 1">Primer paso</ProofStep>
          <ProofStep number={2} title="Conclusión">Último paso</ProofStep>
          <h3>Análisis posterior</h3>
        </DemonstrationSection>
      </MathProvider>,
    );

    const proofSteps = document.querySelectorAll('.proof-step');
    const qed = document.querySelector('.demonstration-qed');

    expect(proofSteps).toHaveLength(2);
    expect(qed).toBeTruthy();
    expect(proofSteps[1].nextElementSibling).toBe(qed);
    expect(qed?.nextElementSibling?.tagName).toBe('H3');
  });
});

describe('Demostracion QED', () => {
  it('renders QedMark at the end of inline demonstrations', () => {
    render(
      <Demostracion>
        <p>Argumento breve.</p>
      </Demostracion>,
    );

    expect(document.querySelector('.demonstration-qed')).toBeTruthy();
  });
});
