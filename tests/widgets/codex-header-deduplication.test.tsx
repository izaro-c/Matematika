import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import { DemonstrationHeaderProvider } from '@/shared/lib/DemonstrationHeaderContext';
import { CodexLayout } from '@/widgets/layouts/CodexLayout';

vi.mock('wouter', () => ({
  useLocation: () => ['/demo/demo-area-rectangulo', vi.fn()],
  Link: ({ children, href }: { children: React.ReactNode; href?: string }) => <a href={href}>{children}</a>,
}));

vi.mock('@/entities/content', () => ({
  db: {
    getDemo: (id: string) => (id === 'demo-area-rectangulo' ? {
      id: 'demo-area-rectangulo',
      title: 'Demostración: Área del Rectángulo',
      description: 'Prueba por casos',
      authors: ['hilbert'],
      parentTheorem: 'teorema-area-rectangulo',
      proofMethod: 'metodo-exhaustivo',
    } : null),
    getTheorem: () => ({ id: 'teorema-area-rectangulo', title: 'Área del Rectángulo' }),
    getMethod: () => ({ title: 'Método Exhaustivo' }),
    getMathematicianById: () => null,
  },
}));

describe('CodexLayout header deduplication', () => {
  it('renders ContentHeader only once (1 mobile + 1 desktop) when multiple CodexLayout sections exist in a demonstration', () => {
    render(
      <MathProvider>
        <DemonstrationHeaderProvider>
          <CodexLayout diagram={<div>Diagram 1</div>}>
            <div>Sección 1</div>
          </CodexLayout>
          <CodexLayout diagram={<div>Diagram 2</div>}>
            <div>Sección 2</div>
          </CodexLayout>
        </DemonstrationHeaderProvider>
      </MathProvider>
    );

    // CodexLayout renders 1 mobile header (lg:hidden) and 1 desktop header (hidden lg:block) for the FIRST section only.
    const titleElements = screen.getAllByRole('heading', { name: 'Demostración: Área del Rectángulo' });
    expect(titleElements).toHaveLength(2);
    expect(screen.getByText('Sección 1')).toBeDefined();
    expect(screen.getByText('Sección 2')).toBeDefined();
  });

  it('renders ContentHeader (1 mobile + 1 desktop) when rendered standalone without provider', () => {
    render(
      <MathProvider>
        <CodexLayout diagram={<div>Diagram 1</div>}>
          <div>Sección Única</div>
        </CodexLayout>
      </MathProvider>
    );

    const titleElements = screen.getAllByRole('heading', { name: 'Demostración: Área del Rectángulo' });
    expect(titleElements).toHaveLength(2);
  });
});
