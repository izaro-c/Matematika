import { describe, expect, it } from 'vitest';
import { step } from '../../../../../src/features/editor/diagrams/model';
import {
  matrixCellVisualState,
  nextMatrixCellState,
  resolveMatrixCellState,
} from '../../../../../src/features/editor/diagrams/ui/stepMatrixUtils';

describe('stepMatrixUtils', () => {
  const sampleStep = step('step1', 'Paso 1', 'Descripción', ['objA', 'objB']);

  it('resolves visibility from visibleTargets when no object state exists', () => {
    expect(resolveMatrixCellState(sampleStep, 'objA')).toEqual({ visible: true, emphasis: 'none' });
    expect(resolveMatrixCellState(sampleStep, 'objZ')).toEqual({ visible: false, emphasis: 'none' });
  });

  it('cycles matrix cell states in visible → emphasis → hidden order', () => {
    expect(nextMatrixCellState('hidden')).toEqual({ visible: true, emphasis: 'none' });
    expect(nextMatrixCellState('visible')).toEqual({ visible: true, emphasis: 'secondary' });
    expect(nextMatrixCellState('emphasis-secondary')).toEqual({ visible: true, emphasis: 'primary' });
    expect(nextMatrixCellState('emphasis-primary')).toEqual({ visible: false, emphasis: 'none' });
  });

  it('maps object states to visual matrix states', () => {
    const withState = {
      ...sampleStep,
      objectStates: {
        objA: { visible: true, emphasis: 'primary' as const },
      },
    };
    expect(matrixCellVisualState(withState, 'objA')).toBe('emphasis-primary');
  });
});
