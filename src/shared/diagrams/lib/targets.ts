export type DiagramTargetState =
  | string
  | readonly string[]
  | null
  | undefined;

export type DiagramTargetMatcher = (targetId: string) => boolean;

export function isDiagramTargetActive(
  value: unknown,
  targetId: string,
): boolean {
  if (typeof value === 'string') return value === targetId;
  if (!Array.isArray(value)) return false;

  const targetIds: readonly unknown[] = value;
  return targetIds.includes(targetId);
}
