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

  // ── Taxonomía MSC2020 ────────────────────────────────────────────────────

  /**
   * Mapeo de tags existentes en los archivos MDX a códigos MSC2020.
   */
  private static readonly tagToMSC: Record<string, string> = {
    // IV. Geometría y Topología
    "geometría": "51",
    "geometría de incidencia": "51A",
    "geometría absoluta": "51M",
    "geometría euclidiana": "51M",
    "geometría hiperbólica": "51M",
    "geometría analítica": "51P",
    "geometría afín": "51A",
    "congruencia": "51M",
    "continuidad": "51M",
    // I. Fundamentos y Lógica
    "lógica": "03",
    "sistemas formales": "03",
    "filosofía de las matemáticas": "00A",
    // II. Álgebra
    "álgebra": "15",
    "álgebra lineal": "15A",
    // III. Análisis
    "análisis": "26",
    "cálculo": "26",
    // VI. Probabilidad y Estadística
    "probabilidad": "60",
    "estadística": "62",
  };

  /**
   * Nombres display para códigos MSC2020 (Nivel 1 y Nivel 2).
   */
  private static readonly mscNames: Record<string, string> = {
    // -- Nodos de Metadatos y Divulgación --
    "00": "Temas generales y globales; colecciones",
    "00A": "Generalidades, recreación, divulgación y filosofía de la matemática",
    "00B": "Actas de congresos y colecciones de artículos",
    "01": "Historia y biografía",
    "01A": "Historia de las matemáticas y biografías de matemáticos",
    "97": "Educación matemática",
    "97B": "Política educativa y sistemas educacionales",
    "97C": "Psicología de la educación matemática",
    "97G": "Geometría (educación)",
    "97H": "Álgebra (educación)",
    "97I": "Análisis (educación)",
    // I. Fundamentos y Lógica
    "03": "Lógica matemática y fundamentos",
    "03A": "Aspectos filosóficos y fundacionales",
    "03B": "Lógica general (proposicional, primer orden, modal)",
    "03C": "Teoría de modelos",
    "03D": "Teoría de la computabilidad y recursión",
    "03E": "Teoría de conjuntos (cardinales, ordinales, axioma de elección)",
    "03F": "Teoría de la demostración y matemática constructiva",
    "03G": "Lógica algebraica (álgebras de Boole)",
    "08": "Sistemas algebraicos generales",
    "08A": "Estructuras algebraicas y homomorfismos",
    "08B": "Variedades de álgebras",
    "08C": "Clases de álgebras",
    // II. Álgebra y Teoría de Números
    "11": "Teoría de números",
    "11A": "Teoría de números elemental",
    "11D": "Ecuaciones diofánticas",
    "11F": "Formas modulares y automorfas",
    "11R": "Teoría de números algebraica",
    "11Y": "Teoría de números computacional",
    "12": "Teoría de cuerpos y polinomios",
    "12F": "Extensiones de cuerpos y Teoría de Galois",
    "12H": "Álgebra diferencial",
    "13": "Álgebra conmutativa",
    "13B": "Extensiones de anillos",
    "13F": "Anillos aritméticos y de factorización única",
    "14": "Geometría algebraica",
    "14H": "Curvas algebraicas",
    "14J": "Superficies y variedades de dimensión superior",
    "14K": "Variedades abelianas",
    "15": "Álgebra lineal y multilineal; teoría de matrices",
    "15A": "Espacios vectoriales y transformaciones lineales básicas",
    "15B": "Matrices especiales (ortogonales, simétricas, booleanas)",
    // --- sub-ramas de generalización ---
    "geometria-algebraica": "Geometría Algebraica",
    "algebra-abstracta": "Álgebra Abstracta (Anillos y Cuerpos)",
    "teoria-de-grupos-y-categorias": "Teoría de Grupos y Categorías",
    "18": "Teoría de categorías; álgebra homológica",
    "18A": "Teoría de categorías general",
    "18B": "Categorías especiales (topos)",
    "18G": "Álgebra homológica",
    "20": "Teoría de grupos y generalizaciones",
    "20D": "Grupos finitos abstractos",
    "20F": "Grupos infinitos especiales (presentaciones)",
    "20M": "Semigrupos",
    // III. Análisis Matemático
    "analisis-real-y-funciones": "Análisis Real y Funciones",
    "analisis-complejo": "Análisis Complejo",
    "ecuaciones-diferenciales": "Ecuaciones Diferenciales",
    "analisis-funcional-y-armonico": "Análisis Funcional y Armónico",
    "26": "Funciones reales",
    "26A": "Funciones de una variable",
    "26B": "Funciones de varias variables",
    "30": "Funciones de una variable compleja",
    "30C": "Teoría geométrica de funciones",
    "30D": "Funciones analíticas y meromorfas",
    "34": "Ecuaciones diferenciales ordinarias",
    "34A": "Teoría general (existencia, unicidad)",
    "34C": "Teoría cualitativa",
    "34D": "Teoría de estabilidad",
    "46": "Análisis funcional",
    "46B": "Espacios de Banach",
    "46C": "Espacios de Hilbert",
    "46L": "Álgebras de operadores (Álgebras C*)",
    // IV. Geometría y Topología
    "geometria-clasica-y-diferencial": "Geometría Clásica y Diferencial",
    "topologia-general-y-algebraica": "Topología General y Algebraica",
    "51": "Geometría",
    "51A": "Geometría de incidencia lineal",
    "51M": "Geometría euclidiana y absoluta real",
    "51P": "Geometría y física",
    "53": "Geometría diferencial",
    "53A": "Geometría diferencial clásica",
    "53C": "Geometría global (variedades de Riemann)",
    "53D": "Geometría simpléctica y de contacto",
    "54": "Topología general",
    "54D": "Propiedades de recubrimiento y separación (compacidad)",
    "54E": "Espacios con estructuras más ricas (espacios métricos)",
    "54F": "Espacios topológicos especiales (curvas, dimensión)",
    "55": "Topología algebraica",
    "55M": "Topología algebraica clásica",
    "55N": "Homología y cohomología",
    "55Q": "Teoría de homotopía",
    // V. Matemática Discreta y Computacional
    "05": "Combinatoria",
    "05A": "Combinatoria enumerativa",
    "05B": "Diseños y configuraciones",
    "05C": "Teoría de grafos",
    "68": "Ciencias de la computación",
    "68Q": "Teoría de la computación (Algoritmos, Complejidad P/NP)",
    "68R": "Informática discreta (Grafos en computación)",
    "68T": "Inteligencia artificial",
    "68W": "Algoritmos computacionales especializados",
    // VI. Probabilidad, Estadística y Aplicaciones
    "optimizacion-y-teoria-de-juegos": "Optimización y Teoría de Juegos",
    "fisica-matematica-y-biologia": "Física Matemática y Biología",
    "49": "Cálculo de variaciones y control óptimo; optimización",
    "49J": "Existencia de soluciones",
    "49K": "Condiciones de optimalidad",
    "49L": "Ecuaciones de Hamilton-Jacobi",
    "60": "Teoría de la probabilidad y procesos estocásticos",
    "60B": "Probabilidad en estructuras algebraicas y topológicas",
    "60C": "Probabilidad combinatoria",
    "60E": "Distribuciones, funciones características",
    "60F": "Teoremas límite (Ley de los grandes números, Teorema central del límite)",
    "60G": "Procesos estocásticos",
    "60H": "Análisis estocástico (Integrales de Itô)",
    "60J": "Cadenas de Markov, procesos de salto",
    "62": "Estadística",
    "62C": "Teoría de decisión estadística",
    "62D": "Muestreo, encuestas",
    "62F": "Inferencia paramétrica (Estimación de máxima verosimilitud)",
    "62G": "Inferencia no paramétrica",
    "62H": "Análisis multivariante",
    "62J": "Modelos lineales (Regresión, ANOVA)",
    "62M": "Inferencia en procesos estocásticos",
    "62P": "Aplicaciones estadísticas (Biometría, Econometría)",
    "65": "Análisis numérico",
    "65D": "Aproximación numérica (Interpolación, Cuadratura)",
    "65F": "Álgebra lineal numérica",
    "65H": "Sistemas de ecuaciones no lineales",
    "65L": "Ecuaciones diferenciales ordinarias numéricas",
    "65M": "Ecuaciones en derivadas parciales numéricas (Elementos finitos)",
    "70": "Mecánica de partículas y sistemas",
    "70E": "Dinámica de cuerpos rígidos",
    "70F": "Dinámica de sistemas de partículas (Problema de los N cuerpos)",
    "70H": "Mecánica hamiltoniana y lagrangiana",
    "74": "Mecánica de sólidos deformables",
    "74B": "Elasticidad lineal",
    "74F": "Acoplamiento de campos mecánicos con térmicos/electromagnéticos",
    "76": "Mecánica de fluidos",
    "76B": "Fluidos incompresibles no viscosos",
    "76D": "Fluidos incompresibles viscosos (Ecuaciones de Navier-Stokes)",
    "78": "Óptica, teoría electromagnética",
    "78A": "Óptica clásica y electromagnetismo (Ecuaciones de Maxwell)",
    "80": "Termodinámica clásica, transferencia de calor",
    "80A": "Termodinámica y transferencia de calor",
    "81": "Teoría cuántica",
    "81P": "Fundamentos, teoría cuántica de la información y entrelazamiento",
    "81Q": "Mecánica cuántica general",
    "81T": "Teoría cuántica de campos",
    "82": "Mecánica estadística, estructura de la materia",
    "82B": "Mecánica estadística de equilibrio",
    "82C": "Mecánica estadística dependiente del tiempo",
    "83": "Relatividad y teoría gravitacional",
    "83C": "Relatividad general",
    "83E": "Teorías unificadas y gravedad cuántica (Teoría de cuerdas)",
    "85": "Astronomía y astrofísica",
    "85A": "Modelos matemáticos en astronomía",
    "86": "Geofísica",
    "86A": "Modelos matemáticos en geofísica (Sismología, meteorología)",
    "90": "Investigación operativa, programación matemática",
    "90B": "Investigación operativa (Inventario, logística, teoría de colas)",
    "90C": "Programación matemática (Lineal, entera, convexa)",
    "91": "Teoría de juegos, economía, ciencias sociales y del comportamiento",
    "91A": "Teoría de juegos (Juegos cooperativos y no cooperativos)",
    "91B": "Economía matemática (Finanzas, teoría del equilibrio)",
    "92": "Biología y otras ciencias naturales",
    "92B": "Biología matemática en general",
    "92C": "Biomecánica y fisiología",
    "92D": "Genética y dinámica de poblaciones",
    // -- Secciones generales MSC2020 (nodos de agrupación) --
    "metadatos-y-divulgacion": "Ciencia y Técnica",
    "fundamentos-y-logica": "Fundamentos y Lógica",
    "algebra-y-teoria-de-numeros": "Álgebra y Teoría de Números",
    "analisis-matematico": "Análisis Matemático",
    "geometria-y-topologia": "Geometría y Topología",
    "matematica-discreta-y-computacional": "Matemática Discreta y Computacional",
    "probabilidad-estadistica-y-aplicaciones": "Probabilidad, Estadística y Aplicaciones",
  };

  /**
   * Jerarquía MSC2020: padres → hijos.
   * Cuando se navega un código de Nivel 1, se incluyen sus hijos de Nivel 2.
   */
  private static readonly mscHierarchy: Record<string, string[]> = {
    "00": ["00A", "00B"],
    "01": ["01A"],
    "97": ["97B", "97C", "97G", "97H", "97I"],
    "03": ["03A", "03B", "03C", "03D", "03E", "03F", "03G"],
    "08": ["08A", "08B", "08C"],
    // II. Álgebra y Teoría de Números — sub-ramas de generalización
    "geometria-algebraica": ["14"],
    "algebra-abstracta": ["12", "13"],
    "teoria-de-grupos-y-categorias": ["18", "20"],
    "11": ["11A", "11D", "11F", "11R", "11Y"],
    "12": ["12F", "12H"],
    "13": ["13B", "13F"],
    "14": ["14H", "14J", "14K"],
    "15": ["15A", "15B"],
    "18": ["18A", "18B", "18G"],
    "20": ["20D", "20F", "20M"],
    // III. Análisis Matemático — sub-ramas de generalización
    "analisis-real-y-funciones": ["26"],
    "analisis-complejo": ["30"],
    "ecuaciones-diferenciales": ["34"],
    "analisis-funcional-y-armonico": ["46"],
    "26": ["26A", "26B"],
    "30": ["30C", "30D"],
    "34": ["34A", "34C", "34D"],
    "46": ["46B", "46C", "46L"],
    // IV. Geometría y Topología — sub-ramas de generalización
    "geometria-clasica-y-diferencial": ["51", "53"],
    "topologia-general-y-algebraica": ["54", "55"],
    "51": ["51A", "51M", "51P"],
    "53": ["53A", "53C", "53D"],
    "54": ["54D", "54E", "54F"],
    "55": ["55M", "55N", "55Q"],
    "05": ["05A", "05B", "05C"],
    "68": ["68Q", "68R", "68T", "68W"],
    // VI. Probabilidad, Estadística y Aplicaciones — sub-ramas de generalización
    "optimizacion-y-teoria-de-juegos": ["49", "90", "91"],
    "fisica-matematica-y-biologia": ["70", "74", "76", "78", "80", "81", "82", "83", "85", "86", "92"],
    "49": ["49J", "49K", "49L"],
    "60": ["60B", "60C", "60E", "60F", "60G", "60H", "60J"],
    "62": ["62C", "62D", "62F", "62G", "62H", "62J", "62M", "62P"],
    "65": ["65D", "65F", "65H", "65L", "65M"],
    "70": ["70E", "70F", "70H"],
    "74": ["74B", "74F"],
    "76": ["76B", "76D"],
    "78": ["78A"],
    "80": ["80A"],
    "81": ["81P", "81Q", "81T"],
    "82": ["82B", "82C"],
    "83": ["83C", "83E"],
    "85": ["85A"],
    "86": ["86A"],
    "90": ["90B", "90C"],
    "91": ["91A", "91B"],
    "92": ["92B", "92C", "92D"],
    // -- Secciones generales MSC2020 (nodos de agrupación) --
    "metadatos-y-divulgacion": ["00", "01", "97"],
    "fundamentos-y-logica": ["03", "08"],
    "algebra-y-teoria-de-numeros": ["11", "15", "geometria-algebraica", "algebra-abstracta", "teoria-de-grupos-y-categorias"],
    "analisis-matematico": ["analisis-real-y-funciones", "analisis-complejo", "ecuaciones-diferenciales", "analisis-funcional-y-armonico"],
    "geometria-y-topologia": ["geometria-clasica-y-diferencial", "topologia-general-y-algebraica"],
    "matematica-discreta-y-computacional": ["05", "68"],
    "probabilidad-estadistica-y-aplicaciones": ["optimizacion-y-teoria-de-juegos", "fisica-matematica-y-biologia", "60", "62", "65"],
  };

  /**
   * Mapa inverso: código hijo → código padre.
   */
  private static readonly mscParent: Record<string, string> = (() => {
    const map: Record<string, string> = {};
    for (const [parent, children] of Object.entries(ContentStore.mscHierarchy)) {
      for (const child of children) {
        map[child] = parent;
      }
    }
    return map;
  })();

  /**
   * Mapa de herencia entre códigos (equivalente a subBranchInheritance).
   * Un código de Nivel 1 hereda los ítems de sus códigos hijo de Nivel 2.
   */
  private static readonly codeInheritance: Record<string, string[]> = ContentStore.mscHierarchy;

  /**
   * Resuelve un identificador de rama a un código MSC2020.
   * Acepta tanto códigos MSC ("51M") como nombres de tag españoles ("geometría euclidiana").
   */
  private static resolveBranchCode(input: string): string {
    const trimmed = input.trim();
    if (ContentStore.mscNames[trimmed]) return trimmed;
    const upper = trimmed.toUpperCase();
    if (ContentStore.mscNames[upper]) return upper;
    const mapped = ContentStore.tagToMSC[trimmed.toLowerCase()] || ContentStore.tagToMSC[trimmed];
    if (mapped) return mapped;
    const slugMapped = ContentStore.tagToMSC[trimmed.replace(/-/g, ' ')];
    if (slugMapped) return slugMapped;
    return trimmed;
  }

  /**
   * Devuelve los códigos hijo que deben incluirse al consultar un código padre.
   */
  private static getChildCodes(parentCode: string): string[] {
    return ContentStore.codeInheritance[parentCode] || [];
  }

  private static getAllDescendantCodes(code: string): string[] {
    const children = ContentStore.getChildCodes(code);
    const descendants = [...children];
    for (const child of children) {
      const grand = ContentStore.getAllDescendantCodes(child);
      descendants.push(...grand);
    }
    return descendants;
  }

  getBranchTaxonomy(branchId: string): {
    id: string;
    slug: string;
    name: string;
    subBranches: { name: string; slug: string }[];
    directItems: { type: string; item: BaseContent & { tags?: string[] }; subBranchSlug?: string }[];
    breadcrumbs: { name: string; slug: string }[];
  } {
    const branchCode = ContentStore.resolveBranchCode(branchId);
    const branchName = ContentStore.mscNames[branchCode] || branchId;
    const childCodes = ContentStore.getChildCodes(branchCode);
    const allDescendantCodes = ContentStore.getAllDescendantCodes(branchCode);
    const directItems: { type: string; item: BaseContent & { tags?: string[] }; subBranchSlug?: string }[] = [];

    // Breadcrumbs: ancestors of the current branch code (excluding the code itself)
    const breadcrumbs: { name: string; slug: string }[] = [];
    const chain: string[] = [];
    const seen = new Set<string>();
    let cur: string | undefined = branchCode;
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      chain.unshift(cur);
      cur = ContentStore.mscParent[cur];
    }
    for (let i = 0; i < chain.length - 1; i++) {
      const code = chain[i];
      breadcrumbs.push({ name: ContentStore.mscNames[code] || code, slug: code });
    }

    const processItem = (item: BaseContent & { tags?: string[] }, type: string) => {
      if (!item.tags || item.tags.length === 0) return;
      const tagCodes = item.tags
        .map(t => ContentStore.tagToMSC[t])
        .filter((c): c is string => !!c);
      if (tagCodes.length === 0) return;

      const directMatch = tagCodes.includes(branchCode);
      let inheritedChildCode: string | undefined;
      if (!directMatch) {
        inheritedChildCode = allDescendantCodes.find(c => tagCodes.includes(c));
      }

      if (!directMatch && !inheritedChildCode) return;

      let subBranchSlug: string | undefined;
      if (directMatch) {
        subBranchSlug = childCodes.find(c => tagCodes.includes(c));
      } else if (inheritedChildCode) {
        subBranchSlug = inheritedChildCode;
      }

      directItems.push({ type, item, subBranchSlug });
    };

    for (const thm of this.theorems.values()) processItem(thm, 'theorem');
    for (const lesson of this.lessons.values()) processItem(lesson, 'lesson');
    for (const def of this.definitions.values()) processItem(def, 'definition');
    for (const ex of this.examples.values()) processItem(ex, 'example');
    for (const ez of this.exercises.values()) processItem(ez, 'exercise');
    for (const axm of this.axioms.values()) processItem(axm, 'axiom');

    const subBranches = childCodes
      .map(code => ({ name: ContentStore.mscNames[code] || code, slug: code }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      id: branchCode,
      slug: branchCode.toLowerCase(),
      name: branchName,
      subBranches,
      directItems,
      breadcrumbs,
    };
  }

  getItemsByBranch(branch: string): { type: string; item: BaseContent & { tags?: string[] } }[] {
    const branchCode = ContentStore.resolveBranchCode(branch);
    const allDescendantCodes = ContentStore.getAllDescendantCodes(branchCode);
    const results: { type: string; item: BaseContent & { tags?: string[] } }[] = [];

    const check = (item: BaseContent & { tags?: string[] }, type: string) => {
      if (!item.tags) return;
      const tagCodes = item.tags
        .map(t => ContentStore.tagToMSC[t])
        .filter((c): c is string => !!c);
      if (tagCodes.includes(branchCode)) {
        results.push({ type, item });
      } else if (allDescendantCodes.some(c => tagCodes.includes(c))) {
        results.push({ type, item });
      }
    };

    for (const thm of this.theorems.values()) check(thm, 'theorem');
    for (const lesson of this.lessons.values()) check(lesson, 'lesson');
    for (const def of this.definitions.values()) check(def, 'definition');
    for (const ex of this.examples.values()) check(ex, 'example');
    for (const ez of this.exercises.values()) check(ez, 'exercise');
    for (const axm of this.axioms.values()) check(axm, 'axiom');
    return results;
  }
}
