import Matematika.Geometry.Hilbert.Congruence
import Matematika.Geometry.Hilbert.Order

/-!
# Construcciones autorizadas por los axiomas de congruencia

Este módulo convierte las existencias únicas de los axiomas III-1 y III-4 en
objetos Lean reutilizables. Aún no identifica estos objetos con vértices de
una construcción ALA; esa conexión requiere axiomas adicionales sobre rayos,
semiplanos y triángulos no degenerados.
-/

namespace Matematika.Geometry.Hilbert

open Matematika.Geometry

noncomputable def transportedSegmentPoint (a b : Point) (r : Ray) : Point :=
  Classical.choose (ExistsUnique.exists (segment_transport a b r))

theorem transportedSegmentPoint_spec (a b : Point) (r : Ray) :
    OnRay r (transportedSegmentPoint a b r) /\
    SegmentCongruent a b r.origin (transportedSegmentPoint a b r) := by
  exact Classical.choose_spec (ExistsUnique.exists (segment_transport a b r))

theorem transportedSegmentPoint_unique (a b : Point) (r : Ray) (d : Point)
    (hd : OnRay r d)
    (hcongruent : SegmentCongruent a b r.origin d) :
    d = transportedSegmentPoint a b r := by
  apply ExistsUnique.unique (segment_transport a b r)
  · exact ⟨hd, hcongruent⟩
  · exact transportedSegmentPoint_spec a b r

noncomputable def transportedAngleRay
    (source : Angle) (target : Ray) (side : AngleConstructionSide) : Ray :=
  Classical.choose (ExistsUnique.exists (angle_transport source target side))

theorem transportedAngleRay_spec
    (source : Angle) (target : Ray) (side : AngleConstructionSide) :
    (transportedAngleRay source target side).origin = target.origin /\
    IsInAngleConstructionSide (transportedAngleRay source target side) side /\
    AngleCongruent source {
      left := target.through
      vertex := target.origin
      right := (transportedAngleRay source target side).through
    } := by
  exact Classical.choose_spec (ExistsUnique.exists (angle_transport source target side))

theorem transportedAngleRay_unique
    (source : Angle) (target : Ray) (side : AngleConstructionSide) (constructed : Ray)
    (horigin : constructed.origin = target.origin)
    (hside : IsInAngleConstructionSide constructed side)
    (hcongruent : AngleCongruent source {
      left := target.through
      vertex := target.origin
      right := constructed.through
    }) :
    constructed = transportedAngleRay source target side := by
  apply ExistsUnique.unique (angle_transport source target side)
  · exact ⟨horigin, hside, hcongruent⟩
  · exact transportedAngleRay_spec source target side

theorem congruent_of_lal {t u : Triangle} (h : LALHypothesis t u) :
    TriangleCongruent t u :=
  sas_congruence h

end Matematika.Geometry.Hilbert
