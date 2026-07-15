/**
 * @fileoverview Definiciones de tipos para la estructura de grafos de dependencias matemáticas.
 * Proporciona las interfaces principales utilizadas en la lógica de evaluación axiomática.
 */

/**
 * Representa una prueba específica para un nodo matemático.
 * Un teorema puede tener múltiples pruebas, cada una con distintas dependencias.
 */
export interface GraphNodeProof {
  /** Identificador único de la demostración */
  id: string;
  /** Lista de identificadores (slugs) de los nodos de los cuales depende esta prueba */
  dependencies: string[];
}

/**
 * Metadatos estructurales de un nodo dentro del grafo.
 */
export interface GraphNodeMeta {
  /** Tipo de nodo: 'teorema', 'axioma', 'definicion', etc. */
  type: string;
  /** Grupo de axiomas mutuamente excluyentes, cuando el nodo es un axioma alternativo. */
  alternativeGroup?: string;
  /** Lista de las demostraciones disponibles para este nodo */
  proofs: GraphNodeProof[];
  /** Dependencias lógicas directas si el nodo no requiere una demostración formal pero sí concepto previo */
  directDependencies: string[];
}

/**
 * Estructura completa del grafo de conocimiento estático procesado en build-time.
 */
export interface GraphStructure {
  /** Lista de identificadores de nodo ordenados de manera que las dependencias preceden a sus dependientes (Orden Topológico) */
  topologicalOrder: string[];
  /** Mapa de metadatos de los nodos indexados por su identificador */
  nodes: Record<string, GraphNodeMeta>;
}

/**
 * Información de un modelo matemático concreto que instancía un sistema axiomático.
 */
export interface ModelInfo {
  /** Identificador del modelo */
  id: string;
  /** Nombre o título legible del modelo */
  title: string;
  /** Lista de identificadores de los axiomas que se cumplen en este modelo */
  axioms: string[];
}

/**
 * Información de un sistema axiomático abstracto.
 */
export interface SystemInfo {
  /** Identificador único del sistema axiomático */
  id: string;
  /** Título descriptivo del sistema */
  title: string;
  /** Lista de axiomas que componen este sistema */
  axioms: string[];
}

/**
 * Representa una arista o enlace dirigido dentro del grafo visual.
 */
export interface GraphEdge {
  /** Identificador del nodo origen (dependencia) */
  source: string;
  /** Identificador del nodo destino (dependiente) */
  target: string;
}
