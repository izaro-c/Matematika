# Protocolo formal multi-IA

## Autoridad y responsabilidad

- La persona responsable del proyecto fija objetivos, alcance y aprobación final.
- Ninguna marca, modelo o adaptador tiene prioridad sobre otra.
- Cada agente responde por verificar su trabajo y declarar límites, no por asumir que otro agente lo hará.
- Las decisiones duraderas se registran en gobierno o documentación del proyecto; una conversación no es fuente de verdad.

## Ciclo de trabajo

1. Clasificar la petición y su alcance autorizado.
2. Cargar el paquete mínimo definido en `ai/credit-policy.md`.
3. Inspeccionar el estado real antes de proponer o modificar.
4. Ejecutar el cambio mínimo y preservar trabajo ajeno.
5. Validar en proporción al riesgo.
6. Entregar un relevo autocontenido.

Un relevo incluye: objetivo, alcance, decisiones, archivos, validaciones con resultado, deuda y siguiente acción. No incluye transcripciones ni contexto ya disponible por ruta.

## Conflictos y revisión

Se aplica la precedencia definida en `AGENTS.md`. Si dos fuentes del mismo nivel discrepan, el agente detiene la decisión irreversible, aporta evidencia y solicita resolución humana.

La revisión independiente se reserva para cambios de alto riesgo, dudas matemáticas, seguridad, migraciones o fallos repetidos. No se encadenan modelos para confirmar trabajo rutinario sin una hipótesis concreta.

## Cambios de gobierno

- Una regla global cambia en `AGENTS.md`.
- Un cambio de autoridad o protocolo cambia aquí.
- Un estado, objetivo, prompt o informe cambia en `ai/`.
- Un procedimiento reutilizable cambia en `.agents/skills/`.
- Una integración específica cambia solo en su adaptador.

Todo cambio estructural debe actualizar los índices afectados y registrar deuda de migración; no se copia el mismo bloque en varias capas.
