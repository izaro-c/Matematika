# Catálogo de Componentes MDX Disponibles

Los siguientes componentes están disponibles globalmente en cualquier archivo `.mdx` de la enciclopedia:

---

## 1. Estructura y Texto

- **`<Capitular letra="E" />`**: Inicializa el primer párrafo con letra capital estilizada de imprenta clásica.
- **`<Separador />`**: Línea divisoria horizontal estilizada con adorno central clásico.
- **`<Nota>`**: Bloque de anotación o aclaración matemática complementaria.
  - Pensar bien cuándo añadirla y cuándo no. La nota debe ser la excepción y no la norma: se reserva para observaciones verdaderamente relevantes e importantes, evitando notas innecesarias para sobrecorrecciones o justificaciones defensivas.
- **`<Cita author="Autor">`**: Bloque de cita destacada con autor.

---

## 2. Matemáticas y Definiciones

- **`<Definicion title="...">`**: Contenedor formal para la definición matemática o enunciado axiomático.
- **`<Formula title="...">`**: Recuadro estilizado para ecuaciones o fórmulas destacadas que requieren scroll horizontal asistido en pantallas pequeñas.
- **`<EquationRow>`**: Agrupador horizontal centrado para varias fórmulas en línea.

---

## 3. Hiperenlaces y Vinculación Visual

- **`<ConceptLink targetId="..." isDependency={true|false}>Texto</ConceptLink>`**: Enlace semántico a otra página del grafo. Todo concepto formal (`biyeccion`, `simetria`, `reflexividad`, `teorema`, etc.) debe tener su enlace.
- **`<VisualBind element="..." color="...">Fórmula/Término</VisualBind>`**: Vincula texto o símbolos con elementos interactivos del diagrama (`color`: `"musgo"` | `"pavo"` | `"terracota"` | `"ocre"` | `"carbon"`).
  - `"terracota"`: Puntos fundamentales, vértices, orígenes.
  - `"carbon"`: Rectas, ejes, vectores, aristas, lados.
  - `"pavo"`: Planos, subespacios, regiones primarias.
  - `"musgo"`: Elementos secundarios, círculos interiores, componentes singulares.
  - `"ocre"`: Planos o rectas coplanares secantes, ángulos.

---

## 4. Aislamiento Léxico entre KaTeX y el Árbol AST de JSX (`<VisualBind>`)

Queda terminantemente prohibido anidar etiquetas JSX dentro de delimitadores matemáticos de KaTeX (`$`, `$$` o `\text{...}`).
- **Regla estricta:** `<VisualBind>` **no se puede utilizar dentro de fórmulas LaTeX, solo puede envolverlos**.
- Los bloques desplegados `$$ ... $$` son **LaTeX puro** (nunca deben contener JSX).
- En la prosa inline, `<VisualBind>` envuelve la expresión matemática correspondiente:

```tsx
<!-- ❌ INCORRECTO: VisualBind dentro de KaTeX o fórmulas en bloque con JSX -->
$$
\text{<VisualBind element="ladoAB">}\overline{AB}\text{</VisualBind>} \cong \overline{AC}
$$
$ \text{<VisualBind element="pA">A</VisualBind>} $

<!-- ✅ CORRECTO: VisualBind envuelve a la fórmula inline en la prosa -->
Consideramos el lado <VisualBind element="ladoAB" color="carbon">$\overline{AB}$</VisualBind>...

<!-- ✅ CORRECTO: Las fórmulas en bloque son LaTeX puro sin JSX -->
$$
\overline{AB} \cong \overline{AC} \implies \angle ABC \cong \angle ACB
$$
```

---

## 5. Bloque Estructurado de Propiedades (`<SeccionPropiedades>`)

Permite estructurar propiedades matemáticas derivadas o catalogar satisfacciones de axiomas e invariantes.

```tsx
<SeccionPropiedades>
  <PropiedadesGrupo title="Satisfacción de axiomas de incidencia">
    <PropiedadItem id="axioma-incidencia-1" title="Determinación unívoca de la recta">
      Para cualquier par de puntos distintos en $\mathcal{P}$, existe exactamente una recta en $\mathcal{L}$ incidente con ambos...
    </PropiedadItem>
  </PropiedadesGrupo>
  <PropiedadesGrupo title="Propiedades estructurales y combinatorias">
    <PropiedadItem id="configuracion-regular" title="Regularidad de la configuración">
      La estructura forma una configuración simétrica...
    </PropiedadItem>
  </PropiedadesGrupo>
</SeccionPropiedades>
```

> [!WARNING]
> **Reglas de uso de `<SeccionPropiedades>` por tipología:**
> 1. **Prohibición estricta en Axiomas (`type: "axioma"`):** Un axioma es un postulado atómico e indivisible. **No debe contener `<SeccionPropiedades>`**. Prohibido crear propiedades que repitan la propia definición (e.g. `unicidad-recta` en I.1, `no-vaciedad-recta` en I.2, `determinacion-plano` en I.4). Las consecuencias deductivas son **teoremas** y pertenecen a `theorems/`.
> 2. **Uso legítimo en Definiciones (`type: "definicion"`):** Para agrupar propiedades matemáticas demostradas del concepto definido (e.g. convexidad en `semiplano`).
> 3. **Uso legítimo en Modelos (`type: "modelo"`):** Debe estructurarse estrictamente en dos bloques:
>    - `Satisfacción de axiomas de [Familia]` (evaluando los postulados del sistema).
>    - `Propiedades estructurales, [algebraicas / combinatorias / topológicas]` (aislando los invariantes intrínsecos de la estructura).
> 4. **Prohibición en Sistemas Axiomáticos (`type: "sistema-axiomatico"`):** No emplear `<SeccionPropiedades>` para crear listas manuales de axiomas o modelos componentes. La interfaz de la plataforma los genera automáticamente a partir de los metadatos `axiomas` y `models`.
