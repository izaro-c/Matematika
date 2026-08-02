export type {
  DiagramSceneBag,
  DiagramDependencyEdge,
  DiagramDependencyGraph,
  PlannedSceneItem,
} from '@/diagrams/geometry/layout/sceneTypes';
export { resolveStepSceneAppearance } from '@/diagrams/geometry/layout/sceneTypes';

export {
  resolvePointCoordinates,
  expressionVariables,
  angleMeasureRadians,
  supportElements,
  onSupportTargetId,
  projectPointToSupport,
} from '@/diagrams/geometry/coordinates/sceneCoordinates';

export {
  materializeSameSideConstraints,
  prepareSceneSpec,
  withMovedPoint,
  constrainPointCoordinates,
  withResolvedPointConstraints,
} from '@/diagrams/geometry/coordinates/scenePointMotion';

export {
  contentBounds,
  padBounds,
  fitViewport,
  zoomViewport,
  panViewport,
  boundsContain,
  offscreenItemIds,
  recoverViewport,
  withViewportBounds,
} from '@/diagrams/geometry/layout/sceneBounds';

export {
  dependencyDeterminesConstructionOrder,
  evaluateStepOverlayContent,
  createScenePlan,
  createSceneConstructionPlan,
  buildDependencyGraph,
  sceneRevision,
  sceneGeometryRevision,
  sceneStackRevision,
  itemLayerNumber,
  isPointItem,
} from '@/diagrams/geometry/layout/scenePlan';
