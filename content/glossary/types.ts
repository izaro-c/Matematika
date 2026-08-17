/**
 * @packageDocumentation
 * Types for Matematika glossary terms and categories.
 */

/** Glossary taxonomy buckets shown in the UI. */
export type GlossaryCategory =
  | 'Conceptos Fundamentales'
  | 'Lógica'
  | 'Álgebra'
  | 'Análisis'
  | 'Geometría'
  | 'Teoría de Conjuntos'
  | 'Modelos'
  | 'Oinarrizko Kontzeptuak'
  | 'Logika'
  | 'Aljebra'
  | 'Analisia'
  | 'Geometria'
  | 'Multzoen Teoria'
  | 'Ereduak';

/** One glossary term: title, definition, optional equation, category. */
export interface GlossaryEntry {
  title: string;
  definition: string;
  equation?: string;
  category: GlossaryCategory;
}
