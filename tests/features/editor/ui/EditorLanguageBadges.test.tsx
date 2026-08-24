import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  EditorLanguageBadges,
  HeaderBadge,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderIconButton,
  HeaderActionButton,
  HeaderTitleInput,
} from '../../../../src/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';

describe('EditorLanguageBadges Component', () => {
  it('renders global mode with active language highlighted and handles language selection', () => {
    const onSelectLang = vi.fn();
    render(
      <EditorLanguageBadges
        mode="global"
        activeLang="es"
        onSelectLang={onSelectLang}
      />
    );

    // Active badge 'ES' is present
    const activeSpan = screen.getByText('ES');
    expect(activeSpan.tagName).toBe('SPAN');
    expect(activeSpan.className).toContain('bg-canela');

    // Switch buttons for other supported languages (e.g. EU, EN)
    const euButton = screen.getByText('EU');
    expect(euButton.tagName).toBe('BUTTON');
    fireEvent.click(euButton);
    expect(onSelectLang).toHaveBeenCalledWith('eu');
  });

  it('renders document mode with existing languages and create translation triggers', () => {
    const onSelectLang = vi.fn();
    const onCreateTranslation = vi.fn();

    render(
      <EditorLanguageBadges
        mode="document"
        activeLang="es"
        availableLangs={['es']}
        onSelectLang={onSelectLang}
        onCreateTranslation={onCreateTranslation}
      />
    );

    // ES is active
    expect(screen.getByText('ES').tagName).toBe('SPAN');

    // EU does not exist in availableLangs -> +EU create button
    const createEuButton = screen.getByText('+EU');
    expect(createEuButton.tagName).toBe('BUTTON');
    expect(createEuButton.className).toContain('border-dashed');
    fireEvent.click(createEuButton);
    expect(onCreateTranslation).toHaveBeenCalledWith('eu');
  });

  it('renders diagram mode and switches preview language', () => {
    const onSelectLang = vi.fn();
    render(
      <EditorLanguageBadges
        mode="diagram"
        activeLang="eu"
        onSelectLang={onSelectLang}
      />
    );

    // EU is active
    expect(screen.getByText('EU').tagName).toBe('SPAN');

    // ES is button
    const esButton = screen.getByText('ES');
    fireEvent.click(esButton);
    expect(onSelectLang).toHaveBeenCalledWith('es');
  });

  it('renders compact size classes for sidebar integration', () => {
    const { container } = render(
      <EditorLanguageBadges
        mode="document"
        size="compact"
        activeLang="es"
        availableLangs={['es']}
      />
    );

    const group = container.querySelector('[role="group"]');
    expect(group?.className).toContain('h-6');
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
