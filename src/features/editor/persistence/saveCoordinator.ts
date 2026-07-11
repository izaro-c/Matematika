import type { ContentRepository } from './contentRepository';
import type { DraftRepository } from './draftRepository';
import { asPersistenceError } from './persistenceErrors';
import type { EditorFileIdentity, EditorSaveSnapshot } from './persistenceContracts';

export type SaveCoordinatorEvent =
  | { type: 'draft-started'; snapshot: EditorSaveSnapshot }
  | { type: 'draft-succeeded'; snapshot: EditorSaveSnapshot; draftId: string }
  | { type: 'draft-failed'; snapshot: EditorSaveSnapshot; error: ReturnType<typeof asPersistenceError> }
  | { type: 'apply-started'; snapshot: EditorSaveSnapshot }
  | { type: 'apply-succeeded'; snapshot: EditorSaveSnapshot; version: string; backupId: string }
  | { type: 'apply-failed'; snapshot: EditorSaveSnapshot; error: ReturnType<typeof asPersistenceError> };

export interface TimerApi {
  set(callback: () => void, delay: number): unknown;
  clear(handle: unknown): void;
}

const browserTimers: TimerApi = {
  set: (callback, delay) => setTimeout(callback, delay),
  clear: handle => clearTimeout(handle as ReturnType<typeof setTimeout>)
};

export class SaveCoordinator {
  private timer: unknown;
  private draftController?: AbortController;
  private applyController?: AbortController;
  private generation = 0;
  private disposed = false;

  constructor(
    private readonly content: ContentRepository,
    private readonly drafts: DraftRepository,
    private readonly emit: (event: SaveCoordinatorEvent) => void,
    private readonly debounceMs = 500,
    private readonly timers: TimerApi = browserTimers
  ) {}

  scheduleDraft(snapshot: EditorSaveSnapshot): void {
    if (this.disposed) return;
    if (this.timer !== undefined) this.timers.clear(this.timer);
    this.timer = this.timers.set(() => {
      this.timer = undefined;
      this.saveDraftNow(snapshot).catch(() => undefined);
    }, this.debounceMs);
  }

  async saveDraftNow(snapshot: EditorSaveSnapshot): Promise<void> {
    if (this.disposed) return;
    this.draftController?.abort();
    const controller = new AbortController();
    this.draftController = controller;
    const generation = this.generation;
    this.emit({ type: 'draft-started', snapshot });
    try {
      const response = await this.drafts.save(snapshot, controller.signal);
      if (this.isCurrent(generation, controller, this.draftController)) this.emit({ type: 'draft-succeeded', snapshot, draftId: response.draftId });
    } catch (error) {
      const detail = asPersistenceError(error);
      if (this.isCurrent(generation, controller, this.draftController) && detail.kind !== 'aborted') this.emit({ type: 'draft-failed', snapshot, error: detail });
    }
  }

  async applyNow(snapshot: EditorSaveSnapshot): Promise<boolean> {
    if (this.disposed) return false;
    this.applyController?.abort();
    const controller = new AbortController();
    this.applyController = controller;
    const generation = this.generation;
    this.emit({ type: 'apply-started', snapshot });
    try {
      const response = await this.content.apply(snapshot, controller.signal);
      if (this.isCurrent(generation, controller, this.applyController)) {
        this.emit({ type: 'apply-succeeded', snapshot, version: response.version, backupId: response.backupId });
        return true;
      }
    } catch (error) {
      const detail = asPersistenceError(error);
      if (this.isCurrent(generation, controller, this.applyController) && detail.kind !== 'aborted') this.emit({ type: 'apply-failed', snapshot, error: detail });
    }
    return false;
  }

  cancelForFile(file: EditorFileIdentity): void {
    if (file.path) this.invalidate();
  }
  cancelAll(): void { this.invalidate(); }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.invalidate();
  }

  private isCurrent(generation: number, controller: AbortController, active?: AbortController): boolean {
    return !this.disposed && generation === this.generation && controller === active && !controller.signal.aborted;
  }
  private invalidate(): void {
    this.generation += 1;
    if (this.timer !== undefined) { this.timers.clear(this.timer); this.timer = undefined; }
    this.draftController?.abort();
    this.applyController?.abort();
    this.draftController = undefined;
    this.applyController = undefined;
  }
}
