import type { EditorMode, EditorValidationResult } from '../core/editorTypes';
import type { VisualCompatibility } from '../document/documentTypes';
import type { EditorPersistenceStatus } from '../state/editorPersistenceState';
import type { DiagramSyncStatus } from '../diagrams/state/types';

export type SafetyLevel = 'safe' | 'attention' | 'blocked' | 'error';

export interface SafetyAction {
  id: string;
  label: string;
  description: string;
}

export interface SafetyReason {
  id: string;
  level: SafetyLevel;
  title: string;
  description: string;
}

export interface SafetyPresentation {
  level: SafetyLevel;
  title: string;
  description: string;
  reasons: SafetyReason[];
  allowedActions: SafetyAction[];
  blockedActions: SafetyAction[];
  recommendedAction?: SafetyAction;
}

export interface EditorSafetyInput {
  currentFile: string | null;
  compatibility: VisualCompatibility;
  compatibilityReasons: string[];
  persistenceStatus: EditorPersistenceStatus;
  validation: EditorValidationResult;
  editorMode: EditorMode;
  isDiagramFile: boolean;
}

const ACTIONS = {
  editCode: {
    id: 'edit-code',
    label: 'Editar código',
    description: 'El source completo permanece como representación autoritativa.',
  },
  editVisual: {
    id: 'edit-visual',
    label: 'Editar bloques seguros',
    description: 'Solo se modifican rangos localizados que el motor puede verificar.',
  },
  reviewDiff: {
    id: 'review-diff',
    label: 'Revisar diff',
    description: 'Muestra los cambios antes de tocar el archivo real.',
  },
  saveDraft: {
    id: 'save-draft',
    label: 'Guardar borrador',
    description: 'Conserva una copia local de trabajo sin aplicarla al archivo.',
  },
  applyFile: {
    id: 'apply-file',
    label: 'Aplicar al archivo',
    description: 'Escribe el archivo real mediante persistencia transaccional y backup.',
  },
  resolveConflict: {
    id: 'resolve-conflict',
    label: 'Resolver conflicto',
    description: 'Compara la versión local con la externa antes de continuar.',
  },
} satisfies Record<string, SafetyAction>;

function compatibilityPresentation(
  compatibility: VisualCompatibility,
  reasons: string[],
): SafetyPresentation {
  switch (compatibility) {
    case 'fully-editable':
      return {
        level: 'safe',
        title: 'Documento completamente editable',
        description: 'Todos los bloques proyectados admiten edición localizada y verificada.',
        reasons: [],
        allowedActions: [ACTIONS.editVisual, ACTIONS.editCode, ACTIONS.reviewDiff],
        blockedActions: [],
        recommendedAction: ACTIONS.editVisual,
      };
    case 'partially-editable':
      return {
        level: 'attention',
        title: 'Documento parcialmente editable',
        description: 'Las zonas seguras pueden editarse; los bloques opacos se preservan literalmente.',
        reasons: reasons.map((reason, index) => ({
          id: `compatibility-${index}`,
          level: 'attention',
          title: 'Bloque opaco preservado',
          description: reason,
        })),
        allowedActions: [ACTIONS.editVisual, ACTIONS.editCode, ACTIONS.reviewDiff],
        blockedActions: [],
        recommendedAction: ACTIONS.reviewDiff,
      };
    case 'read-only':
      return {
        level: 'blocked',
        title: 'Documento de solo lectura visual',
        description: 'El contenido puede inspeccionarse, pero no contiene rangos visuales editables seguros.',
        reasons: reasons.map((reason, index) => ({
          id: `read-only-${index}`,
          level: 'blocked',
          title: 'Edición visual bloqueada',
          description: reason,
        })),
        allowedActions: [ACTIONS.editCode],
        blockedActions: [ACTIONS.editVisual],
        recommendedAction: ACTIONS.editCode,
      };
    case 'unsupported':
      return {
        level: 'error',
        title: 'Documento no soportado en visual',
        description: 'El editor mantiene el source en código y bloquea cualquier proyección destructiva.',
        reasons: reasons.length > 0
          ? reasons.map((reason, index) => ({
            id: `unsupported-${index}`,
            level: 'error',
            title: 'Sintaxis no soportada',
            description: reason,
          }))
          : [{
            id: 'unsupported-parser',
            level: 'error',
            title: 'Parseo MDX fallido',
            description: 'El documento no puede proyectarse de forma segura.',
          }],
        allowedActions: [ACTIONS.editCode],
        blockedActions: [ACTIONS.editVisual, ACTIONS.applyFile],
        recommendedAction: ACTIONS.editCode,
      };
  }
}

function savePresentation(status: EditorPersistenceStatus, validation: EditorValidationResult): SafetyPresentation {
  const validationBlocked = !validation.canSave;
  switch (status.kind) {
    case 'idle':
      return {
        level: 'attention',
        title: 'Sin documento abierto',
        description: 'Seleccione un documento o diagrama para editar.',
        reasons: [],
        allowedActions: [],
        blockedActions: [ACTIONS.applyFile, ACTIONS.saveDraft],
      };
    case 'loading':
      return {
        level: 'attention',
        title: 'Cargando archivo',
        description: 'Las acciones de escritura están bloqueadas hasta terminar la lectura.',
        reasons: [],
        allowedActions: [],
        blockedActions: [ACTIONS.applyFile, ACTIONS.saveDraft],
      };
    case 'ready-clean':
      return {
        level: 'safe',
        title: 'Archivo limpio',
        description: 'No hay cambios locales pendientes.',
        reasons: [],
        allowedActions: [ACTIONS.editCode, ACTIONS.editVisual],
        blockedActions: [],
      };
    case 'ready-dirty':
      return {
        level: validationBlocked ? 'blocked' : 'attention',
        title: validationBlocked ? 'Cambios locales bloqueados por validación' : 'Cambios locales',
        description: validationBlocked
          ? 'El archivo real no se aplicará hasta resolver los errores críticos.'
          : 'Los cambios existen solo en el editor hasta guardar borrador o revisar el diff y aplicar.',
        reasons: validation.issues.map(issue => ({
          id: issue.id,
          level: issue.severity === 'error' ? 'error' : 'attention',
          title: issue.severity === 'error' ? 'Error de validación' : 'Aviso de validación',
          description: issue.message,
        })),
        allowedActions: validationBlocked ? [ACTIONS.saveDraft, ACTIONS.reviewDiff] : [ACTIONS.saveDraft, ACTIONS.reviewDiff, ACTIONS.applyFile],
        blockedActions: validationBlocked ? [ACTIONS.applyFile] : [],
        recommendedAction: ACTIONS.reviewDiff,
      };
    case 'validating':
      return {
        level: 'attention',
        title: 'Validando cambios',
        description: 'El guardado espera a que el candidato sea comprobado.',
        reasons: [],
        allowedActions: [ACTIONS.saveDraft],
        blockedActions: [ACTIONS.applyFile],
      };
    case 'blocked':
      return {
        level: 'blocked',
        title: 'Guardado bloqueado',
        description: status.reason,
        reasons: [{
          id: 'blocked-save',
          level: 'blocked',
          title: 'La operación no es segura',
          description: status.reason,
        }],
        allowedActions: [ACTIONS.editCode, ACTIONS.reviewDiff],
        blockedActions: [ACTIONS.applyFile],
        recommendedAction: ACTIONS.reviewDiff,
      };
    case 'saving-draft':
      return {
        level: 'attention',
        title: 'Guardando borrador',
        description: 'Se está guardando una copia de trabajo; el archivo real no se modifica.',
        reasons: [],
        allowedActions: [],
        blockedActions: [ACTIONS.applyFile],
      };
    case 'draft-saved':
      return {
        level: 'attention',
        title: 'Borrador guardado',
        description: 'Existe un borrador, pero el archivo real aún no está aplicado.',
        reasons: [],
        allowedActions: [ACTIONS.reviewDiff, ACTIONS.applyFile],
        blockedActions: [],
        recommendedAction: ACTIONS.reviewDiff,
      };
    case 'saving-file':
      return {
        level: 'attention',
        title: 'Aplicando al archivo',
        description: 'La persistencia está escribiendo el archivo real con backup previo.',
        reasons: [],
        allowedActions: [],
        blockedActions: [ACTIONS.saveDraft, ACTIONS.applyFile],
      };
    case 'saved':
      return {
        level: 'safe',
        title: 'Archivo guardado',
        description: `El archivo real fue aplicado. Backup creado: ${status.backupId}.`,
        reasons: [],
        allowedActions: [ACTIONS.editCode, ACTIONS.editVisual],
        blockedActions: [],
      };
    case 'save-error':
      return {
        level: 'error',
        title: 'Error al guardar',
        description: 'Los cambios locales se conservan. Revise la causa y reintente.',
        reasons: [{
          id: 'save-error',
          level: 'error',
          title: 'Persistencia rechazada',
          description: 'message' in status.error && status.error.message ? status.error.message : status.error.kind,
        }],
        allowedActions: [ACTIONS.saveDraft, ACTIONS.reviewDiff],
        blockedActions: [ACTIONS.applyFile],
        recommendedAction: ACTIONS.reviewDiff,
      };
    case 'conflict':
      return {
        level: 'error',
        title: 'Conflicto con una versión externa',
        description: 'El archivo cambió fuera de esta sesión. No se sobrescribirá automáticamente.',
        reasons: [{
          id: 'content-conflict',
          level: 'error',
          title: 'Revisión externa detectada',
          description: `Esperada ${status.expectedVersion}; actual ${status.actualVersion}.`,
        }],
        allowedActions: [ACTIONS.saveDraft, ACTIONS.resolveConflict, ACTIONS.reviewDiff],
        blockedActions: [ACTIONS.applyFile],
        recommendedAction: ACTIONS.resolveConflict,
      };
    case 'cancelled':
      return {
        level: 'attention',
        title: 'Operación cancelada',
        description: 'La acción anterior fue cancelada y el estado local se conserva.',
        reasons: [],
        allowedActions: [ACTIONS.reviewDiff],
        blockedActions: [],
      };
    case 'unsupported':
      return {
        level: 'error',
        title: 'Archivo no compatible',
        description: status.reason,
        reasons: [{
          id: 'unsupported-file',
          level: 'error',
          title: 'Compatibilidad bloqueante',
          description: status.reason,
        }],
        allowedActions: [ACTIONS.editCode],
        blockedActions: [ACTIONS.editVisual, ACTIONS.applyFile],
      };
  }
}

function strongestLevel(levels: SafetyLevel[]): SafetyLevel {
  if (levels.includes('error')) return 'error';
  if (levels.includes('blocked')) return 'blocked';
  if (levels.includes('attention')) return 'attention';
  return 'safe';
}

export function buildEditorSafetyPresentation(input: EditorSafetyInput): SafetyPresentation {
  if (!input.currentFile) return savePresentation(input.persistenceStatus, input.validation);
  if (input.isDiagramFile) {
    return {
      level: input.persistenceStatus.kind === 'save-error' || input.persistenceStatus.kind === 'conflict' ? 'error' : 'safe',
      title: 'Diagrama TSX abierto',
      description: 'La autoridad modelo/fuente se muestra dentro del workbench de diagramas.',
      reasons: [],
      allowedActions: [ACTIONS.editCode],
      blockedActions: [],
    };
  }

  const compatibility = compatibilityPresentation(input.compatibility, input.compatibilityReasons);
  const save = savePresentation(input.persistenceStatus, input.validation);
  const level = strongestLevel([compatibility.level, save.level]);

  return {
    level,
    title: save.level === 'safe' ? compatibility.title : save.title,
    description: `${compatibility.description} ${save.description}`,
    reasons: [...compatibility.reasons, ...save.reasons],
    allowedActions: [...compatibility.allowedActions, ...save.allowedActions]
      .filter((action, index, actions) => actions.findIndex(candidate => candidate.id === action.id) === index),
    blockedActions: [...compatibility.blockedActions, ...save.blockedActions]
      .filter((action, index, actions) => actions.findIndex(candidate => candidate.id === action.id) === index),
    recommendedAction: save.recommendedAction ?? compatibility.recommendedAction,
  };
}

export function buildDiagramAuthorityPresentation(status: DiagramSyncStatus, isDirty: boolean): SafetyPresentation {
  switch (status) {
    case 'synced':
      return {
        level: 'safe',
        title: 'Modelo y fuente sincronizados',
        description: isDirty ? 'Hay cambios locales pendientes de confirmar.' : 'La vista visual y el TSX representan el mismo diagrama.',
        reasons: [],
        allowedActions: [ACTIONS.editVisual, ACTIONS.editCode],
        blockedActions: [],
      };
    case 'visual-authoritative':
      return {
        level: 'attention',
        title: 'Modelo visual autoritativo',
        description: 'El modelo visual contiene los cambios recientes. Revise la fuente generada antes de guardar.',
        reasons: [],
        allowedActions: [ACTIONS.reviewDiff],
        blockedActions: [],
        recommendedAction: ACTIONS.reviewDiff,
      };
    case 'source-authoritative':
      return {
        level: 'attention',
        title: 'Fuente TSX autoritativa',
        description: 'La fuente contiene los cambios recientes. El modelo visual se actualizará solo tras parseo válido.',
        reasons: [],
        allowedActions: [ACTIONS.reviewDiff],
        blockedActions: [],
        recommendedAction: ACTIONS.reviewDiff,
      };
    case 'diverged':
      return {
        level: 'blocked',
        title: 'Modelo y fuente divergentes',
        description: 'Ambas representaciones cambiaron. El guardado está bloqueado hasta elegir una autoridad y revisar el diff.',
        reasons: [{
          id: 'diagram-diverged',
          level: 'blocked',
          title: 'Autoridad ambigua',
          description: 'Guardar ahora podría descartar cambios de una representación.',
        }],
        allowedActions: [ACTIONS.reviewDiff],
        blockedActions: [ACTIONS.applyFile],
        recommendedAction: ACTIONS.reviewDiff,
      };
    case 'invalid-source':
      return {
        level: 'error',
        title: 'Fuente TSX inválida',
        description: 'El TSX no puede convertirse en modelo. No se reutiliza el modelo anterior como representación actual.',
        reasons: [{
          id: 'diagram-invalid-source',
          level: 'error',
          title: 'Parseo de fuente fallido',
          description: 'Corrija el código o conserve el modelo visual tras revisar los cambios.',
        }],
        allowedActions: [ACTIONS.editCode, ACTIONS.reviewDiff],
        blockedActions: [ACTIONS.applyFile],
      };
    case 'saving':
      return {
        level: 'attention',
        title: 'Guardando diagrama',
        description: 'La fuente TSX se está persistiendo mediante la API segura.',
        reasons: [],
        allowedActions: [],
        blockedActions: [ACTIONS.applyFile],
      };
    case 'conflict':
      return {
        level: 'error',
        title: 'Conflicto del diagrama',
        description: 'El TSX cambió externamente. Compare antes de reintentar.',
        reasons: [{
          id: 'diagram-conflict',
          level: 'error',
          title: 'Versión externa detectada',
          description: 'La versión local no se sobrescribirá automáticamente.',
        }],
        allowedActions: [ACTIONS.resolveConflict, ACTIONS.reviewDiff],
        blockedActions: [ACTIONS.applyFile],
      };
  }
}
