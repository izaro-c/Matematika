# 05. Arquitectura de Componentes y Flujo de Datos

Este documento define la estructura visual y de datos de la aplicación Matematika, basada en el diseño de Estado Aislado y MDX Bridge.

## Diagrama de Componentes (Navegación de un Nodo)

```mermaid
graph TD
    %% Definición de Estilos
    classDef router fill:#f9f,stroke:#333,stroke-width:2px;
    classDef react fill:#61dafb,stroke:#333,stroke-width:2px,color:#000;
    classDef mdx fill:#fca103,stroke:#333,stroke-width:2px,color:#fff;
    classDef state fill:#ff9999,stroke:#333,stroke-width:2px,color:#000;
    classDef engine fill:#a2c2a2,stroke:#333,stroke-width:2px,color:#000;

    URL((Usuario entra a /leccion/pitagoras)) --> Wouter
    
    subgraph Core App
        Wouter[Wouter Router]:::router -->|Resuelve Ruta| LessonContainer[Lesson Container React]:::react
    end
    
    subgraph Arquitectura de Nodo Aislado
        LessonContainer -->|Instancia| Provider[Zustand Context Provider]:::state
        Provider -->|Provee Store a| SplitLayout[CSS Grid Layout 60/40]:::react
        
        SplitLayout -->|Izquierda 60%| CanvasWrapper[Simulador Wrapper React]:::react
        SplitLayout -->|Derecha 40%| MDXRenderer[MDX Theory Content]:::mdx
        
        MDXRenderer -.->|1. Exporta| CanvasWrapper
        
        CanvasWrapper -->|Monta| Engine[JSXGraph / Three.js Engine]:::engine
        
        Engine <==>|2. Lee/Escribe| Provider
        MDXRenderer <==>|3. Lee/Escribe a través de KaTeX| Provider
    end
    
    %% Notas
    note1["El estado muere cuando el usuario sale de la ruta"] -.-> Provider
```

### Explicación del Flujo
1. **Enrutamiento:** Wouter detecta la URL e instancia el Contenedor principal de la lección.
2. **Contexto Aislado:** El contenedor NO usa un store global de Zustand. Envuelve la lección en un `Provider` de React que inicializa un store de Zustand virgen. Al salir de la lección, este store es destruido por el Garbage Collector.
3. **Layout Estructural:** Un contenedor Grid separa visualmente la pantalla.
4. **Hermanos (Siblings):** El texto (MDX) y el lienzo gráfico son hermanos. Se comunican única y exclusivamente a través del Store central de Zustand provisto por su padre.
