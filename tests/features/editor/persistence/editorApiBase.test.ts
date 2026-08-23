import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  editorApiPath,
  editorApiConfigured,
  editorWriteAccessGranted,
  setEditorAuthToken,
  clearEditorAuthToken,
} from '@/fixed-pages/editor/save/editorApiBase';

describe('editorApiBase', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_EDITOR_API_URL', '');
    clearEditorAuthToken();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    clearEditorAuthToken();
  });

  it('uses relative paths when no remote API is configured', () => {
    expect(editorApiPath('/api/list-content')).toBe('/api/list-content');
    expect(editorApiConfigured()).toBe(false);
    expect(editorWriteAccessGranted()).toBe(true);
  });

  it('prefixes paths with the configured API base URL', () => {
    vi.stubEnv('VITE_EDITOR_API_URL', 'https://api.example.com/');
    expect(editorApiPath('/Matematika/api/content')).toBe('https://api.example.com/Matematika/api/content');
    expect(editorApiConfigured()).toBe(true);
    expect(editorWriteAccessGranted()).toBe(false);
  });

  it('grants write access after storing a bearer token', () => {
    vi.stubEnv('VITE_EDITOR_API_URL', 'https://api.example.com');
    setEditorAuthToken('secret-token');
    expect(editorWriteAccessGranted()).toBe(true);
    clearEditorAuthToken();
    expect(editorWriteAccessGranted()).toBe(false);
  });
});
