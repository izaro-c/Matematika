import { describe, expect, it } from 'vitest';
import { findHardcodedStrings } from '../../../../scripts/editor/check-hardcoded-strings';

const find = (source: string) => findHardcodedStrings('x.tsx', source).map(f => f.text);

describe('check-hardcoded-strings', () => {
  it('flags JSX text and visible attributes', () => {
    expect(find(`const A = () => <button title="Guardar cambios">Cancelar</button>;`)).toEqual(['Guardar cambios', 'Cancelar']);
  });

  it('flags literals used as children', () => {
    expect(find(`const A = ({ok}) => <p>{ok ? 'Todo bien' : 'Hay un error'}</p>;`)).toEqual(['Todo bien', 'Hay un error']);
  });

  it('ignores translated text, class names, ids and symbols', () => {
    expect(
      find(`const A = () => <div className="flex gap-2" id="main-panel" aria-label={t('editor.nav.back')}>{t('editor.nav.back')} × → 1</div>;`),
    ).toEqual([]);
  });
});

describe('check-hardcoded-strings: attribute expressions', () => {
  it('flags conditionals and templates in visible attributes', () => {
    expect(find("const A = () => <b title={dirty ? 'Guardar cambios' : 'Sin cambios'} aria-label={`Cerrar ${name}`} />;")).toEqual([
      'Guardar cambios',
      'Sin cambios',
      'Cerrar',
    ]);
  });
});
