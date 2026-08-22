import { describe, it, expect } from 'vitest';
import { db } from '@/data/content';
import { getLanguage, isSupportedLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, localizePath } from '@/i18n';
import { localizeDiagramSpec } from '@/diagrams';

describe('i18n system', () => {
  it('supports registered languages', () => {
    expect(isSupportedLanguage('es')).toBe(true);
    expect(isSupportedLanguage('eu')).toBe(true);
    expect(isSupportedLanguage('xyz')).toBe(false);

    expect(DEFAULT_LANGUAGE.code).toBe('es');
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(2);
  });

  it('retrieves correct language config and route segments', () => {
    const es = getLanguage('es');
    const eu = getLanguage('eu');

    expect(es.name).toBe('Español');
    expect(eu.name).toBe('Euskara');

    expect(es.routeSegments.ejercicio).toBe('ejercicio');
    expect(eu.routeSegments.ejercicio).toBe('ariketa');

    expect(es.routeSegments.definicion).toBe('definicion');
    expect(eu.routeSegments.definicion).toBe('definizioa');
  });

  it('retrieves content in Basque and falls back appropriately', () => {
    // Teorema de Pitágoras exists in both ES and EU
    const thmEs = db.getTheorem('teorema-pitagoras', 'es');
    const thmEu = db.getTheorem('teorema-pitagoras', 'eu');

    expect(thmEs).toBeDefined();
    expect(thmEu).toBeDefined();
    expect(thmEs?.title).toBe('Teorema de Pitágoras');
    expect(thmEu?.title).toBe('Pitagorasen teorema');

    const langs = db.getAvailableLanguages('teorema-pitagoras');
    expect(langs).toContain('es');
    expect(langs).toContain('eu');
    expect(db.isFallback('teorema-pitagoras', 'eu')).toBe(false);

    // Definition triangulo exists in both
    const defEu = db.getDefinition('triangulo', 'eu');
    expect(defEu).toBeDefined();
    expect(defEu?.title).toBe('Triangelua');

    // Untranslated theorem falls back to default Spanish
    const otherThm = db.getTheorem('teorema-tales', 'eu');
    expect(otherThm).toBeDefined();
    expect(db.isFallback('teorema-tales', 'eu')).toBe(true);
    const talesLangs = db.getAvailableLanguages('teorema-tales');
    expect(talesLangs).toContain('es');
    expect(talesLangs).not.toContain('eu');
  });

  it('translates and normalizes paths correctly across languages', () => {
    expect(localizePath('/', 'es')).toBe('/es');
    expect(localizePath('/', 'eu')).toBe('/eu');

    expect(localizePath('/diccionario', 'es')).toBe('/es/diccionario');
    expect(localizePath('/diccionario', 'eu')).toBe('/eu/hiztegia');
    expect(localizePath('/hiztegia', 'es')).toBe('/es/diccionario');

    expect(localizePath('/ejercicio/ejercicio-pitagoras-cateto', 'eu')).toBe('/eu/ariketa/ejercicio-pitagoras-cateto');
    expect(localizePath('/eu/ejercicio/ejercicio-pitagoras-cateto', 'eu')).toBe('/eu/ariketa/ejercicio-pitagoras-cateto');
    expect(localizePath('/es/ariketa/ejercicio-pitagoras-cateto', 'es')).toBe('/es/ejercicio/ejercicio-pitagoras-cateto');
  });

  it('translates diagram specs with localizeDiagramSpec', () => {
    const sampleSpec: any = {
      version: 3,
      renderer: 'matematika-diagram-renderer-v3',
      title: 'Teorema de Pitágoras',
      note: 'Arrastre los puntos...',
      objects: [
        { id: 'triangulo', label: 'triángulo ABC', objectType: 'path' },
        { id: 'segBC', label: 'cateto a', objectType: 'path' },
        { id: 'info', label: 'Panel', objectType: 'annotation', content: { text: 'Nota en español' } },
      ],
      steps: [
        { id: 'step1', label: 'Paso 1: Construcción' },
      ],
      translations: {
        eu: {
          title: 'Pitagorasen Teorema',
          note: 'Arrastatu puntuak...',
          steps: {
            step1: '1. Urratsa: Eraikuntza',
          },
          labels: {
            triangulo: 'ABC hirukia',
            segBC: 'a katetoa',
          },
          annotations: {
            info: 'Oharra euskaraz',
          },
        },
      },
    };

    // When translating to EU
    const euSpec = localizeDiagramSpec(sampleSpec, 'eu');
    expect(euSpec.title).toBe('Pitagorasen Teorema');
    expect(euSpec.note).toBe('Arrastatu puntuak...');
    expect(euSpec.steps[0].label).toBe('1. Urratsa: Eraikuntza');
    expect(euSpec.objects[0].label).toBe('ABC hirukia');
    expect(euSpec.objects[1].label).toBe('a katetoa');
    expect(euSpec.objects[2].content.text).toBe('Oharra euskaraz');

    // When translating to unknown or default
    const esSpec = localizeDiagramSpec(sampleSpec, 'es');
    expect(esSpec.title).toBe('Teorema de Pitágoras');
    expect(esSpec.objects[0].label).toBe('triángulo ABC');
  });

  it('provides complete seals translations for ES and EU', () => {
    const es = getLanguage('es');
    const eu = getLanguage('eu');

    expect(es.dictionary.metadata.seals.exercise.subtitle).toBe('RESUELTO');
    expect(eu.dictionary.metadata.seals.exercise.subtitle).toBe('EBATZIA');

    expect(es.dictionary.metadata.seals.read.subtitle).toBe('ASIMILADO');
    expect(eu.dictionary.metadata.seals.read.subtitle).toBe('BARNERATUA');
  });

  it('provides complete difficulty translations for ES and EU', () => {
    const es = getLanguage('es');
    const eu = getLanguage('eu');

    expect(es.dictionary.metadata.difficulties.basico).toBe('Básico');
    expect(eu.dictionary.metadata.difficulties.basico).toBe('Oinarrizkoa');
    expect(eu.dictionary.metadata.difficulties.intermedio).toBe('Tartekoa');
    expect(eu.dictionary.metadata.difficulties.avanzado).toBe('Aurreratua');
  });
});


