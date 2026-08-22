import { describe, expect, it } from 'vitest';
import { resolveJustification } from '@/lib/justifications/resolveJustification';
import {
  bodyHasLogicalJustification,
  extractJustificationIdsFromBody,
} from '@/fixed-pages/editor/ui/blocks/demoJustification';

describe('resolveJustification', () => {
  it('resolves step references', () => {
    const res1 = resolveJustification('paso-1', 'es');
    expect(res1?.badge).toBe('PASO');
    expect(res1?.stepNumber).toBe(1);
    expect(res1?.isStepLink).toBe(true);

    const resEu = resolveJustification('step-3', 'eu');
    expect(resEu?.badge).toBe('URRATSA');
    expect(resEu?.stepNumber).toBe(3);
  });

  it('resolves axioms correctly', () => {
    const res = resolveJustification('axioma-arquimedes', 'es');
    expect(res?.badge).toBe('AXIOMA');
    expect(res?.href).toContain('/axioma/axioma-arquimedes');
  });

  it('resolves formal logic rules from dictionary', () => {
    const resMp = resolveJustification('modus-ponens', 'es');
    expect(resMp?.badge).toBe('LÓGICA');
    expect(resMp?.title).toBe('Modus Ponens');
    expect(resMp?.isGlossary).toBe(true);

    const resMt = resolveJustification('modus_tollens', 'es');
    expect(resMt?.badge).toBe('LÓGICA');
    expect(resMt?.title).toBe('Modus Tollens');

    const resDm = resolveJustification('leyes-de-morgan', 'es');
    expect(resDm?.badge).toBe('LÓGICA');
  });

  it('resolves algebraic and arithmetic rules from dictionary', () => {
    const resDist = resolveJustification('propiedad-distributiva', 'es');
    expect(resDist?.badge).toBe('ÁLGEBRA');
    expect(resDist?.title).toBe('Propiedad Distributiva');
    expect(resDist?.isGlossary).toBe(true);

    const resSust = resolveJustification('sustitucion', 'es');
    expect(resSust?.badge).toBe('ÁLGEBRA');
    expect(resSust?.title).toBe('Principio de Sustitución');
  });

  it('resolves hypothesis', () => {
    const res = resolveJustification('hipotesis', 'es');
    expect(res?.badge).toBe('HIPÓTESIS');
  });
});

describe('demoJustification extraction and validation', () => {
  it('extracts concept links and proof step links from body', () => {
    const body = `
      Por el <ConceptLink targetId="axioma-arquimedes" isDependency={true}>axioma de Arquímedes</ConceptLink>
      y el paso <ProofStepLink step={2} />, aplicamos <ConceptLink targetId="modus-ponens" isDependency={true}>modus ponens</ConceptLink>.
    `;
    const ids = extractJustificationIdsFromBody(body);
    expect(ids).toEqual(['axioma-arquimedes', 'modus-ponens', 'paso-2']);
  });

  it('validates logical justifications correctly', () => {
    expect(bodyHasLogicalJustification('Por el <ProofStepLink step={1} />, se sigue.')).toBe(true);
    expect(bodyHasLogicalJustification('Por el axioma de completitud deducimos que...')).toBe(true);
    expect(bodyHasLogicalJustification('Por sustitución en la ecuación (1)...')).toBe(true);
    expect(bodyHasLogicalJustification('Por modus ponens se concluye.')).toBe(true);
    expect(bodyHasLogicalJustification('Texto sin ninguna justificación.')).toBe(false);
  });
});
