---
name: matematika-content-generator
description: Guía y estándar estricto para la generación automatizada y manual de contenido atómico en MDX para la Enciclopedia Matemática en Castellano, Euskara e Inglés. Utilizar siempre que se creen o editen artículos, definiciones, teoremas, demostraciones o ejemplos.
---

# Guía Estricta de Generación de Contenido — Enciclopedia Matemática

Esta skill define el protocolo obligatorio e inflexible para redactar y estructurar páginas atómicas de la Enciclopedia Matemática en tres idiomas (**Castellano**, **Euskara** e **Inglés**).

---

## 1. Principios Fundamentales y Reglas de Oro

### 1.1. Atomicidad Máxima y Delegación de Aplicaciones
- **Un concepto = Una página minimalista:** Las páginas de definición deben mantenerse **ligeras y enfocadas** (Párrafo introductorio + Definición formal KaTeX + Tabla de notaciones + Propiedades universales).
- **Delegación a nodos de Aplicación/Ejemplos:** Las interpretaciones aplicadas extensas (física/cinemática, económica/marginal, ejemplos prácticos) **no deben recargar la página del concepto**; se delegan a páginas atómicas independientes en `usecases/` o `examples/` enlazadas vía `<ConceptLink>`.
- **Prohibición Estricta de Autorreferencias:** Una página con `id: "concepto"` **nunca debe contener un `<ConceptLink targetId="concepto">` apuntando a sí misma**.
- **Delimitación de Alcance en Propiedades:** Enlistar en la sección `### Propiedades` únicamente propiedades universales válidas para todo el concepto. Teoremas o propiedades pertenecientes a subtipos específicos (ej. el Teorema de Pitágoras para triángulos rectángulos) deben pertenecer a la página del subtipo específico (`triangulo-rectangulo`), no al concepto general (`triangulo`).

### 1.2. Hiper-enlazado Total (`<ConceptLink>`)
- **Enlazado exhaustivo:** **Todos** los conceptos matemáticos con potencial de poseer página propia (incluso los más básicos como *cateto*, *hipotenusa*, *asociatividad*, *elemento neutro*, *elemento inverso*, *operador diferencial*, *mecánica clásica*, *ecuaciones diferenciales*) **deben ir envueltos en `<ConceptLink targetId="...">` desde su primera mención** (salvo la autorreferencia al propio id de la página).

### 1.3. Persona Gramatical y Voz
- **Persona:** Impersonal / Tercera Persona del Singular estricta en los 3 idiomas.
  - **Castellano:** *"Se define como...", "Un triángulo es..."* (Prohibida la 1ª persona como *"consideremos"* o *"vemos"*).
  - **Euskara:** *"Triangelua honela definitzen da...", "Taldea egitura aljebraiko bat da..."* (Euskara Batua según normativa de UZEI/Euskalterm y Euskaltzaindia).
  - **Inglés:** *"A group is defined as...", "The derivative represents..."* (Estilo enciclopédico atemporal neutro).
- **Tono:** Directo al grano, riguroso, formal y transparente. Sin especulaciones, divagaciones ni adornos retóricos.

### 1.4. Sección de Propiedades (Directa y Concisa)
- **Título de la sección:** `### Propiedades` (o `### Propietateak` / `### Properties`).
- **Formato:** Lista directa de las propiedades universales principales con explicaciones breves, enlazando los nombres de teoremas o conceptos clave directamente con `<ConceptLink targetId="...">`. **Prohibido incluir meta-explicaciones** del tipo *"las propiedades están vinculadas a sus páginas independientes"*.

### 1.5. Integración Implícita de Simulaciones Interactivas
- **`hasSimulation: true`:** Obligatorio en `metadata` cuando el concepto posea simulación visual (ej. `triangulo`, `derivada`).
- **Uso implícito de `<VisualBind>`:** Los elementos interactivos se integran orgánicamente en el texto con `<VisualBind element="..." color="...">`, **sin escribir bloques que digan "En la simulación interactiva se muestra..."**.

### 1.6. Formato de Cabeceras
- **Sentence Case:** Las cabeceras `###` deben llevar solo la primera palabra en mayúscula (ej. `### Clasificación métrica y angular`, `### Notaciones históricas y convenciones`).

---

## 2. Glosario Obligatorio de Euskara Técnico y Falsos Amigos

Para evitar errores graves de traducción o terminología en euskara, el generador debe aplicar estrictamente esta lista de equivalencias:

| ❌ Término Prohibido / Antipatrón | ✅ Término Correcto | Ámbito / Significado |
|---|---|---|
| `nekez` (significa *raras veces / difícilmente*) | **`nahitaez`** / **`ezinbestean`** | Para *"necesariamente"* (ej. *nahitaez da jarraitua*) |
| `ekitzaile` (significa *activista*) | **`ebakitzaile`** | Para recta *"secante"* (ej. *zuzen ebakitzailea*) |
| `koproportzio` (término inexistente) | **`koziente`** | Para *"cociente"* (ej. *diferentzia-kozientea*) |
| `tratuaren` (significa *del negocio/trato*) | **`higikariaren`** / **`gorputzaren`** | Para el cuerpo en movimiento (*velocidad del móvil*) |
| `konhexu` (letra 'h' incorrecta) | **`konbexu`** / **`ganbil`** | Para *"convexo"* (ej. *eremu konbexua*) |
| `strictly` (anglicismo) | **`zorrozki`** / **`zorrotz`** | Para *"estrictamente"* (ej. *zorrozki txikiagoa*) |
| `alderanzgarri` | **`alderantzizgarri`** | Para *"invertible"* (ej. *matrize alderantzizgarria*) |
| `Asociatibitatea` (letra 'c') | **`Asoziatibitatea`** / **`Elkartuzkotasuna`** | Para *"asociatividad"* |
| `zuzenki segmentuen` (redundancia) | **`zuzenkien`** / **`segmentuen`** | Para *"segmentos de recta"* |
| `Parerik gabe aldeen...` (traducción literal) | **`Alde-parerik kongruente gabe`** | Para *"ningún par de lados congruentes"* |

---

## 3. Notación Matemática Estricta y Lista de Verificación de Dominio

### 3.1. Estándares de Notación KaTeX (AMS / Bourbaki)
- **Conjuntos numéricos:** Usar blackboard bold `\mathbb{R}`, `\mathbb{Z}`, `\mathbb{N}`, `\mathbb{Q}`, `\mathbb{C}`.
- **Segmentos geométricos:** Usar **$\overline{AB}$** para el conjunto continuo del segmento (nunca $AB$ a secas, que representa la distancia escalar).
- **Ángulos:** Usar $\angle ABC$ o $\widehat{ABC}$.
- **Conjuntos y espacios:** Usar letra caligráfica $\mathcal{P}$ para planos, $\mathcal{E}$ para espacios.
- **Prohibido `\card`:** KaTeX no soporta `\card`. Usar $\lvert G \rvert$ o $\text{card}(G)$.
- **Plepas en tablas Markdown:** En tablas markdown, nunca usar la plepa literal `|` dentro de KaTeX; usar `\lvert ... \rvert` o `\mid`.

### 3.2. Restricciones de Dominio Matemático (Pre-flight Check)
- **Grupos matriciales no abelianos:** Especificar siempre la dimensión $n \ge 2$ (ej. $\text{GL}_n(\mathbb{R})$ con $n \ge 2$).
- **Definiciones analíticas:** Especificar la existencia de entornos abiertos $(x_0 - \delta, x_0 + \delta) \subset I$ para incrementos $x_0 + h \in I$.

---

## 4. Taxonomía MSC 2020 (`branch`)

Cada artículo debe especificar un código válido de **MSC 2020** registrado en `src/data/content/msc2020.ts` dentro de la propiedad `branch`:
- Geometría Euclidiana y Absoluta: `51M`
- Teoría de Grupos: `20` (o `20D`, `20F`)
- Análisis Real / Funciones de una variable: `26A`
- Álgebra Lineal: `15A`
- Fundamentos y Lógica: `03`

---

## 5. Secuencia Estricta de Componentes MDX

Todo archivo de definición en `content/mdx/{lang}/definitions/{id}.mdx` **debe seguir exactamente este orden**:

1. **Metadata Export (`export const metadata = { ... }`):**
   - Campos: `id`, `lang` (`es`|`eu`|`en`), `type` (`definicion`), `subtype`, `title`, `description`, `branch`, `hasSimulation` (`true`|`false`), `sources`.
2. **Import & Export de Simulación Interactiva** (si aplica):
   ```tsx
   import { Componente } from '@content/diagrams/Definiciones/Componente';
   export const Simulation = Componente;
   ```
3. **Párrafo Inicial Accesible:**
   - Iniciar con `<Capitular letra="X" />`.
   - Introducción clara que envuelva todos los términos clave en `<ConceptLink targetId="...">` (sin autorreferencia al propio `id`).
4. **Definición Formal (`<Definicion title="">`):**
   - Enunciado matemático formal en KaTeX con cuantificadores y pertenencia a conjuntos, vinculando elementos visuales implícitamente con `<VisualBind>`.
5. **Divisor Visual (`<Separador />`)**
6. **Secciones Complementarias (Sentence Case):**
   - Clasificaciones (tablas markdown con `<ConceptLink>`, notación KaTeX y escape de `|`).
   - Propiedades (`### Propiedades` / `### Propietateak` / `### Properties`) en formato de lista directa con `<ConceptLink>`.

---

## 6. Modelos de Oro (Golden Exemplars)

Toma como referencia exacta la estructura y estilo de los siguientes tres artículos modelo:

### 6.1. Geometría (MSC 51M) — `triangulo`
- Castellano: `content/mdx/es/definitions/triangulo.mdx`
- Euskara: `content/mdx/eu/definitions/triangulo.mdx`
- Inglés: `content/mdx/en/definitions/triangulo.mdx`

### 6.2. Álgebra Abstracta (MSC 20) — `grupo`
- Castellano: `content/mdx/es/definitions/grupo.mdx`
- Euskara: `content/mdx/eu/definitions/grupo.mdx`
- Inglés: `content/mdx/en/definitions/grupo.mdx`

### 6.3. Análisis Matemático (MSC 26A) — `derivada`
- Castellano: `content/mdx/es/definitions/derivada.mdx`
- Euskara: `content/mdx/eu/definitions/derivada.mdx`
- Inglés: `content/mdx/en/definitions/derivada.mdx`

---

## 7. Protocolo de Auto-Auditoría en 4 Filtros para Subagentes

Antes de dar por concluida la generación o modificación de cualquier nodo MDX, todo subagente debe ejecutar este chequeo en 4 filtros:

1. **Filtro 1: Simetría Trilingüe:** Asegurarse de que el identificador `id` exista en los tres directorios (`content/mdx/es/`, `content/mdx/eu/`, `content/mdx/en/`) con idéntico mapa de metadatos y sin autorreferencias.
2. **Filtro 2: Falsos Amigos en Euskara:** Consultar el Glosario de la Sección 2 para garantizar que no se haya usado `nekez`, `ekitzaile`, `koproportzio`, `tratuaren`, etc.
3. **Filtro 3: Dominio Matemático y Notación:** Comprobar que los segmentos usen $\overline{AB}$, que $\text{GL}_n(\mathbb{R})$ tenga $n \ge 2$, que no haya macros inexistentes como `\card` y que todos los términos de la definición tengan `<ConceptLink>`.
4. **Filtro 4: Validación Estática CI/CD:**
   ```bash
   npm run validate-references && npm run validate-graph
   ```
