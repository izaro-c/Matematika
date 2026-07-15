import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/entities/content', () => ({
  db: {
    getAllMethods: () => [
      {
        id: 'metodo-directo',
        slug: 'metodo-directo',
        subtype: 'demostracion',
        title: 'Método directo',
        description: 'Parte de las hipótesis y encadena inferencias válidas.',
      },
      {
        id: 'metodo-calculo',
        slug: 'metodo-calculo',
        subtype: 'calculo',
        title: 'Otro método',
        description: 'No pertenece a esta colección.',
      },
      {
        id: 'metodo-contradiccion',
        slug: 'metodo-contradiccion',
        subtype: 'demostracion',
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
    expect(screen.queryByText('Otro método')).toBeNull();

    const directMethod = screen.getByRole('link', { name: /Método directo/ });
    expect(directMethod.getAttribute('href')).toBe('/metodo/metodo-directo');
  });
});
