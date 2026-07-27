import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { preferLegacyDiagramWorkbench } from '../../../../src/features/editor/diagrams/ui/diagramWorkbenchVariant';
import { DiagramWorkbenchHost } from '../../../../src/features/editor/diagrams/ui/DiagramWorkbenchHost';

vi.mock('../../../../src/features/editor/diagrams/ui/DiagramWorkbench', () => ({
  DiagramWorkbench: () => <div data-testid="v1-workbench">V1</div>,
}));

vi.mock('../../../../src/features/editor/v2/ui/EditorV2Main', () => ({
  EditorV2Main: () => <div data-testid="v2-workbench">V2</div>,
}));

describe('preferLegacyDiagramWorkbench', () => {
  it('detects diagram=v1', () => {
    expect(preferLegacyDiagramWorkbench('?diagram=v1')).toBe(true);
    expect(preferLegacyDiagramWorkbench('diagram=v1&x=1')).toBe(true);
  });

  it('rejects other queries', () => {
    expect(preferLegacyDiagramWorkbench('')).toBe(false);
    expect(preferLegacyDiagramWorkbench('?diagram=v2')).toBe(false);
    expect(preferLegacyDiagramWorkbench('foo=bar')).toBe(false);
  });
});

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

  it('renders V2 by default', () => {
    window.history.replaceState({}, '', '/editor');
    render(<DiagramWorkbenchHost isOpen {...baseProps} />);
    expect(screen.getByTestId('v2-workbench')).toBeTruthy();
    expect(screen.queryByTestId('v1-workbench')).toBeNull();
  });

  it('renders V1 when diagram=v1', () => {
    window.history.replaceState({}, '', '/editor?diagram=v1');
    render(<DiagramWorkbenchHost isOpen {...baseProps} />);
    expect(screen.getByTestId('v1-workbench')).toBeTruthy();
    expect(screen.queryByTestId('v2-workbench')).toBeNull();
  });
});
