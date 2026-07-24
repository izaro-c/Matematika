import type { DiagramTarget } from '@/features/editor/core/editorTypes';
import type { DiagramDiagnostic } from '../source/generator';
import type { VisualDiagramModel } from '../model/types';
import { humanizeDiagnostic } from './humanize';
import { parseDiagnosticPath, parsePathFromMessage, splitLegacyDiagnosticParts } from './locationParsing';
import { buildDiagnosticLocation, refinePointLocation } from './locationResolution';
import type { DiagramDiagnosticLocation, EnrichedDiagramDiagnostic } from './types';

function expandLegacyDiagnostic(diagnostic: DiagramDiagnostic): DiagramDiagnostic[] {
  if (diagnostic.path && diagnostic.path.length > 0) return [diagnostic];

  const parts = splitLegacyDiagnosticParts(diagnostic.message);
  if (parts.length <= 1) return [diagnostic];

  return parts.map((part, index) => {
    const parsed = parsePathFromMessage(part);
    if (!parsed) return { ...diagnostic, message: part };
    return {
      ...diagnostic,
      message: parsed.rest || part,
      path: parsed.path,
      code: `${diagnostic.code}-${index}`,
    };
  });
}

function finalizeLocation(
  diagnostic: DiagramDiagnostic,
  model: VisualDiagramModel | null,
): DiagramDiagnosticLocation {
  const parsed = diagnostic.path && diagnostic.path.length > 0
    ? parseDiagnosticPath(diagnostic.path)
    : (() => {
      const fromMessage = parsePathFromMessage(diagnostic.message);
      return fromMessage ? parseDiagnosticPath(fromMessage.path) : {};
    })();

  return refinePointLocation(buildDiagnosticLocation(diagnostic, model, parsed), model, diagnostic);
}

export function enrichDiagramDiagnostics(
  diagnostics: readonly DiagramDiagnostic[],
  model: VisualDiagramModel | null,
  targets: DiagramTarget[] = [],
): EnrichedDiagramDiagnostic[] {
  const expanded = diagnostics.flatMap(expandLegacyDiagnostic);

  return expanded.map((diagnostic, index) => {
    const location = finalizeLocation(diagnostic, model);
    const humanized = humanizeDiagnostic(diagnostic, location, location.objectId, targets);
    const id = `${diagnostic.code}-${location.objectId ?? location.collection ?? 'global'}-${index}`;

    return {
      id,
      severity: diagnostic.severity,
      code: diagnostic.code,
      title: humanized.title,
      message: humanized.message,
      hint: humanized.hint,
      location,
      rawMessage: diagnostic.message,
    };
  });
}
