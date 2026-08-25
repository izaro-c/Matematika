# Pautas de estilo para documentos MDX (Definiciones, Axiomas, Teoremas y Demostraciones)

1. **Tono, Prosa y Rigor Matemático**:
   - Rigor Hilbertiano divulgativo: Definiciones formales precisas y rigurosas explicadas con prosa clara y académica, evitando tanto la simplificación informal como el exceso de simbolismo impenetrable.
   - Prosa académica formal divulgativa, directa y sobria.
   - Prohibidas las analogías cotidianas e informales ("si caminas de A a C", "en la vida cotidiana", etc.).
   - Estructura limpia, directa y rigurosa sin adornos innecesarios.

2. **Flujo Narrativo y Secciones Internas**:
   - Flujo Formal Directo: Presentación inmediata del enunciado o bloque formal (`<Definicion>`, `<Teorema>`, `<Axioma>`) tras la frase de apertura capitular, seguida del desglose explicativo y la simulación visual, finalizando con observaciones secundarias o contexto histórico.
   - Estructura libre adaptada a la naturaleza y complejidad de cada concepto matemático. No se impone una plantilla de secciones rígida universal.
   - Encabezados `###` en estilo de frase (minúsculas excepto primera letra y nombres propios) y sin numeración manual (`1.`, `2.`, etc.).
   - Separación de secciones de nivel 3 (`###`) mediante el componente `<Separador />`.
   - Listas de axiomas o propiedades mediante viñetas `-` en lugar de listas numeradas.
   - Títulos de axiomas en minúscula descriptiva dentro de enlaces: `- **<ConceptLink targetId="axioma-orden-1">II.1 axioma (simetría y distinción de puntos)</ConceptLink>**:`

3. **Metadatos y Schema (`export const metadata`)**:
   - Campos mínimos esenciales obligatorios: `id`, `type`, `title` y `description`.
   - El resto de campos (`sources`, `difficulty`, `authors`, `demos`, `requires`, `lemmas`, `corollaries`, `statement`, `domain`, `subtype`, etc.) son opcionales según el tipo y profundidad del concepto.

4. **Apertura y Componentes Visuales/Notación**:
   - El primer párrafo del documento debe comenzar obligatoriamente con el componente capitular: `<Capitular letra="..." />`.
   - Fórmulas en bloque: Envolver siempre las fórmulas matemáticas destacadas en bloque dentro del contenedor `<Formula>$$ ... $$</Formula>`.
   - Utilizar `<Definicion title="">` (o contenedor según corresponda) con título vacío cuando el concepto se presenta directamente.
   - Evitar secciones secundarias derivadas redundantes en archivos de definición elemental para mantenerlos enfocados y compactos.
   - Uso del componente `<Nota>`: Reservar `<Nota>` exclusivamente para destacar consecuencias topológicas, garantías estructurales o matices epistemológicos fundamentales, evitando su uso para aclaraciones menores.

5. **Demostraciones (`type: "demostracion"`) y Ejemplos**:
   - Demostraciones: Combinar prosa explicativa argumentativa continua con el componente `<StepSection step="...">` para desglosar los pasos deductivos principales y vincularlos a estados de la simulación.
   - Ejemplos y contraejemplos: Incluir breves ejemplos o casos frontera dentro del MDX principal únicamente cuando aclaren límites conceptuales; reservar los directorios `examples/` o `exercises/` para desarrollos extensos o ejercicios de aplicación.

6. **Simulación Interactiva y Vinculación Gráfica (`<VisualBind>`)**:
   - Cuando el documento incluya una simulación interactiva (`hasSimulation: true`), es obligatorio vincular los elementos gráficos en el texto mediante `<VisualBind element="..." color="...">`.
   - Concisión estricta en `<VisualBind>`: Envolver únicamente la variable o símbolo matemático mínimo (ej: `<VisualBind element="pA" color="musgo">$A$</VisualBind>`, `<VisualBind element="segAB" color="pavo">$AB$</VisualBind>`).
   - Utilizar exclusivamente los colores de la paleta semántica del proyecto (`musgo`, `pavo`, `terracota`, `ocre`, `carbon`).

7. **Hipervinculación Exhaustiva (`<ConceptLink>`) y Dependencias Deductivas**:
   - Cobertura exhaustiva: Enlazar **absolutamente todos** los términos y conceptos matemáticos técnicos susceptibles de ser expandidos o que un lector pudiera no comprender del todo (ej: `geometria`, `punto`, `recta`, `segmento`, `distancia`, `axioma`, `plano`, `topologia`, `colinealidad`, `congruencia`, `interseccion`, `poligono`, `angulo`, `triangulo`, `hipotenusa`, `cateto`, `sistema-absoluto`, `sistema-euclidiano`, `sistema-hiperbolico`, etc.), **incluso si la página de destino aún no existe** (generará automáticamente una página de enlace "En construcción").
   - Identificadores normalizados: Usar identificadores canónicos normalizados en minúsculas kebab-case (`targetId="punto"`, `targetId="recta"`). Enlazar la primera mención de cada término técnico por sección o párrafo para mantener limpieza visual.
   - Marca explícita de dependencia (`isDependency={true}`): Cuando el concepto, axioma o teorema enlazado constituya un prerrequisito o paso de deducción lógica estricto (especialmente en demostraciones, teoremas y axiomas que se apoyan deductivamente en definiciones u otros postulados precedentes), es **obligatorio** especificar `isDependency={true}` para nutrir el grafo deductivo del proyecto.

8. **Sincronización Multilingüe (Castellano `es` y Euskera `eu`)**:
   - Identificadores canónicos e idénticos: El nombre del archivo (ej: `estar-entre.mdx`), el `id` en metadatos, y los identificadores en componentes (`targetId` en `<ConceptLink>`, `element` en `<VisualBind>`, `step` en `<StepSection>`) deben ser 100% idénticos entre las versiones en castellano (`es`) y euskera (`eu`).

9. **Contexto Histórico, Citas y Fuentes**:
   - El componente `<Cita author="...">` y la propiedad `sources` en los metadatos son opcionales en general, pero muy recomendados en axiomas, teoremas y definiciones primitivas/fundamentales.
