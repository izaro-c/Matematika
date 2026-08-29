# Registro de Progreso y Revisión de Documentos — Matematika

Este documento es el registro oficial en el repositorio del estado de reescritura, auditoría y aprobación de cada nodo del grafo de Matematika en sus tres idiomas (**Castellano**, **Euskara Batua** e **Inglés**).

> [!IMPORTANT]
> Un documento se considera **Aprobado con Visto Bueno Oficial** únicamente tras la revisión y confirmación explícita del usuario.

---

## 1. Documentos con Visto Bueno Oficial (Aprobados)

| ID | Título (ES) | Izenburua (EU) | Title (EN) | Tipo | Fecha Aprobación |
| :--- | :--- | :--- | :--- | :--- | :---: |
| [`punto`](../content/mdx/es/definitions/punto.mdx) | Punto | Puntua | Point | Definición (`primitivo`) | ✅ 2026-08-29 |
| [`recta`](../content/mdx/es/definitions/recta.mdx) | Recta | Zuzena | Line | Definición (`primitivo`) | ✅ 2026-08-29 |
| [`plano`](../content/mdx/es/definitions/plano.mdx) | Plano | Planoa | Plane | Definición (`primitivo`) | ✅ 2026-08-29 |
| [`concepto-primitivo`](../content/mdx/es/definitions/concepto-primitivo.mdx) | Concepto primitivo | Oinarrizko kontzeptua | Primitive concept | Definición (`primitivo`) | ✅ 2026-08-29 |
| [`incidencia`](../content/mdx/es/definitions/incidencia.mdx) | Incidencia | Intzidentzia | Incidence | Definición (`primitivo`) | ✅ 2026-08-29 |
| [`dimension`](../content/mdx/es/definitions/dimension.mdx) | Dimensión | Dimentsioa | Dimension | Definición (`nominal`) | ✅ 2026-08-29 |
| [`estructura-geometrica`](../content/mdx/es/definitions/estructura-geometrica.mdx) | Estructura geométrica | Egitura geometrikoa | Geometric structure | Definición (`nominal`) | ✅ 2026-08-29 |
| [`signatura`](../content/mdx/es/definitions/signatura.mdx) | Signatura | Sinadura | Signature | Definición (`nominal`) | ✅ 2026-08-29 |
| [`semiplano`](../content/mdx/es/definitions/semiplano.mdx) | Semiplano | Planoerdia | Half-plane | Definición (`derivado`) | ✅ 2026-08-29 |
| [`dominio`](../content/mdx/es/definitions/dominio.mdx) | Dominio | Domeinua | Domain | Definición (`nominal`) | ✅ 2026-08-29 |
| [`conjunto-disjunto`](../content/mdx/es/definitions/conjunto-disjunto.mdx) | Conjuntos disjuntos | Multzo disjuntuak | Disjoint sets | Definición (`nominal`) | ✅ 2026-08-29 |
| [`geometria-sintetica`](../content/mdx/es/definitions/geometria-sintetica.mdx) | Geometría sintética | Geometria sintetikoa | Synthetic geometry | Definición (`nominal`) | ✅ 2026-08-29 |
| [`geometria-hilbertiana`](../content/mdx/es/definitions/geometria-hilbertiana.mdx) | Geometría hilbertiana | Geometria hilbertiarra | Hilbertian geometry | Definición (`nominal`) | ✅ 2026-08-29 |
| [`espacio`](../content/mdx/es/definitions/espacio.mdx) | Espacio | Espazioa | Space | Definición (`nominal`) | ✅ 2026-08-29 |

---

## 2. Documentos Reescritos / Generados (En Espera de Revisión)

### A. Conceptos Fundamentales y Primitivos
*(Todos los conceptos fundamentales del Lote 1 han recibido visto bueno oficial)*.

### B. Sistema Axiomático de Incidencia
| ID | Título (ES) | Izenburua (EU) | Title (EN) | Tipo | Estado |
| :--- | :--- | :--- | :--- | :--- | :---: |
| [`sistema-incidencia`](../content/mdx/es/axiomatic-systems/sistema-incidencia.mdx) | Sistema de incidencia | Intzidentzia-sistema | Incidence system | `sistema-axiomatico` | ⏳ Pendiente |

### C. Axiomas de Incidencia (Hilbert Grupo I)
| ID | Título (ES) | Izenburua (EU) | Title (EN) | Axioma | Estado |
| :--- | :--- | :--- | :--- | :--- | :---: |
| [`axioma-incidencia-1`](../content/mdx/es/axioms/axioma-incidencia-1.mdx) | Determinación de la recta | Zuzenaren determinazioa | Determination of the line | I.1 | ⏳ Pendiente |
| [`axioma-incidencia-2`](../content/mdx/es/axioms/axioma-incidencia-2.mdx) | Puntos en recta | Puntuak zuzenean | Points on a line | I.2 | ⏳ Pendiente |
| [`axioma-incidencia-3`](../content/mdx/es/axioms/axioma-incidencia-3.mdx) | Puntos no colineales | Puntu ez-kolinealak | Non-collinear points | I.3 | ⏳ Pendiente |
| [`axioma-incidencia-4`](../content/mdx/es/axioms/axioma-incidencia-4.mdx) | Determinación del plano | Planoaren determinazioa | Determination of the plane | I.4 | ⏳ Pendiente |
| [`axioma-incidencia-5`](../content/mdx/es/axioms/axioma-incidencia-5.mdx) | Unicidad del plano | Planoaren bakartasuna | Uniqueness of the plane | I.5 | ⏳ Pendiente |
| [`axioma-incidencia-6`](../content/mdx/es/axioms/axioma-incidencia-6.mdx) | Inclusión de recta en plano | Zuzena planoan sartzea | Line inclusion in a plane | I.6 | ⏳ Pendiente |
| [`axioma-incidencia-7`](../content/mdx/es/axioms/axioma-incidencia-7.mdx) | Intersección de dos planos | Planoen ebakidura | Intersection of planes | I.7 | ⏳ Pendiente |
| [`axioma-incidencia-8`](../content/mdx/es/axioms/axioma-incidencia-8.mdx) | Espacio tridimensional | Hiru dimentsioko espazioa | Three-dimensional space | I.8 | ⏳ Pendiente |

### D. Modelos de Incidencia
| ID | Título (ES) | Izenburua (EU) | Title (EN) | Tipo | Estado |
| :--- | :--- | :--- | :--- | :--- | :---: |
| [`modelo-tres-puntos`](../content/mdx/es/models/modelo-tres-puntos.mdx) | Modelo de tres puntos | Hiru puntuko eredua | Three-point model | `modelo` | ⏳ Pendiente |
| [`modelo-fano`](../content/mdx/es/models/modelo-fano.mdx) | Plano de Fano | Fanoren planoa | Fano plane | `modelo` | ⏳ Pendiente |

---

## 3. Próximos Documentos por Escribir (Micro-Lote 2: Orden e Intermediación)

- `estar-entre.mdx` (Definición primitiva de intermediación)
- `axioma-orden-1.mdx` (Axioma II.1 - Simetría e intermediación)
- `axioma-orden-2.mdx` (Axioma II.2 - Extensión de la recta)
- `axioma-orden-3.mdx` (Axioma II.3 - Tres puntos en recta)
- `axioma-orden-4.mdx` (Axioma II.4 - Axioma de Pasch / Separación del plano)
- `segmento.mdx` (Definición derivada)
- `semirrecta.mdx` (Definición derivada)
- `angulo.mdx` (Definición derivada)
- `triangulo.mdx` (Definición derivada)
