import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DiagramWorkbenchHost } from '../../../../src/fixed-pages/editor/diagrams/ui/workbench/DiagramWorkbenchHost';

vi.mock('@/fixed-pages/editor/diagrams/ui/workbench/DiagramWorkbench', () => ({
  DiagramWorkbench: () => <div data-testid="diagram-workbench">Workbench</div>,
}));

describe('DiagramWorkbenchHost', () => {
  const baseProps = {
    mode: { kind: 'new' as const, componentName: 'Demo' },
    metadataType: 'demostración',
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  afterEach(() => {
    window.history.replaceState({}, '', '/editor');
  });

  it('renders nothing when closed', () => {
    const { container } = render(<DiagramWorkbenchHost isOpen={false} {...baseProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders workbench in shell region when open', () => {
    render(<DiagramWorkbenchHost isOpen {...baseProps} />);
    const region = screen.getByRole('region', { name: 'Editor de diagramas' });
    expect(region.className).toContain('h-full');
    expect(region.className).not.toContain('fixed');
    expect(screen.getByTestId('diagram-workbench')).toBeTruthy();
  });
});
