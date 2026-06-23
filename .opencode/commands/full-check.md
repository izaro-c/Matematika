---
description: CI completa: lint + tsc + test + depcruise + validación
---
Ejecuta en orden:
1. npm run lint
2. npx tsc -b
3. npm run test
4. npm run depcruise
5. npm run validate-graph
6. npm run validate-references

Reporta un resumen claro: qué pasó y qué falló.
Si hay fallos en alguna etapa, NO continúes a la siguiente hasta que el usuario decida cómo proceder.
Sugiere correcciones para cada fallo.
