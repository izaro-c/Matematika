# Informe de deuda técnica de Matematika

> Informe determinista generado por `npm run ai:debt`. No ejecuta validadores ni modifica código de producto.

## Cómo leer este informe

- **Hallazgo objetivo:** dato reproducible mediante lectura de archivos o configuración.
- **Heurística aproximada:** señal léxica o estructural que necesita revisión humana; no equivale a un defecto confirmado.
- **Recomendación:** acción propuesta; no se ejecuta automáticamente.

## Resumen ejecutivo

**Hallazgos objetivos.** Se inspeccionaron 790 archivos de texto, 470 archivos TS/TSX, 107 archivos de test y 120 archivos MDX.

**Heurísticas aproximadas.** Se localizaron 980 apariciones léxicas de `any`, 116 colores hex, 27 marcas TODO/FIXME, 52 archivos TS/TSX grandes y 31 rutas de importación potencialmente incompatibles con FSD.

**Recomendación.** Empezar por las rutas FSD y supresiones TypeScript, continuar con hex fuera de tokens, descomponer puntos de alta responsabilidad y cerrar después cobertura, contenido, Lean y duplicación IA.

## Deuda TypeScript

**Hallazgo objetivo.** Hay 470 archivos TS/TSX en el alcance; 0 archivo(s) contienen 0 supresiones `@ts-*`.

_Ninguno detectado._

**Heurística aproximada.** `any` se cuenta léxicamente, también dentro de comentarios, cadenas, documentación y nombres de reglas.

**Recomendación.** Revisar primero supresiones y usos reales de `any` en código ejecutable; no convertir automáticamente coincidencias textuales.

## Apariciones aproximadas de any por archivo

**Heurística aproximada.** Coincidencias de palabra completa `any` en TS/TSX.

| Archivo | Apariciones |
| --- | --- |
| `src/shared/diagrams/core/MathFactory.ts` | 130 |
| `src/widgets/diagrams/Definiciones/Cuadrilatero.tsx` | 76 |
| `scripts/editor/migrate-legacy-diagrams.ts` | 26 |
| `src/widgets/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 25 |
| `src/widgets/diagrams/Teoremas/CongruenciaLLL.tsx` | 24 |
| `src/shared/diagrams/core/MathUtils.ts` | 20 |
| `src/widgets/diagrams/Teoremas/TrianguloIsosceles.tsx` | 18 |
| `src/widgets/diagrams/Teoremas/DemoPitagorasAreas.tsx` | 17 |
| `src/widgets/diagrams/Teoremas/SumaAngulos.tsx` | 17 |
| `src/widgets/diagrams/Definiciones/Mediana.tsx` | 16 |
| `src/widgets/diagrams/Teoremas/DemoSumaAngulos.tsx` | 15 |
| `src/shared/diagrams/runtime/DiagramRenderer.tsx` | 14 |
| `src/widgets/diagrams/Definiciones/Bisectriz.tsx` | 14 |
| `src/widgets/diagrams/Teoremas/DesigualdadTriangular.tsx` | 14 |
| `src/widgets/diagrams/Teoremas/LemaPuntoMedio.tsx` | 14 |
| `src/features/editor/core/parser.ts` | 13 |
| `src/widgets/diagrams/Models/ModeloFano.tsx` | 12 |
| `src/widgets/diagrams/Models/ModeloTresPuntos.tsx` | 12 |
| `src/widgets/diagrams/Teoremas/AngulosOpuestos.tsx` | 12 |
| `scripts/ai/generate-debt-report.ts` | 11 |
| `src/shared/diagrams/core/MathBoard.tsx` | 11 |
| `src/widgets/diagrams/Definiciones/Mediatriz.tsx` | 11 |
| `src/widgets/diagrams/Definiciones/Triangulo.tsx` | 11 |
| `src/widgets/diagrams/Teoremas/DemoTales.tsx` | 11 |
| `src/widgets/diagrams/Teoremas/PuntoMedioPerpendicular.tsx` | 11 |
| `src/widgets/diagrams/Teoremas/Tales.tsx` | 11 |
| `scripts/editor/parseDiagramSourceAST.ts` | 10 |
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
| `tests/features/graph/GraphStore.test.ts` | 7 |
| `tests/scripts/generate-test-report.ts` | 6 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 5 |
| `src/features/editor/ui/EditorPage.tsx` | 5 |
| `tests/shared/diagrams/Phase3Renderer.test.tsx` | 5 |
| `src/features/editor/document/parseEditorDocument.ts` | 4 |
| `src/widgets/diagrams/Ejercicios/EjemploPitagorasCalculo.tsx` | 4 |
| `src/widgets/diagrams/Ejercicios/EjercicioPitagorasCateto.tsx` | 4 |
| `src/widgets/diagrams/Axiomas/AxiomaDedekind.tsx` | 3 |
| `src/widgets/diagrams/Demos/DemoDosRectasUnPunto.tsx` | 3 |
| `src/widgets/diagrams/Models/ModeloCartesiano.tsx` | 3 |
| `scripts/core/validate-cross-references.ts` | 2 |
| `src/features/progress/ui/StudyPlanMinimap.tsx` | 2 |
| `src/shared/ui/JXGBoard.tsx` | 2 |
| `src/widgets/diagrams/Axiomas/Incidence5.tsx` | 2 |
| `src/widgets/diagrams/Axiomas/Incidence7.tsx` | 2 |
| `src/widgets/diagrams/Definiciones/Plano.tsx` | 2 |
| `tests/features/editor/diagrams/Phase4Interaction.test.tsx` | 2 |
| `scripts/ai/generate-ai-indexes.ts` | 1 |
| `scripts/utils/detect-missing-links.ts` | 1 |
| `src/features/editor/document/blockRegistry.ts` | 1 |
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
| `src/app/theme.css` | 18 |
| `.auxiliary/.opencode/skills/antigravity/SKILL.md` | 10 |
| `src/shared/lib/theme.ts` | 10 |
| `src/pages/HistoryTimeline.tsx` | 6 |
| `tests/controller/math-utils.test.ts` | 6 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 4 |
| `src/widgets/content/ProofStep.tsx` | 4 |
| `tests/features/metadata/PageDependencyGraph.test.tsx` | 4 |
| `.agents/skills/project-philosophy/SKILL.md` | 2 |
| `.auxiliary/TODO.md` | 2 |
| `ai/audits/code-quality-audit.md` | 2 |
| `docs/requirements/Product_Backlog.md` | 1 |

**Recomendación.** Conservar únicamente definiciones canónicas de la paleta Arts & Crafts y sustituir usos visuales arbitrarios por `--theme-*` o tokens del proyecto.

## TODO/FIXME por archivo

**Heurística aproximada.** Coincidencias de palabra completa y en mayúsculas; pueden aparecer en documentación o en el propio tooling.

| Archivo | Apariciones |
| --- | --- |
| `scripts/ai/generate-debt-report.ts` | 12 |
| `scripts/ai/generate-ai-indexes.ts` | 4 |
| `.agents/skills/page-creator/SKILL.md` | 3 |
| `.auxiliary/.opencode/skills/antigravity/SKILL.md` | 2 |
| `.agents/skills/diagrama/references/patterns.md` | 1 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 1 |
| `.auxiliary/.opencode/skills/diagrama/SKILL.md` | 1 |
| `lean/Matematika/Geometry/Basic.lean` | 1 |
| `lean/Matematika/Geometry/Hilbert/Constructions.lean` | 1 |
| `src/shared/lib/constants.ts` | 1 |

**Recomendación.** Convertir deuda vigente en objetivos con responsable/criterio de cierre y retirar comentarios obsoletos.

## Archivos TS/TSX grandes

**Heurística aproximada.** Umbral: al menos 300 líneas o 20.000 bytes.

| Archivo | Líneas | Bytes |
| --- | --- | --- |
| `src/widgets/diagrams/Definiciones/Paralelogramo.tsx` | 1569 | 34398 |
| `src/widgets/diagrams/Teoremas/CongruenciaALA.tsx` | 1448 | 29635 |
| `src/widgets/diagrams/Teoremas/Pitagoras.tsx` | 1181 | 24357 |
| `src/shared/diagrams/runtime/DiagramRenderer.tsx` | 1073 | 53572 |
| `src/widgets/diagrams/Models/ModeloPoincare.tsx` | 1058 | 24739 |
| `src/features/editor/diagrams/ui/DiagramInspector.tsx` | 852 | 49831 |
| `scripts/ai/generate-debt-report.ts` | 848 | 35233 |
| `src/features/editor/ui/diagrams/DiagramWorkbench.tsx` | 826 | 43109 |
| `tests/e2e/editor/editor-safe-ux.e2e.ts` | 809 | 40551 |
| `scripts/ai/generate-ai-indexes.ts` | 770 | 29276 |
| `src/features/editor/ui/EditorPage.tsx` | 755 | 30116 |
| `src/features/editor/core/parser.ts` | 639 | 21841 |
| `src/features/graph/graph.worker.ts` | 578 | 17905 |
| `scripts/editor/parseDiagramSourceAST.ts` | 547 | 21238 |
| `src/features/editor/document/structuralOperations.ts` | 546 | 22387 |
| `src/features/editor/core/useEditorCore.ts` | 536 | 27872 |
| `src/shared/diagrams/core/MathFactory.ts` | 528 | 18570 |
| `tests/features/editor/useEditorCore.test.ts` | 518 | 23350 |
| `src/shared/diagrams/spec/scene.ts` | 495 | 22711 |
| `src/widgets/diagrams/Definiciones/Cuadrilatero.tsx` | 490 | 21785 |
| `src/shared/diagrams/spec/schema.ts` | 484 | 24563 |
| `src/shared/lib/glossaryDictionary.ts` | 483 | 18549 |
| `src/widgets/navigation/SearchOmnibar.tsx` | 467 | 21010 |
| `src/features/graph/GraphStore.ts` | 461 | 16852 |
| `src/features/editor/ui/panels/VisualEditorBlock.tsx` | 459 | 27768 |
| `src/entities/content/ContentStore.ts` | 439 | 17441 |
| `scripts/core/lean-graph-utils.ts` | 439 | 15008 |
| `src/features/editor/ux/diffReview.ts` | 436 | 15737 |
| `src/entities/content/msc2020.ts` | 431 | 17110 |
| `src/features/editor/ux/safetyPresentation.ts` | 431 | 16086 |
| `tests/features/editor/persistence/editorPersistenceBackend.test.ts` | 400 | 21891 |
| `src/features/editor/ui/components/SemanticLinker.tsx` | 382 | 16343 |
| `src/features/graph/lib/graphWorkerContract.ts` | 379 | 9815 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 373 | 16429 |
| `src/widgets/content/MarginaliaPanel.tsx` | 367 | 14550 |
| `src/shared/diagrams/core/MathBoard.tsx` | 366 | 14384 |
| `tests/features/editor/diagrams/reducer.test.ts` | 360 | 14034 |
| `scripts/ai/review-working-tree.ts` | 360 | 12260 |
| `src/widgets/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 345 | 13603 |
| `src/features/editor/ui/panels/VisualEditorPanel.tsx` | 339 | 19538 |
| `tests/features/editor/ux/diffReview.test.ts` | 334 | 12241 |
| `src/features/metadata/ui/PageDependencyGraph.tsx` | 329 | 9880 |
| `scripts/core/validate-logical-graph.ts` | 328 | 11344 |
| `src/features/editor/core/validation.ts` | 326 | 15019 |
| `tests/features/editor/diagrams/useDiagramState.test.tsx` | 323 | 12934 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 322 | 11659 |
| `tests/database/content-store.test.ts` | 320 | 9682 |
| `scripts/editor/migrate-legacy-diagrams.ts` | 317 | 15294 |
| `scripts/editor/editorPersistenceBackend.ts` | 311 | 15527 |
| `tests/features/editor/diagrams/Phase5AcceptanceMigrations.test.ts` | 309 | 11462 |
| `src/widgets/graph/LocalDependencyGraph.tsx` | 302 | 9130 |
| `src/features/editor/ui/EditorNavigation.tsx` | 301 | 16424 |

**Recomendación.** Revisar cohesión antes de dividir: tamaño alto es una señal, no una prueba de mal diseño.

## Posibles componentes con demasiadas responsabilidades

**Heurística aproximada.** TSX de al menos 250 líneas, o combinación alta de imports/hooks, o 12+ handlers.

| Componente | Líneas | Imports | Hooks | Handlers |
| --- | --- | --- | --- | --- |
| `src/widgets/diagrams/Definiciones/Paralelogramo.tsx` | 1569 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/CongruenciaALA.tsx` | 1448 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/Pitagoras.tsx` | 1181 | 1 | 0 | 0 |
| `src/shared/diagrams/runtime/DiagramRenderer.tsx` | 1073 | 8 | 19 | 35 |
| `src/widgets/diagrams/Models/ModeloPoincare.tsx` | 1058 | 1 | 0 | 0 |
| `src/features/editor/diagrams/ui/DiagramInspector.tsx` | 852 | 6 | 0 | 182 |
| `src/features/editor/ui/diagrams/DiagramWorkbench.tsx` | 826 | 17 | 6 | 120 |
| `src/features/editor/ui/EditorPage.tsx` | 755 | 26 | 29 | 68 |
| `src/widgets/diagrams/Definiciones/Cuadrilatero.tsx` | 490 | 3 | 0 | 8 |
| `src/widgets/navigation/SearchOmnibar.tsx` | 467 | 5 | 15 | 25 |
| `src/features/editor/ui/panels/VisualEditorBlock.tsx` | 459 | 11 | 0 | 63 |
| `src/features/editor/ui/components/SemanticLinker.tsx` | 382 | 4 | 7 | 31 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 373 | 15 | 27 | 22 |
| `src/widgets/content/MarginaliaPanel.tsx` | 367 | 8 | 1 | 4 |
| `src/shared/diagrams/core/MathBoard.tsx` | 366 | 4 | 14 | 25 |
| `src/widgets/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 345 | 2 | 0 | 6 |
| `src/features/editor/ui/panels/VisualEditorPanel.tsx` | 339 | 9 | 5 | 52 |
| `src/features/metadata/ui/PageDependencyGraph.tsx` | 329 | 6 | 8 | 6 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 322 | 7 | 13 | 9 |
| `src/widgets/graph/LocalDependencyGraph.tsx` | 302 | 6 | 2 | 3 |
| `src/features/editor/ui/EditorNavigation.tsx` | 301 | 3 | 6 | 18 |
| `src/widgets/mdx/MDXBlocks.tsx` | 285 | 25 | 3 | 1 |
| `src/pages/GraphPage.tsx` | 283 | 12 | 15 | 17 |
| `src/pages/Home/components/BranchLibrary.tsx` | 270 | 3 | 1 | 0 |
| `src/pages/TheoremPage.tsx` | 263 | 16 | 3 | 0 |
| `src/features/exercises/ui/Emparejar.tsx` | 262 | 3 | 8 | 2 |
| `src/features/progress/ui/StudyPlanMinimap.tsx` | 250 | 3 | 1 | 5 |
| `src/features/editor/ui/panels/MetadataPanel.tsx` | 243 | 7 | 1 | 28 |
| `src/features/graph/ui/components/AxiomaticSidebar.tsx` | 240 | 7 | 1 | 14 |
| `src/features/editor/ui/blocks/DemonstrationBlock.tsx` | 228 | 3 | 0 | 28 |
| `src/features/graph/ui/components/AxiomaticAxiomPicker.tsx` | 221 | 3 | 0 | 16 |
| `src/features/exercises/ui/Clasificador.tsx` | 220 | 3 | 4 | 16 |
| `src/features/editor/diagrams/ui/DiagramStepsEditor.tsx` | 214 | 5 | 0 | 34 |
| `src/features/editor/ui/EditorToolbar.tsx` | 205 | 8 | 2 | 26 |
| `src/features/graph/ui/components/AxiomaticUniversePicker.tsx` | 198 | 2 | 2 | 20 |
| `src/features/exercises/ui/Hueco.tsx` | 195 | 2 | 5 | 16 |
| `src/features/editor/ui/components/MetadataInspector.tsx` | 170 | 2 | 1 | 24 |
| `src/features/editor/ui/diff/DiffReviewPanel.tsx` | 153 | 3 | 0 | 15 |
| `src/features/editor/diagrams/ui/DiagramToolbar.tsx` | 130 | 3 | 0 | 29 |
| `src/shared/ui/StepNavigator.tsx` | 116 | 3 | 5 | 12 |
| `src/features/glossary/ui/ConceptLink.tsx` | 113 | 6 | 3 | 15 |
| `src/features/editor/ui/panels/ExerciseBlockEditor.tsx` | 106 | 4 | 2 | 14 |
| `src/features/editor/diagrams/ui/DiagramTargetSelector.tsx` | 103 | 4 | 0 | 12 |
| `src/features/editor/ui/safety/UnsavedChangesDialog.tsx` | 96 | 3 | 0 | 17 |
| `src/features/editor/ui/panels/RegisteredMdxBlockEditor.tsx` | 93 | 3 | 1 | 27 |
| `src/features/editor/diagrams/ui/DiagramCanvas.tsx` | 77 | 5 | 0 | 16 |
| `src/features/editor/ui/create/CreatePageDialog.tsx` | 60 | 4 | 1 | 15 |
| `src/features/editor/ui/panels/InteractivePreviewToken.tsx` | 50 | 3 | 2 | 13 |

**Recomendación.** Separar coordinación, estado y presentación solo cuando la revisión confirme más de una razón de cambio.

## Deuda de tests por zona

**Hallazgo objetivo.** Se detectaron 107 archivos de test. La tabla cuenta archivos fuente y tests que importan directamente cada zona.

| Zona | TS/TSX fuente | Tests con import directo |
| --- | --- | --- |
| app | 6 | 2 |
| pages | 23 | 1 |
| widgets | 104 | 11 |
| features | 149 | 51 |
| entities | 10 | 10 |
| shared | 58 | 32 |
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
| `src/widgets/content/SymbolDictionaryManager.tsx` | `@/features/glossary/GlossaryStore` | widgets → pages/features |
| `src/widgets/diagrams/Ejercicios/EjercicioPitagorasCateto.tsx` | `@/features/exercises/ui/ExerciseContext` | widgets → pages/features |
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
| mathematicians | 9 |
| methods | 7 |
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
| mathematicians | 9 |
| methods | 7 |
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
| `.opencode/` | 0 |
| `.auxiliary/` | 22 |

**Heurísticas aproximadas.** 14 basenames repetidos entre capas y 8 grupos de contenido byte-a-byte idéntico. Un basename repetido no implica duplicación semántica.

| Nombre repetido | Rutas |
| --- | --- |
| axioma.mdx | `.agents/skills/page-creator/templates/axioma.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/axioma.mdx` |
| caso-de-uso.mdx | `.agents/skills/page-creator/templates/caso-de-uso.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/caso-de-uso.mdx` |
| components.md | `.agents/skills/page-creator/reference/components.md`<br>`.auxiliary/.opencode/skills/antigravity/reference/components.md` |
| definicion.mdx | `.agents/skills/page-creator/templates/definicion.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/definicion.mdx` |
| demostracion.mdx | `.agents/skills/page-creator/templates/demostracion.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/demostracion.mdx` |
| ejemplo.mdx | `.agents/skills/page-creator/templates/ejemplo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejemplo.mdx` |
| ejercicio.mdx | `.agents/skills/page-creator/templates/ejercicio.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejercicio.mdx` |
| matematico.mdx | `.agents/skills/page-creator/templates/matematico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/matematico.mdx` |
| modelo.mdx | `.agents/skills/page-creator/templates/modelo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/modelo.mdx` |
| README.md | `ai/phases/editor-authoring/README.md`<br>`ai/prompts/README.md`<br>`ai/README.md`<br>`docs/ai/README.md` |
| sistema-axiomatico.mdx | `.agents/skills/page-creator/templates/sistema-axiomatico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/sistema-axiomatico.mdx` |
| SKILL.md | `.agents/skills/diagrama/SKILL.md`<br>`.agents/skills/lean-formalizer/SKILL.md`<br>`.agents/skills/page-creator/SKILL.md`<br>`.agents/skills/project-philosophy/SKILL.md`<br>`.auxiliary/.opencode/skills/antigravity/SKILL.md`<br>`.auxiliary/.opencode/skills/diagrama/SKILL.md` |
| teorema.mdx | `.agents/skills/page-creator/templates/teorema.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/teorema.mdx` |
| validate.mjs | `.agents/skills/page-creator/scripts/validate.mjs`<br>`.auxiliary/.opencode/skills/antigravity/scripts/validate.mjs` |

| Grupo idéntico | Rutas |
| --- | --- |
| 1 | `.agents/skills/page-creator/templates/axioma.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/axioma.mdx` |
| 2 | `.agents/skills/page-creator/templates/caso-de-uso.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/caso-de-uso.mdx` |
| 3 | `.agents/skills/page-creator/templates/definicion.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/definicion.mdx` |
| 4 | `.agents/skills/page-creator/templates/ejemplo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejemplo.mdx` |
| 5 | `.agents/skills/page-creator/templates/ejercicio.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejercicio.mdx` |
| 6 | `.agents/skills/page-creator/templates/matematico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/matematico.mdx` |
| 7 | `.agents/skills/page-creator/templates/modelo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/modelo.mdx` |
| 8 | `.agents/skills/page-creator/templates/sistema-axiomatico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/sistema-axiomatico.mdx` |

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
