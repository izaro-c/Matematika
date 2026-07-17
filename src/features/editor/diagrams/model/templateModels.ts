import { DIAGRAM_RENDERER_ID, DIAGRAM_SPEC_VERSION } from '../../../../shared/diagrams/spec';
import { normalizeContentId } from '../../lib/editorContracts';
import { element, point, slider, step } from './diagramElements';
import { defaultCategory, defaultMode } from './diagramOptions';
import type { TemplateKind, VisualDiagramModel, VisualSlider, VisualStep } from './types';

export function createTemplateModel(kind: TemplateKind, title: string, metadataType: string): VisualDiagramModel {
  const base = {
    version: DIAGRAM_SPEC_VERSION,
    renderer: DIAGRAM_RENDERER_ID,
    title,
    componentId: normalizeContentId(title || 'diagrama-interactivo'),
    category: defaultCategory(metadataType),
    mode: defaultMode(metadataType),
    axis: false,
    grid: false,
    showLabels: true,
    viewport: {
      bounds: [-5, 5, 5, -5] as [number, number, number, number],
      home: [-5, 5, 5, -5] as [number, number, number, number],
      minZoom: 0.2,
      maxZoom: 12,
      padding: 0.16,
    },
    layers: [
      { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
      { id: 'controls', label: 'Controles', order: 1, visible: true, locked: false },
    ],
    groups: [],
    sliders: [] as VisualSlider[],
    steps: [] as VisualStep[],
    constraints: [],
    dependencies: [],
    note: 'Arrastre los puntos para explorar la figura.',
    extensions: {},
  };

  if (kind === 'lienzo-inicial') {
    return {
      ...base,
      points: [point('pA', 'A', 0, 0)],
      elements: [],
      note: 'Añada puntos y construcciones para reconstruir visualmente el diagrama.',
    };
  }

  if (kind === 'circunferencia') {
    return {
      ...base,
      points: [point('pO', 'O', 0, 0, true), point('pA', 'A', 2.4, 0)],
      elements: [
        element('circle', 'Circunferencia', 'circle', ['pO', 'pA'], 'salvia'),
        element('segOA', 'Radio OA', 'segment', ['pO', 'pA'], 'pizarra'),
        element('measRadio', 'Radio', 'text', ['pO'], 'carbon', true, { text: 'r = OA' }),
      ],
    };
  }

  if (kind === 'eje-cartesiano') {
    return {
      ...base,
      axis: true,
      grid: true,
      points: [point('pP', 'P', 2, 2)],
      sliders: [slider('sliderT', 'Parámetro t', -4.2, -4.2, 2)],
      elements: [
        element('coordX', 'Coordenada x', 'text', ['pP'], 'pizarra', true, { text: 'x(P)' }),
        element('coordY', 'Coordenada y', 'text', ['pP'], 'salvia', true, { text: 'y(P)' }),
      ],
    };
  }

  if (kind === 'modelo-estatico') {
    return {
      ...base,
      mode: 'diagram',
      points: [point('pA', 'A', -2, -1, true), point('pB', 'B', 2, -0.6, true), point('pC', 'C', 0, 2.2, true)],
      elements: [
        element('segAB', 'Recta AB del modelo', 'segment', ['pA', 'pB'], 'pizarra', true, { dashed: true }),
        element('segBC', 'Recta BC del modelo', 'segment', ['pB', 'pC'], 'pizarra', true, { dashed: true }),
        element('segCA', 'Recta CA del modelo', 'segment', ['pC', 'pA'], 'pizarra', true, { dashed: true }),
      ],
      note: 'Modelo fijo: los puntos no se arrastran en el producto final.',
    };
  }

  if (kind === 'cuadrilatero-clasificable') {
    return {
      ...base,
      points: [point('pA', 'A', -2.6, -1.5), point('pB', 'B', 2.2, -1.2), point('pC', 'C', 2.6, 1.7), point('pD', 'D', -1.8, 2)],
      elements: [
        element('polyCuadrilatero', 'Cuadrilátero', 'polygon', ['pA', 'pB', 'pC', 'pD'], 'salvia'),
        element('segAB', 'Lado AB', 'segment', ['pA', 'pB'], 'carbon'),
        element('segBC', 'Lado BC', 'segment', ['pB', 'pC'], 'carbon'),
        element('segCD', 'Lado CD', 'segment', ['pC', 'pD'], 'carbon'),
        element('segDA', 'Lado DA', 'segment', ['pD', 'pA'], 'carbon'),
        element('diagAC', 'Diagonal AC', 'segment', ['pA', 'pC'], 'pavo', true, { dashed: true }),
      ],
    };
  }

  if (kind === 'lugar-geometrico') {
    return {
      ...base,
      points: [
        point('pA', 'A', -2, 0, true),
        point('pB', 'B', 2, 0, true),
        point('pP', 'P', 0, 2.2, false, 'ocre', 'glider', 'lineMediatriz'),
      ],
      elements: [
        element('segAB', 'Segmento AB', 'segment', ['pA', 'pB'], 'carbon'),
        element('midAB', 'Punto medio de AB', 'midpoint', ['pA', 'pB'], 'terracota'),
        element('lineMediatriz', 'Mediatriz de AB', 'perpendicular', ['pA', 'pB', 'midAB'], 'pavo', true, { dashed: true }),
        element('segPA', 'Distancia PA', 'segment', ['pP', 'pA'], 'salvia', true, { dashed: true }),
        element('segPB', 'Distancia PB', 'segment', ['pP', 'pB'], 'salvia', true, { dashed: true }),
        element('measEquidistancia', 'Equidistancia', 'text', ['pP'], 'carbon', true, { text: 'PA = PB' }),
      ],
      note: 'Arrastre P sobre la mediatriz para explorar el lugar de puntos equidistantes de A y B.',
    };
  }

  if (kind === 'demostracion-pasos') {
    return {
      ...base,
      points: [point('pA', 'A', -2.5, -1.6), point('pB', 'B', 2.5, -1.6), point('pC', 'C', -0.2, 2.2)],
      elements: [
        element('step1Triangulo', 'Triángulo inicial', 'polygon', ['pA', 'pB', 'pC'], 'salvia'),
        element('segAB', 'Base AB', 'segment', ['pA', 'pB'], 'carbon'),
        element('step2Altura', 'Altura auxiliar', 'segment', ['pC', 'pA'], 'terracota', true, { dashed: true }),
        element('angleC', 'Ángulo C', 'angle', ['pA', 'pC', 'pB'], 'ocre'),
        element('step3Conclusion', 'Conclusión', 'text', ['pC'], 'musgo', true, { text: 'Paso final' }),
      ],
      steps: [
        step('step1', 'Paso 1', 'Presentar la figura inicial.', ['pA', 'pB', 'pC', 'step1Triangulo', 'segAB']),
        step('step2', 'Paso 2', 'Introducir la construcción auxiliar.', ['pA', 'pB', 'pC', 'step1Triangulo', 'segAB', 'step2Altura']),
        step('step3', 'Paso 3', 'Resaltar la conclusión.', ['pA', 'pB', 'pC', 'step1Triangulo', 'segAB', 'step2Altura', 'angleC', 'step3Conclusion']),
      ],
      note: 'Targets step1/step2/step3 preparados para ProofStep e InteractiveElement.',
    };
  }

  return {
    ...base,
    points: [point('pA', 'A', -2.4, -1.6), point('pB', 'B', 2.4, -1.4), point('pC', 'C', 0.2, 2.2)],
    elements: [
      element('polyTriangulo', 'Triángulo', 'polygon', ['pA', 'pB', 'pC'], 'salvia'),
      element('segAB', 'Lado AB', 'segment', ['pA', 'pB'], 'carbon'),
      element('segBC', 'Lado BC', 'segment', ['pB', 'pC'], 'carbon'),
      element('segCA', 'Lado CA', 'segment', ['pC', 'pA'], 'carbon'),
      element('angleC', 'Ángulo C', 'angle', ['pA', 'pC', 'pB'], 'ocre'),
      element('measArea', 'Área', 'text', ['pC'], 'pizarra', true, { text: 'Área variable' }),
    ],
  };
}
