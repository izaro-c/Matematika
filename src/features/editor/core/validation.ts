import {
  AxiomSchema,
  AxiomaticSystemSchema,
  DefinitionSchema,
  DemoSchema,
  ExampleSchema,
  ExerciseSchema,
  LessonSchema,
  MathematicianSchema,
  ModelSchema,
  StudyPlanSchema,
  TheoremSchema,
  UseCaseSchema,
} from '@/entities/content/schemas';
import type { Block, ProofStepData } from './parser';
import type { EditorValidationIssue, EditorValidationResult } from './editorTypes';

const CONTENT_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const MARKDOWN_LINK_RE = /\[[^\]]+\]\((?!https?:\/\/|mailto:|#)[^)]+\)/;
const VISUAL_ARGUMENT_RE = /\b(como se ve|claramente|evidentemente|es obvio|vemos que|observamos que)\b/i;
const DIAGRAM_ELEMENT_KINDS = new Set(['segment', 'line', 'ray', 'polygon', 'circle', 'midpoint', 'perpendicularFoot', 'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'rightAngle', 'measurement', 'text']);
const DIAGRAM_MIN_REFS: Record<string, number> = {
  segment: 2,
  line: 2,
  ray: 2,
  polygon: 3,
  circle: 2,
  midpoint: 2,
  perpendicularFoot: 3,
  baseExtension: 3,
  perpendicular: 3,
  parallel: 3,
  angleBisector: 3,
  angle: 3,
  rightAngle: 3,
  measurement: 1,
  text: 1,
};
const DIAGRAM_POINT_CONSTRAINTS = new Set(['free', 'fixed', 'horizontal', 'vertical', 'glider']);
const DIAGRAM_POINTLIKE_ELEMENT_KINDS = new Set(['midpoint', 'perpendicularFoot']);
const DIAGRAM_GLIDER_SUPPORT_KINDS = new Set(['segment', 'line', 'ray', 'circle', 'perpendicular', 'parallel', 'angleBisector']);

const SCHEMAS = {
  axioma: AxiomSchema,
  'sistema-axiomatico': AxiomaticSystemSchema,
  definicion: DefinitionSchema,
  teorema: TheoremSchema,
  lema: TheoremSchema,
  corolario: TheoremSchema,
  demostracion: DemoSchema,
  ejemplo: ExampleSchema,
  ejercicio: ExerciseSchema,
  leccion: LessonSchema,
  lesson: LessonSchema,
  matematico: MathematicianSchema,
  modelo: ModelSchema,
  'caso-de-uso': UseCaseSchema,
  'plan-de-estudio': StudyPlanSchema,
} as const;

function issue(
  id: string,
  severity: EditorValidationIssue['severity'],
  area: EditorValidationIssue['area'],
  message: string,
  blockId?: string,
): EditorValidationIssue {
  return { id, severity, area, message, blockId };
}

function validateMetadata(metadata: Record<string, unknown>): EditorValidationIssue[] {
  const issues: EditorValidationIssue[] = [];
  const id = String(metadata.id || '');
  const type = String(metadata.type || '');

  if (!id) {
    issues.push(issue('metadata-id-required', 'error', 'metadata', 'El campo "id" es obligatorio.'));
  } else if (!CONTENT_ID_RE.test(id)) {
    issues.push(issue('metadata-id-kebab', 'error', 'metadata', 'El ID debe estar en kebab-case estricto.'));
  }

  if (!type) {
    issues.push(issue('metadata-type-required', 'error', 'metadata', 'El campo "type" es obligatorio.'));
    return issues;
  }

  const schema = SCHEMAS[type as keyof typeof SCHEMAS];
  if (!schema) {
    issues.push(issue('metadata-type-known', 'error', 'metadata', `Tipo de contenido no soportado por el editor: "${type}".`));
    return issues;
  }

  const parsed = schema.safeParse(metadata);
  if (!parsed.success) {
    for (const zodIssue of parsed.error.issues) {
      issues.push(issue(
        `metadata-schema-${zodIssue.path.join('-') || 'root'}`,
        'error',
        'metadata',
        `${zodIssue.path.join('.') || 'metadata'}: ${zodIssue.message}`,
      ));
    }
  }

  if (type === 'definicion' && !metadata.subtype) {
    issues.push(issue('definition-subtype-required', 'error', 'metadata', 'Toda definición necesita subtype: primitivo, nominal o fundamentada.'));
  }

  if (type === 'demostracion' && !metadata.parentTheorem) {
    issues.push(issue('demo-parent-required', 'error', 'metadata', 'Toda demostración debe apuntar a un parentTheorem.'));
  }

  if (type === 'demostracion' && metadata.layout !== 'split' && metadata.layout !== 'text') {
    issues.push(issue('demo-layout-required', 'warning', 'metadata', 'Indica layout "split" para demostraciones geométricas o "text" para pruebas sin diagrama.'));
  }

  return issues;
}

function validateProofStep(step: ProofStepData, blockId: string): EditorValidationIssue[] {
  const issues: EditorValidationIssue[] = [];
  if (!step.justificacion?.trim()) {
    issues.push(issue(`proof-${step.number}-justification`, 'error', 'proof', `El paso ${step.number} necesita justificación Greenberg.`, blockId));
  }
  if (!step.body?.includes('<InteractiveElement') && !step.body?.includes('highlightTarget=')) {
    issues.push(issue(`proof-${step.number}-interactive`, 'warning', 'proof', `El paso ${step.number} no referencia ningún elemento del diagrama.`, blockId));
  }
  if (step.body && VISUAL_ARGUMENT_RE.test(step.body)) {
    issues.push(issue(`proof-${step.number}-visual-argument`, 'error', 'proof', `El paso ${step.number} contiene una justificación visual o informal prohibida.`, blockId));
  }
  if (step.dependencyId && !CONTENT_ID_RE.test(step.dependencyId)) {
    issues.push(issue(`proof-${step.number}-dependency-id`, 'error', 'proof', `La dependencia del paso ${step.number} debe ser kebab-case.`, blockId));
  }
  return issues;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function validateVisualDiagramModel(value: unknown, blockId: string): EditorValidationIssue[] {
  const issues: EditorValidationIssue[] = [];
  if (!value || typeof value !== 'object') return issues;

  const record = value as Record<string, unknown>;
  const points = Array.isArray(record.points) ? record.points as Array<Record<string, unknown>> : [];
  const elements = Array.isArray(record.elements) ? record.elements as Array<Record<string, unknown>> : [];
  const sliders = Array.isArray(record.sliders) ? record.sliders as Array<Record<string, unknown>> : [];
  const steps = Array.isArray(record.steps) ? record.steps as Array<Record<string, unknown>> : [];

  const ids = [
    ...points.map(item => item.id),
    ...elements.map(item => item.id),
    ...sliders.map(item => item.id),
    ...steps.map(item => item.id),
  ].filter((id): id is string => typeof id === 'string');
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    issues.push(issue(`diagram-${blockId}-duplicate-targets`, 'error', 'diagram', `El diagrama tiene targets duplicados: ${Array.from(new Set(duplicateIds)).join(', ')}.`, blockId));
  }

  const pointIds = new Set(points.map(item => item.id).filter((id): id is string => typeof id === 'string'));
  const pointLikeElementIds = elements
    .filter(item => typeof item.kind === 'string' && DIAGRAM_POINTLIKE_ELEMENT_KINDS.has(item.kind))
    .map(item => item.id)
    .filter((id): id is string => typeof id === 'string');
  const pointLikeIds = new Set([...pointIds, ...pointLikeElementIds]);
  const supportElementIds = new Set(elements
    .filter(item => typeof item.kind === 'string' && DIAGRAM_GLIDER_SUPPORT_KINDS.has(item.kind))
    .map(item => item.id)
    .filter((id): id is string => typeof id === 'string'));
  const targetIds = new Set(ids);

  points.forEach((pointRecord, index) => {
    const pointId = typeof pointRecord.id === 'string' ? pointRecord.id : `punto-${index + 1}`;
    if (typeof pointRecord.constraint === 'string' && !DIAGRAM_POINT_CONSTRAINTS.has(pointRecord.constraint)) {
      issues.push(issue(`diagram-${blockId}-${pointId}-constraint`, 'error', 'diagram', `El punto ${pointId} tiene una restricción desconocida: ${pointRecord.constraint}.`, blockId));
    }
    if (pointRecord.constraint === 'glider') {
      const gliderTarget = typeof pointRecord.gliderTarget === 'string' ? pointRecord.gliderTarget : '';
      if (!gliderTarget) {
        issues.push(issue(`diagram-${blockId}-${pointId}-glider-target`, 'error', 'diagram', `El punto ${pointId} es glider y necesita un soporte.`, blockId));
      } else if (!supportElementIds.has(gliderTarget)) {
        issues.push(issue(`diagram-${blockId}-${pointId}-glider-target-missing`, 'error', 'diagram', `El glider ${pointId} apunta a un soporte inexistente o no compatible: ${gliderTarget}.`, blockId));
      }
    }
  });

  elements.forEach((elementRecord, index) => {
    const elementId = typeof elementRecord.id === 'string' ? elementRecord.id : `elemento-${index + 1}`;
    if (typeof elementRecord.kind === 'string' && !DIAGRAM_ELEMENT_KINDS.has(elementRecord.kind)) {
      issues.push(issue(`diagram-${blockId}-${elementId}-kind`, 'error', 'diagram', `El elemento ${elementId} tiene un tipo visual desconocido: ${elementRecord.kind}.`, blockId));
    }
    const refs = getStringArray(elementRecord.refs);
    const kind = typeof elementRecord.kind === 'string' ? elementRecord.kind : '';
    const minRefs = DIAGRAM_MIN_REFS[kind] ?? 1;
    if (refs.length < minRefs) {
      issues.push(issue(`diagram-${blockId}-${elementId}-refs-min`, 'error', 'diagram', `El elemento ${elementId} necesita al menos ${minRefs} punto(s) asociado(s).`, blockId));
    }
    refs.forEach(ref => {
      if (!pointLikeIds.has(ref)) {
        issues.push(issue(`diagram-${blockId}-${elementId}-ref-${ref}`, 'error', 'diagram', `El elemento ${elementId} apunta a un punto inexistente: ${ref}.`, blockId));
      }
    });
  });

  sliders.forEach((sliderRecord, index) => {
    const sliderId = typeof sliderRecord.id === 'string' ? sliderRecord.id : `slider-${index + 1}`;
    const min = typeof sliderRecord.min === 'number' ? sliderRecord.min : 0;
    const max = typeof sliderRecord.max === 'number' ? sliderRecord.max : 0;
    if (max <= min) {
      issues.push(issue(`diagram-${blockId}-${sliderId}-range`, 'error', 'diagram', `El slider ${sliderId} necesita max mayor que min.`, blockId));
    }
  });

  steps.forEach((stepRecord, index) => {
    const stepId = typeof stepRecord.id === 'string' ? stepRecord.id : `step-${index + 1}`;
    const visibleTargets = getStringArray(stepRecord.visibleTargets);
    if (visibleTargets.length === 0) {
      issues.push(issue(`diagram-${blockId}-${stepId}-empty`, 'warning', 'diagram', `El paso ${stepId} no muestra ningún target del diagrama.`, blockId));
    }
    visibleTargets.forEach(target => {
      if (!targetIds.has(target)) {
        issues.push(issue(`diagram-${blockId}-${stepId}-target-${target}`, 'error', 'diagram', `El paso ${stepId} referencia un target inexistente: ${target}.`, blockId));
      }
    });
  });

  return issues;
}

function validateBlocks(blocks: Block[]): EditorValidationIssue[] {
  const issues: EditorValidationIssue[] = [];

  blocks.forEach(block => {
    const content = block.content || '';
    if (content.includes('\\sen')) {
      issues.push(issue(`block-${block.id}-sen`, 'error', 'block', 'Usa \\sin en LaTeX; \\sen está prohibido.', block.id));
    }
    if (MARKDOWN_LINK_RE.test(content)) {
      issues.push(issue(`block-${block.id}-markdown-link`, 'error', 'block', 'Los enlaces internos deben usar ConceptLink o RefLink, no Markdown.', block.id));
    }
    if (HEX_RE.test(content)) {
      issues.push(issue(`block-${block.id}-hex`, 'error', 'block', 'No se permiten colores hex hardcodeados en contenido o diagramas.', block.id));
    }
    if (VISUAL_ARGUMENT_RE.test(content)) {
      issues.push(issue(`block-${block.id}-visual-language`, 'warning', 'block', 'Revisa el tono: evita "claramente", "se ve" o argumentos visuales.', block.id));
    }
    if (block.type === 'diagram' && block.content === 'InteractiveGeometryCanvas') {
      issues.push(issue(`diagram-${block.id}-legacy-canvas`, 'error', 'diagram', 'Este diagrama usa el canvas legacy; crea un diagrama canónico en src/shared/diagrams.', block.id));
    }
    if (block.type === 'diagram' && block.metadata?.visualModel) {
      issues.push(...validateVisualDiagramModel(block.metadata.visualModel, block.id));
    }
    if (block.type === 'table') {
      const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
      if (lines.length < 2 || !/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(lines[1])) {
        issues.push(issue(`block-${block.id}-table-header`, 'warning', 'block', 'Esta tabla necesita una fila de cabecera y una fila separadora Markdown.', block.id));
      }
    }
    if (block.type === 'exercise') {
      if (!content.includes('<Pregunta') && !content.includes('<Hueco')) {
        issues.push(issue(`block-${block.id}-exercise-interaction`, 'warning', 'block', 'El ejercicio necesita una pregunta interactiva o un hueco editable.', block.id));
      }
      if (!content.includes('<Resolucion') && !content.includes('<Solucion')) {
        issues.push(issue(`block-${block.id}-exercise-solution`, 'warning', 'block', 'El ejercicio debería tener resolución o solución revelable.', block.id));
      }
    }
    if (block.type === 'advancedMdx') {
      issues.push(issue(`block-${block.id}-advanced-mdx`, 'info', 'block', 'Este bloque se conserva como MDX avanzado; revisa en código si requiere edición específica.', block.id));
    }
    if (block.type === 'demonstration') {
      const steps = (block.metadata?.steps || []) as ProofStepData[];
      if (steps.length === 0) {
        issues.push(issue(`proof-${block.id}-empty`, 'error', 'proof', 'La demostración no contiene pasos.', block.id));
      }
      steps.forEach(step => issues.push(...validateProofStep(step, block.id)));
    }
  });

  return issues;
}

export function validateEditorDocument(input: {
  metadata: Record<string, unknown>;
  imports: string;
  exports: string;
  blocks: Block[];
  rawBody?: string;
}): EditorValidationResult {
  const issues: EditorValidationIssue[] = [
    ...validateMetadata(input.metadata),
    ...validateBlocks(input.blocks),
  ];

  const source = `${input.imports}\n${input.exports}\n${input.rawBody || ''}`;
  if (HEX_RE.test(source)) {
    issues.push(issue('source-hex', 'error', 'source', 'El documento contiene colores hex hardcodeados.'));
  }
  if (source.includes('\\sen')) {
    issues.push(issue('source-sen', 'error', 'source', 'El documento contiene \\sen; usa \\sin.'));
  }

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  return {
    issues,
    canSave: errorCount === 0,
    errorCount,
    warningCount,
  };
}
