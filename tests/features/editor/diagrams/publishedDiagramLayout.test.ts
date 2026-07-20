import { describe, expect, it } from 'vitest';
import { pageTypeFromContentPath, publishedDiagramArea, publishedLayoutForPageType } from '../../../../src/features/editor/diagrams/model/publishedDiagramLayout';

describe('published diagram layout dimensions', () => {
  it.each([
    ['theorem', 1440, 900, 522, 900],
    ['theorem', 1024, 768, 488, 768],
    ['balanced', 1440, 900, 720, 900],
    ['balanced', 1024, 768, 512, 768],
    ['standard', 1440, 900, 787, 900],
    ['standard', 1024, 768, 465, 768],
    ['demonstration', 1440, 900, 768, 772],
    ['demonstration', 1024, 768, 512, 640],
  ] as const)('matches the published %s layout at %s × %s', (layout, width, height, expectedWidth, expectedHeight) => {
    expect(publishedDiagramArea({ width, height }, layout)).toMatchObject({ width: expectedWidth, height: expectedHeight });
  });

  it.each(['standard', 'theorem', 'balanced', 'demonstration'] as const)('matches the common mobile diagram region for %s', layout => {
    expect(publishedDiagramArea({ width: 390, height: 844 }, layout)).toMatchObject({ width: 374, height: 272 });
  });

  it('infers the actual page layout while keeping it user-selectable in the frame', () => {
    expect(publishedLayoutForPageType('teorema')).toBe('theorem');
    expect(publishedLayoutForPageType('definicion')).toBe('balanced');
    expect(publishedLayoutForPageType('metodo')).toBe('balanced');
    expect(publishedLayoutForPageType('demostracion')).toBe('demonstration');
    expect(publishedLayoutForPageType('modelo')).toBe('standard');
  });

  it('infers the page type of standalone diagrams from the generated usage index path', () => {
    expect(pageTypeFromContentPath('src/database/content/theorems/teorema-pitagoras.mdx')).toBe('teorema');
    expect(pageTypeFromContentPath('src/database/content/definitions/paralelogramo.mdx')).toBe('definicion');
    expect(pageTypeFromContentPath('src/database/content/demonstrations/demo-pitagoras-areas.mdx')).toBe('demostracion');
    expect(pageTypeFromContentPath('src/database/content/models/modelo-poincare.mdx')).toBe('modelo');
  });
});
