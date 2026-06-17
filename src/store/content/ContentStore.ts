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
  AxiomSchema,
  ModelSchema,
} from '../schemas';
import { contentLoaders } from './loaders';
import type {
  Mathematician,
  Theorem,
  Lesson,
  Demo,
  Definition,
  Example,
  Exercise,
  UseCase,
  StudyPlan,
  Axiom,
  Model,
  BaseContent
} from './types';

/**
 * Singleton ContentStore
 * 
 * Centraliza y gestiona la base de datos de contenido MDX de Matematika.
 * Lee, valida y compila los módulos a través de Vite en tiempo de ejecución.
 * 
 * @remarks
 * Esta clase actúa como un Singleton en la aplicación.
 */
export class ContentStore {
  public mathematicians: Map<string, Mathematician> = new Map();
  public theorems: Map<string, Theorem> = new Map();
  public lessons: Map<string, Lesson> = new Map();
  public demos: Map<string, Demo> = new Map();
  public definitions: Map<string, Definition> = new Map();
  public examples: Map<string, Example> = new Map();
  public exercises: Map<string, Exercise> = new Map();
  public usecases: Map<string, UseCase> = new Map();
  public studyPlans: Map<string, StudyPlan> = new Map();
  public axioms: Map<string, Axiom> = new Map();
  public models: Map<string, Model> = new Map();

  constructor() {
    this.init();
  }

  /**
   * Extrae el slug o ID de la ruta del archivo MDX
   * @param path Ruta del archivo
   * @param isLesson Indica si es una lección para sanitizar sufijos "Demo"
   * @returns El slug normalizado
   */
  private extractSlug(path: string, isLesson = false): string {
    let slug = path.split('/').pop()?.replace('.mdx', '') || '';
    if (isLesson) {
      slug = slug.replace(/Demo$/, '');
    }
    return slug.toLowerCase();
  }

  /**
   * Helper para crear componentes lazy load
   */
  /**
   * Helper para crear componentes lazy load
   */
  private createLazyComponent(loader: () => Promise<Record<string, unknown>>, exportName = 'default') {
    return lazy(() => loader().then(m => ({ default: (m[exportName] as React.ComponentType<Record<string, unknown>>) || (() => null) })));
  }

  /**
   * Inicializa la base de datos de MDX
   */
  private init() {
    const {
      mathLoaders, mathMetas,
      thmLoaders, thmMetas,
      lessonLoaders, lessonMetas,
      demoLoaders, demoMetas,
      defLoaders, defMetas,
      exampleLoaders, exampleMetas,
      exerciseLoaders, exerciseMetas,
      usecaseLoaders, usecaseMetas,
      planLoaders, planMetas,
      axiomLoaders, axiomMetas,
      modelLoaders, modelMetas
    } = contentLoaders;

    // 1. Matemáticos
    for (const path in mathMetas) {
      const meta = mathMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!MathematicianSchema.safeParse(meta).success) console.warn(`[ContentStore] Matemático inválido ${path}`);

      this.mathematicians.set(id, {
        ...(meta as unknown as Mathematician), id, slug,
        Component: this.createLazyComponent(mathLoaders[path] as () => Promise<Record<string, unknown>>)
      });
    }

    // 2. Teoremas
    for (const path in thmMetas) {
      const meta = thmMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!TheoremSchema.safeParse(meta).success) console.warn(`[ContentStore] Teorema inválido ${path}`);
      
      this.theorems.set(id, {
        ...(meta as unknown as Theorem), id, slug,
        Component: this.createLazyComponent(thmLoaders[path] as () => Promise<Record<string, unknown>>),
        Simulation: meta.hasSimulation ? this.createLazyComponent(thmLoaders[path] as () => Promise<Record<string, unknown>>, 'Simulation') : undefined
      });
    }

    // 3. Lecciones
    for (const path in lessonMetas) {
      const meta = lessonMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path, true);
      const id = (meta.id as string) || slug;
      if (!LessonSchema.safeParse(meta).success) console.warn(`[ContentStore] Lección inválida ${path}`);

      this.lessons.set(id, {
        ...(meta as unknown as Lesson), id, slug,
        Component: this.createLazyComponent(lessonLoaders[path] as () => Promise<Record<string, unknown>>),
        Simulation: meta.hasSimulation ? this.createLazyComponent(lessonLoaders[path] as () => Promise<Record<string, unknown>>, 'Simulation') : undefined,
        Visualizer: meta.hasVisualizer ? this.createLazyComponent(lessonLoaders[path] as () => Promise<Record<string, unknown>>, 'Visualizer') : undefined
      });
    }

    // 4. Demostraciones
    for (const path in demoMetas) {
      const meta = demoMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!DemoSchema.safeParse(meta).success) console.warn(`[ContentStore] Demo inválida ${path}`);

      this.demos.set(id, {
        ...(meta as unknown as Demo), id, slug,
        Component: this.createLazyComponent(demoLoaders[path] as () => Promise<Record<string, unknown>>)
      });
    }

    // 5. Definiciones
    for (const path in defMetas) {
      const meta = defMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!DefinitionSchema.safeParse(meta).success) console.warn(`[ContentStore] Definición inválida ${path}`);

      this.definitions.set(id, {
        ...(meta as unknown as Definition), id, slug,
        Component: this.createLazyComponent(defLoaders[path] as () => Promise<Record<string, unknown>>),
        Simulation: meta.hasSimulation ? this.createLazyComponent(defLoaders[path] as () => Promise<Record<string, unknown>>, 'Simulation') : undefined
      });
    }

    // 6. Ejemplos
    for (const path in exampleMetas) {
      const meta = exampleMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!ExampleSchema.safeParse(meta).success) console.warn(`[ContentStore] Ejemplo inválido ${path}`);

      this.examples.set(id, {
        ...(meta as unknown as Example), id, slug,
        Component: this.createLazyComponent(exampleLoaders[path] as () => Promise<Record<string, unknown>>),
        Simulation: meta.hasSimulation ? this.createLazyComponent(exampleLoaders[path] as () => Promise<Record<string, unknown>>, 'Simulation') : undefined
      });
    }

    // 7. Ejercicios
    for (const path in exerciseMetas) {
      const meta = exerciseMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!ExerciseSchema.safeParse(meta).success) console.warn(`[ContentStore] Ejercicio inválido ${path}`);

      this.exercises.set(id, {
        ...(meta as unknown as Exercise), id, slug,
        Component: this.createLazyComponent(exerciseLoaders[path] as () => Promise<Record<string, unknown>>),
        Simulation: meta.hasSimulation ? this.createLazyComponent(exerciseLoaders[path] as () => Promise<Record<string, unknown>>, 'Simulation') : undefined
      });
    }

    // 8. Planes de Estudio
    for (const [path, meta] of Object.entries(planMetas)) {
      const m = StudyPlanSchema.parse(meta);
      const slug = m.id || this.extractSlug(path);
      this.studyPlans.set(slug, {
        ...m,
        slug,
        Component: this.createLazyComponent(planLoaders[path] as () => Promise<Record<string, unknown>>),
      });
    }

    // 9. Casos de Uso
    for (const path in usecaseMetas) {
      const meta = usecaseMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!UseCaseSchema.safeParse(meta).success) console.warn(`[ContentStore] UseCase inválido ${path}`);

      this.usecases.set(id, {
        ...(meta as unknown as UseCase), id, slug,
        Component: this.createLazyComponent(usecaseLoaders[path] as () => Promise<Record<string, unknown>>),
        Simulation: this.createLazyComponent(usecaseLoaders[path] as () => Promise<Record<string, unknown>>, 'Simulation')
      });
    }

    // 10. Axiomas
    for (const path in axiomMetas) {
      const meta = axiomMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!AxiomSchema.safeParse(meta).success) console.warn(`[ContentStore] Axioma inválido ${path}`);

      this.axioms.set(id, {
        ...(meta as unknown as Axiom), id, slug,
        Component: this.createLazyComponent(axiomLoaders[path] as () => Promise<Record<string, unknown>>)
      });
    }

    // 11. Modelos
    for (const path in modelMetas) {
      const meta = modelMetas[path] as Record<string, unknown>;
      const slug = this.extractSlug(path);
      const id = (meta.id as string) || slug;
      if (!ModelSchema.safeParse(meta).success) console.warn(`[ContentStore] Modelo inválido ${path}`);

      this.models.set(id, {
        ...(meta as unknown as Model), id, slug,
        Component: this.createLazyComponent(modelLoaders[path] as () => Promise<Record<string, unknown>>)
      });
    }
  }

  // ── Queries ──────────────────────────────────────────────────────────────

  /**
   * Obtiene todos los matemáticos ordenados por año de nacimiento.
   * @returns Un array de objetos `Mathematician`.
   */
  getAllMathematicians(): Mathematician[] {
    return Array.from(this.mathematicians.values()).sort((a, b) => a.year - b.year);
  }

  /**
   * Busca un matemático por su identificador único o slug.
   * @param id - Identificador o slug del matemático.
   * @returns El objeto `Mathematician` o `undefined` si no se encuentra.
   */
  getMathematicianById(id: string): Mathematician | undefined {
    return this.mathematicians.get(id) || Array.from(this.mathematicians.values()).find(m => m.slug === id);
  }

  /**
   * Obtiene un teorema específico.
   * @param id - ID o slug del teorema.
   * @returns El teorema correspondiente o `undefined`.
   */
  getTheorem(id: string): Theorem | undefined {
    return this.theorems.get(id) || Array.from(this.theorems.values()).find(t => t.slug === id);
  }

  /**
   * Obtiene todos los teoremas asociados a un autor específico.
   * @param authorId - ID del autor (matemático).
   * @returns Un array de `Theorem` vinculados al autor.
   */
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
  getExamplesByTheorem(theoremId: string): Example[] {
    return Array.from(this.examples.values()).filter(e => e.relatedTheorem === theoremId);
  }

  getExercise(id: string): Exercise | undefined {
    return this.exercises.get(id) || Array.from(this.exercises.values()).find(e => e.slug === id);
  }
  getAllExercises(): Exercise[] {
    return Array.from(this.exercises.values());
  }
  getExercisesByTheorem(theoremId: string): Exercise[] {
    return Array.from(this.exercises.values()).filter(e => e.relatedTheorem === theoremId);
  }

  getStudyPlan(id: string): StudyPlan | undefined {
    return this.studyPlans.get(id) || Array.from(this.studyPlans.values()).find(p => p.slug === id);
  }

  getAxiom(id: string): Axiom | undefined {
    return this.axioms.get(id) || Array.from(this.axioms.values()).find(a => a.slug === id);
  }
  getAllAxioms(): Axiom[] { return Array.from(this.axioms.values()); }

  getModel(id: string): Model | undefined {
    return this.models.get(id) || Array.from(this.models.values()).find(m => m.slug === id);
  }
  getAllModels(): Model[] { return Array.from(this.models.values()); }

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
  getUseCasesByConcept(conceptId: string): UseCase[] {
    return Array.from(this.usecases.values()).filter(u => u.concept === conceptId);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Convierte un string a un slug normalizado para URLs
   * @param text Texto de origen
   * @returns Slug generado
   */
  static slugify(text: string): string {
    return text.toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // ── Taxonomía de ramas ───────────────────────────────────────────────────

  getBranchTaxonomy(branchId: string): {
    id: string;
    slug: string;
    subBranches: { name: string; slug: string }[];
    directItems: { type: string; item: BaseContent & { tags?: string[] }; subBranchSlug?: string }[];
    breadcrumbs: { name: string; slug: string }[];
  } {
    const directItems: { type: string; item: BaseContent & { tags?: string[] }; subBranchSlug?: string }[] = [];
    const subBranchesMap = new Map<string, string>();
    const branchSlug = ContentStore.slugify(branchId);
    let originalName = branchId.charAt(0).toUpperCase() + branchId.slice(1);
    let breadcrumbs: { name: string; slug: string }[] = [];

    const processItem = (item: BaseContent & { tags?: string[] }, type: string) => {
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

  getItemsByBranch(branch: string): { type: string; item: BaseContent & { tags?: string[] } }[] {
    const results: { type: string; item: BaseContent & { tags?: string[] } }[] = [];
    const branchSlug = ContentStore.slugify(branch);
    const check = (item: BaseContent & { tags?: string[] }, type: string) => {
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
