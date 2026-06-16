# 05 — Diagrama de Arquitectura y Flujo de Datos

## Diagrama Principal: Flujo de un Nodo

```mermaid
graph TD
    classDef global fill:#1e293b,stroke:#cbd5e1,color:#f8fafc
    classDef local  fill:#fca103,stroke:#333,color:#fff
    classDef mdx    fill:#a2c2a2,stroke:#333,color:#000
    classDef engine fill:#c86446,stroke:#333,color:#fff
    classDef ui     fill:#5d7080,stroke:#333,color:#fff

    User((Usuario)) --> URL[URL del navegador]

    subgraph DataLayer["Capa de Datos (Build Time)"]
        direction LR
        Files[(src/content/**/*.mdx)]:::mdx
        Files -->|import.meta.glob| CS[ContentStore.ts]:::global
        CS --> Schemas[schemas.ts Zod]:::global
    end

    URL -->|Wouter Router| CS
    CS -->|Instancia Layout correcto| Layout

    subgraph NodeInstance["Instancia de Nodo (Run Time)"]
        Layout[Layout React]:::ui
        Layout -->|Monta| MathProvider[MathProvider Zustand local]:::local
        MathProvider --> SplitLayout[CSS Grid Layout]:::ui
        SplitLayout --> Canvas[Simulador JSXGraph/Three.js]:::engine
        SplitLayout --> MDXText[Texto MDX con ConceptLinks]:::mdx
        Canvas <-->|Estado bidireccional| MathProvider
        MDXText <-->|VisualBind hover/click| MathProvider
    end

    subgraph GlobalUI["UI Global (siempre activa)"]
        MDXText -->|Clic en ConceptLink| NavStore[NavigationStore Zustand]:::global
        NavStore --> Marginalia[MarginaliaPanel Sidebar]:::ui
        MDXText -->|GlossaryLink hover| SymDict[SymbolDictionaryManager]:::ui
        NavStore --> Omnibar[SearchOmnibar Cmd+K]:::ui
    end

    Marginalia -->|Extrae datos del nodo destino| CS
```

---

## Diagrama de Tipos de Contenido

```mermaid
graph LR
    classDef plan    fill:#1e293b,stroke:#cbd5e1,color:#f8fafc
    classDef lesson  fill:#fca103,stroke:#333,color:#fff
    classDef theorem fill:#a2c2a2,stroke:#333,color:#000
    classDef def     fill:#c86446,stroke:#333,color:#fff
    classDef person  fill:#5d7080,stroke:#333,color:#fff
    classDef exercise fill:#e2e8f0,stroke:#333,color:#333

    P[Plan de Estudio EBAU]:::plan -->|referencias| L1[Lección: Sistemas de Ecuaciones]:::lesson
    P -->|referencias| L2[Lección: Cálculo Diferencial]:::lesson
    L1 -->|requiere| D1[Definición: Matriz]:::def
    L1 -->|teorema central| T1[Teorema de Rouché-Frobenius]:::theorem
    T1 -->|demostrado por| M1[Matemático: Frobenius]:::person
    T1 -->|ejemplo de| E1[Ejemplo: Sistema 3x3]:::exercise
    T1 -->|practica con| X1[Ejercicio: Clasificar sistema]:::exercise
```

---

## Notas Clave del Diseño

### Por qué MathProvider es Local (no Global)
Si el estado matemático fuese global, al navegar de `/teorema/pitagoras` a `/teorema/bayes`, las coordenadas del triángulo pitagórico seguirían vivas en memoria. Three.js y JSXGraph adjuntan listeners al DOM; sin cleanup hay **memory leaks**. Al ser el MathProvider un React Context local, cuando Wouter desmonta el nodo, React desmonta el Provider y el Garbage Collector limpia toda la memoria gráfica.

### Por qué NavigationStore sí es Global
El estado de si el MarginaliaPanel está abierto, o qué nodo muestra el Omnibar, debe persistir mientras el usuario navega. Cerrar el panel al cambiar de página sería una mala UX. Por eso estos estados viven en un store de Zustand global.

### Por qué Wouter y no React Router
Wouter no requiere un `BrowserRouter` wrapper ni genera código muerto. En un proyecto donde las rutas se generan dinámicamente (no hay lista estática de rutas), la ligereaza de Wouter y su API de `Switch`/`Route` son suficientes y más rápidas de iterar.
