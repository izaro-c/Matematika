import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DiagramWorkbench } from '../../../../../src/features/editor/diagrams/ui/DiagramWorkbench';
import { DiagramStatusBar } from '../../../../../src/features/editor/diagrams/ui/DiagramStatusBar';
import { DiagramStepPreviewControls } from '../../../../../src/features/editor/diagrams/ui/DiagramStepPreviewControls';
import { createTemplateModel } from '../../../../../src/features/editor/diagrams/model';
import { generateDiagramSource } from '../../../../../src/features/editor/diagrams/source/generator';

const repositoryMocks = vi.hoisted(() => ({
  readDiagram: vi.fn(),
  saveDiagram: vi.fn(),
  updateMdxImports: vi.fn(),
}));

vi.mock('../../../../../src/features/editor/diagrams/persistence/repository', () => ({
  diagramRepository: {
    readDiagram: repositoryMocks.readDiagram,
    saveDiagram: repositoryMocks.saveDiagram,
    updateMdxImports: repositoryMocks.updateMdxImports,
  },
}));

const { readDiagram } = repositoryMocks;

describe('DiagramStatusBar inline variant', () => {
  it('renders a compact save control suitable for the header', () => {
    render(
      <DiagramStatusBar
        variant="inline"
        status="visual-authoritative"
        isDirty
        onSave={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Guardar diagrama' })).toBeTruthy();
    expect(screen.getByText(/Modificado visualmente/)).toBeTruthy();
    expect(screen.queryByText(/Cambios locales sin guardar/)).toBeNull();
  });
});

describe('DiagramStepPreviewControls', () => {
  it('navigates steps and shows the active step indicator', () => {
    const model = createTemplateModel('demostracion-pasos', 'Pasos', 'demostracion');
    function Harness() {
      const [active, setActive] = React.useState('step1');
      return (
        <DiagramStepPreviewControls
          steps={model.steps}
          activeStepId={active}
          onActiveStepChange={setActive}
        />
      );
    }
    render(<Harness />);
    expect(screen.getByText(/Paso 1 de 3/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Paso siguiente' }));
    expect(screen.getByText(/Paso 2 de 3/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Paso anterior' }));
    expect(screen.getByText(/Paso 1 de 3/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar todos los objetos' }));
    expect(screen.getByText(/Mostrando todos los objetos/)).toBeTruthy();
  });
});

describe('DiagramWorkbench integrated UX', () => {
  beforeEach(() => {
    readDiagram.mockReset();
  });

  it('places save status in the header instead of a footer bar', async () => {
    const model = createTemplateModel('triangulo', 'Workbench UX', 'definicion');
    const source = generateDiagramSource(model, 'WorkbenchUx').source;
    readDiagram.mockResolvedValueOnce({
      source,
      model,
      parseStatus: 'visual-exact',
      diagnostics: [],
      version: 'v1',
    });

    const { container } = render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'file', path: 'src/widgets/diagrams/Test/WorkbenchUx.tsx' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Guardar diagrama' })).toBeTruthy());
    const header = container.querySelector('header');
    expect(header?.contains(screen.getByRole('button', { name: 'Guardar diagrama' }))).toBe(true);
    const footers = container.querySelectorAll('[role="status"], [role="alert"]');
    const footerBar = [...footers].find(node => node.className.includes('border-t'));
    expect(footerBar).toBeUndefined();
  });

  it('shows step preview controls in design mode when the diagram has steps', async () => {
    const model = createTemplateModel('demostracion-pasos', 'Pasos UX', 'demostracion');
    const source = generateDiagramSource(model, 'PasosUx').source;
    readDiagram.mockResolvedValueOnce({
      source,
      model,
      parseStatus: 'visual-exact',
      diagnostics: [],
      version: 'v1',
    });

    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'file', path: 'src/widgets/diagrams/Test/PasosUx.tsx' }}
        metadataType="demostracion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByLabelText('Vista previa por pasos')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Paso siguiente' }));
    expect(screen.getByText(/Paso 2 de 3/)).toBeTruthy();
  });
});
