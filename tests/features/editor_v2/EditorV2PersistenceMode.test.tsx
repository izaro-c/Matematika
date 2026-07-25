import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { EditorV2Main } from '@/features/editor_v2/ui/EditorV2Main';
import { createTemplateModel } from '@/features/editor/diagrams/model/templateModels';
import { generateDiagramSource } from '@/features/editor/diagrams/source/generator';

describe('Editor V2 persistence mode', () => {
  it('loads an inline mode without presenting it as a sandbox', async () => {
    const model = createTemplateModel('circunferencia', 'Diagrama inline', 'definicion');
    const source = generateDiagramSource(model, 'InlineDiagram');
    expect(source.ok).toBe(true);

    render(
      <EditorV2Main
        mode={{
          kind: 'inline',
          source: source.ok ? source.source : '',
          componentName: 'InlineDiagram',
          model,
        }}
      />,
    );

    await waitFor(() => expect(screen.getByDisplayValue('Diagrama inline')).toBeTruthy());
    expect(screen.queryByText('Sandbox')).toBeNull();
  });
});
