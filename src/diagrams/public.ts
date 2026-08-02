/**
 * Browser-facing public contract (includes React renderer).
 *
 * Prefer for demos:
 *   import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public'
 *
 * For Node / editor parse paths (no React):
 *   import { … } from '@/diagrams' or '@/diagrams/model'
 */
export * from './model';
export * from './geometry';
export * from './render/DiagramRenderer';
export * from './constants';
