import type { DiagramState, DiagramAction, DiagramSyncStatus } from './types';

export const initialDiagramState: DiagramState = {
  filePath: null,
  componentName: '',
  originalSource: '',
  currentSource: '',
  originalModel: null,
  currentModel: null,
  status: 'synced',
  diagnostics: [],
  selectedId: '',
  activeStepId: '',
  canvasTool: 'select',
};

export function diagramReducer(state: DiagramState, action: DiagramAction): DiagramState {
  switch (action.type) {
    case 'LOAD_DIAGRAM':
      return {
        ...state,
        filePath: action.filePath,
        componentName: action.componentName,
        originalSource: action.source,
        currentSource: action.source,
        originalModel: action.model,
        currentModel: action.model,
        status: 'synced',
        diagnostics: [],
        selectedId: action.model?.points[0]?.id || '',
        activeStepId: '',
        canvasTool: 'select',
      };

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
        status: state.currentSource === state.originalSource ? 'synced' : 'source-authoritative',
      };

    case 'PARSE_FAILED':
      return {
        ...state,
        diagnostics: action.diagnostics,
        status: 'invalid-source',
      };

    case 'RESOLVE_TO_VISUAL':
      return {
        ...state,
        currentSource: action.source,
        status: 'visual-authoritative',
        diagnostics: state.diagnostics.filter(d => d.source !== 'synchronization'),
      };

    case 'RESOLVE_TO_SOURCE':
      return {
        ...state,
        currentModel: action.model,
        status: 'source-authoritative',
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
