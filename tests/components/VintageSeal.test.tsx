import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { VintageSeal } from '@/components/ui/VintageSeal';
import { I18nProvider } from '@/i18n/I18nContext';

describe('VintageSeal component', () => {
  it('renders lean verification seal with proper classes and accessibility attributes', () => {
    render(
      <I18nProvider>
        <VintageSeal type="lean" />
      </I18nProvider>
    );

    const seal = screen.getByRole('status');
    expect(seal).toBeDefined();
    expect(seal.className).toContain('vintage-seal--musgo');
    expect(seal.textContent).toContain('LEAN 4');
    expect(seal.textContent).toContain('VERIFICADO');
  });

  it('renders exercise completed seal with salvia theme and animation class', () => {
    render(
      <I18nProvider>
        <VintageSeal type="exercise" animated={true} size="sm" />
      </I18nProvider>
    );

    const seal = screen.getByRole('status');
    expect(seal.className).toContain('vintage-seal--salvia');
    expect(seal.className).toContain('vintage-seal--sm');
    expect(seal.className).toContain('vintage-seal--animated');
    expect(seal.textContent).toContain('EJERCICIO');
    expect(seal.textContent).toContain('RESUELTO');
  });

  it('renders concept read seal with terracota theme', () => {
    render(
      <I18nProvider>
        <VintageSeal type="read" />
      </I18nProvider>
    );

    const seal = screen.getByRole('status');
    expect(seal.className).toContain('vintage-seal--terracota');
    expect(seal.textContent).toContain('CONCEPTO');
    expect(seal.textContent).toContain('ASIMILADO');
  });
});
