export interface DiagramCommand<T> {
  id: string;
  label: string;
  before: T;
  after: T;
  mergeKey?: string;
  timestamp: number;
}

export interface CommandHistory<T> {
  past: DiagramCommand<T>[];
  present: T;
  future: DiagramCommand<T>[];
  limit: number;
}

export function createCommandHistory<T>(present: T, limit = 100): CommandHistory<T> {
  return { past: [], present, future: [], limit };
}

export function createDiagramCommand<T>(
  id: string,
  label: string,
  before: T,
  after: T,
  mergeKey?: string,
  timestamp = Date.now(),
): DiagramCommand<T> {
  return { id, label, before, after, mergeKey, timestamp };
}

export function executeCommand<T>(history: CommandHistory<T>, command: DiagramCommand<T>): CommandHistory<T> {
  if (Object.is(history.present, command.after)) return history;
  const previous = history.past[history.past.length - 1];
  const canMerge = Boolean(
    command.mergeKey
    && previous?.mergeKey === command.mergeKey
    && command.timestamp - previous.timestamp >= 0
    && command.timestamp - previous.timestamp <= 600,
  );
  const normalizedCommand = { ...command, before: history.present };
  const nextCommand = canMerge && previous
    ? { ...normalizedCommand, before: previous.before }
    : normalizedCommand;
  const basePast = canMerge ? history.past.slice(0, -1) : history.past;
  const past = [...basePast, nextCommand].slice(-history.limit);
  return { ...history, past, present: command.after, future: [] };
}

export function undoCommand<T>(history: CommandHistory<T>): CommandHistory<T> {
  const command = history.past[history.past.length - 1];
  if (!command) return history;
  return {
    ...history,
    past: history.past.slice(0, -1),
    present: command.before,
    future: [command, ...history.future],
  };
}

export function redoCommand<T>(history: CommandHistory<T>): CommandHistory<T> {
  const command = history.future[0];
  if (!command) return history;
  return {
    ...history,
    past: [...history.past, command].slice(-history.limit),
    present: command.after,
    future: history.future.slice(1),
  };
}

export function canUndo<T>(history: CommandHistory<T>): boolean {
  return history.past.length > 0;
}

export function canRedo<T>(history: CommandHistory<T>): boolean {
  return history.future.length > 0;
}
