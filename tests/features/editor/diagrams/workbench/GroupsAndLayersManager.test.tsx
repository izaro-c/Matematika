import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model/scene/templateModels';
import { GroupsAndLayersManager } from '@/fixed-pages/editor/diagrams/ui/scene/GroupsAndLayersManager';

describe('GroupsAndLayersManager layer moves', () => {
  it('moves an item to another layer via the layer select', () => {
    const model = createTemplateModel('triangulo-deformable', 'Capas');
    const onUpdateModel = vi.fn();
    render(<GroupsAndLayersManager model={model} onUpdateModel={onUpdateModel} />);

    fireEvent.click(screen.getByText('Geometría'));
    const itemLayerSelect = screen.getAllByRole('combobox').find(
      el => (el as HTMLSelectElement).value === 'geometry',
    ) as HTMLSelectElement;
    expect(itemLayerSelect).toBeDefined();
    fireEvent.change(itemLayerSelect, { target: { value: 'annotations' } });

    expect(onUpdateModel).toHaveBeenCalled();
    const next = onUpdateModel.mock.calls.at(-1)?.[0];
    const moved = [
      ...next.points,
      ...next.elements,
      ...next.sliders,
    ].filter((item: { layerId: string }) => item.layerId === 'annotations');
    expect(moved.length).toBeGreaterThan(0);
    expect(next.layers.some((l: { id: string }) => l.id === 'annotations')).toBe(true);
  });

  it('reorders items with bring-forward button', () => {
    const model = createTemplateModel('triangulo-deformable', 'Capas');
    const onUpdateModel = vi.fn();
    render(<GroupsAndLayersManager model={model} onUpdateModel={onUpdateModel} />);

    fireEvent.click(screen.getByText('Geometría'));
    const forwardButtons = screen.getAllByTitle('Traer adelante');
    fireEvent.click(forwardButtons[1]);

    expect(onUpdateModel).toHaveBeenCalled();
    const next = onUpdateModel.mock.calls.at(-1)?.[0];
    const before = [...model.points]
      .filter(p => p.layerId === 'geometry')
      .sort((a, b) => b.order - a.order)
      .map(p => p.id);
    const after = [...next.points]
      .filter((p: { layerId: string }) => p.layerId === 'geometry')
      .sort((a: { order: number }, b: { order: number }) => b.order - a.order)
      .map((p: { id: string }) => p.id);
    expect(after).not.toEqual(before);
  });
});

describe('GroupsAndLayersManager group chips and canvas picking', () => {
  it('renders group member compact chips and toggles canvas picking mode', () => {
    const baseModel = createTemplateModel('triangulo-deformable', 'Grupos');
    const model = {
      ...baseModel,
      groups: [
        {
          id: 'grp_1',
          label: 'Grupo Triángulo',
          memberIds: ['A', 'B'],
          visible: true,
          locked: false,
          selection: { selectable: true, role: 'primary' as const },
        },
      ],
    };
    const onUpdateModel = vi.fn();
    const onTogglePickingGroupId = vi.fn();

    render(
      <GroupsAndLayersManager
        model={model}
        onUpdateModel={onUpdateModel}
        onTogglePickingGroupId={onTogglePickingGroupId}
      />
    );

    // Cambiar a la pestaña de Grupos
    fireEvent.click(screen.getByRole('button', { name: /^Grupos/i }));

    // Abrir grupo
    fireEvent.click(screen.getByText('Grupo Triángulo'));

    // Verificar botón 'Seleccionar en lienzo'
    const pickBtn = screen.getByRole('button', { name: /Seleccionar en lienzo/i });
    expect(pickBtn).toBeDefined();

    fireEvent.click(pickBtn);
    expect(onTogglePickingGroupId).toHaveBeenCalledWith('grp_1');
  });
});

describe('GroupsAndLayersManager layer reordering and ID sanitization', () => {
  it('allows changing the order of layers via move down and move up buttons', () => {
    const model = createTemplateModel('triangulo-deformable', 'Capas');
    const onUpdateModel = vi.fn();
    render(<GroupsAndLayersManager model={model} onUpdateModel={onUpdateModel} />);

    const initialFirstLayer = [...model.layers].sort((a, b) => a.order - b.order)[0].id;
    // Click "Mover capa abajo" on the first layer
    const moveDownButtons = screen.getAllByTitle('Mover capa abajo');
    fireEvent.click(moveDownButtons[0]);

    expect(onUpdateModel).toHaveBeenCalled();
    const next = onUpdateModel.mock.calls.at(-1)?.[0];
    const sortedLayerIds = [...next.layers].sort((a: { order: number }, b: { order: number }) => a.order - b.order).map((l: { id: string }) => l.id);
    expect(sortedLayerIds[1]).toBe(initialFirstLayer);
  });

  it('creates a new layer using the user name as sanitized valid ID', () => {
    const model = createTemplateModel('triangulo-deformable', 'Capas');
    const onUpdateModel = vi.fn();
    render(<GroupsAndLayersManager model={model} onUpdateModel={onUpdateModel} />);

    const input = screen.getByPlaceholderText('Nueva capa...');
    fireEvent.change(input, { target: { value: 'Líneas Guía (Construcción)' } });
    fireEvent.click(screen.getByRole('button', { name: /^Capa$/i }));

    expect(onUpdateModel).toHaveBeenCalled();
    const next = onUpdateModel.mock.calls.at(-1)?.[0];
    const createdLayer = next.layers.find((l: { label: string }) => l.label === 'Líneas Guía (Construcción)');
    expect(createdLayer).toBeDefined();
    expect(createdLayer.id).toBe('lineas_guia_construccion');
    expect(/^[a-z][a-z0-9_-]*$/.test(createdLayer.id)).toBe(true);
  });

  it('creates a new group using the user name as sanitized valid ID and handles numeric start', () => {
    const model = createTemplateModel('triangulo-deformable', 'Grupos');
    const onUpdateModel = vi.fn();
    render(<GroupsAndLayersManager model={model} onUpdateModel={onUpdateModel} />);

    fireEvent.click(screen.getByRole('button', { name: /^Grupos/i }));

    const input = screen.getByPlaceholderText('Nuevo grupo...');
    fireEvent.change(input, { target: { value: '3D Polígono Principal' } });
    fireEvent.click(screen.getByRole('button', { name: /^Grupo$/i }));

    expect(onUpdateModel).toHaveBeenCalled();
    const next = onUpdateModel.mock.calls.at(-1)?.[0];
    const createdGroup = next.groups.find((g: { label: string }) => g.label === '3D Polígono Principal');
    expect(createdGroup).toBeDefined();
    expect(createdGroup.id).toBe('grp_3d_poligono_principal');
    expect(createdGroup.targetId).toBe('grp_3d_poligono_principal');
    expect(/^[a-z][a-z0-9_-]*$/.test(createdGroup.id)).toBe(true);
  });

  it('ensures uniqueness when creating a layer with an existing ID name', () => {
    const model = createTemplateModel('triangulo-deformable', 'Capas');
    const onUpdateModel = vi.fn();
    render(<GroupsAndLayersManager model={model} onUpdateModel={onUpdateModel} />);

    const input = screen.getByPlaceholderText('Nueva capa...');
    fireEvent.change(input, { target: { value: 'geometry' } });
    fireEvent.click(screen.getByRole('button', { name: /^Capa$/i }));

    expect(onUpdateModel).toHaveBeenCalled();
    const next = onUpdateModel.mock.calls.at(-1)?.[0];
    const createdLayer = next.layers.find((l: { id: string }) => l.id === 'geometry_2');
    expect(createdLayer).toBeDefined();
  });

  it('allows deleting an empty default layer without resurrecting it', () => {
    const model = createTemplateModel('triangulo-deformable', 'Capas');
    const onUpdateModel = vi.fn();
    const { rerender } = render(<GroupsAndLayersManager model={model} onUpdateModel={onUpdateModel} />);

    // 'background' and 'annotations' layers have 0 items in triangulo-deformable
    const trashButtons = screen.getAllByTitle('Eliminar capa vacía');
    expect(trashButtons.length).toBeGreaterThan(0);
    fireEvent.click(trashButtons[0]);

    expect(onUpdateModel).toHaveBeenCalled();
    const next = onUpdateModel.mock.calls.at(-1)?.[0];
    expect(next.layers.some((l: { id: string }) => l.id === 'background')).toBe(false);

    // Re-render with the updated model to ensure it is not resurrected on next render/action
    rerender(<GroupsAndLayersManager model={next} onUpdateModel={onUpdateModel} />);
    expect(screen.queryByText('Fondo')).toBeNull();
  });
});

