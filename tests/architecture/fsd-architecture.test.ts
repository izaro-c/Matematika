import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

interface CruisedViolation {
  type: string;
  from: string;
  to: string;
  rule: {
    severity: 'error' | 'warn' | 'info';
    name: string;
  };
}

describe('FSD Architecture Invariants Test Suite', () => {
  const depcruiseOutput = execSync('npx depcruise src --output-type json', {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });

  const result = JSON.parse(depcruiseOutput);
  const violations: CruisedViolation[] = result.summary?.violations || [];

  it('has zero FSD architecture rule errors', () => {
    const errorViolations = violations.filter(v => v.rule.severity === 'error');
    expect(errorViolations).toEqual([]);
  });

  it('has zero FSD upper-layer import violations from shared/', () => {
    const sharedViolations = violations.filter(v => v.rule.name === 'fsd-shared-no-upper-layers');
    expect(sharedViolations).toEqual([]);
  });

  it('has zero FSD upper-layer import violations from features/', () => {
    const featureUpperViolations = violations.filter(v => v.rule.name === 'fsd-features-no-upper-layers');
    expect(featureUpperViolations).toEqual([]);
  });

  it('has zero FSD forbidden cross-imports from widgets/ to features/', () => {
    const widgetFeatureViolations = violations.filter(v => v.rule.name === 'fsd-widgets-no-features');
    expect(widgetFeatureViolations).toEqual([]);
  });

  it('has zero FSD cross-feature slice violations', () => {
    const crossFeatureViolations = violations.filter(v => v.rule.name === 'fsd-features-cross-imports');
    expect(crossFeatureViolations).toEqual([]);
  });

  it('has zero circular dependencies in src/', () => {
    const circularViolations = violations.filter(v => v.rule.name === 'no-circular');
    expect(circularViolations).toEqual([]);
  });
});
