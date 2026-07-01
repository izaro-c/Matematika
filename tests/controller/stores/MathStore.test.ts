import { describe, it, expect } from 'vitest';
import { createMathStore } from '@/shared/lib/MathStore';

describe('MathStore', () => {
  it('initializes with empty variables', () => {
    const store = createMathStore();
    expect(store.getState().variables).toEqual({});
  });

  it('setVariable updates the state correctly', () => {
    const store = createMathStore();
    
    store.getState().setVariable('x', 10);
    expect(store.getState().variables['x']).toBe(10);
    
    store.getState().setVariable('arr', [1, 2, 3]);
    expect(store.getState().variables['arr']).toEqual([1, 2, 3]);
    
    // Existing variables are preserved
    store.getState().setVariable('y', 'test');
    expect(store.getState().variables['x']).toBe(10);
    expect(store.getState().variables['y']).toBe('test');
  });
});
