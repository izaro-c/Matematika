import Matematika.Geometry.Hilbert.Constructions

namespace Matematika.Geometry.Hilbert

-- @matematika-id "lema-punto-medio" @lean-id "Matematika.Geometry.Hilbert.lema_punto_medio" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["segmento","punto","congruencia","teorema-punto-medio-perpendicular","axioma-incidencia-3","axioma-congruencia-4","axioma-congruencia-1","axioma-orden-4","axioma-congruencia-5","teorema-congruencia-lll","teorema-congruencia-ala","axioma-orden-3"]
theorem lema_punto_medio : True := by
  sorry

-- @matematika-id "teorema-angulo-externo" @lean-id "Matematika.Geometry.Hilbert.teorema_angulo_externo" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-orden-3","axioma-orden-4","lema-punto-medio","axioma-incidencia-1","axioma-congruencia-1","teorema-angulos-opuestos-verticales","axioma-congruencia-5","axioma-congruencia-4"]
theorem teorema_angulo_externo : True := by
  sorry

-- @matematika-id "teorema-angulos-alternos-internos" @lean-id "Matematika.Geometry.Hilbert.teorema_angulos_alternos_internos" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["teorema-angulo-externo","axioma-paralelas-euclides","teorema-angulos-opuestos-verticales","axioma-congruencia-4"]
theorem teorema_angulos_alternos_internos : True := by
  sorry

-- @matematika-id "teorema-angulos-opuestos-verticales" @lean-id "Matematika.Geometry.Hilbert.teorema_angulos_opuestos_verticales" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["angulos-suplementarios","axioma-congruencia-4","axioma-congruencia-3"]
theorem teorema_angulos_opuestos_verticales : True := by
  sorry

-- @matematika-id "teorema-area-aditividad" @lean-id "Matematika.Geometry.Hilbert.teorema_area_aditividad" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["teorema-triangulacion-poligono"]
theorem teorema_area_aditividad : True := by
  sorry

-- @matematika-id "teorema-area-invariancia" @lean-id "Matematika.Geometry.Hilbert.teorema_area_invariancia" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["teorema-triangulacion-poligono","axioma-congruencia-5","axioma-incidencia-1"]
theorem teorema_area_invariancia : True := by
  sorry

-- @matematika-id "teorema-area-rectangulo" @lean-id "Matematika.Geometry.Hilbert.teorema_area_rectangulo" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-arquimedes","teorema-area-aditividad","axioma-completitud"]
theorem teorema_area_rectangulo : True := by
  sorry

-- @matematika-id "teorema-area-triangulo" @lean-id "Matematika.Geometry.Hilbert.teorema_area_triangulo" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["teorema-existencia-perpendicular","teorema-area-aditividad","axioma-congruencia-5","teorema-area-invariancia","teorema-area-rectangulo"]
theorem teorema_area_triangulo : True := by
  sorry

-- @matematika-id "teorema-congruencia-aal" @lean-id "Matematika.Geometry.Hilbert.teorema_congruencia_aal" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-congruencia-5","teorema-angulo-externo","axioma-congruencia-1","teorema-congruencia-ala","teorema-congruencia-lll"]
theorem teorema_congruencia_aal : True := by
  sorry

-- @matematika-id "teorema-congruencia-ala" @lean-id "Matematika.Geometry.Hilbert.teorema_congruencia_ala" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["congruencia","angulo","triangulo","segmento","axioma-congruencia-1","axioma-congruencia-5","axioma-congruencia-4"]
theorem teorema_congruencia_ala : True := by
  sorry

-- @matematika-id "teorema-congruencia-lll" @lean-id "Matematika.Geometry.Hilbert.teorema_congruencia_lll" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-congruencia-5","axioma-congruencia-1","axioma-congruencia-4","teorema-triangulo-isosceles","axioma-congruencia-3"]
theorem teorema_congruencia_lll : True := by
  sorry

-- @matematika-id "teorema-desigualdad-triangular" @lean-id "Matematika.Geometry.Hilbert.teorema_desigualdad_triangular" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-orden-3","axioma-congruencia-1","axioma-incidencia-1","teorema-triangulo-isosceles","teorema-angulo-externo","axioma-congruencia-4","axioma-congruencia-3"]
theorem teorema_desigualdad_triangular : True := by
  sorry

-- @matematika-id "teorema-existencia-bisectriz" @lean-id "Matematika.Geometry.Hilbert.teorema_existencia_bisectriz" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["lema-punto-medio","teorema-congruencia-lll","axioma-congruencia-4","axioma-congruencia-1","axioma-incidencia-2","axioma-incidencia-1","axioma-congruencia-5","teorema-congruencia-ala","axioma-orden-3"]
theorem teorema_existencia_bisectriz : True := by
  sorry

-- @matematika-id "teorema-existencia-perpendicular" @lean-id "Matematika.Geometry.Hilbert.teorema_existencia_perpendicular" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["lema-punto-medio","axioma-congruencia-4","axioma-congruencia-5","teorema-angulo-externo","axioma-incidencia-2","axioma-incidencia-3","axioma-orden-4","axioma-congruencia-1","axioma-incidencia-1"]
theorem teorema_existencia_perpendicular : True := by
  sorry

-- @matematika-id "teorema-invariancia-triangulacion" @lean-id "Matematika.Geometry.Hilbert.teorema_invariancia_triangulacion" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["teorema-area-aditividad","teorema-dos-rectas-un-punto"]
theorem teorema_invariancia_triangulacion : True := by
  sorry

-- @matematika-id "teorema-pitagoras" @lean-id "Matematika.Geometry.Hilbert.teorema_pitagoras" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-paralelas-euclides","axioma-congruencia-5","teorema-suma-angulos-triangulo","teorema-existencia-perpendicular","axioma-incidencia-1","teorema-area-triangulo"]
theorem teorema_pitagoras : True := by
  sorry

-- @matematika-id "teorema-punto-medio-perpendicular" @lean-id "Matematika.Geometry.Hilbert.teorema_punto_medio_perpendicular" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["lema-punto-medio","axioma-congruencia-5","teorema-congruencia-lll"]
theorem teorema_punto_medio_perpendicular : True := by
  sorry

-- @matematika-id "teorema-reciproco-triangulo-isosceles" @lean-id "Matematika.Geometry.Hilbert.teorema_reciproco_triangulo_isosceles" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["teorema-triangulo-isosceles","teorema-angulo-externo","axioma-congruencia-1","axioma-incidencia-1"]
theorem teorema_reciproco_triangulo_isosceles : True := by
  sorry

-- @matematika-id "teorema-suma-angulos-triangulo" @lean-id "Matematika.Geometry.Hilbert.teorema_suma_angulos_triangulo" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-paralelas-euclides","teorema-angulos-alternos-internos"]
theorem teorema_suma_angulos_triangulo : True := by
  sorry

-- @matematika-id "teorema-tales" @lean-id "Matematika.Geometry.Hilbert.teorema_tales" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-paralelas-euclides","axioma-incidencia-1"]
theorem teorema_tales : True := by
  sorry

-- @matematika-id "teorema-triangulacion-poligono" @lean-id "Matematika.Geometry.Hilbert.teorema_triangulacion_poligono" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["axioma-orden-4","triangulo","axioma-orden-3"]
theorem teorema_triangulacion_poligono : True := by
  sorry

-- @matematika-id "teorema-triangulo-isosceles" @lean-id "Matematika.Geometry.Hilbert.teorema_triangulo_isosceles" @kind "theorem" @verificationStatus "human-proof" @foundation "pending" @deps ["triangulo","segmento","angulo","congruencia","axioma-congruencia-5"]
theorem teorema_triangulo_isosceles : True := by
  sorry

end Matematika.Geometry.Hilbert