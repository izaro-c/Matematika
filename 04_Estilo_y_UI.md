# 04 — Guía de Estilo y Sistema de Diseño (UI/UX)

## Filosofía Visual

Matematika debe sentirse como un **libro de matemáticas clásico que ha cobrado vida**. La inspiración es la obra *"Elementos de Euclides"* de Oliver Byrne — ilustraciones geométricas precisas, colores semánticos, tipografía controlada y silencio visual (espacio negativo generoso).

**El diseño nunca compite con las matemáticas. Las sirve.**

### Qué NO hacer:
- ❌ Gradientes decorativos, sombras duras, brillos, fotorrealismo.
- ❌ Animaciones que distraigan de la lectura o el cálculo.
- ❌ Fondos distintos del Crema Lienzo (`#F8F6F1`).
- ❌ Colores de Tailwind directos (`bg-red-500`, `text-blue-600`). Solo tokens semánticos.
- ❌ Encuadrar los lienzos gráficos en cajas con bordes. Deben fundirse con el fondo.

### Qué SÍ hacer:
- ✅ Espacio en blanco abundante. `padding` y `margin` amplios.
- ✅ Transiciones suaves y sutiles (nada de 0.8s de duración).
- ✅ Lienzos JSXGraph/Three.js con fondo `#F8F6F1` para que se fusionen con la página.
- ✅ Tipografía precisa y con contraste perfecto.

---

## Tipografía

| Capa | Fuente | Uso |
|---|---|---|
| Interfaz (UI) | **Inter** (Google Fonts) | Menús, botones, buscador, etiquetas, paneles |
| Académica | **EB Garamond** o **Playfair Display** | Cuerpo de Lecciones, Teoremas, Biografías |
| Matemáticas | **KaTeX** (Computer Modern) | Todas las fórmulas (inline `$x$` y bloque `$$...$$`) |

- `line-height`: mínimo `1.7` en el texto académico para legibilidad.
- Las variables matemáticas en prosa (fuera de KaTeX) van en cursiva: *x*, *A*, *n*.

---

## Paleta Semántica Completa

```css
/* src/index.css */
:root {
  --color-lienzo:    #F8F6F1;
  --color-carbon:    #333333;
  --color-salvia:    #A2C2A2;
  --color-terracota: #C86446;
  --color-pizarra:   #5D7080;
  /* Variante adicional documentada en sesión: */
  --color-granada:   #8B2635; /* Para warnings, errores, negaciones */
}
```

Las clases Tailwind correspondientes (`bg-lienzo`, `text-carbon`, etc.) están configuradas en `tailwind.config.ts` mapeadas sobre estas variables.

---

## Layouts de Página

### Layout Interactivo (Lecciones)
```
┌──────────────────────────────────────────────────────────┐
│  [Logo]                               [🔍] [🌙]         │
├────────────────────────┬─────────────────────────────────┤
│                        │                                  │
│   Simulador/Canvas     │   Texto MDX (Serif)              │
│   JSXGraph / Three.js  │   ConceptLinks, VisualBinds      │
│   (~60% de ancho)      │   (~40% de ancho)                │
│                        │                                  │
└────────────────────────┴─────────────────────────────────┘
```

### Layout Centrado (Teoremas, Definiciones)
```
┌──────────────────────────────────────────────────────────┐
│  [Logo]                               [🔍] [🌙]         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   [Simulador, si hay]                                    │
│                                                          │
│   Texto MDX — columna centrada de anchura máxima ~70ch   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Layout Biografía (Matemáticos)
- Cabecera elegante con nombre, años de vida y área.
- Retrato si existe (estilizado, no fotorrealista).
- Cuerpo con tipografía Serif en columna estrecha.
- Sidebar derecho con lista de teoremas/conceptos asociados del propio ContentStore.

---

## Panel Lateral Derecho (MarginaliaPanel)

Se desliza desde la derecha del viewport. Contiene:
1. El título del nodo (con su tipo: Teorema, Definición, Matemático, etc.).
2. Un resumen breve o el primer párrafo del contenido.
3. Lista de sus dependencias (`requires[]`) como links navegables.
4. Botón "Leer artículo completo" → navega con Wouter a la ruta del nodo.

**Por qué panel y no popup/tooltip:** Los tooltips se cortaban cuando el link estaba cerca del borde del viewport. El panel lateral siempre tiene espacio y es consistente con el diseño general.

---

## Directivas para Motores Gráficos

### JSXGraph (2D)
- Fondo del board: `#F8F6F1` (Crema Lienzo). Sin bordes duros.
- Grosor de líneas: fino (1–1.5px). Estilo "ilustración de tinta".
- Puntos: pequeños, sólidos, en Terracota `#C86446`.
- Rectas/ejes: en Carbón `#333333`.
- Planos/superficies: Salvia `#A2C2A2` con opacidad ~0.3.

### Three.js (3D)
- Sin Shadow Maps. Iluminación Ambiental suave (flat shading).
- Cámara: FOV bajo (≤45°) o Ortográfica para evitar distorsión perspectiva.
- Materiales: semi-transparentes (`opacity: 0.25`) con wireframe superpuesto.
- Fondo del canvas: `#F8F6F1`.
