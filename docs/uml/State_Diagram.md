# Diagrama de Estado Avanzado (Gestión de Memoria y Ciclo WebGL)

El siguiente diagrama utiliza notación de sub-estados para mapear cómo Matematika gestiona el lienzo, los listeners de redibujado (reactividad cruzada) y el `Garbage Collector` del navegador.

```mermaid
stateDiagram-v2
    [*] --> Idle: Inicio SPA
    
    state "Estado Transitorio de Navegación" as Routing {
        Routing_Start: Wouter detecta cambio de URL
        Routing_Resolve: ContentStore busca Nodo ID
    }
    
    Idle --> Routing : Clic en Teorema
    Routing --> NodeNotFound : ID no existe (Error)
    NodeNotFound --> Idle : Retorno a Inicio
    
    Routing --> NodeMounted : ID Encontrado
    
    state "Ciclo de Vida del Nodo (NodeMounted)" as NodeMounted {
        [*] --> Mounting
        Mounting --> MathProvider_Init : React Context Creado
        
        MathProvider_Init --> JSXGraph_Ready : Inicialización JXG.initBoard
        MathProvider_Init --> MDX_Ready : Hidratación Markdown
        
        state JSXGraph_Ready {
            state "Escucha Pasiva" as Pasivo
            state "Arrastrando Punto" as Dragging
            
            Pasivo --> Dragging : Event(pointerdown)
            Dragging --> MathProvider_Update : Emisión de Cambios
            MathProvider_Update --> Dragging : Feedback Visual
            Dragging --> Pasivo : Event(pointerup)
        }
        
        state MDX_Ready {
            state "Lectura Normal" as Leyendo
            state "Hover Concepto" as Hovering
            
            Leyendo --> Hovering : Event(mouseenter)
            Hovering --> MathProvider_Update : Notifica Destacado
            Hovering --> Leyendo : Event(mouseleave)
        }
        
        --
        
        MathProvider_Update --> MDX_Ready : Sincroniza Color de Texto
        MathProvider_Update --> JSXGraph_Ready : Sincroniza Color de Gráfico
    }
    
    NodeMounted --> Unmounting : Usuario Navega Fuera
    
    state "Procedimiento de Limpieza (Unmounting)" as Unmounting {
        Cleanup_Listeners: React useEffect cleanup
        Cleanup_JSXGraph: JXG.freeBoard()
        Cleanup_Memory: DOM Canvas Destruido
    }
    
    Unmounting --> Routing : Clic en Siguiente Enlace
```

## Transiciones Críticas
1. **Región Concurrente (NodeMounted):** Las zonas `JSXGraph_Ready` y `MDX_Ready` operan en paralelo y envían/reciben datos hacia el mismo bus interno (`MathProvider_Update`). Esto evita bucles infinitos al depender de validadores de igualdad estricta.
2. **Procedimiento `Unmounting`:**
   - La eliminación de los Canvas WebGL o SVG de `JSXGraph` no es automática en React. 
   - `JXG.freeBoard()` desconecta físicamente los `EventListeners` adosados al objeto `window` por la biblioteca.
   - Sin esta etapa, cada nuevo nodo montado consumiría ~20MB adicionales de memoria RAM, provocando una caída de los FPS e inestabilidad (Crash) del navegador tras ~50 navegaciones.
