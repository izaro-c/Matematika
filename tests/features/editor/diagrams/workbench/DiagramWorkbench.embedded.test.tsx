import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { DiagramWorkbench } from '@/fixed-pages/editor/diagrams/ui/workbench/DiagramWorkbench';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model/scene/templateModels';
import { generateDiagramSource } from '@/fixed-pages/editor/diagrams/source/generator';

describe('DiagramWorkbench embedded confirm', () => {
  it('calls onConfirm when saving with embedded callbacks', async () => {
    const model = createTemplateModel('circunferencia', 'Diagrama inline', 'definicion');
    const generated = generateDiagramSource(model, 'InlineDiagram');
    expect(generated.ok).toBe(true);
    const onConfirm = vi.fn(async () => true);
    const onClose = vi.fn();

    render(
      <DiagramWorkbench
        mode={{
          kind: 'inline',
          source: generated.ok ? generated.source : '',
          componentName: 'InlineDiagram',
          model,
        }}
        metadataType="definicion"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    );

    await waitFor(() => expect(screen.getByDisplayValue('Diagrama inline')).toBeTruthy());

    const saveButtons = screen.getAllByRole('button', { name: /Guardar/i });
    const enabled = saveButtons.find(btn => !(btn as HTMLButtonElement).disabled) ?? saveButtons[0];
    fireEvent.click(enabled);

    await waitFor(() => expect(onConfirm).toHaveBeenCalled());
    const spec = onConfirm.mock.calls[0][0];
    expect(spec.componentName).toBe('InlineDiagram');
    expect(spec.visualModel).toBeTruthy();
    expect(spec.mode).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();
  });
});
