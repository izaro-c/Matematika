import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/entities/content', () => ({
  db: {
    getAllLessons: () => [
      {
        id: 'leccion-metodo-directo',
        slug: 'metodo-directo',
        title: 'Método directo',
        description: 'Parte de las hipótesis y encadena inferencias válidas.',
      },
      {
        id: 'leccion-ajena',
        slug: 'leccion-ajena',
        title: 'Otra lección',
        description: 'No pertenece a esta colección.',
      },
      {
        id: 'leccion-metodo-contradiccion',
        slug: 'metodo-contradiccion',
        title: 'Demostración por contradicción',
        description: 'La negación de la conclusión conduce a una contradicción.',
      },
    ],
  },
}));

import { MethodsPage } from '@/pages/MethodsPage';

describe('MethodsPage', () => {
  it('presenta los métodos como una colección no ordenada de enlaces', () => {
    const { hook } = memoryLocation({ path: '/metodos', static: true });

    render(
      <Router hook={hook}>
        <MethodsPage />
      </Router>,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Métodos de demostración');
    expect(screen.getByRole('list').tagName).toBe('UL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('2 métodos')).toBeTruthy();
    expect(screen.queryByText('Otra lección')).toBeNull();

    const directMethod = screen.getByRole('link', { name: /Método directo/ });
    expect(directMethod.getAttribute('href')).toBe('/metodo-directo');
  });
});
