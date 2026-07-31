# Objetivos

Elegir **una** fila por sesión.

| Id | Resultado | Criterios clave | Cierre |
|---|---|---|---|
| `code-quality` | Base modular, FSD verificable, diffs pequeños | Reutilizar antes de abstraer; tipos en fronteras; tests si cambia comportamiento; parte aplicable de `full-check` | Diff acotado, arquitectura ok, deuda residual explícita |
| `ui-product` | UI navegable y accesible con jerarquía clara | Estados (carga/vacío/error/foco/teclado/móvil/oscuro); tokens Arts & Crafts; sin ornamento vacío | Flujo principal ok, a11y revisada, sin regresiones conocidas |
| `pedagogy` | Contenido rigoroso y comprensible por profundidad | Orden topológico; distinguir intuición/enunciado/justificación; skills `page-creator` / `diagrama` / `lean-formalizer` | Metadatos + refs ok; Lean/grafo si aplica |
| `automation` | Automatizar lo repetible con permisos y coste controlados | Idempotencia; fallos accionables; sin escritura a revisores; política común fuera de adaptadores | Disparador, I/O, permisos, validación y recuperación documentados |
