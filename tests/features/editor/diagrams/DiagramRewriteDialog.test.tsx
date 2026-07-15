// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiagramRewriteDialog } from '../../../../src/features/editor/diagrams/ui/DiagramRewriteDialog';
import { DiagramSourcePanel } from '../../../../src/features/editor/ui/panels/DiagramSourcePanel';

const panelProps = {
  currentFile: 'src/widgets/diagrams/Legacy.tsx',
  diagramLinkedPages: [],
  openFile: vi.fn(),
  setActiveDiagramBlockId: vi.fn(),
  setActiveDiagramIndex: vi.fn(),
  setDiagramBuilderOpen: vi.fn(),
  onRewriteVisually: vi.fn(),
};

describe('code-preview visual rewrite entry point', () => {
  it('offers rewrite only for diagrams that are not visually editable', () => {
    const view = render(<DiagramSourcePanel {...panelProps} capability="code-preview" />);
    fireEvent.click(screen.getByRole('button', { name: 'Reescribir visualmente desde cero' }));
    expect(panelProps.onRewriteVisually).toHaveBeenCalledTimes(1);

    view.rerender(<DiagramSourcePanel {...panelProps} capability="visual-exact" />);
    expect(screen.queryByRole('button', { name: 'Reescribir visualmente desde cero' })).toBeNull();
  });

  it('explains the replacement and returns the chosen visual starting point', () => {
    const onStart = vi.fn();
    render(
      <DiagramRewriteDialog
        path="src/widgets/diagrams/Legacy.tsx"
        initialTitle="Legacy"
        onClose={vi.fn()}
        onStart={onStart}
      />,
    );

    expect(screen.getByText(/La sustitución solo ocurre al guardar/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Punto de partida'), { target: { value: 'cuadrilatero-clasificable' } });
    fireEvent.change(screen.getByLabelText('Título del nuevo modelo'), { target: { value: 'Cuadrilátero reconstruido' } });
    fireEvent.click(screen.getByRole('button', { name: 'Empezar desde cero' }));

    expect(onStart).toHaveBeenCalledWith({
      title: 'Cuadrilátero reconstruido',
      template: 'cuadrilatero-clasificable',
    });
  });
});
