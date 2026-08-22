import type { ComponentType, LazyExoticComponent } from 'react';

export type MDXComponent = LazyExoticComponent<ComponentType<Record<string, unknown>>> | ComponentType<Record<string, unknown>>;
export type Difficulty =  'básico' | 'intermedio' | 'avanzado' | 'experto';

export interface MathematicalSource {
  title: string;
  author?: string;
  locator?: string;
  role?: 'primary' | 'secondary' | 'formalization';
}

export interface BaseContent {
  id: string;
  slug: string;
  lang?: string;
  branch?: string;
  branches?: string[];
  tags?: string[];
  links?: string[];
  seeAlso?: string[];
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

export interface StudyPlan extends BaseContent {
  title: string;
  subtitle?: string;
  description: string;
  requiredNodes?: string[];
  Component: MDXComponent;
}

export interface Theorem extends BaseContent {
  title: string;
  description: string;
  statement?: string;
  color?: string;
  authors: string[];
  type?: 'theorem' | 'lemma' | 'corollary' | 'teorema';
  corollaries?: string[];
  demos?: string[];
  demostraciones?: string[];
  lemmas?: string[];
  requires?: string[];
  examples?: string[];
  exercises?: string[];
  parentTheorem?: string;
  difficulty?: Difficulty;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface Method extends BaseContent {
  type: 'metodo';
  subtype: 'demostracion' | 'construccion' | 'calculo' | 'algoritmo';
  title: string;
  description: string;
  authors?: string[];
  requires?: string[];
  difficulty?: Difficulty;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface Demo extends BaseContent {
  type?: 'demostracion';
  title: string;
  description: string;
  parentTheorem?: string;
  lemmas?: string[];
  proofMethod?: string;
  authors?: string[];
  layout?: 'split' | 'text';
  dependencias?: string[];
  Component: MDXComponent;
}

export interface Definition extends BaseContent {
  title: string;
  description: string;
  statement?: string;
  authors?: string[];
  color?: string;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface Example extends BaseContent {
  title: string;
  description?: string;
  relatedTheorem?: string;
  requires?: string[];
  difficulty?: Difficulty;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface Exercise extends BaseContent {
  title: string;
  description?: string;
  relatedTheorem?: string;
  requires?: string[];
  difficulty?: Difficulty;
  hint?: string;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface UseCase extends BaseContent {
  title: string;
  description?: string;
  concept?: string;
  domain?: string;
  difficulty?: Difficulty;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface Axiom extends BaseContent {
  type?: 'axioma';
  title: string;
  description: string;
  statement?: string;
  authors?: string[];
  axiomSystem?: string;
  axiomFamily?: string;
  alternativeGroup?: string;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface AxiomaticSystem extends BaseContent {
  title: string;
  description: string;
  axiomas: string[];
  models?: string[];
  authors?: string[];
  hasSimulation?: boolean;
  Component: MDXComponent;
  Simulation?: MDXComponent;
}

export interface Model extends BaseContent {
  type?: 'modelo';
  title: string;
  description?: string;
  satisfies: string | string[];
  axioms_verified?: string[];
  hasDiagram?: boolean;
  Component: MDXComponent;
  Diagram?: MDXComponent;
  Simulation?: MDXComponent;
}

