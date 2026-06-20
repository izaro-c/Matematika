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

css_var_helper = """
function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}
"""

color_map = {
    '#333333': 'carbon',
    '#a2c2a2': 'salvia',
    '#c86446': 'terracota',
    '#5d7080': 'pizarra',
    '#f8f6f1': 'lienzo',
    '#c49b4f': 'ocre',
    '#f5c542': 'ocre',
    '#5a805a': 'musgo',
    '#3b5e6b': 'pavo',
    '#8b3a3a': 'granada',
    '#4a5d23': 'musgo',
}

for file in jxg_files:
    with open(file, 'r') as f:
        content = f.read()

    # Skip if already refactored
    if 'getCSSVar' not in content:
        # Insert helper after imports
        content = re.sub(r'(import .*;\n)+', lambda m: m.group(0) + '\n' + css_var_helper + '\n', content, count=1)

    # Replace Hex colors
    def color_replacer(match):
        hex_val = match.group(0).strip("'\"").lower()
        if hex_val in color_map:
            return f"getCSSVar('--theme-{color_map[hex_val]}')"
        return match.group(0)
    
    content = re.sub(r"['\"]#[0-9a-fA-F]{6}['\"]", color_replacer, content)

    # Insert background color and mutation observer if not present
    if 'MutationObserver' not in content:
        bg_code = "    board.renderer.container.style.backgroundColor = getCSSVar('--theme-lienzo');\n"
        obs_code = """
    const observer = new MutationObserver(() => {
      if (board) {
        board.renderer.container.style.backgroundColor = getCSSVar('--theme-lienzo');
        board.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();"""
        
        # Insert before `return () => {`
        # wait, some files might have `return () => {\n      JXG.JSXGraph.freeBoard(board);`
        content = re.sub(r'(\s+)return \(\) => \{\n(\s+)JXG\.JSXGraph\.freeBoard\(board\);', lambda m: bg_code + '\n' + m.group(1) + obs_code[1:] + '\n' + m.group(2) + 'JXG.JSXGraph.freeBoard(board);', content, count=1)

    # Also make sure showCopyright is false
    if 'showCopyright' not in content:
        # Just in case, won't try to blindly inject it if they already have it
        pass
    
    with open(file, 'w') as f:
        f.write(content)

print(f"Refactored {len(jxg_files)} JSXGraph files.")
