import { describe, expect, it, vi } from 'vitest';
import {
  applyBoardStackLayer,
  isHtmlBoardText,
  settleHtmlTextLayer,
} from '@/diagrams/jsxgraph/htmlTextLayer';

function htmlText(parent: HTMLElement, layer = 0) {
  const rendNode = document.createElement('div');
  parent.appendChild(rendNode);
  return {
    board: { containerObj: parent },
    rendNode,
    visProp: { display: 'html' as const, layer },
    evalVisProp: (key: string) => (key === 'display' ? 'html' : key === 'layer' ? layer : undefined),
    setAttribute: vi.fn(),
  };
}

describe('htmlTextLayer', () => {
  it('detects HTML board texts', () => {
    const container = document.createElement('div');
    expect(isHtmlBoardText(htmlText(container))).toBe(true);
    expect(isHtmlBoardText({
      rendNode: document.createElementNS('http://www.w3.org/2000/svg', 'text') as unknown as HTMLElement,
      visProp: { display: 'internal' },
    })).toBe(false);
  });

  it('moves HTML texts out of an SVG layer group back onto the container', () => {
    const container = document.createElement('div');
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.appendChild(svgGroup);
    const text = htmlText(container, 7);
    svgGroup.appendChild(text.rendNode);

    settleHtmlTextLayer(text, 12);

    expect(text.rendNode.parentNode).toBe(container);
    expect(text.rendNode.style.zIndex).toBe('12');
  });

  it('uses z-index for HTML texts and setAttribute(layer) for SVG primitives', () => {
    const container = document.createElement('div');
    const text = htmlText(container);
    applyBoardStackLayer(text, 9);
    expect(text.setAttribute).not.toHaveBeenCalled();
    expect(text.rendNode.style.zIndex).toBe('9');

    const svg = {
      setAttribute: vi.fn(),
      rendNode: document.createElementNS('http://www.w3.org/2000/svg', 'path'),
      visProp: { display: 'internal' },
    };
    applyBoardStackLayer(svg, 4);
    expect(svg.setAttribute).toHaveBeenCalledWith({ layer: 4 });
  });
});
