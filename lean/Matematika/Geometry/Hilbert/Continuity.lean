import Matematika.Geometry.Primitives

/-!
# Axiomas de continuidad de Hilbert

La formulación de completitud de Hilbert es de segundo orden: para modelarla
literalmente hace falta una estructura de modelos y extensiones que todavía no
forma parte del núcleo. Por ahora se conserva como una proposición primitiva
con nombre, en lugar de simular una prueba de primer orden.
-/

namespace Matematika.Geometry.Hilbert

open Matematika.Geometry

structure Segment where
  start : Point
  finish : Point

axiom SegmentMultipleExceeds : Nat -> Segment -> Segment -> Prop
axiom HasNoProperAxiomaticExtension : Prop

-- @matematika-id "axioma-arquimedes" @lean-id "Matematika.Geometry.Hilbert.archimedean" @kind "axiom" @status "axiomatic" @deps []
axiom archimedean (s t : Segment) :
  ∃ n : Nat, SegmentMultipleExceeds n s t

-- @matematika-id "axioma-completitud" @lean-id "Matematika.Geometry.Hilbert.no_proper_axiomatic_extension" @kind "axiom" @status "axiomatic" @deps []
axiom no_proper_axiomatic_extension :
  HasNoProperAxiomaticExtension

end Matematika.Geometry.Hilbert
