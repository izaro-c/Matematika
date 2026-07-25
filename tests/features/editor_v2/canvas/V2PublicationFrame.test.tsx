import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { V2PublicationFrame } from '@/features/editor_v2/ui/canvas/V2PublicationFrame';
import { publicationContentSize } from '@/features/editor_v2/ui/canvas/canvasFrameMode';

describe('V2PublicationFrame', () => {
  it('sizes the diagram slot to publication content, not device chassis', () => {
    const content = publicationContentSize('mobile');
    render(
      <V2PublicationFrame mode="mobile" title="Demo">
        <div data-testid="board-slot" />
      </V2PublicationFrame>,
    );
    const slot = screen.getByTestId('v2-publication-diagram-slot');
    expect(slot.style.width).toBe(`${content.width}px`);
    expect(slot.style.height).toBe(`${content.height}px`);
    expect(screen.getByText(/móvil/i)).toBeTruthy();
  });

  it('labels desktop publication mode', () => {
    render(
      <V2PublicationFrame mode="desktop" title="Demo">
        <div />
      </V2PublicationFrame>,
    );
    expect(screen.getByText(/escritorio|desktop/i)).toBeTruthy();
  });
});
