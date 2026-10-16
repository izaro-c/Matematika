import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { SUPPORTED_LANGUAGES, useI18n } from '@/i18n';
import {
  editorMessage,
  translateEditorText,
} from '@/fixed-pages/editor/types/editorMessage';

describe('editor messages', () => {
  const { result } = renderHook(() => useI18n());
  const t = result.current.t;

  it('translates a code relative to the editor namespace with params', () => {
    expect(translateEditorText(t, editorMessage('save.errorCountOther', { count: 3 }))).toBe('3 errores');
  });

  it('passes legacy plain strings through untouched', () => {
    expect(translateEditorText(t, 'Modelo y código divergen')).toBe('Modelo y código divergen');
    expect(translateEditorText(t, undefined)).toBeUndefined();
  });

  it('keeps every editor area as a non-empty group of strings in all languages', () => {
    for (const language of SUPPORTED_LANGUAGES) {
      for (const [area, entries] of Object.entries(language.dictionary.editor)) {
        expect(typeof entries, `${language.code}.editor.${area}`).toBe('object');
        for (const [key, value] of Object.entries(entries as Record<string, unknown>)) {
          expect(typeof value === 'string' && value.length > 0, `${language.code}.editor.${area}.${key}`).toBe(true);
        }
      }
    }
  });
});
