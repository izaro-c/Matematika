import { describe, expect, it } from 'vitest';
import {
  isPublicationMode,
  publicationContentSize,
  type V2CanvasFrameMode,
} from '@/features/editor_v2/ui/canvas/canvasFrameMode';
import { SCREEN_PRESETS, publishedDiagramArea, publishedLayoutForPageType } from '@/features/editor/diagrams/model/publishedDiagramLayout';

describe('canvasFrameMode', () => {
  it('isPublicationMode is false only for editor', () => {
    expect(isPublicationMode('editor')).toBe(false);
    for (const mode of ['desktop', 'tablet', 'mobile'] as const) {
      expect(isPublicationMode(mode)).toBe(true);
    }
  });

  it('publicationContentSize matches publishedDiagramArea for the device preset', () => {
    for (const mode of ['desktop', 'tablet', 'mobile'] as const) {
      const expected = publishedDiagramArea(
        { width: SCREEN_PRESETS[mode].width, height: SCREEN_PRESETS[mode].height },
        publishedLayoutForPageType(undefined),
      );
      const actual = publicationContentSize(mode);
      expect(actual.width).toBe(expected.width);
      expect(actual.height).toBe(expected.height);
      expect(actual.width).toBeLessThan(SCREEN_PRESETS[mode].width);
    }
  });

  it('mobile content is narrower than desktop content', () => {
    expect(publicationContentSize('mobile').width).toBeLessThan(publicationContentSize('desktop').width);
  });
});
