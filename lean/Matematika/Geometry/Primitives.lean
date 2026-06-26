/-!
# Primitivas sintéticas de Matematika

Esta capa no interpreta los objetos geométricos mediante coordenadas. Declara
el lenguaje de la geometría sintética que los axiomas de Hilbert restringen en
los módulos superiores.
-/

namespace Matematika.Geometry

def ExistsUnique {α : Sort u} (p : α → Prop) : Prop :=
  ∃ x, p x ∧ ∀ y, p y → y = x

theorem ExistsUnique.exists {α : Sort u} {p : α → Prop} (h : ExistsUnique p) : ∃ x, p x :=
  let ⟨x, hx, _⟩ := h; ⟨x, hx⟩

theorem ExistsUnique.unique {α : Sort u} {p : α → Prop} (h : ExistsUnique p) {y₁ y₂ : α} (h₁ : p y₁) (h₂ : p y₂) : y₁ = y₂ :=
  let ⟨x, _, h_uniq⟩ := h
  have eq₁ := h_uniq y₁ h₁
  have eq₂ := h_uniq y₂ h₂
  eq₁.trans eq₂.symm

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
axiom SegmentSumGreater : Point -> Point -> Point -> Point -> Point -> Point -> Prop
axiom AngleCongruent : Angle -> Angle -> Prop
axiom AngleLess : Angle -> Angle -> Prop
axiom AngleSumStraight : Angle -> Angle -> Angle -> Prop
axiom LinesPerpendicular : Line -> Line -> Prop
axiom LinesParallel : Line -> Line -> Prop

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

structure SimplePolygon where
  vertexCount : Nat
  enoughVertices : 3 ≤ vertexCount

structure PolygonTriangulation where
  polygon : SimplePolygon

structure PolygonDecomposition where
  whole : SimplePolygon
  part₁ : SimplePolygon
  part₂ : SimplePolygon

structure RectangleFigure where
  polygon : SimplePolygon
  base : Nat
  height : Nat

structure TriangleAreaFigure where
  triangle : Triangle
  base : Nat
  height : Nat

structure RightTriangleMetricFigure where
  triangle : Triangle
  leg₁ : Nat
  leg₂ : Nat
  hypotenuse : Nat

structure ThalesConfiguration where
  triangle : Triangle
  pointOnFirstSide : Point
  pointOnSecondSide : Point
  parallelLine : Line

axiom ContentSumEquivalent : PolygonTriangulation -> PolygonTriangulation -> Prop
axiom ContentAdditiveFor : PolygonDecomposition -> Prop
axiom PolygonsCongruent : SimplePolygon -> SimplePolygon -> Prop
axiom ContentEqual : SimplePolygon -> SimplePolygon -> Prop
axiom RectangleContentFormula : RectangleFigure -> Prop
axiom TriangleContentFormula : TriangleAreaFigure -> Prop
axiom PythagoreanFormula : RightTriangleMetricFigure -> Prop
axiom ThalesProportionality : ThalesConfiguration -> Prop

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

def IsoscelesHypothesis (t : Triangle) : Prop :=
  SegmentCongruent t.a t.b t.a t.c

def BaseAnglesCongruent (t : Triangle) : Prop :=
  AngleCongruent { left := t.a, vertex := t.b, right := t.c }
    { left := t.a, vertex := t.c, right := t.b }

def ExternalAngleHypothesis (t : Triangle) (d : Point) : Prop :=
  Between t.b t.c d

def ExternalAngleConclusion (t : Triangle) (d : Point) : Prop :=
  AngleLess { left := t.b, vertex := t.a, right := t.c }
    { left := t.a, vertex := t.c, right := d } /\
  AngleLess { left := t.a, vertex := t.b, right := t.c }
    { left := t.a, vertex := t.c, right := d }

def VerticalAnglesHypothesis (a b c d o : Point) : Prop :=
  Between a o c /\ Between b o d

def VerticalAnglesConclusion (a b c d o : Point) : Prop :=
  AngleCongruent { left := a, vertex := o, right := b }
    { left := c, vertex := o, right := d } /\
  AngleCongruent { left := b, vertex := o, right := c }
    { left := d, vertex := o, right := a }

def ALAHypothesis (t u : Triangle) : Prop :=
  AngleCongruent { left := t.a, vertex := t.b, right := t.c }
    { left := u.a, vertex := u.b, right := u.c } /\
  SegmentCongruent t.b t.c u.b u.c /\
  AngleCongruent { left := t.b, vertex := t.c, right := t.a }
    { left := u.b, vertex := u.c, right := u.a }

def AALHypothesis (t u : Triangle) : Prop :=
  AngleCongruent { left := t.b, vertex := t.a, right := t.c }
    { left := u.b, vertex := u.a, right := u.c } /\
  AngleCongruent { left := t.a, vertex := t.b, right := t.c }
    { left := u.a, vertex := u.b, right := u.c } /\
  SegmentCongruent t.b t.c u.b u.c

def LLLHypothesis (t u : Triangle) : Prop :=
  SegmentCongruent t.a t.b u.a u.b /\
  SegmentCongruent t.b t.c u.b u.c /\
  SegmentCongruent t.c t.a u.c u.a

def IsMidpoint (a b m : Point) : Prop :=
  Between a m b /\ SegmentCongruent a m m b

def IsInteriorRayOfAngle (ang : Angle) (r : Ray) : Prop :=
  r.origin = ang.vertex

def IsAngleBisector (ang : Angle) (r : Ray) : Prop :=
  IsInteriorRayOfAngle ang r /\
  AngleCongruent { left := ang.left, vertex := ang.vertex, right := r.through }
    { left := r.through, vertex := ang.vertex, right := ang.right }

def IsPerpendicularThrough (p : Point) (l m : Line) : Prop :=
  OnLine p m /\ LinesPerpendicular m l

def EquidistantFrom (p a b : Point) : Prop :=
  SegmentCongruent p a p b

def IsPerpendicularBisectorLine (a b : Point) (l : Line) : Prop :=
  ∃ m base,
    IsMidpoint a b m /\
    OnLine m l /\
    OnLine a base /\
    OnLine b base /\
    LinesPerpendicular l base /\
    ∀ p, OnLine p l ↔ EquidistantFrom p a b

structure AlternateInteriorConfiguration where
  line₁ : Line
  line₂ : Line
  transversal : Line
  angle₁ : Angle
  angle₂ : Angle

def AlternateInteriorConclusion (cfg : AlternateInteriorConfiguration) : Prop :=
  AngleCongruent cfg.angle₁ cfg.angle₂ ↔ LinesParallel cfg.line₁ cfg.line₂

def TriangleAngleSumStraight (t : Triangle) : Prop :=
  AngleSumStraight
    { left := t.b, vertex := t.a, right := t.c }
    { left := t.a, vertex := t.b, right := t.c }
    { left := t.a, vertex := t.c, right := t.b }

def TriangleInequalityConclusion (t : Triangle) : Prop :=
  SegmentSumGreater t.b t.c t.c t.a t.a t.b /\
  SegmentSumGreater t.b t.c t.a t.b t.c t.a /\
  SegmentSumGreater t.c t.a t.a t.b t.b t.c

def PolygonTriangulationConclusion (p : SimplePolygon) : Prop :=
  ∃ diagonalCount triangleCount : Nat,
    diagonalCount = p.vertexCount - 3 /\
    triangleCount = p.vertexCount - 2

def TriangulationInvarianceConclusion (p : SimplePolygon) : Prop :=
  ∀ t u : PolygonTriangulation,
    t.polygon = p ->
    u.polygon = p ->
    ContentSumEquivalent t u

def ContentAdditivityConclusion (d : PolygonDecomposition) : Prop :=
  ContentAdditiveFor d

def ContentInvarianceConclusion (p q : SimplePolygon) : Prop :=
  PolygonsCongruent p q -> ContentEqual p q

def RectangleAreaConclusion (r : RectangleFigure) : Prop :=
  RectangleContentFormula r

def TriangleAreaConclusion (cfg : TriangleAreaFigure) : Prop :=
  TriangleContentFormula cfg

def PythagoreanConclusion (cfg : RightTriangleMetricFigure) : Prop :=
  PythagoreanFormula cfg

def ThalesConclusion (cfg : ThalesConfiguration) : Prop :=
  ThalesProportionality cfg

end Matematika.Geometry
