import type {
  DiagramColorToken,
  DiagramConstraint,
  DiagramDependency,
  DiagramElement,
  DiagramGroup,
  DiagramLayer,
  DiagramPoint,
  DiagramSceneItem,
  DiagramSlider,
  DiagramStep,
  DiagramStepObjectState,
  DiagramViewport,
  DiagramVisualStyle,
} from '@/diagrams/model/schema/types';

/** Campos de escena V2 legibles (V2 o modelo de editor materializado). */
export type DiagramSceneBag = {
  points: DiagramPoint[];
  elements: DiagramElement[];
  sliders: DiagramSlider[];
  constraints?: DiagramConstraint[];
  dependencies?: DiagramDependency[];
  viewport: DiagramViewport;
  layers: DiagramLayer[];
  groups: DiagramGroup[];
  showLabels?: boolean;
  steps: DiagramStep[];
};

export interface DiagramDependencyEdge {
  sourceId: string;
  targetId: string;
  relation: 'construction' | 'expression' | 'constraint';
  constraintId?: string;
}

export interface DiagramDependencyGraph {
  nodes: string[];
  edges: DiagramDependencyEdge[];
}

export interface PlannedSceneItem {
  item: DiagramSceneItem;
  visible: boolean;
  locked: boolean;
  highlighted: boolean;
  selected: boolean;
  stepEmphasis: 'none' | 'secondary' | 'primary';
  stepEmphasisColor?: DiagramColorToken;
  /** Color efectivo del objeto en el paso activo (base o temporal). */
  color: DiagramColorToken;
  label: string;
  interactive: boolean;
  stepValue?: number;
  stepShowLabel?: boolean;
  stepDashed?: boolean;
  /** Estilo efectivo tras fusionar el base con cualquier ajuste temporal del paso. */
  style: DiagramVisualStyle;
  layerOrder: number;
  visualOrder: number;
}

export function resolveStepSceneAppearance(
  item: DiagramSceneItem,
  objectState?: DiagramStepObjectState,
): Pick<PlannedSceneItem, 'color' | 'label' | 'stepShowLabel' | 'stepDashed' | 'style'> {
  return {
    color: objectState?.color ?? item.color,
    label: objectState?.label || item.label,
    stepShowLabel: objectState?.showLabel,
    stepDashed: objectState?.dashed,
    style: { ...item.style, ...objectState?.style },
  };
}
