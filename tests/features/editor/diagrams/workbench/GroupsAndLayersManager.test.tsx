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

    fireEvent.click(screen.getByRole('button', { name: /Geometr/i }));
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

    fireEvent.click(screen.getByRole('button', { name: /Geometr/i }));
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
