import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  SeccionPropiedades,
  PropiedadesGrupo,
  PropiedadItem,
} from '@/components/content/PropertiesSection';

describe('PropertiesSection Components', () => {
  it('renders SeccionPropiedades container with custom title', () => {
    render(
      <SeccionPropiedades title="Propiedades personalizadas">
        <div data-testid="child-content">Contenido</div>
      </SeccionPropiedades>
    );

    expect(screen.getByText('Propiedades personalizadas')).toBeDefined();
    expect(screen.getByTestId('child-content')).toBeDefined();
  });

  it('renders PropiedadesGrupo with group title', () => {
    render(
      <PropiedadesGrupo title="Grupo Métrico">
        <div data-testid="group-child">Ítem del grupo</div>
      </PropiedadesGrupo>
    );

    expect(screen.getByText('Grupo Métrico')).toBeDefined();
    expect(screen.getByTestId('group-child')).toBeDefined();
  });

  it('renders PropiedadItem with id, symbolic formula and direct demo link', () => {
    render(
      <PropiedadItem
        id="teorema-suma-angulos-triangulo"
        statement="$\alpha + \beta + \gamma = 180^\circ$"
      />
    );

    const titleLink = screen.getByRole('link', { name: /Teorema de la suma de los ángulos/i });
    expect(titleLink).toBeDefined();
    expect(titleLink.getAttribute('href')).toContain('/teorema/teorema-suma-angulos-triangulo');

    const demoLink = screen.getByRole('link', { name: /\[demo ❧\]/i });
    expect(demoLink).toBeDefined();
    expect(demoLink.getAttribute('href')).toContain('/demo/demo-suma-angulos-triangulo');
  });

  it('humanizes pending theorem IDs that are not yet in the database', () => {
    render(
      <PropiedadItem
        id="teorema-desigualdad-triangular"
        statement="$a < b + c$"
      />
    );

    const pendingLink = screen.getByRole('link', { name: 'Desigualdad triangular' });
    expect(pendingLink).toBeDefined();
    expect(pendingLink.getAttribute('href')).toContain('/construccion/teorema-desigualdad-triangular');
  });
});
