# Guía de Estilo y UI (Design Tokens y Estética)

**ATENCIÓN AGENTE:** Este documento define las reglas visuales, estructurales y estéticas del proyecto. Tu misión es garantizar que cualquier componente o gráfico desarrollado refleje el "alma" de este proyecto y mantenga el rigor académico.

## 1. Filosofía Estética y Objetivo Visual
El objetivo es crear una **"Enciclopedia Técnica Moderna"** inspirada en obras clásicas de geometría ilustrada (como los Elementos de Euclides por Oliver Byrne).
*   **Claridad Axiomática:** La estética jamás debe interferir con las matemáticas. Se prohíbe cualquier tipo de decoración innecesaria, texturas, gradientes pesados, brillos artificiales o fotorrealismo.
*   **Espacio Negativo:** Es obligatorio maximizar el uso del "espacio en blanco" (fondo crema) para reducir el ruido cognitivo. Los lienzos 2D/3D no deben tener bordes duros que los encuadren, sino que deben fundirse visualmente con el fondo de la aplicación.
*   **Minimalismo Técnico:** Las líneas deben ser finas y precisas. Las tipografías deben tener un contraste perfecto evitando estridencias visuales.

## 2. Layout y Estructura (Grid System)
La vista de aprendizaje debe evocar un libro técnico interactivo:
*   **Estructura Base:** El contenido se dividirá típicamente en un diseño asimétrico (ej. CSS Grid o Flexbox 60/40 o 70/30).
*   **Lienzo Visual (Izquierda):** El 60-70% del espacio alojará el motor gráfico (JSXGraph / Three.js). Debe sentirse como una extensión infinita de la página para manipular las formas geométricas con libertad.
*   **Panel Teórico (Derecha):** El 30-40% restante contendrá la teoría matemática en formato MDX. Requerirá un `line-height` amplio (mínimo 1.6) y espaciado generoso para invitar a la lectura sosegada.

## 3. Directrices de Renderizado Geométrico (Motores)
*   **Iluminación (3D):** Rechaza sombras duras (Shadow Maps desactivados). Utiliza Iluminación Ambiental (AmbientLight) y luces de área muy suaves para generar sombreados planos (Flat Shading o Lambert difuso) que evoquen ilustraciones de tinta en papel.
*   **Cámaras:** Usa un campo de visión (FOV) bajo para minimizar la distorsión de la perspectiva de las figuras, o derechamente utiliza una Cámara Ortográfica para mantener el paralelismo.
*   **Materiales y Superficies:** Los planos 3D deben usar materiales semi-transparentes (`opacity: ~0.25`) combinados obligatoriamente con *wireframes* (cuadrículas finas superpuestas) para facilitar la percepción de profundidad sin ocultar los elementos posteriores.

## 4. El Single Source of Truth (Paleta Semántica)
Se prohíbe el uso de colores genéricos de Tailwind (como `bg-red-500`). Todos los sistemas (CSS, KaTeX, JSXGraph, Three.js) deben inyectar y utilizar **únicamente** estos 5 colores semánticos:

| Nombre Semántico | Hex Code | Función en UI | Función Matemática (Data-Binding) |
| :--- | :--- | :--- | :--- |
| **Crema Lienzo** | `#F8F6F1` | Fondo general y lienzos gráficos. | N/A |
| **Carbón Técnico** | `#333333` | Texto base, bordes finos. | Ejes cartesianos (X, Y, Z), marcos de referencia. |
| **Verde Salvia** | `#A2C2A2` | Fondos suaves, badges. | Representa los **Planos** y coeficientes (A, B, C, D). |
| **Terracota** | `#C86446` | Estados de hover, alertas. | Representa **Puntos**, incógnitas (x, y, z) y vectores. |
| **Azul Pizarra** | `#5D7080` | Texto secundario explicativo. | Representa **Distancias**, resultados y rectas de cruce. |

## 5. Regla Absoluta de Data-Binding Visual
Existe una relación inmutable (1:1) entre el texto teórico y la figura geométrica. Si la teoría matemática describe un plano usando la variable $A$ y se renderiza en KaTeX empleando el color **Verde Salvia**, el componente de JSXGraph o Three.js **debe obligatoriamente** dibujar ese plano en el lienzo 3D utilizando exactamente el mismo código Hex (`#A2C2A2`).

## 6. Tipografía Dual
El proyecto separa la capa de "interfaz" de la capa "académica" mediante el uso de dos familias tipográficas:
*   **UI y Controles:** Fuente `Sans-Serif` (ej. Inter, Roboto, Helvetica). Usada en menús, controles de cámara y títulos estructurales.
*   **Teoría y Matemáticas:** Fuente `Serif` (ej. Garamond, Computer Modern, Playfair). Usada para la teoría MDX, fórmulas y demostraciones. Las variables matemáticas siempre deben ir en *cursiva* siguiendo el estándar académico.
