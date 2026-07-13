import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import v2Fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import { migrateDiagramSpec } from '../../../src/shared/diagrams/public';

vi.mock('../../../src/shared/diagrams/core/MathBoard', () => ({
  MathBoard: ({ children }: { children?: React.ReactNode }) => <div data-testid="math-board">{children}</div>,
}));

import { DiagramRenderer } from '../../../src/shared/diagrams/runtime/DiagramRenderer';

describe('DiagramRenderer shared runtime', () => {
  beforeEach(() => vi.clearAllMocks());

  it('exposes the versioned renderer path and shared viewport controls', () => {
    const onViewportChange = vi.fn();
    render(<DiagramRenderer spec={migrateDiagramSpec(v2Fixture).spec} mode="preview" onViewportChange={onViewportChange} />);
    expect(screen.getByTestId('math-board')).toBeTruthy();
    expect(document.querySelector('[data-diagram-renderer="matematika-diagram-renderer-v2"]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Acercar' }));
    expect(onViewportChange).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('button', { name: 'Recuperar' }) as HTMLButtonElement).disabled).toBe(false);
  });
});
