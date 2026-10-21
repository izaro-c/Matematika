import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Route, Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { BranchPage } from '@/content-pages/screens/BranchPage';
import { getLibrarySection } from '@/data/content/librarySections';
import { I18nProvider } from '@/i18n/I18nContext';

function renderBranch(code: string) {
  const { hook } = memoryLocation({ path: `/es/rama/${code}` });
  return render(
    <I18nProvider initialLang="es">
      <Router hook={hook}>
        <Route path="/es/rama/:id"><BranchPage /></Route>
      </Router>
    </I18nProvider>,
  );
}

describe('BranchPage (tomos y vocabulario)', () => {
  it('muestra las secciones como tomos y marca los que están en preparación', () => {
    const { container } = renderBranch('51');

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Geometría clásica');
    const tomes = within(screen.getByRole('navigation', { name: 'Tomos' })).getAllByRole('link');
    expect(tomes.map(tome => tome.querySelector('.ac-tome__code')?.textContent)).toEqual(['51A', '51M', '51P']);
    expect(container.querySelector('.ac-tome[href$="/rama/51P"]')?.hasAttribute('data-empty')).toBe(true);
    expect(container.querySelector('.ac-tome[href$="/rama/51A"]')?.hasAttribute('data-empty')).toBe(false);
  });

  it('agrupa las entradas por tipo en orden deductivo', () => {
    renderBranch('51');

    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent);
    expect(headings.indexOf('Axiomas')).toBeGreaterThan(-1);
    expect(headings.indexOf('Axiomas')).toBeLessThan(headings.indexOf('Teoremas'));
    expect(headings.indexOf('Definiciones')).toBeLessThan(headings.indexOf('Teoremas'));
  });

  it('una rama sin entradas lo dice y remite a su rama madre', () => {
    renderBranch('11');

    const note = screen.getByText(/Aún no hay entradas en esta rama\./);
    expect(within(note).getByRole('link', { name: 'Álgebra y Teoría de Números' })).toBeTruthy();
  });

  it('un código que no existe es la página no encontrada', () => {
    renderBranch('51N');

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('No hay ninguna entrada para «51N»');
  });
});

describe('getLibrarySection', () => {
  it('sube por la jerarquía MSC hasta la rama de la biblioteca', () => {
    expect(getLibrarySection('51A')?.key).toBe('IV');
    expect(getLibrarySection('geometria-algebraica')?.key).toBe('II');
    expect(getLibrarySection('fundamentos-y-logica')?.key).toBe('I');
    expect(getLibrarySection('zz')).toBeUndefined();
  });
});
