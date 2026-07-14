import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import v2Fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import { migrateDiagramSpec } from '../../../src/shared/diagrams/public';
import { MathProvider } from '../../../src/shared/lib/MathStoreContext';

vi.mock('../../../src/shared/diagrams/core/MathBoard', () => ({
  MathBoard: ({ children }: { children?: React.ReactNode }) => <div data-testid="math-board">{children}</div>,
}));

import { DiagramRenderer } from '../../../src/shared/diagrams/runtime/DiagramRenderer';
import { Pitagoras } from '../../../src/widgets/diagrams/Teoremas/Pitagoras';
import { PitagorasSpec } from '../../../src/widgets/diagrams/Teoremas/Pitagoras';
import { DiagramStepsEditor } from '../../../src/features/editor/diagrams/ui/DiagramStepsEditor';

describe('DiagramRenderer shared runtime', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exposes the versioned renderer path and shared viewport controls', () => {
    const onViewportChange = vi.fn();
    render(
      <MathProvider>
        <DiagramRenderer spec={migrateDiagramSpec(v2Fixture).spec} mode="preview" onViewportChange={onViewportChange} />
      </MathProvider>,
    );
    expect(screen.getByTestId('math-board')).toBeTruthy();
    expect(document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v2"]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Acercar' }));
    expect(onViewportChange).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('button', { name: 'Recuperar objetos fuera del viewport' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('opens the real Pitágoras editor preview without requiring an outer MathProvider', () => {
    expect(() => render(
      <Pitagoras />,
    )).not.toThrow();
    expect(screen.getByTestId('math-board')).toBeTruthy();
  });

  it('opens the real Pitágoras steps editor without requiring an outer MathProvider', () => {
    expect(() => render(
      <DiagramStepsEditor
        model={PitagorasSpec}
        activeStepId="step1"
        onActiveStepChange={vi.fn()}
        onModelEdit={vi.fn()}
        onSelectObject={vi.fn()}
      />,
    )).not.toThrow();
    expect(screen.getByRole('navigation', { name: 'Navegación de pasos del diagrama' })).toBeTruthy();
  });
});
