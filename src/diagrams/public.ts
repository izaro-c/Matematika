/**
 * Contrato público del dominio diagrams.
 *
 * Preferido por widgets y demos:
 *   import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public'
 *
 * Equivalente: `@/diagrams` (reexporta spec + renderer + constants).
 *
 * No importar `features/editor` desde widgets — solo este contrato + runtime bajo
 * `@/diagrams/runtime/*` cuando haga falta el board lifecycle.
 */
export * from './spec/index';
export * from './runtime/DiagramRenderer';
export * from './constants';
