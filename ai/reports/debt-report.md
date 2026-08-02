# Informe de deuda técnica de Matematika

> Informe determinista generado por `npm run ai:debt`. No ejecuta validadores ni modifica código de producto.

## Cómo leer este informe

- **Hallazgo objetivo:** dato reproducible mediante lectura de archivos o configuración.
- **Heurística aproximada:** señal léxica o estructural que necesita revisión humana; no equivale a un defecto confirmado.
- **Recomendación:** acción propuesta; no se ejecuta automáticamente.

## Resumen ejecutivo

**Hallazgos objetivos.** Se inspeccionaron 1282 archivos de texto, 680 archivos TS/TSX, 181 archivos de test y 120 archivos MDX.

**Heurísticas aproximadas.** Se localizaron 246 apariciones léxicas de `any`, 105 colores hex, 27 marcas TODO/FIXME, 126 archivos TS/TSX grandes y 20 rutas de importación potencialmente incompatibles con FSD.

**Recomendación.** Empezar por las rutas FSD y supresiones TypeScript, continuar con hex fuera de tokens, descomponer puntos de alta responsabilidad y cerrar después cobertura, contenido, Lean y duplicación IA.

## Deuda TypeScript

**Hallazgo objetivo.** Hay 680 archivos TS/TSX en el alcance; 0 archivo(s) contienen 0 supresiones `@ts-*`.

_Ninguno detectado._

**Heurística aproximada.** `any` se cuenta léxicamente, también dentro de comentarios, cadenas, documentación y nombres de reglas.

**Recomendación.** Revisar primero supresiones y usos reales de `any` en código ejecutable; no convertir automáticamente coincidencias textuales.

## Apariciones aproximadas de any por archivo

**Heurística aproximada.** Coincidencias de palabra completa `any` en TS/TSX.

| Archivo | Apariciones |
| --- | --- |
| `content/diagrams/Demos/DemoPitagorasEuclides.tsx` | 25 |
| `content/diagrams/Demos/DemoPitagorasAreas.tsx` | 17 |
| `src/fixed-pages/editor/session/parser.ts` | 14 |
| `src/diagrams/runtime/useBoardLifecycle.ts` | 14 |
| `src/diagrams/core/MathBoard.tsx` | 12 |
| `scripts/ai/generate-debt-report.ts` | 11 |
| `content/diagrams/Demos/DemoTales.tsx` | 11 |
| `scripts/editor/parseDiagramSourceAST.ts` | 9 |
| `tests/shared/diagrams/Phase3Renderer.test.tsx` | 9 |
| `src/content-pages/shared/templates/diagrams/circulo-unitario.template.tsx` | 8 |
| `src/content-pages/shared/templates/diagrams/eje-coordenadas.template.tsx` | 8 |
| `src/content-pages/shared/templates/diagrams/triangulo-deformable.template.tsx` | 8 |
| `content/diagrams/Demos/DemoInvarianciaTriangulacion.tsx` | 8 |
| `content/diagrams/Demos/DemoRectasCoincidentes.tsx` | 8 |
| `content/diagrams/Demos/DemoTriangulacionPoligono.tsx` | 8 |
| `tests/features/graph/GraphStore.test.ts` | 7 |
| `src/diagrams/runtime/boardElementHelpers.ts` | 6 |
| `tests/scripts/generate-test-report.ts` | 6 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 5 |
| `src/fixed-pages/editor/ui/page/EditorPage.tsx` | 5 |
| `src/fixed-pages/editor/document/parseEditorDocument.ts` | 4 |
| `src/diagrams/runtime/DiagramKatexOverlay.tsx` | 4 |
| `content/diagrams/Ejercicios/EjemploPitagorasCalculo.tsx` | 4 |
| `content/diagrams/Ejercicios/EjercicioPitagorasCateto.tsx` | 4 |
| `src/fixed-pages/editor/ui/diff/EditorDiffController.tsx` | 3 |
| `src/diagrams/runtime/useDiagramViewport.ts` | 3 |
| `content/diagrams/Demos/DemoDosRectasUnPunto.tsx` | 3 |
| `scripts/core/validate-cross-references.ts` | 2 |
| `src/content-pages/study-plan/ui/StudyPlanMinimap.tsx` | 2 |
| `src/diagrams/runtime/createBoardElement.ts` | 2 |
| `content/diagrams/Axiomas/Incidence5.tsx` | 2 |
| `content/diagrams/Axiomas/Incidence7.tsx` | 2 |
| `content/diagrams/Definiciones/Plano.tsx` | 2 |
| `scripts/ai/generate-ai-indexes.ts` | 1 |
| `src/fixed-pages/editor/document/blockRegistry.ts` | 1 |
| `src/fixed-pages/editor/save/editorApiBase.ts` | 1 |
| `src/fixed-pages/editor/ui/components/SemanticLinker.tsx` | 1 |
| `src/fixed-pages/graph/lib/knowledgeGraphBuilder.ts` | 1 |
| `content/diagrams/Axiomas/Incidence6.tsx` | 1 |
| `content/diagrams/Axiomas/Incidence8.tsx` | 1 |
| `tests/features/editor/diagrams/repository.test.ts` | 1 |
| `tests/features/editor/useEditorCore.test.ts` | 1 |
| `tests/shared/diagrams/viewport.test.ts` | 1 |

**Recomendación.** Priorizar los archivos con más coincidencias y confirmar cada una con TypeScript/ESLint.

## Colores hex hardcodeados por archivo

**Heurística aproximada.** Coincidencias `#RGB`, `#RRGGBB` o `#RRGGBBAA`; incluye definiciones legítimas de tokens, ejemplos y cadenas.

| Archivo | Apariciones |
| --- | --- |
| `.auxiliary/.opencode/skills/diagrama/SKILL.md` | 47 |
| `src/app/theme.css` | 18 |
| `.auxiliary/.opencode/skills/antigravity/SKILL.md` | 10 |
| `tests/shared/diagrams/RayDirectionStability.test.ts` | 9 |
| `tests/controller/math-utils.test.ts` | 6 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 4 |
| `tests/features/metadata/PageDependencyGraph.test.tsx` | 4 |
| `guides.md` | 3 |
| `.agents/skills/project-philosophy/SKILL.md` | 2 |
| `.auxiliary/TODO.md` | 2 |

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
| `src/lib/theme/constants.ts` | 1 |

**Recomendación.** Convertir deuda vigente en objetivos con responsable/criterio de cierre y retirar comentarios obsoletos.

## Archivos TS/TSX grandes

**Heurística aproximada.** Umbral: al menos 300 líneas o 20.000 bytes.

| Archivo | Líneas | Bytes |
| --- | --- | --- |
| `content/diagrams/Demos/DemoAnguloExterno.tsx` | 3355 | 78060 |
| `content/diagrams/Definiciones/Cuadrilatero.tsx` | 1946 | 51513 |
| `content/diagrams/Demos/DemoAngulosOpuestos.tsx` | 1593 | 35530 |
| `content/diagrams/Definiciones/Triangulo.tsx` | 1419 | 34193 |
| `content/diagrams/Definiciones/Paralelogramo.tsx` | 1402 | 32344 |
| `content/diagrams/Teoremas/CongruenciaALA.tsx` | 1221 | 25825 |
| `src/diagrams/runtime/useBoardLifecycle.ts` | 1179 | 52529 |
| `tests/shared/diagrams/Phase3Renderer.test.tsx` | 1095 | 56052 |
| `content/diagrams/Teoremas/CongruenciaLLL.tsx` | 1082 | 23675 |
| `content/diagrams/Demos/DemoCongruenciaALA.tsx` | 1064 | 23093 |
| `src/diagrams/core/MathFactory.ts` | 1037 | 35524 |
| `tests/e2e/editor/editor-safe-ux.e2e.ts` | 1010 | 51946 |
| `content/diagrams/Demos/DemoSumaAngulos.tsx` | 1007 | 21771 |
| `content/diagrams/Axiomas/SAS.tsx` | 990 | 21396 |
| `content/diagrams/Demos/DemoCongruenciaLLL.tsx` | 950 | 20789 |
| `src/diagrams/spec/v3Compatibility.ts` | 933 | 53624 |
| `src/fixed-pages/editor/diagrams/ui/DiagramWorkbench.tsx` | 904 | 31620 |
| `content/diagrams/Models/ModeloPoincare.tsx` | 883 | 21535 |
| `content/diagrams/Axiomas/AxiomaArquimedes.tsx` | 877 | 19705 |
| `scripts/ai/generate-debt-report.ts` | 848 | 35233 |
| `content/diagrams/Teoremas/Pitagoras.tsx` | 844 | 17636 |
| `src/diagrams/spec/schema.ts` | 828 | 44508 |
| `content/diagrams/Axiomas/Congruence3.tsx` | 769 | 16350 |
| `scripts/ai/generate-ai-indexes.ts` | 767 | 29174 |
| `content/diagrams/Teoremas/Tales.tsx` | 753 | 16527 |
| `src/fixed-pages/editor/diagrams/ui/scene/GroupsAndLayersManager.tsx` | 748 | 34878 |
| `src/fixed-pages/editor/ui/page/EditorPage.tsx` | 739 | 27845 |
| `content/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx` | 668 | 14838 |
| `src/fixed-pages/editor/session/parser.ts` | 664 | 22760 |
| `content/diagrams/Demos/DemoAreaAditividad.tsx` | 642 | 13983 |
| `content/diagrams/Definiciones/Circunferencia.tsx` | 614 | 13892 |
| `content/diagrams/Teoremas/DesigualdadTriangular.tsx` | 614 | 12608 |
| `content/diagrams/Teoremas/PuntoMedioPerpendicular.tsx` | 606 | 13326 |
| `content/diagrams/CasosUso/GpsTrilateracion.tsx` | 606 | 13234 |
| `content/diagrams/Definiciones/Mediana.tsx` | 584 | 12249 |
| `content/diagrams/Models/ModeloFano.tsx` | 582 | 12835 |
| `content/diagrams/Teoremas/SumaAngulos.tsx` | 579 | 12712 |
| `src/fixed-pages/graph/graph.worker.ts` | 578 | 17905 |
| `content/diagrams/Axiomas/Congruence2.tsx` | 561 | 11598 |
| `scripts/editor/parseDiagramSourceAST.ts` | 554 | 21679 |
| `src/diagrams/spec/scenePointMotion.ts` | 552 | 26840 |
| `src/fixed-pages/editor/session/useEditorCore.ts` | 550 | 28366 |
| `src/fixed-pages/editor/document/structuralOperations.ts` | 546 | 22387 |
| `content/diagrams/Definiciones/Perpendicular.tsx` | 546 | 12074 |
| `src/diagrams/spec/curveGeometry.ts` | 540 | 21088 |
| `content/diagrams/Definiciones/Mediatriz.tsx` | 526 | 11505 |
| `content/diagrams/Teoremas/AngulosOpuestos.tsx` | 524 | 11118 |
| `content/diagrams/Axiomas/Pasch.tsx` | 510 | 11293 |
| `content/diagrams/Axiomas/HyperbolicParallel.tsx` | 502 | 11393 |
| `src/diagrams/core/MathBoard.tsx` | 489 | 20761 |
| `src/content/glossary/dictionary.ts` | 483 | 18549 |
| `tests/features/editor/useEditorCore.test.ts` | 481 | 21929 |
| `src/diagrams/spec/areaRegions.ts` | 481 | 17855 |
| `content/diagrams/Axiomas/AxiomaDedekind.tsx` | 481 | 10513 |
| `content/diagrams/Demos/DemoExistenciaBisectriz.tsx` | 481 | 10429 |
| `content/diagrams/Definiciones/Bisectriz.tsx` | 481 | 10358 |
| `content/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx` | 479 | 10558 |
| `src/components/navigation/SearchOmnibar.tsx` | 467 | 20961 |
| `content/diagrams/Teoremas/TrianguloIsosceles.tsx` | 464 | 10129 |
| `src/fixed-pages/graph/GraphStore.ts` | 462 | 16909 |
| `src/fixed-pages/editor/ui/panels/VisualEditorBlock.tsx` | 459 | 27487 |
| `content/diagrams/Axiomas/Congruence4.tsx` | 441 | 9524 |
| `src/data/content/ContentStore.ts` | 439 | 17441 |
| `scripts/core/lean-graph-utils.ts` | 439 | 15008 |
| `src/fixed-pages/editor/review/diffReview.ts` | 436 | 15737 |
| `content/diagrams/Axiomas/Congruence1.tsx` | 432 | 8878 |
| `src/data/content/msc2020.ts` | 431 | 17110 |
| `src/fixed-pages/editor/review/safetyPresentation.ts` | 431 | 16086 |
| `src/diagrams/spec/schemaV3.ts` | 427 | 30572 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchToolbar.tsx` | 426 | 22003 |
| `tests/features/editor/diagrams/reducer.test.ts` | 426 | 16508 |
| `tests/features/editor/validation.test.ts` | 407 | 13294 |
| `src/fixed-pages/editor/diagrams/ui/ConstraintEditor.tsx` | 405 | 17493 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchSceneTree.tsx` | 405 | 15624 |
| `src/diagrams/spec/types.ts` | 405 | 12780 |
| `content/diagrams/Definiciones/Angulo.tsx` | 405 | 8909 |
| `tests/features/editor/persistence/editorPersistenceBackend.test.ts` | 400 | 21891 |
| `src/fixed-pages/editor/diagrams/ui/DiagramInfoPanelContentEditor.tsx` | 397 | 24059 |
| `src/fixed-pages/editor/ui/components/SemanticLinker.tsx` | 395 | 16838 |
| `tests/features/editor/diagrams/useDiagramState.test.tsx` | 392 | 15525 |
| `src/diagrams/spec/areaGeometry.ts` | 392 | 14206 |
| `src/fixed-pages/editor/diagrams/model/elements/diagramElements.ts` | 386 | 17533 |
| `content/diagrams/Teoremas/DosRectasUnPunto.tsx` | 385 | 8136 |
| `src/components/content/MarginaliaPanel.tsx` | 384 | 15075 |
| `src/fixed-pages/graph/lib/graphWorkerContract.ts` | 379 | 9815 |
| `src/fixed-pages/editor/diagrams/ui/DiagramConstraintEditor.tsx` | 378 | 15961 |
| `src/fixed-pages/graph/ui/AxiomaticTree.tsx` | 373 | 16429 |
| `src/fixed-pages/editor/diagrams/ui/workbench/useWorkbenchActions.ts` | 373 | 12074 |
| `scripts/ai/review-working-tree.ts` | 360 | 12260 |
| `src/diagrams/runtime/stepEmphasisAnimation.ts` | 359 | 11928 |
| `tests/features/editor/diagrams/Phase5AcceptanceMigrations.test.ts` | 358 | 14165 |
| `content/diagrams/Axiomas/Incidence4.tsx` | 357 | 7467 |
| `content/diagrams/Teoremas/LemaPuntoMedio.tsx` | 357 | 7413 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchStepsEditor.tsx` | 353 | 16129 |
| `src/diagrams/runtime/DiagramRenderer.tsx` | 352 | 15523 |
| `src/components/layouts/CodexLayout.tsx` | 351 | 12854 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchIcons.tsx` | 348 | 16780 |
| `content/diagrams/Demos/DemoPitagorasEuclides.tsx` | 345 | 13603 |
| `src/fixed-pages/editor/diagrams/model/constraints/constraintOptions.ts` | 344 | 16344 |
| `src/fixed-pages/editor/diagrams/ui/workbench/useDiagramState.ts` | 342 | 12610 |
| `src/fixed-pages/editor/diagrams/model/elements/segmentMarks.ts` | 342 | 11960 |
| `content/diagrams/Models/ModeloTresPuntos.tsx` | 342 | 7443 |
| `src/fixed-pages/editor/ui/panels/VisualEditorPanel.tsx` | 339 | 19451 |
| `scripts/editor/editorApiRoutes.ts` | 336 | 11524 |
| `tests/shared/diagrams/Phase3GeometryLanguage.test.ts` | 335 | 14868 |
| `tests/shared/diagrams/RayDirectionStability.full.test.tsx` | 334 | 16656 |
| `tests/features/editor/ux/diffReview.test.ts` | 334 | 12241 |
| `src/diagrams/spec/sceneCoordinates.ts` | 333 | 14255 |
| `content/diagrams/Definiciones/Altura.tsx` | 333 | 7145 |
| `src/components/metadata/PageDependencyGraph.tsx` | 329 | 9876 |
| `scripts/core/validate-logical-graph.ts` | 328 | 11344 |
| `src/diagrams/spec/expressions.ts` | 323 | 13895 |
| `src/fixed-pages/editor/diagrams/model/elements/diagramClipboard.ts` | 322 | 14198 |
| `src/content-pages/study-plan/ui/TaxonomyGraph.tsx` | 322 | 11633 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchHeader.tsx` | 321 | 13037 |
| `src/fixed-pages/editor/session/validation.ts` | 320 | 15106 |
| `tests/database/content-store.test.ts` | 320 | 9682 |
| `src/diagrams/runtime/createBoardElement.ts` | 315 | 14618 |
| `src/fixed-pages/editor/diagrams/ui/DiagramStepObjectAppearanceEditor.tsx` | 315 | 13504 |
| `tests/features/editor/document/phase7AuthoringUx.test.ts` | 315 | 12692 |
| `tests/features/editor/diagrams/Phase3Serialization.test.ts` | 311 | 15646 |
| `scripts/editor/editorPersistenceBackend.ts` | 311 | 15527 |
| `content/diagrams/Models/ModeloCartesiano.tsx` | 307 | 6585 |
| `src/fixed-pages/editor/diagrams/ui/inspector/point/PointInspector.tsx` | 304 | 13642 |
| `src/fixed-pages/editor/ui/EditorNavigation.tsx` | 301 | 16247 |
| `tests/features/editor/diagrams/model.test.ts` | 301 | 14180 |

**Recomendación.** Revisar cohesión antes de dividir: tamaño alto es una señal, no una prueba de mal diseño.

## Posibles componentes con demasiadas responsabilidades

**Heurística aproximada.** TSX de al menos 250 líneas, o combinación alta de imports/hooks, o 12+ handlers.

| Componente | Líneas | Imports | Hooks | Handlers |
| --- | --- | --- | --- | --- |
| `content/diagrams/Demos/DemoAnguloExterno.tsx` | 3355 | 1 | 0 | 0 |
| `content/diagrams/Definiciones/Cuadrilatero.tsx` | 1946 | 1 | 0 | 0 |
| `content/diagrams/Demos/DemoAngulosOpuestos.tsx` | 1593 | 1 | 0 | 0 |
| `content/diagrams/Definiciones/Triangulo.tsx` | 1419 | 1 | 0 | 0 |
| `content/diagrams/Definiciones/Paralelogramo.tsx` | 1402 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/CongruenciaALA.tsx` | 1221 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/CongruenciaLLL.tsx` | 1082 | 1 | 0 | 0 |
| `content/diagrams/Demos/DemoCongruenciaALA.tsx` | 1064 | 1 | 0 | 0 |
| `content/diagrams/Demos/DemoSumaAngulos.tsx` | 1007 | 1 | 0 | 0 |
| `content/diagrams/Axiomas/SAS.tsx` | 990 | 1 | 0 | 0 |
| `content/diagrams/Demos/DemoCongruenciaLLL.tsx` | 950 | 1 | 0 | 0 |
| `src/fixed-pages/editor/diagrams/ui/DiagramWorkbench.tsx` | 904 | 28 | 42 | 199 |
| `content/diagrams/Models/ModeloPoincare.tsx` | 883 | 1 | 0 | 0 |
| `content/diagrams/Axiomas/AxiomaArquimedes.tsx` | 877 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/Pitagoras.tsx` | 844 | 1 | 0 | 0 |
| `content/diagrams/Axiomas/Congruence3.tsx` | 769 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/Tales.tsx` | 753 | 1 | 0 | 0 |
| `src/fixed-pages/editor/diagrams/ui/scene/GroupsAndLayersManager.tsx` | 748 | 5 | 2 | 80 |
| `src/fixed-pages/editor/ui/page/EditorPage.tsx` | 739 | 29 | 20 | 60 |
| `content/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx` | 668 | 1 | 0 | 0 |
| `content/diagrams/Demos/DemoAreaAditividad.tsx` | 642 | 1 | 0 | 0 |
| `content/diagrams/Definiciones/Circunferencia.tsx` | 614 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/DesigualdadTriangular.tsx` | 614 | 1 | 0 | 0 |
| `content/diagrams/CasosUso/GpsTrilateracion.tsx` | 606 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/PuntoMedioPerpendicular.tsx` | 606 | 1 | 0 | 0 |
| `content/diagrams/Definiciones/Mediana.tsx` | 584 | 1 | 0 | 0 |
| `content/diagrams/Models/ModeloFano.tsx` | 582 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/SumaAngulos.tsx` | 579 | 1 | 0 | 0 |
| `content/diagrams/Axiomas/Congruence2.tsx` | 561 | 1 | 0 | 0 |
| `content/diagrams/Definiciones/Perpendicular.tsx` | 546 | 1 | 0 | 0 |
| `content/diagrams/Definiciones/Mediatriz.tsx` | 526 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/AngulosOpuestos.tsx` | 524 | 1 | 0 | 0 |
| `content/diagrams/Axiomas/Pasch.tsx` | 510 | 1 | 0 | 0 |
| `content/diagrams/Axiomas/HyperbolicParallel.tsx` | 502 | 1 | 0 | 0 |
| `src/diagrams/core/MathBoard.tsx` | 489 | 6 | 17 | 26 |
| `content/diagrams/Axiomas/AxiomaDedekind.tsx` | 481 | 1 | 0 | 0 |
| `content/diagrams/Definiciones/Bisectriz.tsx` | 481 | 1 | 0 | 0 |
| `content/diagrams/Demos/DemoExistenciaBisectriz.tsx` | 481 | 1 | 0 | 0 |
| `content/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx` | 479 | 1 | 0 | 0 |
| `src/components/navigation/SearchOmnibar.tsx` | 467 | 6 | 15 | 25 |
| `content/diagrams/Teoremas/TrianguloIsosceles.tsx` | 464 | 1 | 0 | 0 |
| `src/fixed-pages/editor/ui/panels/VisualEditorBlock.tsx` | 459 | 11 | 0 | 63 |
| `content/diagrams/Axiomas/Congruence4.tsx` | 441 | 1 | 0 | 0 |
| `content/diagrams/Axiomas/Congruence1.tsx` | 432 | 1 | 0 | 0 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchToolbar.tsx` | 426 | 5 | 4 | 37 |
| `src/fixed-pages/editor/diagrams/ui/ConstraintEditor.tsx` | 405 | 6 | 1 | 33 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchSceneTree.tsx` | 405 | 6 | 0 | 75 |
| `content/diagrams/Definiciones/Angulo.tsx` | 405 | 1 | 0 | 0 |
| `src/fixed-pages/editor/diagrams/ui/DiagramInfoPanelContentEditor.tsx` | 397 | 9 | 2 | 89 |
| `src/fixed-pages/editor/ui/components/SemanticLinker.tsx` | 395 | 4 | 7 | 31 |
| `content/diagrams/Teoremas/DosRectasUnPunto.tsx` | 385 | 1 | 0 | 0 |
| `src/components/content/MarginaliaPanel.tsx` | 384 | 8 | 1 | 4 |
| `src/fixed-pages/editor/diagrams/ui/DiagramConstraintEditor.tsx` | 378 | 14 | 0 | 20 |
| `src/fixed-pages/graph/ui/AxiomaticTree.tsx` | 373 | 15 | 27 | 22 |
| `content/diagrams/Axiomas/Incidence4.tsx` | 357 | 1 | 0 | 0 |
| `content/diagrams/Teoremas/LemaPuntoMedio.tsx` | 357 | 1 | 0 | 0 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchStepsEditor.tsx` | 353 | 7 | 1 | 59 |
| `src/diagrams/runtime/DiagramRenderer.tsx` | 352 | 12 | 15 | 34 |
| `src/components/layouts/CodexLayout.tsx` | 351 | 10 | 11 | 6 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchIcons.tsx` | 348 | 2 | 0 | 0 |
| `content/diagrams/Demos/DemoPitagorasEuclides.tsx` | 345 | 2 | 0 | 6 |
| `content/diagrams/Models/ModeloTresPuntos.tsx` | 342 | 1 | 0 | 0 |
| `src/fixed-pages/editor/ui/panels/VisualEditorPanel.tsx` | 339 | 9 | 5 | 52 |
| `content/diagrams/Definiciones/Altura.tsx` | 333 | 1 | 0 | 0 |
| `src/components/metadata/PageDependencyGraph.tsx` | 329 | 6 | 8 | 6 |
| `src/content-pages/study-plan/ui/TaxonomyGraph.tsx` | 322 | 7 | 13 | 9 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchHeader.tsx` | 321 | 6 | 2 | 63 |
| `src/fixed-pages/editor/diagrams/ui/DiagramStepObjectAppearanceEditor.tsx` | 315 | 7 | 0 | 31 |
| `content/diagrams/Models/ModeloCartesiano.tsx` | 307 | 1 | 0 | 0 |
| `src/fixed-pages/editor/diagrams/ui/inspector/point/PointInspector.tsx` | 304 | 15 | 0 | 60 |
| `src/fixed-pages/editor/ui/EditorNavigation.tsx` | 301 | 3 | 6 | 18 |
| `src/components/mdx/MDXBlocks.tsx` | 287 | 28 | 3 | 1 |
| `content/diagrams/Definiciones/Paralelas.tsx` | 286 | 1 | 0 | 0 |
| `src/fixed-pages/editor/diagrams/ui/inspector/element/sections/ElementConstraintsSection.tsx` | 285 | 7 | 2 | 28 |
| `src/content-pages/screens/GraphPage.tsx` | 283 | 12 | 15 | 17 |
| `content/diagrams/Axiomas/Order1.tsx` | 282 | 1 | 0 | 0 |
| `content/diagrams/Axiomas/Order2.tsx` | 282 | 1 | 0 | 0 |
| `src/fixed-pages/editor/ui/blocks/DemonstrationBlock.tsx` | 274 | 3 | 0 | 32 |
| `src/content-pages/screens/Home/components/BranchLibrary.tsx` | 265 | 3 | 1 | 0 |
| `src/content-pages/screens/TheoremPage.tsx` | 263 | 16 | 3 | 0 |
| `src/content-pages/exercise/ui/Emparejar.tsx` | 262 | 3 | 8 | 2 |
| `src/content-pages/study-plan/ui/StudyPlanMinimap.tsx` | 256 | 4 | 1 | 5 |
| `content/diagrams/Axiomas/Order3.tsx` | 256 | 1 | 0 | 0 |
| `src/fixed-pages/editor/diagrams/ui/inspector/element/sections/ElementStyleSection.tsx` | 251 | 7 | 0 | 27 |
| `src/fixed-pages/editor/ui/panels/MetadataPanel.tsx` | 243 | 7 | 1 | 28 |
| `src/fixed-pages/graph/ui/components/AxiomaticSidebar.tsx` | 240 | 7 | 1 | 14 |
| `src/fixed-pages/editor/diagrams/ui/canvas/CanvasChrome.tsx` | 237 | 4 | 0 | 42 |
| `src/content-pages/exercise/ui/Clasificador.tsx` | 221 | 4 | 4 | 16 |
| `src/fixed-pages/graph/ui/components/AxiomaticAxiomPicker.tsx` | 221 | 3 | 0 | 16 |
| `src/fixed-pages/editor/diagrams/ui/inspector/element/sections/ElementMarksSection.tsx` | 214 | 5 | 0 | 22 |
| `src/fixed-pages/editor/diagrams/ui/modals/MdxLinkModal.tsx` | 206 | 3 | 0 | 34 |
| `src/fixed-pages/editor/ui/EditorToolbar.tsx` | 205 | 8 | 2 | 26 |
| `src/fixed-pages/graph/ui/components/AxiomaticUniversePicker.tsx` | 198 | 2 | 2 | 20 |
| `src/content-pages/exercise/ui/Hueco.tsx` | 196 | 3 | 5 | 16 |
| `src/fixed-pages/editor/diagrams/ui/modals/DiagramSettingsModal.tsx` | 177 | 4 | 0 | 26 |
| `src/fixed-pages/editor/ui/components/MetadataInspector.tsx` | 170 | 2 | 1 | 24 |
| `src/fixed-pages/editor/diagrams/ui/DiagramHeaderReadingsEditor.tsx` | 164 | 3 | 0 | 19 |
| `src/fixed-pages/editor/diagrams/ui/modals/CodeModal.tsx` | 156 | 3 | 3 | 18 |
| `src/fixed-pages/editor/diagrams/ui/canvas/CanvasStage.tsx` | 153 | 10 | 1 | 52 |
| `src/fixed-pages/editor/ui/diff/DiffReviewPanel.tsx` | 153 | 3 | 0 | 15 |
| `src/fixed-pages/editor/diagrams/ui/inspector/element/sections/ElementCurveSection.tsx` | 152 | 2 | 0 | 15 |
| `src/fixed-pages/editor/diagrams/ui/DiagramTemplateField.tsx` | 144 | 4 | 4 | 14 |
| `src/fixed-pages/editor/diagrams/ui/canvas/BoardHost.tsx` | 141 | 5 | 2 | 23 |
| `src/fixed-pages/editor/diagrams/ui/modals/GuidedConstructionsModal.tsx` | 138 | 5 | 1 | 17 |
| `src/fixed-pages/editor/diagrams/ui/DiagramPointMovementAidsEditor.tsx` | 131 | 5 | 1 | 18 |
| `src/fixed-pages/editor/diagrams/ui/inspector/slider/SliderInspector.tsx` | 122 | 7 | 0 | 31 |
| `src/fixed-pages/glossary/ui/ConceptLink.tsx` | 113 | 6 | 3 | 15 |
| `src/fixed-pages/editor/ui/panels/ExerciseBlockEditor.tsx` | 106 | 4 | 2 | 14 |
| `src/fixed-pages/editor/ui/safety/UnsavedChangesDialog.tsx` | 96 | 3 | 0 | 17 |
| `src/fixed-pages/editor/diagrams/ui/DiagramRewriteDialog.tsx` | 93 | 4 | 2 | 13 |
| `src/fixed-pages/editor/ui/panels/RegisteredMdxBlockEditor.tsx` | 93 | 3 | 1 | 27 |
| `src/fixed-pages/editor/diagrams/ui/scene/ObjectListBatchToolbar.tsx` | 91 | 3 | 0 | 18 |
| `src/fixed-pages/editor/diagrams/ui/inspector/element/ElementInspectorPanel.tsx` | 79 | 14 | 0 | 23 |
| `src/fixed-pages/editor/diagrams/ui/inspector/element/sections/ElementIdentitySection.tsx` | 78 | 4 | 0 | 16 |
| `src/fixed-pages/editor/diagrams/ui/DiagramNativeLabelEditor.tsx` | 67 | 1 | 0 | 16 |
| `src/fixed-pages/editor/ui/create/CreatePageDialog.tsx` | 60 | 4 | 1 | 15 |
| `src/fixed-pages/editor/diagrams/ui/WorkbenchElementInspector.tsx` | 56 | 7 | 1 | 13 |
| `src/fixed-pages/editor/ui/panels/InteractivePreviewToken.tsx` | 50 | 3 | 2 | 13 |

**Recomendación.** Separar coordinación, estado y presentación solo cuando la revisión confirme más de una razón de cambio.

## Deuda de tests por zona

**Hallazgo objetivo.** Se detectaron 181 archivos de test. La tabla cuenta archivos fuente y tests que importan directamente cada zona.

| Zona | TS/TSX fuente | Tests con import directo |
| --- | --- | --- |
| app | 6 | 2 |
| pages | 24 | 1 |
| widgets | 106 | 24 |
| features | 251 | 95 |
| entities | 12 | 11 |
| shared | 88 | 82 |
| database | 0 | 0 |

**Heurística aproximada.** Cero imports directos no significa cero cobertura: una prueba puede cubrir una zona de forma transitiva. La tabla no usa instrumentación.

**Recomendación.** Ejecutar `npm run test:coverage` y usar cobertura por rama como evidencia antes de crear tests.

## Deuda de arquitectura/FSD

**Hallazgo objetivo.** `.dependency-cruiser.js` declara 13 reglas con severidad error y 1 con severidad warning.

**Heurística aproximada.** Las rutas siguientes se deducen de imports estáticos y las invariantes globales; no aplican todas las excepciones de Dependency Cruiser.

| Origen | Import | Señal |
| --- | --- | --- |
| `src/content-pages/screens/Home/HomePage.tsx` | `@/content-pages/screens/Home/components/BranchLibrary` | pages → pages |
| `src/content-pages/screens/Home/HomePage.tsx` | `@/content-pages/screens/Home/components/HeroSection` | pages → pages |
| `src/content-pages/screens/Home/HomePage.tsx` | `@/content-pages/screens/Home/components/HomeFooter` | pages → pages |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Apoyo` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/CanvasInteractivo` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Clasificador` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/DeslizadorEnLine` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Emparejar` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/ErrorComun` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Hueco` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/MatrizInteractiva` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Ordenacion` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Paso` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/PasoEjercicio` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Pregunta` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Resolucion` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/content-pages/exercise/ui/Solucion` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/fixed-pages/glossary/ui/Concept` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/fixed-pages/glossary/ui/ConceptLink` | widgets → pages/features |
| `src/components/mdx/MDXBlocks.tsx` | `@/fixed-pages/glossary/ui/RefLink` | widgets → pages/features |

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

**Heurísticas aproximadas.** 0 archivos carecen de una o más claves base; 120 no declaran `requires` (opcional en Zod, exigido por la política topológica); 1 IDs no coinciden con el nombre de archivo; 0 anchors HTML con `href`; 128 `ProofStep` sin atributo `justificacion`; 1 axiomas/definiciones/teoremas sin señal léxica de interactividad.

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
| `src/database/content/demonstrations/demo-angulo-externo.mdx` | 11 |
| `src/database/content/demonstrations/demo-existencia-perpendicular.mdx` | 8 |
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
| `package-lock.json` | lockfile voluminoso | no/no inferido |
| `src/data/content/contentIndex.json` | índice generado | no/no inferido |
| `src/data/content/contentCoverage.json` | cobertura de contenido generada | no/no inferido |
| `src/data/graph/graph_structure.json` | grafo generado | no/no inferido |
| `src/data/graph/lean_graph.json` | grafo Lean generado | no/no inferido |
| `src/data/graph/proof_blocks.json` | bloques de prueba generados | no/no inferido |

**Recomendación.** Cargar estos artefactos solo cuando sean la fuente concreta de una comprobación; no usar generados como autoridad editable.

## Duplicación potencial entre capas IA

**Hallazgo objetivo.** Archivos de texto por capa:

| Capa | Archivos |
| --- | --- |
| `ai/` | 4 |
| `docs/ai/` | 2 |
| `.agents/` | 21 |
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
| README.md | `ai/README.md`<br>`docs/ai/README.md` |
| sistema-axiomatico.mdx | `.agents/skills/page-creator/templates/sistema-axiomatico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/sistema-axiomatico.mdx` |
| SKILL.md | `.agents/skills/code-graph/SKILL.md`<br>`.agents/skills/diagrama/SKILL.md`<br>`.agents/skills/lean-formalizer/SKILL.md`<br>`.agents/skills/page-creator/SKILL.md`<br>`.agents/skills/project-philosophy/SKILL.md`<br>`.auxiliary/.opencode/skills/antigravity/SKILL.md`<br>`.auxiliary/.opencode/skills/diagrama/SKILL.md` |
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
