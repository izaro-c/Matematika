import Matematika.Geometry.Hilbert.Constructions

/-!
# Puentes provisionales de geometría

Los teoremas de este módulo compilan en la teoría sintética declarada, pero
todavía dependen de puentes explícitos. Su estado `bridge` evita presentarlos
como derivaciones completas desde los axiomas de Hilbert.
-/

namespace Matematika.Geometry

open Hilbert

axiom ala_reduces_to_lal :
  {t u : Triangle} -> ALAHypothesis t u -> LALHypothesis t u

axiom lll_reduces_to_lal :
  {t u : Triangle} -> LLLHypothesis t u -> LALHypothesis t u

-- @matematika-id "teorema-congruencia-ala" @lean-id "Matematika.Geometry.congruence_ala" @kind "theorem" @status "bridge" @deps ["axioma-congruencia-1","axioma-congruencia-4","axioma-congruencia-5","congruencia","angulo","triangulo","segmento"]
theorem congruence_ala {t u : Triangle} (h : ALAHypothesis t u) :
    TriangleCongruent t u := by
  -- @tactic-block-start "ala-step1-transport"
  have h_transport : ALAHypothesis t u := h
  -- @tactic-block-end "ala-step1-transport"
  -- @tactic-block-start "ala-step2-apply-lal"
  have h_lal : LALHypothesis t u := ala_reduces_to_lal h_transport
  -- @tactic-block-end "ala-step2-apply-lal"
  -- @tactic-block-start "ala-step3-uniqueness"
  exact congruent_of_lal h_lal
  -- @tactic-block-end "ala-step3-uniqueness"

-- @matematika-id "teorema-congruencia-lll" @lean-id "Matematika.Geometry.congruence_lll" @kind "theorem" @status "bridge" @deps ["axioma-congruencia-1","axioma-congruencia-3","axioma-congruencia-4","axioma-congruencia-5","teorema-triangulo-isosceles","congruencia","triangulo"]
theorem congruence_lll {t u : Triangle} (h : LLLHypothesis t u) :
    TriangleCongruent t u := by
  -- @tactic-block-start "lll-step1-transport"
  have h_transport : LLLHypothesis t u := h
  -- @tactic-block-end "lll-step1-transport"
  -- @tactic-block-start "lll-step2-apply-lal"
  have h_lal : LALHypothesis t u := lll_reduces_to_lal h_transport
  -- @tactic-block-end "lll-step2-apply-lal"
  -- @tactic-block-start "lll-step3-auxiliary-isosceles"
  have h_auxiliary : LALHypothesis t u := h_lal
  -- @tactic-block-end "lll-step3-auxiliary-isosceles"
  -- @tactic-block-start "lll-step4-conclusion"
  exact congruent_of_lal h_auxiliary
  -- @tactic-block-end "lll-step4-conclusion"

end Matematika.Geometry
