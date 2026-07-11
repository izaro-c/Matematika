import { SourceEdit, SourceEditResult, EditorDocument } from './documentTypes';
import { computeHash, parseEditorDocument } from './parseEditorDocument';

/**
 * Applies a list of localized edits to the original source.
 */
export function applySourceEdits(source: string, edits: SourceEdit[]): SourceEditResult {
  const operationIds = new Set<string>();
  // 1. Boundary & parameter validation
  for (const edit of edits) {
    if (operationIds.has(edit.operationId)) {
      return { success: false, error: `Duplicate operation id: ${edit.operationId}` };
    }
    operationIds.add(edit.operationId);
    if (edit.range.start < 0 || edit.range.end > source.length) {
      return { success: false, error: `Edit range [${edit.range.start}, ${edit.range.end}] is out of bounds for source length ${source.length}` };
    }
    if (edit.range.start > edit.range.end) {
      return { success: false, error: `Invalid negative edit range [${edit.range.start}, ${edit.range.end}]` };
    }

    // 2. Expected source verification
    const currentText = source.slice(edit.range.start, edit.range.end);
    if (currentText !== edit.expectedSource) {
      return {
        success: false,
        error: `Expected source mismatch at range [${edit.range.start}, ${edit.range.end}]. Expected: ${JSON.stringify(edit.expectedSource)}, Found: ${JSON.stringify(currentText)}`
      };
    }
  }

  // 3. Sort edits descending by start offset to prevent coordinate shifts
  const sortedEdits = [...edits].sort((a, b) => b.range.start - a.range.start);

  // 4. Overlap detection
  for (let i = 0; i < sortedEdits.length - 1; i++) {
    const higher = sortedEdits[i];
    const lower = sortedEdits[i + 1];
    if (lower.range.start === lower.range.end && higher.range.start === higher.range.end && lower.range.start === higher.range.start) {
      return { success: false, error: `Ambiguous insertions at offset ${lower.range.start}` };
    }
    if (lower.range.end > higher.range.start) {
      return { success: false, error: `Overlapping edits detected between [${lower.range.start}, ${lower.range.end}] and [${higher.range.start}, ${higher.range.end}]` };
    }
  }

  // 5. Apply parches atomically
  let output = source;
  for (const edit of sortedEdits) {
    output = output.slice(0, edit.range.start) + edit.replacement + output.slice(edit.range.end);
  }

  return { success: true, output };
}

/**
 * Reparses the edited source content and validates range invariants.
 */
export function reparseEditedDocument(document: EditorDocument, baseHash: string, edits: SourceEdit[]): EditorDocument {
  if (document.sourceHash !== baseHash || computeHash(document.source) !== baseHash) {
    throw new Error('Stale document revision');
  }

  for (const edit of edits) {
    const block = document.bodyBlocks.find(candidate => candidate.id === edit.blockId);
    if (!block) throw new Error(`Unknown block: ${edit.blockId}`);
    if (block.kind !== 'editable') throw new Error(`Opaque block cannot be edited: ${edit.blockId}`);
    if (block.editRange.start !== edit.range.start || block.editRange.end !== edit.range.end) {
      throw new Error(`Edit range does not match editable range for block: ${edit.blockId}`);
    }
  }

  const result = applySourceEdits(document.source, edits);
  if (!result.success || result.output === undefined) {
    throw new Error(result.error || 'Failed to apply edits');
  }

  const newDoc = parseEditorDocument(result.output);
  if (newDoc.compatibility === 'unsupported') {
    throw new Error('Edit result is not valid project MDX');
  }

  // Applying replacements to exact slices already constructs this candidate. Rebuild
  // it independently to prove every changed byte belongs to an authorized range.
  const verified = applySourceEdits(document.source, edits);
  if (!verified.success || verified.output !== newDoc.source) throw new Error('Unauthorized source change detected');

  return newDoc;
}
