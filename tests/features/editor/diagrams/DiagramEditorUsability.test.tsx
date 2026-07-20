import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createTemplateModel, movementAttractorCreatesCycle, movementAttractors, setPointAttractors } from '../../../../src/features/editor/diagrams/model/commands';
import { DiagramMovementAidsPanel } from '../../../../src/features/editor/diagrams/ui/DiagramMovementAidsPanel';
import { DiagramOrganizationPanel } from '../../../../src/features/editor/diagrams/ui/DiagramOrganizationPanel';
import { DiagramToolbar } from '../../../../src/features/editor/diagrams/ui/DiagramToolbar';
import { DiagramToolReferencePicker } from '../../../../src/features/editor/diagrams/ui/DiagramToolReferencePicker';
import { DiagramViewportFrame } from '../../../../src/features/editor/diagrams/ui/DiagramViewportFrame';

describe('diagram editor usability controls', () => {
  it('exposes snap and magnetism status and can enable snap for every movable point', () => {
    const model = createTemplateModel('lienzo-inicial', 'Ayudas');
    const movable = model.points.find(point => ['free', 'horizontal', 'vertical', 'constrained'].includes(point.constraint))!;
    const onModelEdit = vi.fn();
    const onSelect = vi.fn();
    render(<DiagramMovementAidsPanel model={model} onModelEdit={onModelEdit} onSelect={onSelect} />);

    expect(screen.getByText('Snap y magnetismo')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Activar snap en todos' }));
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.filter((point: { constraint: string }) => ['free', 'horizontal', 'vertical', 'constrained'].includes(point.constraint)).every((point: { snapToGrid?: boolean }) => point.snapToGrid)).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: new RegExp(`${movable.label} \\(${movable.id}\\)`) }));
    expect(onSelect).toHaveBeenCalledWith(movable.id);
  });

  it('configures snap and adds an attractor directly from the movement panel', () => {
    const model = createTemplateModel('triangulo-deformable', 'Ayudas directas');
    const movable = model.points.find(point => ['free', 'horizontal', 'vertical', 'constrained'].includes(point.constraint))!;
    const attractor = model.elements.find(element => (
      ['line', 'ray', 'segment', 'circle', 'functionCurve', 'parametricCurve', 'perpendicular', 'parallel', 'angleBisector'].includes(element.kind)
      && !movementAttractorCreatesCycle(model, movable.id, element.id)
    ))!;
    const onModelEdit = vi.fn();
    render(<DiagramMovementAidsPanel model={model} onModelEdit={onModelEdit} onSelect={vi.fn()} />);

    fireEvent.click(screen.getByRole('checkbox', { name: `Activar snap para ${movable.label}` }));
    expect(onModelEdit.mock.calls.at(-1)?.[0].points.find((point: { id: string }) => point.id === movable.id).snapToGrid).toBe(true);

    fireEvent.change(screen.getByLabelText(`Añadir atractor a ${movable.label}`), { target: { value: attractor.id } });
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((point: { id: string }) => point.id === movable.id).attractorIds).toEqual([attractor.id]);
    expect(edited.dependencies).toContainEqual({ sourceId: attractor.id, targetId: movable.id, relation: 'constraint' });
  });

  it('orders magnetic targets explicitly because the first compatible target has priority', () => {
    const base = createTemplateModel('triangulo-deformable', 'Prioridad magnética');
    const movable = base.points.find(point => ['free', 'horizontal', 'vertical', 'constrained'].includes(point.constraint))!;
    const candidates = movementAttractors(base).filter(attractor => (
      attractor.id !== movable.id && !movementAttractorCreatesCycle(base, movable.id, attractor.id)
    )).slice(0, 2);
    const model = setPointAttractors(base, movable.id, candidates.map(item => item.id));
    const onModelEdit = vi.fn();
    render(<DiagramMovementAidsPanel model={model} onModelEdit={onModelEdit} onSelect={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: `Subir atractor ${candidates[1].label} de ${movable.label}` }));

    expect(onModelEdit.mock.calls.at(-1)?.[0].points.find((point: { id: string }) => point.id === movable.id).attractorIds).toEqual([
      candidates[1].id,
      candidates[0].id,
    ]);
  });

  it('lists every layer member and moves it from the layer card', () => {
    const model = createTemplateModel('lienzo-inicial', 'Capas');
    const onModelEdit = vi.fn();
    const source = model.points[0];
    render(<DiagramOrganizationPanel model={model} onModelEdit={onModelEdit} onSelect={vi.fn()} />);

    fireEvent.click(screen.getByRole('tab', { name: /Capas/ }));
    const destination = model.layers.find(layer => layer.id !== source.layerId)!;
    fireEvent.change(screen.getByLabelText(`Mover ${source.label} a otra capa`), { target: { value: destination.id } });
    const edited = onModelEdit.mock.calls.at(-1)?.[0];
    expect(edited.points.find((point: { id: string }) => point.id === source.id).layerId).toBe(destination.id);
  });

  it('searches the complete object catalog and places guided constructions in the same menu', () => {
    const model = createTemplateModel('lienzo-inicial', 'Catálogo');
    render(<DiagramToolbar model={model} canvasTool="select" syncStatus="synced" onSetCanvasTool={vi.fn()} onAddElement={vi.fn()} onModelEdit={vi.fn()} onAddSlider={vi.fn()} onAddGliderPoint={vi.fn()} onAddStep={vi.fn()} onResolveDivergence={vi.fn()} guidedConstructions={<p>Selector guiado de prueba</p>} />);

    fireEvent.click(screen.getByRole('button', { name: /Añadir objeto/ }));
    fireEvent.change(screen.getByLabelText('Buscar objeto para añadir'), { target: { value: 'panel informativo' } });
    expect(screen.getByRole('menuitem', { name: 'Panel informativo' })).toBeTruthy();

    fireEvent.click(screen.getByRole('tab', { name: 'Construcciones guiadas' }));
    expect(screen.getByText('Selector guiado de prueba')).toBeTruthy();
  });

  it('explains the geometric purpose of every selected reference', () => {
    const model = createTemplateModel('triangulo-deformable', 'Referencias');
    render(<DiagramToolReferencePicker model={model} tool="circle" refs={[]} onRefsChange={vi.fn()} onCreate={vi.fn()} />);

    expect(screen.getByText('Centro de la circunferencia.')).toBeTruthy();
    expect(screen.getByText('Punto por el que pasa; determina el radio.')).toBeTruthy();
    expect(screen.getByLabelText('Punto 1 para Circunferencia')).toBeTruthy();
    expect(screen.getByLabelText('Punto 2 para Circunferencia')).toBeTruthy();
  });

  it('starts every visual frame at the real desktop dimensions and supports screen presets', () => {
    render(<DiagramViewportFrame title="Lienzo de prueba" subtitle="Dimensiones reales" pageType="teorema"><div>Contenido</div></DiagramViewportFrame>);

    expect((screen.getByLabelText('Ancho de pantalla') as HTMLInputElement).value).toBe('1440');
    expect((screen.getByLabelText('Alto de pantalla') as HTMLInputElement).value).toBe('900');
    expect(screen.getByText('Área real del diagrama: 522 × 900')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ordenador' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Ordenador' }).getAttribute('title')).toContain('diagrama 522 × 900');
    fireEvent.click(screen.getByRole('button', { name: 'Móvil' }));
    expect((screen.getByLabelText('Ancho de pantalla') as HTMLInputElement).value).toBe('390');
    expect((screen.getByLabelText('Alto de pantalla') as HTMLInputElement).value).toBe('844');
    expect(screen.getByText('Área real del diagrama: 374 × 272')).toBeTruthy();
  });

  it('changes the real area when the publication context changes', () => {
    render(<DiagramViewportFrame title="Lienzo estable" subtitle="Sin realimentación" pageType="modelo"><div>Contenido</div></DiagramViewportFrame>);

    expect(screen.getByText('Área real del diagrama: 787 × 900')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Contexto de publicación'), { target: { value: 'balanced' } });
    expect(screen.getByText('Área real del diagrama: 720 × 900')).toBeTruthy();
    expect(screen.getByLabelText('Lienzo estable de 720 por 900 píxeles dentro de una pantalla de 1440 por 900')).toBeTruthy();
  });
});
