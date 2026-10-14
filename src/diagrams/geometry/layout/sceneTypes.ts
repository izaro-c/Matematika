import type {
  DiagramColorToken,
  DiagramStepObjectState,
  DiagramVisualStyle,
} from '@/diagrams/model/schema/types';
import type { DiagramObject } from '@/diagrams/model/schema/v3';
import type { DiagramDependencyEdge } from '@/diagrams/model/objects/references';
import { objectStyle } from '@/diagrams/model/objects/style';

export type { DiagramDependencyEdge };

export interface DiagramDependencyGraph {
  nodes: string[];
  edges: DiagramDependencyEdge[];
}

export interface PlannedSceneItem {
  item: DiagramObject;
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
  item: DiagramObject,
  objectState?: DiagramStepObjectState,
): Pick<PlannedSceneItem, 'color' | 'label' | 'stepShowLabel' | 'stepDashed' | 'style'> {
  return {
    color: objectState?.color ?? item.color,
    label: objectState?.label || item.label,
    stepShowLabel: objectState?.showLabel,
    stepDashed: objectState?.dashed,
    style: { ...objectStyle(item), ...objectState?.style },
  };
}
