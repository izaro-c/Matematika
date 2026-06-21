# Referencia de Componentes MDX

Todos los componentes listados aquí están disponibles globalmente en archivos `.mdx` sin necesidad de importarlos, EXCEPTO `InteractiveElement` que DEBE importarse explícitamente desde `../../components/ui/VisualBind`.

## Componentes de Estructura

### `<Capitular letra="X" />`
Capitular decorativa al inicio de la página.
- **Props:** `letra: string` — la primera letra del contenido
- **Uso:** OBLIGATORIO al inicio de toda página
- **Ejemplo:** `<Capitular letra="E" />l teorema de...`

### `<Separador />`
Separador visual entre secciones.
- **Props:** ninguna
- **Uso:** Entre cada sección principal. NUNCA usar `---`
- **Ejemplo:** `<Separador />`

### `<Formula title="...">`
Contenedor para ecuaciones matemáticas destacadas.
- **Props:** `title?: string` — título opcional
- **Children:** LaTeX en `$$...$$` o `$...$`
- **Ejemplo:**
  ```mdx
  <Formula>
    $$ a^2 + b^2 = c^2 $$
  </Formula>
  ```

### `<EquationRow>`
Agrupa múltiples ecuaciones inline centradas horizontalmente.
- **Children:** ecuaciones inline
- **Ejemplo:**
  ```mdx
  <EquationRow>
    $a = 3$ $b = 4$ $c = 5$
  </EquationRow>
  ```

## Componentes de Contenido

### `<Definicion title="...">`
Bloque de definición formal inline.
- **Props:** `title?: string` — título (por defecto "Definición")
- **Children:** texto de la definición
- **Ejemplo:**
  ```mdx
  <Definicion title="Circunferencia">
    Es el conjunto de puntos que equidistan de un centro.
  </Definicion>
  ```

### `<Demostracion>`
Bloque formal de demostración matemática.
- **Children:** texto de la demostración
- **Nota:** Añade $\blacksquare$ automáticamente al final
- **Ejemplo:**
  ```mdx
  <Demostracion>
    Por hipótesis, tenemos que...
  </Demostracion>
  ```

### `<Nota>`
Observación o comentario lateral.
- **Children:** texto de la nota
- **Ejemplo:** `<Nota>Esto solo vale para casos no degenerados.</Nota>`

### `<Cita author="...">`
Cita o epígrafe.
- **Props:** `author?: string` — autor de la cita
- **Children:** texto de la cita
- **Ejemplo:**
  ```mdx
  <Cita author="Euclides">No hay camino real a la geometría.</Cita>
  ```

### `<Corolario>`
Corolario embebido en una página de teorema.
- **Children:** texto del corolario
- **Nota:** Para corolarios con página propia, crear archivo separado con `type: "corolario"`

## Componentes de Enlazado Semántico

### `<ConceptLink targetId="slug">`
Enlace semántico a un nodo con página propia. Abre el MarginaliaPanel.
- **Props:** `targetId: string` — ID del contenido destino
- **Children:** texto del enlace
- **Color:** terracota
- **Ejemplo:** `<ConceptLink targetId="triangulo">triángulo</ConceptLink>`

### `<RefLink targetId="slug">`
Enlace semántico suave. Abre el MarginaliaPanel pero sin crear dependencia formal.
- **Props:** `targetId: string`
- **Children:** texto del enlace
- **Color:** pizarra
- **Ejemplo:** `<RefLink targetId="teorema-tales">ver también Tales</RefLink>`

### `<GlossaryLink term="término">`
Tooltip rápido para términos auxiliares del glosario.
- **Props:** `term: string` — término del glosario
- **Children:** texto del enlace
- **Ejemplo:** `<GlossaryLink term="hipotenusa">hipotenusa</GlossaryLink>`

### `<VisualBind color="token" element="id">`
Vincula texto a un elemento del diagrama adyacente. Al hover, ilumina el elemento.
- **Props:** `color: string` (token Arts & Crafts), `element: string` (ID del elemento)
- **Children:** texto vinculado
- **Ejemplo:** `<VisualBind color="terracota" element="lado-ab">lado AB</VisualBind>`

### `<InteractiveElement target="var" color="token">`
Vincula texto inline a una variable del diagrama. Escribe en `MathStore.highlight`.
- **IMPORTAR DESDE:** `../../components/ui/VisualBind` (NO desde MDXBlocks)
- **Props:** `target: string` (nombre del elemento), `color?: string` (token Arts & Crafts)
- **Children:** texto vinculado
- **Ejemplo:**
  ```mdx
  import { InteractiveElement } from "../../components/ui/VisualBind";
  ...
  <InteractiveElement target="cuadrado-a" color="terracota">cuadrado de área $a^2$</InteractiveElement>
  ```

## Componentes de Demostración

### `<DemonstrationSection diagram={...} diagrams={...}>`
Layout split para demostraciones interactivas. Diagrama izquierda (sticky), texto derecha (scrolleable).
- **Props:** `diagram?: ReactNode` (diagrama único), `diagrams?: Record<string, ReactNode>` (mapa por paso)
- **Children:** `<MedievalStep>` elementos
- **Importar desde:** `../../components/content/DemonstrationSection`
- **Lee:** `MathStore.variables['highlight']` para decidir qué diagrama mostrar

### `<MedievalStep number={N} title="..." target="...">`
Paso numerado con estética Arts & Crafts. Auto-highlight al hacer scroll.
- **Props:** `number: number`, `title: string`, `target?: string | string[]`
- **target:** nombre del elemento a resaltar (string o array). Usa IntersectionObserver.
- **Importar desde:** `../../components/content/MedievalStep`
- **Escribe:** `MathStore.variables['highlight']` cuando el paso es visible

## Componentes de Ejercicio

### `<Pregunta>`
Pregunta de un ejercicio.
- **Children:** enunciado + `<Hueco>`

### `<Hueco respuesta="...">`
Campo de respuesta rellenable por el estudiante.
- **Props:** `respuesta: string`
- **Children:** placeholder

### `<Solucion>`
Solución revelable del ejercicio.
- **Children:** desarrollo de la solución

### `<ErrorComun>`
Sección de error común asociado al ejercicio.
- **Children:** descripción del error y por qué es incorrecto

### `<Paso>`
Paso numerado en la resolución de un ejercicio.
- **Children:** contenido del paso

### `<Emparejar>`
Ejercicio de emparejamiento.

### `<Clasificador>`
Ejercicio de clasificación.

### `<Ordenacion>`
Ejercicio de ordenación.

### `<MatrizInteractiva>`
Matriz interactiva para ejercicios de álgebra lineal.

### `<CanvasInteractivo>`
Canvas interactivo para ejercicios de dibujo.

### `<DeslizadorEnLine>`
Deslizador inline para manipular variables.

### `<DynamicValue>`
Valor dinámico ligado a una variable del MathStore.

## Componentes Adicionales

### `<Concept>`
Contenedor de concepto (usado en lecciones).

### `<HighlightLink>`
Enlace con highlight (variante de ConceptLink).
