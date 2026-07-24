import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetRepositoryMocks } from '../../../../helpers/diagramWorkbench';
import { DiagramWorkbench } from '../../../../../src/features/editor/diagrams/ui/DiagramWorkbench';
import { DiagramStatusBar } from '../../../../../src/features/editor/diagrams/ui/DiagramStatusBar';
import { buildDiagramSaveCapability } from '../../../../../src/features/editor/diagrams/model/savePresentation';
import { initialDiagramState } from '../../../../../src/features/editor/diagrams/state/reducer';
import { DiagramStepPreviewControls } from '../../../../../src/features/editor/diagrams/ui/DiagramStepPreviewControls';
import { createTemplateModel } from '../../../../../src/features/editor/diagrams/model';
import { generateDiagramSource } from '../../../../../src/features/editor/diagrams/source/generator';

const repositoryMocks = vi.hoisted(() => ({
  readDiagram: vi.fn(),
  saveDiagram: vi.fn(),
  updateMdxImports: vi.fn(),
}));

vi.mock('@/features/editor/diagrams/persistence/repository', () => ({
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

  it('shows a readable block summary and diagnostics link for validation errors', () => {
    const model = createTemplateModel('triangulo', 'Triángulo', 'definicion');
    const capability = buildDiagramSaveCapability({
      ...initialDiagramState,
      filePath: 'src/widgets/diagrams/Test/Triangulo.tsx',
      currentSource: 'export const X = () => null;',
      status: 'visual-authoritative',
      currentModel: model,
      diagnostics: [{
        code: 'invalid-diagram-spec-v2',
        severity: 'error',
        message: 'Required',
        source: 'model',
        path: ['elements', 0, 'refs'],
      }],
    });

    render(
      <DiagramStatusBar
        variant="inline"
        status="visual-authoritative"
        isDirty
        saveCapability={capability}
        onSave={vi.fn()}
        onOpenDiagnostics={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Guardar diagrama' })).toHaveProperty('disabled', true);
    expect(screen.getByText('1 error')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ver' })).toBeTruthy();
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
    resetRepositoryMocks(repositoryMocks);
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

  async function renderErroresWorkbench() {
    const model = createTemplateModel('triangulo', 'Errores UX', 'definicion');
    const source = generateDiagramSource(model, 'ErroresUx').source;
    readDiagram.mockResolvedValueOnce({
      source,
      model,
      parseStatus: 'visual-exact',
      diagnostics: [{
        code: 'invalid-diagram-spec-v2',
        severity: 'error',
        message: 'Required',
        source: 'model',
        path: ['elements', 0, 'refs'],
      }],
      version: 'v1',
    });

    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'file', path: 'src/widgets/diagrams/Test/ErroresUx.tsx' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getAllByText('1 error').length).toBeGreaterThan(0));
  }

  it('shows compact save block and check-tab detail when validation fails', async () => {
    await renderErroresWorkbench();
    expect(screen.queryByText(/Revíselos y corríjalos/i)).toBeNull();
    expect(screen.getByRole('tab', { name: 'Comprobar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ver' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Guardar diagrama' })).toHaveProperty('disabled', true);

    fireEvent.click(screen.getByRole('tab', { name: 'Comprobar' }));
    await waitFor(() => expect(screen.getByText('Referencia incompleta')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: /Referencia incompleta/i }));
    await waitFor(() => expect(screen.getByText('Referencias geométricas')).toBeTruthy());
  });

  it('opens the Comprobar tab from the save diagnostics link without jumping to the error origin', async () => {
    await renderErroresWorkbench();

    fireEvent.click(screen.getByRole('button', { name: 'Ver' }));

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Comprobar' }).getAttribute('aria-selected')).toBe('true');
      expect(screen.getByText('Comprobación antes de guardar')).toBeTruthy();
      expect(screen.getByText('Referencia incompleta')).toBeTruthy();
    });
    expect(screen.queryByText('Referencias geométricas')).toBeNull();
  });

  it('lets the inspector section change after navigating from a diagnostic', async () => {
    await renderErroresWorkbench();

    fireEvent.click(screen.getByRole('tab', { name: 'Comprobar' }));
    await waitFor(() => expect(screen.getByText('Referencia incompleta')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: /Referencia incompleta/i }));
    await waitFor(() => {
      expect(screen.getByText('Referencias geométricas')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Geometría' }).getAttribute('aria-current')).toBe('page');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Estilo' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Estilo' }).getAttribute('aria-current')).toBe('page');
      expect(screen.getByRole('button', { name: 'Geometría' }).getAttribute('aria-current')).toBeNull();
    });
  });

  it('navigates derived-expression errors to the geometry expression fields', async () => {
    const base = createTemplateModel('triangulo', 'Derivado UX', 'definicion');
    const derived = {
      ...base.points[0],
      id: 'pDeriv',
      label: 'P',
      constraint: 'derived' as const,
      fixed: true,
      xExpression: undefined,
      yExpression: undefined,
      dependencies: [] as string[],
    };
    const model = { ...base, points: [...base.points, derived] };
    const pointIndex = model.points.length - 1;
    const source = generateDiagramSource(model, 'DerivadoUx').source;
    readDiagram.mockResolvedValueOnce({
      source,
      model,
      parseStatus: 'visual-exact',
      diagnostics: [{
        code: 'invalid-diagram-spec-v2',
        severity: 'error',
        message: `El punto derivado ${derived.id} necesita expresiones x/y y dependencias explícitas.`,
        source: 'model',
        path: ['points', pointIndex],
      }],
      version: 'v1',
    });

    render(
      <DiagramWorkbench
        isOpen
        mode={{ kind: 'file', path: 'src/widgets/diagrams/Test/DerivadoUx.tsx' }}
        metadataType="definicion"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getAllByText('1 error').length).toBeGreaterThan(0));
    fireEvent.click(screen.getByRole('tab', { name: 'Comprobar' }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Punto derivado incompleto/i })).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: /Punto derivado incompleto/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Geometría' }).getAttribute('aria-current')).toBe('page');
      expect(screen.getByLabelText('Expresión x derivada')).toBeTruthy();
      expect(document.querySelector('[data-inspector-field="xExpression"]')).toBeTruthy();
    });
  });
});
