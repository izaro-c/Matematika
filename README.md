# Matematika - Enciclopedia Viva

Matematika es una plataforma enciclopédica interactiva y orgánica diseñada para explorar el conocimiento matemático. En lugar de presentar páginas aisladas, los conceptos, teoremas, y matemáticos están fuertemente entrelazados en una "Red Semántica" navegable, permitiendo a los estudiantes explorar las matemáticas como lo que realmente son: un ecosistema profundamente interconectado.

## Características Principales

1. **Grafo de Conocimiento (Knowledge Graph)**: Un lienzo interactivo bidimensional (basado en `react-force-graph-2d`) que mapea dinámicamente las relaciones semánticas entre conceptos. Si un teorema menciona una definición o una demostración, una conexión orgánica se renderiza automáticamente.
2. **Validación Estricta de Contenido**: Todo el contenido está escrito en MDX (Markdown + React). Los metadatos de cada artículo (*frontmatter*) se validan estrictamente mediante **Zod** para garantizar la integridad referencial y de esquemas.
3. **Lectura Marginal (Marginalia)**: Inspirado en los textos clásicos, los enlaces a otros conceptos no expulsan al usuario de su contexto de lectura. En su lugar, abren elegantes paneles laterales (`MarginaliaPanel`) con resúmenes rápidos, axiomas matemáticos (en LaTeX) y simulaciones interactivas incrustadas.
4. **Simulaciones Reactivas**: Los diagramas interactivos se inyectan en tiempo real dentro del contenido y en el panel lateral, proporcionando intuición geométrica o conceptual in situ.

---

## 🛠 Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite + Rollup
- **Routing**: Wouter (Routing ligero y declarativo)
- **Contenido**: MDX (`@mdx-js/rollup`) + Remark/Rehype Math (Soporte KaTeX)
- **Validación**: Zod
- **Visualización**: `react-force-graph-2d` (Físicas d3-force)
- **Estilos**: Tailwind CSS (con un sistema de diseño "Arts and Crafts" personalizado).

---

## 🚀 Instalación y Uso

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

## ✍️ Cómo Añadir Contenido

Matematika utiliza el sistema de archivos como base de datos (`src/store/ContentStore.ts`). Añadir contenido es tan sencillo como crear un archivo `.mdx` en la carpeta correspondiente.

### 1. Ubicaciones
- `src/content/theorems`: Teoremas principales.
- `src/content/definitions`: Conceptos, axiomas y definiciones formales.
- `src/content/examples`: Ejemplos prácticos y numéricos.
- `src/content/exercises`: Ejercicios propuestos con pistas y soluciones.
- `src/content/usecases`: Aplicaciones del mundo real.
- `src/content/demonstrations`: Demostraciones formales paso a paso.
- `src/content/mathematicians`: Biografías históricas.

### 2. Formato MDX y Zod (Frontmatter)
Todo archivo `.mdx` debe exportar obligatoriamente una constante `metadata` que cumpla con su esquema en `schemas.ts`.

Ejemplo de un `teorema.mdx`:
```mdx
export const metadata = {
  id: "teorema-ejemplo",
  title: "Teorema de Ejemplo",
  description: "Descripción breve que aparecerá en el panel lateral.",
  statement: "El enunciado formal con matemáticas en LaTeX: $a^2 = b^2 + c^2$.",
  links: ["definicion-asociada", "matematico-autor"],
  requires: ["definicion-previa"], // Grafo de dependencias lógicas
  tags: ["Geometría"],
};

Aquí va el cuerpo del artículo. Si quieres hacer referencia a otro concepto para que abra el panel lateral sin recargar, utiliza un ConceptLink:

Como vimos en el <ConceptLink targetId="definicion-asociada">Concepto Asociado</ConceptLink>...
```

### 3. El componente `<ConceptLink>`
Es el corazón de la navegación interna. **Nunca uses `<a>` o `<Link>` estándar para navegar entre conceptos**. 
Usa `<ConceptLink targetId="slug-del-archivo">Texto a mostrar</ConceptLink>`. Esto alimenta automáticamente el Grafo de Conocimiento y habilita el panel interactivo.

---

## 📂 Arquitectura de Directorios

```
src/
├── components/       # Componentes de UI (MarginaliaPanel, ConceptLink, Navbar)
├── content/          # Artículos MDX y metadatos JSON
├── diagrams/         # Visualizaciones y simulaciones (D3/React/Canvas)
├── pages/            # Vistas principales (GraphPage, ContentLayout, Home)
├── store/            # Lógica de Estado (ContentStore, UIStore, schemas)
└── App.tsx           # Punto de entrada y Routing global
docs/                 # Documentación técnica, directrices y reglas del proyecto
```
