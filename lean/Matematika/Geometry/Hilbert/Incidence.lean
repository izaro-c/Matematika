import Mathlib.Logic.ExistsUnique
import Matematika.Geometry.Primitives

/-!
# Axiomas de incidencia de Hilbert

Este módulo expresa las relaciones fundamentales entre puntos, rectas y
planos. Las declaraciones son axiomas del sistema absoluto de Matematika.
-/

namespace Matematika.Geometry.Hilbert

open Matematika.Geometry

-- @matematika-id "axioma-incidencia-1" @lean-id "Matematika.Geometry.Hilbert.line_through_two_points" @kind "axiom" @status "axiomatic" @deps []
axiom line_through_two_points {a b : Point} :
  a ≠ b -> ∃! l, OnLine a l /\ OnLine b l

-- @matematika-id "axioma-incidencia-2" @lean-id "Matematika.Geometry.Hilbert.line_has_two_points" @kind "axiom" @status "axiomatic" @deps []
axiom line_has_two_points (l : Line) :
  ∃ a b, a ≠ b /\ OnLine a l /\ OnLine b l

-- @matematika-id "axioma-incidencia-3" @lean-id "Matematika.Geometry.Hilbert.exists_noncollinear_points" @kind "axiom" @status "axiomatic" @deps []
axiom exists_noncollinear_points :
  ∃ a b c, Noncollinear a b c

-- @matematika-id "axioma-incidencia-4" @lean-id "Matematika.Geometry.Hilbert.plane_through_three_noncollinear_points" @kind "axiom" @status "axiomatic" @deps []
axiom plane_through_three_noncollinear_points {a b c : Point} :
  Noncollinear a b c -> ∃! p, OnPlane a p /\ OnPlane b p /\ OnPlane c p

-- @matematika-id "axioma-incidencia-5" @lean-id "Matematika.Geometry.Hilbert.plane_has_three_noncollinear_points" @kind "axiom" @status "axiomatic" @deps []
axiom plane_has_three_noncollinear_points (p : Plane) :
  ∃ a b c, OnPlane a p /\ OnPlane b p /\ OnPlane c p /\ Noncollinear a b c

-- @matematika-id "axioma-incidencia-6" @lean-id "Matematika.Geometry.Hilbert.line_contained_in_plane" @kind "axiom" @status "axiomatic" @deps []
axiom line_contained_in_plane {l : Line} {p : Plane} {a b : Point} :
  a ≠ b ->
  OnLine a l ->
  OnLine b l ->
  OnPlane a p ->
  OnPlane b p ->
  LineInPlane l p

-- @matematika-id "axioma-incidencia-7" @lean-id "Matematika.Geometry.Hilbert.intersecting_planes_share_a_line" @kind "axiom" @status "axiomatic" @deps []
axiom intersecting_planes_share_a_line {p q : Plane} :
  p ≠ q ->
  (∃ x, OnPlane x p /\ OnPlane x q) ->
  ∃ l, PlaneIntersectionIsLine l p q

-- @matematika-id "axioma-incidencia-8" @lean-id "Matematika.Geometry.Hilbert.exists_noncoplanar_points" @kind "axiom" @status "axiomatic" @deps []
axiom exists_noncoplanar_points :
  ∃ a b c d, ¬∃ p, OnPlane a p /\ OnPlane b p /\ OnPlane c p /\ OnPlane d p

end Matematika.Geometry.Hilbert
