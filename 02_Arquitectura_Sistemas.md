# Documento de Arquitectura de Software (SAD)

## 1. Stack Tecnológico Elegido y Justificación
Para una SPA interactiva donde el performance en cliente es crítico y se requiere tipado fuerte para modelado matemático, el stack más "apto" y estándar en la industria es:

*   **Core:** React.js 18+ (Functional Components, Hooks).
*   **Lenguaje:** TypeScript (`strict: true`). Previene errores críticos en estructuras de datos matemáticos y matrices.
*   **Build Tool:** Vite. Ofrece un HMR (Hot Module Replacement) instantáneo y soporte nativo para resolución de módulos glob (`import.meta.glob`) necesario para cargar los MDX.
*   **Enrutador:** Wouter. Minimalista, pesa fracciones de lo que pesa react-router, ideal para un "Jardín Digital".
*   **State Management:** Zustand. Permite crear stores de contexto aislados sin el boilerplate excesivo de Redux. Fundamental para suscribir los motores de canvas a cambios de estado sin re-renderizar React.
*   **Estilos:** Tailwind CSS con variables inyectadas (Design Tokens).
*   **Motores Gráficos:** JSXGraph (para Geometría Analítica 2D) y Three.js (para Geometría Espacial 3D).

## 2. Patrones de Diseño a Implementar

### A. MDX Export Bridge (Inyección de Dependencias Invertida)
En lugar de un router monolítico que mapee rutas a simuladores, aplicaremos *Inversión de Control*.
El archivo MDX contiene la teoría, pero exporta dinámicamente su propio simulador:
```tsx
import { MiSimulador } from '@components/simulators';
export const Simulation = MiSimulador;
```
El contenedor principal simplemente pregunta: "¿Este MDX exporta un `Simulation`? Si es así, lo monto".

### B. Single Source of Truth (SSOT) para Diseño Visual
Los colores no son estéticos, son semánticos (indican relaciones matemáticas). 
Se creará un `designTokens.ts`. Tailwind, Three.js y KaTeX leerán los colores exclusivamente de ahí. Si el color de un "Plano" cambia, se actualizará en todo el sistema.

### C. Estado Aislado por Contexto (Zustand + React Context)
El estado de la simulación del "Teorema de Pitágoras" es basura cuando el usuario navega a "Matrices". 
El store de Zustand no debe ser global. Se instanciará a través de un Provider en la raíz de cada Nodo, de forma que al desmontar el nodo, el *Garbage Collector* limpie el estado matemático en memoria.
