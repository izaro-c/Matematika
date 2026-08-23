# Guía para redactar contenido en MDX

Todo el contenido matemático de la enciclopedia se escribe en archivos **MDX** dentro de la carpeta [content/mdx/](file:///home/izaro/Proiektuak/Matematika_Drafts/content/README.md).

---

## Dónde va cada tipo de contenido

```
content/mdx/
├── theorems/             # Teoremas, lemas y corolarios
├── definitions/          # Definiciones y conceptos base
├── axioms/               # Axiomas
├── axiomatic-systems/    # Sistemas axiomáticos
├── models/               # Modelos matemáticos
├── demonstrations/       # Demostraciones paso a paso
├── methods/              # Métodos y técnicas de resolución
├── examples/             # Ejemplos resueltos
├── exercises/            # Ejercicios con pistas y solución
├── usecases/             # Aplicaciones prácticas
├── mathematicians/       # Biografías
├── lessons/              # Lecciones didácticas
└── study-plans/          # Guías de estudio estructuradas
```

---

## Cabecera de metadatos (Frontmatter)

Cada archivo `.mdx` debe exportar un objeto `metadata` que cumpla con el esquema Zod correspondiente (`src/data/schemas/`).

### Ejemplo: `content/mdx/theorems/teorema-pitagoras.mdx`

```mdx
export const metadata = {
  id: "teorema-pitagoras",
  type: "teorema",
  title: "Teorema de Pitágoras",
  description: "Relación fundamental en geometría euclídea entre los lados de un triángulo rectángulo.",
  statement: "Dado un triángulo rectángulo con catetos $a$, $b$ e hipotenusa $c$, se cumple $a^2 + b^2 = c^2$.",
  domain: "geometria",
  requires: ["triangulo-rectangulo", "area-cuadrado"],
  authors: ["pitagoras-de-samos"],
  hasSimulation: true,
};

<Capitular letra="E" />n todo triángulo rectángulo...

<Simulation src="@content/diagrams/geometria/demo-pitagoras.tsx" />

Para más detalles, consulta la <ConceptLink targetId="demostracion-pitagoras-geometrica">Demostración Geométrica</ConceptLink>.
```

---

## Enlaces entre conceptos con `<ConceptLink>`

> **Regla fundamental**: No uses etiquetas `<a>` ni componentes `<Link>` para enlazar otros conceptos o teoremas.

Usa **siempre** `<ConceptLink targetId="id-del-articulo">Texto visible</ConceptLink>`:

- **Por qué**: Este componente alimenta automáticamente el **Grafo de Conocimiento** y habilita las vistas previas en el panel desplegable **Marginalia**.
- **Si el enlace no existe todavía**: La aplicación no romperá ni dará un error fatal en producción; registrará un aviso en desarrollo y mostrará un estado controlado.

---

## Escribir matemáticas con KaTeX

- **Matemáticas en línea**: Usa un solo signo de dólar `$a^2 + b^2 = c^2$`.
- **Matemáticas en bloque**: Usa signos de dólar dobles:
  $$\int_{a}^{b} f(x) \,dx = F(b) - F(a)$$

---

## Comprobar tu nuevo artículo antes de enviar

Tras añadir o modificar un archivo MDX, ejecuta estas comprobaciones sencillas:

```bash
# Regenera el índice de contenido y valida los metadatos con Zod
npm run generate-index

# Revisa que todos los <ConceptLink> apunten a artículos válidos
npm run validate-references

# Comprueba que no hayas introducido ciclos lógicos en el grafo
npm run validate-graph
```
