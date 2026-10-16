import { editorMessage, type EditorMessage } from '@/fixed-pages/editor/types/editorMessage';

/** Motivo por el que no se puede guardar mientras haya errores de validación (singular o plural). */
export function saveBlockedByValidation(errorCount: number): EditorMessage {
  return errorCount === 1
    ? editorMessage('errors.saveBlockedByValidationOne')
    : editorMessage('errors.saveBlockedByValidationOther', { count: errorCount });
}
