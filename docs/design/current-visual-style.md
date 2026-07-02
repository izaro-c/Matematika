# Estilo Visual y Layout de Matematika (Baseline)

## Dirección Visual: "Arts & Crafts Editorial"

La estética de Matematika se basa en un diseño tipo "jardín digital editorial" o "Arts & Crafts", priorizando una paleta cálida, colores terrosos, tipografía clásica con serifas y superficies que evocan papel, pergamino o encuadernaciones antiguas, pero con un diseño web estructurado y claro.

### Qué se conserva
- La paleta de colores Arts & Crafts.
- La tipografía serif como principal para el contenido matemático.
- Las superficies con dobles bordes sutiles o sombras estilo letterpress.
- Las animaciones simples y micro-transiciones suaves.
- La estructura de acentos por tipo de contenido.

### Qué se debe refinar
- **Consistencia:** Aplicación uniforme de los tokens semánticos y de layout en todas las vistas.
- **Jerarquía y Layout:** Mayor claridad visual entre las áreas principales y paneles secundarios (aside, índices).
- **Legibilidad matemática:** Los bloques de teoremas, axiomas y definiciones deben ser inmediatamente distinguibles y fáciles de escanear.
- **Navegación (Omnibar):** Mejorar la composición, espaciado y visibilidad de las acciones y resultados.
- **Superficies y Tarjetas:** Estandarizar componentes de tarjetas para evitar múltiples formas de generar bordes/sombras.

### Qué se debe evitar
- Adoptar una estética "startup SaaS" genérica, minimalista fría o "material design".
- Fondos completamente blancos o colores primarios estridentes.
- Eliminar la paleta temática o las fuentes serif del contenido principal.
- Saturar las vistas de información.

---

## Principios de Diseño

### 1. Principios Visuales
- La interfaz debe respirar como un libro matemático bien editado.
- El color se usa para distinguir contexto y tipo de contenido, no de forma decorativa aleatoria.
- Se usan variantes sutiles para fondos y bordes (`color-mix` con transparencia o con `var(--theme-carbon)` / `var(--theme-lienzo)`).

### 2. Principios de Layout
- **Alineación:** Las líneas de contenido principal deben seguir una retícula clara, con un ancho máximo óptimo para la lectura (`max-w-prose` o similar, ~65-75 caracteres por línea).
- **Relación Principal-Secundario:** Los elementos de navegación (índices, grafo) o paneles de metadatos deben apartarse de la línea central de lectura en pantallas grandes (idealmente en un aside o barra superior/inferior), y colapsar de forma lógica en móviles.

### 3. Principios de Navegación
- Orientación constante: El usuario siempre debe saber "qué es esto" (teorema, definición, etc.) y "cómo llegué aquí".
- Omnibar/Búsqueda central pero no invasiva, mostrando metadatos útiles (tipo de contenido, jerarquía).

---

## Reglas de Componentes y Sistema

### Reglas de Color
Solo se utilizan los colores base de `THEME_COLOR_VARS`:
- `lienzo` (fondo principal)
- `carbon` (texto y bordes neutros)
- `salvia`, `terracota`, `pizarra`, `ocre`, `pavo`, `granada`, `musgo`.

### Reglas de Acentos por Tipo de Contenido
Según `src/shared/design/pageAccents.ts` y `semanticTokens.ts`:
- **Teorema / Ejemplo / Caso de uso:** `primaryAccent` (salvia)
- **Lección / Modelo / Demo / MSC2020:** `secondaryAccent` (pavo)
- **Definición / Matemático / Glosario:** `definitionAccent` (ocre)
- **Ejercicio:** `warningAccent` (terracota)
- **Axioma:** `neutralStrong` (carbon)

### Reglas de Tipografía
- **Contenido y Títulos principales (`.prose`):** Serif (`ui-serif, Georgia...`).
- **Títulos (`h1`):** `small-caps`, `3rem` a `3.75rem` según contexto.
- **Metadatos, etiquetas, insignias (`caption`, `.ac-pill`):** Sans-serif (`ui-sans-serif, system-ui...`), a menudo con `uppercase` y `tracking-widest`.
- **Código:** Monospace (`ui-monospace`).

### Superficies, Tarjetas, Bordes y Sombras
- **Paneles formales (`.elegant-panel`):** Borde de un píxel mezclado, un outline interior y una transición suave al hacer hover.
- **Pergaminos (`.parchment-panel`):** Gradientes radiales muy sutiles (`ocre` y `terracota`).
- **Insignias (`.ac-pill`):** Esquinas vivas, borde exterior, outline interior, sombra dura asimétrica (`1px 1px 0px`).

### Reglas de Espaciado
- Ritmo vertical de 1.5 a 2.5 `rem` entre bloques.
- Se prefiere separación visual con espaciado amplio o con el separador sutil de `.subtle-separator` frente a líneas gruesas o cajas cerradas, salvo en paneles explícitos.

---

## Tratamiento del Contenido Matemático

- **Teoremas, Axiomas, Definiciones:** Se presentan con su acento correspondiente, frecuentemente en contenedores tipo `.elegant-panel` o en secciones bien separadas con indicadores semánticos.
- **Demostraciones (Lean/MDX):** Mantienen el rigor. Visualmente pueden requerir más espacio e indentación y jerarquía visual si son largas, para separar los pasos de justificación.
- **Modelos y Lecciones:** Usan acentos de nivel secundario. Las tarjetas de modelos o lecciones comparten `.ac-pill-accent`.
- **Editor / Grafo:** Integrados en la misma paleta, utilizando fondos neutros y bordes delgados. Los nodos del grafo y elementos de sintaxis del editor se colorean usando `THEME_COLOR_VARS`.
- **Diagramas (JSXGraph):** Heredan fuentes Serif, el color de fondo `lienzo` y elementos activos en colores como `terracota`.

---

## Criterios de Aceptación

### Aceptación Visual
- [ ] No se introducen nuevos colores fuera de la paleta.
- [ ] Las clases `.ac-pill`, `.elegant-panel`, etc. se usan consistentemente.
- [ ] Las animaciones (`scale-animation`, `animate-fade-in`) siguen presentes donde se requiere feedback interactivo.
- [ ] El texto mantiene contraste con el fondo `lienzo` y `dark`.

### Aceptación de Layout
- [ ] El ancho del texto central es acotado (`max-w-prose` o similar).
- [ ] La barra de búsqueda (Omnibar) es centralizada pero equilibrada.
- [ ] En móvil, las fuentes e interfaces (touch targets) se adaptan (`max-width: 768px`).
- [ ] Las dependencias, aside y contenido principal tienen jerarquía clara (el contenido es rey).
