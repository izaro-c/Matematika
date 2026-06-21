# Software Requirements Specification (SRS)
**Proyecto:** Matematika — Interactive Digital Garden
**Fecha:** Junio 2026
**Estándar de Referencia:** Basado en la estructura recomendada por IEEE Std 830-1998.

---

## 1. Introducción

### 1.1 Propósito
Este documento establece las Especificaciones de Requisitos de Software (SRS) para **Matematika**. Su propósito es definir detalladamente las funcionalidades, restricciones, interfaces y atributos de calidad del sistema, sirviendo como contrato técnico entre los desarrolladores, diseñadores y autores de contenido.

### 1.2 Alcance del Producto
Matematika es una plataforma de aprendizaje y exploración matemática ("Jardín Digital"). Permite a los usuarios navegar fluidamente por un grafo de conocimiento compuesto de Teoremas, Lecciones, Definiciones y Simulaciones interactivas. A diferencia de las plataformas LMS (Learning Management Systems), Matematika prioriza la exploración transversal impulsada por la curiosidad mediante navegación `Marginalia` y simulaciones hiperreactivas que conectan narrativa y geometría visual.

### 1.3 Definiciones, Acrónimos y Abreviaturas
- **MDX:** Markdown con extensión para alojar componentes JSX/React.
- **Marginalia:** Interfaz lateral que despliega información de un nodo enlazado sin abandonar la lectura del nodo principal.
- **Omnibar:** Barra de búsqueda universal superpuesta en la UI.
- **Store / Zustand:** Sistema de gestión de estado global y local utilizado en la arquitectura de React.
- **Node (Nodo):** Entidad atómica de conocimiento (Ej: Un Teorema, una Biografía).

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
Matematika funciona como una *Single Page Application* (SPA) estática en su distribución, pero dinámicamente hidratada en cliente.
- **Frontend:** React 19, Tailwind CSS v4, Wouter.
- **Motores Gráficos:** JSXGraph (geometría 2D plana), Three.js (geometría 3D).
- **Compilador Textual:** Motor MDX integrado con KaTeX para renderizado tipográfico matemático ($\LaTeX$).
- **Capa de Datos:** Sistema de indexación *Build-Time* mediante Vite (`generate-content-index.ts`) que vuelca la red de nodos a un `contentIndex.json`.

### 2.2 Características de los Usuarios
| Perfil | Nivel Técnico | Descripción y Tareas Principales |
|---|---|---|
| **Estudiante** | Bajo / Medio | Navega por planes de estudio, resuelve ejercicios interactivos, manipula gráficas para entender conceptos. |
| **Profesor / Autor** | Medio / Alto | Escribe archivos `.mdx`, define metadatos YAML/TS, y programa componentes JSXGraph encapsulados (`MathFactory`). |

### 2.3 Entorno Operativo
- **Plataformas Soportadas:** Navegadores modernos (Chrome 100+, Firefox 90+, Safari 15+, Edge).
- **Dispositivos:** Optimizado para Desktop y Tablet (la manipulación compleja de gráficas en móviles está restringida a visualización pasiva o gestos básicos).

---

## 3. Requisitos Específicos

### 3.1 Interfaces Externas
- **UI (Interfaz de Usuario):** Debe soportar "Dark Mode" dinámico basado en `--theme-*` CSS variables.
- **Hardware Interfaces:** Soporte para eventos de puntero unificados (`PointerEvents`) para permitir arrastre de puntos geométricos con ratón, stylus o táctil.

### 3.2 Requisitos Funcionales (RF)

#### RF-1: Motor de Navegación y Rutas
- **RF-1.1:** El sistema debe resolver las rutas a través de identificadores de nodo (slugs) extraídos del `ContentStore`.
- **RF-1.2:** Si un usuario accede a un nodo inexistente, el sistema debe renderizar un componente dinámico "En Construcción" en lugar de fallar (404 estricto).

#### RF-2: Navegación Contextual (Marginalia)
- **RF-2.1:** Al interceptar un evento `onClick` sobre un componente `<ConceptLink>`, se debe abrir el panel `MarginaliaPanel`.
- **RF-2.2:** El contenido de la Marginalia debe hidratarse de forma asíncrona recuperando los datos del nodo destino del `ContentStore`.

#### RF-3: Motor Gráfico y Data-Binding
- **RF-3.1:** Las simulaciones deben enviar señales de estado (`isStep`, `highlight`) al `MathStoreContext` mediante la utilidad `StyleManager`.
- **RF-3.2:** El texto en MDX envuelto en componentes reactivos debe suscribirse al `MathStoreContext` para cambiar sus estilos en concordancia con los eventos del `JSXGraph`.

#### RF-4: Búsqueda y Descubrimiento
- **RF-4.1:** El sistema debe incluir un `SearchOmnibar` accesible globalmente (Cmd/Ctrl+K) que utilice algoritmos de búsqueda difusa (Fuse.js) sobre `contentIndex.json`.

---

## 4. Requisitos de Calidad de Software (RNF)

### 4.1 Rendimiento (Performance)
- **RNF-1.1 (Frame Rate):** Las actualizaciones vinculadas al `MathStoreContext` deben resolverse en `< 16ms` para garantizar animaciones a 60 FPS durante interacciones de arrastre continuo.
- **RNF-1.2 (Time to Interactive):** El `contentIndex.json` no debe superar 1MB comprimido (gzip) para asegurar carga instantánea inicial.

### 4.2 Fiabilidad (Reliability) y Gestión de Memoria
- **RNF-2.1 (Memory Leak Prevention):** Todo lienzo (Canvas, SVG) creado por JSXGraph/Three.js DEBE ser purgado de la memoria llamando explícitamente a los métodos destructores del proveedor cuando la ruta Wouter desmonte el componente.

### 4.3 Mantenibilidad
- **RNF-3.1 (Validación Continua):** Ningún commit al control de versiones debe aprobarse si el script `validate-cross-references` detecta enlaces rotos en los `.mdx`.
- **RNF-3.2 (Desacoplamiento Visual):** Los `Demo*.tsx` no deben implementar lógica de colores hexadecimales duros, sino utilizar tokens de `StyleManager` mapeados al `MathBoard`.
