# Epic: Refinamiento Visual y Experiencia de Producto

## 1. Resumen ejecutivo
- **Objetivo**: Refinar visualmente, mejorar el layout, la navegación y la experiencia de usuario de Matematika, manteniendo de forma estricta la dirección estética actual (Arts & Crafts editorial).
- **Qué se mantiene**: Identidad visual "Arts & Crafts", tipografía serif para matemáticas, paleta terrosa, legibilidad formal y rigor.
- **Qué se refina**: Consistencia sistemática, elegancia, legibilidad, diseño fluido, enrutación de resultados y experiencia en la Omnibar, y asimilación gradual del grafo/editor a la identidad global.
- **Problemas a resolver**: Inconsistencias en el uso de tokens semánticos, layouts que no escalan correctamente en modo responsive, deuda de literales de color (hex) y una navegación mejorable (Omnibar funcionalmente incompleta).
- **Qué no hacer**: No cambiar completamente la identidad visual (ni SaaS genérico, ni Material Design). No reescribir desde cero componentes complejos.
- **Decision Gates**: Múltiples decisiones estilísticas, de layout y funcionales se delegan al usuario para marcar el nivel de agresividad del cambio (ver `style-decision-board.md`).
- **Aviso Crítico**: La **Omnibar NO está completa** ni funcional ni visualmente, a pesar de la extracción de contratos (Fase 14). El **grafo y el editor NO deben tocarse** sin una fase explícita y aislada. La base semántica visual existe, pero todavía no está aplicada de forma sistemática.

## 2. Diagnóstico del estado actual
### A. Shell global
- **Fortalezas**: Paleta de colores cálida altamente identificable. Estructura de carpetas FSD clara.
- **Debilidades**: Inconsistencia en la aplicación de variables CSS.

### B. TopBar
- **Fortalezas**: Sencilla, limpia y no compite con el contenido.
- **Debilidades**: Integración mejorable con el estado expandido de la Omnibar (espaciado y responsive).

### C. Omnibar
- *Ver detalle exhaustivo en `omnibar-product-audit.md`.*
- **Debilidades**: Búsqueda por tipos incompleta visualmente, truncado de textos largos deficiente, navegación por teclado mejorable, tratamiento abrupto de resultados sin `href` (e.g. nodos fantasma).

### D. Páginas de contenido
- **Fortalezas**: Jerarquía de lectura clara y sosegada.
- **Debilidades**: Densidad de información baja en pantallas extremadamente grandes; diferenciación tipográfica entre bloques modulares (teoremas vs. lecciones) en ocasiones débil.

### E. Componentes compartidos
- **Debilidades**: Múltiples componentes tienen colores hardcodeados. Superficies (`.elegant-panel`, `.ac-pill`) implementadas repetidamente sin usar abstracciones compartidas o alias sólidos.

### F. Grafo
- **Debilidades**: Visualmente desalineado del producto final (demasiados hex crudos, canvas suelto), no se integra con total fluidez conceptual en las páginas de contenido (se siente ajeno).

### G. Editor
- **Debilidades**: UI meramente técnica; actualmente está desconectada del diseño de "jardín digital" y el UX general de lectura.

### H. Diagramas
- **Debilidades**: 91 apariciones de literales hex detectadas (auditoría), lógicas de borde, colores y listeners duplicados a través de todos los JSXGraph en lugar de heredar un token de tema consistente.

### I. Glosario/diccionario
- **Debilidades**: Densidad visual y escaneabilidad a revisar frente al contenido masivo.

### J. Responsive
- **Debilidades**: Soporte funcional básico, pero la tipografía carece de un sistema fluido maduro y componentes clave como la Omnibar colapsan o se vuelven toscos en dispositivos móviles.

## 3. Auditoría específica de Omnibar
*(Ver documento completo: [docs/design/omnibar-product-audit.md](./omnibar-product-audit.md))*

## 4. Principios de diseño propuestos
- **Claridad Matemática**: La tipografía serif y los fondos contrastados de baja saturación deben servir a la lectura pausada del rigor. Evitar distracciones visuales.
- **Navegación por dependencias**: Las referencias (`RefLink`, `ConceptLink`) y grafos locales deben ser prominentes y táctiles, pero sin interrumpir el flujo narrativo del teorema.
- **Lectura prolongada**: Ancho de línea acotado (`max-w-prose` o equivalente, ~65-75 caracteres), ritmo vertical espacioso (1.5 - 2.5rem).
- **Diferenciación de tipos de contenido**: Uso estricto de los acentos (`salvia` para teoremas, `ocre` para definiciones) aplicados al cromatismo de los bordes, insignias e íconos.
- **Superficies**: Uso del color `lienzo` y `carbon` como base; uso de paneles secundarios estilo `parchment-panel` sutil para diferenciar metadatos de cuerpo de texto.
- **Responsive escalonado**: Colapsado lógico de paneles auxiliares bajo o sobre el contenido principal en móvil.
- **Grafo y Editor integrados**: Deben sentirse como las "bambalinas" del mismo libro antiguo, compartiendo texturas, tipografía y cromatismo, y no como un dashboard tecnológico aleatorio.

## 6. Recomendación inicial
- **Recomiendo empezar con** la auditoría técnica profunda y el rediseño funcional de la **Omnibar** antes de refinar masivamente estilos en el resto de páginas. Si la navegación central falla, la belleza no compensa.
- **La Omnibar debería tratarse como** la pieza central de exploración de este jardín digital.
- **No implementaría todavía** la migración masiva de colores del Grafo o Diagramas, el riesgo de introducir fallos y regresiones TypeScript es alto hasta que las piezas y layouts bases globales no estén en piedra.
- **Dejaría a decisión del usuario** la intensidad del refinamiento visual, el protagonismo inicial del grafo y la dedicación temporal al editor técnico.
- **El mayor riesgo ahora es** tocar estilos globales o extraer componentes que rompan silenciosamente los callbacks asíncronos del grafo, JSXGraph o que desvirtúen el scoring estricto de la auditoría de `depcruise`.

## 12. Riesgos y mitigaciones
| Riesgo | Probabilidad | Impacto | Mitigación | Fase de control |
|--------|--------------|---------|------------|-----------------|
| Pérdida de identidad web Arts & Crafts | Media | Alto | Limitar paleta estrictamente a los 9 tokens base | Fase 17 |
| Empeoramiento de navegación por layout | Media | Alto | Testear intensivamente interacciones de teclado y foco en Omnibar | Fase 18 y 19 |
| Cambio involuntario de lógica React / TS | Baja | Medio | Restringir los PRs de esta épica estrictamente a props de UI, `className` e imports limpios | Todas |
| Aumento de deuda estática (Depcruise, Lint) | Alta | Medio | Validación estricta con scripts antes de cada commit. Baseline permitida pero no superada. | Todas |
| Bugs funcionales en Omnibar ignorados por priorizar el look | Alta | Alto | Auditoría funcional precede a la implementación visual de la misma. | Fase 18 |

## 13. Preguntas abiertas para el usuario
*(Para continuar, responde estas preguntas en tu siguiente prompt, o consulta `style-decision-board.md`)*
1. ¿Prefieres un refinamiento conservador o medio para la primera implementación de layout?
2. ¿La Omnibar debe seguir siendo un buscador secundario rápido o convertirse en la pieza central interactiva de navegación?
3. ¿Quieres que primero arreglemos la funcionalidad base de la Omnibar (enrutamiento, estados) o entramos directo a su estilo y layout?
4. ¿La búsqueda por tipos dentro de la Omnibar debe ser a través de filtros simples, agrupados por macro-categorías, o contextuales?
5. ¿Para los títulos de resultados extremadamente largos preferieres truncado con elipsis, salto a dos líneas o un layout horizontal más amplio?
6. ¿Las páginas de teorema deben seguir priorizando el look de "lectura larga continua" o deberían tener secciones/dependencias visualmente más separadas?
7. ¿El grafo te interesa conservarlo como una herramienta técnica o lo transformamos en un mapa de estudio más envolvente (colores, fuentes integradas)?
8. ¿El editor debe mantenerse meramente técnico o quieres invertir tiempo en integrarlo visualmente como parte del producto?
9. ¿Quieres que el agente que lo implemente pause y te pida revisión de screenshots en cada fase antes del commit?
10. ¿Qué 3 páginas específicas consideras prioritarias para comprobar que el rediseño "se siente bien"?
