import Matematika.Geometry.Hilbert.Incidence

/-!
# Axiomas de orden de Hilbert

El orden se expresa mediante la relación primitiva `Between a b c`, que se lee
como "b está entre a y c".
-/

namespace Matematika.Geometry.Hilbert

open Matematika.Geometry

def ExactlyOneOfThree (p q r : Prop) : Prop :=
  (p ∨ q ∨ r) /\ ¬(p /\ q) /\ ¬(p /\ r) /\ ¬(q /\ r)

-- @matematika-id "axioma-orden-1" @lean-id "Matematika.Geometry.Hilbert.between_distinct_symmetric" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom between_distinct_symmetric {a b c : Point} :
  Between a b c ->
  a ≠ b /\ a ≠ c /\ b ≠ c /\ Collinear a b c /\ Between c b a

-- @matematika-id "axioma-orden-2" @lean-id "Matematika.Geometry.Hilbert.exists_between_distinct_points" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom exists_between_distinct_points {a c : Point} :
  a ≠ c -> ∃ b, Between a b c

-- @matematika-id "axioma-orden-3" @lean-id "Matematika.Geometry.Hilbert.order_trichotomy" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom order_trichotomy {a b c : Point} :
  a ≠ b ->
  a ≠ c ->
  b ≠ c ->
  Collinear a b c ->
  ExactlyOneOfThree (Between a b c) (Between a c b) (Between b a c)

-- @matematika-id "axioma-orden-4" @lean-id "Matematika.Geometry.Hilbert.pasch" @kind "axiom" @verificationStatus "none" @foundation "matematika-axioms" @deps []
axiom pasch {t : Triangle} {l : Line} :
  ¬OnLine t.a l ->
  ¬OnLine t.b l ->
  ¬OnLine t.c l ->
  (∃ p, OnLine p l /\ Between t.a p t.b) ->
  (∃ q, OnLine q l /\ Between t.a q t.c) ∨
  (∃ q, OnLine q l /\ Between t.b q t.c)

end Matematika.Geometry.Hilbert
