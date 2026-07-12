import { describe, it, expect } from 'vitest';
import { parseDiagramSourceLocally } from '../../../../src/features/editor/diagrams/source/parser';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';

describe('Diagram TSX Parser (Local & AST)', () => {
  it('should parse local JSON comment block successfully', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const gen = generateDiagramSource(model, 'Test');
    expect(gen.ok).toBe(true);
    if (gen.ok) {
      const parsed = parseDiagramSourceLocally(gen.source, 'definicion');
      expect(parsed).not.toBeNull();
      expect(parsed?.title).toBe('Test');
      expect(parsed?.points).toHaveLength(2);
    }
  });

  it('should parse source using AST and reconstruct the model', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const gen = generateDiagramSource(model, 'Test');
    expect(gen.ok).toBe(true);
    if (gen.ok) {
      const parsed = parseDiagramSourceAST(gen.source, 'definicion');
      expect(parsed.status).toBe('supported');
      expect(parsed.model).toBeDefined();
      expect(parsed.model?.title).toBe('Test');
      expect(parsed.model?.boundingBox).toEqual([-5, 5, 5, -5]);
      expect(parsed.model?.points).toHaveLength(2);
      expect(parsed.model?.elements).toHaveLength(3);
    }
  });

  it('should handle invalid syntax diagnostics in AST parser', () => {
    const brokenSource = `
      import { MathBoard } from '@/shared/diagrams/core/MathBoard';
      export const Broken = () => {
        return (
          <MathBoard
            boundingbox={[-5, 5, 5, -5]}
            onInit={(board, els, theme) => {
              // Syntax error below
              els["pA"] = createPoint(board, [0, 0]
            }}
          />
        );
      };
    `;
    const parsed = parseDiagramSourceAST(brokenSource, 'definicion');
    expect(parsed.status).toBe('invalid');
    expect(parsed.diagnostics.length).toBeGreaterThan(0);
  });
});
