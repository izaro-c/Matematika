// @vitest-environment jsdom
import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CreatePageDialog } from '@/features/editor/ui/create/CreatePageDialog';
import { PublishedRuntimePreview } from '@/features/editor/ui/preview/PublishedRuntimePreview';

describe('editor modal accessibility', () => {
  it('moves focus into create-page, traps Tab, closes with Escape and restores focus', async () => {
    const onClose = vi.fn();
    const view = render(<>
      <button type="button">Origen</button>
      <CreatePageDialog open={false} onClose={onClose} onCreate={vi.fn(async () => true)} />
    </>);
    const origin = screen.getByRole('button', { name: 'Origen' });
    origin.focus();
    view.rerender(<>
      <button type="button">Origen</button>
      <CreatePageDialog open onClose={onClose} onCreate={vi.fn(async () => true)} />
    </>);

    const dialog = screen.getByRole('dialog', { name: 'Nueva página estructurada' });
    const idInput = within(dialog).getByPlaceholderText('definicion-nueva');
    await waitFor(() => expect(document.activeElement).toBe(idInput));

    const lastEnabled = within(dialog).getByRole('button', { name: 'Cancelar' });
    const firstEnabled = within(dialog).getByRole('button', { name: 'Cerrar' });
    lastEnabled.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(firstEnabled);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastEnabled);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    view.rerender(<>
      <button type="button">Origen</button>
      <CreatePageDialog open={false} onClose={onClose} onCreate={vi.fn(async () => true)} />
    </>);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Origen' }));
  });

  it('announces loading and supports Escape in the shared published preview', async () => {
    const onClose = vi.fn();
    render(<PublishedRuntimePreview open path="/definiciones/prueba" hasPendingChanges revision={1} onClose={onClose} />);

    expect(screen.getByText('Cargando runtime publicado…')).toBeTruthy();
    const frame = screen.getByTitle('Página renderizada con el runtime publicado');
    fireEvent.load(frame);
    await waitFor(() => expect(screen.queryByText('Cargando runtime publicado…')).toBeNull());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
