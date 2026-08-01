import React from 'react';
import { ProofStep } from './ProofStep';
import { QedMark } from './QedMark';

function isProofStepElement(child: React.ReactNode): boolean {
  if (!React.isValidElement(child)) return false;
  const type = child.type as { displayName?: string; name?: string };
  return type === ProofStep || type?.displayName === 'ProofStep' || type?.name === 'ProofStep';
}

function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  const result: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.type === React.Fragment) {
      result.push(...flattenChildren(child.props.children));
      return;
    }
    result.push(child);
  });

  return result;
}

/**
 * Inserta un QedMark inmediatamente después del último ProofStep entre los hijos.
 * Si no hay pasos de demostración, devuelve los hijos sin modificar.
 */
export function insertQedAfterLastProofStep(children: React.ReactNode): React.ReactNode {
  const childArray = flattenChildren(children);
  let lastProofStepIndex = -1;

  childArray.forEach((child, index) => {
    if (isProofStepElement(child)) lastProofStepIndex = index;
  });

  if (lastProofStepIndex === -1) return children;

  const result = [...childArray];
  result.splice(lastProofStepIndex + 1, 0, <QedMark key="demonstration-qed" />);
  return result;
}
