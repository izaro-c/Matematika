// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SemanticLinker } from '@/features/editor/ui/components/SemanticLinker';

const files = [{
  path: 'database/content/definitions/punto.mdx', name: 'punto.mdx', type: 'content-definitions',
  kind: 'mdx-document' as const, capability: 'visual-exact' as const,
  capabilityLabel: 'Edición visual exacta', reason: 'Compatible',
}];

describe('Phase 7 semantic link selector', () => {
  it('creates a validated RefLink selected from the content catalog', () => {
    const onLinkCreated = vi.fn();
    render(<SemanticLinker isOpen onClose={vi.fn()} files={files} selectedText="punto auxiliar"
      onLinkCreated={onLinkCreated} position={{ top: 0, left: 0 }} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Ref' }));
    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/), { target: { value: 'punto' } });
    fireEvent.click(screen.getByRole('button', { name: /puntodefiniciónpunto/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Crear Vínculo' }));
    expect(onLinkCreated).toHaveBeenCalledWith('<RefLink targetId="punto">punto auxiliar</RefLink>');
  });

  it('rejects a diagram target that is not published by the linked diagram', () => {
    render(<SemanticLinker isOpen onClose={vi.fn()} files={files} selectedText="lado"
      onLinkCreated={vi.fn()} position={{ top: 0, left: 0 }}
      diagramTargets={[{ id: 'lado-ab', label: 'Lado AB', color: 'terracota', kind: 'segment' }]} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Gráfico' }));
    fireEvent.change(screen.getByPlaceholderText('Target manual avanzado'), { target: { value: 'lado-inexistente' } });
    expect(screen.getByRole('alert').textContent).toContain('no está publicado');
    expect((screen.getByRole('button', { name: 'Crear Vínculo' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
