# Objetivo: calidad de código

## Resultado

Una base modular, legible y escalable, con límites FSD verificables y cambios pequeños que no introduzcan deuda silenciosa.

## Criterios operativos

- Reutilizar antes de abstraer y abstraer solo ante una responsabilidad estable.
- Mantener tipos explícitos en fronteras y evitar duplicar fuentes de verdad.
- Preservar compatibilidad, trabajo ajeno y archivos generados.
- Añadir o ajustar pruebas cuando cambie comportamiento.
- Ejecutar la parte aplicable de `npm run full-check`.

## Evidencia de cierre

Diff acotado, arquitectura respetada, validaciones registradas y deuda residual explícita.
