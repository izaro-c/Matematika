import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Block } from '../../../../src/fixed-pages/editor/session/parser';

const original: Block[] = [
  { id: 's1', type: 'paragraph', content: 'Un ángulo es un par de semirrectas.' },
  { id: 's2', type: 'paragraph', content: 'Segundo párrafo.' },
];

vi.mock('../../../../src/fixed-pages/editor/session/useDocumentVersionBlocks', () => ({
  useDocumentVersionBlocks: (path: string | null) => (path ? { status: 'ready', path, blocks: original } : { status: 'idle' }),
}));

const { TranslationWorkbench } = await import('../../../../src/fixed-pages/editor/ui/workbench/TranslationWorkbench');

describe('TranslationWorkbench', () => {
  const target: Block[] = [
    { id: 't1', type: 'paragraph', content: 'Angelua zuzenerdi pare bat da.', metadata: { editable: true } },
    { id: 't2', type: 'paragraph', content: 'Segundo párrafo.', metadata: { editable: true } },
  ];

  it('alinea original y traducción y avisa de los bloques sin traducir', () => {
    const updateBlock = vi.fn();
    const { container } = render(
      <TranslationWorkbench
        blocks={target}
        currentLang="eu"
        originLang="es"
        originPath="content/mdx/es/definitions/angulo.mdx"
        originOptions={['es']}
        onOriginChange={() => {}}
        canEdit
        updateBlock={updateBlock}
        onEditVisually={() => {}}
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('Queda 1 bloque sin traducir');
    expect(Array.from(container.querySelectorAll('[data-translation-status]'), row => row.getAttribute('data-translation-status')))
      .toEqual(['translated', 'untranslated']);

    const editors = screen.getAllByRole('textbox');
    fireEvent.change(editors[1], { target: { value: 'Bigarren paragrafoa.' } });
    fireEvent.blur(editors[1]);
    expect(updateBlock).toHaveBeenCalledWith('t2', 'Bigarren paragrafoa.', { editable: true });
  });

  it('sin otra versión no hay nada que comparar', () => {
    render(
      <TranslationWorkbench blocks={target} currentLang="eu" originLang={null} originPath={null} originOptions={[]}
        onOriginChange={() => {}} canEdit updateBlock={() => {}} onEditVisually={() => {}} />,
    );
    expect(screen.getByText(/no tiene otra versión/)).toBeTruthy();
  });
});
