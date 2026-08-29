import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { MDXProvider } from '@mdx-js/react';
import { AppRouter } from '@/app/routes/AppRouter';
import { I18nProvider } from '@/i18n';

beforeAll(() => {
  // Polyfill ResizeObserver for @xyflow/react in jsdom
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock canvas 2D context for react-force-graph-2d in jsdom
  const createCanvasContext = () => ({
    scale: () => {},
    translate: () => {},
    clearRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    fillRect: () => {},
    stroke: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    strokeRect: () => {},
    rect: () => {},
    measureText: () => ({ width: 0 }),
    fillText: () => {},
    strokeText: () => {},
    restore: () => {},
    save: () => {},
    rotate: () => {},
    setTransform: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    drawImage: () => {},
    getImageData: () => ({ data: [], width: 0, height: 0 }),
    putImageData: () => {},
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    canvas: document.createElement('canvas'),
  } as unknown as CanvasRenderingContext2D);

  HTMLCanvasElement.prototype.getContext = function () {
    return createCanvasContext();
  };
});

// Mock content store to avoid MDX import failures in test environment
vi.mock('@/data/content', () => ({
  db: {
    getAllMethods: () => [],
    getAllMathematicians: () => [],
    getAllDefinitions: () => [],
    getAllExamples: () => [],
    getAllExercises: () => [],
    getAllAxioms: () => [],
    getAllModels: () => [],
    getAllStudyPlans: () => [],
    getAllUseCases: () => [],
    getAllDemos: () => [],
    getTheorem: () => undefined,
    getDefinition: () => undefined,
    getExample: () => undefined,
    getExercise: () => undefined,
    getAxiom: () => undefined,
    getModel: () => undefined,
    getStudyPlan: () => undefined,
    getDemo: () => undefined,
    getUseCase: () => undefined,
    getMathematicianById: () => undefined,
    getTheoremsByAuthor: () => [],
    getExamplesByTheorem: () => [],
    getExercisesByTheorem: () => [],
    getUseCasesByConcept: () => [],
    getItemsByBranch: () => [],
    getBranchTaxonomy: () => ({ breadcrumbs: [], name: '', id: '', slug: '', subBranches: [], directItems: [] }),
    theorems: new Map(),
    definitions: new Map(),
    examples: new Map(),
    exercises: new Map(),
    axioms: new Map(),
    models: new Map(),
    studyPlans: new Map(),
    demos: new Map(),
    usecases: new Map(),
    mathematicians: new Map(),
    methods: new Map(),
  },
}));

function renderWithRouter(initialRoute: string) {
  const { hook } = memoryLocation({ path: initialRoute });
  return render(
    <MDXProvider components={{}}>
      <Router hook={hook}>
        <I18nProvider>
          <AppRouter />
        </I18nProvider>
      </Router>
    </MDXProvider>
  );
}

describe('AppRouter integration', () => {
  it('renders home page at / without crashing', () => {
    expect(() => renderWithRouter('/')).not.toThrow();
  });

  it('renders grafo page at /grafo without crashing', () => {
    expect(() => renderWithRouter('/grafo')).not.toThrow();
  });

  it('renders axiomas page at /axiomas without crashing', () => {
    expect(() => renderWithRouter('/axiomas')).not.toThrow();
  });

  it('renders editor page at /editor without crashing', () => {
    expect(() => renderWithRouter('/editor')).not.toThrow();
  });

  it('renders diccionario page at /diccionario without crashing', () => {
    expect(() => renderWithRouter('/diccionario')).not.toThrow();
  });

  it('renders metodos page at /metodos without crashing', () => {
    expect(() => renderWithRouter('/metodos')).not.toThrow();
  });

  it('renders historia page at /historia without crashing', () => {
    expect(() => renderWithRouter('/historia')).not.toThrow();
  });

  it('renders 404 page for unknown route without crashing', () => {
    expect(() => renderWithRouter('/ruta-inexistente')).not.toThrow();
  });

  it('renders construction page in Spanish at /es/construccion/teorema-test', async () => {
    const { findByText } = renderWithRouter('/es/construccion/teorema-test');
    expect(await findByText('En Construcción')).toBeDefined();
    expect(await findByText(/teorema test/i)).toBeDefined();
  });

  it('renders construction page in Basque at /eu/eraikuntzan/teorema-test', async () => {
    const { findByText } = renderWithRouter('/eu/eraikuntzan/teorema-test');
    expect(await findByText('Eraikuntzan')).toBeDefined();
    expect(await findByText(/teorema test/i)).toBeDefined();
  });

  it('renders construction page in English at /en/construction/teorema-test', async () => {
    const { findByText } = renderWithRouter('/en/construction/teorema-test');
    expect(await findByText('Under Construction')).toBeDefined();
    expect(await findByText(/teorema test/i)).toBeDefined();
  });

  it('normalizes cross-language construction segment from /eu/construccion/teorema-test to Basque', async () => {
    const { findByText } = renderWithRouter('/eu/construccion/teorema-test');
    expect(await findByText('Eraikuntzan')).toBeDefined();
    expect(await findByText(/teorema test/i)).toBeDefined();
  });

  it('normalizes cross-language construction segment from /en/construccion/teorema-test to English', async () => {
    const { findByText } = renderWithRouter('/en/construccion/teorema-test');
    expect(await findByText('Under Construction')).toBeDefined();
    expect(await findByText(/teorema test/i)).toBeDefined();
  });

  it('normalizes legacy 2-segment construction route from /construccion/teorema-test', async () => {
    const { findByText } = renderWithRouter('/construccion/teorema-test');
    expect(await findByText(/Construcción|Eraikuntzan|Under Construction/i)).toBeDefined();
    expect(await findByText(/teorema test/i)).toBeDefined();
  });
});
