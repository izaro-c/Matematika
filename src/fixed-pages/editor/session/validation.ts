import {
  AxiomSchema,
  AxiomaticSystemSchema,
  DefinitionSchema,
  DemoSchema,
  ExampleSchema,
  ExerciseSchema,
  MethodSchema,
  MathematicianSchema,
  ModelSchema,
  StudyPlanSchema,
  TheoremSchema,
  UseCaseSchema,
} from '@/data/content/schemas';
import type { Block, ProofStepData } from './parser';
import type { EditorValidationIssue, EditorValidationResult } from './editorTypes';
import { DIAGRAM_SPEC_VERSION, parseDiagramSpecV3 } from '@/diagrams';
import { auditEditorSource } from '@/fixed-pages/editor/security/contentGuard';
import { isSupportedLanguage } from '@/i18n/config';

const CONTENT_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const MARKDOWN_LINK_RE = /\[[^\]]+\]\((?!https?:\/\/|mailto:|#)[^)]+\)/;
const VISUAL_ARGUMENT_RE = /\b(como se ve|claramente|evidentemente|es obvio|vemos que|observamos que)\b/i;

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
  metodo: MethodSchema,
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

function validateMetadata(metadata: Record<string, unknown> = {}): EditorValidationIssue[] {
  const issues: EditorValidationIssue[] = [];
  const safeMeta = metadata || {};
  const id = String(safeMeta.id || '');
  const type = String(safeMeta.type || '');

  if (!id) {
    issues.push(issue('metadata-id-required', 'error', 'metadata', 'El campo "id" es obligatorio.'));
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    issues.push(issue('metadata-id-kebab', 'warning', 'metadata', 'Recomendación: el ID debería usar minúsculas y guiones (ej. teorema-pitagoras).'));
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
        'warning',
        'metadata',
        `${zodIssue.path.join('.') || 'metadata'}: ${zodIssue.message}`,
      ));
    }
  }

  if (type === 'definicion' && !metadata.subtype) {
    issues.push(issue('definition-subtype-required', 'warning', 'metadata', 'Toda definición necesita subtype: primitivo, nominal o fundamentada.'));
  }

  if (type === 'demostracion' && !metadata.parentTheorem) {
    issues.push(issue('demo-parent-required', 'warning', 'metadata', 'Toda demostración debe apuntar a un parentTheorem.'));
  }

  if (type === 'demostracion' && metadata.layout !== 'split' && metadata.layout !== 'text') {
    issues.push(issue('demo-layout-required', 'warning', 'metadata', 'Indica layout "split" para demostraciones geométricas o "text" para pruebas sin diagrama.'));
  }

  if (metadata.lang && typeof metadata.lang === 'string' && !isSupportedLanguage(metadata.lang)) {
    issues.push(issue('metadata-lang-supported', 'warning', 'metadata', `El idioma "${metadata.lang}" no figura en el registro de idiomas soportados.`));
  }

  return issues;
}

const JUSTIFICATION_KEYWORDS = [
  'hipótesis', 'hipotesis', 'axioma', 'teorema', 'definición', 'definicion',
  'lema', 'corolario', 'paso', 'regla', 'propiedad', 'ley', 'principio',
  'construcción', 'construccion', 'modus ponens', 'modus tollens',
  'simplificación', 'simplificacion', 'adición', 'adicion', 'resolución',
  'resolucion', 'sustitución', 'sustitucion', 'distributiva', 'conmutativa',
  'asociativa', 'transitividad',
];

function bodyHasLogicalJustification(body: string): boolean {
  if (/<(?:ConceptLink|RefLink|ProofStepLink)\b/i.test(body)) return true;
  const lower = body.toLowerCase();
  return JUSTIFICATION_KEYWORDS.some(kw => lower.includes(kw));
}

function validateProofStep(step: ProofStepData, blockId: string): EditorValidationIssue[] {
  const issues: EditorValidationIssue[] = [];
  if (!bodyHasLogicalJustification(step.body ?? '')) {
    issues.push(issue(
      `proof-${step.number}-justification`,
      'warning',
      'proof',
      `El paso ${step.number} aún no justifica su afirmación (enlace a axioma, teorema, definición, paso previo o regla en el texto).`,
      blockId,
    ));
  }
  if (!step.body?.includes('<InteractiveElement') && !step.body?.includes('highlightTarget=') && !(Array.isArray(step.target) ? step.target.length : step.target)) {
    issues.push(issue(
      `proof-${step.number}-interactive`,
      'warning',
      'proof',
      `El paso ${step.number} no resalta ningún elemento del diagrama. Elige elementos o enlázalos en el texto.`,
      blockId,
    ));
  }
  if (step.body && VISUAL_ARGUMENT_RE.test(step.body)) {
    issues.push(issue(`proof-${step.number}-visual-argument`, 'warning', 'proof', `El paso ${step.number} contiene una justificación visual o informal; conviene sustituirla por una justificación lógica.`, blockId));
  }
  if (typeof step.diagramStep === 'string' && step.diagramStep !== 'initial' && !CONTENT_ID_RE.test(step.diagramStep) && !/^\d+$/.test(step.diagramStep)) {
    issues.push(issue(`proof-${step.number}-diagram-step`, 'warning', 'proof', `El momento de diagrama del paso ${step.number} debe ser «figura inicial», automático o un identificador concreto.`, blockId));
  }
  return issues;
}

function validateVisualDiagramModel(value: unknown, blockId: string): EditorValidationIssue[] {
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  if (record.version !== DIAGRAM_SPEC_VERSION) {
    return [issue(`diagram-${blockId}-spec-version`, 'error', 'diagram', `El diagrama debe usar DiagramSpec v${DIAGRAM_SPEC_VERSION}.`, blockId)];
  }
  const parsed = parseDiagramSpecV3(record);
  if (!parsed.success) {
    return parsed.error.issues.map((schemaIssue, index) => issue(
      `diagram-${blockId}-spec-${index}`,
      'error',
      'diagram',
      `${schemaIssue.path.join('.') || 'spec'}: ${schemaIssue.message}`,
      blockId,
    ));
  }
  return parsed.data.steps
    .filter(step => step.visibleTargets.length === 0)
    .map(step => issue(`diagram-${blockId}-${step.id}-empty`, 'warning', 'diagram', `El paso ${step.id} no muestra ningún target del diagrama.`, blockId));
}

function validateBlocks(blocks: Block[]): EditorValidationIssue[] {
  const issues: EditorValidationIssue[] = [];

  blocks.forEach(block => {
    const content = block.content || '';
    if (content.includes('\\sen')) {
      issues.push(issue(`block-${block.id}-sen`, 'error', 'block', 'Usa \\sin en LaTeX; \\sen está prohibido.', block.id));
    }
    if (MARKDOWN_LINK_RE.test(content)) {
      issues.push(issue(`block-${block.id}-markdown-link`, 'warning', 'block', 'Los enlaces internos deben usar ConceptLink o RefLink, no Markdown.', block.id));
    }
    if (HEX_RE.test(content)) {
      issues.push(issue(`block-${block.id}-hex`, 'error', 'block', 'No se permiten colores hex hardcodeados en contenido o diagramas.', block.id));
    }
    if (VISUAL_ARGUMENT_RE.test(content)) {
      issues.push(issue(`block-${block.id}-visual-language`, 'warning', 'block', 'Revisa el tono: evita "claramente", "se ve" o argumentos visuales.', block.id));
    }
    if (block.type === 'diagram' && block.content === 'InteractiveGeometryCanvas') {
      issues.push(issue(`diagram-${block.id}-retired-canvas`, 'error', 'diagram', 'InteractiveGeometryCanvas fue retirado por no tener consumidores válidos. Enlaza un diagrama final de content/diagrams/.', block.id));
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
      let steps = (block.metadata?.steps || []) as ProofStepData[];
      if (steps.length === 0) {
        const hasStepSurface = Boolean(
          block.content?.trim()
          || block.metadata?.title
          || block.metadata?.number
          || block.metadata?.target
          || block.metadata?.diagramStep,
        );
        if (hasStepSurface) {
          steps = [{
            number: Number(block.metadata?.number ?? 1),
            title: typeof block.metadata?.title === 'string' ? block.metadata.title : '',
            target: block.metadata?.target as ProofStepData['target'],
            diagramStep: block.metadata?.diagramStep as ProofStepData['diagramStep'],
            diagramKey: typeof block.metadata?.diagramKey === 'string' ? block.metadata.diagramKey : undefined,
            body: block.content,
          }];
        } else {
          issues.push(issue(`proof-${block.id}-empty`, 'warning', 'proof', 'Este bloque de demostración aún no tiene un paso con contenido.', block.id));
        }
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
    issues.push(issue('source-hex', 'warning', 'source', 'El documento contiene colores hex hardcodeados.'));
  }
  if (source.includes('\\sen')) {
    issues.push(issue('source-sen', 'warning', 'source', 'El documento contiene \\sen; usa \\sin.'));
  }
  for (const finding of auditEditorSource('mdx', source)) {
    issues.push(issue(finding.code, 'error', 'source', finding.message));
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
