# Matematika - Enciclopedia Viva

Matematika es una plataforma enciclopédica interactiva y orgánica diseñada para explorar el conocimiento matemático. En lugar de presentar páginas aisladas, los conceptos, teoremas, y matemáticos están fuertemente entrelazados en una "Red Semántica" navegable, permitiendo a los estudiantes explorar las matemáticas como lo que realmente son: un ecosistema profundamente interconectado.

## Trabajo con IA

El proyecto usa una infraestructura común, no ligada a un proveedor. Toda herramienta comienza en [`AGENTS.md`](AGENTS.md); el gobierno formal vive en [`docs/ai/`](docs/ai/README.md), el estado y los paquetes de trabajo diarios en [`ai/`](ai/README.md), y los procedimientos reutilizables en [`.agents/skills/`](.agents/skills/). OpenCode dispone de su adaptador oficial en [`.opencode/`](.opencode/).

Para iniciar una sesión con el mínimo contexto, se leen `AGENTS.md`, `ai/current-state.md`, un único objetivo de `ai/goals/` y, cuando corresponda, una skill.

## Características Principales

1. **Grafo de Conocimiento (Knowledge Graph)**: Un lienzo interactivo bidimensional que mapea dinámicamente las relaciones semánticas entre conceptos. Si un teorema menciona una definición o una demostración, una conexión orgánica se renderiza automáticamente.
2. **Validación Estricta de Contenido**: Todo el contenido está escrito en MDX (Markdown + React). Los metadatos de cada artículo (*frontmatter*) se validan estrictamente mediante **Zod** para garantizar la integridad referencial y de esquemas.
3. **Lectura Marginal (Marginalia)**: Inspirado en los textos clásicos, los enlaces a otros conceptos no expulsan al usuario de su contexto de lectura. En su lugar, abren elegantes paneles laterales (`MarginaliaPanel`) con resúmenes rápidos, axiomas matemáticos y simulaciones interactivas incrustadas.
4. **Simulaciones Reactivas**: Los diagramas interactivos se inyectan en tiempo real dentro del contenido y en el panel lateral, proporcionando intuición geométrica o conceptual in situ.

---

## 🛠 Stack Tecnológico

- **Framework**: React 19 + TypeScript
- **Arquitectura**: Feature-Sliced Design (FSD)
- **Bundler**: Vite + Rollup
- **Routing**: Wouter (Routing ligero y declarativo)
- **Contenido**: MDX (`@mdx-js/rollup`) + Remark/Rehype Math (Soporte KaTeX)
- **Validación**: Zod
- **Visualización**: `react-force-graph-2d` (Físicas d3-force)
- **Formalización**: Lean 4
- **Estilos**: Tailwind CSS (con un sistema de diseño "Arts and Crafts" personalizado: lienzo, carbon, salvia, terracota, etc).

---

## 🚀 Requisitos Previos

- **Node.js** (recomendado v20+) y **npm**
- **Lean 4** y **Elan/Lake** (requeridos para las validaciones lógicas profundas y el puente interactivo de pruebas)

---

## ⚙️ Instalación y Uso

1. **Clonar e instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) para ver la aplicación en funcionamiento.

3. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 🧪 Validaciones y Comandos

Matematika aplica un estricto flujo de validación. Las siguientes validaciones se aseguran de que no se rompan las dependencias arquitectónicas, lógicas o referenciales.

- **`npm run lint`**: Validación de estilo y código.
- **`npm run typecheck`**: Verificación estricta de tipos TypeScript.
- **`npm run test`**: Ejecutar pruebas funcionales y de componentes con Vitest.
- **`npm run test:coverage`**: Generar reporte de cobertura de código.
- **`npm run depcruise`**: Asegura que se cumple estrictamente la arquitectura Feature-Sliced Design (FSD).
- **`npm run validate-references`**: Valida que los enlaces (ConceptLink) sean íntegros.
- **`npm run validate-graph`**: Verifica que el DAG lógico (grafo acíclico dirigido) no tenga ciclos lógicos.
- **`npm run validate-lean`**: Requiere Lean instalado. Compila Lean, regenera el grafo lógico y valida la coherencia entre el texto en MDX y las pruebas certificadas en Lean.
- **`npm run bridge:audit`**: Verifica la cobertura Lean y la deuda explícita (temporal) de las declaraciones que todavía no están formalmente certificadas.

> **Política Editorial**: La carga del sistema y de las páginas en sí no falla ni se bloquea completamente si un autor enlaza hacia un artículo que "aún no existe" (ideal para flujo de redacción). El `ContentStore` (`src/entities/content/ContentStore.ts`) registrará warnings o mostrará estados 404 controlados para que la plataforma principal siga siendo navegable mientras se construye nuevo contenido.

---

## ✍️ Cómo Añadir Contenido

Matematika utiliza el sistema de archivos como base de datos de contenido estático (MDX).
Los metadatos se validan en el inicio a través de `ContentStore` (`src/entities/content/ContentStore.ts`).

### 1. Ubicaciones (MDX)
El contenido real escrito en Markdown reside en `src/database/content/`:
- `theorems/`: Teoremas principales, lemas y corolarios.
- `definitions/`: Conceptos, axiomas y definiciones formales.
- `examples/`: Ejemplos prácticos y numéricos resueltos.
- `exercises/`: Ejercicios propuestos con pistas y soluciones ocultas.
- `usecases/`: Aplicaciones del mundo real de conceptos matemáticos abstractos.
- `demonstrations/`: Demostraciones formales y paso a paso.
- `mathematicians/`: Biografías históricas.
- `axioms/`, `axiomatic-systems/`, `models/`, `lessons/`.

### 2. Formato MDX y Zod (Frontmatter)
Todo archivo `.mdx` debe exportar obligatoriamente una constante `metadata` que cumpla con su esquema correspondiente especificado en `src/entities/content/schemas.ts`. Se exige el formato `kebab-case` para todos los identificadores (`id`).

Ejemplo de un `teorema.mdx`:
```mdx
export const metadata = {
  id: "teorema-ejemplo",
  type: "teorema",
  title: "Teorema de Ejemplo",
  description: "Descripción breve que aparecerá en el panel lateral.",
  statement: "El enunciado formal con matemáticas en LaTeX: $a^2 = b^2 + c^2$.",
  requires: ["definicion-previa"], // Grafo de dependencias lógicas
};

<Capitular letra="C" />onsidérese el <ConceptLink targetId="definicion-asociada">concepto asociado</ConceptLink>...
```

### 3. El componente `<ConceptLink>`
Es el corazón de la navegación interna. **Nunca uses `<a>` o `<Link>` estándar para navegar entre conceptos**.
Usa `<ConceptLink targetId="slug-del-archivo">Texto a mostrar</ConceptLink>`. Esto alimenta automáticamente el Grafo de Conocimiento y habilita el panel lateral.

---

## 📂 Arquitectura Feature-Sliced Design (FSD)

```
src/
├── app/            # Entry point (AppRouter, Providers, CSS global)
├── pages/          # Páginas principales con enrutamiento de Wouter
├── widgets/        # Bloques de UI compuestos y Lados (Marginalia, TopBar, Layouts)
├── features/       # Módulos de dominio y stores (Graph, Editor, Glossary, Search...)
├── entities/       # Lógica central de datos y tipados (ContentStore, Schemas, Graph Types)
├── shared/         # Componentes atómicos (UI base, Layouts, Libs, Theme, JSXGraph Diagrams)
└── database/       # Colecciones Markdown reactivas (Contenido MDX real)
```
