import type { VisualDiagramModel, VisualElement } from '../model/types';

export interface DiagramDiagnostic {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  source?: 'model' | 'source' | 'synchronization' | 'reference';
  elementId?: string;
}

export type GenerateDiagramSourceResult =
  | {
      ok: true;
      source: string;
      diagnostics: DiagramDiagnostic[];
    }
  | {
      ok: false;
      diagnostics: DiagramDiagnostic[];
    };

const MODEL_START = '/* @matematika-diagram-model';
const MODEL_END = '*/';

function quote(value: string): string {
  return JSON.stringify(value);
}

function serializeModel(model: VisualDiagramModel): string {
  return JSON.stringify(model, null, 2);
}

export function generateDiagramSource(model: VisualDiagramModel, componentName: string): GenerateDiagramSourceResult {
  const diagnostics: DiagramDiagnostic[] = [];

  // Basic validation checks before generating
  if (!model.componentId) {
    diagnostics.push({
      code: 'empty-component-id',
      severity: 'error',
      message: 'El ID del componente no puede estar vacío.',
      source: 'model',
    });
  }
  if (model.points.length === 0) {
    diagnostics.push({
      code: 'no-points',
      severity: 'error',
      message: 'El diagrama debe tener al menos un punto.',
      source: 'model',
    });
  }

  // Verify element references are valid
  const pointIds = new Set(model.points.map(p => p.id));
  const sliderIds = new Set(model.sliders.map(s => s.id));
  const elementIds = new Set(model.elements.map(e => e.id));
  const allIds = new Set([...pointIds, ...sliderIds, ...elementIds]);

  for (const elementItem of model.elements) {
    for (const ref of elementItem.refs) {
      if (!allIds.has(ref)) {
        diagnostics.push({
          code: 'invalid-reference',
          severity: 'error',
          message: `El elemento ${elementItem.id} hace referencia a un ID inexistente: ${ref}`,
          source: 'model',
          elementId: elementItem.id,
        });
      }
    }
  }

  if (diagnostics.some(d => d.severity === 'error')) {
    return { ok: false, diagnostics };
  }

  const axis = model.axis ? '\n      axis' : '';
  const grid = model.grid ? '\n      grid' : '';
  const helpers = new Set(['createPoint']);
  const gliderPoints = model.points.filter(item => item.constraint === 'glider' && item.gliderTarget);
  if (gliderPoints.length > 0) helpers.add('createGlider');
  if (model.sliders.length > 0) helpers.add('createSlider');

  model.elements.forEach(item => {
    if (item.kind === 'segment') helpers.add('createSegment');
    if (item.kind === 'line') helpers.add('createLine');
    if (item.kind === 'ray') helpers.add('createRay');
    if (item.kind === 'polygon') helpers.add('createPolygon');
    if (item.kind === 'circle') helpers.add('createCircle');
    if (item.kind === 'midpoint') helpers.add('createMidpoint');
    if (item.kind === 'perpendicularFoot') helpers.add('createPerpendicularFoot');
    if (item.kind === 'baseExtension') helpers.add('createBaseExtensionToFoot');
    if (item.kind === 'perpendicular') helpers.add('createPerpendicularLine');
    if (item.kind === 'parallel') helpers.add('createParallelLine');
    if (item.kind === 'angleBisector') helpers.add('createAngleBisectorRay');
    if (item.kind === 'angle') helpers.add('createAngle');
    if (item.kind === 'rightAngle') helpers.add('createRightAngleMarker');
    if (item.kind === 'text' || item.kind === 'measurement') helpers.add('createText');
  });

  const helperImports = Array.from(helpers).sort().join(', ');

  const pointLines = model.points.filter(item => item.constraint !== 'glider').map(item => {
    const options = [
      `name: ${quote(item.label)}`,
      item.fixed ? 'fixed: true' : '',
      `fillColor: theme.${item.color}`,
      `strokeColor: theme.${item.color}`,
    ].filter(Boolean).join(', ');
    return `        els[${quote(item.id)}] = createPoint(board, [${item.x.toFixed(2)}, ${item.y.toFixed(2)}], { ${options} }, theme);`;
  });

  const constraintLines = model.points.filter(item => item.constraint !== 'glider').map(item => {
    if (item.constraint === 'horizontal' && !item.fixed) {
      return `        els[${quote(item.id)}].on('drag', () => els[${quote(item.id)}].moveTo([els[${quote(item.id)}].X(), ${item.y.toFixed(2)}], 0));`;
    }
    if (item.constraint === 'vertical' && !item.fixed) {
      return `        els[${quote(item.id)}].on('drag', () => els[${quote(item.id)}].moveTo([${item.x.toFixed(2)}, els[${quote(item.id)}].Y()], 0));`;
    }
    return '';
  }).filter(Boolean);

  const gliderPointIds = new Set(gliderPoints.map(item => item.id));

  const createElementLine = (item: VisualElement) => {
    const refs = item.refs.map(ref => `els[${quote(ref)}]`).join(', ');
    if (item.kind === 'segment') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createSegment(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.4${item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'line') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createLine(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'ray') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createRay(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'polygon') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createPolygon(board, [${refs}], { fillColor: theme.${item.color}, fillOpacity: 0.16, borders: { strokeColor: theme.${item.color}, strokeWidth: 1.5 } }, theme);`;
    }
    if (item.kind === 'circle') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createCircle(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.5 }, theme);`;
    }
    if (item.kind === 'midpoint') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createMidpoint(board, [${refs}], { name: ${quote(item.label)}, fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`;
    }
    if (item.kind === 'perpendicularFoot') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createPerpendicularFoot(board, [${refs}], { name: ${quote(item.label)}, fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`;
    }
    if (item.kind === 'baseExtension') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createBaseExtensionToFoot(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 1.7, dash: 2 }, theme);`;
    }
    if (item.kind === 'perpendicular') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createPerpendicularLine(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed === false ? ', dash: 0' : item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'parallel') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createParallelLine(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed === false ? ', dash: 0' : item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'angleBisector') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createAngleBisectorRay(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed === false ? ', dash: 0' : item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'angle') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createAngle(board, [${refs}], { fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`;
    }
    if (item.kind === 'rightAngle') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createRightAngleMarker(board, [${refs}], { fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`;
    }
    const anchor = item.refs[0] || model.points[0]?.id;
    if (!anchor) return '';
    return `        els[${quote(item.id)}] = createText(board, [() => els[${quote(anchor)}].X() + 0.25, () => els[${quote(anchor)}].Y() + 0.35, ${quote(item.text || item.label)}], { color: theme.${item.color} }, theme);`;
  };

  const baseElementLines = model.elements
    .filter(item => !item.refs.some(ref => gliderPointIds.has(ref)))
    .map(createElementLine)
    .filter(Boolean);

  const gliderLines = gliderPoints.map(item => {
    const options = [
      `name: ${quote(item.label)}`,
      `fillColor: theme.${item.color}`,
      `strokeColor: theme.${item.color}`,
    ].join(', ');
    return `        els[${quote(item.id)}] = createGlider(board, [${item.x.toFixed(2)}, ${item.y.toFixed(2)}, els[${quote(item.gliderTarget || '')}]], { ${options} }, theme);`;
  });

  const dependentElementLines = model.elements
    .filter(item => item.refs.some(ref => gliderPointIds.has(ref)))
    .map(createElementLine)
    .filter(Boolean);

  const sliderLines = model.sliders.map(item => `        els[${quote(item.id)}] = createSlider(board, [[${item.x.toFixed(2)}, ${item.y.toFixed(2)}], [${(item.x + 2.6).toFixed(2)}, ${item.y.toFixed(2)}]], [${item.min}, ${item.value}, ${item.max}], { name: ${quote(item.label)}, snapWidth: ${item.step}, fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`);

  const stepTargetMap = model.steps.reduce<Record<string, string[]>>((acc, item) => {
    acc[item.id] = item.visibleTargets;
    return acc;
  }, {});

  const generatedTargetIds = [
    ...model.points.filter(item => item.target).map(item => item.id),
    ...model.elements.filter(item => item.target).map(item => item.id),
    ...model.sliders.filter(item => item.target).map(item => item.id),
    ...model.steps.map(item => item.id),
  ];

  const hasBaseExtensions = model.elements.some(item => item.kind === 'baseExtension');

  const updateLines = [
    ...model.points.map(item => `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), size: isHL(${quote(item.id)}) ? 8.5 : 5, fillColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, fillOpacity: emphasis(${quote(item.id)}) });`),
    ...model.elements.map(item => {
      if (item.kind === 'polygon') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), fillOpacity: isHL(${quote(item.id)}) ? 0.34 : 0.16 * emphasis(${quote(item.id)}) });`;
      if (item.kind === 'baseExtension') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}) && outsideBaseExtension(els[${quote(item.refs[0] || '')}], els[${quote(item.refs[1] || '')}], els[${quote(item.refs[2] || '')}]), strokeOpacity: emphasis(${quote(item.id)}), strokeWidth: isHL(${quote(item.id)}) ? 4.2 : 1.7, strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color} });`;
      if (item.kind === 'circle' || item.kind === 'segment' || item.kind === 'line' || item.kind === 'ray' || item.kind === 'perpendicular' || item.kind === 'parallel' || item.kind === 'angleBisector') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), strokeOpacity: emphasis(${quote(item.id)}), strokeWidth: isHL(${quote(item.id)}) ? 4.8 : 2.4, strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color} });`;
      if (item.kind === 'midpoint' || item.kind === 'perpendicularFoot') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), size: isHL(${quote(item.id)}) ? 8.5 : 5, fillColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, fillOpacity: emphasis(${quote(item.id)}) });`;
      if (item.kind === 'angle' || item.kind === 'rightAngle') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), fillOpacity: isHL(${quote(item.id)}) ? 0.45 : 0.18 * emphasis(${quote(item.id)}), strokeWidth: isHL(${quote(item.id)}) ? 3 : 1.5 });`;
      return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), color: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, opacity: emphasis(${quote(item.id)}) });`;
    }),
    ...model.sliders.map(item => `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, opacity: emphasis(${quote(item.id)}) });`),
  ];

  const sourceStr = `import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { ${helperImports} } from '@/shared/diagrams/core/MathFactory';
import { DiagramInfoPanel, DiagramTitle } from '@/shared/ui/DiagramOverlay';

${MODEL_START}
${serializeModel(model)}
${MODEL_END}

export const ${componentName} = () => {
  return (
    <MathBoard
      boundingbox={[${model.boundingBox.join(', ')}]}${axis}${grid}
      onInit={(board, els, theme) => {
${[...pointLines, ...constraintLines, ...baseElementLines, ...gliderLines, ...dependentElementLines, ...sliderLines].join('\n')}
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        const stepTargets: Record<string, string[]> = ${JSON.stringify(stepTargetMap, null, 10)};
        const activeSteps = Object.keys(stepTargets).filter(isStep);
        const hasActiveStep = activeSteps.length > 0;
        const visibleInStep = (id: string) => !hasActiveStep || activeSteps.some(stepId => stepTargets[stepId]?.includes(id));
        const targetIds = ${JSON.stringify(generatedTargetIds)};
        const anyHighlight = targetIds.some(isHL);
        const emphasis = (id: string) => isHL(id) ? 1 : anyHighlight ? 0.28 : 1;
        ${hasBaseExtensions ? `const outsideBaseExtension = (baseA: any, baseB: any, foot: any) => {
          if (!baseA || !baseB || !foot) return false;
          const dx = baseB.X() - baseA.X();
          const dy = baseB.Y() - baseA.Y();
          const len2 = dx * dx + dy * dy;
          if (len2 < 1e-10) return false;
          const t = ((foot.X() - baseA.X()) * dx + (foot.Y() - baseA.Y()) * dy) / len2;
          return t < -0.001 || t > 1.001;
        };` : ''}
${updateLines.join('\n')}
      }}
    >
      <DiagramTitle>{${quote(model.title)}}</DiagramTitle>
      <DiagramInfoPanel title="Exploración" position="bottom-right">
        <span>{${quote(model.note)}}</span>
      </DiagramInfoPanel>
    </MathBoard>
  );
};
`;

  return { ok: true, source: sourceStr, diagnostics };
}
