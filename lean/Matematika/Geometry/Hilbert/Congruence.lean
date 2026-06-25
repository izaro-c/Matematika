import Mathlib.Logic.ExistsUnique
import Matematika.Geometry.Primitives

/-!
# Axiomas de congruencia de Hilbert

Las declaraciones de este módulo son supuestos de la teoría sintética de
Matematika. No son teoremas importados de Mathlib.
-/

namespace Matematika.Geometry.Hilbert

open Matematika.Geometry

-- @matematika-id "axioma-congruencia-1" @lean-id "Matematika.Geometry.Hilbert.segment_transport" @kind "axiom" @status "axiomatic" @deps []
axiom segment_transport
  (a b : Point) (r : Ray) :
  ∃! d, OnRay r d /\ SegmentCongruent a b r.origin d

-- @matematika-id "axioma-congruencia-2" @lean-id "Matematika.Geometry.Hilbert.segment_congruence_transitive" @kind "axiom" @status "axiomatic" @deps []
axiom segment_congruence_transitive
  {a b c d e f : Point} :
  SegmentCongruent a b c d ->
  SegmentCongruent a b e f ->
  SegmentCongruent c d e f

-- @matematika-id "axioma-congruencia-3" @lean-id "Matematika.Geometry.Hilbert.segment_addition" @kind "axiom" @status "axiomatic" @deps []
axiom segment_addition
  {a b c a' b' c' : Point} :
  Between a b c ->
  Between a' b' c' ->
  SegmentCongruent a b a' b' ->
  SegmentCongruent b c b' c' ->
  SegmentCongruent a c a' c'

-- @matematika-id "axioma-congruencia-4" @lean-id "Matematika.Geometry.Hilbert.angle_transport" @kind "axiom" @status "axiomatic" @deps []
axiom angle_transport
  (source : Angle) (target : Ray) (side : AngleConstructionSide) :
  ∃! constructed,
    constructed.origin = target.origin /\
    IsInAngleConstructionSide constructed side /\
    AngleCongruent source {
      left := target.through
      vertex := target.origin
      right := constructed.through
    }

-- @matematika-id "axioma-congruencia-5" @lean-id "Matematika.Geometry.Hilbert.sas_congruence" @kind "axiom" @status "axiomatic" @deps []
axiom sas_congruence
  {t u : Triangle} :
  LALHypothesis t u -> TriangleCongruent t u

end Matematika.Geometry.Hilbert
