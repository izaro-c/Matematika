import { describe, expect, it } from 'vitest';
import { findRawControls } from '../../../../scripts/editor/check-primitive-usage';

const find = (source: string) => findRawControls('x.tsx', source).map(f => f.kind);

describe('check-primitive-usage', () => {
  it('flags a raw button but not one with an ed- skin class', () => {
    expect(find(`const A = () => <button type="button" className="rounded bg-canela px-2">x</button>;`)).toEqual(['raw-button']);
    expect(find(`const A = () => <button type="button" className="ed-drag-handle">x</button>;`)).toEqual([]);
  });

  it('flags form controls with hand-written chrome, not bare or native ones', () => {
    expect(find(`const A = () => <input className="rounded border border-carbon/15 p-2" />;`)).toEqual(['raw-control']);
    expect(find(`const A = () => <input className={controlClassName} />;`)).toEqual([]);
    expect(find(`const A = () => <input type="checkbox" className="rounded border" />;`)).toEqual([]);
  });

  it('flags a hand-built modal overlay', () => {
    expect(find(`const A = () => <div className="fixed inset-0 z-50 bg-carbon/40" role="dialog" />;`)).toEqual(['custom-overlay']);
  });

  it('ignores primitives', () => {
    expect(find(`const A = () => <Button size="sm" onClick={go}>Ir</Button>;`)).toEqual([]);
  });
});

describe('check-primitive-usage: underline fields', () => {
  it('ignores variant-prefixed and one-sided borders', () => {
    expect(find("const A = () => <input className=\"font-bold hover:border-carbon/20 focus:border-canela border-b\" />;")).toEqual([]);
  });
});
