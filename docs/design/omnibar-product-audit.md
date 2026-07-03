# Auditoría de Producto: SearchOmnibar

## Estado actual
La **Fase 14** extrajo los contratos técnicos (mejorando la calidad del código, interfaces y separación del `SearchStore`), pero dejó la experiencia funcional de producto y el diseño visual inconclusos. **La Omnibar NO está completada**.

## Evaluación y Diagnóstico de Áreas Críticas

### 1. Búsqueda por tipos y filtros
- **Comprensión de los tipos**: Actualmente, los usuarios pueden no entender intuitivamente los IDs o categorías. Se requieren etiquetas claras y estandarizadas (e.g. `Definición` con su color característico frente a `Teorema`).
- **Estado activo/inactivo**: Visualmente ambiguo. Los filtros carecen de un estado de toggle obvio y unificado con la paleta de acentos del sistema.

### 2. Enrutación y resultados
- **Resultados sin `href`**: Actualmente si un resultado falla al generar URL (por ejemplo, nodos fantasma de grafo, o taxonomías MSC2020 sin ruta renderizable propia), el comportamiento al seleccionarlo es subóptimo o provoca un error en crudo.
- **Navegación robusta**: Debe verificarse que presionar `Enter` en el teclado con un índice seleccionado ejecute la misma lógica sin fisuras que el evento `onClick`.

### 3. Layout de resultados y textos largos
- **Títulos y subtítulos**: Son propensos a cortes abruptos en móvil o con descripciones matemáticas largas.
- **Solución requerida**: Se necesita control de wrapping seguro (e.g., clamp de 2 líneas) y un fit visual del ancho que no expanda y rompa el z-index o la grilla del layout base.
- **Jerarquía visual**: Título, tipo de contenido y descripciones secundarias compiten por la atención visual.
- **Escaneabilidad**: Falta espacio de respiración (padding y márgenes proporcionales) entre resultados de la lista desplegada.

### 4. Interacción y teclado (A11y)
- **Navegación por teclado**: Soporte que debe asegurarse y cubrirse con tests: `ArrowDown`, `ArrowUp`, `Escape` para cerrar, `Enter` para navegar.
- **Focus y Hover**: El `selected state` y `hover state` deben acoplarse sutilmente a los `PAGE_ACCENTS`, marcando posición clara pero sin convertirse en bloques excesivamente densos o botones de acción primaria masivos.

### 5. Casos Límite y Empty States
- **Estados vacíos**: Actualmente pobremente definidos. Qué se debe mostrar cuando el input está focalizado pero vacío, y qué se muestra cuando una query arroja resultados `length === 0`.
- **Glosario y MSC2020**: El comportamiento dual de ítems de glosario (algunos podrían tener página propia, otros solo tooltips) requiere aclararse en la visualización de búsqueda.

### 6. Integración TopBar y Responsive
- **Con TopBar**: Transición fluida de apertura/cierre. No debe haber temblores (layout shifts) masivos en el header al enfocar el input.
- **Responsive**: En viewport móvil, la Omnibar abierta debe apoderarse del `100vw` y proveer un área de tap generosa (mínimo 44px de altura táctil por ítem).

## Próximas Fases Accionables
1. **Fase 18 (Auditoría Técnica Funcional)**: Reforzar los tests de comportamiento de `SearchOmnibar.tsx` y rutado en las boundaries correspondientes, para asegurar que no haya regresiones al tocar HTML.
2. **Fase 19 (Refinamiento UI/UX)**: Implementar los rediseños visuales de los filtros, la lista de resultados, el truncado inteligente y el responsive basándose en el feedback del usuario en los Decision Gates.
