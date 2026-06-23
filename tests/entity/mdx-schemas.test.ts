import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseMDX } from '@/shared/lib/mdxParser';
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
const SCHEMA_MAP: Record<string, import('zod').ZodTypeAny> = {
  axioma: AxiomSchema,
  definicion: DefinitionSchema,
  'sistema-axiomatico': AxiomaticSystemSchema,
  teorema: TheoremSchema,
  lema: TheoremSchema,
  corolario: TheoremSchema,
  demostracion: DemoSchema,
  ejemplo: ExampleSchema,
  ejercicio: ExerciseSchema,
  leccion: LessonSchema,
  matematico: MathematicianSchema,
  modelo: ModelSchema,
  caso_de_uso: UseCaseSchema,
  plan_de_estudio: StudyPlanSchema,
};

const CONTENT_DIRS: Record<string, string> = {
  axioms: 'axioma',
  definitions: 'definicion',
  'axiomatic-systems': 'sistema-axiomatico',
  theorems: 'teorema',
  demonstrations: 'demostracion',
  examples: 'ejemplo',
  exercises: 'ejercicio',
  lessons: 'leccion',
  mathematicians: 'matematico',
  models: 'modelo',
  usecases: 'caso_de_uso',
  plans: 'plan_de_estudio',
};

describe('MDX metadata validates against Zod schemas', () => {
  const contentDir = path.resolve(import.meta.dirname, '../../src/database/content');

  for (const [dirName, schemaType] of Object.entries(CONTENT_DIRS)) {
    const dirPath = path.join(contentDir, dirName);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx'));
    if (files.length === 0) continue;
    const schema = SCHEMA_MAP[schemaType];

    describe(`${dirName} (${schemaType})`, () => {
      for (const file of files) {
        it(`${file} metadata is valid`, () => {
          const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
          const parsed = parseMDX(content);

          expect(parsed.metadata).toBeDefined();
          expect(Object.keys(parsed.metadata).length).toBeGreaterThan(0);

          const result = schema.passthrough().safeParse(parsed.metadata);
          if (!result.success) {
            throw new Error(
              `${file} failed schema validation: ${JSON.stringify(result.error.issues, null, 2)}`
            );
          }
          expect(result.success).toBe(true);
        });
      }
    });
  }
});
