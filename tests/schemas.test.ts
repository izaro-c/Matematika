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
  ModelSchema,
  UseCaseSchema,
  StudyPlanSchema,
} from '../src/store/schemas';

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
  it('accepts optional id omitted', () => {
    const { id, ...noId } = valid;
    expectValid(MathematicianSchema, noId);
  });
});

describe('TheoremSchema', () => {
  const valid = { type: 'teorema', title: 'Test', description: 'A theorem' };

  it('accepts minimal valid metadata', () => expectValid(TheoremSchema, valid));
  it('accepts full metadata', () => {
    expectValid(TheoremSchema, {
      ...valid, id: 'test-theorem', statement: '∀x P(x)',
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
  it('rejects missing title', () => expectInvalid(TheoremSchema, { type: 'teorema', description: 'd' }));
  it('rejects missing description', () => expectInvalid(TheoremSchema, { type: 'teorema', title: 't' }));
  it('rejects invalid difficulty', () => expectInvalid(TheoremSchema, { ...valid, difficulty: 'super' }));
  it('rejects non-array corollaries', () => expectInvalid(TheoremSchema, { ...valid, corollaries: 'not-array' }));
});

describe('LessonSchema', () => {
  const valid = { type: 'leccion', title: 'Lesson' };

  it('accepts minimal valid metadata', () => expectValid(LessonSchema, valid));
  it('accepts with description', () => expectValid(LessonSchema, { ...valid, description: 'desc' }));
  it('rejects missing title', () => expectInvalid(LessonSchema, { type: 'leccion' }));
  it('rejects wrong type', () => expectInvalid(LessonSchema, { type: 'teorema', title: 'x' }));
});

describe('DemoSchema', () => {
  const valid = { type: 'demostracion', title: 'Demo' };

  it('accepts minimal valid metadata', () => expectValid(DemoSchema, valid));
  it('accepts full metadata', () => {
    expectValid(DemoSchema, {
      ...valid, id: 'demo-1', description: 'desc',
      parentTheorem: 'thm-1', lemmas: ['lema-1'],
      proofMethod: 'directo', authors: ['gauss'],
      tags: ['geo'], links: ['link-1'], layout: 'split',
      dependencias: ['def-1'],
    });
  });
  it('accepts all proof methods', () => {
    for (const method of ['directo', 'contradiccion', 'induccion', 'contraposicion', 'constructivo', 'geometrico', 'exhaustivo', 'reduccion'] as const) {
      expectValid(DemoSchema, { ...valid, proofMethod: method });
    }
  });
  it('rejects invalid proof method', () => expectInvalid(DemoSchema, { ...valid, proofMethod: 'magico' }));
  it('rejects invalid layout', () => expectInvalid(DemoSchema, { ...valid, layout: 'three-columns' }));
  it('rejects missing title', () => expectInvalid(DemoSchema, { type: 'demostracion' }));
});

describe('DefinitionSchema', () => {
  const valid = { type: 'definicion', title: 'Def', description: 'desc' };

  it('accepts minimal valid metadata', () => expectValid(DefinitionSchema, valid));
  it('accepts full metadata', () => {
    expectValid(DefinitionSchema, {
      ...valid, id: 'def-1', statement: 'stmt',
      tags: ['tag'], authors: ['gauss'], color: 'blue',
      usedBy: ['thm-1'], links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(DefinitionSchema, { type: 'definicion', description: 'd' }));
  it('rejects missing description', () => expectInvalid(DefinitionSchema, { type: 'definicion', title: 't' }));
});

describe('ExampleSchema', () => {
  const valid = { type: 'ejemplo', title: 'Example' };

  it('accepts minimal valid metadata', () => expectValid(ExampleSchema, valid));
  it('accepts full metadata', () => {
    expectValid(ExampleSchema, {
      ...valid, id: 'ex-1', description: 'desc',
      relatedTheorem: 'thm-1', requires: ['def-1'],
      tags: ['tag'], difficulty: 'básico', links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(ExampleSchema, { type: 'ejemplo' }));
});

describe('ExerciseSchema', () => {
  const valid = { type: 'ejercicio', title: 'Exercise' };

  it('accepts minimal valid metadata', () => expectValid(ExerciseSchema, valid));
  it('accepts with hint', () => expectValid(ExerciseSchema, { ...valid, hint: 'Try X' }));
  it('rejects missing title', () => expectInvalid(ExerciseSchema, { type: 'ejercicio' }));
});

describe('AxiomSchema', () => {
  const valid = { type: 'axioma', title: 'Axiom', description: 'desc' };

  it('accepts minimal valid metadata', () => expectValid(AxiomSchema, valid));
  it('accepts full metadata', () => {
    expectValid(AxiomSchema, {
      ...valid, id: 'axiom-1', statement: 'stmt',
      tags: ['tag'], authors: ['euclides'], links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(AxiomSchema, { type: 'axioma', description: 'd' }));
});

describe('ModelSchema', () => {
  const valid = { type: 'modelo', title: 'Model' };

  it('accepts minimal valid metadata', () => expectValid(ModelSchema, valid));
  it('accepts with axioms', () => expectValid(ModelSchema, { ...valid, axiomas: ['ax-1', 'ax-2'] }));
  it('rejects missing title', () => expectInvalid(ModelSchema, { type: 'modelo' }));
});

describe('UseCaseSchema', () => {
  const valid = { type: 'caso_de_uso', title: 'Use Case' };

  it('accepts minimal valid metadata', () => expectValid(UseCaseSchema, valid));
  it('accepts full metadata', () => {
    expectValid(UseCaseSchema, {
      ...valid, id: 'uc-1', description: 'desc',
      concept: 'thm-1', domain: 'ingeniería',
      tags: ['tag'], difficulty: 'intermedio', links: ['link-1'],
    });
  });
  it('rejects missing title', () => expectInvalid(UseCaseSchema, { type: 'caso_de_uso' }));
});

describe('StudyPlanSchema', () => {
  const valid = { id: 'plan-1', type: 'plan_de_estudio', title: 'Plan', description: 'desc' };

  it('accepts valid metadata (id is required)', () => expectValid(StudyPlanSchema, valid));
  it('accepts with requiredNodes', () => {
    expectValid(StudyPlanSchema, { ...valid, requiredNodes: ['node-1', 'node-2'] });
  });
  it('rejects missing id (required for StudyPlan)', () => {
    expectInvalid(StudyPlanSchema, { type: 'plan_de_estudio', title: 'P', description: 'd' });
  });
  it('rejects missing title', () => expectInvalid(StudyPlanSchema, { id: 'x', type: 'plan_de_estudio', description: 'd' }));
  it('rejects missing description', () => expectInvalid(StudyPlanSchema, { id: 'x', type: 'plan_de_estudio', title: 't' }));
});
