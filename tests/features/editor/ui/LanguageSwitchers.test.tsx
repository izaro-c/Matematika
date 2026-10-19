import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  DocumentVersions,
  UiLanguageSwitch,
  HeaderBadge,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderIconButton,
  HeaderActionButton,
  HeaderTitleInput,
} from '../../../../src/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';

describe('UiLanguageSwitch', () => {
  it('marca el idioma de la interfaz y cambia a otro', () => {
    const onSelect = vi.fn();
    render(<UiLanguageSwitch onSelect={onSelect} />);
    const active = screen.getByText('ES');
    expect(active.tagName).toBe('SPAN');
    expect(active.className).toContain('bg-canela');
    fireEvent.click(screen.getByText('EU'));
    expect(onSelect).toHaveBeenCalledWith('eu');
  });
});

describe('DocumentVersions', () => {
  it('salta a una versión existente y crea una traducción que falta', () => {
    const onSelect = vi.fn();
    const onCreate = vi.fn();
    render(
      <DocumentVersions
        activeLang="es"
        versions={[{ lang: 'es', status: 'present' }, { lang: 'en', status: 'present' }]}
        onSelect={onSelect}
        onCreate={onCreate}
      />,
    );
    expect(screen.getByText('ES').tagName).toBe('SPAN');
    fireEvent.click(screen.getByText('EN'));
    expect(onSelect).toHaveBeenCalledWith('en');
    const create = screen.getByText('+EU');
    expect(create.className).toContain('border-dashed');
    fireEvent.click(create);
    expect(onCreate).toHaveBeenCalledWith('eu');
  });

  it('señala la versión desfasada y oculta las que faltan sin onCreate', () => {
    render(
      <DocumentVersions
        size="compact"
        activeLang="es"
        versions={[{ lang: 'es', status: 'present' }, { lang: 'eu', status: 'outdated' }]}
      />,
    );
    expect(screen.getByText('EU').closest('button')?.getAttribute('title')).toMatch(/desfasada/);
    expect(screen.queryByText('+EN')).toBeNull();
    expect(screen.getByRole('group').className).toContain('h-6');
  });

  it('en un diagrama, el idioma que falta se ofrece para traducir las etiquetas', () => {
    const onCreate = vi.fn();
    render(<DocumentVersions kind="diagram" activeLang="es" versions={[{ lang: 'es', status: 'present' }]} onCreate={onCreate} />);
    const eu = screen.getByText('+EU');
    expect(eu.getAttribute('title')).toMatch(/etiquetas/);
    fireEvent.click(eu);
    expect(onCreate).toHaveBeenCalledWith('eu');
  });
});

describe('Header Primitives Cohesion', () => {
  it('renders HeaderBadge with uniform h-6 class and variants', () => {
    const { container } = render(
      <HeaderBadge variant="canela">Teorema</HeaderBadge>
    );
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('h-6');
    expect(badge?.className).toContain('text-canela');
  });

  it('renders HeaderPillContainer with h-8 and HeaderPillButton with h-7', () => {
    const onClick = vi.fn();
    render(
      <HeaderPillContainer>
        <HeaderPillButton active onClick={onClick}>Documentos</HeaderPillButton>
        <HeaderPillButton onClick={onClick}>Diagramas</HeaderPillButton>
      </HeaderPillContainer>
    );

    const docBtn = screen.getByText('Documentos');
    expect(docBtn.className).toContain('h-7');
    expect(docBtn.className).toContain('bg-lienzo');
  });

  it('renders HeaderIconButton and HeaderActionButton with h-8 height', () => {
    render(
      <div>
        <HeaderIconButton aria-label="Toggle">Icon</HeaderIconButton>
        <HeaderActionButton variant="primary">Guardar</HeaderActionButton>
      </div>
    );

    const iconBtn = screen.getByLabelText('Toggle');
    expect(iconBtn.className).toContain('h-8');
    expect(iconBtn.className).toContain('w-8');

    const actionBtn = screen.getByText('Guardar');
    expect(actionBtn.className).toContain('h-8');
  });

  it('renders HeaderTitleInput with h-8 height', () => {
    const { container } = render(
      <HeaderTitleInput placeholder="Título" />
    );
    const input = container.querySelector('input');
    expect(input?.className).toContain('h-8');
  });
});
