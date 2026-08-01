import { reparseEditedDocument } from './applySourceEdits';
import { parseEditorDocument } from './parseEditorDocument';
import type { EditorDocument, SourceEdit } from './documentTypes';

export interface EditorDocumentSession {
  document: EditorDocument;
  mode: 'code' | 'visual';
  appliedOperationIds: string[];
}

export function openEditorDocument(source: string): EditorDocumentSession {
  return { document: parseEditorDocument(source), mode: 'code', appliedOperationIds: [] };
}

export function enterVisualMode(session: EditorDocumentSession): EditorDocumentSession {
  if (session.document.compatibility === 'unsupported') return session;
  return { ...session, mode: 'visual' };
}

export function applyVisualOperation(session: EditorDocumentSession, operation: SourceEdit): EditorDocumentSession {
  if (session.mode !== 'visual') throw new Error('Visual operation requires visual mode');
  const document = reparseEditedDocument(session.document, session.document.sourceFingerprint, [operation]);
  return { ...session, document, appliedOperationIds: [...session.appliedOperationIds, operation.operationId] };
}

export function leaveVisualMode(session: EditorDocumentSession): EditorDocumentSession {
  return session.mode === 'visual' ? { ...session, mode: 'code' } : session;
}

export function serializeCurrentSource(session: EditorDocumentSession): string {
  return session.document.source;
}
