import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/entities/content/loaders', () => ({
  contentLoaders: {
    mathMetas: {}, mathLoaders: {},
    thmMetas: {}, thmLoaders: {},
    methodMetas: {}, methodLoaders: {},
    demoMetas: {}, demoLoaders: {},
    defMetas: {}, defLoaders: {},
    exampleMetas: {}, exampleLoaders: {},
    exerciseMetas: {}, exerciseLoaders: {},
    usecaseMetas: {}, usecaseLoaders: {},
    planMetas: {}, planLoaders: {},
    axiomMetas: {}, axiomLoaders: {},
    modelMetas: {}, modelLoaders: {},
  },
}));

import { ContentStore } from '@/entities/content/ContentStore';

function createTestStore() {
  const store = new ContentStore();
  return store;
}

describe('ContentStore', () => {
  let store: ContentStore;

  beforeEach(() => {
    store = createTestStore();

    store.theorems.set('thm-1', {
      id: 'thm-1', slug: 'thm-1', title: 'Theorem 1', description: 'First theorem',
      type: 'teorema', corollaries: ['cor-1'], demos: ['demo-1'],
      requires: ['def-1'], examples: ['ex-1'], exercises: ['exer-1'],
      parentTheorem: undefined,
      tags: ['geo'], difficulty: 'básico',
      Component: (() => null) as never,
    });

    store.theorems.set('thm-2', {
      id: 'thm-2', slug: 'thm-2', title: 'Theorem 2', description: 'Second theorem',
      corollaries: [], demos: [], requires: [], examples: [], exercises: [],
      tags: ['algebra'], difficulty: 'intermedio',
      Component: (() => null) as never,
    });

    store.definitions.set('def-1', {
      id: 'def-1', slug: 'def-1', title: 'Definition 1', description: 'A definition',
      usedBy: ['thm-1'], color: 'blue',
      Component: (() => null) as never,
    });

    store.examples.set('ex-1', {
      id: 'ex-1', slug: 'ex-1', title: 'Example 1', description: 'An example',
      relatedTheorem: 'thm-1', difficulty: 'básico',
      Component: (() => null) as never,
    });

    store.exercises.set('exer-1', {
      id: 'exer-1', slug: 'exer-1', title: 'Exercise 1', description: 'An exercise',
      relatedTheorem: 'thm-1', difficulty: 'intermedio', hint: 'Try harder',
      Component: (() => null) as never,
    });

    store.mathematicians.set('gauss', {
      id: 'gauss', slug: 'gauss', name: 'Gauss', fullName: 'Gauss',
      description: 'Prince', birthYear: 1777,
      Component: (() => null) as never,
    });

    store.demos.set('demo-1', {
      id: 'demo-1', slug: 'demo-1', title: 'Demo 1', description: '',
      parentTheorem: 'thm-1',
      Component: (() => null) as never,
    });

    store.axioms.set('ax-1', {
      id: 'ax-1', slug: 'ax-1', title: 'Axiom 1', description: '',
      Component: (() => null) as never,
    });

    store.models.set('model-1', {
      id: 'model-1', slug: 'model-1', title: 'Model 1',
      axiomas: ['ax-1'],
      Component: (() => null) as never,
    });

    store.usecases.set('uc-1', {
      id: 'uc-1', slug: 'uc-1', title: 'Use Case 1',
      concept: 'thm-1', domain: 'ingeniería',
      Component: (() => null) as never,
    });

    store.methods.set('metodo-1', {
      id: 'metodo-1', slug: 'metodo-1', type: 'metodo', subtype: 'demostracion', title: 'Método 1', description: '',
      Component: (() => null) as never,
    });

    store.studyPlans.set('plan-1', {
      id: 'plan-1', slug: 'plan-1', title: 'Plan 1', description: '',
      requiredNodes: ['thm-1'],
      Component: (() => null) as never,
    });
  });

  describe('getTheorem', () => {
    it('returns theorem by id', () => {
      const t = store.getTheorem('thm-1');
      expect(t?.title).toBe('Theorem 1');
    });

    it('returns undefined for missing theorem', () => {
      expect(store.getTheorem('nonexistent')).toBeUndefined();
    });
  });

  describe('theorems map', () => {
    it('has all theorems', () => {
      expect(store.theorems.size).toBe(2);
    });
  });

  describe('getAllDefinitions', () => {
    it('returns all definitions', () => {
      const all = store.getAllDefinitions();
      expect(all).toHaveLength(1);
    });
  });

  describe('getDefinition', () => {
    it('returns definition by id', () => {
      const d = store.getDefinition('def-1');
      expect(d?.title).toBe('Definition 1');
    });

    it('returns undefined for missing', () => {
      expect(store.getDefinition('nope')).toBeUndefined();
    });
  });

  describe('getExample', () => {
    it('returns example by id', () => {
      expect(store.getExample('ex-1')?.title).toBe('Example 1');
    });
  });

  describe('getExercise', () => {
    it('returns exercise by id', () => {
      expect(store.getExercise('exer-1')?.title).toBe('Exercise 1');
    });
  });

  describe('getMathematicianById', () => {
    it('returns mathematician by id', () => {
      expect(store.getMathematicianById('gauss')?.name).toBe('Gauss');
    });
  });

  describe('getAllMathematicians', () => {
    it('returns mathematicians sorted by year', () => {
      store.mathematicians.set('euler', {
        id: 'euler', slug: 'euler', name: 'Euler', fullName: 'Euler',
        description: '', birthYear: 1707,
        Component: (() => null) as never,
      });
      const all = store.getAllMathematicians();
      expect(all[0].name).toBe('Euler');
      expect(all[1].name).toBe('Gauss');
    });
  });

  describe('getExamplesByTheorem', () => {
    it('returns examples related to a theorem', () => {
      const examples = store.getExamplesByTheorem('thm-1');
      expect(examples).toHaveLength(1);
      expect(examples[0].id).toBe('ex-1');
    });

    it('returns empty for theorem with no examples', () => {
      expect(store.getExamplesByTheorem('thm-2')).toEqual([]);
    });
  });

  describe('getExercisesByTheorem', () => {
    it('returns exercises related to a theorem', () => {
      const exercises = store.getExercisesByTheorem('thm-1');
      expect(exercises).toHaveLength(1);
      expect(exercises[0].id).toBe('exer-1');
    });
  });

  describe('getDemo', () => {
    it('returns demo by id', () => {
      expect(store.getDemo('demo-1')?.title).toBe('Demo 1');
    });
  });

  describe('getAxiom', () => {
    it('returns axiom by id', () => {
      expect(store.getAxiom('ax-1')?.title).toBe('Axiom 1');
    });
  });

  describe('getModel', () => {
    it('returns model by id', () => {
      expect(store.getModel('model-1')?.title).toBe('Model 1');
    });
  });

  describe('getUseCase', () => {
    it('returns use case by id', () => {
      expect(store.getUseCase('uc-1')?.title).toBe('Use Case 1');
    });
  });

  describe('getUseCasesByConcept', () => {
    it('returns use cases for a concept', () => {
      const cases = store.getUseCasesByConcept('thm-1');
      expect(cases).toHaveLength(1);
      expect(cases[0].id).toBe('uc-1');
    });
  });

  describe('getMethod', () => {
    it('returns a method by id', () => {
      expect(store.getMethod('metodo-1')?.title).toBe('Método 1');
    });
  });

  describe('getStudyPlan', () => {
    it('returns study plan by id', () => {
      expect(store.getStudyPlan('plan-1')?.title).toBe('Plan 1');
    });
  });

  describe('getTheoremsByAuthor', () => {
    it('returns theorems matching an author', () => {
      store.theorems.set('thm-3', {
        id: 'thm-3', slug: 'thm-3', title: 'Theorem 3', description: '',
        authors: ['gauss'],
        Component: (() => null) as never,
      });
      const thms = store.getTheoremsByAuthor('gauss');
      expect(thms).toHaveLength(1);
      expect(thms[0].id).toBe('thm-3');
    });
  });

  describe('Additional coverage', () => {
    it('getAllUseCases', () => {
      expect(store.getAllUseCases()).toHaveLength(1);
    });

    it('getAllExamples', () => {
      expect(store.getAllExamples()).toHaveLength(1);
    });

    it('getAllExercises', () => {
      expect(store.getAllExercises()).toHaveLength(1);
    });

    it('getAllDemos', () => {
      expect(store.getAllDemos()).toHaveLength(1);
    });

    it('getAllMethods', () => {
      expect(store.getAllMethods()).toHaveLength(1);
    });

    it('getAllAxioms', () => {
      expect(store.getAllAxioms()).toHaveLength(1);
    });

    it('getAllModels', () => {
      expect(store.getAllModels()).toHaveLength(1);
    });

    it('getAxiomaticSystem and getAllAxiomaticSystems', () => {
      store.axiomaticSystems.set('sys-1', {
        id: 'sys-1', slug: 'sys-1', title: 'Sys 1',
        description: '', axiomas: ['ax-1'],
        Component: (() => null) as never,
      });
      expect(store.getAllAxiomaticSystems()).toHaveLength(1);
      expect(store.getAxiomaticSystem('sys-1')?.title).toBe('Sys 1');
    });

    it('getModelsForSystem', () => {
      store.models.set('m2', {
        id: 'm2', slug: 'm2', title: 'M2',
        axiomas: [], satisfies: 'sys-1',
        Component: (() => null) as never,
      });
      store.models.set('m3', {
        id: 'm3', slug: 'm3', title: 'M3',
        axiomas: [], satisfies: ['sys-1', 'sys-2'],
        Component: (() => null) as never,
      });

      const models = store.getModelsForSystem('sys-1');
      expect(models).toHaveLength(2);
      expect(models.map(m => m.id)).toContain('m2');
      expect(models.map(m => m.id)).toContain('m3');
    });

    it('slugify', () => {
      expect(ContentStore.slugify('Teorema de Pitágoras!')).toBe('teorema-de-pitagoras');
      expect(ContentStore.slugify('-Algo Nuevo-')).toBe('algo-nuevo');
    });

    it('getBranchTaxonomy and getItemsByBranch', () => {
      const items = store.getItemsByBranch('51'); // Geometria
      expect(Array.isArray(items)).toBe(true);

      const tree = store.getBranchTaxonomy('51');
      expect(tree).toBeDefined();
    });
  });
});
