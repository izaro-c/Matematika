# Tareas de corrección por bloque (auditoría oct. 2026)

Reglas comunes a TODOS los bloques (además de SKILL.md y references/convenciones-proyecto.md):
- Aplicar convenciones-proyecto.md completas: notación, citas de Hilbert sin Satz y con el § correcto, IDs canónicos, prohibición de "curvatura" en nodos sintéticos, sin radianes, sin intensificadores vacíos, sin muletillas de marco.
- Enlaces exhaustivos (§7 de convenciones): cada término matemático enlazado con ConceptLink, exista o no la página.
- `lang` en metadatos; `<Definicion title="">` vacío → título real; id = nombre de archivo.
- `PropiedadItem id` que reutilizan un ID de otro nodo ajeno al contenido → id descriptivo nuevo.
- Paridad 1:1 es/en/eu (mismos ConceptLink, isDependency, componentes, fórmulas). Redactar es y derivar en/eu frase a frase.
- Euskera: euskara batua académico según references/euskara-glossary.md (actualizado: *angelu zuzena*, *erdikaria* para bisectriz, *angelu auzokideak*, *azalera* para área, *erdiko puntua*, *zuzenkia*, *zuzenerdia*, *planoerdia*; teorema recíproco = *X teoremaren alderantzizkoa*). Revisar gramática, concordancia, casos (ergativo, sociativo con *intziditu*), orden natural; evitar calcos del castellano.
- Euskera: la fuente oficial es Elhuyar Hiztegia (https://hiztegiak.elhuyar.eus/es/<palabra>). Ante cualquier término dudoso, compruébalo con WebFetch en Elhuyar; si Elhuyar no lo recoge, usa la forma más próxima recogida o atestiguada y anótalo en tu informe.
- Diagramas: si cambias un `element=` de VisualBind, comprueba que existe en el componente de diagrama importado (content/diagrams/...). No modifiques diagramas salvo que sea imprescindible; si lo haces, menciónalo y ejecuta `npm run typecheck`.
- No toques docs/progreso-reescritura.md ni la skill ni ficheros de otros bloques. No ejecutes generadores que reescriban src/data (sí puedes ejecutar los validadores).
- Validación al final: `node .agents/skills/matematika-content-generator/scripts/check-parity.mjs <ids>`; `npm run validate-references` (solo mira errores, no WARN de páginas inexistentes); `npm run validate-graph` (ningún "Ciclo roto").
- Informe final breve: qué cambiaste por nodo, decisiones dudosas, IDs nuevos enlazados que no existen.

---

## W1 — Fundamentos y metateoría
Nodos: punto, recta, plano, incidencia, concepto-primitivo, dominio, espacio, estructura-geometrica, signatura, conjunto-disjunto, dimension, geometria-sintetica, geometria-hilbertiana, traza
- `incidencia`: eliminar la definición «ℓ ⊆ π»; la inclusión recta-plano se expresa como tr(ℓ) ⊆ tr(π) (noción derivada; I.6 da un criterio para ella, no la "fija").
- `plano`: quitar «sin curvatura» (el plano hiperbólico también es plano).
- `traza`: conjunto potencia ℘(𝒫). Inyectividad planar: necesita que todo plano contenga tres puntos no colineales; la cláusula «todo plano contiene al menos un punto» de Hilbert I.4 se añade al axioma I.4 (bloque W2); justificar o presentarla con la hipótesis explícita. Revisar paridad eu (-2 fórmulas).
- `espacio`: no confundir universo del discurso con "espacio" como figura; distinguir ambos usos. Quitar curvatura en espacio euclídeo/hiperbólico (o marcar como propio de modelos riemannianos). Símbolo ≅ (no ≡). Paridad: falta `sort` en en/eu.
- `geometria-hilbertiana`: ≅ en vez de ≡. La propiedad «independencia de los cinco grupos» con fórmula ∀i≠j Gi⊬Gj es incorrecta: Hilbert probó independencias concretas (paralelas, Arquímedes, partes de congruencia) en cap. II; corregir. La lista de 20 axiomas corresponde a la 7.ª ed. (la 1.ª, 1899, tenía otro orden y un axioma redundante, Moore 1902).
- `signatura`: no usar 𝓛 como "lenguaje formal" (colisión con rectas).
- `dimension`: la cota superior viene de I.7; triángulo = figura de dimensión 1 (unión de segmentos); la región poligonal es la de dimensión 2.
- `conjunto-disjunto`: la propiedad «dos a dos ⇒ intersección global vacía» exige |I| ≥ 2.
- `concepto-primitivo`, `dominio`, `estructura-geometrica`, `geometria-sintetica`, `punto`, `recta`: revisar enlaces, notación, ≅, estilo.

## W2 — Axiomas de incidencia y orden, sistema de incidencia, modelos finitos
Nodos: axioma-incidencia-1..8, axioma-orden-1..4, sistema-incidencia, modelo-tres-puntos, modelo-fano
- `axioma-incidencia-4`: añadir la segunda cláusula de Hilbert: «todo plano incide con al menos un punto» (∀π∈Π ∃P (P I π)), en enunciado y fórmula.
- `axioma-orden-2` Nota: la infinitud de tr(ℓ) no se sigue de II.1–II.2 (hay un modelo de 3 puntos con orden cíclico); necesita también II.3 y II.4 (Hilbert §4). Corregir.
- `axioma-orden-3` Nota: «exactamente uno entre los otros dos» requiere II.4 (Pasch) para la existencia. Corregir. Paridad: en eu falta isDependency en `recta`.
- `axioma-orden-4`: notación consistente; paridad eu (+1 fórmula); Nota (polígono/frontera) precisa.
- `sistema-incidencia`: los modelos de tres puntos y Fano son planos: solo satisfacen I.1–I.3; ℝ³ sí modela I.1–I.8. Indicar un modelo finito del sistema espacial completo (tetraedro: 4 puntos, 6 rectas, 4 planos; o PG(3,2)). Corregir la lista `models` (separar modelos planos de espaciales con explicación).
- `modelo-fano`: «carece de rectas paralelas» → «no existen dos rectas paralelas distintas». PropiedadItem ids `axioma-incidencia-1/2/3` → ids nuevos descriptivos manteniendo el ConceptLink al axioma en el texto. Paridad: en falta `dimension`, `relacion-equivalencia`; eu falta `relacion-equivalencia`.
- `modelo-tres-puntos`: mismo tratamiento.
- Axiomas I.1–I.8, II.1: revisar enlaces, notación, títulos homogéneos, muletillas «En el sistema de incidencia, este postulado…» → reformular.

## W3 — Definiciones de orden y congruencia
Nodos: estar-entre, segmento, semirrecta, semiplano, angulo, triangulo, congruencia, angulos-suplementarios, perpendicular, triangulo-rectangulo
- `semiplano`: notación tipada (tr(π)∖tr(ℓ), seg(AB)∩tr(ℓ), tr(ℓ)⊆tr(π)); quitar muletilla inicial; PropiedadItem id `conjunto-convexo` → `convexidad-semiplano`; 𝒫_n → otro nombre. Paridad eu (-1 fórmula).
- `semirrecta`: «orden total lineal estricto (≤)» corregir; la equivalencia de las dos descripciones de la semirrecta cerrada es consecuencia de resultados de orden, no identidad definitoria. Paridad eu (+particion).
- `segmento`: paridad eu (-1 fórmula), convexidad es teorema.
- `angulo`: «Propiedades estructurales» (no topológicas). Paridad en: falta `igualdad-matematica` y 1 fórmula.
- `triangulo`: PropiedadItem id `axioma-orden-4` → `interseccion-recta-triangulo`; la exclusividad ("exactamente uno de los otros dos lados") NO la da Pasch: es teorema (§4); fórmula tipada con hipótesis completas. Quitar «continuidad y cierre topológico de su frontera». Convención de correspondencia ordenada en △ABC ≅ △A'B'C'.
- `congruencia`: congruencia de triángulos con correspondencia ordenada.
- `angulos-suplementarios`: quitar «Satz 12» (congruencia de suplementos, Hilbert §6); reescribir la frase «semirrecta secante proyectada sobre un semiplano»; el ángulo recto se define en `angulo-recto` (enlace), no dentro de una propiedad.
- `perpendicular`: la fórmula de existencia/unicidad incluye tr(ℓ) ⊆ tr(π) y cuantifica π; quitar «curvatura»; paridad en/eu.
- `triangulo-rectangulo`: ERROR «ningún triángulo puede poseer … ángulos obtusos» → «un triángulo con un ángulo recto no puede tener otro ángulo recto ni obtuso» (ángulo exterior, absoluto); △ABC conjunto de segmentos; |AC|²+|BC|²=|AB|²; paridad en/eu: falta `lado`.
- `estar-entre`: revisar.

## W4 — Axiomas de congruencia y primeros teoremas
Nodos: axioma-congruencia-1..5, teorema-triangulo-isosceles, demo-triangulo-isosceles, teorema-angulos-opuestos-verticales, demo-angulos-opuestos-verticales, teorema-congruencia-ala, demo-congruencia-ala, teorema-existencia-bisectriz, demo-existencia-bisectriz
- `axioma-congruencia-1`: Hilbert III.1 solo afirma existencia; la unicidad es teorema (§6, `teorema-unicidad-transporte-segmentos`); revisar los «único» de las demos. Reflexividad en la fórmula o como cláusula formal. «traslado métrico» → «transporte». Paridad eu.
- `axioma-congruencia-4`: fórmula tipada (sin ⊂ con rectas/planos, plano σ); la partición en clases requiere simetría y transitividad de la congruencia angular, que son TEOREMA (§6, vía III.5). Paridad eu.
- `axioma-congruencia-5`: Nota con IDs canónicos; el enlace «Axioma III.5» no va a `axioma`.
- `teorema-triangulo-isosceles`: recíproco sin «Satz 12»; △ABC conjunto de segmentos; la prueba solo usa III.5 (y la reflexividad de III.4).
- `demo-triangulo-isosceles`: §6 sin Satz.
- `teorema-angulos-opuestos-verticales`: depende de `teorema-congruencia-suplementos` (III.1, III.3, III.5), no «directamente de III.4»; sin Satz 13; `σ_O` definir/enlazar o quitar.
- `demo-angulos-opuestos-verticales`: «par opuesto complementario» → segundo par; Satz → nombre; dependencia al teorema de suplementos; paridad en/eu.
- `teorema-congruencia-ala`: LAA vale en geometría ABSOLUTA (I.26, vía `teorema-angulo-exterior`); quitar «triangulación geodésica/trigonométrica», fórmula «↦ △/≅»; locator §6; «exclusivamente de III.1, III.4, III.5» → también incidencia y orden.
- `demo-congruencia-ala`: (a) simetría/transitividad angular es teorema, no III.4; (b) el paso final usa `teorema-congruencia-lal` (isDependency), no III.5 directamente; (c) justificar que C* está en el mismo semiplano que C'; (d) C* ≠ A'; (e) intersección única de dos rectas distintas (I.1). Valorar prueba directa.
- `teorema-existencia-bisectriz`: sin «convexo»; ángulo como par; la propiedad de equidistancia es falsa y usa d(P,recta): reformular sintéticamente (P en el interior; P en la bisectriz ⇔ PH ≅ PK con H, K pies de las perpendiculares) o eliminar. Locator §6.
- `demo-existencia-bisectriz`: REESCRIBIR sin Euclides I.1: B con OA≅OB (III.1); M punto medio de AB (`teorema-existencia-punto-medio`); △OAM ≅ △OBM (LLL o isósceles + LAL); M ∈ seg(AB) ⇒ M ∈ Int(∠AOB); ⇒ ∠AOM ≅ ∠BOM. Unicidad por orden de ángulos (`orden-angulos`). Ajustar diagrama solo si es imprescindible.

## W5 — Paralelismo y continuidad
Nodos: paralelas, axioma-paralelas-euclides, axioma-paralelas-hiperbolico, teorema-angulos-alternos-internos, demo-angulos-alternos-internos, teorema-suma-angulos-triangulo, demo-suma-angulos-triangulo, axioma-arquimedes, axioma-completitud
- `axioma-paralelas-euclides`: quitar «curvatura constante nula»; «Axioma IV (Hilbert)»; postulado 5 y Playfair equivalentes sobre la absoluta; usar `teorema-angulos-alternos-internos` para el teorema. Locator §7.
- `axioma-paralelas-hiperbolico`: «grupos I a IV» → I, II, III y V; quitar «demostrando la existencia de geometrías consistentes» (modelos de Beltrami/Klein/Poincaré); Π(d) → θ(d); medida en grados; ultraparalelas = rectas por P en el par de ángulos opuestos entre las paralelas límite que NO contiene a la perpendicular desde P a ℓ; `geometria-hiperbolica` → `sistema-hiperbolico`. Paridad eu.
- `teorema-angulos-alternos-internos`: ⇐ absoluta (I.27), ⇒ usa el axioma IV (I.29), dicho en descripción y enunciado. Propiedades: sin π como suma; «Supl» enlazado; la propiedad «unicidad de paralelas» es circular: reformular o quitar. Locators §6 y §7.
- `demo-angulos-alternos-internos`: DEMOSTRAR AMBAS DIRECCIONES. (⇐) por contradicción con `teorema-angulo-exterior` (isDependency), caso P∈H₂ correcto y el simétrico, orden de ángulos (sin |α|), justificar ℓ≠m y P∉t. (⇒) m' por B con alterno congruente (III.4); m'∥ℓ por (⇐); `axioma-paralelas-euclides` ⇒ m'=m. Ajustar metadata y diagrama.
- `teorema-suma-angulos-triangulo`: sin «curvatura nula», sin «ángulo llano»; medida |α|; Saccheri–Legendre usa `axioma-arquimedes`; la equivalencia con IV requiere Arquímedes (Dehn); sin radianes. Locator §7.
- `demo-suma-angulos-triangulo`: paralela a la RECTA AB; D, E en ℓ en semiplanos adecuados; justificar contigüidad (interiores); medida angular y aditividad; dependencias al teorema (I.29) y al axioma IV.
- `paralelas`: revisar; locator §7.
- `axioma-arquimedes`: capitular/Nota con la notación del enunciado (copias de CD hasta rebasar B); simulación coherente con el enunciado (revisar AxiomaArquimedes); ∃n∈ℕ no es de primer orden (una frase); quitar «En la arquitectura de la geometría absoluta»; nota histórica (Euclides V def. 4, Eudoxo). Locator §8.
- `axioma-completitud`: V.2 = maximalidad; Dedekind ⇔ V.1+V.2 (sobre I–III); quitar `biparticion-conexa` o definirlo; «laguna infinitesimal» la excluye V.1; isomorfismo de orden con ℝ (no "cuerpo"); quitar el ejemplo ℚ² (sustituir por el plano sobre el cuerpo pitagórico mínimo Ω de Hilbert o los reales algebraicos, que satisfacen I–IV y V.1 pero no V.2); las intersecciones recta/circunferencia ya valen en cuerpos euclídeos. Locator §8.

## W6 — Sistemas axiomáticos, modelos analíticos y métodos (reescritura completa)
Nodos: sistema-absoluto, sistema-euclidiano, sistema-hiperbolico, modelo-cartesiano, modelo-poincare, metodo-directo, metodo-contradiccion, metodo-induccion
- `sistema-absoluto`: grupos I, II, III, V; ℝ²/𝔻² no verifican el sistema (I.4–I.8); sí ℝ³ y la bola de Poincaré/Klein; doble perpendicular; Saccheri–Legendre usa Arquímedes; sin curvatura; A*B*C.
- `sistema-euclidiano`: Playfair con coplanaridad y tipos; «IV»; sin curvatura; consistencia relativa (Hilbert cap. II); categoricidad con V (ℝ³).
- `sistema-hiperbolico`: fórmula con coplanaridad y tipos; θ(x), tan(θ(x)/2)=e^{-x/k} con k explicado; cota de área πk²; curvatura solo en el modelo; consistencia relativa (Beltrami 1868, Klein, Poincaré).
- `modelo-cartesiano`: modelo del plano euclídeo (axiomas planos); ℝ³ para el espacial; tres puntos distintos; paridad eu.
- `modelo-poincare`: plano; ultraparalelas bien descritas; área = π − suma (radianes) permitido aquí; paridad en/eu.
- `metodo-contradiccion`: ejemplo de perpendiculares con el teorema del ángulo exterior; paridad en.
- `metodo-directo`, `metodo-induccion`: estándar, enlaces.

## W7 — Proporcionalidad y figuras (reescritura completa)
Nodos: semejanza, teorema-tales, demo-tales, cuadrilatero, paralelogramo, cuadrado, circunferencia
- Notación: planos π/σ (nunca 𝒫), |AB|, ≅, sin radianes salvo circunferencia.
- `semejanza`: triángulos semejantes = ángulos homólogos congruentes y lados proporcionales; figuras generales vía semejanzas del plano euclídeo (isometría `isometria` ∘ homotecia) aparte; criterios AA, LAL, LLL dependen de `teorema-tales`; escalado de áreas k². PropiedadItem ids propios.
- `teorema-tales`: teorema de la intersección (las transversales no tienen que cortarse); corolario del triángulo; prueba por áreas (VI.2) con `teorema-area-triangulo` isDependency; nota: Hilbert la funda sin continuidad (cap. III). Añadir lang.
- `demo-tales`: VI.2 por áreas con justificaciones; extender al caso general o explicitar. lang. Paridad en.
- `cuadrilatero`, `paralelogramo`, `cuadrado`: definiciones sintéticas; paralelismo de rectas soporte; propiedades euclidianas marcadas; ángulos rectos (no «≅ 90°»); rombo = cuatro lados congruentes; sin ids reutilizados.
- `circunferencia`: {P : OP ≅ OA} sintética y luego métrica/analítica; círculo/disco coherente; 2πr y πr² como resultados enlazados.

## W8 — Área y Pitágoras (reescritura completa; sin ciclo aditividad ↔ demo)
Nodos: teoria-medida-area, teorema-area-aditividad, demo-area-aditividad, teorema-area-rectangulo, demo-area-rectangulo, teorema-area-triangulo, demo-area-triangulo, teorema-pitagoras, demo-pitagoras-euclides, demo-pitagoras-areas
- Seguir la cadena de convenciones §6.
- `teoria-medida-area`: A(R)>0, invariancia por congruencia, aditividad para dos piezas, normalización; equidescomponibilidad/equicomplementabilidad (Hilbert cap. IV); existencia y unicidad = `teorema-existencia-area` (sin isDependency).
- `teorema-area-aditividad` + demo: aditividad finita por inducción (`metodo-induccion`), sin usar el área del triángulo. Nota Dehn (1900) / Sydler (1965) correcta.
- `teorema-area-rectangulo` + demo: entero → racional ((p·n)·(m·q) cuadrados de lado 1/(qn)) → real (monotonía + `axioma-arquimedes`). «exhaución».
- `teorema-area-triangulo` + demo: REESCRIBIR con el pie H de la altura (H interior, exterior, extremo). Mismo método en teorema y demo. Herón/trigonométrica como notas.
- `teorema-pitagoras`: a=|BC|, b=|CA|, c=|AB|; no euclidianas: cosh c = cosh a cosh b (hiperbólica, curvatura −1), cos c = cos a cos b (esfera unidad); recíproco = alderantzizkoa en eu; `sistema-euclidiano`. lang. Paridad.
- `demo-pitagoras-euclides`: definir todos los puntos y justificar cada congruencia; etiquetas = diagrama; paridad eu.
- `demo-pitagoras-areas`: justificar cuadrado interior; nota histórica sin Bhaskara (tradición china, *Zhoubi suanjing*/Zhao Shuang, con prudencia).

## W9 — Biografías
Nodos: arquimedes, dedekind, pasch, fano, euclides, hilbert, bolyai, lobachevski, descartes, fermat, lebesgue, menger, hurewicz, urysohn, wallman, peano, pitagoras, tales, poncelet, staudt, steiner
- `matematico`: sin isDependency ni SeccionPropiedades; ConceptLink a todo lo mencionado.
- `fano`: el plano de Fano NO prueba la independencia de Desargues (PG(2,2) es desarguesiano); Fano (1892) mostró la independencia de su axioma (puntos diagonales de un cuadrivértice completo no alineados); su memoria trata sobre todo PG(3,2) (15 puntos). Revisar «geometría diferencial».
- `bolyai`, `lobachevski`: no demostraron la consistencia (Beltrami 1868, Klein, Poincaré); Lobachevski: «Geometría imaginaria» 1835/1837, *Pangeometría* 1855.
- `pitagoras`, `tales`: matizar atribuciones (Proclo/Eudemo; Hipaso); fechas aproximadas.
- `arquimedes`: el principio ya está en Euclides V def. 4 (Eudoxo); «casi dos milenios».
- `dedekind`: la cortadura no es el V.2 de Hilbert; Dedekind ⇔ V.1+V.2.
- `hilbert`: 20 axiomas en este orden = ediciones posteriores (7.ª); 1.ª ed. otro orden y axioma redundante (Moore 1902); espacios de Hilbert: matizar (von Neumann).
- `euclides`: fl. c. 300 a. C.
- Resto: ampliar a biografía breve correcta con enlaces y verificar datos (von Staudt y la continuidad implícita; Lebesgue/Čech; Menger y Urysohn independientes).
- Paridad: euclides (recta), menger/urysohn (eu: dimension), wallman (dimension), staudt (incidencia).

## W10 — Didáctica y nodos transversales
Nodos: ejemplo-pitagoras-calculo, ejercicio-pitagoras-cateto, ejercicio-clasificacion-triangulos, caso-gps-trilateracion, plan-de-estudio-camino-teorema-pitagoras, grupo, derivada
- Nombres coherentes con `teorema-pitagoras`: a=|BC|, b=|CA|, c=|AB|, recto en C (ajustar diagramas).
- Plan: id ≠ nombre de archivo: buscar referencias antes de renombrar; fase 4 (Tales es base de la semejanza).
- `caso-gps-trilateracion`: a lo sumo dos puntos; tres centros no alineados; paridad.
- `ejercicio-clasificacion-triangulos`: redacción natural; 3,4,5 usa el recíproco de Pitágoras (enlazar).
- `grupo`, `derivada`: estándar; quitar locators de Grundlagen que no correspondan.
