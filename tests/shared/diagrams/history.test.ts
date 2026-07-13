import { describe, expect, it } from 'vitest';
import {
  canRedo,
  canUndo,
  createCommandHistory,
  createDiagramCommand,
  executeCommand,
  redoCommand,
  undoCommand,
} from '../../../src/shared/diagrams/public';

describe('diagram command history', () => {
  it('undoes and redoes deterministic snapshots and clears redo after a branch', () => {
    const initial = { x: 0, label: 'A' };
    const moved = { x: 1, label: 'A' };
    const renamed = { x: 1, label: 'B' };
    let history = createCommandHistory(initial);
    history = executeCommand(history, createDiagramCommand('move', 'Mover A', initial, moved));
    history = executeCommand(history, createDiagramCommand('rename', 'Renombrar A', moved, renamed));
    expect(canUndo(history)).toBe(true);
    history = undoCommand(history);
    expect(history.present).toEqual(moved);
    expect(canRedo(history)).toBe(true);
    history = redoCommand(history);
    expect(history.present).toEqual(renamed);
    history = undoCommand(history);
    const branched = executeCommand(history, createDiagramCommand('move-2', 'Mover otra vez', moved, { ...moved, x: 3 }));
    expect(branched.future).toEqual([]);
  });

  it('coalesces consecutive drag commands with the same merge key', () => {
    let history = createCommandHistory({ x: 0 });
    history = executeCommand(history, createDiagramCommand('m1', 'Mover', { x: 0 }, { x: 1 }, 'viewport', 1_000));
    history = executeCommand(history, createDiagramCommand('m2', 'Mover', { x: 1 }, { x: 2 }, 'viewport', 1_300));
    expect(history.past).toHaveLength(1);
    expect(undoCommand(history).present).toEqual({ x: 0 });
  });

  it('starts a new command after the merge window has elapsed', () => {
    let history = createCommandHistory({ x: 0 });
    history = executeCommand(history, createDiagramCommand('m1', 'Mover', { x: 0 }, { x: 1 }, 'viewport', 1_000));
    history = executeCommand(history, createDiagramCommand('m2', 'Mover', { x: 1 }, { x: 2 }, 'viewport', 2_000));
    expect(history.past).toHaveLength(2);
    expect(undoCommand(history).present).toEqual({ x: 1 });
  });
});
