import { extractMathExpressionIdentifiers } from './expressions';
import { diagramTemplateExpressions } from './infoPanels';
import type {
  DiagramConstraint,
  DiagramElement,
  DiagramElementKind,
  DiagramElementProperties,
  DiagramPoint,
  DiagramSpecV2,
  DiagramVisualStyle,
} from './types';
import { DIAGRAM_RENDERER_V2_ID, DIAGRAM_SPEC_V2_VERSION } from './types';
import type {
  AngleObject,
  AnnotationObject,
  ControlObject,
  DiagramObject,
  DiagramObjectBase,
  DiagramRelation,
  DiagramSpecV3,
  DiagramSpec,
  MarkObject,
  PathObject,
  PointObject,
  AreaObject,
  RegionObject,
} from './v3';
import { DIAGRAM_RENDERER_ID, DIAGRAM_SPEC_VERSION } from './types';

function commonFromV2(item: DiagramPoint | DiagramElement | DiagramSpecV2['sliders'][number]): Omit<DiagramObjectBase, 'objectType'> {
  return {
    id: item.id,
    label: item.label,
    color: item.color,
    layerId: item.layerId,
    order: item.order,
    visible: item.visible,
    ...(item.visibleWhen ? { visibleWhen: item.visibleWhen } : {}),
    locked: item.locked,
    groupIds: [...item.groupIds],
    selection: { ...item.selection },
    target: item.target,
    ...(item.targetId ? { targetId: item.targetId } : {}),
  };
}

function styleValue<T extends keyof DiagramVisualStyle>(style: DiagramVisualStyle | undefined, key: T): DiagramVisualStyle[T] {
  return style?.[key];
}

function pointDefinitionFromV2(point: DiagramPoint, constraints: readonly DiagramConstraint[]): PointObject['definition'] {
  const midpoint = constraints.find(item => item.kind === 'midpoint' && item.refs[0] === point.id);
  if (midpoint) return { type: 'midpoint', points: [midpoint.refs[1], midpoint.refs[2]] };
  if (point.constraint === 'derived' && point.xExpression && point.yExpression) {
    return { type: 'expression', x: point.xExpression, y: point.yExpression, fallback: [point.x, point.y] };
  }
  return { type: 'coordinates', x: point.x, y: point.y };
}

function pointMobilityFromV2(point: DiagramPoint, definition: PointObject['definition']): PointObject['mobility'] {
  if (definition.type !== 'coordinates') return { type: 'fixed' };
  if (point.constraint === 'horizontal') return { type: 'axis-x', coordinate: point.y };
  if (point.constraint === 'vertical') return { type: 'axis-y', coordinate: point.x };
  if (point.constraint === 'glider' && point.gliderTarget) return { type: 'on-support', support: point.gliderTarget };
  if (point.constraint === 'constrained') return { type: 'constrained', relationIds: [...(point.constraintIds ?? [])] };
  return point.fixed || point.constraint === 'fixed' ? { type: 'fixed' } : { type: 'free' };
}

function pointFromV2(point: DiagramPoint, constraints: readonly DiagramConstraint[]): PointObject {
  const definition = pointDefinitionFromV2(point, constraints);
  return {
    ...commonFromV2(point),
    objectType: 'point',
    definition,
    mobility: pointMobilityFromV2(point, definition),
    appearance: {
      ...(point.showLabel !== undefined ? { labelVisible: point.showLabel } : {}),
      ...(styleValue(point.style, 'pointSize') !== undefined ? { size: styleValue(point.style, 'pointSize') } : {}),
      ...(styleValue(point.style, 'labelOffset') ? { labelOffset: styleValue(point.style, 'labelOffset') } : {}),
      ...(styleValue(point.style, 'labelPosition') !== undefined ? { labelPosition: styleValue(point.style, 'labelPosition') } : {}),
      ...(styleValue(point.style, 'labelSize') !== undefined ? { labelSize: styleValue(point.style, 'labelSize') } : {}),
      ...(styleValue(point.style, 'strokeOpacity') !== undefined ? { opacity: styleValue(point.style, 'strokeOpacity') } : {}),
      ...(styleValue(point.style, 'highlightPointSize') !== undefined ? { highlightSize: styleValue(point.style, 'highlightPointSize') } : {}),
      ...(styleValue(point.style, 'highlightVisible') !== undefined ? { highlightVisible: styleValue(point.style, 'highlightVisible') } : {}),
      ...(styleValue(point.style, 'preserveColorOnHighlight') !== undefined ? { preserveColorOnHighlight: styleValue(point.style, 'preserveColorOnHighlight') } : {}),
    },
    interaction: {
      ...(point.snapToGrid !== undefined ? { snapToGrid: point.snapToGrid } : {}),
      ...(point.snapSize !== undefined ? { snapSize: point.snapSize } : {}),
      ...(point.attractorIds ? { attractorIds: [...point.attractorIds] } : {}),
      ...(point.attractorDistance !== undefined ? { attractorDistance: point.attractorDistance } : {}),
      ...(point.snatchDistance !== undefined ? { snatchDistance: point.snatchDistance } : {}),
    },
  };
}

function constructedPointDefinition(element: DiagramElement): PointObject['definition'] {
  if (element.kind === 'intersection') {
    return {
      type: 'intersection',
      supports: [element.refs[0], element.refs[1]],
      ...(element.properties?.restrictToSupports ? { restrictToSupports: true } : {}),
    };
  }
  if (element.kind === 'midpoint') return { type: 'midpoint', points: [element.refs[0], element.refs[1]] };
  return { type: 'projection', point: element.refs[2] ?? element.refs[0], support: { points: [element.refs[0], element.refs[1]] } };
}

function constructedPointFromV2(element: DiagramElement): PointObject {
  return {
    ...commonFromV2(element),
    objectType: 'point',
    ...(element.properties?.visibleWhen ? { visibleWhen: element.properties.visibleWhen } : {}),
    definition: constructedPointDefinition(element),
    mobility: { type: 'fixed' },
    appearance: {
      ...(element.showLabel !== undefined ? { labelVisible: element.showLabel } : {}),
      ...(styleValue(element.style, 'pointSize') !== undefined ? { size: styleValue(element.style, 'pointSize') } : {}),
      ...(styleValue(element.style, 'labelOffset') ? { labelOffset: styleValue(element.style, 'labelOffset') } : {}),
      ...(styleValue(element.style, 'labelPosition') !== undefined ? { labelPosition: styleValue(element.style, 'labelPosition') } : {}),
      ...(styleValue(element.style, 'labelSize') !== undefined ? { labelSize: styleValue(element.style, 'labelSize') } : {}),
      ...(styleValue(element.style, 'highlightPointSize') !== undefined ? { highlightSize: styleValue(element.style, 'highlightPointSize') } : {}),
      ...(styleValue(element.style, 'highlightVisible') !== undefined ? { highlightVisible: styleValue(element.style, 'highlightVisible') } : {}),
      ...(styleValue(element.style, 'preserveColorOnHighlight') !== undefined ? { preserveColorOnHighlight: styleValue(element.style, 'preserveColorOnHighlight') } : {}),
    },
  };
}

function pathAppearance(element: DiagramElement): PathObject['appearance'] {
  return {
    ...(element.dashed !== undefined ? { dashed: element.dashed } : {}),
    ...(element.showLabel !== undefined ? { labelVisible: element.showLabel } : {}),
    ...(styleValue(element.style, 'strokeWidth') !== undefined ? { strokeWidth: styleValue(element.style, 'strokeWidth') } : {}),
    ...(styleValue(element.style, 'strokeOpacity') !== undefined ? { strokeOpacity: styleValue(element.style, 'strokeOpacity') } : {}),
    ...(styleValue(element.style, 'fillOpacity') !== undefined ? { fillOpacity: styleValue(element.style, 'fillOpacity') } : {}),
    ...(styleValue(element.style, 'labelOffset') ? { labelOffset: styleValue(element.style, 'labelOffset') } : {}),
    ...(styleValue(element.style, 'labelPosition') !== undefined ? { labelPosition: styleValue(element.style, 'labelPosition') } : {}),
    ...(styleValue(element.style, 'labelSize') !== undefined ? { labelSize: styleValue(element.style, 'labelSize') } : {}),
    ...(styleValue(element.style, 'highlightStrokeWidth') !== undefined ? { highlightStrokeWidth: styleValue(element.style, 'highlightStrokeWidth') } : {}),
    ...(styleValue(element.style, 'highlightFillOpacity') !== undefined ? { highlightFillOpacity: styleValue(element.style, 'highlightFillOpacity') } : {}),
    ...(styleValue(element.style, 'highlightVisible') !== undefined ? { highlightVisible: styleValue(element.style, 'highlightVisible') } : {}),
    ...(styleValue(element.style, 'preserveColorOnHighlight') !== undefined ? { preserveColorOnHighlight: styleValue(element.style, 'preserveColorOnHighlight') } : {}),
  };
}

function pathFromV2(element: DiagramElement): PathObject {
  const props = element.properties;
  let geometry: PathObject['geometry'];
  switch (element.kind) {
    case 'segment': geometry = { type: 'segment', points: [element.refs[0], element.refs[1]] }; break;
    case 'baseExtension': geometry = { type: 'segment', points: [element.refs[0], element.refs[1]], construction: { type: 'base-extension', foot: element.refs[2] } }; break;
    case 'line': geometry = { type: 'line', construction: { type: 'through-points', points: [element.refs[0], element.refs[1]] } }; break;
    case 'perpendicular': geometry = { type: 'line', construction: { type: 'perpendicular', linePoints: [element.refs[0], element.refs[1]], through: element.refs[2] } }; break;
    case 'parallel': geometry = { type: 'line', construction: { type: 'parallel', linePoints: [element.refs[0], element.refs[1]], through: element.refs[2] } }; break;
    case 'angleBisector': geometry = { type: 'line', construction: { type: 'angle-bisector', points: [element.refs[0], element.refs[1], element.refs[2]] } }; break;
    case 'ray': geometry = { type: 'ray', points: [element.refs[0], element.refs[1]] }; break;
    case 'polygon': geometry = { type: 'polygon', points: element.refs as [string, string, string, ...string[]] }; break;
    case 'circle': geometry = { type: 'circle', center: element.refs[0], point: element.refs[1] }; break;
    case 'arc': geometry = { type: 'arc', points: [element.refs[0], element.refs[1], element.refs[2]], direction: props?.clockwise ? 'clockwise' : 'counterclockwise' }; break;
    case 'functionCurve': geometry = {
      type: 'function',
      expression: props?.expression ?? '0',
      variable: props?.parameter ?? 'x',
      domain: props?.domain ?? [-5, 5],
      samples: props?.samples ?? 64,
      ...(props?.areaFill ? { areaFill: props.areaFill } : {}),
      ...(element.refs[0] ? { areaSide: element.refs[0] } : {}),
    }; break;
    case 'parametricCurve': geometry = {
      type: 'parametric',
      x: props?.xExpression ?? 't',
      y: props?.yExpression ?? '0',
      parameter: props?.parameter ?? 't',
      domain: props?.domain ?? [0, 1],
      samples: props?.samples ?? 64,
      ...(props?.areaFill ? { areaFill: props.areaFill } : {}),
      ...(element.refs[0] ? { areaSide: element.refs[0] } : {}),
    }; break;
    case 'poincareGeodesic': geometry = { type: 'poincare-geodesic', refs: element.refs as [string, string, string, string] }; break;
    case 'poincareArc': geometry = { type: 'poincare-arc', refs: element.refs as [string, string, string, string] }; break;
    default: geometry = { type: 'dimension', points: [element.refs[0], element.refs[1]], ...(props?.offset !== undefined ? { offset: props.offset } : {}) };
  }
  return {
    ...commonFromV2(element),
    objectType: 'path',
    ...(props?.visibleWhen ? { visibleWhen: props.visibleWhen } : {}),
    geometry,
    appearance: pathAppearance(element),
  };
}

function angleAppearanceFromV2(element: DiagramElement): AngleObject['appearance'] {
  return {
    ...(styleValue(element.style, 'angleRadius') !== undefined ? { radius: styleValue(element.style, 'angleRadius') } : {}),
    ...(styleValue(element.style, 'strokeWidth') !== undefined ? { strokeWidth: styleValue(element.style, 'strokeWidth') } : {}),
    ...(styleValue(element.style, 'strokeOpacity') !== undefined ? { strokeOpacity: styleValue(element.style, 'strokeOpacity') } : {}),
    ...(styleValue(element.style, 'fillOpacity') !== undefined ? { fillOpacity: styleValue(element.style, 'fillOpacity') } : {}),
    ...(element.showLabel !== undefined ? { labelVisible: element.showLabel } : {}),
    ...(styleValue(element.style, 'labelOffset') ? { labelOffset: styleValue(element.style, 'labelOffset') } : {}),
    ...(styleValue(element.style, 'labelPosition') !== undefined ? { labelPosition: styleValue(element.style, 'labelPosition') } : {}),
    ...(styleValue(element.style, 'labelSize') !== undefined ? { labelSize: styleValue(element.style, 'labelSize') } : {}),
    ...(styleValue(element.style, 'highlightStrokeWidth') !== undefined ? { highlightStrokeWidth: styleValue(element.style, 'highlightStrokeWidth') } : {}),
    ...(styleValue(element.style, 'highlightFillOpacity') !== undefined ? { highlightFillOpacity: styleValue(element.style, 'highlightFillOpacity') } : {}),
    ...(styleValue(element.style, 'highlightVisible') !== undefined ? { highlightVisible: styleValue(element.style, 'highlightVisible') } : {}),
    ...(styleValue(element.style, 'preserveColorOnHighlight') !== undefined ? { preserveColorOnHighlight: styleValue(element.style, 'preserveColorOnHighlight') } : {}),
  };
}

function angleFromV2(element: DiagramElement): AngleObject {
  const direction = element.properties?.clockwise === undefined
    ? {}
    : { direction: element.properties.clockwise ? 'clockwise' as const : 'counterclockwise' as const };
  return {
    ...commonFromV2(element),
    objectType: 'angle',
    ...(element.properties?.visibleWhen ? { visibleWhen: element.properties.visibleWhen } : {}),
    points: [element.refs[0], element.refs[1], element.refs[2]],
    sweep: element.kind === 'angle' ? 'directed' : 'non-reflex',
    ...direction,
    marker: element.kind === 'rightAngle' || element.kind === 'perpendicularMark' ? 'square' : 'arc',
    appearance: angleAppearanceFromV2(element),
  };
}

function markVariant(kind: DiagramElementKind): MarkObject['variant'] {
  if (kind === 'congruenceMark') return 'congruence';
  if (kind === 'parallelMark') return 'parallel';
  return 'graduation';
}

function markFromV2(element: DiagramElement): MarkObject {
  const props = element.properties;
  return {
    ...commonFromV2(element),
    objectType: 'mark',
    ...(props?.visibleWhen ? { visibleWhen: props.visibleWhen } : {}),
    variant: markVariant(element.kind),
    anchor: element.kind === 'measureTicks'
      ? { type: 'path', path: element.refs[0] }
      : { type: 'between-points', points: [element.refs[0], element.refs[1]] },
    count: props?.markCount ?? 1,
    ...(styleValue(element.style, 'markHeight') !== undefined ? { height: styleValue(element.style, 'markHeight') } : {}),
    ...(props?.tickDistance !== undefined ? { spacing: props.tickDistance } : {}),
    ...(props?.tickDistanceExpression ? { spacingExpression: props.tickDistanceExpression } : {}),
    ...(props?.minorTickCount !== undefined ? { subdivisions: props.minorTickCount } : {}),
    appearance: {
      ...(styleValue(element.style, 'strokeWidth') !== undefined ? { strokeWidth: styleValue(element.style, 'strokeWidth') } : {}),
      ...(styleValue(element.style, 'strokeOpacity') !== undefined ? { strokeOpacity: styleValue(element.style, 'strokeOpacity') } : {}),
      ...(styleValue(element.style, 'preserveColorOnHighlight') !== undefined ? { preserveColorOnHighlight: styleValue(element.style, 'preserveColorOnHighlight') } : {}),
    },
  };
}

function annotationVariant(kind: DiagramElementKind): AnnotationObject['variant'] {
  if (kind === 'infoPanel') return 'panel';
  if (kind === 'measurement') return 'measurement';
  if (kind === 'formula') return 'formula';
  if (kind === 'label') return 'label';
  return 'text';
}

function annotationAnchorFromV2(element: DiagramElement): AnnotationObject['anchor'] {
  const props = element.properties;
  if (props?.anchorMode === 'viewport') {
    return { type: 'viewport', position: props.viewportPosition ?? [0.5, 0.5] };
  }
  return {
    type: 'object', object: element.refs[0],
    ...(props?.anchorParameter !== undefined ? { parameter: props.anchorParameter } : {}),
    ...(element.style?.textOffset ? { offset: element.style.textOffset } : {}),
  };
}

function annotationContentFromV2(element: DiagramElement): AnnotationObject['content'] {
  const props = element.properties;
  return {
    text: element.text ?? '',
    ...(props?.expression ? { expression: props.expression } : {}),
    ...(props?.unit ? { unit: props.unit } : {}),
    ...(props?.precision !== undefined ? { precision: props.precision } : {}),
    ...(props?.textRules ? { rules: props.textRules } : {}),
    ...(props?.title ? { title: props.title } : {}),
    ...(props?.infoPanelBlocks ? { blocks: props.infoPanelBlocks } : {}),
    ...(props?.infoPanelLayout ? { layout: props.infoPanelLayout } : {}),
  };
}

function annotationMeasurementFromV2(element: DiagramElement): AnnotationObject['measurement'] {
  if (element.refs.length >= 2) return { refs: [element.refs[0], element.refs[1]], mode: 'distance' };
  return { refs: [element.refs[0]], mode: 'value' };
}

function annotationFromV2(element: DiagramElement): AnnotationObject {
  const props = element.properties;
  const variant = annotationVariant(element.kind);
  return {
    ...commonFromV2(element),
    objectType: 'annotation',
    ...(props?.visibleWhen ? { visibleWhen: props.visibleWhen } : {}),
    variant,
    content: annotationContentFromV2(element),
    anchor: annotationAnchorFromV2(element),
    ...(variant === 'measurement' ? { measurement: annotationMeasurementFromV2(element) } : {}),
    appearance: {
      ...(styleValue(element.style, 'labelSize') !== undefined ? { fontSize: styleValue(element.style, 'labelSize') } : {}),
      ...(styleValue(element.style, 'strokeOpacity') !== undefined ? { opacity: styleValue(element.style, 'strokeOpacity') } : {}),
      ...(styleValue(element.style, 'preserveColorOnHighlight') !== undefined ? { preserveColorOnHighlight: styleValue(element.style, 'preserveColorOnHighlight') } : {}),
    },
  };
}

function regionGeometryFromV2(element: DiagramElement): RegionObject['geometry'] {
  const props = element.properties;
  if (element.kind === 'grid') {
    return {
      type: 'grid-region',
      points: element.refs as [string, string, string, string],
      rows: props?.rows ?? 1,
      columns: props?.columns ?? 1,
    };
  }
  return {
    type: 'area-decomposition',
    points: element.refs as [string, string, string, ...string[]],
    ...(props?.rows !== undefined ? { rows: props.rows } : {}),
    ...(props?.columns !== undefined ? { columns: props.columns } : {}),
  };
}

function regionFromV2(element: DiagramElement): RegionObject {
  const props = element.properties;
  return {
    ...commonFromV2(element),
    objectType: 'region',
    ...(props?.visibleWhen ? { visibleWhen: props.visibleWhen } : {}),
    geometry: regionGeometryFromV2(element),
    appearance: {
      ...(styleValue(element.style, 'strokeWidth') !== undefined ? { strokeWidth: styleValue(element.style, 'strokeWidth') } : {}),
      ...(styleValue(element.style, 'strokeOpacity') !== undefined ? { strokeOpacity: styleValue(element.style, 'strokeOpacity') } : {}),
      ...(styleValue(element.style, 'fillOpacity') !== undefined ? { fillOpacity: styleValue(element.style, 'fillOpacity') } : {}),
      ...(styleValue(element.style, 'highlightFillOpacity') !== undefined ? { highlightFillOpacity: styleValue(element.style, 'highlightFillOpacity') } : {}),
      ...(styleValue(element.style, 'preserveColorOnHighlight') !== undefined ? { preserveColorOnHighlight: styleValue(element.style, 'preserveColorOnHighlight') } : {}),
    },
  };
}

function areaGeometryFromV2(element: DiagramElement): AreaObject['geometry'] {
  if (element.kind === 'halfPlane') {
    return { type: 'half-plane', boundary: [element.refs[0], element.refs[1]], side: element.refs[2] };
  }
  return { type: 'intersection', areas: element.refs as [string, string, ...string[]] };
}

function areaFromV2(element: DiagramElement): AreaObject {
  return {
    ...commonFromV2(element),
    objectType: 'area',
    ...(element.properties?.visibleWhen ? { visibleWhen: element.properties.visibleWhen } : {}),
    geometry: areaGeometryFromV2(element),
    appearance: {
      ...(styleValue(element.style, 'strokeWidth') !== undefined ? { strokeWidth: styleValue(element.style, 'strokeWidth') } : {}),
      ...(styleValue(element.style, 'strokeOpacity') !== undefined ? { strokeOpacity: styleValue(element.style, 'strokeOpacity') } : {}),
      ...(styleValue(element.style, 'fillOpacity') !== undefined ? { fillOpacity: styleValue(element.style, 'fillOpacity') } : {}),
      ...(styleValue(element.style, 'highlightFillOpacity') !== undefined ? { highlightFillOpacity: styleValue(element.style, 'highlightFillOpacity') } : {}),
      ...(styleValue(element.style, 'preserveColorOnHighlight') !== undefined ? { preserveColorOnHighlight: styleValue(element.style, 'preserveColorOnHighlight') } : {}),
    },
  };
}

const areaKinds = new Set<DiagramElementKind>(['halfPlane', 'areaIntersection']);
const pathKinds = new Set<DiagramElementKind>(['segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve', 'poincareGeodesic', 'poincareArc', 'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'dimensionLine']);
const angleKinds = new Set<DiagramElementKind>(['angle', 'nonReflexAngle', 'rightAngle', 'perpendicularMark']);
const markKinds = new Set<DiagramElementKind>(['congruenceMark', 'parallelMark', 'measureTicks']);
const annotationKinds = new Set<DiagramElementKind>(['text', 'label', 'formula', 'infoPanel', 'measurement']);

function objectFromElement(element: DiagramElement): DiagramObject {
  if (['intersection', 'midpoint', 'perpendicularFoot'].includes(element.kind)) return constructedPointFromV2(element);
  if (pathKinds.has(element.kind)) return pathFromV2(element);
  if (angleKinds.has(element.kind)) return angleFromV2(element);
  if (markKinds.has(element.kind)) return markFromV2(element);
  if (annotationKinds.has(element.kind)) return annotationFromV2(element);
  if (areaKinds.has(element.kind)) return areaFromV2(element);
  return regionFromV2(element);
}

function relationFromConstraint(constraint: DiagramConstraint, spec: DiagramSpecV2): DiagramRelation | null {
  const base = { id: constraint.id, label: constraint.label, enabled: constraint.enabled };
  switch (constraint.kind) {
    case 'fixed': case 'midpoint': return null;
    case 'horizontal': return { ...base, type: 'coordinate-equality', axis: 'y', points: [constraint.refs[0], constraint.refs[1]] };
    case 'vertical': return { ...base, type: 'coordinate-equality', axis: 'x', points: [constraint.refs[0], constraint.refs[1]] };
    case 'coincident': return { ...base, type: 'coincident', points: [constraint.refs[0], constraint.refs[1]] };
    case 'on': return { ...base, type: 'on-support', point: constraint.refs[0], support: constraint.refs[1] };
    case 'distance': return { ...base, type: 'distance', points: [constraint.refs[0], constraint.refs[1]], ...(constraint.value !== undefined ? { value: constraint.value } : {}), ...(constraint.expression ? { expression: constraint.expression } : {}) };
    case 'equalLength': {
      const target = spec.elements.find(element => element.kind === 'segment' && element.refs.includes(constraint.refs[0]) && element.refs.includes(constraint.refs[1]));
      return { ...base, type: 'equal-length', segments: [target?.id ?? constraint.refs[1], constraint.refs[2]], drivenPoint: constraint.refs[0] };
    }
    case 'equalAngle': return { ...base, type: 'equal-angle', angles: [constraint.refs[4], constraint.refs[3]], drivenPoint: constraint.refs[0] };
    case 'perpendicular': return { ...base, type: 'perpendicular', supports: [[constraint.refs[0], constraint.refs[1]], [constraint.refs[0], constraint.refs[2]]] };
    case 'parallel': return { ...base, type: 'parallel', supports: [[constraint.refs[0], constraint.refs[1]], [constraint.refs[0], constraint.refs[2]]] };
    case 'insideDisk': return { ...base, type: 'inside-disk', point: constraint.refs[0], disk: { center: constraint.refs[1], boundary: constraint.refs[2] } };
    case 'sameSide': return { ...base, type: 'same-half-plane', points: [constraint.refs[0], constraint.refs[1]], boundary: constraint.refs[2] };
    case 'insideArea': return {
      ...base,
      type: 'inside-area',
      point: constraint.refs[0],
      area: constraint.refs[1],
      ...(constraint.areaMembership && constraint.areaMembership !== 'interior' ? { membership: constraint.areaMembership } : {}),
    };
    case 'reflection': return { ...base, type: 'reflection', refs: [...constraint.refs] };
    case 'expression': return { ...base, type: 'expression', refs: [...constraint.refs], expression: constraint.expression ?? '0', ...(constraint.value !== undefined ? { value: constraint.value } : {}) };
  }
}

export function migrateDiagramSpecV2ToV3(spec: DiagramSpecV2): DiagramSpecV3 {
  const constraints = spec.constraints ?? [];
  const objects: DiagramObject[] = [
    ...spec.points.map(point => pointFromV2(point, constraints)),
    ...spec.elements.map(objectFromElement),
    ...spec.sliders.map<ControlObject>(slider => ({
      ...commonFromV2(slider),
      objectType: 'control',
      variant: 'slider',
      position: [slider.x, slider.y],
      range: { min: slider.min, max: slider.max, ...(slider.maxExpression ? { maxExpression: slider.maxExpression } : {}), step: slider.step },
      value: slider.value,
    })),
  ];
  const relations = constraints.map(constraint => relationFromConstraint(constraint, spec)).filter((relation): relation is DiagramRelation => relation !== null);
  objects.forEach(object => {
    if (object.objectType !== 'point' || object.mobility.type !== 'on-support') return;
    const supportId = object.mobility.support;
    const support = objects.find(candidate => candidate.id === supportId);
    if (support?.objectType !== 'point') return;
    const relationId = `${object.id}-coincident-${support.id}`;
    object.mobility = { type: 'constrained', relationIds: [relationId] };
    relations.push({ id: relationId, label: `${object.label} coincide con ${support.label}`, type: 'coincident', points: [object.id, support.id], enabled: true });
  });
  objects.forEach(object => {
    if (object.objectType !== 'angle' || object.marker !== 'square') return;
    const relationId = `${object.id}-perpendicular`;
    object.perpendicularRelationId = relationId;
    if (!relations.some(relation => relation.id === relationId)) relations.push({
      id: relationId,
      label: `Perpendicularidad de ${object.label}`,
      type: 'perpendicular',
      supports: [[object.points[1], object.points[0]], [object.points[1], object.points[2]]],
      enabled: true,
    });
  });
  return {
    version: DIAGRAM_SPEC_VERSION,
    renderer: DIAGRAM_RENDERER_ID,
    title: spec.title,
    componentId: spec.componentId,
    category: spec.category,
    mode: spec.mode,
    axis: spec.axis,
    grid: spec.grid,
    ...(spec.showLabels !== undefined ? { showLabels: spec.showLabels } : {}),
    ...(spec.header ? { header: structuredClone(spec.header) } : {}),
    viewport: structuredClone(spec.viewport),
    layers: structuredClone(spec.layers).map(({ extensions: _extensions, ...layer }) => layer),
    groups: structuredClone(spec.groups).map(({ extensions: _extensions, ...group }) => group),
    objects,
    relations,
    steps: structuredClone(spec.steps).map(({ extensions: _extensions, ...step }) => step),
    note: spec.note,
  };
}

function commonToV2(object: DiagramObject): Omit<DiagramElement, 'kind' | 'refs'> {
  return {
    id: object.id, label: object.label, color: object.color, layerId: object.layerId, order: object.order,
    visible: object.visible, locked: object.locked, groupIds: [...object.groupIds], selection: { ...object.selection },
    target: object.target, ...(object.targetId ? { targetId: object.targetId } : {}),
  };
}

function expressionsOf(object: DiagramObject): string[] {
  const expressions = object.visibleWhen ? [object.visibleWhen] : [];
  if (object.objectType === 'point' && object.definition.type === 'expression') expressions.push(object.definition.x, object.definition.y);
  if (object.objectType === 'path' && object.geometry.type === 'function') expressions.push(object.geometry.expression);
  if (object.objectType === 'path' && object.geometry.type === 'parametric') expressions.push(object.geometry.x, object.geometry.y);
  if (object.objectType === 'mark' && object.spacingExpression) expressions.push(object.spacingExpression);
  if (object.objectType === 'annotation') {
    expressions.push(...[
      object.content.expression,
      ...(object.content.rules ?? []).map(rule => rule.when),
      ...(object.content.blocks ?? []).flatMap(block => [block.expression, ...(block.rules ?? []).flatMap(rule => [rule.when, rule.expression])]),
    ].filter((value): value is string => Boolean(value)));
    expressions.push(...diagramTemplateExpressions(object.content.text, object.content.expression).map(entry => entry.expression));
    object.content.rules?.forEach(rule => expressions.push(...diagramTemplateExpressions(rule.text, object.content.expression).map(entry => entry.expression)));
    object.content.blocks?.forEach(block => {
      expressions.push(...diagramTemplateExpressions(block.text, block.expression).map(entry => entry.expression));
      block.rules?.forEach(rule => expressions.push(...diagramTemplateExpressions(rule.text, rule.expression ?? block.expression).map(entry => entry.expression)));
    });
  }
  if (object.objectType === 'control' && object.range.maxExpression) expressions.push(object.range.maxExpression);
  return expressions;
}

function pointDefinitionReferences(definition: PointObject['definition']): string[] {
  if (definition.type === 'intersection') return [...definition.supports];
  if (definition.type === 'midpoint') return [...definition.points];
  if (definition.type !== 'projection') return [];
  const support = typeof definition.support === 'string'
    ? [definition.support]
    : [...definition.support.points];
  return [definition.point, ...support];
}

function dependenciesFor(objects: readonly DiagramObject[]): DiagramSpecV2['dependencies'] {
  const ids = new Set(objects.map(object => object.id));
  const keys = new Set<string>();
  const dependencies: NonNullable<DiagramSpecV2['dependencies']> = [];
  const add = (sourceId: string, targetId: string, relation: 'construction' | 'expression' | 'constraint', constraintId?: string) => {
    if (!ids.has(sourceId) || (sourceId === targetId && relation !== 'expression')) return;
    const key = `${sourceId}:${targetId}:${relation}:${constraintId ?? ''}`;
    if (keys.has(key)) return;
    keys.add(key); dependencies.push({ sourceId, targetId, relation, ...(constraintId ? { constraintId } : {}) });
  };
  objects.forEach(object => {
    if (object.objectType === 'point') {
      pointDefinitionReferences(object.definition).forEach(id => add(id, object.id, 'construction'));
    } else objectReferences(object).forEach(id => add(id, object.id, 'construction'));
    expressionsOf(object).forEach(source => {
      try { extractMathExpressionIdentifiers(source).map(id => id.split('.')[0]).forEach(id => add(id, object.id, 'expression')); } catch { /* schema reports invalid expressions */ }
    });
    if (object.objectType === 'point') object.interaction?.attractorIds?.forEach(id => add(id, object.id, 'constraint'));
  });
  return dependencies;
}

function pathReferences(object: PathObject): string[] {
  const geometry = object.geometry;
  if (geometry.type === 'segment') {
    return [...geometry.points, ...(geometry.construction ? [geometry.construction.foot] : [])];
  }
  if (geometry.type === 'line') {
    const construction = geometry.construction;
    if (construction.type === 'through-points') return [...construction.points];
    if (construction.type === 'angle-bisector') return [...construction.points];
    return [...construction.linePoints, construction.through];
  }
  if ('points' in geometry) return [...geometry.points];
  if ('center' in geometry) return [geometry.center, geometry.point];
  if ('refs' in geometry) return [...geometry.refs];
  if (geometry.type === 'function' || geometry.type === 'parametric') {
    return geometry.areaSide ? [geometry.areaSide] : [];
  }
  return [];
}

export function objectReferences(object: DiagramObject): string[] {
  if (object.objectType === 'point') {
    const mobilityRefs = object.mobility.type === 'on-support' ? [object.mobility.support] : [];
    return [...pointDefinitionReferences(object.definition), ...mobilityRefs, ...(object.interaction?.attractorIds ?? [])];
  }
  if (object.objectType === 'path') return pathReferences(object);
  if (object.objectType === 'angle') return [...object.points];
  if (object.objectType === 'region') return [...object.geometry.points];
  if (object.objectType === 'area') {
    if (object.geometry.type === 'half-plane') return [...object.geometry.boundary, object.geometry.side];
    return [...object.geometry.areas];
  }
  if (object.objectType === 'mark') {
    return object.anchor.type === 'path' ? [object.anchor.path] : [...object.anchor.points];
  }
  if (object.objectType === 'annotation') {
    const anchorRefs = object.anchor.type === 'object' ? [object.anchor.object] : [];
    return [...anchorRefs, ...(object.measurement?.refs ?? [])];
  }
  return [];
}

type ObjectAppearance = NonNullable<Exclude<DiagramObject, ControlObject>['appearance']>;

function commonLegacyStyle(appearance: ObjectAppearance): DiagramVisualStyle {
  const result: DiagramVisualStyle = {};
  if ('strokeWidth' in appearance) result.strokeWidth = appearance.strokeWidth;
  if ('strokeOpacity' in appearance) result.strokeOpacity = appearance.strokeOpacity;
  if ('labelOffset' in appearance) result.labelOffset = appearance.labelOffset;
  if ('labelPosition' in appearance) result.labelPosition = appearance.labelPosition;
  if ('fontSize' in appearance) result.labelSize = appearance.fontSize;
  if ('labelSize' in appearance) result.labelSize = appearance.labelSize;
  if ('highlightSize' in appearance) result.highlightPointSize = appearance.highlightSize;
  if ('preserveColorOnHighlight' in appearance) result.preserveColorOnHighlight = appearance.preserveColorOnHighlight;
  return result;
}

function finishLegacyStyle(result: DiagramVisualStyle): DiagramVisualStyle | undefined {
  Object.keys(result).forEach(key => {
    if (result[key as keyof DiagramVisualStyle] === undefined) delete result[key as keyof DiagramVisualStyle];
  });
  return Object.keys(result).length > 0 ? result : undefined;
}

function legacyStyle(object: DiagramObject): DiagramVisualStyle | undefined {
  if (object.objectType === 'control' || !object.appearance) return undefined;
  const result = commonLegacyStyle(object.appearance);
  if (object.objectType === 'point') {
    result.pointSize = object.appearance.size;
    result.highlightVisible = object.appearance.highlightVisible;
  }
  if (object.objectType === 'path') {
    result.fillOpacity = object.appearance.fillOpacity;
    result.highlightStrokeWidth = object.appearance.highlightStrokeWidth;
    result.highlightFillOpacity = object.appearance.highlightFillOpacity;
    result.highlightVisible = object.appearance.highlightVisible;
  }
  if (object.objectType === 'angle') {
    result.fillOpacity = object.appearance.fillOpacity;
    result.angleRadius = object.appearance.radius;
    result.highlightStrokeWidth = object.appearance.highlightStrokeWidth;
    result.highlightFillOpacity = object.appearance.highlightFillOpacity;
    result.highlightVisible = object.appearance.highlightVisible;
  }
  if (object.objectType === 'region') {
    result.fillOpacity = object.appearance.fillOpacity;
    result.highlightFillOpacity = object.appearance.highlightFillOpacity;
  }
  if (object.objectType === 'area') {
    result.fillOpacity = object.appearance.fillOpacity;
    result.highlightFillOpacity = object.appearance.highlightFillOpacity;
  }
  if (object.objectType === 'mark') result.markHeight = object.height;
  if (object.objectType === 'annotation' && object.anchor.type === 'object') result.textOffset = object.anchor.offset;
  return finishLegacyStyle(result);
}

function pointConstraintToV2(object: PointObject): DiagramPoint['constraint'] {
  if (object.definition.type === 'expression') return 'derived';
  switch (object.mobility.type) {
    case 'axis-x': return 'horizontal';
    case 'axis-y': return 'vertical';
    case 'on-support': return 'glider';
    case 'constrained': return 'constrained';
    default: return object.mobility.type;
  }
}

function pointToV2(object: PointObject): DiagramPoint | null {
  if (object.definition.type === 'intersection' || object.definition.type === 'midpoint' || object.definition.type === 'projection') return null;
  const coordinates = object.definition.type === 'coordinates' ? [object.definition.x, object.definition.y] : object.definition.fallback;
  return {
    ...commonToV2(object), x: coordinates[0], y: coordinates[1], fixed: object.mobility.type === 'fixed' || object.definition.type === 'expression', constraint: pointConstraintToV2(object),
    ...(object.visibleWhen ? { visibleWhen: object.visibleWhen } : {}),
    ...(object.appearance?.labelVisible !== undefined ? { showLabel: object.appearance.labelVisible } : {}),
    ...(object.mobility.type === 'on-support' ? { gliderTarget: object.mobility.support } : {}),
    ...(object.definition.type === 'expression' ? { xExpression: object.definition.x, yExpression: object.definition.y, dependencies: [] } : {}),
    ...(object.mobility.type === 'constrained' ? { constraintIds: [...object.mobility.relationIds] } : {}),
    ...(object.interaction ? { ...object.interaction } : {}),
    ...(legacyStyle(object) ? { style: legacyStyle(object) } : {}),
  };
}

function pathKindToV2(object: PathObject): DiagramElementKind {
  const geometry = object.geometry;
  if (geometry.type === 'segment') return geometry.construction ? 'baseExtension' : 'segment';
  if (geometry.type !== 'line') {
    const kinds: Record<Exclude<typeof geometry.type, 'segment' | 'line'>, DiagramElementKind> = {
      ray: 'ray', polygon: 'polygon', circle: 'circle', arc: 'arc', function: 'functionCurve',
      parametric: 'parametricCurve', 'poincare-geodesic': 'poincareGeodesic',
      'poincare-arc': 'poincareArc', dimension: 'dimensionLine',
    };
    return kinds[geometry.type];
  }
  const kinds: Record<typeof geometry.construction.type, DiagramElementKind> = {
    'through-points': 'line', perpendicular: 'perpendicular', parallel: 'parallel', 'angle-bisector': 'angleBisector',
  };
  return kinds[geometry.construction.type];
}

function pathPropertiesToV2(object: PathObject): DiagramElementProperties | undefined {
  const properties: DiagramElementProperties = {};
  const geometry = object.geometry;
  if (geometry.type === 'arc') properties.clockwise = geometry.direction === 'clockwise';
  if (geometry.type === 'function') Object.assign(properties, {
    expression: geometry.expression, parameter: geometry.variable, domain: geometry.domain, samples: geometry.samples,
    ...(geometry.areaFill ? { areaFill: geometry.areaFill } : {}),
  });
  if (geometry.type === 'parametric') Object.assign(properties, {
    xExpression: geometry.x, yExpression: geometry.y, parameter: geometry.parameter, domain: geometry.domain, samples: geometry.samples,
    ...(geometry.areaFill ? { areaFill: geometry.areaFill } : {}),
  });
  if (geometry.type === 'dimension' && geometry.offset !== undefined) properties.offset = geometry.offset;
  if (object.visibleWhen) properties.visibleWhen = object.visibleWhen;
  return Object.keys(properties).length > 0 ? properties : undefined;
}

function pathToElement(object: PathObject): DiagramElement {
  const base = commonToV2(object);
  const style = legacyStyle(object);
  const properties = pathPropertiesToV2(object);
  return {
    ...base, kind: pathKindToV2(object), refs: pathReferences(object),
    ...(object.appearance?.dashed !== undefined ? { dashed: object.appearance.dashed } : {}),
    ...(object.appearance?.labelVisible !== undefined ? { showLabel: object.appearance.labelVisible } : {}),
    ...(properties ? { properties } : {}), ...(style ? { style } : {}),
  };
}

function angleKindToV2(object: AngleObject): DiagramElementKind {
  if (object.marker === 'square') return 'rightAngle';
  return object.sweep === 'directed' ? 'angle' : 'nonReflexAngle';
}

function angleToElement(object: AngleObject): DiagramElement {
  const style = legacyStyle(object);
  return {
    ...commonToV2(object), kind: angleKindToV2(object), refs: [...object.points],
    ...(object.appearance?.labelVisible !== undefined ? { showLabel: object.appearance.labelVisible } : {}),
    properties: {
      ...(object.visibleWhen ? { visibleWhen: object.visibleWhen } : {}),
      ...(object.direction ? { clockwise: object.direction === 'clockwise' } : {}),
    },
    ...(style ? { style } : {}),
  };
}

function areaToElement(object: AreaObject): DiagramElement {
  const style = legacyStyle(object);
  const kind: DiagramElementKind = object.geometry.type === 'half-plane' ? 'halfPlane' : 'areaIntersection';
  const refs = object.geometry.type === 'half-plane'
    ? [...object.geometry.boundary, object.geometry.side]
    : [...object.geometry.areas];
  return {
    ...commonToV2(object), kind, refs,
    properties: { ...(object.visibleWhen ? { visibleWhen: object.visibleWhen } : {}) },
    ...(style ? { style } : {}),
  };
}

function regionToElement(object: RegionObject): DiagramElement {
  const style = legacyStyle(object);
  const kind = object.geometry.type === 'grid-region' ? 'grid' : 'areaDecomposition';
  return {
    ...commonToV2(object), kind, refs: [...object.geometry.points],
    properties: { rows: object.geometry.rows, columns: object.geometry.columns, ...(object.visibleWhen ? { visibleWhen: object.visibleWhen } : {}) },
    ...(style ? { style } : {}),
  };
}

function markKindToV2(object: MarkObject): DiagramElementKind {
  if (object.variant === 'congruence') return 'congruenceMark';
  if (object.variant === 'parallel') return 'parallelMark';
  return 'measureTicks';
}

function markToElement(object: MarkObject): DiagramElement {
  const properties: DiagramElementProperties = {
    ...(object.variant !== 'graduation' ? { markCount: object.count } : {}),
    ...(object.spacing !== undefined ? { tickDistance: object.spacing } : {}),
    ...(object.spacingExpression ? { tickDistanceExpression: object.spacingExpression } : {}),
    ...(object.subdivisions !== undefined ? { minorTickCount: object.subdivisions } : {}),
    ...(object.visibleWhen ? { visibleWhen: object.visibleWhen } : {}),
  };
  const refs = object.anchor.type === 'path' ? [object.anchor.path] : [...object.anchor.points];
  const style = legacyStyle(object);
  return {
    ...commonToV2(object), kind: markKindToV2(object), refs,
    ...(Object.keys(properties).length > 0 ? { properties } : {}), ...(style ? { style } : {}),
  };
}

function annotationKindToV2(object: AnnotationObject): DiagramElementKind {
  return object.variant === 'panel' ? 'infoPanel' : object.variant;
}

function annotationToElement(object: AnnotationObject): DiagramElement {
  const base = commonToV2(object);
  const style = legacyStyle(object);
  const properties: DiagramElementProperties = { ...(object.content.expression ? { expression: object.content.expression } : {}), ...(object.content.unit ? { unit: object.content.unit } : {}), ...(object.content.precision !== undefined ? { precision: object.content.precision } : {}), ...(object.content.rules ? { textRules: object.content.rules } : {}), ...(object.content.title ? { title: object.content.title } : {}), ...(object.content.blocks ? { infoPanelBlocks: object.content.blocks } : {}), ...(object.content.layout ? { infoPanelLayout: object.content.layout } : {}), ...(object.visibleWhen ? { visibleWhen: object.visibleWhen } : {}) };
  if (object.anchor.type === 'viewport') { properties.anchorMode = 'viewport'; properties.viewportPosition = object.anchor.position; }
  else {
    properties.anchorMode = 'reference';
    if (object.anchor.parameter !== undefined) properties.anchorParameter = object.anchor.parameter;
  }
  let refs: string[] = [];
  if (object.measurement?.refs) refs = [...object.measurement.refs];
  else if (object.anchor.type === 'object') refs = [object.anchor.object];
  return { ...base, kind: annotationKindToV2(object), refs, text: object.content.text, properties, ...(style ? { style } : {}) };
}

function objectToElement(object: Exclude<DiagramObject, PointObject | ControlObject>): DiagramElement {
  switch (object.objectType) {
    case 'path': return pathToElement(object);
    case 'angle': return angleToElement(object);
    case 'region': return regionToElement(object);
    case 'area': return areaToElement(object);
    case 'mark': return markToElement(object);
    case 'annotation': return annotationToElement(object);
  }
}

function constructedPointElementBase(object: PointObject): Omit<DiagramElement, 'kind' | 'refs'> {
  const style = legacyStyle(object);
  return {
    ...commonToV2(object),
    ...(object.appearance?.labelVisible !== undefined ? { showLabel: object.appearance.labelVisible } : {}),
    ...(style ? { style } : {}),
  };
}

function projectionSupportPoints(
  definition: Extract<PointObject['definition'], { type: 'projection' }>,
  objects: readonly DiagramObject[],
): [string, string] {
  if (typeof definition.support !== 'string') return definition.support.points;
  const support = objects.find(candidate => candidate.id === definition.support);
  if (support?.objectType === 'path' && (support.geometry.type === 'segment' || support.geometry.type === 'ray')) {
    return support.geometry.points;
  }
  if (support?.objectType === 'path' && support.geometry.type === 'line' && support.geometry.construction.type === 'through-points') {
    return support.geometry.construction.points;
  }
  return [definition.point, definition.point];
}

function constructedPointToElement(object: PointObject, objects: readonly DiagramObject[]): DiagramElement | null {
  const base = constructedPointElementBase(object);
  const visibleProperties = object.visibleWhen ? { properties: { visibleWhen: object.visibleWhen } } : {};
  if (object.definition.type === 'intersection') {
    const properties = {
      ...(object.definition.restrictToSupports ? { restrictToSupports: true } : {}),
      ...(object.visibleWhen ? { visibleWhen: object.visibleWhen } : {}),
    };
    return { ...base, kind: 'intersection', refs: [...object.definition.supports], properties };
  }
  if (object.definition.type === 'midpoint') {
    return { ...base, kind: 'midpoint', refs: [...object.definition.points], ...visibleProperties };
  }
  if (object.definition.type !== 'projection') return null;
  const points = projectionSupportPoints(object.definition, objects);
  return { ...base, kind: 'perpendicularFoot', refs: [points[0], points[1], object.definition.point], ...visibleProperties };
}

function linearRelationRefs(relation: Extract<DiagramRelation, { type: 'perpendicular' | 'parallel' }>): string[] {
  if (typeof relation.supports[0] === 'string') return [...relation.supports] as string[];
  return [relation.supports[0][0], relation.supports[0][1], relation.supports[1][1]];
}

function equalLengthConstraint(
  relation: Extract<DiagramRelation, { type: 'equal-length' }>,
  objects: readonly DiagramObject[],
): DiagramConstraint {
  const segment = objects.find(object => object.id === relation.segments[0]);
  const endpoints = segment?.objectType === 'path' && segment.geometry.type === 'segment'
    ? segment.geometry.points
    : relation.segments;
  const driven = relation.drivenPoint ?? endpoints[0];
  const anchor = endpoints.find(id => id !== driven) ?? endpoints[1];
  return { id: relation.id, label: relation.label, enabled: relation.enabled, kind: 'equalLength', refs: [driven, anchor, relation.segments[1]] };
}

function equalAngleConstraint(
  relation: Extract<DiagramRelation, { type: 'equal-angle' }>,
  objects: readonly DiagramObject[],
): DiagramConstraint {
  const target = objects.find(object => object.id === relation.angles[0] && object.objectType === 'angle');
  const targetAngle = target?.objectType === 'angle' ? target : undefined;
  const driven = relation.drivenPoint ?? targetAngle?.points[0] ?? relation.angles[0];
  const vertex = targetAngle?.points[1] ?? driven;
  const fixed = targetAngle?.points.find(point => point !== driven && point !== vertex) ?? driven;
  return { id: relation.id, label: relation.label, enabled: relation.enabled, kind: 'equalAngle', refs: [driven, vertex, fixed, relation.angles[1], relation.angles[0]] };
}

function relationToConstraint(relation: DiagramRelation, objects: readonly DiagramObject[]): DiagramConstraint {
  const base = { id: relation.id, label: relation.label, enabled: relation.enabled };
  switch (relation.type) {
    case 'coincident': return { ...base, kind: 'coincident', refs: [...relation.points] };
    case 'coordinate-equality': return { ...base, kind: relation.axis === 'x' ? 'vertical' : 'horizontal', refs: [...relation.points] };
    case 'on-support': return { ...base, kind: 'on', refs: [relation.point, relation.support] };
    case 'distance': return { ...base, kind: 'distance', refs: [...relation.points], ...(relation.value !== undefined ? { value: relation.value } : {}), ...(relation.expression ? { expression: relation.expression } : {}) };
    case 'equal-length': return equalLengthConstraint(relation, objects);
    case 'equal-angle': return equalAngleConstraint(relation, objects);
    case 'perpendicular': return { ...base, kind: 'perpendicular', refs: linearRelationRefs(relation) };
    case 'parallel': return { ...base, kind: 'parallel', refs: linearRelationRefs(relation) };
    case 'inside-disk': {
      const refs = typeof relation.disk === 'string'
        ? [relation.point, relation.disk, relation.disk]
        : [relation.point, relation.disk.center, relation.disk.boundary];
      return { ...base, kind: 'insideDisk', refs };
    }
    case 'same-half-plane': return { ...base, kind: 'sameSide', refs: [...relation.points, relation.boundary] };
    case 'inside-area': return {
      ...base,
      kind: 'insideArea',
      refs: [relation.point, relation.area],
      ...(relation.membership && relation.membership !== 'interior' ? { areaMembership: relation.membership } : {}),
    };
    case 'reflection': return { ...base, kind: 'reflection', refs: [...(relation.refs ?? [])] };
    case 'expression': return { ...base, kind: 'expression', refs: [...relation.refs], expression: relation.expression, ...(relation.value !== undefined ? { value: relation.value } : {}) };
  }
}

export function projectDiagramSpecV3ToV2(spec: DiagramSpecV3): DiagramSpecV2 {
  const points = spec.objects.filter((object): object is PointObject => object.objectType === 'point').map(pointToV2).filter((point): point is DiagramPoint => point !== null);
  const elements = spec.objects.flatMap(object => {
    if (object.objectType === 'control') return [];
    if (object.objectType === 'point') {
      const constructed = constructedPointToElement(object, spec.objects);
      return constructed ? [constructed] : [];
    }
    return [objectToElement(object)];
  });
  const sliders = spec.objects.filter((object): object is ControlObject => object.objectType === 'control').map(object => ({ ...commonToV2(object), ...(object.visibleWhen ? { visibleWhen: object.visibleWhen } : {}), x: object.position[0], y: object.position[1], min: object.range.min, max: object.range.max, ...(object.range.maxExpression ? { maxExpression: object.range.maxExpression } : {}), value: object.value, step: object.range.step }));
  const markerRelationIds = new Set(spec.objects
    .filter((object): object is AngleObject => object.objectType === 'angle' && object.marker === 'square')
    .map(object => object.perpendicularRelationId)
    .filter((id): id is string => Boolean(id)));
  const compatibilityRelations = spec.relations.filter(relation => !markerRelationIds.has(relation.id));
  const dependencies = dependenciesFor(spec.objects);
  points.forEach(point => { if (point.constraint === 'derived') point.dependencies = dependencies?.filter(edge => edge.targetId === point.id).map(edge => edge.sourceId) ?? []; });
  return {
    version: DIAGRAM_SPEC_V2_VERSION, renderer: DIAGRAM_RENDERER_V2_ID, title: spec.title, componentId: spec.componentId,
    category: spec.category, mode: spec.mode, axis: spec.axis, grid: spec.grid, ...(spec.showLabels !== undefined ? { showLabels: spec.showLabels } : {}),
    ...(spec.header ? { header: structuredClone(spec.header) } : {}),
    viewport: structuredClone(spec.viewport), layers: structuredClone(spec.layers), groups: structuredClone(spec.groups), points, elements, sliders,
    steps: structuredClone(spec.steps), constraints: compatibilityRelations.map(relation => relationToConstraint(relation, spec.objects)), dependencies, note: spec.note, extensions: {},
  };
}

/**
 * Adjunta vistas de solo lectura no persistidas. JSON.stringify y el schema v3
 * siguen viendo exclusivamente `objects`; sirven para una deprecación gradual.
 */
export function attachDiagramSpecLegacyViews(spec: DiagramSpecV3): DiagramSpec {
  let projection: DiagramSpecV2 | undefined;
  const legacy = () => projection ??= projectDiagramSpecV3ToV2(spec);
  Object.defineProperties(spec, {
    points: { enumerable: false, configurable: false, get: () => legacy().points },
    elements: { enumerable: false, configurable: false, get: () => legacy().elements },
    sliders: { enumerable: false, configurable: false, get: () => legacy().sliders },
    extensions: { enumerable: false, configurable: false, get: () => ({}) },
  });
  return spec as DiagramSpec;
}
