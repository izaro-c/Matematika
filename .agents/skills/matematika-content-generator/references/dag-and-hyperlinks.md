# Grafo Lógico, Enlaces Hipertextuales, Paridad Trilingüe y Causalidad (`isDependency`)

El conocimiento en Matematika se estructura como un **Grafo Acíclico Dirigido (DAG)** de dependencias lógicas y una red hipertextual abierta de navegación conceptual.

---

## 1. Enlaces a Páginas Futuras o No Creadas (Grafo Abierto)

- **Es totalmente obligatorio y bienvenido enlazar a conceptos, axiomas o teoremas que todavía no existen en el repositorio.**
- En la interfaz web, esos enlaces se renderizan de manera transparente conduciendo a una página provisional (*"En construcción"*), facilitando la navegación orgánica futura y la visión global del grafo de conocimiento.
- En la suite de validación estática (`npm run validate-references`), los enlaces a IDs aún no creados generan avisos informativos (`[WARN]`), **sin bloquear nunca la compilación**.

---

## 2. Causalidad Lógica con `isDependency` frente a Hiperenlaces Contextuales

El atributo `isDependency={true}` en `<ConceptLink>` se reserva **estrictamente** para alimentar el Grafo Acíclico Dirigido (DAG) deductivo:

```tsx
<!-- Dependencia causal formal del concepto (construye el DAG): -->
<ConceptLink isDependency={true} targetId="axioma-orden-4">Axioma de Pasch</ConceptLink>

<!-- Hiperenlace contextual o explicativo estándar (NO afecta al DAG): -->
<ConceptLink targetId="sistema-absoluto">geometría absoluta</ConceptLink>
```

### Matriz de Reglas para `isDependency`

| Contexto / Subtipo | Regla de `isDependency` | Justificación y Ejemplos |
| :--- | :--- | :--- |
| **Concepto primitivo** (`subtype: "primitivo"`) | **Prohibido `isDependency={true}`** (Omitir) | Nodo raíz de Grado 0 absoluto (`punto`, `recta`, `plano`, `incidencia`, `concepto-primitivo`). Los axiomas los gobiernan pero no los definen. |
| **Axiomas (`type: "axioma"`)** | **Obligatorio en primitivos de signatura** | Debe aplicarse a los términos primitivos de su signatura (`punto`, `recta`, `plano`) y a las relaciones primitivas que postula (`incidencia`, `estar-entre`, `congruencia`), actuando como Grado $-1$ del DAG. |
| **Concepto derivado** (`subtype: "derivado"`) | **`true` en conceptos y axiomas constitutivos** | Elementos esenciales sin los cuales el concepto no puede existir (e.g. `semiplano` $\to$ `recta`, `plano`, `segmento`, `axioma-orden-4`). |
| **Concepto construido / Espacio** (`espacio`) | **`true` en dominios y axiomas constitutivos** | El espacio tridimensional se compone de `punto`, `recta`, `plano` y los axiomas `axioma-incidencia-8` (3D) e `axioma-incidencia-7` (intersección planar). |
| **Conceptos nominales / Meta-conceptos** | **Omitir o `false`** | Nociones estructurales o de teoría de modelos (`dimension`, `signatura`, `estructura-geometrica`, `dominio`, `conjunto-disjunto`) que no actúan como cuellos de botella en el DAG de geometría sintética. |
| **Teoremas y demostraciones** (`type: "teorema"` / `type: "demostracion"`) | **`true` en axiomas, teoremas y lemas usados** | Justifica el paso deductivo de la prueba lógica formal. |
| **Modelos (`type: "modelo"`)** | **Omitir** (`false` por defecto) | Un modelo es una estructura semántica de satisfacción, no un nodo deductivo antecedente. |
| **Biografías y contextos históricos** | **Prohibido** | Las entradas biográficas no intervienen en las cadenas de inferencia lógica. |
| **Autorreferencia** | **Prohibido** | Prohibido enlazar con `isDependency={true}` al propio ID del archivo (evita ciclos lógicos fatales). |

---

## 3. Paridad Trilingüe Estricta (`es`, `en`, `eu`)

- **Coincidencia 1:1 absoluta:** Todo `<ConceptLink targetId="...">` introducido en el texto en castellano (`es/`) **debe estar presente de forma idéntica en las versiones en inglés (`en/`) y euskera (`eu/`)**.
- **Coherencia de `isDependency`:** Si un enlace lleva `isDependency={true}` en un idioma, debe llevarlo exactamente igual en los otros dos.
- **Correspondencia en diagramas:** Los identificadores de elementos y colores en `<VisualBind>` deben coincidir 1:1 en las tres variantes lingüísticas.

---

## 4. Catálogo de Convenciones Canónicas de `targetId`

Para asegurar la uniformidad en todo el corpus documental, se deben emplear los siguientes identificadores kebab-case canónicos:

| Área Temática | Término / Concepto | `targetId` Canónico |
| :--- | :--- | :--- |
| **Geometría Sintética** | Punto / Recta / Plano / Semiplano / Espacio | `punto`, `recta`, `plano`, `semiplano`, `espacio` |
| | Segmento / Semirrecta (Rayo) / Ángulo | `segmento`, `semirrecta`, `angulo` |
| | Triángulo / Polígono / Poliedro | `triangulo`, `poligono`, `poliedro` |
| | Incidencia / Traza de incidencia puntual | `incidencia`, `traza` |
| | Colinealidad / Coplanaridad / Paralelismo | `colinealidad`, `coplanaridad`, `paralelas` |
| | Orden e intermediación ($A * B * C$) | `estar-entre` |
| | Congruencia / Perpendicularidad | `congruencia`, `perpendicular` |
| | Continuidad / Axioma de Arquímedes / Axioma de Pasch | `continuidad`, `arquimedes`, `pasch` |
| | Geometría sintética / hilbertiana / analítica | `geometria-sintetica`, `geometria-hilbertiana`, `geometria-analitica` |
| | Geometría discreta / Geometría finita | `geometria-discreta`, `geometria-finita` |
| | Sistema de incidencia / absoluto / euclidiano / hiperbólico | `sistema-incidencia`, `sistema-absoluto`, `sistema-euclidiano`, `sistema-hiperbolico` |
| | Espacio proyectivo / Dualidad geométrica | `espacio-proyectivo`, `dualidad` |
| | Modelo tres puntos / Modelo de Fano / Modelo cartesiano | `modelo-tres-puntos`, `modelo-fano`, `modelo-cartesiano` |
| **Lógica y Fundamentos** | Lógica matemática / Teoría de modelos / Consistencia lógica | `logica`, `teoria-modelos`, `consistencia-logica` |
| | Sistema axiomático / Axioma / Teorema / Demostración | `sistema-axiomatico`, `axioma`, `teorema`, `demostracion` |
| | Concepto primitivo / Estructura matemática / Signatura | `concepto-primitivo`, `estructura-geometrica`, `signatura` |
| | Dominio primitivo / Conjunto / Conjuntos disjuntos / Conjunto convexo | `dominio`, `conjunto`, `conjunto-disjunto`, `conjunto-convexo` |
| | Relación / Relación binaria / Transposición (relación inversa) | `relacion`, `relacion-binaria`, `transposicion` |
| | Relación de equivalencia / Clase de equivalencia / Conjunto cociente | `relacion-equivalencia`, `clase-equivalencia`, `conjunto-cociente` |
| | Isomorfismo / Cardinalidad | `isomorfismo`, `cardinalidad` |
| **Álgebra y Métricas** | Álgebra / Álgebra lineal / Operación binaria / Grupo / Simetría | `algebra`, `algebra-lineal`, `operacion-binaria`, `grupo`, `simetria` |
| | Cuerpo / Cuerpo finito ($\mathbb{F}_q$) / Espacio vectorial / Subespacio | `cuerpo`, `cuerpo-finito`, `espacio-vectorial`, `subespacio` |
| | Base vectorial / Dimensión / Distancia métrica / Espacio métrico | `base`, `dimension`, `distancia`, `espacio-metrico` |
| **Geometría Algebraica** | Geometría algebraica / Variedad algebraica / Variedad de Fano | `geometria-algebraica`, `variedad-algebraica`, `variedad-fano` |
| | Programa de Erlangen | `programa-erlangen` |
| **Teoremas Notables** | Teorema de Desargues / Teorema de la recta de intersección | `teorema-desargues`, `teorema-interseccion-planos` |
