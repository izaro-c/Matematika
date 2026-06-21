# Category Partition Tests (CPT)

Este documento contiene las especificaciones teóricas de prueba utilizando la técnica de Partición de Categorías para los Casos de Uso del sistema, así como los resultados en tiempo real de su ejecución contra la suite de pruebas.

Las siguientes tablas se generan e inyectan dinámicamente mediante el pipeline de CI integrado (`npm run test:report`), cruzando la teoría de particiones (fichero JSON) con los resultados reales en código (Vitest).

---

<!-- TEST_TABLES_START -->

### UC-1: Buscar Nodo (Omnibar)

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-1.1** | Búsqueda con término normal que existe en el índice principal. | Query: Cadena alfanumérica válida. DB: Existe en ContentStore. | Componente SearchOmnibar renderizado y estado isSearchOpen = true. | Query: 'pitagoras' | Muestra resultados tipificados como 'teorema' o similares en la lista. | Estado de búsqueda sigue activo, esperando interacción. | TestingLibraryElementError: Unable to find an elem... | ❌ **FAIL** |
| **TC-1.3** | Búsqueda con término inválido que no existe. | Query: Cadena extraña. DB: Inexistente en todas partes. | Componente SearchOmnibar renderizado. | Query: 'xxyyzz_inexistente' | Mensaje EmptyState: 'Sin resultados para...' | Se informa al usuario de la ausencia de resultados sin crashear. | Coincide con esperado | ✅ **PASS** |

### UC-2: Renderizar Nodo (MDX + UI)

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-2.1** | Renderizar exitosamente la ruta de un teorema existente. | URL_ID: String de Teorema Válido. | ContentStore inicializado. | Navegación a /teorema/tales | Se monta MathProvider y MDXComponent correctamente. | UI Muestra gráficas y contenido cargado. | Coincide con esperado | ✅ **PASS** |
| **TC-2.2** | Intento de renderizar ruta rota. | URL_ID: Inexistente. | ContentStore inicializado. | Navegación a /teorema/falso | Pantalla genérica de construcción o error 404. | No corrompe el store local. | Coincide con esperado | ✅ **PASS** |

### UC-3: Desplegar Glosario / Panel Lateral

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-3.1** | Abrir un término existente en el diccionario del glosario. | Term_ID: Existente en diccionario local. | GlossaryStore inicializado con diccionario cargado. | Click en <ConceptLink to="axioma"> | Se abre Sidebar Lateral con definición 'Axioma'. | isGlossaryOpen = true en NavigationStore. | Coincide con esperado | ✅ **PASS** |
| **TC-3.2** | Abrir término inexistente. | Term_ID: No existe. | GlossaryStore inicializado. | Click en <ConceptLink to="inexistente"> | Redirige a /construccion/ o muestra error de término faltante. | El sidebar no se bloquea permanentemente. | Coincide con esperado | ✅ **PASS** |

### UC-4: Interactuar con Simulación

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-4.1** | Drag válido en componente geométrico que modifica contexto. | Event: Drag cruzando umbral de validación. | MathProvider activo e inicializado con variables. | OnDrag sobre punto 'A' moviéndolo +5 unidades. | Se dispara setVariable y reactividad visual inmediata. | La variable del contexto cambia su estado a 'highlight'. | Coincide con esperado | ✅ **PASS** |

### UC-5: Actualizar Progreso Local

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-5.1** | Marcar un nodo como leído por primera vez. | Target_ID: Nuevo ID, Acción: markAsRead. | ProgressStore inicializado. | markAsRead('teorema_pitagoras') | Añadido a array in-memory. | Persistido asíncronamente en localStorage. | Coincide con esperado | ✅ **PASS** |

### UC-6: Escribir Contenido MDX (Editor Workflow)

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-6.1** | Parsear frontmatter válido según schema de Zod. | Frontmatter: Válido. | El CLI está parseando ficheros. | Frontmatter con 'title', 'id', 'type' correctos. | Zod parse exitoso sin errores. | Metadata disponible en índice general. | Coincide con esperado | ✅ **PASS** |

### UC-7: Programar Demo JSXGraph

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-7.1** | Inicializar board JSXGraph sin configuraciones corruptas. | BoardConfig: BoundingBox por defecto. | Contenedor de react montado en DOM. | Componente JSXGraph invocado con config vacía. | El board se inicializa renderizando ejes si es requerido. | Board instance devuelto a React ref exitosamente. | Coincide con esperado | ✅ **PASS** |

### UC-8: Generar contentIndex.json

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-8.1** | Generar índice omitiendo archivos irrelevantes. | FS_Structure: Contiene .mdx válidos y .txt inválidos. | El script de generación es invocado. | Directorio con ficheros mezclados. | El JSON de salida solo contiene metadata de .mdx. | El fichero resultante es parseable por JSON. | Coincide con esperado | ✅ **PASS** |

### UC-9: Validar Grafo y Enlaces

| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |
|---|---|---|---|---|---|---|---|---|
| **TC-9.1** | Comprobar el grafo de dependencias y concept links sanos. | Requires_List: Válidos. ConceptLink_Tags: Válidos. | contentIndex.json generado previamente. | Ficheros MDX perfectamente referenciados. | El script de validación termina sin emitir errores en stdout. | Código de salida del script = 0. | Coincide con esperado | ✅ **PASS** |
| **TC-9.2** | Script detecta referencia rota y detiene el build. | Requires_List: Contiene dependencia huérfana. | contentIndex.json contiene un nodo con una dependencia que no figura en el índice. | Fichero MDX requiriendo 'teorema_inexistente'. | Script arroja 'Missing dependency' o advertencia de orfandad. | Código de salida del script != 0. | Coincide con esperado | ✅ **PASS** |

<!-- TEST_TABLES_END -->
