import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

interface CruisedViolation {
  from: string;
  to: string;
  rule: {
    severity: 'error' | 'warn' | 'info';
    name: string;
  };
}

describe('src architecture invariants', () => {
  const depcruiseOutput = execSync('npx depcruise src content/diagrams --output-type json', {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });

  const result = JSON.parse(depcruiseOutput);
  const violations: CruisedViolation[] = result.summary?.violations || [];

  it('has zero architecture rule errors', () => {
    const errorViolations = violations.filter(v => v.rule.severity === 'error');
    expect(errorViolations).toEqual([]);
  });

  it('keeps design isolated from product domains', () => {
    expect(violations.filter(v => v.rule.name === 'src-design-no-upper')).toEqual([]);
    expect(violations.filter(v => v.rule.name === 'src-design-no-diagrams')).toEqual([]);
  });

  it('keeps lib/components/data from importing pages', () => {
    expect(violations.filter(v => v.rule.name === 'src-lib-no-pages')).toEqual([]);
    expect(violations.filter(v => v.rule.name === 'src-components-no-pages')).toEqual([]);
    expect(violations.filter(v => v.rule.name === 'src-data-no-pages')).toEqual([]);
  });

  it('isolates fixed-pages from content-pages', () => {
    expect(violations.filter(v => v.rule.name === 'src-fixed-content-pages-isolation')).toEqual([]);
    expect(violations.filter(v => v.rule.name === 'src-content-pages-no-fixed')).toEqual([]);
  });

  it('has zero circular dependencies', () => {
    expect(violations.filter(v => v.rule.name === 'no-circular')).toEqual([]);
  });
});
