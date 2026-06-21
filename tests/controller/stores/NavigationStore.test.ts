import { describe, it, expect, beforeEach } from 'vitest';
import { useNavigationStore } from '@/controller/store/NavigationStore';

describe('useNavigationStore', () => {
  beforeEach(() => {
    useNavigationStore.setState({ isSearchOpen: false });
  });

  it('starts closed', () => {
    expect(useNavigationStore.getState().isSearchOpen).toBe(false);
  });

  it('opens search', () => {
    useNavigationStore.getState().openSearch();
    expect(useNavigationStore.getState().isSearchOpen).toBe(true);
  });

  it('closes search', () => {
    useNavigationStore.getState().openSearch();
    useNavigationStore.getState().closeSearch();
    expect(useNavigationStore.getState().isSearchOpen).toBe(false);
  });

  it('toggles search', () => {
    useNavigationStore.getState().toggleSearch();
    expect(useNavigationStore.getState().isSearchOpen).toBe(true);
    useNavigationStore.getState().toggleSearch();
    expect(useNavigationStore.getState().isSearchOpen).toBe(false);
  });
});
