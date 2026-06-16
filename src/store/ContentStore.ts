import { lazy } from 'react';
import {
  MathematicianSchema,
  TheoremSchema,
  LessonSchema,
  DemoSchema,
  DefinitionSchema,
  ExampleSchema,
  ExerciseSchema,
  UseCaseSchema,
  StudyPlanSchema,
} from './schemas';
import type { StudyPlanMeta } from './schemas';

// ── Glob de todos los módulos MDX y JSON ──────────────────────────────────────

const mathLoaders = import.meta.glob('../content/mathematicians/*.mdx');
const mathMetas = import.meta.glob('../content/mathematicians/*.mdx', { import: 'metadata', eager: true });

const thmLoaders = import.meta.glob('../content/theorems/*.mdx');
const thmMetas = import.meta.glob('../content/theorems/*.mdx', { import: 'metadata', eager: true });

const lessonLoaders = import.meta.glob('../content/lessons/*.mdx');
const lessonMetas = import.meta.glob('../content/lessons/*.mdx', { import: 'metadata', eager: true });

const demoLoaders = import.meta.glob('../content/demonstrations/*.mdx');
const demoMetas = import.meta.glob('../content/demonstrations/*.mdx', { import: 'metadata', eager: true });

const defLoaders = import.meta.glob('../content/definitions/*.mdx');
const defMetas = import.meta.glob('../content/definitions/*.mdx', { import: 'metadata', eager: true });

const exampleLoaders = import.meta.glob('../content/examples/*.mdx');
const exampleMetas = import.meta.glob('../content/examples/*.mdx', { import: 'metadata', eager: true });

const exerciseLoaders = import.meta.glob('../content/exercises/*.mdx');
const exerciseMetas = import.meta.glob('../content/exercises/*.mdx', { import: 'metadata', eager: true });

const usecaseLoaders = import.meta.glob('../content/usecases/*.mdx');
const usecaseMetas = import.meta.glob('../content/usecases/*.mdx', { import: 'metadata', eager: true });

const planLoaders = import.meta.glob('../content/plans/*.mdx');
const planMetas = import.meta.glob('../content/plans/*.mdx', { import: 'metadata', eager: true });

// ── Interfaces de entidades internas ─────────────────────────────────────────

export interface BaseContent {
  id: string;
  slug: string;
  links?: string[];
}

export interface Mathematician extends BaseContent {
  name: string;
  fullName: string;
  era: string;
  description: string;
  image?: string;
  year: number;
  birth?: string;
  death?: string;
  Component: any;
}

export interface StudyPlan extends StudyPlanMeta {
  Component: any;
  slug: string;
}

export interface Theorem {
  id: string;
  slug: string;
  title: string;
  description: string;
  statement?: string;
  color?: string;
  authors: string[];
  lesson?: string;
  type?: 'theorem' | 'lemma' | 'corollary';
  corollaries?: string[];
  demos?: string[];
  /** Definiciones que este teorema requiere formalmente */
  requires?: string[];
  /** Ejemplos resueltos asociados */
  examples?: string[];
  /** Ejercicios propuestos asociados */
  exercises?: string[];
  parentTheorem?: string;
  tags?: string[];
  difficulty?: 'básico' | 'intermedio' | 'avanzado';
  Component: any;
  Simulation?: any;
}

export interface Lesson {
  id: string;
  slug: string;
  title?: string;
  tags?: string[];
  difficulty?: 'básico' | 'intermedio' | 'avanzado';
  Component: any;
  Simulation?: any;
  Visualizer?: any;
}

export interface Demo {
  id: string;
  slug: string;
  title: string;
  description: string;
  parentTheorem?: string;
  lemmas?: string[];
  proofMethod?: string;
  authors?: string[];
  tags?: string[];
  layout?: 'split' | 'text';
  Component: any;
}

export interface Definition {
  id: string;
  slug: string;
  title: string;
  description: string;
  statement?: string;
  tags?: string[];
  authors?: string[];
  color?: string;
  /** IDs de teoremas que usan esta definición */
  usedBy?: string[];
  Component: any;
  Simulation?: any;
}

export interface Example {
  id: string;
  slug: string;
  title: string;
  description?: string;
  relatedTheorem?: string;
  requires?: string[];
  tags?: string[];
  difficulty?: 'básico' | 'intermedio' | 'avanzado';
  Component: any;
  Simulation?: any;
}

export interface Exercise {
  id: string;
  slug: string;
  title: string;
  description?: string;
  relatedTheorem?: string;
  requires?: string[];
  tags?: string[];
  difficulty?: 'básico' | 'intermedio' | 'avanzado';
  hint?: string;
  Component: any;
  Simulation?: any;
}

export interface UseCase {
  id: string;
  slug: string;
  title: string;
  description?: string;
  concept?: string;
  domain?: string;
  tags?: string[];
  difficulty?: 'básico' | 'intermedio' | 'avanzado';
  Component: any;
  Simulation?: any;
}

// ── ContentStore ──────────────────────────────────────────────────────────────

/**
 * Singleton ContentStore
 * 
 * Gestiona de forma centralizada toda la base de datos de contenido de la aplicación.
 * Utiliza los importes globales de Vite (`import.meta.glob`) para leer, validar (con Zod)
 * e indexar automáticamente todos los archivos MDX en tiempo de compilación.
 */
class ContentStore {
  /** Diccionario de matemáticos y datos biográficos */
  mathematicians: Map<string, Mathematician> = new Map();
  /** Diccionario de teoremas principales */
  theorems: Map<string, Theorem> = new Map();
  /** Diccionario de lecciones o ramas temáticas */
  lessons: Map<string, Lesson> = new Map();
  /** Diccionario de demostraciones formales */
  demos: Map<string, Demo> = new Map();
  /** Diccionario de definiciones y axiomas */
  definitions: Map<string, Definition> = new Map();
  /** Diccionario de ejemplos resueltos */
  examples: Map<string, Example> = new Map();
  /** Diccionario de ejercicios propuestos */
  exercises: Map<string, Exercise> = new Map();
  /** Diccionario de casos de uso (aplicaciones reales) */
  usecases: Map<string, UseCase> = new Map();
  /** Diccionario de planes de estudio estructurados */
  studyPlans: Map<string, StudyPlan> = new Map();

  constructor() {
    this.init();
  }

  /**
   * Inicializa la tienda leyendo todos los archivos importados por Vite,
   * extrayendo su frontmatter, validándolo e indexándolo por slug/id.
   * Carga los componentes MDX bajo demanda usando `React.lazy`.
   */
  private init() {
    // 1. Matemáticos
    for (const path in mathMetas) {
      const meta = mathMetas[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
      const id = meta.id || slug;
      const val = MathematicianSchema.safeParse(meta);
      if (!val.success) console.warn(`[ContentStore] Matemático inválido ${path}:`, val.error);

      this.mathematicians.set(id, {
        id, slug, ...meta,
        Component: lazy(() => (mathLoaders[path] as () => Promise<any>)().then(m => ({ default: m.default })))
      });
    }

    // 2. Teoremas
    for (const path in thmMetas) {
      const meta = thmMetas[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
      const id = meta.id || slug;
      const val = TheoremSchema.safeParse(meta);
      if (!val.success) console.warn(`[ContentStore] Teorema inválido ${path}:`, val.error);
      const hasSim = meta.hasSimulation === true;

      this.theorems.set(id, {
        id, slug, ...meta,
        Component: lazy(() => (thmLoaders[path] as () => Promise<any>)().then(m => ({ default: m.default }))),
        Simulation: hasSim ? lazy(() => (thmLoaders[path] as () => Promise<any>)().then(m => ({ default: m.Simulation || (() => null) }))) : undefined
      });
    }

    // 3. Lecciones
    for (const path in lessonMetas) {
      const meta = lessonMetas[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').replace(/Demo$/, '').toLowerCase() || '';
      const id = meta.id || slug;
      const val = LessonSchema.safeParse(meta);
      if (!val.success) console.warn(`[ContentStore] Lección inválida ${path}:`, val.error);
      const hasSim = meta.hasSimulation === true;

      this.lessons.set(id, {
        id, slug, ...meta,
        Component: lazy(() => (lessonLoaders[path] as () => Promise<any>)().then(m => ({ default: m.default }))),
        Simulation: hasSim ? lazy(() => (lessonLoaders[path] as () => Promise<any>)().then(m => ({ default: m.Simulation || (() => null) }))) : undefined,
        Visualizer: meta.hasVisualizer ? lazy(() => (lessonLoaders[path] as () => Promise<any>)().then(m => ({ default: m.Visualizer || (() => null) }))) : undefined
      });
    }

    // 4. Demostraciones
    for (const path in demoMetas) {
      const meta = demoMetas[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
      const id = meta.id || slug;
      const val = DemoSchema.safeParse(meta);
      if (!val.success) console.warn(`[ContentStore] Demo inválida ${path}:`, val.error);

      this.demos.set(id, {
        id, slug, ...meta,
        Component: lazy(() => (demoLoaders[path] as () => Promise<any>)().then(m => ({ default: m.default })))
      });
    }

    // 5. Definiciones
    for (const path in defMetas) {
      const meta = defMetas[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
      const id = meta.id || slug;
      const val = DefinitionSchema.safeParse(meta);
      if (!val.success) console.warn(`[ContentStore] Definición inválida ${path}:`, val.error);
      const hasSim = meta.hasSimulation === true;

      this.definitions.set(id, {
        id, slug, ...meta,
        Component: lazy(() => (defLoaders[path] as () => Promise<any>)().then(m => ({ default: m.default }))),
        Simulation: hasSim ? lazy(() => (defLoaders[path] as () => Promise<any>)().then(m => ({ default: m.Simulation || (() => null) }))) : undefined
      });
    }

    // 6. Ejemplos Resueltos
    for (const path in exampleMetas) {
      const meta = exampleMetas[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
      const id = meta.id || slug;
      const val = ExampleSchema.safeParse(meta);
      if (!val.success) console.warn(`[ContentStore] Ejemplo inválido ${path}:`, val.error);
      const hasSim = meta.hasSimulation === true;

      this.examples.set(id, {
        id, slug, ...meta,
        Component: lazy(() => (exampleLoaders[path] as () => Promise<any>)().then(m => ({ default: m.default }))),
        Simulation: hasSim ? lazy(() => (exampleLoaders[path] as () => Promise<any>)().then(m => ({ default: m.Simulation || (() => null) }))) : undefined
      });
    }

    // 7. Ejercicios Propuestos
    for (const path in exerciseMetas) {
      const meta = exerciseMetas[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
      const id = meta.id || slug;
      const val = ExerciseSchema.safeParse(meta);
      if (!val.success) console.warn(`[ContentStore] Ejercicio inválido ${path}:`, val.error);
      const hasSim = meta.hasSimulation === true;

      this.exercises.set(id, {
        id, slug, ...meta,
        Component: lazy(() => (exerciseLoaders[path] as () => Promise<any>)().then(m => ({ default: m.default }))),
        Simulation: hasSim ? lazy(() => (exerciseLoaders[path] as () => Promise<any>)().then(m => ({ default: m.Simulation || (() => null) }))) : undefined
      });
    }

    // 8. Planes de Estudio
    for (const [path, meta] of Object.entries(planMetas)) {
      const m = StudyPlanSchema.parse(meta);
      const slug = m.id || path.split('/').pop()?.replace('.mdx', '') || '';
      const loader = planLoaders[path] as () => Promise<any>;
      this.studyPlans.set(slug, {
        ...m,
        slug,
        Component: lazy(loader),
      });
    }

    // 9. Casos de Uso Real
    for (const path in usecaseMetas) {
      const meta = usecaseMetas[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
      const id = meta.id || slug;
      const val = UseCaseSchema.safeParse(meta);
      if (!val.success) console.warn(`[ContentStore] UseCase inválido ${path}:`, val.error);

      this.usecases.set(id, {
        id, slug, ...meta,
        Component: lazy(() => (usecaseLoaders[path] as () => Promise<any>)().then(m => ({ default: m.default }))),
        Simulation: lazy(() => (usecaseLoaders[path] as () => Promise<any>)().then(m => ({ default: m.Simulation })))
      });
    }
  }

  // ── Queries ──────────────────────────────────────────────────────────────

  getAllMathematicians(): Mathematician[] {
    return Array.from(this.mathematicians.values()).sort((a, b) => a.year - b.year);
  }
  getMathematicianById(id: string): Mathematician | undefined {
    return this.mathematicians.get(id) || Array.from(this.mathematicians.values()).find(m => m.slug === id);
  }

  getTheorem(id: string): Theorem | undefined {
    return this.theorems.get(id) || Array.from(this.theorems.values()).find(t => t.slug === id);
  }
  getTheoremsByAuthor(authorId: string): Theorem[] {
    return Array.from(this.theorems.values()).filter(thm => thm.authors?.includes(authorId));
  }

  getDefinition(id: string): Definition | undefined {
    return this.definitions.get(id) || Array.from(this.definitions.values()).find(d => d.slug === id);
  }
  getAllDefinitions(): Definition[] {
    return Array.from(this.definitions.values());
  }

  getExample(id: string): Example | undefined {
    return this.examples.get(id) || Array.from(this.examples.values()).find(e => e.slug === id);
  }
  getAllExamples(): Example[] {
    return Array.from(this.examples.values());
  }
  /** Devuelve todos los ejemplos relacionados con un teorema concreto */
  getExamplesByTheorem(theoremId: string): Example[] {
    return Array.from(this.examples.values()).filter(e => e.relatedTheorem === theoremId);
  }

  getExercise(id: string): Exercise | undefined {
    return this.exercises.get(id) || Array.from(this.exercises.values()).find(e => e.slug === id);
  }
  getAllExercises(): Exercise[] {
    return Array.from(this.exercises.values());
  }
  /** Devuelve todos los ejercicios relacionados con un teorema concreto */
  getExercisesByTheorem(theoremId: string): Exercise[] {
    return Array.from(this.exercises.values()).filter(e => e.relatedTheorem === theoremId);
  }

  getStudyPlan(id: string): StudyPlan | undefined {
    return this.studyPlans.get(id) || Array.from(this.studyPlans.values()).find(p => p.slug === id);
  }

  getLesson(id: string): Lesson | undefined {
    return this.lessons.get(id) || Array.from(this.lessons.values()).find(l => l.slug === id);
  }
  getAllLessons(): Lesson[] { return Array.from(this.lessons.values()); }
  getAllDemos(): Demo[] { return Array.from(this.demos.values()); }
  
  getDemo(id: string): Demo | undefined {
    return this.demos.get(id) || Array.from(this.demos.values()).find(d => d.slug === id);
  }

  getUseCase(id: string): UseCase | undefined {
    return this.usecases.get(id) || Array.from(this.usecases.values()).find(u => u.slug === id);
  }
  getAllUseCases(): UseCase[] { return Array.from(this.usecases.values()); }
  /** Devuelve todos los casos de uso relacionados con un concepto concreto */
  getUseCasesByConcept(conceptId: string): UseCase[] {
    return Array.from(this.usecases.values()).filter(u => u.concept === conceptId);
  }

  // ── Slugify ──────────────────────────────────────────────────────────────

  static slugify(text: string): string {
    return text.toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // ── Taxonomía de ramas ───────────────────────────────────────────────────

  getBranchTaxonomy(branchId: string): {
    id: string;
    slug: string;
    subBranches: { name: string; slug: string }[];
    directItems: { type: string; item: any; subBranchSlug?: string }[];
    breadcrumbs: { name: string; slug: string }[];
  } {
    const directItems: { type: string; item: any; subBranchSlug?: string }[] = [];
    const subBranchesMap = new Map<string, string>();
    const branchSlug = ContentStore.slugify(branchId);
    let originalName = branchId.charAt(0).toUpperCase() + branchId.slice(1);
    let breadcrumbs: { name: string; slug: string }[] = [];

    const processItem = (item: any, type: string) => {
      if (!item.tags || item.tags.length === 0) return;
      const tagSlugs = item.tags.map(ContentStore.slugify);
      const branchIndex = tagSlugs.indexOf(branchSlug);
      if (branchIndex === -1) return;
      originalName = item.tags[branchIndex];
      if (breadcrumbs.length === 0) {
        breadcrumbs = item.tags.slice(0, branchIndex).map((t: string) => ({
          name: t, slug: ContentStore.slugify(t),
        }));
      }
      let subBranchSlug = undefined;
      if (branchIndex < item.tags.length - 1) {
        const nextTag = item.tags[branchIndex + 1];
        subBranchSlug = tagSlugs[branchIndex + 1];
        subBranchesMap.set(subBranchSlug, nextTag);
      }
      directItems.push({ type, item, subBranchSlug });
    };

    for (const thm of this.theorems.values()) processItem(thm, 'theorem');
    for (const lesson of this.lessons.values()) processItem(lesson, 'lesson');
    for (const def of this.definitions.values()) processItem(def, 'definition');
    for (const ex of this.examples.values()) processItem(ex, 'example');
    for (const ez of this.exercises.values()) processItem(ez, 'exercise');

    const subBranches = Array.from(subBranchesMap.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { id: originalName, slug: branchSlug, subBranches, directItems, breadcrumbs };
  }

  getItemsByBranch(branch: string): { type: string; item: any }[] {
    const results: { type: string; item: any }[] = [];
    const branchSlug = ContentStore.slugify(branch);
    const check = (item: any, type: string) => {
      if (item.tags?.some((t: string) => ContentStore.slugify(t) === branchSlug)) {
        results.push({ type, item });
      }
    };
    for (const thm of this.theorems.values()) check(thm, 'theorem');
    for (const lesson of this.lessons.values()) check(lesson, 'lesson');
    for (const def of this.definitions.values()) check(def, 'definition');
    for (const ex of this.examples.values()) check(ex, 'example');
    for (const ez of this.exercises.values()) check(ez, 'exercise');
    return results;
  }
}

export const db = new ContentStore();
