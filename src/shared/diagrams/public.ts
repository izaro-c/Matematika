/**
 * Contrato público del dominio diagrams.
 *
 * Preferido por widgets y demos:
 *   import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public'
 *
 * Equivalente: `@/shared/diagrams` (reexporta spec + renderer + constants).
 *
 * No importar `features/editor` desde widgets — solo este contrato + runtime bajo
 * `@/shared/diagrams/runtime/*` cuando haga falta el board lifecycle.
 */
export * from './spec/index';
export * from './runtime/DiagramRenderer';
export * from './constants';
