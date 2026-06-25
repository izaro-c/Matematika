import type { StudyPlanMeta, AxiomaticSystemMeta } from './schemas';
import type { ComponentType, LazyExoticComponent } from 'react';

export type MDXComponent = LazyExoticComponent<ComponentType<Record<string, unknown>>> | ComponentType<Record<string, unknown>>;
export type Difficulty = 'básico' | 'intermedio' | 'avanzado';
export type FormalizationStatus = 'traceable' | 'axiomatic' | 'bridge' | 'proved' | 'mathlib';

export interface MathematicalSource {
  title: string;
  author?: string;
  locator?: string;
  role?: 'primary' | 'secondary' | 'formalization';
}

export interface BaseContent {
  id: string;
  slug: string;
  links?: string[];
  seeAlso?: string[];
  leanId?: string;
  leanCommitSha?: string;
  leanVerified?: boolean;
  formalizationStatus?: FormalizationStatus;
  sources?: MathematicalSource[];
}

export interface Mathematician extends BaseContent {
  name: string;
  fullName?: string;
  country?: string;
  description: string;
  image?: string;
  birthYear?: number;
  deathYear?: number;
  Component: MDXComponent;
}

export interface StudyPlan extends StudyPlanMeta {
  Component: MDXComponent;
  slug: string;
}

export interface Theorem {
  id: string;
  slug: string;
  title: string;
  description: string;
  statement?: string;
  color?: string;
  authors: string[];
  lesson?: string;
  type?: 'theorem' | 'lemma' | 'corollary' | 'teorema';
  corollaries?: string[];
  demos?: string[];
  demostraciones?: string[];
  lemmas?: string[];
  requires?: string[];
  links?: string[];
  examples?: string[];
  exercises?: string[];
  parentTheorem?: string;
  tags?: string[];
  difficulty?: Difficulty;
  Component: MDXComponent;
  Simulation?: MDXComponent;
  seeAlso?: string[];
  leanId?: string;
  leanCommitSha?: string;
  leanVerified?: boolean;
  formalizationStatus?: FormalizationStatus;
  sources?: MathematicalSource[];
}

export interface Lesson {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  tags?: string[];
  difficulty?: Difficulty;
  Component: MDXComponent;
  Simulation?: MDXComponent;
  Visualizer?: MDXComponent;
  seeAlso?: string[];
}

export interface Demo {
  id: string;
  slug: string;
  type?: 'demostracion';
  title: string;
  description: string;
  parentTheorem?: string;
  lemmas?: string[];
  links?: string[];
  proofMethod?: string;
  authors?: string[];
  tags?: string[];
  layout?: 'split' | 'text';
  dependencias?: string[];
  leanId?: string;
  leanCommitSha?: string;
  leanVerified?: boolean;
  formalizationStatus?: FormalizationStatus;
  sources?: MathematicalSource[];
  stepTacticMap?: Record<string, string[]>;
  Component: MDXComponent;
  seeAlso?: string[];
}

export interface Definition {
  id: string;
  slug: string;
  title: string;
  description: string;
  statement?: string;
  tags?: string[];
  authors?: string[];
  links?: string[];
  color?: string;
  Component: MDXComponent;
  Simulation?: MDXComponent;
  seeAlso?: string[];
  leanId?: string;
  leanCommitSha?: string;
  leanVerified?: boolean;
  formalizationStatus?: FormalizationStatus;
  sources?: MathematicalSource[];
}

export interface Example {
  id: string;
  slug: string;
  title: string;
  description?: string;
  relatedTheorem?: string;
  requires?: string[];
  tags?: string[];
  difficulty?: Difficulty;
  Component: MDXComponent;
  Simulation?: MDXComponent;
  seeAlso?: string[];
}

export interface Exercise {
  id: string;
  slug: string;
  title: string;
  description?: string;
  relatedTheorem?: string;
  requires?: string[];
  tags?: string[];
  difficulty?: Difficulty;
  hint?: string;
  Component: MDXComponent;
  Simulation?: MDXComponent;
  seeAlso?: string[];
}

export interface UseCase {
  id: string;
  slug: string;
  title: string;
  description?: string;
  concept?: string;
  domain?: string;
  tags?: string[];
  difficulty?: Difficulty;
  Component: MDXComponent;
  Simulation?: MDXComponent;
  seeAlso?: string[];
}

export interface Axiom {
  id: string;
  slug: string;
  type?: 'axioma';
  title: string;
  description: string;
  statement?: string;
  tags?: string[];
  authors?: string[];
  axiomSystem?: string;
  links?: string[];
  Component: MDXComponent;
  Simulation?: MDXComponent;
  seeAlso?: string[];
  leanId?: string;
  leanCommitSha?: string;
  leanVerified?: boolean;
  formalizationStatus?: FormalizationStatus;
  sources?: MathematicalSource[];
}

export interface AxiomaticSystem extends AxiomaticSystemMeta {
  id: string;
  slug: string;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface Model {
  id: string;
  slug: string;
  type?: 'modelo';
  title: string;
  description?: string;
  satisfies: string;
  axioms_verified?: string[];
  hasDiagram?: boolean;
  tags?: string[];
  links?: string[];
  seeAlso?: string[];
  Component: MDXComponent;
  Diagram?: MDXComponent;
  Simulation?: MDXComponent;
}
