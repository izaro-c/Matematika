import os
import glob
import re

jxg_files = [
    "src/diagrams/Axiomas/EuclidParallel.tsx",
    "src/diagrams/Axiomas/HyperbolicParallel.tsx",
    "src/diagrams/Axiomas/Incidence1.tsx",
    "src/diagrams/Axiomas/Incidence3.tsx",
    "src/diagrams/Axiomas/Pasch.tsx",
    "src/diagrams/Axiomas/SAS.tsx",
    "src/diagrams/Axiomas/Incidence2.tsx",
    "src/diagrams/Axiomas/Incidence4.tsx",
    "src/diagrams/Definiciones/Punto.tsx",
    "src/diagrams/Definiciones/Recta.tsx",
    "src/diagrams/Definiciones/Segmento.tsx",
    "src/diagrams/Definiciones/Semirrecta.tsx",
    "src/diagrams/Definiciones/Angulo.tsx",
    "src/diagrams/Theorems/AngulosOpuestos.tsx",
    "src/diagrams/Theorems/CongruenciaALA.tsx",
    "src/diagrams/Theorems/CongruenciaLLL.tsx",
    "src/diagrams/Models/ModeloTresPuntos.tsx",
    "src/diagrams/Models/ModeloCartesiano.tsx",
    "src/diagrams/Models/ModeloFano.tsx",
    "src/diagrams/Models/ModeloPoincare.tsx",
]

for file in jxg_files:
    with open(file, 'r') as f:
        content = f.read()

    # Replace `board.renderer.container.style` with `(board.renderer as any).container.style`
    content = content.replace('board.renderer.container.style', '(board.renderer as any).container.style')

    with open(file, 'w') as f:
        f.write(content)

print(f"Fixed TS errors in {len(jxg_files)} files.")
