# Informe de deuda técnica de Matematika

> Informe determinista generado por `npm run ai:debt`. No ejecuta validadores ni modifica código de producto.

## Cómo leer este informe

- **Hallazgo objetivo:** dato reproducible mediante lectura de archivos o configuración.
- **Heurística aproximada:** señal léxica o estructural que necesita revisión humana; no equivale a un defecto confirmado.
- **Recomendación:** acción propuesta; no se ejecuta automáticamente.

## Resumen ejecutivo

**Hallazgos objetivos.** Se inspeccionaron 702 archivos de texto, 406 archivos TS/TSX, 67 archivos de test y 120 archivos MDX.

**Heurísticas aproximadas.** Se localizaron 985 apariciones léxicas de `any`, 276 colores hex, 27 marcas TODO/FIXME, 38 archivos TS/TSX grandes y 40 rutas de importación potencialmente incompatibles con FSD.

**Recomendación.** Empezar por las rutas FSD y supresiones TypeScript, continuar con hex fuera de tokens, descomponer puntos de alta responsabilidad y cerrar después cobertura, contenido, Lean y duplicación IA.

## Deuda TypeScript

**Hallazgo objetivo.** Hay 406 archivos TS/TSX en el alcance; 0 archivo(s) contienen 0 supresiones `@ts-*`.

_Ninguno detectado._

**Heurística aproximada.** `any` se cuenta léxicamente, también dentro de comentarios, cadenas, documentación y nombres de reglas.

**Recomendación.** Revisar primero supresiones y usos reales de `any` en código ejecutable; no convertir automáticamente coincidencias textuales.

## Apariciones aproximadas de any por archivo

**Heurística aproximada.** Coincidencias de palabra completa `any` en TS/TSX.

| Archivo | Apariciones |
| --- | --- |
| `src/shared/diagrams/core/MathFactory.ts` | 77 |
| `src/widgets/diagrams/Definiciones/Cuadrilatero.tsx` | 76 |
| `scripts/editor/migrate-legacy-diagrams.ts` | 26 |
| `src/widgets/diagrams/Teoremas/CongruenciaALA.tsx` | 26 |
| `src/widgets/diagrams/Definiciones/Paralelogramo.tsx` | 25 |
| `src/widgets/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 25 |
| `src/widgets/diagrams/Teoremas/CongruenciaLLL.tsx` | 24 |
| `src/shared/diagrams/core/MathUtils.ts` | 20 |
| `src/widgets/diagrams/Teoremas/TrianguloIsosceles.tsx` | 18 |
| `src/widgets/diagrams/Teoremas/DemoPitagorasAreas.tsx` | 17 |
| `src/widgets/diagrams/Teoremas/SumaAngulos.tsx` | 17 |
| `src/widgets/diagrams/Definiciones/Mediana.tsx` | 16 |
| `src/widgets/diagrams/Teoremas/DemoSumaAngulos.tsx` | 15 |
| `src/widgets/diagrams/Definiciones/Bisectriz.tsx` | 14 |
| `src/widgets/diagrams/Teoremas/DesigualdadTriangular.tsx` | 14 |
| `src/widgets/diagrams/Teoremas/LemaPuntoMedio.tsx` | 14 |
| `src/widgets/diagrams/Teoremas/Pitagoras.tsx` | 14 |
| `src/features/editor/core/parser.ts` | 13 |
| `src/widgets/diagrams/Models/ModeloFano.tsx` | 12 |
| `src/widgets/diagrams/Models/ModeloTresPuntos.tsx` | 12 |
| `src/widgets/diagrams/Teoremas/AngulosOpuestos.tsx` | 12 |
| `scripts/ai/generate-debt-report.ts` | 11 |
| `src/widgets/diagrams/Definiciones/Mediatriz.tsx` | 11 |
| `src/widgets/diagrams/Definiciones/Triangulo.tsx` | 11 |
| `src/widgets/diagrams/Teoremas/DemoTales.tsx` | 11 |
| `src/widgets/diagrams/Teoremas/PuntoMedioPerpendicular.tsx` | 11 |
| `src/widgets/diagrams/Teoremas/Tales.tsx` | 11 |
| `src/widgets/diagrams/Axiomas/AxiomaArquimedes.tsx` | 10 |
| `src/widgets/diagrams/Axiomas/Congruence2.tsx` | 10 |
| `src/widgets/diagrams/Axiomas/Congruence3.tsx` | 10 |
| `src/widgets/diagrams/Axiomas/Pasch.tsx` | 10 |
| `src/widgets/diagrams/Demos/DemoCongruenciaALA.tsx` | 10 |
| `src/widgets/diagrams/Teoremas/DosRectasUnPunto.tsx` | 10 |
| `src/widgets/diagrams/Definiciones/Altura.tsx` | 9 |
| `src/shared/templates/diagrams/circulo-unitario.template.tsx` | 8 |
| `src/shared/templates/diagrams/eje-coordenadas.template.tsx` | 8 |
| `src/shared/templates/diagrams/triangulo-deformable.template.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Congruence1.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Congruence4.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/EuclidParallel.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/HyperbolicParallel.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Incidence1.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Incidence2.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Incidence3.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Incidence4.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Order1.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Order2.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/Order3.tsx` | 8 |
| `src/widgets/diagrams/Axiomas/SAS.tsx` | 8 |
| `src/widgets/diagrams/CasosUso/GpsTrilateracion.tsx` | 8 |
| `src/widgets/diagrams/Definiciones/Angulo.tsx` | 8 |
| `src/widgets/diagrams/Definiciones/Circunferencia.tsx` | 8 |
| `src/widgets/diagrams/Definiciones/Paralelas.tsx` | 8 |
| `src/widgets/diagrams/Definiciones/Perpendicular.tsx` | 8 |
| `src/widgets/diagrams/Definiciones/Punto.tsx` | 8 |
| `src/widgets/diagrams/Definiciones/Recta.tsx` | 8 |
| `src/widgets/diagrams/Definiciones/Segmento.tsx` | 8 |
| `src/widgets/diagrams/Definiciones/Semirrecta.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoAngulosOpuestos.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoAreaAditividad.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoCongruenciaLLL.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoInvarianciaTriangulacion.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoRectasCoincidentes.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoTriangulacionPoligono.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoTrianguloIsosceles.tsx` | 8 |
| `scripts/editor/parseDiagramSourceAST.ts` | 7 |
| `src/shared/diagrams/core/MathBoard.tsx` | 7 |
| `src/widgets/diagrams/Models/ModeloPoincare.tsx` | 7 |
| `src/features/editor/document/parseEditorDocument.ts` | 6 |
| `tests/features/graph/GraphStore.test.ts` | 6 |
| `tests/scripts/generate-test-report.ts` | 6 |
| `.agents/skills/diagrama/examples/JSXGraphCanon.tsx` | 5 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 5 |
| `src/features/editor/ui/EditorPage.tsx` | 5 |
| `src/widgets/diagrams/Ejercicios/EjemploPitagorasCalculo.tsx` | 4 |
| `src/widgets/diagrams/Ejercicios/EjercicioPitagorasCateto.tsx` | 4 |
| `src/features/editor/diagrams/source/generator.ts` | 3 |
| `src/features/editor/document/projectBlocks.ts` | 3 |
| `src/widgets/diagrams/Axiomas/AxiomaDedekind.tsx` | 3 |
| `src/widgets/diagrams/Definiciones/Plano.tsx` | 3 |
| `src/widgets/diagrams/Demos/DemoDosRectasUnPunto.tsx` | 3 |
| `src/widgets/diagrams/Models/ModeloCartesiano.tsx` | 3 |
| `scripts/core/validate-cross-references.ts` | 2 |
| `src/features/progress/ui/StudyPlanMinimap.tsx` | 2 |
| `src/shared/ui/JXGBoard.tsx` | 2 |
| `src/widgets/diagrams/Axiomas/Incidence5.tsx` | 2 |
| `src/widgets/diagrams/Axiomas/Incidence7.tsx` | 2 |
| `src/widgets/layouts/InteractiveLessonLayout.tsx` | 2 |
| `scripts/ai/generate-ai-indexes.ts` | 1 |
| `scripts/utils/detect-missing-links.ts` | 1 |
| `src/features/editor/ui/components/SemanticLinker.tsx` | 1 |
| `src/features/graph/lib/knowledgeGraphBuilder.ts` | 1 |
| `src/widgets/diagrams/Axiomas/Incidence6.tsx` | 1 |
| `src/widgets/diagrams/Axiomas/Incidence8.tsx` | 1 |
| `tests/features/editor/diagrams/repository.test.ts` | 1 |

**Recomendación.** Priorizar los archivos con más coincidencias y confirmar cada una con TypeScript/ESLint.

## Colores hex hardcodeados por archivo

**Heurística aproximada.** Coincidencias `#RGB`, `#RRGGBB` o `#RRGGBBAA`; incluye definiciones legítimas de tokens, ejemplos y cadenas.

| Archivo | Apariciones |
| --- | --- |
| `.auxiliary/.opencode/skills/diagrama/SKILL.md` | 47 |
| `src/shared/design/primitives.ts` | 38 |
| `.agents/skills/diagrama/SKILL.md` | 32 |
| `src/app/index.css` | 28 |
| `src/shared/lib/constants.ts` | 14 |
| `.agents/skills/page-creator/SKILL.md` | 10 |
| `.auxiliary/.opencode/skills/antigravity/SKILL.md` | 10 |
| `src/shared/lib/theme.ts` | 10 |
| `src/widgets/graph/LocalDependencyGraph.tsx` | 7 |
| `src/pages/HistoryTimeline.tsx` | 6 |
| `src/widgets/diagrams/Definiciones/Triangulo.tsx` | 6 |
| `tests/controller/math-utils.test.ts` | 6 |
| `src/features/graph/lib/graphUtils.ts` | 5 |
| `.agents/skills/diagrama/examples/JSXGraphCanon.tsx` | 4 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 4 |
| `src/features/graph/graph.worker.ts` | 4 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 4 |
| `src/shared/hooks/useThemeColors.ts` | 4 |
| `src/widgets/content/ProofStep.tsx` | 4 |
| `src/widgets/diagrams/Axiomas/Incidence5.tsx` | 4 |
| `src/widgets/diagrams/Axiomas/Incidence6.tsx` | 4 |
| `src/widgets/diagrams/Axiomas/Incidence7.tsx` | 4 |
| `src/widgets/diagrams/Axiomas/Incidence8.tsx` | 4 |
| `src/widgets/diagrams/Definiciones/Plano.tsx` | 4 |
| `.agents/skills/project-philosophy/SKILL.md` | 2 |
| `.auxiliary/TODO.md` | 2 |
| `ai/audits/code-quality-audit.md` | 2 |
| `src/shared/diagrams/core/MathUtils.ts` | 2 |
| `.opencode/plugins/matematika-guard.ts` | 1 |
| `docs/requirements/Product_Backlog.md` | 1 |
| `src/features/graph/ui/components/AxiomaticSearch.tsx` | 1 |
| `src/features/graph/ui/components/AxiomaticSidebar.tsx` | 1 |
| `src/shared/design/contentTypeColors.ts` | 1 |

**Recomendación.** Conservar únicamente definiciones canónicas de la paleta Arts & Crafts y sustituir usos visuales arbitrarios por `--theme-*` o tokens del proyecto.

## TODO/FIXME por archivo

**Heurística aproximada.** Coincidencias de palabra completa y en mayúsculas; pueden aparecer en documentación o en el propio tooling.

| Archivo | Apariciones |
| --- | --- |
| `scripts/ai/generate-debt-report.ts` | 12 |
| `scripts/ai/generate-ai-indexes.ts` | 4 |
| `.agents/skills/page-creator/SKILL.md` | 3 |
| `.auxiliary/.opencode/skills/antigravity/SKILL.md` | 2 |
| `.agents/skills/diagrama/examples/JSXGraphCanon.tsx` | 1 |
| `.agents/skills/diagrama/SKILL.md` | 1 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 1 |
| `.auxiliary/.opencode/skills/diagrama/SKILL.md` | 1 |
| `lean/Matematika/Geometry/Basic.lean` | 1 |
| `lean/Matematika/Geometry/Hilbert/Constructions.lean` | 1 |

**Recomendación.** Convertir deuda vigente en objetivos con responsable/criterio de cierre y retirar comentarios obsoletos.

## Archivos TS/TSX grandes

**Heurística aproximada.** Umbral: al menos 300 líneas o 20.000 bytes.

| Archivo | Líneas | Bytes |
| --- | --- | --- |
| `src/features/editor/ui/panels/VisualEditorPanel.tsx` | 988 | 54649 |
| `src/features/editor/ui/EditorPage.tsx` | 895 | 33866 |
| `scripts/ai/generate-debt-report.ts` | 848 | 35233 |
| `scripts/ai/generate-ai-indexes.ts` | 770 | 29276 |
| `src/features/editor/diagrams/model/commands.ts` | 749 | 32247 |
| `src/features/editor/core/parser.ts` | 625 | 21040 |
| `src/features/editor/ui/diagrams/DiagramWorkbench.tsx` | 580 | 23943 |
| `tests/e2e/editor/editor-safe-ux.e2e.ts` | 545 | 27385 |
| `scripts/editor/parseDiagramSourceAST.ts` | 539 | 20915 |
| `tests/features/editor/useEditorCore.test.ts` | 517 | 23552 |
| `src/features/editor/diagrams/ui/DiagramCanvas.tsx` | 517 | 18497 |
| `src/features/graph/graph.worker.ts` | 509 | 15887 |
| `src/widgets/diagrams/Definiciones/Cuadrilatero.tsx` | 490 | 21785 |
| `src/shared/lib/glossaryDictionary.ts` | 483 | 18549 |
| `src/entities/content/ContentStore.ts` | 448 | 17825 |
| `scripts/core/lean-graph-utils.ts` | 439 | 15008 |
| `src/entities/content/msc2020.ts` | 431 | 17110 |
| `src/features/editor/ux/safetyPresentation.ts` | 431 | 16086 |
| `src/features/graph/GraphStore.ts` | 414 | 14785 |
| `src/features/editor/core/useEditorCore.ts` | 407 | 20508 |
| `tests/features/editor/persistence/editorPersistenceBackend.test.ts` | 400 | 21891 |
| `src/features/editor/ux/diffReview.ts` | 380 | 13109 |
| `src/widgets/content/MarginaliaPanel.tsx` | 368 | 14638 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 366 | 16130 |
| `scripts/ai/review-working-tree.ts` | 360 | 12260 |
| `src/features/editor/ui/components/SemanticLinker.tsx` | 356 | 14648 |
| `tests/features/editor/diagrams/reducer.test.ts` | 346 | 13180 |
| `src/widgets/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 345 | 13603 |
| `src/features/editor/diagrams/ui/DiagramInspector.tsx` | 337 | 13711 |
| `src/features/metadata/ui/PageDependencyGraph.tsx` | 327 | 9793 |
| `tests/features/editor/diagrams/useDiagramState.test.tsx` | 323 | 12934 |
| `scripts/editor/migrate-legacy-diagrams.ts` | 322 | 15630 |
| `tests/database/content-store.test.ts` | 320 | 9637 |
| `src/features/editor/core/validation.ts` | 314 | 14416 |
| `scripts/editor/editorPersistenceBackend.ts` | 311 | 15527 |
| `src/widgets/graph/LocalDependencyGraph.tsx` | 303 | 9161 |
| `src/features/graph/lib/graphWorkerContract.ts` | 303 | 7868 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 302 | 10981 |

**Recomendación.** Revisar cohesión antes de dividir: tamaño alto es una señal, no una prueba de mal diseño.

## Posibles componentes con demasiadas responsabilidades

**Heurística aproximada.** TSX de al menos 250 líneas, o combinación alta de imports/hooks, o 12+ handlers.

| Componente | Líneas | Imports | Hooks | Handlers |
| --- | --- | --- | --- | --- |
| `src/features/editor/ui/panels/VisualEditorPanel.tsx` | 988 | 6 | 0 | 113 |
| `src/features/editor/ui/EditorPage.tsx` | 895 | 24 | 21 | 56 |
| `src/features/editor/ui/diagrams/DiagramWorkbench.tsx` | 580 | 14 | 7 | 82 |
| `src/features/editor/diagrams/ui/DiagramCanvas.tsx` | 517 | 3 | 0 | 40 |
| `src/widgets/diagrams/Definiciones/Cuadrilatero.tsx` | 490 | 3 | 0 | 8 |
| `src/widgets/content/MarginaliaPanel.tsx` | 368 | 8 | 1 | 4 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 366 | 15 | 27 | 22 |
| `src/features/editor/ui/components/SemanticLinker.tsx` | 356 | 3 | 7 | 29 |
| `src/widgets/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 345 | 2 | 0 | 6 |
| `src/features/editor/diagrams/ui/DiagramInspector.tsx` | 337 | 5 | 0 | 63 |
| `src/features/metadata/ui/PageDependencyGraph.tsx` | 327 | 6 | 8 | 6 |
| `src/widgets/graph/LocalDependencyGraph.tsx` | 303 | 6 | 2 | 3 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 302 | 7 | 12 | 9 |
| `src/pages/GraphPage.tsx` | 297 | 13 | 14 | 17 |
| `src/features/editor/ui/EditorNavigation.tsx` | 291 | 3 | 6 | 17 |
| `src/widgets/mdx/MDXBlocks.tsx` | 281 | 25 | 3 | 1 |
| `src/widgets/navigation/SearchOmnibar.tsx` | 271 | 6 | 12 | 14 |
| `src/pages/Home/components/BranchLibrary.tsx` | 271 | 3 | 1 | 0 |
| `src/pages/TheoremPage.tsx` | 263 | 16 | 3 | 0 |
| `src/features/exercises/ui/Emparejar.tsx` | 262 | 3 | 8 | 2 |
| `src/features/exercises/ui/Clasificador.tsx` | 220 | 3 | 4 | 16 |
| `src/features/editor/ui/blocks/DemonstrationBlock.tsx` | 208 | 3 | 0 | 28 |
| `src/features/exercises/ui/Hueco.tsx` | 195 | 2 | 5 | 16 |
| `src/features/editor/ui/panels/MetadataPanel.tsx` | 188 | 5 | 0 | 21 |
| `src/features/editor/ui/EditorToolbar.tsx` | 171 | 8 | 0 | 13 |
| `src/features/editor/ui/components/MetadataInspector.tsx` | 166 | 2 | 1 | 24 |
| `src/features/editor/ui/diff/DiffReviewPanel.tsx` | 164 | 2 | 1 | 19 |
| `src/shared/diagrams/core/MathBoard.tsx` | 161 | 3 | 10 | 17 |
| `src/features/editor/diagrams/ui/DiagramToolbar.tsx` | 129 | 2 | 0 | 34 |
| `src/features/glossary/ui/ConceptLink.tsx` | 113 | 6 | 3 | 15 |
| `src/features/editor/ui/safety/UnsavedChangesDialog.tsx` | 107 | 2 | 1 | 21 |

**Recomendación.** Separar coordinación, estado y presentación solo cuando la revisión confirme más de una razón de cambio.

## Deuda de tests por zona

**Hallazgo objetivo.** Se detectaron 67 archivos de test. La tabla cuenta archivos fuente y tests que importan directamente cada zona.

| Zona | TS/TSX fuente | Tests con import directo |
| --- | --- | --- |
| app | 6 | 2 |
| pages | 22 | 0 |
| widgets | 108 | 4 |
| features | 124 | 34 |
| entities | 9 | 7 |
| shared | 43 | 13 |
| database | 0 | 0 |

**Heurística aproximada.** Cero imports directos no significa cero cobertura: una prueba puede cubrir una zona de forma transitiva. La tabla no usa instrumentación.

**Recomendación.** Ejecutar `npm run test:coverage` y usar cobertura por rama como evidencia antes de crear tests.

## Deuda de arquitectura/FSD

**Hallazgo objetivo.** `.dependency-cruiser.js` declara 4 reglas con severidad error y 10 con severidad warning.

**Heurística aproximada.** Las rutas siguientes se deducen de imports estáticos y las invariantes globales; no aplican todas las excepciones de Dependency Cruiser.

| Origen | Import | Señal |
| --- | --- | --- |
| `src/features/progress/ui/StudyPlanCheckpoint.tsx` | `@/app/providers/StudyPlanContext` | features → pages/app |
| `src/features/progress/ui/StudyTask.tsx` | `@/app/providers/StudyPlanContext` | features → pages/app |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/BranchLibrary` | pages → pages |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/HeroSection` | pages → pages |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/HomeFooter` | pages → pages |
| `src/shared/ui/AplicacionesSection.tsx` | `@/entities/content/types` | shared → capa superior |
| `src/shared/ui/InteractiveTimePlot.tsx` | `@/entities/content` | shared → capa superior |
| `src/widgets/content/ContentHeader.tsx` | `@/features/graph/ui/ModelBadge` | widgets → pages/features |
| `src/widgets/content/MarginaliaPanel.tsx` | `@/features/glossary/GlossaryStore` | widgets → pages/features |
| `src/widgets/content/SimSection.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/content/SymbolDictionaryManager.tsx` | `@/features/glossary/GlossaryStore` | widgets → pages/features |
| `src/widgets/diagrams/Definiciones/Plano.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/diagrams/Ejercicios/EjemploPitagorasCalculo.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/diagrams/Ejercicios/EjercicioPitagorasCateto.tsx` | `@/features/exercises/ui/ExerciseContext` | widgets → pages/features |
| `src/widgets/diagrams/Ejercicios/EjercicioPitagorasCateto.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/diagrams/Teoremas/DemoSumaAngulos.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/diagrams/Teoremas/DemoTales.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/layouts/InteractiveLessonLayout.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/layouts/SimulationLayout.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Apoyo` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/CanvasInteractivo` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Clasificador` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/DeslizadorEnLine` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Emparejar` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/ErrorComun` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Hueco` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/MatrizInteractiva` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Ordenacion` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Paso` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/PasoEjercicio` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Pregunta` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Resolucion` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/exercises/ui/Solucion` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/glossary/ui/Concept` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/glossary/ui/ConceptLink` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/glossary/ui/RefLink` | widgets → pages/features |
| `src/widgets/mdx/MDXBlocks.tsx` | `@/features/lessons/ui/HighlightLink` | widgets → pages/features |
| `src/widgets/navigation/SearchOmnibar.tsx` | `@/features/glossary/GlossaryStore` | widgets → pages/features |
| `src/widgets/navigation/SearchOmnibar.tsx` | `@/features/search/lib/searchApi` | widgets → pages/features |
| `src/widgets/navigation/TopBar.tsx` | `@/features/search/NavigationStore` | widgets → pages/features |

**Recomendación.** Confirmar cada ruta con `npm run depcruise`; la configuración ejecutable es la autoridad técnica.

## Deuda de contenido/MDX

**Hallazgo objetivo.** Inventario léxico por carpeta:

| Zona de contenido | Archivos MDX |
| --- | --- |
| axiomatic-systems | 4 |
| axioms | 21 |
| definitions | 22 |
| demonstrations | 25 |
| examples | 1 |
| exercises | 1 |
| lessons | 7 |
| mathematicians | 9 |
| models | 4 |
| plans | 1 |
| theorems | 24 |
| usecases | 1 |

El índice de cobertura existente declara 120 entradas, 58 sin diagrama y 71 sin formalización Lean. Puede estar desactualizado hasta regenerarse.

**Heurísticas aproximadas.** 0 archivos carecen de una o más claves base; 120 no declaran `requires` (opcional en Zod, exigido por la política topológica); 1 IDs no coinciden con el nombre de archivo; 0 anchors HTML con `href`; 124 `ProofStep` sin atributo `justificacion`; 1 axiomas/definiciones/teoremas sin señal léxica de interactividad.

_Ninguno detectado._

| Zona | Archivos sin `requires` |
| --- | --- |
| axiomatic-systems | 4 |
| axioms | 21 |
| definitions | 22 |
| demonstrations | 25 |
| examples | 1 |
| exercises | 1 |
| lessons | 7 |
| mathematicians | 9 |
| models | 4 |
| plans | 1 |
| theorems | 24 |
| usecases | 1 |

| Archivo | ID detectado distinto del basename |
| --- | --- |
| `src/database/content/plans/plan-de-estudio-camino-teorema-pitagoras.mdx` | camino-teorema-pitagoras |

_Ninguno detectado._

| Archivo | `ProofStep` sin `justificacion` |
| --- | --- |
| `src/database/content/demonstrations/demo-existencia-perpendicular.mdx` | 8 |
| `src/database/content/demonstrations/demo-angulo-externo.mdx` | 7 |
| `src/database/content/demonstrations/demo-congruencia-aal.mdx` | 7 |
| `src/database/content/demonstrations/demo-pitagoras-euclides.mdx` | 7 |
| `src/database/content/demonstrations/demo-angulos-alternos-internos.mdx` | 6 |
| `src/database/content/demonstrations/demo-reciproco-triangulo-isosceles.mdx` | 6 |
| `src/database/content/demonstrations/demo-tales.mdx` | 6 |
| `src/database/content/demonstrations/demo-angulos-opuestos-verticales.mdx` | 5 |
| `src/database/content/demonstrations/demo-area-triangulo.mdx` | 5 |
| `src/database/content/demonstrations/demo-desigualdad-triangular.mdx` | 5 |
| `src/database/content/demonstrations/demo-existencia-bisectriz.mdx` | 5 |
| `src/database/content/demonstrations/demo-punto-medio-perpendicular.mdx` | 5 |
| `src/database/content/demonstrations/demo-punto-medio.mdx` | 5 |
| `src/database/content/demonstrations/demo-rectas-coincidentes.mdx` | 5 |
| `src/database/content/demonstrations/demo-suma-angulos-triangulo.mdx` | 5 |
| `src/database/content/demonstrations/demo-area-invariancia.mdx` | 4 |
| `src/database/content/demonstrations/demo-congruencia-lll.mdx` | 4 |
| `src/database/content/demonstrations/demo-dos-rectas-un-punto.mdx` | 4 |
| `src/database/content/demonstrations/demo-invariancia-triangulacion.mdx` | 4 |
| `src/database/content/demonstrations/demo-pitagoras-areas.mdx` | 4 |
| `src/database/content/demonstrations/demo-triangulacion-poligono.mdx` | 4 |
| `src/database/content/demonstrations/demo-triangulo-isosceles.mdx` | 4 |
| `src/database/content/demonstrations/demo-area-aditividad.mdx` | 3 |
| `src/database/content/demonstrations/demo-area-rectangulo.mdx` | 3 |
| `src/database/content/demonstrations/demo-congruencia-ala.mdx` | 3 |

| Archivo | Señal léxica |
| --- | --- |
| `src/database/content/theorems/corolario-rectas-coincidentes.mdx` | sin señal de interactividad |

**Recomendación.** Verificar con los validadores de contenido y revisión editorial; no corregir en masa desde estas coincidencias.

## Deuda de Lean

**Hallazgo objetivo.** 12 archivos Lean y 149 declaraciones aproximadas; deuda bridge registrada: 0 entradas.

**Heurísticas aproximadas.** 45 apariciones de `sorry`/`admit`, 0 imports de Mathlib y 2 TODO/FIXME.

| Archivo | `sorry`/`admit` |
| --- | --- |
| `lean/Matematika/Geometry/Hilbert/PendingDemonstrations.lean` | 23 |
| `lean/Matematika/Geometry/Hilbert/PendingTheorems.lean` | 22 |

_Ninguno detectado._

| Archivo | TODO/FIXME |
| --- | --- |
| `lean/Matematika/Geometry/Basic.lean` | 1 |
| `lean/Matematika/Geometry/Hilbert/Constructions.lean` | 1 |

**Recomendación.** Confirmar con `npm run validate-no-mathlib`, `npm run validate-lean` y `npm run bridge:audit`; este informe no compila Lean.

## Deuda de infraestructura IA

**Hallazgo objetivo.** Presencia de piezas operativas esperadas:

| Ruta | Estado |
| --- | --- |
| `AGENTS.md` | presente |
| `docs/ai/README.md` | presente |
| `docs/ai/protocol.md` | presente |
| `ai/README.md` | presente |
| `ai/current-state.md` | presente |
| `scripts/ai/generate-ai-indexes.ts` | presente |
| `scripts/ai/review-working-tree.ts` | presente |

| Comando | Estado |
| --- | --- |
| npm run ai:index | presente |
| npm run ai:review | presente |
| npm run ai:debt | presente |

**Heurística aproximada.** 0 piezas esperadas ausentes y 0 warnings de lectura durante el análisis.

**Recomendación.** Mantener gobierno, operación, skills y adaptadores en sus capas de autoridad; regenerar índices al cambiar estructura o comandos.

## Artefactos generados o archivos que no deberían entrar en contexto

**Hallazgo objetivo.** Rutas presentes que conviene excluir del contexto habitual:

| Ruta | Motivo | Ignorada por `.gitignore` |
| --- | --- | --- |
| `node_modules` | dependencias instaladas | sí |
| `.opencode/node_modules` | dependencias locales del adaptador | sí |
| `dist` | salida de build | sí |
| `coverage` | cobertura generada | sí |
| `.vite` | caché de Vite | sí |
| `lean/.lake` | caché y build de Lean | sí |
| `docs/api` | documentación API generada | sí |
| `scripts/plantuml.jar` | binario de tooling | no/no inferido |
| `package-lock.json` | lockfile voluminoso | no/no inferido |
| `src/entities/content/contentIndex.json` | índice generado | no/no inferido |
| `src/entities/content/contentCoverage.json` | cobertura de contenido generada | no/no inferido |
| `src/entities/graph/graph_structure.json` | grafo generado | no/no inferido |
| `src/entities/graph/lean_graph.json` | grafo Lean generado | no/no inferido |
| `src/entities/graph/proof_blocks.json` | bloques de prueba generados | no/no inferido |

**Recomendación.** Cargar estos artefactos solo cuando sean la fuente concreta de una comprobación; no usar generados como autoridad editable.

## Duplicación potencial entre capas IA

**Hallazgo objetivo.** Archivos de texto por capa:

| Capa | Archivos |
| --- | --- |
| `ai/` | 57 |
| `docs/ai/` | 2 |
| `.agents/` | 19 |
| `.opencode/` | 11 |
| `.auxiliary/` | 22 |

**Heurísticas aproximadas.** 19 basenames repetidos entre capas y 11 grupos de contenido byte-a-byte idéntico. Un basename repetido no implica duplicación semántica.

| Nombre repetido | Rutas |
| --- | --- |
| axioma.mdx | `.agents/skills/page-creator/templates/axioma.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/axioma.mdx` |
| caso-de-uso.mdx | `.agents/skills/page-creator/templates/caso-de-uso.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/caso-de-uso.mdx` |
| components.md | `.agents/skills/page-creator/reference/components.md`<br>`.auxiliary/.opencode/skills/antigravity/reference/components.md` |
| definicion.mdx | `.agents/skills/page-creator/templates/definicion.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/definicion.mdx` |
| demostracion.mdx | `.agents/skills/page-creator/templates/demostracion.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/demostracion.mdx` |
| ejemplo.mdx | `.agents/skills/page-creator/templates/ejemplo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejemplo.mdx` |
| ejercicio.mdx | `.agents/skills/page-creator/templates/ejercicio.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejercicio.mdx` |
| JSXGraphCanon.tsx | `.agents/skills/diagrama/examples/JSXGraphCanon.tsx`<br>`.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` |
| matematico.mdx | `.agents/skills/page-creator/templates/matematico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/matematico.mdx` |
| modelo.mdx | `.agents/skills/page-creator/templates/modelo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/modelo.mdx` |
| new-diagram.md | `.opencode/commands/new-diagram.md`<br>`ai/prompts/opencode/new-diagram.md` |
| package-lock.json | `.auxiliary/.opencode/package-lock.json`<br>`.opencode/package-lock.json` |
| package.json | `.auxiliary/.opencode/package.json`<br>`.opencode/package.json` |
| README.md | `ai/phases/editor-authoring/README.md`<br>`ai/prompts/README.md`<br>`ai/README.md`<br>`docs/ai/README.md` |
| sistema-axiomatico.mdx | `.agents/skills/page-creator/templates/sistema-axiomatico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/sistema-axiomatico.mdx` |
| SKILL.md | `.agents/skills/diagrama/SKILL.md`<br>`.agents/skills/lean-formalizer/SKILL.md`<br>`.agents/skills/page-creator/SKILL.md`<br>`.agents/skills/project-philosophy/SKILL.md`<br>`.auxiliary/.opencode/skills/antigravity/SKILL.md`<br>`.auxiliary/.opencode/skills/diagrama/SKILL.md` |
| SVGCanon.tsx | `.agents/skills/diagrama/examples/SVGCanon.tsx`<br>`.auxiliary/.opencode/skills/diagrama/examples/SVGCanon.tsx` |
| teorema.mdx | `.agents/skills/page-creator/templates/teorema.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/teorema.mdx` |
| validate.mjs | `.agents/skills/page-creator/scripts/validate.mjs`<br>`.auxiliary/.opencode/skills/antigravity/scripts/validate.mjs` |

| Grupo idéntico | Rutas |
| --- | --- |
| 1 | `.agents/skills/diagrama/examples/JSXGraphCanon.tsx`<br>`.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` |
| 2 | `.agents/skills/diagrama/examples/SVGCanon.tsx`<br>`.auxiliary/.opencode/skills/diagrama/examples/SVGCanon.tsx` |
| 3 | `.agents/skills/page-creator/templates/axioma.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/axioma.mdx` |
| 4 | `.agents/skills/page-creator/templates/caso-de-uso.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/caso-de-uso.mdx` |
| 5 | `.agents/skills/page-creator/templates/definicion.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/definicion.mdx` |
| 6 | `.agents/skills/page-creator/templates/ejemplo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejemplo.mdx` |
| 7 | `.agents/skills/page-creator/templates/ejercicio.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejercicio.mdx` |
| 8 | `.agents/skills/page-creator/templates/matematico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/matematico.mdx` |
| 9 | `.agents/skills/page-creator/templates/modelo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/modelo.mdx` |
| 10 | `.agents/skills/page-creator/templates/sistema-axiomatico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/sistema-axiomatico.mdx` |
| 11 | `.auxiliary/.opencode/package.json`<br>`.opencode/package.json` |

**Recomendación.** Auditar primero `.auxiliary/`; conservar duplicaciones solo cuando sean adaptadores deliberados y documentados.

## Orden recomendado de refactor

1. **Restaurar señales de seguridad:** confirmar rutas FSD, supresiones TypeScript y usos ejecutables de `any`.
2. **Limpiar deuda visual:** separar tokens canónicos de hex arbitrarios y migrar los usos confirmados a la paleta.
3. **Reducir concentración estructural:** revisar archivos grandes y componentes candidatos por razones de cambio.
4. **Cerrar huecos de tests:** obtener cobertura instrumentada y priorizar zonas críticas, no ratios léxicos.
5. **Resolver deuda editorial y formal:** validar MDX, referencias, grafo, Lean y bridge con sus comandos propios.
6. **Podar contexto IA:** retirar duplicación histórica confirmada y mantener índices/reportes regenerables.

## Limitaciones del análisis

- Los conteos son léxicos y aproximados; incluyen comentarios, cadenas y documentación cuando coincide el patrón.
- No se ejecutan TypeScript, ESLint, Vitest, Dependency Cruiser, validadores MDX ni Lean.
- La cobertura de tests se aproxima por imports directos, no por instrumentación ni comportamiento.
- La cohesión de componentes y la interactividad MDX requieren revisión humana.
- Los JSON generados existentes pueden estar desactualizados respecto a sus fuentes.
