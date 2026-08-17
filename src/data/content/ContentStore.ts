import { lazy } from 'react';
import {
  MathematicianSchema,
  TheoremSchema,
  MethodSchema,
  DemoSchema,
  DefinitionSchema,
  ExampleSchema,
  ExerciseSchema,
  UseCaseSchema,
  StudyPlanSchema,
  AxiomSchema,
  AxiomaticSystemSchema,
  ModelSchema,
} from './schemas';
import { contentLoaders } from './loaders';
import contentIndex from './contentIndex.json';
import { buildBranchTaxonomy, getItemsByBranch } from './msc2020';
import { DEFAULT_LANGUAGE } from '@/i18n';
import type {
  Mathematician,
  Theorem,
  Method,
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
  lang?: string;
  filePath: string;
  contentType: string;
  metadata: Record<string, unknown>;
}

/**
 * Singleton ContentStore
 * 
 * Centraliza y gestiona la base de datos de contenido MDX de Matematika.
 * Lee, valida y compila los módulos a través de Vite en tiempo de ejecución
 * con soporte multi-idioma nativo.
 */
export class ContentStore {
  public mathematicians: Map<string, Mathematician> = new Map();
  public theorems: Map<string, Theorem> = new Map();
  public methods: Map<string, Method> = new Map();
  public demos: Map<string, Demo> = new Map();
  public definitions: Map<string, Definition> = new Map();
  public examples: Map<string, Example> = new Map();
  public exercises: Map<string, Exercise> = new Map();
  public usecases: Map<string, UseCase> = new Map();
  public studyPlans: Map<string, StudyPlan> = new Map();
  public axioms: Map<string, Axiom> = new Map();
  public axiomaticSystems: Map<string, AxiomaticSystem> = new Map();
  public models: Map<string, Model> = new Map();

  // Multi-language maps: key is `${lang}:${id}` or `${lang}:${slug}`
  private mathematiciansByLang: Map<string, Mathematician> = new Map();
  private theoremsByLang: Map<string, Theorem> = new Map();
  private methodsByLang: Map<string, Method> = new Map();
  private demosByLang: Map<string, Demo> = new Map();
  private definitionsByLang: Map<string, Definition> = new Map();
  private examplesByLang: Map<string, Example> = new Map();
  private exercisesByLang: Map<string, Exercise> = new Map();
  private usecasesByLang: Map<string, UseCase> = new Map();
  private studyPlansByLang: Map<string, StudyPlan> = new Map();
  private axiomsByLang: Map<string, Axiom> = new Map();
  private axiomaticSystemsByLang: Map<string, AxiomaticSystem> = new Map();
  private modelsByLang: Map<string, Model> = new Map();

  /** Índice slug→id para lookups O(1) por slug en todos los get*() */
  private slugIndex: Map<string, string> = new Map();

  constructor() {
    this.init();
  }

  /**
   * Extrae el slug y el idioma de la ruta del archivo MDX
   */
  private extractSlugAndLang(path: string): { slug: string; lang: string } {
    const parts = path.split('/');
    const fileName = parts.pop() || '';
    const slug = fileName.replace('.mdx', '').toLowerCase();
    const lang = parts.find(p => /^[a-z]{2}(-[A-Z]{2})?$/.test(p)) || 'es';
    return { slug, lang };
  }

  /**
   * Función auxiliar para empaquetar importaciones dinámicas (`loaders`) en componentes `React.lazy`.
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
    const rawIndex = contentIndex as unknown as Record<string, ContentIndexEntry>;

    const processType = <T extends { id: string; slug: string; lang?: string }>(
      loaders: Record<string, () => Promise<unknown>>,
      dirName: string,
      schema: { safeParse: (data: unknown) => { success: boolean } },
      targetDefault: Map<string, T>,
      targetByLang: Map<string, T>,
      buildEntry: (meta: Record<string, unknown>, id: string, slug: string, lang: string, loader: () => Promise<unknown>) => T,
    ) => {
      for (const path in loaders) {
        const { slug, lang } = this.extractSlugAndLang(path);
        const entry = (rawIndex[`${lang}:${slug}`] as ContentIndexEntry | undefined) || (rawIndex[slug] as ContentIndexEntry | undefined);
        if (!entry) {
          console.warn(`[ContentStore] No metadata in index for ${path}`);
          continue;
        }
        const meta = entry.metadata;
        const finalId = (meta.id as string) || slug;
        if (!schema.safeParse(meta).success) {
          console.warn(`[ContentStore] ${dirName}: inválido ${path}`);
        }

        const item = buildEntry(meta, finalId, slug, lang, loaders[path]);

        // Registrar en mapa por idioma
        targetByLang.set(`${lang}:${finalId}`, item);
        targetByLang.set(`${lang}:${slug}`, item);

        // Registrar slug→id
        if (slug !== finalId) {
          this.slugIndex.set(`${lang}:${slug}`, finalId);
          this.slugIndex.set(slug, finalId);
        }

        // Si es el idioma por defecto o no existe en default, registrar en default
        if (!targetDefault.has(finalId) || lang === DEFAULT_LANGUAGE.code) {
          targetDefault.set(finalId, item);
        }
      }
    };

    processType(contentLoaders.mathLoaders, 'mathematicians', MathematicianSchema, this.mathematicians, this.mathematiciansByLang,
      (meta, id, slug, lang, loader) => ({ ...(meta as unknown as Mathematician), id, slug, lang, Component: this.createLazyComponent(loader) }));

    processType(contentLoaders.thmLoaders, 'theorems', TheoremSchema, this.theorems, this.theoremsByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as Theorem), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.methodLoaders, 'methods', MethodSchema, this.methods, this.methodsByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as Method), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.demoLoaders, 'demonstrations', DemoSchema, this.demos, this.demosByLang,
      (meta, id, slug, lang, loader) => ({ ...(meta as unknown as Demo), id, slug, lang, Component: this.createLazyComponent(loader) }));

    processType(contentLoaders.defLoaders, 'definitions', DefinitionSchema, this.definitions, this.definitionsByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as Definition), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.exampleLoaders, 'examples', ExampleSchema, this.examples, this.examplesByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as Example), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.exerciseLoaders, 'exercises', ExerciseSchema, this.exercises, this.exercisesByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as Exercise), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.planLoaders, 'plans', StudyPlanSchema, this.studyPlans, this.studyPlansByLang,
      (meta, id, slug, lang, loader) => ({ ...(meta as unknown as StudyPlan), id, slug, lang, Component: this.createLazyComponent(loader) }));

    processType(contentLoaders.usecaseLoaders, 'usecases', UseCaseSchema, this.usecases, this.usecasesByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as UseCase), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Simulation: this.createLazyComponent(loader, 'Simulation'),
      }));

    processType(contentLoaders.axiomLoaders, 'axioms', AxiomSchema, this.axioms, this.axiomsByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as Axiom), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.axiomaticSystemLoaders, 'axiomatic-systems', AxiomaticSystemSchema, this.axiomaticSystems, this.axiomaticSystemsByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as AxiomaticSystem), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));

    processType(contentLoaders.modelLoaders, 'models', ModelSchema, this.models, this.modelsByLang,
      (meta, id, slug, lang, loader) => ({
        ...(meta as unknown as Model), id, slug, lang,
        Component: this.createLazyComponent(loader),
        Diagram: meta.hasDiagram ? this.createLazyComponent(loader, 'Diagram') : undefined,
        Simulation: meta.hasSimulation ? this.createLazyComponent(loader, 'Simulation') : undefined,
      }));
  }

  // ── Multi-Language Availability & Fallback ────────────────────────────────

  getAvailableLanguages(id: string): string[] {
    const rawIndex = contentIndex as unknown as Record<string, { availableLangs?: string[]; metadata?: { availableLangs?: string[] } }>;
    const canonicalId = this.slugIndex.get(id) || id;
    const entry = rawIndex[canonicalId] || rawIndex[`es:${canonicalId}`] || rawIndex[`eu:${canonicalId}`];
    return entry?.availableLangs || entry?.metadata?.availableLangs || ['es'];
  }

  isFallback(id: string, requestedLang?: string): boolean {
    if (!requestedLang || requestedLang === 'es') return false;
    const available = this.getAvailableLanguages(id);
    return !available.includes(requestedLang);
  }

  // ── Queries ──────────────────────────────────────────────────────────────

  getAllMathematicians(lang?: string): Mathematician[] {
    if (lang) {
      const items = Array.from(this.mathematicians.values()).map(m => this.getMathematicianById(m.id, lang) || m);
      return items.sort((a, b) => (a.birthYear || 0) - (b.birthYear || 0));
    }
    return Array.from(this.mathematicians.values()).sort((a, b) => (a.birthYear || 0) - (b.birthYear || 0));
  }

  getMathematicianById(id: string, lang?: string): Mathematician | undefined {
    if (lang) {
      const localized = this.mathematiciansByLang.get(`${lang}:${id}`) ?? this.mathematiciansByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.mathematicians.get(id) ?? this.mathematicians.get(this.slugIndex.get(id) ?? '');
  }

  getTheorem(id: string, lang?: string): Theorem | undefined {
    if (lang) {
      const localized = this.theoremsByLang.get(`${lang}:${id}`) ?? this.theoremsByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.theorems.get(id) ?? this.theorems.get(this.slugIndex.get(id) ?? '');
  }

  getAllTheorems(lang?: string): Theorem[] {
    if (lang) {
      return Array.from(this.theorems.values()).map(t => this.getTheorem(t.id, lang) || t);
    }
    return Array.from(this.theorems.values());
  }

  getTheoremsByAuthor(authorId: string, lang?: string): Theorem[] {
    return this.getAllTheorems(lang).filter(thm => thm.authors?.includes(authorId));
  }

  getDefinition(id: string, lang?: string): Definition | undefined {
    if (lang) {
      const localized = this.definitionsByLang.get(`${lang}:${id}`) ?? this.definitionsByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.definitions.get(id) ?? this.definitions.get(this.slugIndex.get(id) ?? '');
  }

  getAllDefinitions(lang?: string): Definition[] {
    if (lang) {
      return Array.from(this.definitions.values()).map(d => this.getDefinition(d.id, lang) || d);
    }
    return Array.from(this.definitions.values());
  }

  getExample(id: string, lang?: string): Example | undefined {
    if (lang) {
      const localized = this.examplesByLang.get(`${lang}:${id}`) ?? this.examplesByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.examples.get(id) ?? this.examples.get(this.slugIndex.get(id) ?? '');
  }

  getAllExamples(lang?: string): Example[] {
    if (lang) {
      return Array.from(this.examples.values()).map(e => this.getExample(e.id, lang) || e);
    }
    return Array.from(this.examples.values());
  }

  getExamplesByTheorem(theoremId: string, lang?: string): Example[] {
    return this.getAllExamples(lang).filter(e => e.relatedTheorem === theoremId);
  }

  getExercise(id: string, lang?: string): Exercise | undefined {
    if (lang) {
      const localized = this.exercisesByLang.get(`${lang}:${id}`) ?? this.exercisesByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.exercises.get(id) ?? this.exercises.get(this.slugIndex.get(id) ?? '');
  }

  getAllExercises(lang?: string): Exercise[] {
    if (lang) {
      return Array.from(this.exercises.values()).map(e => this.getExercise(e.id, lang) || e);
    }
    return Array.from(this.exercises.values());
  }

  getExercisesByTheorem(theoremId: string, lang?: string): Exercise[] {
    return this.getAllExercises(lang).filter(e => e.relatedTheorem === theoremId);
  }

  getStudyPlan(id: string, lang?: string): StudyPlan | undefined {
    if (lang) {
      const localized = this.studyPlansByLang.get(`${lang}:${id}`) ?? this.studyPlansByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.studyPlans.get(id) ?? this.studyPlans.get(this.slugIndex.get(id) ?? '');
  }

  getAllStudyPlans(lang?: string): StudyPlan[] {
    if (lang) {
      return Array.from(this.studyPlans.values()).map(p => this.getStudyPlan(p.id, lang) || p);
    }
    return Array.from(this.studyPlans.values());
  }

  getAxiom(id: string, lang?: string): Axiom | undefined {
    if (lang) {
      const localized = this.axiomsByLang.get(`${lang}:${id}`) ?? this.axiomsByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.axioms.get(id) ?? this.axioms.get(this.slugIndex.get(id) ?? '');
  }

  getAllAxioms(lang?: string): Axiom[] {
    if (lang) {
      return Array.from(this.axioms.values()).map(a => this.getAxiom(a.id, lang) || a);
    }
    return Array.from(this.axioms.values());
  }

  getAxiomaticSystem(id: string, lang?: string): AxiomaticSystem | undefined {
    if (lang) {
      const localized = this.axiomaticSystemsByLang.get(`${lang}:${id}`) ?? this.axiomaticSystemsByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.axiomaticSystems.get(id) ?? this.axiomaticSystems.get(this.slugIndex.get(id) ?? '');
  }

  getAllAxiomaticSystems(lang?: string): AxiomaticSystem[] {
    if (lang) {
      return Array.from(this.axiomaticSystems.values()).map(s => this.getAxiomaticSystem(s.id, lang) || s);
    }
    return Array.from(this.axiomaticSystems.values());
  }

  getModelsForSystem(systemId: string, lang?: string): Model[] {
    return this.getAllModels(lang).filter(m =>
      Array.isArray(m.satisfies) ? m.satisfies.includes(systemId) : m.satisfies === systemId
    );
  }

  getModel(id: string, lang?: string): Model | undefined {
    if (lang) {
      const localized = this.modelsByLang.get(`${lang}:${id}`) ?? this.modelsByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.models.get(id) ?? this.models.get(this.slugIndex.get(id) ?? '');
  }

  getAllModels(lang?: string): Model[] {
    if (lang) {
      return Array.from(this.models.values()).map(m => this.getModel(m.id, lang) || m);
    }
    return Array.from(this.models.values());
  }

  getMethod(id: string, lang?: string): Method | undefined {
    if (lang) {
      const localized = this.methodsByLang.get(`${lang}:${id}`) ?? this.methodsByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.methods.get(id) ?? this.methods.get(this.slugIndex.get(id) ?? '');
  }

  getAllMethods(lang?: string): Method[] {
    if (lang) {
      return Array.from(this.methods.values()).map(m => this.getMethod(m.id, lang) || m);
    }
    return Array.from(this.methods.values());
  }

  getAllDemos(lang?: string): Demo[] {
    if (lang) {
      return Array.from(this.demos.values()).map(d => this.getDemo(d.id, lang) || d);
    }
    return Array.from(this.demos.values());
  }

  getDemo(id: string, lang?: string): Demo | undefined {
    if (lang) {
      const localized = this.demosByLang.get(`${lang}:${id}`) ?? this.demosByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.demos.get(id) ?? this.demos.get(this.slugIndex.get(id) ?? '');
  }

  getUseCase(id: string, lang?: string): UseCase | undefined {
    if (lang) {
      const localized = this.usecasesByLang.get(`${lang}:${id}`) ?? this.usecasesByLang.get(`${lang}:${this.slugIndex.get(id) ?? ''}`);
      if (localized) return localized;
    }
    return this.usecases.get(id) ?? this.usecases.get(this.slugIndex.get(id) ?? '');
  }

  getAllUseCases(lang?: string): UseCase[] {
    if (lang) {
      return Array.from(this.usecases.values()).map(u => this.getUseCase(u.id, lang) || u);
    }
    return Array.from(this.usecases.values());
  }

  getUseCasesByConcept(conceptId: string, lang?: string): UseCase[] {
    return this.getAllUseCases(lang).filter(u => u.concept === conceptId);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  static slugify(text: string): string {
    return text.toString().toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '');
  }

  // ── Taxonomía MSC2020 ────────────────────────────────────────────────────

  private buildAllItems(lang?: string): { type: string; item: BaseContent }[] {
    const items: { type: string; item: BaseContent }[] = [];
    for (const thm of this.getAllTheorems(lang)) items.push({ type: 'theorem', item: thm });
    for (const method of this.getAllMethods(lang)) items.push({ type: 'method', item: method });
    for (const def of this.getAllDefinitions(lang)) items.push({ type: 'definition', item: def });
    for (const ex of this.getAllExamples(lang)) items.push({ type: 'example', item: ex });
    for (const ez of this.getAllExercises(lang)) items.push({ type: 'exercise', item: ez });
    for (const axm of this.getAllAxioms(lang)) items.push({ type: 'axiom', item: axm });
    for (const sys of this.getAllAxiomaticSystems(lang)) items.push({ type: 'axiomatic-system', item: sys });
    for (const model of this.getAllModels(lang)) items.push({ type: 'model', item: model });
    for (const uc of this.getAllUseCases(lang)) items.push({ type: 'usecase', item: uc });
    return items;
  }

  getBranchTaxonomy(branchId: string, lang?: string) {
    return buildBranchTaxonomy(branchId, this.buildAllItems(lang), lang);
  }

  getBreadcrumbs(tagsOrBranch?: string | string[], fallback?: { name: string; href?: string }, lang?: string): { name: string; href?: string }[] {
    const branchKey = typeof tagsOrBranch === 'string'
      ? tagsOrBranch
      : Array.isArray(tagsOrBranch) && tagsOrBranch.length > 0
        ? tagsOrBranch[0]
        : undefined;

    if (branchKey) {
      const taxonomy = this.getBranchTaxonomy(branchKey, lang);
      return [
        ...taxonomy.breadcrumbs.map(b => ({ name: b.name, href: `/rama/${b.slug}` })),
        { name: taxonomy.name || taxonomy.id, href: `/rama/${taxonomy.slug}` },
      ];
    }
    return fallback ? [fallback] : [];
  }

  getItemsByBranch(branch: string, lang?: string): { type: string; item: BaseContent }[] {
    return getItemsByBranch(branch, this.buildAllItems(lang));
  }
}

export const db = new ContentStore();
