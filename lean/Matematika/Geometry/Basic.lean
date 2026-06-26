import Matematika.Geometry.Hilbert.Constructions

/-!
# Puentes provisionales de geometría

Los teoremas de este módulo compilan en la teoría sintética declarada, pero
todavía dependen de puentes explícitos. Su estado `bridge` evita presentarlos
como derivaciones completas desde los axiomas de Hilbert.
-/

namespace Matematika.Geometry

open Hilbert

axiom isosceles_reduces_to_base_angles :
  {t : Triangle} -> IsoscelesHypothesis t -> BaseAnglesCongruent t

axiom euclidean_triangle_angle_sum_reduction :
  {t : Triangle} -> TriangleAngleSumStraight t

axiom pythagorean_reduction :
  {cfg : RightTriangleMetricFigure} -> PythagoreanConclusion cfg

/- TODO: Los teoremas de Geometría Sintética (congruencia, área, etc.) 
   que dependían de Mathlib han sido eliminados de este archivo para 
   comenzar la reescritura pura usando los axiomas de Matematika.
-/

end Matematika.Geometry
