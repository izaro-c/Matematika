
import Matematika.Geometry.Primitives

/-!
# Axiomas de incidencia de Hilbert

Este módulo expresa las relaciones fundamentales entre puntos, rectas y
planos. Las declaraciones son axiomas del sistema absoluto de Matematika.
-/

namespace Matematika.Geometry.Hilbert

open Matematika.Geometry

-- @matematika-id "axioma-incidencia-1" @lean-id "Matematika.Geometry.Hilbert.line_through_two_points" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom line_through_two_points {a b : Point} :
  a ≠ b -> ExistsUnique (fun l => OnLine a l /\ OnLine b l)

-- @matematika-id "axioma-incidencia-2" @lean-id "Matematika.Geometry.Hilbert.line_has_two_points" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom line_has_two_points (l : Line) :
  ∃ a b, a ≠ b /\ OnLine a l /\ OnLine b l

-- @matematika-id "axioma-incidencia-3" @lean-id "Matematika.Geometry.Hilbert.exists_noncollinear_points" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom exists_noncollinear_points :
  ∃ a b c, Noncollinear a b c

-- @matematika-id "axioma-incidencia-4" @lean-id "Matematika.Geometry.Hilbert.plane_through_three_noncollinear_points" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom plane_through_three_noncollinear_points {a b c : Point} :
  Noncollinear a b c -> ExistsUnique (fun p => OnPlane a p /\ OnPlane b p /\ OnPlane c p)

-- @matematika-id "axioma-incidencia-5" @lean-id "Matematika.Geometry.Hilbert.plane_has_three_noncollinear_points" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom plane_has_three_noncollinear_points (p : Plane) :
  ∃ a b c, OnPlane a p /\ OnPlane b p /\ OnPlane c p /\ Noncollinear a b c

-- @matematika-id "axioma-incidencia-6" @lean-id "Matematika.Geometry.Hilbert.line_contained_in_plane" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom line_contained_in_plane {l : Line} {p : Plane} {a b : Point} :
  a ≠ b ->
  OnLine a l ->
  OnLine b l ->
  OnPlane a p ->
  OnPlane b p ->
  LineInPlane l p

-- @matematika-id "axioma-incidencia-7" @lean-id "Matematika.Geometry.Hilbert.intersecting_planes_share_a_line" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom intersecting_planes_share_a_line {p q : Plane} :
  p ≠ q ->
  (∃ x, OnPlane x p /\ OnPlane x q) ->
  ∃ l, PlaneIntersectionIsLine l p q

-- @matematika-id "axioma-incidencia-8" @lean-id "Matematika.Geometry.Hilbert.exists_noncoplanar_points" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom exists_noncoplanar_points :
  ∃ a b c d, ¬∃ p, OnPlane a p /\ OnPlane b p /\ OnPlane c p /\ OnPlane d p

-- @matematika-id "teorema-dos-rectas-un-punto" @lean-id "Matematika.Geometry.Hilbert.two_lines_meet_at_most_one_point" @kind "theorem" @verificationStatus "lean-checked" @foundation "matematika-axioms" @deps ["axioma-incidencia-1"]
theorem two_lines_meet_at_most_one_point {l m : Line} (h_distinct : l ≠ m)
    {p q : Point}
    (hpl : OnLine p l) (hpm : OnLine p m)
    (hql : OnLine q l) (hqm : OnLine q m) :
    p = q := by
  -- @tactic-block-start "two-lines-one-point-step1-contradiction"
  apply Classical.byContradiction
  intro hpq
  -- @tactic-block-end "two-lines-one-point-step1-contradiction"
  -- @tactic-block-start "two-lines-one-point-step2-unique-line"
  obtain ⟨r, _hr, h_unique⟩ := line_through_two_points hpq
  -- @tactic-block-end "two-lines-one-point-step2-unique-line"
  -- @tactic-block-start "two-lines-one-point-step3-identify-lines"
  have hl_eq_r : l = r := h_unique l ⟨hpl, hql⟩
  have hm_eq_r : m = r := h_unique m ⟨hpm, hqm⟩
  -- @tactic-block-end "two-lines-one-point-step3-identify-lines"
  -- @tactic-block-start "two-lines-one-point-step4-contradiction"
  exact h_distinct (hl_eq_r.trans hm_eq_r.symm)
  -- @tactic-block-end "two-lines-one-point-step4-contradiction"

-- @matematika-id "corolario-rectas-coincidentes" @lean-id "Matematika.Geometry.Hilbert.lines_coincide_of_two_common_points" @kind "corollary" @verificationStatus "lean-checked" @foundation "matematika-axioms" @deps ["axioma-incidencia-1","teorema-dos-rectas-un-punto"]
theorem lines_coincide_of_two_common_points {l m : Line} {a b : Point}
    (hab : a ≠ b)
    (hal : OnLine a l) (hbl : OnLine b l)
    (ham : OnLine a m) (hbm : OnLine b m) :
    l = m := by
  -- @tactic-block-start "coincident-lines-step1-assume-distinct"
  apply Classical.byContradiction
  intro h_distinct
  -- @tactic-block-end "coincident-lines-step1-assume-distinct"
  -- @tactic-block-start "coincident-lines-step2-apply-one-point-theorem"
  have h_same_point : a = b :=
    two_lines_meet_at_most_one_point h_distinct hal ham hbl hbm
  -- @tactic-block-end "coincident-lines-step2-apply-one-point-theorem"
  -- @tactic-block-start "coincident-lines-step3-two-common-points"
  have h_not_same : a ≠ b := hab
  -- @tactic-block-end "coincident-lines-step3-two-common-points"
  -- @tactic-block-start "coincident-lines-step4-contradiction"
  have h_false : False := h_not_same h_same_point
  -- @tactic-block-end "coincident-lines-step4-contradiction"
  -- @tactic-block-start "coincident-lines-step5-conclusion"
  exact h_false
  -- @tactic-block-end "coincident-lines-step5-conclusion"

end Matematika.Geometry.Hilbert
