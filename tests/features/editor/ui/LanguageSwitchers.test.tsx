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
    expect(active.className).toContain('ed-chip--active');
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
    expect(create.className).toContain('ed-chip--missing');
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
    expect(screen.getByRole('group').className).toContain('ed-chips--compact');
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
  it('renders HeaderBadge with the shared badge skin and variants', () => {
    const { container } = render(
      <HeaderBadge variant="canela">Teorema</HeaderBadge>
    );
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('ed-badge');
    expect(badge?.className).toContain('ed-badge--canela');
  });

  it('renders HeaderPillButton as a quiet toggle button', () => {
    const onClick = vi.fn();
    render(
      <HeaderPillContainer>
        <HeaderPillButton active onClick={onClick}>Documentos</HeaderPillButton>
        <HeaderPillButton onClick={onClick}>Diagramas</HeaderPillButton>
      </HeaderPillContainer>
    );

    const docBtn = screen.getByText('Documentos');
    expect(docBtn.className).toContain('ed-button--quiet');
    expect(docBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('Diagramas').getAttribute('aria-pressed')).toBe('false');
  });

  it('renders HeaderIconButton and HeaderActionButton with the primitives', () => {
    render(
      <div>
        <HeaderIconButton aria-label="Toggle">Icon</HeaderIconButton>
        <HeaderActionButton variant="primary">Guardar</HeaderActionButton>
      </div>
    );

    expect(screen.getByLabelText('Toggle').className).toContain('ed-icon-button');
    expect(screen.getByText('Guardar').className).toContain('ed-button--primary');
  });

  it('renders HeaderTitleInput with the title skin', () => {
    const { container } = render(
      <HeaderTitleInput placeholder="Título" />
    );
    expect(container.querySelector('input')?.className).toContain('ed-title-input');
  });
});
