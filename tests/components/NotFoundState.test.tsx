import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { NotFoundState, queryFromPath } from '@/components/ui/NotFoundState';
import { I18nProvider } from '@/i18n/I18nContext';
import { getContentTypeLabel } from '@/lib/theme/constants';

function renderAt(path: string) {
  const { hook } = memoryLocation({ path });
  return render(
    <I18nProvider initialLang="es">
      <Router hook={hook}>
        <NotFoundState />
      </Router>
    </I18nProvider>,
  );
}

describe('NotFoundState (entrada del índice)', () => {
  it('convierte el último tramo de la ruta en una consulta legible', () => {
    expect(queryFromPath('/es/teorema/teorema-de-pitagora')).toBe('teorema de pitagora');
    expect(queryFromPath('/es/definicion/%C3%A1ngulo_recto/')).toBe('ángulo recto');
    expect(queryFromPath('/')).toBe('');
  });

  it('titula con la ruta pedida y sugiere entradas cercanas bajo «véase»', () => {
    renderAt('/es/teorema/teorema-de-pitagora');

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('No hay ninguna entrada para «teorema de pitagora»');
    expect(screen.getByRole('heading', { level: 2, name: 'véase' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /Teorema de Pitágoras/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'volver a la biblioteca' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'buscar' })).toBeTruthy();
  });

  it('sin coincidencias no muestra «véase»', () => {
    renderAt('/es/qwerty/zzz');

    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });
});

describe('getContentTypeLabel con tipos del buscador', () => {
  it('localiza tipos con tilde y guion bajo', () => {
    expect(getContentTypeLabel('matemático', 'singular', 'eu')).toBe('Matematikaria');
    expect(getContentTypeLabel('definición', 'singular', 'en')).toBe('Definition');
    expect(getContentTypeLabel('caso_uso', 'singular', 'eu')).not.toBe('Caso_uso');
  });
});
