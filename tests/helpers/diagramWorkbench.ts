import type { Mock } from 'vitest';

export interface DiagramRepositoryMocks {
  readDiagram: Mock;
  saveDiagram: Mock;
  updateMdxImports: Mock;
}

export function resetRepositoryMocks(mocks: DiagramRepositoryMocks) {
  mocks.readDiagram.mockReset();
  mocks.saveDiagram.mockReset();
  mocks.updateMdxImports.mockReset();
}
