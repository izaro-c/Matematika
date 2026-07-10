import { SourceEdit, SourceEditResult, EditorDocument } from './documentTypes';
import { parseEditorDocument } from './parseEditorDocument';

/**
 * Applies a list of localized edits to the original source.
 */
export function applySourceEdits(source: string, edits: SourceEdit[]): SourceEditResult {
  // 1. Boundary & parameter validation
  for (const edit of edits) {
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
export function reparseEditedDocument(source: string, edits: SourceEdit[]): EditorDocument {
  const result = applySourceEdits(source, edits);
  if (!result.success || result.output === undefined) {
    throw new Error(result.error || 'Failed to apply edits');
  }

  const newDoc = parseEditorDocument(result.output);
  
  // 6. Diff check: Verify that only the edited blocks were mutated and no opaque blocks were touched
  const origDoc = parseEditorDocument(source);
  
  // Verify that any block outside the edited ranges is identical in source content
  for (const block of origDoc.blocks) {
    // Check if this block range overlaps with any edit range
    const isEdited = edits.some(edit => {
      const start = Math.min(edit.range.start, edit.range.end);
      const end = Math.max(edit.range.start, edit.range.end);
      const bStart = block.location.range.start;
      const bEnd = block.location.range.end;
      return !(end <= bStart || start >= bEnd);
    });

    if (!isEdited) {
      // Find the corresponding block in the new document by structural position or search
      const origContent = block.kind === 'editable' ? block.originalSource : block.source;
      
      // Let's ensure that the block content can still be found in the new source if it was not touched.
      // (For untouched blocks, their literal source must remain intact).
      if (!result.output.includes(origContent)) {
        throw new Error(`Untouched block ${block.id} content was corrupted or lost during editing`);
      }
    }
  }

  return newDoc;
}
