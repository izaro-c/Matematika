import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicationFrame } from '@/fixed-pages/editor/diagrams/ui/canvas/PublicationFrame';
import { publicationContentSize } from '@/fixed-pages/editor/diagrams/ui/canvas/canvasFrameMode';

describe('PublicationFrame', () => {
  it('sizes the diagram slot to publication content, not device chassis', () => {
    const content = publicationContentSize('mobile');
    render(
      <PublicationFrame mode="mobile" title="Demo">
        <div data-testid="board-slot" />
      </PublicationFrame>,
    );
    const slot = screen.getByTestId('publication-diagram-slot');
    expect(slot.style.width).toBe(`${content.width}px`);
    expect(slot.style.height).toBe(`${content.height}px`);
    expect(screen.getByText(/móvil/i)).toBeTruthy();
  });

  it('labels desktop publication mode', () => {
    render(
      <PublicationFrame mode="desktop" title="Demo">
        <div />
      </PublicationFrame>,
    );
    expect(screen.getByText(/escritorio|desktop/i)).toBeTruthy();
  });
});
