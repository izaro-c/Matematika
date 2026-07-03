/**
 * API pública del módulo de diagramas.
 *
 * Las utilidades canónicas viven en `@/features/graph/ui/MathUtils`.
 * Este barrel las re-exporta para compatibilidad con las importaciones
 * `@/widgets/diagrams` ya presentes en diagramas que aún no han sido
 * migrados al patrón MathBoard.
 */
export {
  DIAGRAM_THEME_TOKENS,
  getDiagramColor,
  getCSSVar,
  isDiagramTargetActive,
  type DiagramThemeToken,
  type DiagramTargetMatcher,
  type DiagramTargetState,
  type DiagramBoard,
  type DiagramElement,
  type DiagramElementRegistry,
} from '@/features/graph/ui/MathUtils';
