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
} from '../../../entities/content/schemas';
import type {
  EditorDiagnostic,
  MetadataProjection,
  MetadataPropertyProjection,
  SourceRange,
} from './documentTypes';

type EstreeNode = {
  type?: string;
  start?: number;
  end?: number;
  [key: string]: unknown;
};

const CONTENT_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REFERENCE_FIELDS = new Set([
  'authors', 'lemmas', 'corollaries', 'demos', 'requires', 'examples', 'exercises',
  'parentTheorem', 'axiomas', 'models', 'relatedTheorem', 'satisfies', 'proofMethod',
  'axioms_verified', 'concept', 'requiredNodes', 'dependencias',
]);

const METADATA_SCHEMAS = {
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

function nodeRange(node: EstreeNode | undefined): SourceRange | undefined {
  return typeof node?.start === 'number' && typeof node.end === 'number'
    ? { start: node.start, end: node.end }
    : undefined;
}

function staticPropertyKey(node: EstreeNode): string | null {
  if (node.type === 'Identifier' && typeof node.name === 'string') return node.name;
  if (node.type === 'Literal' && (typeof node.value === 'string' || typeof node.value === 'number')) {
    return String(node.value);
  }
  return null;
}

function defineStaticProperty(target: Record<string, unknown>, key: string, value: unknown): void {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true,
  });
}

/** Evaluates JSON-like ESTree without executing user code. */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function readStaticEstreeValue(node: EstreeNode): unknown {
  if (node.type === 'Literal') {
    const value = node.value;
    if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
    throw new Error('Only JSON-like literals are allowed in metadata');
  }

  if (node.type === 'TemplateLiteral') {
    const expressions = Array.isArray(node.expressions) ? node.expressions : [];
    const quasis = Array.isArray(node.quasis) ? node.quasis as EstreeNode[] : [];
    if (expressions.length > 0 || quasis.length !== 1) throw new Error('Dynamic templates are not static metadata');
    const value = quasis[0]?.value;
    if (!value || typeof value !== 'object' || !('cooked' in value)) throw new Error('Invalid static template');
    return (value as { cooked: unknown }).cooked;
  }

  if (node.type === 'UnaryExpression' && (node.operator === '-' || node.operator === '+')) {
    const argument = node.argument as EstreeNode | undefined;
    const value = argument ? readStaticEstreeValue(argument) : undefined;
    if (typeof value !== 'number') throw new Error('Unary metadata values must be numeric');
    return node.operator === '-' ? -value : value;
  }

  if (node.type === 'ArrayExpression') {
    const elements = Array.isArray(node.elements) ? node.elements : [];
    return elements.map(element => {
      if (!element || typeof element !== 'object') throw new Error('Sparse arrays are not supported in metadata');
      return readStaticEstreeValue(element as EstreeNode);
    });
  }

  if (node.type === 'ObjectExpression') {
    const result: Record<string, unknown> = {};
    const properties = Array.isArray(node.properties) ? node.properties as EstreeNode[] : [];
    for (const property of properties) {
      if (property.type !== 'Property' || property.computed === true || property.kind !== 'init' || property.method === true) {
        throw new Error('Spreads, computed keys and methods are not static metadata');
      }
      const keyNode = property.key as EstreeNode | undefined;
      const valueNode = property.value as EstreeNode | undefined;
      const key = keyNode ? staticPropertyKey(keyNode) : null;
      if (key === null || !valueNode) throw new Error('Invalid metadata property');
      defineStaticProperty(result, key, readStaticEstreeValue(valueNode));
    }
    return result;
  }

  throw new Error(`Unsupported dynamic metadata expression: ${node.type ?? 'unknown'}`);
}

function findMetadataInitializer(ast: EstreeNode): EstreeNode | null {
  const body = Array.isArray(ast.body) ? ast.body as EstreeNode[] : [];
  for (const statement of body) {
    if (statement.type !== 'ExportNamedDeclaration') continue;
    const declaration = statement.declaration as EstreeNode | undefined;
    if (declaration?.type !== 'VariableDeclaration') continue;
    const declarations = Array.isArray(declaration.declarations)
      ? declaration.declarations as EstreeNode[]
      : [];
    for (const declarator of declarations) {
      const id = declarator.id as EstreeNode | undefined;
      const init = declarator.init as EstreeNode | undefined;
      if (id?.type === 'Identifier' && id.name === 'metadata' && init) return init;
    }
  }
  return null;
}

function projectProperties(objectNode: EstreeNode): MetadataPropertyProjection[] {
  const result: MetadataPropertyProjection[] = [];
  const properties = Array.isArray(objectNode.properties) ? objectNode.properties as EstreeNode[] : [];
  for (const property of properties) {
    if (property.type !== 'Property' || property.computed === true) continue;
    const keyNode = property.key as EstreeNode | undefined;
    const valueNode = property.value as EstreeNode | undefined;
    const key = keyNode ? staticPropertyKey(keyNode) : null;
    const propertyRange = nodeRange(property);
    const valueRange = nodeRange(valueNode);
    if (key !== null && propertyRange && valueRange) result.push({ key, propertyRange, valueRange });
  }
  return result;
}

function diagnostic(code: string, message: string, range?: SourceRange): EditorDiagnostic {
  return { code, severity: 'error', message, sourceRange: range, panel: 'metadata' };
}

// Schema dispatch and project invariants are kept together for one authoritative diagnostic pass.
// eslint-disable-next-line sonarjs/cognitive-complexity
export function validateProjectedMetadata(
  value: Record<string, unknown>,
  objectRange?: SourceRange,
): { valid: boolean; schemaName?: string; diagnostics: EditorDiagnostic[] } {
  const diagnostics: EditorDiagnostic[] = [];
  const id = typeof value.id === 'string' ? value.id : '';
  const type = typeof value.type === 'string' ? value.type : '';

  if (!id) diagnostics.push(diagnostic('METADATA_ID_REQUIRED', 'El metadata debe declarar un ID explícito.', objectRange));
  else if (!CONTENT_ID_RE.test(id)) diagnostics.push(diagnostic('METADATA_ID_KEBAB', 'El ID del contenido debe usar kebab-case estricto.', objectRange));

  if (!type) {
    diagnostics.push(diagnostic('METADATA_TYPE_REQUIRED', 'El metadata debe declarar el tipo de contenido.', objectRange));
    return { valid: false, diagnostics };
  }

  const schema = METADATA_SCHEMAS[type as keyof typeof METADATA_SCHEMAS];
  if (!schema) {
    diagnostics.push(diagnostic('METADATA_TYPE_UNKNOWN', `No existe un schema de contenido para "${type}".`, objectRange));
    return { valid: false, diagnostics };
  }

  const LEAN_FIELDS = new Set(['leanId', 'leanCommitSha', 'leanVerified', 'verificationStatus', 'foundation', 'sources', 'stepTacticMap']);

  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const isLean = issue.path.some(p => LEAN_FIELDS.has(String(p)));
      diagnostics.push({
        code: `METADATA_SCHEMA_${issue.path.join('_').toUpperCase() || 'ROOT'}`,
        severity: isLean ? 'warning' : 'error',
        message: `${issue.path.join('.') || 'metadata'}: ${issue.message}`,
        sourceRange: objectRange,
        panel: 'metadata',
      });
    }
  }
  for (const key of REFERENCE_FIELDS) {
    if (!(key in value)) continue;
    const raw = value[key];
    const references = Array.isArray(raw) ? raw : [raw];
    for (const reference of references) {
      if (typeof reference !== 'string' || !CONTENT_ID_RE.test(reference)) {
        diagnostics.push({
          code: `METADATA_REFERENCE_${key.toUpperCase()}`,
          severity: 'warning',
          message: `${key} contiene una referencia que aún no usa un ID resuelto o kebab-case.`,
          sourceRange: objectRange,
          panel: 'metadata',
        });
      }
    }
  }
  const hasErrors = diagnostics.some(d => d.severity === 'error' || d.severity === 'critical');
  return { valid: !hasErrors, schemaName: type, diagnostics };
}

export function projectMetadata(esmNodes: EstreeNode[]): {
  metadata: MetadataProjection;
  diagnostics: EditorDiagnostic[];
} {
  for (const node of esmNodes) {
    const estree = (node.data as { estree?: EstreeNode } | undefined)?.estree;
    if (!estree) continue;
    const objectNode = findMetadataInitializer(estree);
    if (!objectNode) continue;
    const objectRange = nodeRange(objectNode);
    if (objectNode.type !== 'ObjectExpression') {
      return {
        metadata: {
          status: 'unsupported',
          value: null,
          objectRange,
          properties: [],
          schemaValid: false,
        },
        diagnostics: [diagnostic(
          'METADATA_DYNAMIC_UNSUPPORTED',
          'export const metadata debe ser un objeto literal estático; no se ejecutará la expresión.',
          objectRange,
        )],
      };
    }
    try {
      const value = readStaticEstreeValue(objectNode);
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Metadata must be an object');
      const record = value as Record<string, unknown>;
      const validation = validateProjectedMetadata(record, objectRange);
      return {
        metadata: {
          status: 'readable',
          value: record,
          objectRange,
          properties: projectProperties(objectNode),
          schemaValid: validation.valid,
          schemaName: validation.schemaName,
        },
        diagnostics: validation.diagnostics,
      };
    } catch (error) {
      return {
        metadata: {
          status: 'unsupported',
          value: null,
          objectRange,
          properties: projectProperties(objectNode),
          schemaValid: false,
        },
        diagnostics: [diagnostic(
          'METADATA_DYNAMIC_UNSUPPORTED',
          `No se puede leer metadata dinámica sin ejecutar código: ${error instanceof Error ? error.message : String(error)}`,
          objectRange,
        )],
      };
    }
  }

  return {
    metadata: { status: 'missing', value: null, properties: [], schemaValid: false },
    diagnostics: [diagnostic('METADATA_EXPORT_MISSING', 'No existe export const metadata en el documento.')],
  };
}
