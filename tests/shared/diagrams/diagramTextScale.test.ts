import { describe, expect, it } from 'vitest';
import {
  DIAGRAM_TEXT_SCALE_MIN,
  DIAGRAM_TEXT_SCALE_REF_PX,
  diagramTextScaleFromHeight,
  syncDiagramTextScale,
} from '@/diagrams/diagramTextScale';
import { publishedDiagramArea, SCREEN_PRESETS } from '@/fixed-pages/editor/diagrams/model/scene/publishedDiagramLayout';

describe('diagramTextScaleFromHeight', () => {
  it('keeps laptop/desktop demo surfaces at 100%', () => {
    const laptopDemo = publishedDiagramArea(SCREEN_PRESETS.laptop, 'demonstration');
    const desktopDemo = publishedDiagramArea(SCREEN_PRESETS.desktop, 'demonstration');
    const mobile = publishedDiagramArea(SCREEN_PRESETS.mobile, 'standard');

    expect(laptopDemo.height).toBeGreaterThanOrEqual(DIAGRAM_TEXT_SCALE_REF_PX);
    expect(desktopDemo.height).toBeGreaterThanOrEqual(DIAGRAM_TEXT_SCALE_REF_PX);
    expect(diagramTextScaleFromHeight(laptopDemo.height)).toBe(1);
    expect(diagramTextScaleFromHeight(desktopDemo.height)).toBe(1);
    expect(diagramTextScaleFromHeight(mobile.height)).toBe(DIAGRAM_TEXT_SCALE_MIN);
  });
});

describe('syncDiagramTextScale', () => {
  it('writes scale from clientHeight', () => {
    const root = document.createElement('div');
    Object.defineProperty(root, 'clientHeight', { configurable: true, get: () => 280 });
    expect(syncDiagramTextScale(root)).toBe(DIAGRAM_TEXT_SCALE_MIN);
  });
});
