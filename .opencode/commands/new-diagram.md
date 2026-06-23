---
description: Crear nuevo diagrama interactivo
agent: diagram-creator
---
Crea un nuevo diagrama matemático interactivo.
PRIMERO carga la skill diagrama.
PREGUNTA: 1) concepto a visualizar, 2) tecnología (JSXGraph para geometría, SVG para ilustraciones, Canvas para animaciones), 3) nivel de interactividad.
USA exclusivamente getCSSVar('--theme-*') para colores (paleta Arts & Crafts).
CONECTA con MathStore o LessonStore si es interactivo.
CREA el archivo en src/shared/diagrams/{categoria}/.
