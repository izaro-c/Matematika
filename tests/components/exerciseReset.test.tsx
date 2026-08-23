import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ExerciseProvider, useExercise, Pregunta, ExerciseStep } from '@/content-pages/exercise';

import { MathProvider } from '@/lib/page-context/MathStoreContext';

const TestExercise = () => {
  const { reset } = useExercise();

  return (
    <div>
      <button onClick={() => reset()} data-testid="reset-btn">
        Reset
      </button>

      <ExerciseStep id="p1" numero={1} titulo="Paso 1" questionIds={['q1']}>
        <Pregunta
          id="q1"
          correct="opt_a"
          texto="Pregunta 1"
          opciones={[
            { value: 'opt_a', texto: 'Opción A' },
            { value: 'opt_b', texto: 'Opción B' },
          ]}
        />
      </ExerciseStep>

      <ExerciseStep
        id="p2"
        numero={2}
        titulo="Paso 2"
        questionIds={['q2']}
        dependeDeQuestions={['q1']}
      >
        <Pregunta
          id="q2"
          correct="opt_c"
          texto="Pregunta 2"
          opciones={[
            { value: 'opt_c', texto: 'Opción C' },
            { value: 'opt_d', texto: 'Opción D' },
          ]}
        />
      </ExerciseStep>
    </div>
  );
};

describe('Exercise Reset', () => {
  it('resets selections and allows re-answering and unlocking steps cleanly', () => {
    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-ex-1">
          <TestExercise />
        </ExerciseProvider>
      </MathProvider>
    );

    // Initial state: Step 1 is unlocked, Step 2 is locked
    expect(screen.getByText('Paso 1')).toBeDefined();
    expect(screen.getByText('Opción A')).toBeDefined();
    expect(screen.queryByText('Pregunta 2')).toBeNull(); // locked

    // Answer question 1
    const optA = screen.getByText('Opción A');
    fireEvent.click(optA);

    // Now Step 1 is completed and Step 2 is unlocked
    expect(screen.getByText('Pregunta 2')).toBeDefined();

    // Click Reset
    const resetBtn = screen.getByTestId('reset-btn');
    act(() => {
      fireEvent.click(resetBtn);
    });

    // After reset: Step 2 should be locked again
    expect(screen.queryByText('Pregunta 2')).toBeNull();

    // Step 1 options should be interactive again (not disabled)
    const freshOptA = screen.getByText('Opción A');
    const button = freshOptA.closest('button');
    expect(button?.disabled).toBe(false);

    // Clicking option A again should unlock Step 2 again
    act(() => {
      fireEvent.click(freshOptA);
    });
    expect(screen.getByText('Pregunta 2')).toBeDefined();
  });
});
