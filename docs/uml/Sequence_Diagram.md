# Diagrama de Secuencia Avanzado (Orientado a BCED)

Este diagrama mapea flujos lógicos con condicionales (`alt/else`) que explican el comportamiento dinámico y las validaciones de UI, utilizando la terminología Boundary-Control-Entity.

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Wouter as Wouter (Router)
    participant TheoremPage as TheoremPage (Boundary)
    participant ContentStore as ContentStore (Control)
    participant MathProvider as MathProvider (Control)
    participant MDXComponent as MDXComponent (Boundary)
    participant MathBoard as MathBoard (Boundary)
    participant JSXGraph as JSXGraph Engine
    participant ConceptLink as ConceptLink (Boundary)
    participant NavigationStore as NavigationStore (Control)
    participant MarginaliaPanel as MarginaliaPanel (Boundary)

    %% Escenario 1: Carga de Página
    rect rgba(100, 150, 255, 0.1)
        Usuario->>Wouter: Ingresa a /teorema/pitagoras
        activate Wouter
        Wouter->>TheoremPage: Renderiza con parámetro id='pitagoras'
        activate TheoremPage
        
        TheoremPage->>ContentStore: db.getTheorem('pitagoras')
        activate ContentStore
        
        alt Nodo Encontrado
            ContentStore-->>TheoremPage: Theorem Data (Entity) & Component
            TheoremPage->>MathProvider: Envuelve en <MathProvider>
            activate MathProvider
            MathProvider->>MDXComponent: Renderiza Component
            activate MDXComponent
            MDXComponent->>MathBoard: <MathBoard onInit={...} onUpdate={...}>
            activate MathBoard
            MathBoard->>JSXGraph: initBoard(id, config)
            activate JSXGraph
            JSXGraph-->>MathBoard: board object
            MathBoard-->>Usuario: Canvas JSXGraph renderizado
        else Nodo No Encontrado
            ContentStore-->>TheoremPage: undefined
            TheoremPage-->>Usuario: Renderiza página 404
        end
        deactivate ContentStore
    end

    %% Escenario 2: Interacción con Simulación (Data-Binding)
    rect rgba(100, 255, 100, 0.1)
        Usuario->>JSXGraph: Drag en un punto (ej. A)
        JSXGraph->>MDXComponent: Dispara evento o altera propiedad gráfica
        MDXComponent->>MathProvider: useMathStore().setVariable(...)
        MathProvider-->>MDXComponent: Notifica cambio a hooks suscritos
        MDXComponent-->>MathBoard: onUpdate disparado
        MathBoard->>JSXGraph: board.update()
        MDXComponent-->>Usuario: El texto interactivo se actualiza
    end

    %% Escenario 3: Interacción Marginalia
    rect rgba(255, 200, 100, 0.1)
        Usuario->>ConceptLink: Clic en <ConceptLink targetId='area'>
        activate ConceptLink
        ConceptLink->>NavigationStore: openMarginalia('area')
        deactivate ConceptLink
        NavigationStore->>MarginaliaPanel: Notifica activeTerm = 'area'
        activate MarginaliaPanel
        
        MarginaliaPanel->>ContentStore: getTheorem('area')
        ContentStore-->>MarginaliaPanel: Definición (Entity)
        MarginaliaPanel-->>Usuario: Despliega panel lateral con explicación
        deactivate MarginaliaPanel
    end
```
