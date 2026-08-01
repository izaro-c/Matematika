/**
 * @packageDocumentation
 * Public facade for published diagram demos under `content/diagrams/`.
 *
 * Re-exports shared theme/target helpers from `@/diagrams` for demos that
 * still import `@content/diagrams` or the legacy `@content/diagrams` shim.
 *
 * Prefer importing a specific demo module
 * (`@content/diagrams/Teoremas/Pitagoras`) rather than this barrel.
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
} from '@/diagrams/core/MathUtils';
