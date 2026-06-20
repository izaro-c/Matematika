import os
import glob
import re

svg_files = glob.glob('src/diagrams/Demos/*.tsx')

for file in svg_files:
    with open(file, 'r') as f:
        content = f.read()

    # Replace var(--color-*) with var(--theme-*)
    content = content.replace('var(--color-', 'var(--theme-')

    # Add touch-none and min-h-[400px] if not present
    if '<svg ' in content:
        content = re.sub(r'className="([^"]+)"', lambda m: f'className="{m.group(1)} touch-none min-h-[400px]"' if 'touch-none' not in m.group(1) else m.group(0), content, count=1)

    with open(file, 'w') as f:
        f.write(content)

print(f"Refactored {len(svg_files)} SVG files.")
