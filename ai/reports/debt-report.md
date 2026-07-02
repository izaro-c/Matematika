# Informe de deuda técnica de Matematika

> Informe determinista generado por `npm run ai:debt`. No ejecuta validadores ni modifica código de producto.

## Cómo leer este informe

- **Hallazgo objetivo:** dato reproducible mediante lectura de archivos o configuración.
- **Heurística aproximada:** señal léxica o estructural que necesita revisión humana; no equivale a un defecto confirmado.
- **Recomendación:** acción propuesta; no se ejecuta automáticamente.

## Resumen ejecutivo

**Hallazgos objetivos.** Se inspeccionaron 506 archivos de texto, 278 archivos TS/TSX, 20 archivos de test y 116 archivos MDX.

**Heurísticas aproximadas.** Se localizaron 629 apariciones léxicas de `any`, 380 colores hex, 28 marcas TODO/FIXME, 17 archivos TS/TSX grandes y 92 rutas de importación potencialmente incompatibles con FSD.

**Recomendación.** Empezar por las rutas FSD y supresiones TypeScript, continuar con hex fuera de tokens, descomponer puntos de alta responsabilidad y cerrar después cobertura, contenido, Lean y duplicación IA.

## Deuda TypeScript

**Hallazgo objetivo.** Hay 278 archivos TS/TSX en el alcance; 1 archivo(s) contienen 9 supresiones `@ts-*`.

| Archivo | Supresiones `@ts-*` |
| --- | --- |
| `src/pages/GraphPage.tsx` | 9 |

**Heurística aproximada.** `any` se cuenta léxicamente, también dentro de comentarios, cadenas, documentación y nombres de reglas.

**Recomendación.** Revisar primero supresiones y usos reales de `any` en código ejecutable; no convertir automáticamente coincidencias textuales.

## Apariciones aproximadas de any por archivo

**Heurística aproximada.** Coincidencias de palabra completa `any` en TS/TSX.

| Archivo | Apariciones |
| --- | --- |
| `src/shared/diagrams/Definiciones/Cuadrilatero.tsx` | 71 |
| `src/features/graph/ui/MathFactory.ts` | 45 |
| `src/shared/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 38 |
| `src/shared/diagrams/Theorems/CongruenciaALA.tsx` | 21 |
| `src/shared/diagrams/Definiciones/Paralelogramo.tsx` | 20 |
| `src/shared/diagrams/Models/ModeloFano.tsx` | 19 |
| `src/shared/diagrams/Theorems/CongruenciaLLL.tsx` | 19 |
| `src/shared/diagrams/Models/ModeloTresPuntos.tsx` | 17 |
| `src/shared/diagrams/Teoremas/TrianguloIsosceles.tsx` | 13 |
| `src/shared/diagrams/Teoremas/SumaAngulos.tsx` | 12 |
| `scripts/ai/generate-debt-report.ts` | 11 |
| `src/shared/diagrams/Definiciones/Mediana.tsx` | 11 |
| `src/shared/diagrams/Definiciones/Bisectriz.tsx` | 10 |
| `src/shared/diagrams/Demos/DemoCongruenciaALA.tsx` | 10 |
| `src/shared/diagrams/Teoremas/DemoSumaAngulos.tsx` | 10 |
| `src/shared/diagrams/Teoremas/DesigualdadTriangular.tsx` | 10 |
| `src/features/graph/ui/MathBoard.tsx` | 9 |
| `src/shared/diagrams/Axiomas/AxiomaArquimedes.tsx` | 9 |
| `src/shared/diagrams/Teoremas/LemaPuntoMedio.tsx` | 9 |
| `src/shared/diagrams/Teoremas/Pitagoras.tsx` | 9 |
| `src/shared/diagrams/Demos/DemoAngulosOpuestos.tsx` | 8 |
| `src/shared/diagrams/Demos/DemoAreaAditividad.tsx` | 8 |
| `src/shared/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx` | 8 |
| `src/shared/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx` | 8 |
| `src/shared/diagrams/Demos/DemoCongruenciaLLL.tsx` | 8 |
| `src/shared/diagrams/Demos/DemoInvarianciaTriangulacion.tsx` | 8 |
| `src/shared/diagrams/Demos/DemoRectasCoincidentes.tsx` | 8 |
| `src/shared/diagrams/Demos/DemoTriangulacionPoligono.tsx` | 8 |
| `src/shared/diagrams/Demos/DemoTrianguloIsosceles.tsx` | 8 |
| `src/features/editor/hooks/useEditorActions.ts` | 7 |
| `src/shared/diagrams/Definiciones/Triangulo.tsx` | 7 |
| `src/shared/diagrams/Theorems/AngulosOpuestos.tsx` | 7 |
| `src/shared/diagrams/Axiomas/Pasch.tsx` | 6 |
| `src/shared/diagrams/Definiciones/Mediatriz.tsx` | 6 |
| `src/shared/diagrams/Teoremas/DemoTales.tsx` | 6 |
| `src/shared/diagrams/Teoremas/PuntoMedioPerpendicular.tsx` | 6 |
| `src/shared/diagrams/Teoremas/Tales.tsx` | 6 |
| `tests/scripts/generate-test-report.ts` | 6 |
| `.agents/skills/diagrama/examples/JSXGraphCanon.tsx` | 5 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 5 |
| `src/shared/diagrams/Definiciones/Altura.tsx` | 5 |
| `src/shared/diagrams/Models/ModeloPoincare.tsx` | 5 |
| `src/shared/diagrams/Teoremas/DosRectasUnPunto.tsx` | 5 |
| `src/shared/diagrams/Axiomas/EuclidParallel.tsx` | 4 |
| `src/shared/diagrams/Axiomas/HyperbolicParallel.tsx` | 4 |
| `src/shared/diagrams/Axiomas/Incidence1.tsx` | 4 |
| `src/shared/diagrams/Axiomas/Incidence2.tsx` | 4 |
| `src/shared/diagrams/Axiomas/Incidence3.tsx` | 4 |
| `src/shared/diagrams/Axiomas/Incidence4.tsx` | 4 |
| `src/shared/diagrams/Axiomas/SAS.tsx` | 4 |
| `src/shared/diagrams/Definiciones/Angulo.tsx` | 4 |
| `src/shared/diagrams/Definiciones/Circunferencia.tsx` | 4 |
| `src/shared/diagrams/Definiciones/Paralelas.tsx` | 4 |
| `src/shared/diagrams/Definiciones/Perpendicular.tsx` | 4 |
| `src/shared/diagrams/Definiciones/Punto.tsx` | 4 |
| `src/shared/diagrams/Definiciones/Recta.tsx` | 4 |
| `src/shared/diagrams/Definiciones/Segmento.tsx` | 4 |
| `src/shared/diagrams/Definiciones/Semirrecta.tsx` | 4 |
| `src/shared/diagrams/Axiomas/AxiomaDedekind.tsx` | 3 |
| `src/shared/diagrams/Demos/DemoDosRectasUnPunto.tsx` | 3 |
| `src/shared/diagrams/types/jxg.ts` | 3 |
| `scripts/core/validate-cross-references.ts` | 2 |
| `src/pages/BranchPage.tsx` | 2 |
| `src/shared/diagrams/Axiomas/Congruence1.tsx` | 2 |
| `src/shared/diagrams/Axiomas/Congruence2.tsx` | 2 |
| `src/shared/diagrams/Axiomas/Congruence3.tsx` | 2 |
| `src/shared/diagrams/Axiomas/Congruence4.tsx` | 2 |
| `src/shared/diagrams/Axiomas/Order1.tsx` | 2 |
| `src/shared/diagrams/Axiomas/Order2.tsx` | 2 |
| `src/shared/diagrams/Axiomas/Order3.tsx` | 2 |
| `src/shared/diagrams/Models/ModeloCartesiano.tsx` | 2 |
| `src/shared/ui/JXGBoard.tsx` | 2 |
| `src/widgets/layouts/InteractiveLessonLayout.tsx` | 2 |
| `scripts/ai/generate-ai-indexes.ts` | 1 |
| `scripts/utils/detect-missing-links.ts` | 1 |
| `src/features/glossary/ui/ConceptLink.tsx` | 1 |
| `src/features/graph/lib/knowledgeGraphBuilder.ts` | 1 |
| `src/shared/diagrams/Axiomas/Incidence5.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Incidence7.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Plano.tsx` | 1 |
| `src/shared/diagrams/Teoremas/DemoPitagorasAreas.tsx` | 1 |
| `src/shared/diagrams/Teoremas/DemoTrianguloIsosceles.tsx` | 1 |

**Recomendación.** Priorizar los archivos con más coincidencias y confirmar cada una con TypeScript/ESLint.

## Colores hex hardcodeados por archivo

**Heurística aproximada.** Coincidencias `#RGB`, `#RRGGBB` o `#RRGGBBAA`; incluye definiciones legítimas de tokens, ejemplos y cadenas.

| Archivo | Apariciones |
| --- | --- |
| `src/shared/lib/constants.ts` | 72 |
| `.auxiliary/.opencode/skills/diagrama/SKILL.md` | 47 |
| `.agents/skills/diagrama/SKILL.md` | 32 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 20 |
| `src/app/index.css` | 18 |
| `src/features/graph/lib/graphUtils.ts` | 15 |
| `.auxiliary/.opencode/skills/antigravity/SKILL.md` | 10 |
| `src/pages/GraphPage.tsx` | 10 |
| `src/shared/lib/theme.ts` | 10 |
| `.agents/skills/page-creator/SKILL.md` | 9 |
| `src/shared/diagrams/Definiciones/Triangulo.tsx` | 7 |
| `src/features/graph/ui/components/AxiomaticSidebar.tsx` | 6 |
| `src/pages/HistoryTimeline.tsx` | 6 |
| `tests/controller/math-utils.test.ts` | 6 |
| `src/shared/diagrams/Axiomas/Incidence5.tsx` | 5 |
| `src/shared/diagrams/Axiomas/Incidence6.tsx` | 5 |
| `src/shared/diagrams/Axiomas/Incidence7.tsx` | 5 |
| `src/shared/diagrams/Axiomas/Incidence8.tsx` | 5 |
| `src/shared/diagrams/Definiciones/Plano.tsx` | 5 |
| `src/shared/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 5 |
| `.agents/skills/diagrama/examples/JSXGraphCanon.tsx` | 4 |
| `.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` | 4 |
| `src/features/graph/graph.worker.ts` | 4 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 4 |
| `src/widgets/content/ProofStep.tsx` | 4 |
| `src/shared/diagrams/Teoremas/DemoPitagorasAreas.tsx` | 3 |
| `.agents/skills/project-philosophy/SKILL.md` | 2 |
| `.auxiliary/TODO.md` | 2 |
| `src/features/graph/ui/MathBoard.tsx` | 2 |
| `.opencode/plugins/matematika-guard.ts` | 1 |
| `docs/requirements/Product_Backlog.md` | 1 |
| `src/features/graph/ui/components/AxiomaticDetailPanel.tsx` | 1 |
| `src/features/graph/ui/components/AxiomaticSearch.tsx` | 1 |
| `src/shared/diagrams/Axiomas/AxiomaArquimedes.tsx` | 1 |
| `src/shared/diagrams/Axiomas/AxiomaDedekind.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Congruence1.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Congruence2.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Congruence3.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Congruence4.tsx` | 1 |
| `src/shared/diagrams/Axiomas/EuclidParallel.tsx` | 1 |
| `src/shared/diagrams/Axiomas/HyperbolicParallel.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Incidence1.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Incidence2.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Incidence3.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Incidence4.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Order1.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Order2.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Order3.tsx` | 1 |
| `src/shared/diagrams/Axiomas/Pasch.tsx` | 1 |
| `src/shared/diagrams/Axiomas/SAS.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Altura.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Angulo.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Bisectriz.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Circunferencia.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Cuadrilatero.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Mediana.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Mediatriz.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Paralelas.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Paralelogramo.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Perpendicular.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Punto.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Recta.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Segmento.tsx` | 1 |
| `src/shared/diagrams/Definiciones/Semirrecta.tsx` | 1 |
| `src/shared/diagrams/Models/ModeloCartesiano.tsx` | 1 |
| `src/shared/diagrams/Models/ModeloFano.tsx` | 1 |
| `src/shared/diagrams/Models/ModeloPoincare.tsx` | 1 |
| `src/shared/diagrams/Models/ModeloTresPuntos.tsx` | 1 |
| `src/shared/diagrams/Teoremas/DemoSumaAngulos.tsx` | 1 |
| `src/shared/diagrams/Teoremas/DemoTales.tsx` | 1 |
| `src/shared/diagrams/Teoremas/DesigualdadTriangular.tsx` | 1 |
| `src/shared/diagrams/Teoremas/DosRectasUnPunto.tsx` | 1 |
| `src/shared/diagrams/Teoremas/LemaPuntoMedio.tsx` | 1 |
| `src/shared/diagrams/Teoremas/Pitagoras.tsx` | 1 |
| `src/shared/diagrams/Teoremas/PuntoMedioPerpendicular.tsx` | 1 |
| `src/shared/diagrams/Teoremas/SumaAngulos.tsx` | 1 |
| `src/shared/diagrams/Teoremas/Tales.tsx` | 1 |
| `src/shared/diagrams/Teoremas/TrianguloIsosceles.tsx` | 1 |
| `src/shared/diagrams/Theorems/AngulosOpuestos.tsx` | 1 |
| `src/shared/diagrams/Theorems/CongruenciaALA.tsx` | 1 |
| `src/shared/diagrams/Theorems/CongruenciaLLL.tsx` | 1 |
| `src/shared/diagrams/utils/cssVar.ts` | 1 |

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
| `ai/current-state.md` | 1 |
| `lean/Matematika/Geometry/Basic.lean` | 1 |
| `lean/Matematika/Geometry/Hilbert/Constructions.lean` | 1 |

**Recomendación.** Convertir deuda vigente en objetivos con responsable/criterio de cierre y retirar comentarios obsoletos.

## Archivos TS/TSX grandes

**Heurística aproximada.** Umbral: al menos 300 líneas o 20.000 bytes.

| Archivo | Líneas | Bytes |
| --- | --- | --- |
| `scripts/ai/generate-debt-report.ts` | 848 | 35233 |
| `scripts/ai/generate-ai-indexes.ts` | 770 | 29276 |
| `src/features/graph/graph.worker.ts` | 516 | 16275 |
| `src/shared/diagrams/Definiciones/Cuadrilatero.tsx` | 496 | 22664 |
| `src/shared/lib/glossaryDictionary.ts` | 483 | 18549 |
| `src/entities/content/ContentStore.ts` | 448 | 17825 |
| `src/entities/content/msc2020.ts` | 431 | 17110 |
| `scripts/core/lean-graph-utils.ts` | 427 | 14649 |
| `src/features/editor/ui/EditorPage.tsx` | 425 | 20277 |
| `src/widgets/navigation/SearchOmnibar.tsx` | 408 | 14240 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 366 | 16130 |
| `scripts/ai/review-working-tree.ts` | 357 | 12027 |
| `src/features/editor/hooks/useEditorActions.ts` | 345 | 12621 |
| `src/widgets/content/MarginaliaPanel.tsx` | 344 | 13364 |
| `src/shared/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 327 | 16986 |
| `tests/database/content-store.test.ts` | 320 | 9637 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 301 | 11135 |

**Recomendación.** Revisar cohesión antes de dividir: tamaño alto es una señal, no una prueba de mal diseño.

## Posibles componentes con demasiadas responsabilidades

**Heurística aproximada.** TSX de al menos 250 líneas, o combinación alta de imports/hooks, o 12+ handlers.

| Componente | Líneas | Imports | Hooks | Handlers |
| --- | --- | --- | --- | --- |
| `src/shared/diagrams/Definiciones/Cuadrilatero.tsx` | 496 | 3 | 3 | 2 |
| `src/features/editor/ui/EditorPage.tsx` | 425 | 10 | 3 | 61 |
| `src/widgets/navigation/SearchOmnibar.tsx` | 408 | 10 | 11 | 14 |
| `src/features/graph/ui/AxiomaticTree.tsx` | 366 | 15 | 27 | 22 |
| `src/widgets/content/MarginaliaPanel.tsx` | 344 | 7 | 1 | 4 |
| `src/shared/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 327 | 3 | 6 | 0 |
| `src/features/progress/ui/TaxonomyGraph.tsx` | 301 | 5 | 11 | 9 |
| `src/pages/GraphPage.tsx` | 284 | 10 | 13 | 15 |
| `src/shared/ui/MDXBlocks.tsx` | 275 | 22 | 3 | 1 |
| `src/pages/Home/components/BranchLibrary.tsx` | 271 | 3 | 1 | 0 |
| `src/features/exercises/ui/Emparejar.tsx` | 262 | 3 | 8 | 2 |
| `src/features/exercises/ui/Clasificador.tsx` | 220 | 3 | 4 | 16 |
| `src/features/exercises/ui/Hueco.tsx` | 195 | 2 | 5 | 16 |
| `src/features/editor/ui/NewFileWizard.tsx` | 191 | 2 | 0 | 50 |
| `src/features/editor/ui/modals/NewFileWizardModal.tsx` | 158 | 2 | 0 | 25 |
| `src/features/editor/ui/BlocksGallery.tsx` | 106 | 1 | 0 | 33 |
| `src/features/editor/ui/modals/BlocksGalleryModal.tsx` | 99 | 1 | 0 | 33 |
| `src/features/editor/ui/EditorSidebar.tsx` | 79 | 2 | 0 | 16 |
| `src/features/editor/ui/RefModal.tsx` | 77 | 1 | 0 | 20 |
| `src/features/editor/ui/EditorToolbar.tsx` | 74 | 1 | 0 | 32 |
| `src/features/editor/ui/LinkModal.tsx` | 69 | 1 | 0 | 16 |
| `src/features/editor/ui/MetadataPanel.tsx` | 59 | 1 | 0 | 14 |

**Recomendación.** Separar coordinación, estado y presentación solo cuando la revisión confirme más de una razón de cambio.

## Deuda de tests por zona

**Hallazgo objetivo.** Se detectaron 20 archivos de test. La tabla cuenta archivos fuente y tests que importan directamente cada zona.

| Zona | TS/TSX fuente | Tests con import directo |
| --- | --- | --- |
| app | 5 | 2 |
| pages | 22 | 0 |
| widgets | 15 | 2 |
| features | 66 | 5 |
| entities | 9 | 5 |
| shared | 119 | 5 |
| database | 0 | 0 |

**Heurística aproximada.** Cero imports directos no significa cero cobertura: una prueba puede cubrir una zona de forma transitiva. La tabla no usa instrumentación.

**Recomendación.** Ejecutar `npm run test:coverage` y usar cobertura por rama como evidencia antes de crear tests.

## Deuda de arquitectura/FSD

**Hallazgo objetivo.** `.dependency-cruiser.js` declara 4 reglas con severidad error y 9 con severidad warning.

**Heurística aproximada.** Las rutas siguientes se deducen de imports estáticos y las invariantes globales; no aplican todas las excepciones de Dependency Cruiser.

| Origen | Import | Señal |
| --- | --- | --- |
| `src/features/editor/ui/ImportsPanel.tsx` | `@/pages/...` | features → pages/app |
| `src/features/graph/ui/MathBoard.tsx` | `@/app/providers/MathStoreContext` | features → pages/app |
| `src/features/progress/ui/StudyTask.tsx` | `@/app/providers/StudyPlanContext` | features → pages/app |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/BranchLibrary` | pages → pages |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/HeroSection` | pages → pages |
| `src/pages/Home/HomePage.tsx` | `@/pages/Home/components/HomeFooter` | pages → pages |
| `src/shared/diagrams/Axiomas/Congruence1.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Congruence2.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Congruence3.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Congruence4.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/EuclidParallel.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/HyperbolicParallel.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Incidence1.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Incidence2.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Incidence3.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Incidence4.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Order1.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Order2.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Order3.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/Pasch.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Axiomas/SAS.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Angulo.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Circunferencia.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Paralelas.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Perpendicular.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Plano.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Punto.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Recta.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Segmento.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Semirrecta.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Definiciones/Triangulo.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAngulosOpuestos.tsx` | `@/features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAngulosOpuestos.tsx` | `@/features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAngulosOpuestos.tsx` | `@/features/graph/ui/MathUtils` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAreaAditividad.tsx` | `../../../features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAreaAditividad.tsx` | `../../../features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx` | `../../../features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx` | `../../../features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx` | `../../../features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx` | `../../../features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoCongruenciaALA.tsx` | `@/features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoCongruenciaALA.tsx` | `@/features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoCongruenciaLLL.tsx` | `@/features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoCongruenciaLLL.tsx` | `@/features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoCongruenciaLLL.tsx` | `@/features/graph/ui/MathUtils` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoDosRectasUnPunto.tsx` | `@/features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoDosRectasUnPunto.tsx` | `@/features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoInvarianciaTriangulacion.tsx` | `../../../features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoInvarianciaTriangulacion.tsx` | `../../../features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoRectasCoincidentes.tsx` | `@/features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoRectasCoincidentes.tsx` | `@/features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoTriangulacionPoligono.tsx` | `../../../features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoTriangulacionPoligono.tsx` | `../../../features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoTrianguloIsosceles.tsx` | `@/features/graph/ui/MathBoard` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoTrianguloIsosceles.tsx` | `@/features/graph/ui/MathFactory` | shared → capa superior |
| `src/shared/diagrams/Demos/DemoTrianguloIsosceles.tsx` | `@/features/graph/ui/MathUtils` | shared → capa superior |
| `src/shared/diagrams/Teoremas/DemoSumaAngulos.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/diagrams/Teoremas/DemoTales.tsx` | `@/features/lessons/LessonStore` | shared → capa superior |
| `src/shared/hooks/useKeyboardShortcuts.ts` | `@/features/glossary/GlossaryStore` | shared → capa superior |
| `src/shared/hooks/useKeyboardShortcuts.ts` | `@/features/search/NavigationStore` | shared → capa superior |
| `src/shared/ui/AplicacionesSection.tsx` | `@/entities/content/types` | shared → capa superior |
| `src/shared/ui/ContentHeader.tsx` | `@/entities/content` | shared → capa superior |
| `src/shared/ui/InteractiveTimePlot.tsx` | `@/entities/content` | shared → capa superior |
| `src/shared/ui/MaterialPracticoSection.tsx` | `@/widgets/content/MaterialPracticoSection` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/CanvasInteractivo` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/Clasificador` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/DeslizadorEnLine` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/Emparejar` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/ErrorComun` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/Hueco` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/MatrizInteractiva` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/Ordenacion` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/Paso` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/Pregunta` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/exercises/ui/Solucion` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/glossary/ui/Concept` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/glossary/ui/ConceptLink` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/glossary/ui/RefLink` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/features/lessons/ui/HighlightLink` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/widgets/content/DemonstrationSection` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/widgets/content/ProofStep` | shared → capa superior |
| `src/shared/ui/MDXBlocks.tsx` | `@/widgets/content/ProofStepExpander` | shared → capa superior |
| `src/shared/ui/ModelBadge.tsx` | `@/features/graph/ui/ModelBadge` | shared → capa superior |
| `src/widgets/content/MarginaliaPanel.tsx` | `@/features/glossary/GlossaryStore` | widgets → pages/features |
| `src/widgets/content/SimSection.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/content/SymbolDictionaryManager.tsx` | `@/features/glossary/GlossaryStore` | widgets → pages/features |
| `src/widgets/layouts/InteractiveLessonLayout.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/layouts/SimulationLayout.tsx` | `@/features/lessons/LessonStore` | widgets → pages/features |
| `src/widgets/navigation/SearchOmnibar.tsx` | `@/features/glossary/GlossaryStore` | widgets → pages/features |
| `src/widgets/navigation/SearchOmnibar.tsx` | `@/features/glossary/GlossaryStore` | widgets → pages/features |
| `src/widgets/navigation/SearchOmnibar.tsx` | `@/features/search/NavigationStore` | widgets → pages/features |
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
| lessons | 7 |
| mathematicians | 9 |
| models | 4 |
| theorems | 24 |

El índice de cobertura existente declara 116 entradas, 57 sin diagrama y 67 sin formalización Lean. Puede estar desactualizado hasta regenerarse.

**Heurísticas aproximadas.** 0 archivos carecen de una o más claves base; 116 no declaran `requires` (opcional en Zod, exigido por la política topológica); 0 IDs no coinciden con el nombre de archivo; 0 anchors HTML con `href`; 124 `ProofStep` sin atributo `justificacion`; 1 axiomas/definiciones/teoremas sin señal léxica de interactividad.

_Ninguno detectado._

| Zona | Archivos sin `requires` |
| --- | --- |
| axiomatic-systems | 4 |
| axioms | 21 |
| definitions | 22 |
| demonstrations | 25 |
| lessons | 7 |
| mathematicians | 9 |
| models | 4 |
| theorems | 24 |

_Ninguno detectado._

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
| `ai/` | 13 |
| `docs/ai/` | 2 |
| `.agents/` | 19 |
| `.opencode/` | 11 |
| `.auxiliary/` | 21 |

**Heurísticas aproximadas.** 18 basenames repetidos entre capas y 12 grupos de contenido byte-a-byte idéntico. Un basename repetido no implica duplicación semántica.

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
| package-lock.json | `.auxiliary/.opencode/package-lock.json`<br>`.opencode/package-lock.json` |
| package.json | `.auxiliary/.opencode/package.json`<br>`.opencode/package.json` |
| README.md | `ai/README.md`<br>`docs/ai/README.md` |
| sistema-axiomatico.mdx | `.agents/skills/page-creator/templates/sistema-axiomatico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/sistema-axiomatico.mdx` |
| SKILL.md | `.agents/skills/diagrama/SKILL.md`<br>`.agents/skills/lean-formalizer/SKILL.md`<br>`.agents/skills/page-creator/SKILL.md`<br>`.agents/skills/project-philosophy/SKILL.md`<br>`.auxiliary/.opencode/skills/antigravity/SKILL.md`<br>`.auxiliary/.opencode/skills/diagrama/SKILL.md` |
| SVGCanon.tsx | `.agents/skills/diagrama/examples/SVGCanon.tsx`<br>`.auxiliary/.opencode/skills/diagrama/examples/SVGCanon.tsx` |
| teorema.mdx | `.agents/skills/page-creator/templates/teorema.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/teorema.mdx` |
| validate.mjs | `.agents/skills/page-creator/scripts/validate.mjs`<br>`.auxiliary/.opencode/skills/antigravity/scripts/validate.mjs` |

| Grupo idéntico | Rutas |
| --- | --- |
| 1 | `.agents/skills/diagrama/examples/JSXGraphCanon.tsx`<br>`.auxiliary/.opencode/skills/diagrama/examples/JSXGraphCanon.tsx` |
| 2 | `.agents/skills/diagrama/examples/SVGCanon.tsx`<br>`.auxiliary/.opencode/skills/diagrama/examples/SVGCanon.tsx` |
| 3 | `.agents/skills/page-creator/scripts/validate.mjs`<br>`.auxiliary/.opencode/skills/antigravity/scripts/validate.mjs` |
| 4 | `.agents/skills/page-creator/templates/axioma.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/axioma.mdx` |
| 5 | `.agents/skills/page-creator/templates/caso-de-uso.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/caso-de-uso.mdx` |
| 6 | `.agents/skills/page-creator/templates/definicion.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/definicion.mdx` |
| 7 | `.agents/skills/page-creator/templates/ejemplo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejemplo.mdx` |
| 8 | `.agents/skills/page-creator/templates/ejercicio.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/ejercicio.mdx` |
| 9 | `.agents/skills/page-creator/templates/matematico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/matematico.mdx` |
| 10 | `.agents/skills/page-creator/templates/modelo.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/modelo.mdx` |
| 11 | `.agents/skills/page-creator/templates/sistema-axiomatico.mdx`<br>`.auxiliary/.opencode/skills/antigravity/templates/sistema-axiomatico.mdx` |
| 12 | `.auxiliary/.opencode/package.json`<br>`.opencode/package.json` |

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
