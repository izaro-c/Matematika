import type { DiagramState, DiagramAction, DiagramSyncStatus, DiagramParseStatus } from './types';

export const initialDiagramState: DiagramState = {
  filePath: null,
  componentName: '',
  originalSource: '',
  currentSource: '',
  originalModel: null,
  currentModel: null,
  status: 'synced',
  parseStatus: 'parsed',
  expectedVersion: null,
  diagnostics: [],
  selectedId: '',
  activeStepId: '',
  canvasTool: 'select',
};

function statusForParseStatus(parseStatus: DiagramParseStatus): DiagramSyncStatus {
  if (parseStatus === 'parsed') return 'synced';
  if (parseStatus === 'unsupported') return 'source-authoritative';
  return 'invalid-source';
}

export function diagramReducer(state: DiagramState, action: DiagramAction): DiagramState {
  switch (action.type) {
    case 'LOAD_DIAGRAM': {
      const parseStatus = action.parseStatus ?? (action.model ? 'parsed' : 'invalid');
      const diagnostics = action.diagnostics ?? [];
      const model = parseStatus === 'parsed' ? action.model : null;
      const status = statusForParseStatus(parseStatus);
      return {
        ...state,
        filePath: action.filePath,
        componentName: action.componentName,
        originalSource: action.source,
        currentSource: action.source,
        originalModel: model,
        currentModel: model,
        status,
        parseStatus,
        expectedVersion: action.expectedVersion ?? null,
        diagnostics,
        selectedId: model?.points[0]?.id || '',
        activeStepId: '',
        canvasTool: 'select',
      };
    }

    case 'VISUAL_EDIT': {
      let nextStatus: DiagramSyncStatus = state.status;
      if (state.status === 'synced' || state.status === 'visual-authoritative') {
        nextStatus = 'visual-authoritative';
      } else if (state.status === 'source-authoritative') {
        nextStatus = 'diverged';
      }
      return {
        ...state,
        currentModel: action.model,
        parseStatus: 'parsed',
        status: nextStatus,
      };
    }

    case 'SOURCE_EDIT': {
      let nextStatus: DiagramSyncStatus = state.status;
      if (state.status === 'synced' || state.status === 'source-authoritative') {
        nextStatus = 'source-authoritative';
      } else if (state.status === 'visual-authoritative') {
        nextStatus = 'diverged';
      } else if (state.status === 'invalid-source') {
        nextStatus = 'source-authoritative';
      }
      return {
        ...state,
        currentSource: action.source,
        parseStatus: state.parseStatus,
        status: nextStatus,
      };
    }

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedId: action.id,
      };

    case 'SET_CANVAS_TOOL':
      return {
        ...state,
        canvasTool: action.tool,
      };

    case 'SET_ACTIVE_STEP':
      return {
        ...state,
        activeStepId: action.stepId,
      };

    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
      };

    case 'SET_DIAGNOSTICS':
      return {
        ...state,
        diagnostics: action.diagnostics,
      };

    case 'APPLY_PARSED_MODEL':
      return {
        ...state,
        currentModel: action.model,
        diagnostics: action.diagnostics,
        parseStatus: 'parsed',
        status: state.currentSource === state.originalSource ? 'synced' : 'source-authoritative',
      };

    case 'PARSE_UNSUPPORTED':
      return {
        ...state,
        currentModel: null,
        diagnostics: action.diagnostics,
        parseStatus: 'unsupported',
        status: 'source-authoritative',
      };

    case 'PARSE_FAILED':
      return {
        ...state,
        currentModel: null,
        diagnostics: action.diagnostics,
        parseStatus: 'invalid',
        status: 'invalid-source',
      };

    case 'RESOLVE_TO_VISUAL':
      return {
        ...state,
        currentSource: action.source,
        status: 'visual-authoritative',
        parseStatus: 'parsed',
        diagnostics: state.diagnostics.filter(d => d.source !== 'synchronization'),
      };

    case 'RESOLVE_TO_SOURCE':
      return {
        ...state,
        currentModel: action.model,
        status: 'source-authoritative',
        parseStatus: 'parsed',
        diagnostics: state.diagnostics.filter(d => d.source !== 'synchronization'),
      };

    case 'SAVE_START':
      return {
        ...state,
        status: 'saving',
      };

    case 'SAVE_SUCCESS':
      return {
        ...state,
        originalSource: action.source,
        currentSource: action.source,
        originalModel: action.model,
        currentModel: action.model,
        status: 'synced',
        parseStatus: action.model ? 'parsed' : state.parseStatus,
        expectedVersion: action.expectedVersion,
        diagnostics: [],
      };

    case 'SAVE_FAILURE':
      return {
        ...state,
        status: action.isConflict ? 'conflict' : 'visual-authoritative',
        diagnostics: [
          ...state.diagnostics,
          {
            code: 'save-error',
            severity: 'error',
            message: action.error,
            source: 'synchronization',
          },
        ],
      };

    default:
      return state;
  }
}
