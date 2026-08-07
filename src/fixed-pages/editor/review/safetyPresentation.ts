import type { EditorMode, EditorValidationResult } from '@/fixed-pages/editor/session/editorTypes';
import type { VisualCompatibility } from '../document/documentTypes';
import type { EditorPersistenceStatus } from '@/fixed-pages/editor/save/editorPersistenceState';
import type { DiagramSyncStatus } from '../diagrams/history/types';

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
  saveDraft: {
    id: 'save-draft',
    label: 'Guardar borrador',
    description: 'Conserva una copia local de trabajo sin aplicarla al archivo.',
  },
  applyFile: {
    id: 'apply-file',
    label: 'Guardar',
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
        title: 'Edición visual',
        description: 'Puedes editar el contenido con cambios localizados y seguros.',
        reasons: [],
        allowedActions: [ACTIONS.editVisual, ACTIONS.editCode],
        blockedActions: [],
        recommendedAction: ACTIONS.editVisual,
      };
    case 'partially-editable':
      return {
        level: 'attention',
        title: 'Edición parcial',
        description: 'Algunas zonas solo se pueden cambiar en Fuente; el resto se edita con seguridad.',
        reasons: reasons.map((reason, index) => ({
          id: `compatibility-${index}`,
          level: 'attention',
          title: 'Bloque opaco preservado',
          description: reason,
        })),
        allowedActions: [ACTIONS.editVisual, ACTIONS.editCode],
        blockedActions: [],
        recommendedAction: ACTIONS.editVisual,
      };
    case 'read-only':
      return {
        level: 'blocked',
        title: 'Edición de código con vista previa',
        description: 'El documento se puede editar como código y previsualizar, pero no contiene rangos visuales exactos.',
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
        title: 'Recurso MDX inválido',
        description: 'El análisis sintáctico falló. El editor conserva el código y bloquea cualquier proyección o guardado destructivo.',
        reasons: reasons.length > 0
          ? reasons.map((reason, index) => ({
            id: `unsupported-${index}`,
            level: 'error' as const,
            title: 'Sintaxis MDX inválida',
            description: reason,
          }))
          : [{
            id: 'unsupported-parser',
            level: 'error' as const,
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
          : 'Los cambios existen solo en el editor hasta guardar borrador o guardar el archivo.',
        reasons: validation.issues.map(issue => ({
          id: issue.id,
          level: issue.severity === 'error' ? 'error' : 'attention',
          title: issue.severity === 'error' ? 'Error de validación' : 'Aviso de validación',
          description: issue.message,
        })),
        allowedActions: validationBlocked ? [ACTIONS.saveDraft] : [ACTIONS.saveDraft, ACTIONS.applyFile],
        blockedActions: validationBlocked ? [ACTIONS.applyFile] : [],
        recommendedAction: validationBlocked ? ACTIONS.saveDraft : ACTIONS.applyFile,
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
        allowedActions: [ACTIONS.editCode],
        blockedActions: [ACTIONS.applyFile],
        recommendedAction: ACTIONS.editCode,
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
        allowedActions: [ACTIONS.applyFile],
        blockedActions: [],
        recommendedAction: ACTIONS.applyFile,
      };
    case 'saving-file':
      return {
        level: 'attention',
        title: 'Guardando archivo',
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
        allowedActions: [ACTIONS.saveDraft, ACTIONS.applyFile],
        blockedActions: [],
        recommendedAction: ACTIONS.applyFile,
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
        allowedActions: [ACTIONS.saveDraft, ACTIONS.resolveConflict],
        blockedActions: [ACTIONS.applyFile],
        recommendedAction: ACTIONS.resolveConflict,
      };
    case 'cancelled':
      return {
        level: 'attention',
        title: 'Operación cancelada',
        description: 'La acción anterior fue cancelada y el estado local se conserva.',
        reasons: [],
        allowedActions: [ACTIONS.applyFile],
        blockedActions: [],
      };
    case 'unsupported':
      return {
        level: 'error',
        title: 'Recurso inválido',
        description: status.reason,
        reasons: [{
          id: 'unsupported-file',
          level: 'error',
          title: 'Validación bloqueante',
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
      title: 'Diagrama abierto',
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
        recommendedAction: isDirty ? ACTIONS.applyFile : undefined,
      };
    case 'visual-authoritative':
      return {
        level: 'attention',
        title: 'Modelo visual autoritativo',
        description: 'El modelo visual contiene los cambios recientes. Guarde para persistir la fuente generada.',
        reasons: [],
        allowedActions: [ACTIONS.applyFile],
        blockedActions: [],
        recommendedAction: ACTIONS.applyFile,
      };
    case 'source-authoritative':
      return {
        level: 'attention',
        title: 'Edición de código con vista previa',
        description: isDirty
          ? 'El TSX completo contiene cambios locales. La vista visual no puede regenerarlo sin perder código.'
          : 'El TSX completo es la única representación autoritativa; se ejecuta una vista previa del componente guardado.',
        reasons: [],
        allowedActions: isDirty ? [ACTIONS.applyFile, ACTIONS.editCode] : [ACTIONS.editCode],
        blockedActions: [],
        recommendedAction: isDirty ? ACTIONS.applyFile : ACTIONS.editCode,
      };
    case 'diverged':
      return {
        level: 'blocked',
        title: 'Modelo y fuente divergentes',
        description: 'Ambas representaciones cambiaron. El guardado está bloqueado hasta elegir una autoridad.',
        reasons: [{
          id: 'diagram-diverged',
          level: 'blocked',
          title: 'Autoridad ambigua',
          description: 'Guardar ahora podría descartar cambios de una representación.',
        }],
        allowedActions: [ACTIONS.editCode, ACTIONS.editVisual],
        blockedActions: [ACTIONS.applyFile],
      };
    case 'invalid-source':
      return {
        level: 'error',
        title: 'Fuente inválida',
        description: 'El TSX no puede convertirse en modelo. No se reutiliza el modelo anterior como representación actual.',
        reasons: [{
          id: 'diagram-invalid-source',
          level: 'error',
          title: 'Parseo de fuente fallido',
          description: 'Corrija el código o conserve el modelo visual tras revisar los cambios.',
        }],
        allowedActions: [ACTIONS.editCode],
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
        allowedActions: [ACTIONS.resolveConflict],
        blockedActions: [ACTIONS.applyFile],
        recommendedAction: ACTIONS.resolveConflict,
      };
  }
}
