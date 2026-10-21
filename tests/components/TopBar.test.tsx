import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { TopBar } from '@/components/navigation/TopBar';
import { I18nProvider } from '@/i18n/I18nContext';

function renderAt(path: string) {
  const { hook } = memoryLocation({ path });
  return render(
    <I18nProvider initialLang="es">
      <Router hook={hook}>
        <TopBar />
      </Router>
    </I18nProvider>,
  );
}

describe('TopBar (marcapáginas)', () => {
  beforeEach(() => localStorage.clear());

  it('se recoge y despliega desde la punta y recuerda la elección', () => {
    localStorage.setItem('matematika.bookmark.open', '1');
    const { container } = renderAt('/es/definicion/angulo');
    const ribbon = container.querySelector('.ac-bookmark')!;
    const cloth = container.querySelector<HTMLElement>('#ac-bookmark-cloth')!;

    expect(ribbon.hasAttribute('data-open')).toBe(true);
    expect(cloth.hasAttribute('inert')).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Recoger el marcapáginas' }));

    expect(ribbon.hasAttribute('data-open')).toBe(false);
    expect(cloth.hasAttribute('inert')).toBe(true);
    expect(localStorage.getItem('matematika.bookmark.open')).toBe('0');
    expect(screen.getByRole('button', { name: 'Desplegar el marcapáginas' }).getAttribute('aria-expanded')).toBe('false');
  });

  it('lleva la vuelta a la biblioteca fuera de la portada', () => {
    renderAt('/es/definicion/angulo');
    expect(screen.getByRole('link', { name: 'Biblioteca' })).not.toBeNull();
  });
});
