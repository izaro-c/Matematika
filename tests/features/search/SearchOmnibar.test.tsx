// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNavigationStore } from '@/features/search/NavigationStore';
import { SearchOmnibar } from '@/widgets/navigation/SearchOmnibar';
import { mscNames } from '@/entities/content/msc2020';
import { routePath } from '@/shared/lib/routeHelper';

const { setLocation } = vi.hoisted(() => ({ setLocation: vi.fn() }));

vi.mock('wouter', () => ({
  useLocation: () => ['/', setLocation],
}));

describe('SearchOmnibar', () => {
  beforeEach(() => {
    setLocation.mockReset();
    useNavigationStore.setState({ isSearchOpen: true });
  });

  afterEach(() => {
    cleanup();
    useNavigationStore.setState({ isSearchOpen: false });
  });

  it('offers one real type filter with an all-content option', () => {
    render(<SearchOmnibar />);

    const typeFilter = screen.getByRole('button', { name: 'Tipo de contenido' });
    expect(typeFilter.textContent).toContain('Todo el contenido');

    fireEvent.click(screen.getByRole('button', { name: 'Teoremas' }));

    expect(typeFilter.textContent).toContain('Teoremas');
    const results = screen.getAllByRole('option').filter(option => option.closest('#search-results'));
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(result => result.getAttribute('data-result-type') === 'teorema')).toBe(true);

    fireEvent.click(typeFilter);
    expect(within(screen.getByRole('listbox', { name: 'Tipos de contenido' })).getByRole('option', { name: 'Todo el contenido' })).toBeTruthy();
  });

  it('keeps the type filter separate from the written query', () => {
    render(<SearchOmnibar />);

    const searchbox = screen.getByRole('searchbox') as HTMLInputElement;
    fireEvent.change(searchbox, { target: { value: 'pitagoras' } });
    fireEvent.click(screen.getByRole('button', { name: 'Tipo de contenido' }));
    fireEvent.click(within(screen.getByRole('listbox', { name: 'Tipos de contenido' })).getByRole('option', { name: 'Teoremas' }));

    expect(searchbox.value).toBe('pitagoras');
    const result = screen.getAllByRole('option').find(option => option.textContent?.includes('Pitágoras'));
    expect(result?.getAttribute('data-result-type')).toBe('teorema');
  });

  it('opens MSC2020 results as branch pages', () => {
    render(<SearchOmnibar />);

    fireEvent.click(screen.getByRole('button', { name: 'Tipo de contenido' }));
    fireEvent.click(within(screen.getByRole('listbox', { name: 'Tipos de contenido' })).getByRole('option', { name: 'Clasificación MSC2020' }));

    const resultList = screen.getByRole('listbox', { name: 'Resultados de búsqueda' });
    const firstResult = within(resultList).getAllByRole('option')[0];
    const firstCode = Object.keys(mscNames)[0];

    expect(firstResult).toBeDefined();
    expect(firstCode).toBeDefined();
    expect(firstResult.textContent).not.toContain('Sin página propia');
    fireEvent.click(firstResult);
    expect(setLocation).toHaveBeenCalledWith(routePath(`/rama/${firstCode}`));
  });

  it('opens the selected MSC2020 result with Enter', () => {
    render(<SearchOmnibar />);

    fireEvent.click(screen.getByRole('button', { name: 'Tipo de contenido' }));
    fireEvent.click(within(screen.getByRole('listbox', { name: 'Tipos de contenido' })).getByRole('option', { name: 'Clasificación MSC2020' }));
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });

    const firstCode = Object.keys(mscNames)[0];
    expect(firstCode).toBeDefined();
    expect(setLocation).toHaveBeenCalledWith(routePath(`/rama/${firstCode}`));
  });
});
