# Diagrama de Componentes Avanzado (Puertos y DTOs)

Este diagrama UML detalla las interfaces de comunicación, los puertos y los flujos de *Data Transfer Objects* (DTOs) que conectan las distintas capas lógicas del sistema Matematika.

```mermaid
flowchart TD
    subgraph UI["Capa de UI y Rutas (Wouter)"]
        Router["Router"]
        PageTemplates["Page Templates"]
    end
    
    subgraph CoreEngine["Core Engine"]
        ic(("I_Content"))
        ig(("I_Graph"))
        
        subgraph ContentEngine["Content Engine (MDX)"]
            MDXProvider["MDXProvider"]
            KaTeXRenderer["KaTeX Renderer"]
            ConceptLinkResolver["ConceptLink Resolver"]
        end
        
        subgraph MathEngine["Math Engine (Geometría)"]
            JSXGraphContainer["JSXGraph Container"]
            MathFactory["MathFactory (Points, Lines, Polygons)"]
            StyleManager["StyleManager (Theming)"]
        end
        
        ic --- MDXProvider
        ig --- JSXGraphContainer
    end

    subgraph StateManagement["State Management (Zustand)"]
        is(("I_Store"))
        GlobalContentStore["Global ContentStore"]
        NavigationStore["NavigationStore"]
        DynamicVarStore["DynamicVarStore"]
        is --- GlobalContentStore
    end

    subgraph BuildTimePipeline["Build-Time Pipeline"]
        ib(("I_Build"))
        FileSystem["File System"]
        GenContentIndex["generate-content-index.ts"]
        ContentIndexJSON["contentIndex.json (DTO)"]
        ib --- ContentIndexJSON
    end

    %% Conexiones e Interfaces
    GenContentIndex -.-|Reads .mdx files| FileSystem
    GenContentIndex -->|Generates JSON Index| ContentIndexJSON
    
    GlobalContentStore -.-|Fetches on Init| ib
    
    PageTemplates -.-|Queries Node Metadata| is
    PageTemplates -->|Injects MDX Content| ic
    PageTemplates -->|Mounts Graph Simulation| ig
    
    StyleManager -.-|Applies dynamic CSS Rules| MathFactory
    ConceptLinkResolver -.-|Triggers openMarginalia| NavigationStore
```

## Flujos de Datos (DTOs)
1. **DTO `contentIndex.json`:**
   - Transporta un grafo masivo en formato JSON donde las claves son identificadores únicos (slugs) y los valores incluyen metadata vital (título, autor, taxonomía `branch`, y arrays de lemas/corolarios).
2. **Puertos Abiertos:**
   - El Motor Geométrico (`Math Engine`) no consume directamente el `Global ContentStore`. Los componentes se enlazan mediante variables pasadas vía props y estado local (`MathProvider`), siguiendo el principio de Responsabilidad Única (SRP).
3. **Pipeline Estático:**
   - Todo el proceso intensivo de parsear Markdown se abstrae al sistema de compilación de Vite; el cliente web solo procesa componentes React hidratados, aumentando dramáticamente el rendimiento del `Time To Interactive`.
