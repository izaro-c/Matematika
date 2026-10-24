import { describe, expect, it } from 'vitest';
import { renderKatexTextToHtml } from '@/components/ui/KatexText';

describe('renderKatexTextToHtml', () => {
  it('no aplica cursiva a los subíndices de una fórmula', () => {
    const html = renderKatexTextToHtml('$f(a_1) = f(a_2)$ con $a_1 \\neq a_2$.');
    expect(html).not.toContain('<em>');
    expect(html).toContain('f(a_1) = f(a_2)');
  });

  it('mantiene el formato de texto fuera de las fórmulas', () => {
    const html = renderKatexTextToHtml('**Sí**: _cursiva_ y $x_1 * y_2$');
    expect(html).toContain('<strong>Sí</strong>');
    expect(html).toContain('<em>cursiva</em>');
    expect(html).toContain('x_1 * y_2');
  });
});
