import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '@/features/progress/UserProgressStore';

describe('useProgressStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useProgressStore.setState({
      readConcepts: [],
      completedExercises: [],
      visitedUseCases: [],
      discoveredMathematicians: [],
    });
  });

  describe('markAsRead / isRead', () => {
    it('marks a concept as read', () => {
      useProgressStore.getState().markAsRead('thm-1');
      expect(useProgressStore.getState().isRead('thm-1')).toBe(true);
    });

    it('does not duplicate reads', () => {
      useProgressStore.getState().markAsRead('thm-1');
      useProgressStore.getState().markAsRead('thm-1');
      expect(useProgressStore.getState().readConcepts).toEqual(['thm-1']);
    });

    it('returns false for unread concept', () => {
      expect(useProgressStore.getState().isRead('thm-1')).toBe(false);
    });
  });

  describe('unmarkAsRead', () => {
    it('removes a concept', () => {
      useProgressStore.getState().markAsRead('thm-1');
      useProgressStore.getState().markAsRead('thm-2');
      useProgressStore.getState().unmarkAsRead('thm-1');
      expect(useProgressStore.getState().isRead('thm-1')).toBe(false);
      expect(useProgressStore.getState().isRead('thm-2')).toBe(true);
    });
  });

  describe('toggleRead', () => {
    it('toggles a concept on and off', () => {
      useProgressStore.getState().toggleRead('thm-1');
      expect(useProgressStore.getState().isRead('thm-1')).toBe(true);
      useProgressStore.getState().toggleRead('thm-1');
      expect(useProgressStore.getState().isRead('thm-1')).toBe(false);
    });
  });

  describe('markExerciseComplete / isExerciseComplete', () => {
    it('marks an exercise complete', () => {
      useProgressStore.getState().markExerciseComplete('ex-1');
      expect(useProgressStore.getState().isExerciseComplete('ex-1')).toBe(true);
    });

    it('does not duplicate completions', () => {
      useProgressStore.getState().markExerciseComplete('ex-1');
      useProgressStore.getState().markExerciseComplete('ex-1');
      expect(useProgressStore.getState().completedExercises).toEqual(['ex-1']);
    });

    it('returns false for incomplete exercise', () => {
      expect(useProgressStore.getState().isExerciseComplete('ex-1')).toBe(false);
    });
  });

  describe('markUseCaseVisited', () => {
    it('marks a use case visited', () => {
      useProgressStore.getState().markUseCaseVisited('uc-1');
      expect(useProgressStore.getState().visitedUseCases).toContain('uc-1');
    });
  });

  describe('discoverMathematician', () => {
    it('discovers a mathematician', () => {
      useProgressStore.getState().discoverMathematician('gauss');
      expect(useProgressStore.getState().discoveredMathematicians).toContain('gauss');
    });
  });
});
