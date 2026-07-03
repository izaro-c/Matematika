# Tablero de Decisiones Estilísticas (Decision Gates)

*Usuario: Por favor, revisa estas opciones, responde o marca tu preferencia en el chat para que los agentes puedan proceder de manera informada y alineada con tu visión de producto.*

## DG1 — Intensidad del refinamiento
**¿Quieres que la primera implementación visual sea conservadora, media o ambiciosa?**
- [ ] **Opc 1 (Conservadora):** Solo arreglar inconsistencias de padding y unificar clases Tailwind, sin alterar en absoluto la percepción del diseño actual. (Bajo impacto, rápido, seguro)
- [ ] **Opc 2 (Media):** Refinar tipografía, ajustar jerarquía de tarjetas, y consolidar los acentos, modificando layouts donde están limitados actualmente. *(Recomendado para ganar consistencia de calidad)*
- [ ] **Opc 3 (Ambiciosa):** Rediseño agresivo de layouts para contenido, alteración fuerte de asides, menús laterales, y jerarquía estructural. (Más trabajo, requiere QA visual intensivo)

## DG2 — Rol de la Omnibar
**¿La Omnibar debe seguir siendo un buscador secundario o convertirse en centro de exploración?**
- [ ] **Buscador Secundario:** Mantenerlo discreto, solo un input rápido arriba.
- [ ] **Centro de Navegación:** Convertirlo en el componente principal para viajar entre nodos matemáticos, proveyendo filtros robustos, y estados iniciales útiles (ej. sugerencias sin tipear). *(Recomendado)*

## DG3 — Búsqueda por tipos (Omnibar)
**¿Los filtros de tipo deben ser simples, agrupados o contextuales?**
- [ ] **Simples:** Un botón tipo `badge`/`pill` por cada tipo existente (`Teorema`, `Definición`, etc).
- [ ] **Agrupados:** Macro-categorías seleccionables (e.g., "Resultados Lógicos", "Conceptos Base", "Recursos de Aprendizaje"). *(Recomendado para evitar excesiva carga de UI)*
- [ ] **Contextuales:** Los filtros más relevantes aparecen dependiendo de la página en la que estés. (Alto impacto UX, pero más complejo ahora).

## DG4 — Títulos largos en resultados
**¿Preferimos truncado, wrapping controlado o layout amplio?**
- [ ] **Truncado (Elipsis):** Corte implacable a 1 línea con `...`. (Pierde información)
- [ ] **Wrapping Controlado:** Limitar a un máximo de 2 o 3 líneas asegurando lectura completa, empujando el grid hacia abajo con gracia. *(Recomendado)*
- [ ] **Layout Amplio/Tooltips:** Dejar 1 línea base pero ofrecer previsualizaciones o tooltips dinámicos on-hover.

## DG5 — Páginas de contenido (Teoremas, Definiciones)
**¿Las páginas deben priorizar lectura larga, bloques escaneables o conectividad?**
- [ ] **Enfoque de Lectura Larga:** Tipo artículo, texto fluido y continuo (Priorizando concentración y ritmo). *(Recomendado para el rigor)*
- [ ] **Bloques Escaneables:** Paneles fuertemente demarcados (Documentación Técnica UI).
- [ ] **Dependencias Visibles:** Hacer que referencias cruzadas y pequeños grafos interactivos locales cobren protagonismo sobre el texto puro.

## DG6 — Grafo Global
**¿El grafo debe ser herramienta técnica separada o mapa de estudio orgánico?**
- [ ] **Técnico y Separado:** Mantener su aspecto rudo de canvas con hex colors sueltos.
- [ ] **Mapa de Estudio Orgánico:** Layout visualmente integrado con la paleta de colores Arts & Crafts suave de todo el sitio web, eliminando bordes crudos. *(Recomendado para el futuro, Fase 23)*

## DG7 — Editor
**¿El editor debe mantenerse como backoffice técnico o integrarse al producto visualmente?**
- [ ] **Técnico/Dev:** Dejarlo como herramienta estricta de backoffice. *(Recomendado a corto plazo para reducir scope de rediseño)*
- [ ] **Integrado:** Darle el "look and feel" inmersivo y editorial del jardín digital.

## DG8 — Colores y Acentos
**¿Mantenemos el mapping estricto actual o ajustamos acentos por pedagogía?**
- [ ] **Mantener Mapping Base:** Seguir a rajatabla lo dictado en `src/shared/design/pageAccents.ts` (salvia, ocre, pavo). *(Recomendado en esta épica)*
- [ ] **Ajuste Pedagógico Dinámico:** Refinar para que los tipos destaquen o se oculten visualmente según su peso lógico (Axioma masivo vs Nota al margen sutil).

## DG9 — QA Responsive
**¿Qué viewports son prioritarios para aprobar la épica?**
- [ ] Solo Desktop y Laptop (Desktop-first puro).
- [ ] Desktop, Laptop y Tablet. *(Recomendado para escalar)*
- [ ] Todos, garantizando soporte Mobile perfecto (Fuerte impacto de tiempo en layout).
