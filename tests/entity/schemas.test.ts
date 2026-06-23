import { describe, it, expect } from 'vitest';
import {
  MathematicianSchema,
  TheoremSchema,
  LessonSchema,
  DemoSchema,
  DefinitionSchema,
  ExampleSchema,
  ExerciseSchema,
  AxiomSchema,
  AxiomaticSystemSchema,
  ModelSchema,
  UseCaseSchema,
  StudyPlanSchema,
} from '@/entities/content/schemas';

function expectValid(schema: typeof MathematicianSchema, data: Record<string, unknown>) {
  const result = schema.safeParse(data);
  if (!result.success) throw new Error(`Expected valid, got: ${JSON.stringify(result.error)}`);
  expect(result.success).toBe(true);
}

function expectInvalid(schema: typeof MathematicianSchema, data: Record<string, unknown>) {
  const result = schema.safeParse(data);
  expect(result.success).toBe(false);
}

describe('MathematicianSchema', () => {
  const valid = { id: 'gauss', type: 'matematico', name: 'Gauss', description: 'Príncipe' };

  it('accepts minimal valid metadata', () => expectValid(MathematicianSchema, valid));
  it('accepts full metadata with optional fields', () => {
    expectValid(MathematicianSchema, {
      ...valid,
      birthYear: 1777, deathYear: 1855, country: 'Alemania',
      image: '/images/gauss.jpg', links: ['teorema-pitagoras'],
    });
  });
  it('rejects missing name', () => expectInvalid(MathematicianSchema, { id: 'x', type: 'matematico', description: 'desc' }));
  it('rejects missing description', () => expectInvalid(MathematicianSchema, { id: 'x', type: 'matematico', name: 'X' }));
  it('rejects wrong type', () => expectInvalid(MathematicianSchema, { ...valid, type: 'teorema' }));
  it('rejects birthYear as string', () => expectInvalid(MathematicianSchema, { ...valid, birthYear: '1777' }));
  it('rejects missing id (now required)', () => {
    const { id, ...noId } = valid;
    expectInvalid(MathematicianSchema, noId);
  });
});

describe('TheoremSchema', () => {
  const valid = { id: 'test-theorem', type: 'teorema', title: 'Test', description: 'A theorem' };

  it('accepts minimal valid metadata', () => expectValid(TheoremSchema, valid));
  it('accepts full metadata', () => {
    expectValid(TheoremSchema, {
      ...valid, statement: '∀x P(x)',
      color: 'terracota', branch: 'geometría',
      branches: ['geometría', 'álgebra'],
      lemmas: ['lema-1'], corollaries: ['cor-1'], demos: ['demo-1'],
      requires: ['def-1'], examples: ['ex-1'], exercises: ['exer-1'],
      parentTheorem: 'parent-1',
      tags: ['tag1'], difficulty: 'intermedio', links: ['link-1'],
    });
  });
  it('accepts type lema', () => expectValid(TheoremSchema, { ...valid, type: 'lema' }));
  it('accepts type corolario', () => expectValid(TheoremSchema, { ...valid, type: 'corolario' }));
  it('rejects invalid type', () => expectInvalid(TheoremSchema, { ...valid, type: 'definicion' }));
  it('rejects missing title', () => expectInvalid(TheoremSchema, { id: 'x', type: 'teorema', description: 'd' }));
  it('rejects missing description', () => expectInvalid(TheoremSchema, { id: 'x', type: 'teorema', title: 't' }));
  it('rejects invalid difficulty', () => expectInvalid(TheoremSchema, { ...valid, difficulty: 'super' }));
  it('rejects non-array corollaries', () => expectInvalid(TheoremSchema, { ...valid, corollaries: 'not-array' }));
  it('rejects missing id', () => expectInvalid(TheoremSchema, { type: 'teorema', title: 'Test', description: 'A theorem' }));
});

describe('LessonSchema', () => {
  const valid = { id: 'test-lesson', type: 'leccion', title: 'Lesson' };

  it('accepts minimal valid metadata', () => expectValid(LessonSchema, valid));
  it('accepts with description', () => expectValid(LessonSchema, { ...valid, description: 'desc' }));
  it('rejects missing title', () => expectInvalid(LessonSchema, { id: 'x', type: 'leccion' }));
  it('rejects wrong type', () => expectInvalid(LessonSchema, { id: 'x', type: 'teorema', title: 'x' }));
  it('rejects missing id', () => expectInvalid(LessonSchema, { type: 'leccion', title: 'Lesson' }));
});

describe('DemoSchema', () => {
  const valid = { id: 'demo-test', type: 'demostracion', title: 'Demo' };

  it('accepts minimal valid metadata', () => expectValid(DemoSchema, valid));
  it('accepts full metadata', () => {
    expectValid(DemoSchema, {
      ...valid, description: 'desc',
      parentTheorem: 'thm-1', lemmas: ['lema-1'],
      proofMethod: 'directo', authors: ['gauss'],
      tags: ['geo'], links: ['link-1'], layout: 'split',
      dependencias: ['def-1'],
    });
  });
  it('accepts all proof methods', () => {
    for (const method of ['directo', 'contradiccion', 'induccion', 'contraposicion', 'constructivo', 'geometrico', 'exhaustivo'] as const) {
      expectValid(DemoSchema, { ...valid, proofMethod: method });
    }
  });
  it('rejects invalid proof method', () => expectInvalid(DemoSchema, { ...valid, proofMethod: 'magico' }));
  it('rejects invalid layout', () => expectInvalid(DemoSchema, { ...valid, layout: 'three-columns' }));
  it('rejects missing title', () => expectInvalid(DemoSchema, { id: 'x', type: 'demostracion' }));
  it('rejects missing id', () => expectInvalid(DemoSchema, { type: 'demostracion', title: 'Demo' }));
});

describe('DefinitionSchema', () => {
  const valid = { id: 'def-test', type: 'definicion', title: 'Def', description: 'desc' };

  it('accepts minimal valid metadata', () => expectValid(DefinitionSchema, valid));
  it('accepts full metadata', () => {
    expectValid(DefinitionSchema, {
      ...valid, statement: 'stmt',
      tags: ['tag'], authors: ['gauss'], color: 'blue',
      usedBy: ['thm-1'], links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(DefinitionSchema, { id: 'x', type: 'definicion', description: 'd' }));
  it('rejects missing description', () => expectInvalid(DefinitionSchema, { id: 'x', type: 'definicion', title: 't' }));
  it('rejects missing id', () => expectInvalid(DefinitionSchema, { type: 'definicion', title: 'Def', description: 'desc' }));
});

describe('ExampleSchema', () => {
  const valid = { id: 'ex-test', type: 'ejemplo', title: 'Example' };

  it('accepts minimal valid metadata', () => expectValid(ExampleSchema, valid));
  it('accepts full metadata', () => {
    expectValid(ExampleSchema, {
      ...valid, description: 'desc',
      relatedTheorem: 'thm-1', requires: ['def-1'],
      tags: ['tag'], difficulty: 'básico', links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(ExampleSchema, { id: 'x', type: 'ejemplo' }));
  it('rejects missing id', () => expectInvalid(ExampleSchema, { type: 'ejemplo', title: 'Example' }));
});

describe('ExerciseSchema', () => {
  const valid = { id: 'exer-test', type: 'ejercicio', title: 'Exercise' };

  it('accepts minimal valid metadata', () => expectValid(ExerciseSchema, valid));
  it('accepts with hint', () => expectValid(ExerciseSchema, { ...valid, hint: 'Try X' }));
  it('rejects missing title', () => expectInvalid(ExerciseSchema, { id: 'x', type: 'ejercicio' }));
  it('rejects missing id', () => expectInvalid(ExerciseSchema, { type: 'ejercicio', title: 'Exercise' }));
});

describe('AxiomSchema', () => {
  const valid = { id: 'axiom-test', type: 'axioma', title: 'Axiom', description: 'desc' };

  it('accepts minimal valid metadata', () => expectValid(AxiomSchema, valid));
  it('accepts full metadata', () => {
    expectValid(AxiomSchema, {
      ...valid, statement: 'stmt',
      tags: ['tag'], authors: ['euclides'], links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(AxiomSchema, { id: 'x', type: 'axioma', description: 'd' }));
  it('rejects missing id', () => expectInvalid(AxiomSchema, { type: 'axioma', title: 'Axiom', description: 'desc' }));
});

describe('AxiomaticSystemSchema', () => {
  const valid = { id: 'sys-test', type: 'sistema-axiomatico', title: 'System', description: 'desc', axiomas: ['ax-1', 'ax-2'] };

  it('accepts minimal valid metadata', () => expectValid(AxiomaticSystemSchema, valid));
  it('accepts full metadata', () => {
    expectValid(AxiomaticSystemSchema, {
      ...valid,
      models: ['model-1'], mathematicians: ['hilbert'],
      tags: ['geo'], links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(AxiomaticSystemSchema, { id: 'x', type: 'sistema-axiomatico', description: 'd', axiomas: [] }));
  it('rejects missing axiomas', () => expectInvalid(AxiomaticSystemSchema, { id: 'x', type: 'sistema-axiomatico', title: 'S', description: 'd' }));
  it('rejects wrong type', () => expectInvalid(AxiomaticSystemSchema, { ...valid, type: 'modelo' }));
  it('rejects missing id', () => expectInvalid(AxiomaticSystemSchema, { type: 'sistema-axiomatico', title: 'System', description: 'desc', axiomas: ['ax-1'] }));
});

describe('ModelSchema', () => {
  const valid = { id: 'model-test', type: 'modelo', title: 'Model', satisfies: 'sistema-absoluto' };

  it('accepts minimal valid metadata', () => expectValid(ModelSchema, valid));
  it('accepts with axioms_verified', () => expectValid(ModelSchema, { ...valid, axioms_verified: ['ax-1', 'ax-2'] }));
  it('accepts with hasDiagram', () => expectValid(ModelSchema, { ...valid, hasDiagram: true }));
  it('rejects missing title', () => expectInvalid(ModelSchema, { id: 'x', type: 'modelo', satisfies: 'sys' }));
  it('rejects missing satisfies', () => expectInvalid(ModelSchema, { id: 'x', type: 'modelo', title: 'M' }));
  it('rejects missing id', () => expectInvalid(ModelSchema, { type: 'modelo', title: 'Model', satisfies: 'sistema-absoluto' }));
});

describe('UseCaseSchema', () => {
  const valid = { id: 'uc-test', type: 'caso-de-uso', title: 'Use Case' };

  it('accepts minimal valid metadata', () => expectValid(UseCaseSchema, valid));
  it('accepts full metadata', () => {
    expectValid(UseCaseSchema, {
      ...valid, description: 'desc',
      concept: 'thm-1', domain: 'ingeniería',
      tags: ['tag'], difficulty: 'intermedio', links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(UseCaseSchema, { id: 'x', type: 'caso-de-uso' }));
  it('rejects missing id', () => expectInvalid(UseCaseSchema, { type: 'caso-de-uso', title: 'Use Case' }));
});

describe('StudyPlanSchema', () => {
  const valid = { id: 'plan-1', type: 'plan-de-estudio', title: 'Plan', description: 'desc' };

  it('accepts valid metadata (id is required)', () => expectValid(StudyPlanSchema, valid));
  it('accepts with requiredNodes', () => {
    expectValid(StudyPlanSchema, { ...valid, requiredNodes: ['node-1', 'node-2'] });
  });
  it('rejects missing id (required for StudyPlan)', () => {
    expectInvalid(StudyPlanSchema, { type: 'plan-de-estudio', title: 'P', description: 'd' });
  });
  it('rejects missing title', () => expectInvalid(StudyPlanSchema, { id: 'x', type: 'plan-de-estudio', description: 'd' }));
  it('rejects missing description', () => expectInvalid(StudyPlanSchema, { id: 'x', type: 'plan-de-estudio', title: 't' }));
});
