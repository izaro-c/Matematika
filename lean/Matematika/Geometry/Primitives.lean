/-!
# Primitivas sintéticas de Matematika

Esta capa no interpreta los objetos geométricos mediante coordenadas. Declara
el lenguaje de la geometría sintética que los axiomas de Hilbert restringen en
los módulos superiores.
-/

namespace Matematika.Geometry

axiom Point : Type
axiom Line : Type
axiom Plane : Type
axiom AngleConstructionSide : Type

structure Angle where
  left : Point
  vertex : Point
  right : Point

axiom OnLine : Point -> Line -> Prop
axiom OnPlane : Point -> Plane -> Prop
axiom Between : Point -> Point -> Point -> Prop
axiom SegmentCongruent : Point -> Point -> Point -> Point -> Prop
axiom AngleCongruent : Angle -> Angle -> Prop

def Collinear (a b c : Point) : Prop :=
  ∃ l, OnLine a l /\ OnLine b l /\ OnLine c l

def Noncollinear (a b c : Point) : Prop :=
  ¬Collinear a b c

structure Ray where
  origin : Point
  through : Point
  distinct : origin ≠ through

def OnRay (r : Ray) (x : Point) : Prop :=
  x = r.origin ∨
  x = r.through ∨
  Between r.origin x r.through ∨
  Between r.origin r.through x

structure Triangle where
  a : Point
  b : Point
  c : Point
  noncollinear : Noncollinear a b c

axiom IsInAngleConstructionSide : Ray -> AngleConstructionSide -> Prop

def LineInPlane (l : Line) (p : Plane) : Prop :=
  ∀ x, OnLine x l -> OnPlane x p

def PlaneIntersectionIsLine (l : Line) (p q : Plane) : Prop :=
  ∀ x, OnLine x l ↔ OnPlane x p /\ OnPlane x q

def TriangleCongruent (t u : Triangle) : Prop :=
  SegmentCongruent t.a t.b u.a u.b /\
  SegmentCongruent t.b t.c u.b u.c /\
  SegmentCongruent t.c t.a u.c u.a /\
  AngleCongruent { left := t.b, vertex := t.a, right := t.c }
    { left := u.b, vertex := u.a, right := u.c } /\
  AngleCongruent { left := t.c, vertex := t.b, right := t.a }
    { left := u.c, vertex := u.b, right := u.a } /\
  AngleCongruent { left := t.a, vertex := t.c, right := t.b }
    { left := u.a, vertex := u.c, right := u.b }

def LALHypothesis (t u : Triangle) : Prop :=
  SegmentCongruent t.a t.b u.a u.b /\
  SegmentCongruent t.a t.c u.a u.c /\
  AngleCongruent { left := t.b, vertex := t.a, right := t.c }
    { left := u.b, vertex := u.a, right := u.c }

def ALAHypothesis (t u : Triangle) : Prop :=
  AngleCongruent { left := t.a, vertex := t.b, right := t.c }
    { left := u.a, vertex := u.b, right := u.c } /\
  SegmentCongruent t.b t.c u.b u.c /\
  AngleCongruent { left := t.b, vertex := t.c, right := t.a }
    { left := u.b, vertex := u.c, right := u.a }

def LLLHypothesis (t u : Triangle) : Prop :=
  SegmentCongruent t.a t.b u.a u.b /\
  SegmentCongruent t.b t.c u.b u.c /\
  SegmentCongruent t.c t.a u.c u.a

end Matematika.Geometry
