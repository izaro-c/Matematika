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
  AxiomaticSystemSchema,
  ModelSchema,
} from '../schemas';
import { contentLoaders } from './loaders';
import contentIndex from '../contentIndex.json';
import { buildBranchTaxonomy, getItemsByBranch } from './msc2020';
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
  AxiomaticSystem,
  Model,
  BaseContent
} from './types';

interface ContentIndexEntry {
  id: string;
  slug: string;
  filePath: string;
  contentType: string;
  metadata: Record<string, unknown>;
}

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
  public axiomaticSystems: Map<string, AxiomaticSystem> = new Map();
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
  private createLazyComponent(loader: () => Promise<unknown>, exportName = 'default') {
    return lazy(() => loader().then(m => {
      const mod = m as Record<string, unknown>;
      return { default: (mod[exportName] as React.ComponentType<Record<string, unknown>>) || (() => null) };
    }));
  }

  /**
   * Inicializa la base de datos de MDX a partir del índice JSON y loaders perezosos.
   */
  private init() {
    const index = contentIndex as unknown as Record<string, ContentIndexEntry>;

    const processType = <T extends { id: string; slug: string }>(
      loaders: Record<string, () => Promise<unknown>>,
      dirName: string,
      schema: { safeParse: (data: unknown) => { success: boolean } },
      target: Map<string, T>,
      buildEntry: (meta: Record<string, unknown>, id: string, slug: string, loader: () => Promise<unknown>) => T,
    ) => {
      for (const path in loaders) {
        const slug = this.extractSlug(path, dirName === 'lessons');
        const entry = index[slug] || index[slug.replace(/demo$/, '')];
        if (!entry) {
          console.warn(`[ContentStore] No metadata in index for ${path}`);
          continue;
        }
        const meta = entry.metadata;
        const finalId = (meta.id as string) || slug;
        if (!schema.safeParse(meta).success) {
          console.warn(`[ContentStore] ${dirName}: inválido ${path}`);
        }
        target.set(finalId, buildEntry(meta, finalId, slug, loaders[path]));
      }
    };

    processType(contentLoaders.mathLoaders, 'mathematicians', MathematicianSchema, this.mathematicians,
      (meta, id, slug, loader) => ({ ...(meta as unknown as Mathematician), id, slug, Component: this.createLazyComponent(loader) }));

    processType(contentLoaders.thmLoaders, 'theorems', TheoremSchema, this.theorems,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as Theorem), id, slug,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.lessonLoaders, 'lessons', LessonSchema, this.lessons,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as Lesson), id, slug,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
        Visualizer: meta.hasVisualizer ? this.createLazyComponent(loader, 'Visualizer') : undefined,
      }));

    processType(contentLoaders.demoLoaders, 'demonstrations', DemoSchema, this.demos,
      (meta, id, slug, loader) => ({ ...(meta as unknown as Demo), id, slug, Component: this.createLazyComponent(loader) }));

    processType(contentLoaders.defLoaders, 'definitions', DefinitionSchema, this.definitions,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as Definition), id, slug,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.exampleLoaders, 'examples', ExampleSchema, this.examples,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as Example), id, slug,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.exerciseLoaders, 'exercises', ExerciseSchema, this.exercises,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as Exercise), id, slug,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.planLoaders, 'plans', StudyPlanSchema, this.studyPlans,
      (meta, id, slug, loader) => ({ ...(meta as unknown as StudyPlan), id, slug, Component: this.createLazyComponent(loader) }));

    processType(contentLoaders.usecaseLoaders, 'usecases', UseCaseSchema, this.usecases,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as UseCase), id, slug,
        Component: this.createLazyComponent(loader),
        Simulation: this.createLazyComponent(loader, 'Simulation'),
      }));

    processType(contentLoaders.axiomLoaders, 'axioms', AxiomSchema, this.axioms,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as Axiom), id, slug,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.axiomaticSystemLoaders, 'axiomatic-systems', AxiomaticSystemSchema, this.axiomaticSystems,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as AxiomaticSystem), id, slug,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.modelLoaders, 'models', ModelSchema, this.models,
      (meta, id, slug, loader) => ({
        ...(meta as unknown as Model), id, slug,
        Component: this.createLazyComponent(loader),
        Diagram: meta.hasDiagram ? this.createLazyComponent(loader, 'Diagram') : undefined,
      }));
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

  getAxiomaticSystem(id: string): AxiomaticSystem | undefined {
    return this.axiomaticSystems.get(id) || Array.from(this.axiomaticSystems.values()).find(s => s.slug === id);
  }
  getAllAxiomaticSystems(): AxiomaticSystem[] { return Array.from(this.axiomaticSystems.values()); }
  getModelsForSystem(systemId: string): Model[] {
    return Array.from(this.models.values()).filter(m => m.satisfies === systemId);
  }

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

  static slugify(text: string): string {
    return text.toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // ── Taxonomía MSC2020 ────────────────────────────────────────────────────

  getBranchTaxonomy(branchId: string) {
    const items: { type: string; item: BaseContent & { tags?: string[] } }[] = [];
    for (const thm of this.theorems.values()) items.push({ type: 'theorem', item: thm });
    for (const lesson of this.lessons.values()) items.push({ type: 'lesson', item: lesson });
    for (const def of this.definitions.values()) items.push({ type: 'definition', item: def });
    for (const ex of this.examples.values()) items.push({ type: 'example', item: ex });
    for (const ez of this.exercises.values()) items.push({ type: 'exercise', item: ez });
    for (const axm of this.axioms.values()) items.push({ type: 'axiom', item: axm });
    for (const model of this.models.values()) items.push({ type: 'model', item: model });
    return buildBranchTaxonomy(branchId, items);
  }

  getItemsByBranch(branch: string): { type: string; item: BaseContent & { tags?: string[] } }[] {
    const items: { type: string; item: BaseContent & { tags?: string[] } }[] = [];
    for (const thm of this.theorems.values()) items.push({ type: 'theorem', item: thm });
    for (const lesson of this.lessons.values()) items.push({ type: 'lesson', item: lesson });
    for (const def of this.definitions.values()) items.push({ type: 'definition', item: def });
    for (const ex of this.examples.values()) items.push({ type: 'example', item: ex });
    for (const ez of this.exercises.values()) items.push({ type: 'exercise', item: ez });
    for (const axm of this.axioms.values()) items.push({ type: 'axiom', item: axm });
    for (const model of this.models.values()) items.push({ type: 'model', item: model });
    return getItemsByBranch(branch, items);
  }
}
