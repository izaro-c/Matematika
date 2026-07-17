import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContentLayout } from '@/widgets/layouts/ContentLayout';

describe('ContentLayout', () => {
  it('mantiene un único diagrama y expone su tratamiento visual', () => {
    const { container } = render(
      <ContentLayout
        pageType="metodo"
        variant="balanced"
        diagram={<div data-testid="diagram">Diagrama</div>}
      >
        <p>Texto</p>
      </ContentLayout>,
    );

    const layout = container.querySelector('.content-layout');
    expect(layout?.getAttribute('data-layout-variant')).toBe('balanced');
    expect(container.querySelectorAll('[data-testid="diagram"]')).toHaveLength(1);
    expect(container.querySelector('.mobile-content-header-separator--diagram-fallback')).not.toBeNull();
  });

  it('permite plegar el diagrama sin desmontarlo', () => {
    const { container } = render(
      <ContentLayout diagram={<div data-testid="diagram">Diagrama</div>}>
        <p>Texto</p>
      </ContentLayout>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar diagrama' }));

    expect(screen.getByRole('button', { name: 'Mostrar diagrama' }).getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('.content-diagram')?.getAttribute('data-mobile-collapsed')).toBe('true');
    expect(container.querySelector('.mobile-content-header-separator--collapsed')).not.toBeNull();
    expect(screen.getByTestId('diagram')).not.toBeNull();
  });

  it('añade un separador móvil cuando no existe diagrama', () => {
    const { container } = render(
      <ContentLayout>
        <p>Texto</p>
      </ContentLayout>,
    );

    const separator = container.querySelector('.mobile-content-header-separator--empty');
    expect(separator).not.toBeNull();
  });
});
