import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { GraphCartouche } from '@/fixed-pages/graph/ui/components/GraphCartouche';
import { introDelays, INK_TIMING } from '@/fixed-pages/graph/lib/graphInk';
import { I18nProvider } from '@/i18n/I18nContext';

afterEach(cleanup);

function renderCartouche(overrides: Partial<Parameters<typeof GraphCartouche>[0]> = {}) {
  const props = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    searchResults: [],
    onSearchSelect: vi.fn(),
    legend: [{ type: 'axioma', count: 21 }, { type: 'teorema', count: 11 }],
    focusType: null,
    pinnedType: null,
    onHoverType: vi.fn(),
    onTogglePin: vi.fn(),
    ...overrides,
  };
  const { hook } = memoryLocation({ path: '/es/grafo' });
  render(
    <I18nProvider initialLang="es">
      <Router hook={hook}>
        <GraphCartouche {...props} />
      </Router>
    </I18nProvider>,
  );
  return props;
}

describe('GraphCartouche', () => {
  it('rotula la página y lleva a las dependencias axiomáticas', () => {
    renderCartouche();
    expect(screen.getByRole('heading', { level: 1, name: 'Grafo visual' })).not.toBeNull();
    expect(screen.getByRole('link', { name: /Dependencias axiomáticas/ })).not.toBeNull();
  });

  it('pliega la leyenda y fija un tipo al pulsarlo', () => {
    const props = renderCartouche({ pinnedType: 'teorema' });
    const toggle = screen.getByRole('button', { name: /Leyenda/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    const axioms = screen.getByRole('button', { name: /Axiomas/ });
    expect(axioms.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: /Teoremas/ }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(axioms);
    expect(props.onTogglePin).toHaveBeenCalledWith('axioma');
  });
});

describe('introDelays', () => {
  it('entinta centro, ramas y contenido de dentro hacia fuera, repartido en el tiempo', () => {
    const rank = (n: { id: string }) => (n.id === 'c' ? 0 : n.id.startsWith('rama-') ? 1 : 3);
    const nodes = [
      { id: 'c', x: 0, y: 0 },
      { id: 'rama-a', x: 5, y: 0 },
      { id: 'cerca', x: 1, y: 0 },
      { id: 'medio', x: 2, y: 0 },
      { id: 'descolgado', x: 1000, y: 0 },
    ];
    const delays = introDelays(nodes, rank, { x: 0, y: 0 });
    expect(delays.get('c')).toBe(0);
    expect(delays.get('rama-a')!).toBeLessThan(delays.get('cerca')!);
    expect(delays.get('cerca')).toBe(INK_TIMING.introLead);
    // Por puesto, no por distancia: el descolgado no comprime a los demás al principio.
    expect(delays.get('medio')).toBe(INK_TIMING.introLead + INK_TIMING.introSpread / 2);
    expect(delays.get('descolgado')).toBe(INK_TIMING.introLead + INK_TIMING.introSpread);
  });
});
