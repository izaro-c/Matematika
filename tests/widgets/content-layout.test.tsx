import { render } from '@testing-library/react';
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
  });
});
