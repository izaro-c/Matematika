# Informe de deuda técnica de Matematika

> Informe determinista generado por `npm run ai:debt`. No ejecuta validadores ni modifica código de producto.

## Cómo leer este informe

- **Hallazgo objetivo:** dato reproducible mediante lectura de archivos o configuración.
- **Heurística aproximada:** señal léxica o estructural que necesita revisión humana; no equivale a un defecto confirmado.
- **Recomendación:** acción propuesta; no se ejecuta automáticamente.

## Resumen ejecutivo

**Hallazgos objetivos.** Se inspeccionaron 1107 archivos de texto, 560 archivos TS/TSX, 130 archivos de test y 120 archivos MDX.

**Heurísticas aproximadas.** Se localizaron 263 apariciones léxicas de `any`, 96 colores hex, 27 marcas TODO/FIXME, 111 archivos TS/TSX grandes y 20 rutas de importación potencialmente incompatibles con FSD.

**Recomendación.** Empezar por las rutas FSD y supresiones TypeScript, continuar con hex fuera de tokens, descomponer puntos de alta responsabilidad y cerrar después cobertura, contenido, Lean y duplicación IA.

## Deuda TypeScript

**Hallazgo objetivo.** Hay 560 archivos TS/TSX en el alcance; 0 archivo(s) contienen 0 supresiones `@ts-*`.

_Ninguno detectado._

**Heurística aproximada.** `any` se cuenta léxicamente, también dentro de comentarios, cadenas, documentación y nombres de reglas.

**Recomendación.** Revisar primero supresiones y usos reales de `any` en código ejecutable; no convertir automáticamente coincidencias textuales.

## Apariciones aproximadas de any por archivo

**Heurística aproximada.** Coincidencias de palabra completa `any` en TS/TSX.

| Archivo | Apariciones |
| --- | --- |
| `scripts/editor/migrate-legacy-diagrams.ts` | 26 |
| `src/widgets/diagrams/Demos/DemoPitagorasEuclides.tsx` | 25 |
| `src/widgets/diagrams/Demos/DemoPitagorasAreas.tsx` | 17 |
| `src/features/editor/core/parser.ts` | 14 |
| `scripts/ai/generate-debt-report.ts` | 11 |
| `src/shared/diagrams/core/MathBoard.tsx` | 11 |
| `src/shared/diagrams/runtime/useBoardLifecycle.ts` | 11 |
| `src/widgets/diagrams/Demos/DemoTales.tsx` | 11 |
| `scripts/editor/parseDiagramSourceAST.ts` | 9 |
| `src/shared/templates/diagrams/circulo-unitario.template.tsx` | 8 |
| `src/shared/templates/diagrams/eje-coordenadas.template.tsx` | 8 |
| `src/shared/templates/diagrams/triangulo-deformable.template.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoInvarianciaTriangulacion.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoRectasCoincidentes.tsx` | 8 |
| `src/widgets/diagrams/Demos/DemoTriangulacionPoligono.tsx` | 8 |
| `tests/shared/diagrams/Phase3Renderer.test.tsx` | 8 |
| `tests/features/graph/GraphStore.test.ts` | 7 |
| `tests/scripts/generate-test-report.ts` | 6 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 5 |
| `src/features/editor/ui/EditorPage.tsx` | 5 |
| `src/features/editor/document/parseEditorDocument.ts` | 4 |
| `src/shared/diagrams/runtime/DiagramKatexOverlay.tsx` | 4 |
| `src/widgets/diagrams/Ejercicios/EjemploPitagorasCalculo.tsx` | 4 |
| `src/widgets/diagrams/Ejercicios/EjercicioPitagorasCateto.tsx` | 4 |
| `src/features/editor/ui/diff/EditorDiffController.tsx` | 3 |
| `src/shared/diagrams/runtime/useDiagramViewport.ts` | 3 |
| `src/widgets/diagrams/Demos/DemoDosRectasUnPunto.tsx` | 3 |
| `scripts/core/validate-cross-references.ts` | 2 |
| `src/features/progress/ui/StudyPlanMinimap.tsx` | 2 |
| `src/shared/ui/JXGBoard.tsx` | 2 |
| `src/widgets/diagrams/Axiomas/Incidence5.tsx` | 2 |
| `src/widgets/diagrams/Axiomas/Incidence7.tsx` | 2 |
| `src/widgets/diagrams/Definiciones/Plano.tsx` | 2 |
| `tests/features/editor/diagrams/Phase3Inspector.test.tsx` | 2 |
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
| `tests/controller/math-utils.test.ts` | 6 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 4 |
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
| `src/widgets/diagrams/Definiciones/Cuadrilatero.tsx` | 1946 | 51513 |
| `src/widgets/diagrams/Demos/DemoAngulosOpuestos.tsx` | 1593 | 35530 |
| `src/widgets/diagrams/Definiciones/Triangulo.tsx` | 1419 | 34193 |
| `src/widgets/diagrams/Definiciones/Paralelogramo.tsx` | 1402 | 32344 |
| `src/widgets/diagrams/Demos/DemoAnguloExterno.tsx` | 1373 | 31002 |
| `src/widgets/diagrams/Teoremas/CongruenciaALA.tsx` | 1221 | 25825 |
| `src/widgets/diagrams/Teoremas/CongruenciaLLL.tsx` | 1082 | 23675 |
| `src/widgets/diagrams/Demos/DemoCongruenciaALA.tsx` | 1064 | 23093 |
| `src/features/editor/diagrams/ui/DiagramInspector.tsx` | 1044 | 60635 |
| `tests/e2e/editor/editor-safe-ux.e2e.ts` | 1010 | 51955 |
| `src/widgets/diagrams/Demos/DemoSumaAngulos.tsx` | 1007 | 21771 |
| `tests/shared/diagrams/Phase3Renderer.test.tsx` | 1001 | 51950 |
| `src/widgets/diagrams/Axiomas/SAS.tsx` | 990 | 21396 |
| `src/shared/diagrams/runtime/useBoardLifecycle.ts` | 973 | 45876 |
| `src/widgets/diagrams/Demos/DemoCongruenciaLLL.tsx` | 950 | 20789 |
| `src/shared/diagrams/spec/scene.ts` | 929 | 43488 |
| `src/widgets/diagrams/Models/ModeloPoincare.tsx` | 883 | 21535 |
| `src/widgets/diagrams/Axiomas/AxiomaArquimedes.tsx` | 877 | 19705 |
| `src/features/editor/ui/diagrams/DiagramWorkbench.tsx` | 865 | 41920 |
| `src/shared/diagrams/spec/v3Compatibility.ts` | 857 | 50319 |
| `scripts/ai/generate-debt-report.ts` | 848 | 35233 |
| `src/widgets/diagrams/Teoremas/Pitagoras.tsx` | 844 | 17636 |
| `src/shared/diagrams/core/MathFactory.ts` | 815 | 27803 |
| `tests/features/editor/diagrams/Phase3Inspector.test.tsx` | 800 | 44149 |
| `scripts/ai/generate-ai-indexes.ts` | 770 | 29276 |
| `src/widgets/diagrams/Axiomas/Congruence3.tsx` | 769 | 16350 |
| `src/shared/diagrams/spec/schema.ts` | 768 | 42177 |
| `src/widgets/diagrams/Teoremas/Tales.tsx` | 753 | 16527 |
| `src/features/editor/ui/EditorPage.tsx` | 735 | 27816 |
| `src/widgets/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx` | 668 | 14838 |
| `src/features/editor/core/parser.ts` | 664 | 22760 |
| `src/widgets/diagrams/Demos/DemoAreaAditividad.tsx` | 642 | 13983 |
| `src/widgets/diagrams/Definiciones/Circunferencia.tsx` | 614 | 13892 |
| `src/widgets/diagrams/Teoremas/DesigualdadTriangular.tsx` | 614 | 12608 |
| `src/widgets/diagrams/Teoremas/PuntoMedioPerpendicular.tsx` | 606 | 13326 |
| `src/widgets/diagrams/CasosUso/GpsTrilateracion.tsx` | 606 | 13234 |
| `src/widgets/diagrams/Definiciones/Mediana.tsx` | 584 | 12249 |
| `src/widgets/diagrams/Models/ModeloFano.tsx` | 582 | 12835 |
| `src/widgets/diagrams/Teoremas/SumaAngulos.tsx` | 579 | 12712 |
| `src/features/graph/graph.worker.ts` | 578 | 17905 |
| `src/widgets/diagrams/Axiomas/Congruence2.tsx` | 561 | 11598 |
| `tests/features/editor/useEditorCore.test.ts` | 556 | 25417 |
| `scripts/editor/parseDiagramSourceAST.ts` | 554 | 21658 |
| `src/features/editor/document/structuralOperations.ts` | 546 | 22387 |
| `src/widgets/diagrams/Definiciones/Perpendicular.tsx` | 546 | 12074 |
| `src/features/editor/core/useEditorCore.ts` | 536 | 27872 |
| `src/widgets/diagrams/Definiciones/Mediatriz.tsx` | 526 | 11505 |
| `src/widgets/diagrams/Teoremas/AngulosOpuestos.tsx` | 524 | 11118 |
| `src/widgets/diagrams/Axiomas/Pasch.tsx` | 510 | 11293 |
| `src/widgets/diagrams/Axiomas/HyperbolicParallel.tsx` | 502 | 11393 |
| `src/shared/lib/glossaryDictionary.ts` | 483 | 18549 |
| `src/widgets/diagrams/Axiomas/AxiomaDedekind.tsx` | 481 | 10513 |
| `src/widgets/diagrams/Definiciones/Bisectriz.tsx` | 481 | 10358 |
| `src/widgets/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx` | 479 | 10558 |
| `src/widgets/navigation/SearchOmnibar.tsx` | 467 | 21003 |
| `src/widgets/diagrams/Teoremas/TrianguloIsosceles.tsx` | 464 | 10129 |
| `src/features/graph/GraphStore.ts` | 461 | 16852 |
| `src/features/editor/ui/panels/VisualEditorBlock.tsx` | 459 | 27768 |
| `src/widgets/diagrams/Axiomas/Congruence4.tsx` | 441 | 9524 |
| `src/entities/content/ContentStore.ts` | 439 | 17441 |
| `scripts/core/lean-graph-utils.ts` | 439 | 15008 |
| `src/features/editor/ux/diffReview.ts` | 436 | 15737 |
| `src/widgets/diagrams/Axiomas/Congruence1.tsx` | 432 | 8878 |
| `src/entities/content/msc2020.ts` | 431 | 17110 |
| `src/features/editor/ux/safetyPresentation.ts` | 431 | 16086 |
| `src/features/editor/diagrams/ui/DiagramInfoPanelContentEditor.tsx` | 405 | 27912 |
| `src/widgets/diagrams/Definiciones/Angulo.tsx` | 405 | 8909 |
| `tests/features/editor/persistence/editorPersistenceBackend.test.ts` | 400 | 21891 |
| `src/features/editor/ui/components/SemanticLinker.tsx` | 395 | 16964 |
| `src/features/editor/diagrams/model/diagramElements.ts` | 392 | 17923 |
| `tests/features/editor/diagrams/useDiagramState.test.tsx` | 392 | 15532 |
| `src/widgets/diagrams/Teoremas/DosRectasUnPunto.tsx` | 385 | 8136 |
| `src/widgets/content/MarginaliaPanel.tsx` | 384 | 15144 |
| `src/features/graph/lib/graphWorkerContract.ts` | 379 | 9815 |
| `src/shared/diagrams/spec/types.ts` | 375 | 11194 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 373 | 16429 |
| `src/shared/diagrams/spec/schemaV3.ts` | 371 | 27688 |
| `src/shared/diagrams/core/MathBoard.tsx` | 371 | 14811 |
| `tests/features/editor/diagrams/reducer.test.ts` | 364 | 14186 |
| `scripts/ai/review-working-tree.ts` | 360 | 12260 |
| `tests/features/editor/diagrams/Phase5AcceptanceMigrations.test.ts` | 358 | 14188 |
| `src/widgets/diagrams/Axiomas/Incidence4.tsx` | 357 | 7467 |
| `src/widgets/diagrams/Teoremas/LemaPuntoMedio.tsx` | 357 | 7413 |
| `src/shared/diagrams/runtime/DiagramRenderer.tsx` | 352 | 15288 |
| `src/widgets/layouts/CodexLayout.tsx` | 351 | 12853 |
| `src/widgets/diagrams/Demos/DemoPitagorasEuclides.tsx` | 345 | 13603 |
| `src/widgets/diagrams/Models/ModeloTresPuntos.tsx` | 342 | 7443 |
| `src/features/editor/ui/panels/VisualEditorPanel.tsx` | 339 | 19538 |
| `tests/shared/diagrams/Phase3GeometryLanguage.test.ts` | 335 | 14868 |
| `tests/features/editor/diagrams/DiagramWorkbench.test.tsx` | 334 | 12938 |
| `tests/features/editor/ux/diffReview.test.ts` | 334 | 12241 |
| `src/widgets/diagrams/Definiciones/Altura.tsx` | 333 | 7145 |
| `src/features/editor/core/validation.ts` | 331 | 15636 |
| `src/features/editor/diagrams/ui/DiagramConstraintEditor.tsx` | 330 | 19231 |
| `src/features/metadata/ui/PageDependencyGraph.tsx` | 329 | 9876 |
| `scripts/core/validate-logical-graph.ts` | 328 | 11344 |
| `src/shared/diagrams/spec/expressions.ts` | 323 | 13895 |
| `src/features/editor/diagrams/model/diagramClipboard.ts` | 322 | 14214 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 322 | 11659 |
| `tests/features/editor/validation.test.ts` | 321 | 10386 |
| `tests/database/content-store.test.ts` | 320 | 9682 |
| `src/features/editor/diagrams/hooks/useDiagramState.ts` | 318 | 11639 |
| `scripts/editor/migrate-legacy-diagrams.ts` | 317 | 15294 |
| `tests/features/editor/document/phase7AuthoringUx.test.ts` | 315 | 12692 |
| `scripts/editor/editorPersistenceBackend.ts` | 311 | 15527 |
| `src/widgets/diagrams/Models/ModeloCartesiano.tsx` | 307 | 6585 |
| `src/features/editor/diagrams/ui/DiagramStepsEditor.tsx` | 305 | 22565 |
| `src/widgets/graph/LocalDependencyGraph.tsx` | 302 | 9130 |
| `src/features/editor/ui/EditorNavigation.tsx` | 301 | 16424 |
| `tests/features/editor/diagrams/model.test.ts` | 301 | 14189 |
| `tests/features/editor/diagrams/Phase3Serialization.test.ts` | 300 | 15811 |

**Recomendación.** Revisar cohesión antes de dividir: tamaño alto es una señal, no una prueba de mal diseño.

## Posibles componentes con demasiadas responsabilidades

**Heurística aproximada.** TSX de al menos 250 líneas, o combinación alta de imports/hooks, o 12+ handlers.

| Componente | Líneas | Imports | Hooks | Handlers |
| --- | --- | --- | --- | --- |
| `src/widgets/diagrams/Definiciones/Cuadrilatero.tsx` | 1946 | 1 | 0 | 0 |
| `src/widgets/diagrams/Demos/DemoAngulosOpuestos.tsx` | 1593 | 1 | 0 | 0 |
| `src/widgets/diagrams/Definiciones/Triangulo.tsx` | 1419 | 1 | 0 | 0 |
| `src/widgets/diagrams/Definiciones/Paralelogramo.tsx` | 1402 | 1 | 0 | 0 |
| `src/widgets/diagrams/Demos/DemoAnguloExterno.tsx` | 1373 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/CongruenciaALA.tsx` | 1221 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/CongruenciaLLL.tsx` | 1082 | 1 | 0 | 0 |
| `src/widgets/diagrams/Demos/DemoCongruenciaALA.tsx` | 1064 | 1 | 0 | 0 |
| `src/features/editor/diagrams/ui/DiagramInspector.tsx` | 1044 | 23 | 0 | 215 |
| `src/widgets/diagrams/Demos/DemoSumaAngulos.tsx` | 1007 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/SAS.tsx` | 990 | 1 | 0 | 0 |
| `src/widgets/diagrams/Demos/DemoCongruenciaLLL.tsx` | 950 | 1 | 0 | 0 |
| `src/widgets/diagrams/Models/ModeloPoincare.tsx` | 883 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/AxiomaArquimedes.tsx` | 877 | 1 | 0 | 0 |
| `src/features/editor/ui/diagrams/DiagramWorkbench.tsx` | 865 | 30 | 5 | 142 |
| `src/widgets/diagrams/Teoremas/Pitagoras.tsx` | 844 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/Congruence3.tsx` | 769 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/Tales.tsx` | 753 | 1 | 0 | 0 |
| `src/features/editor/ui/EditorPage.tsx` | 735 | 27 | 20 | 60 |
| `src/widgets/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx` | 668 | 1 | 0 | 0 |
| `src/widgets/diagrams/Demos/DemoAreaAditividad.tsx` | 642 | 1 | 0 | 0 |
| `src/widgets/diagrams/Definiciones/Circunferencia.tsx` | 614 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/DesigualdadTriangular.tsx` | 614 | 1 | 0 | 0 |
| `src/widgets/diagrams/CasosUso/GpsTrilateracion.tsx` | 606 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/PuntoMedioPerpendicular.tsx` | 606 | 1 | 0 | 0 |
| `src/widgets/diagrams/Definiciones/Mediana.tsx` | 584 | 1 | 0 | 0 |
| `src/widgets/diagrams/Models/ModeloFano.tsx` | 582 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/SumaAngulos.tsx` | 579 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/Congruence2.tsx` | 561 | 1 | 0 | 0 |
| `src/widgets/diagrams/Definiciones/Perpendicular.tsx` | 546 | 1 | 0 | 0 |
| `src/widgets/diagrams/Definiciones/Mediatriz.tsx` | 526 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/AngulosOpuestos.tsx` | 524 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/Pasch.tsx` | 510 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/HyperbolicParallel.tsx` | 502 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/AxiomaDedekind.tsx` | 481 | 1 | 0 | 0 |
| `src/widgets/diagrams/Definiciones/Bisectriz.tsx` | 481 | 1 | 0 | 0 |
| `src/widgets/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx` | 479 | 1 | 0 | 0 |
| `src/widgets/navigation/SearchOmnibar.tsx` | 467 | 5 | 15 | 25 |
| `src/widgets/diagrams/Teoremas/TrianguloIsosceles.tsx` | 464 | 1 | 0 | 0 |
| `src/features/editor/ui/panels/VisualEditorBlock.tsx` | 459 | 11 | 0 | 63 |
| `src/widgets/diagrams/Axiomas/Congruence4.tsx` | 441 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/Congruence1.tsx` | 432 | 1 | 0 | 0 |
| `src/features/editor/diagrams/ui/DiagramInfoPanelContentEditor.tsx` | 405 | 8 | 2 | 89 |
| `src/widgets/diagrams/Definiciones/Angulo.tsx` | 405 | 1 | 0 | 0 |
| `src/features/editor/ui/components/SemanticLinker.tsx` | 395 | 4 | 7 | 31 |
| `src/widgets/diagrams/Teoremas/DosRectasUnPunto.tsx` | 385 | 1 | 0 | 0 |
| `src/widgets/content/MarginaliaPanel.tsx` | 384 | 8 | 1 | 4 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 373 | 15 | 27 | 22 |
| `src/shared/diagrams/core/MathBoard.tsx` | 371 | 4 | 14 | 25 |
| `src/widgets/diagrams/Axiomas/Incidence4.tsx` | 357 | 1 | 0 | 0 |
| `src/widgets/diagrams/Teoremas/LemaPuntoMedio.tsx` | 357 | 1 | 0 | 0 |
| `src/shared/diagrams/runtime/DiagramRenderer.tsx` | 352 | 12 | 14 | 32 |
| `src/widgets/layouts/CodexLayout.tsx` | 351 | 10 | 11 | 6 |
| `src/widgets/diagrams/Demos/DemoPitagorasEuclides.tsx` | 345 | 2 | 0 | 6 |
| `src/widgets/diagrams/Models/ModeloTresPuntos.tsx` | 342 | 1 | 0 | 0 |
| `src/features/editor/ui/panels/VisualEditorPanel.tsx` | 339 | 9 | 5 | 52 |
| `src/widgets/diagrams/Definiciones/Altura.tsx` | 333 | 1 | 0 | 0 |
| `src/features/editor/diagrams/ui/DiagramConstraintEditor.tsx` | 330 | 7 | 0 | 19 |
| `src/features/metadata/ui/PageDependencyGraph.tsx` | 329 | 6 | 8 | 6 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 322 | 7 | 13 | 9 |
| `src/widgets/diagrams/Models/ModeloCartesiano.tsx` | 307 | 1 | 0 | 0 |
| `src/features/editor/diagrams/ui/DiagramStepsEditor.tsx` | 305 | 8 | 1 | 47 |
| `src/widgets/graph/LocalDependencyGraph.tsx` | 302 | 6 | 2 | 3 |
| `src/features/editor/ui/EditorNavigation.tsx` | 301 | 3 | 6 | 18 |
| `src/widgets/diagrams/Definiciones/Paralelas.tsx` | 286 | 1 | 0 | 0 |
| `src/widgets/mdx/MDXBlocks.tsx` | 285 | 25 | 3 | 1 |
| `src/pages/GraphPage.tsx` | 283 | 12 | 15 | 17 |
| `src/widgets/diagrams/Axiomas/Order1.tsx` | 282 | 1 | 0 | 0 |
| `src/widgets/diagrams/Axiomas/Order2.tsx` | 282 | 1 | 0 | 0 |
| `src/features/editor/ui/blocks/DemonstrationBlock.tsx` | 280 | 3 | 0 | 34 |
| `src/pages/Home/components/BranchLibrary.tsx` | 265 | 3 | 1 | 0 |
| `src/pages/TheoremPage.tsx` | 263 | 16 | 3 | 0 |
| `src/features/exercises/ui/Emparejar.tsx` | 262 | 3 | 8 | 2 |
| `src/widgets/diagrams/Axiomas/Order3.tsx` | 256 | 1 | 0 | 0 |
| `src/features/progress/ui/StudyPlanMinimap.tsx` | 250 | 3 | 1 | 5 |
| `src/features/editor/ui/panels/MetadataPanel.tsx` | 243 | 7 | 1 | 28 |
| `src/features/graph/ui/components/AxiomaticSidebar.tsx` | 240 | 7 | 1 | 14 |
| `src/features/editor/diagrams/ui/DiagramToolbar.tsx` | 228 | 3 | 3 | 47 |
| `src/features/graph/ui/components/AxiomaticAxiomPicker.tsx` | 221 | 3 | 0 | 16 |
| `src/features/exercises/ui/Clasificador.tsx` | 220 | 3 | 4 | 16 |
| `src/features/editor/ui/EditorToolbar.tsx` | 205 | 8 | 2 | 26 |
| `src/features/graph/ui/components/AxiomaticUniversePicker.tsx` | 198 | 2 | 2 | 20 |
| `src/features/exercises/ui/Hueco.tsx` | 195 | 2 | 5 | 16 |
| `src/features/editor/diagrams/ui/DiagramOrganizationPanel.tsx` | 187 | 3 | 0 | 48 |
| `src/features/editor/ui/components/MetadataInspector.tsx` | 170 | 2 | 1 | 24 |
| `src/features/editor/diagrams/ui/DiagramHeaderReadingsEditor.tsx` | 164 | 3 | 0 | 19 |
| `src/features/editor/ui/diff/DiffReviewPanel.tsx` | 153 | 3 | 0 | 15 |
| `src/features/editor/diagrams/ui/DiagramTemplateField.tsx` | 144 | 4 | 4 | 14 |
| `src/features/editor/diagrams/ui/DiagramPointMovementAidsEditor.tsx` | 118 | 3 | 0 | 17 |
| `src/features/editor/diagrams/ui/DiagramSceneControls.tsx` | 115 | 3 | 0 | 19 |
| `src/features/glossary/ui/ConceptLink.tsx` | 113 | 6 | 3 | 15 |
| `src/features/editor/diagrams/ui/DiagramToolReferencePicker.tsx` | 113 | 3 | 0 | 12 |
| `src/features/editor/ui/panels/ExerciseBlockEditor.tsx` | 106 | 4 | 2 | 14 |
| `src/features/editor/diagrams/ui/DiagramTargetSelector.tsx` | 103 | 4 | 0 | 12 |
| `src/features/editor/diagrams/ui/DiagramObjectList.tsx` | 102 | 4 | 2 | 29 |
| `src/features/editor/ui/safety/UnsavedChangesDialog.tsx` | 96 | 3 | 0 | 17 |
| `src/features/editor/diagrams/ui/DiagramCanvas.tsx` | 94 | 6 | 0 | 23 |
| `src/features/editor/diagrams/ui/DiagramRewriteDialog.tsx` | 93 | 4 | 2 | 13 |
| `src/features/editor/ui/panels/RegisteredMdxBlockEditor.tsx` | 93 | 3 | 1 | 27 |
| `src/features/editor/diagrams/ui/DiagramPointMovementCard.tsx` | 75 | 3 | 0 | 21 |
| `src/features/editor/diagrams/ui/DiagramElementAppearanceEditor.tsx` | 73 | 5 | 0 | 30 |
| `src/features/editor/diagrams/ui/DiagramMovementAidsPanel.tsx` | 70 | 4 | 0 | 12 |
| `src/features/editor/diagrams/ui/DiagramNativeLabelEditor.tsx` | 67 | 1 | 0 | 16 |
| `src/features/editor/diagrams/ui/SegmentMarksEditor.tsx` | 65 | 3 | 0 | 14 |
| `src/features/editor/ui/create/CreatePageDialog.tsx` | 60 | 4 | 1 | 15 |
| `src/features/editor/diagrams/ui/DiagramGuidedConstructions.tsx` | 52 | 3 | 0 | 12 |
| `src/features/editor/ui/panels/InteractivePreviewToken.tsx` | 50 | 3 | 2 | 13 |
| `src/features/editor/diagrams/ui/DiagramToolGuidance.tsx` | 42 | 4 | 0 | 12 |

**Recomendación.** Separar coordinación, estado y presentación solo cuando la revisión confirme más de una razón de cambio.

## Deuda de tests por zona

**Hallazgo objetivo.** Se detectaron 130 archivos de test. La tabla cuenta archivos fuente y tests que importan directamente cada zona.

| Zona | TS/TSX fuente | Tests con import directo |
| --- | --- | --- |
| app | 6 | 2 |
| pages | 23 | 1 |
| widgets | 105 | 19 |
| features | 195 | 67 |
| entities | 12 | 11 |
| shared | 75 | 48 |
| database | 0 | 0 |

**Heurística aproximada.** Cero imports directos no significa cero cobertura: una prueba puede cubrir una zona de forma transitiva. La tabla no usa instrumentación.

**Recomendación.** Ejecutar `npm run test:coverage` y usar cobertura por rama como evidencia antes de crear tests.

## Deuda de arquitectura/FSD

**Hallazgo objetivo.** `.dependency-cruiser.js` declara 12 reglas con severidad error y 1 con severidad warning.

**Heurística aproximada.** Las rutas siguientes se deducen de imports estáticos y las invariantes globales; no aplican todas las excepciones de Dependency Cruiser.

| Origen | Import | Señal |
| --- | --- | --- |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/BranchLibrary` | pages → pages |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/HeroSection` | pages → pages |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/HomeFooter` | pages → pages |
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
| `ai/` | 20 |
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
| README.md | `ai/README.md`<br>`docs/ai/README.md` |
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
