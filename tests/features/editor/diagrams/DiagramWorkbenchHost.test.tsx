import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DiagramWorkbenchHost } from '../../../../src/fixed-pages/editor/diagrams/ui/DiagramWorkbenchHost';

vi.mock('@/fixed-pages/editor/diagrams/ui/DiagramWorkbench', () => ({
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

  it('renders workbench fullscreen when open', () => {
    render(<DiagramWorkbenchHost isOpen {...baseProps} />);
    const dialog = screen.getByRole('dialog', { name: 'Editor de diagramas' });
    expect(dialog.className).toContain('fixed');
    expect(dialog.className).toContain('inset-0');
    expect(screen.getByTestId('diagram-workbench')).toBeTruthy();
  });
});
