import os
import re

terms_map = {
    "punto": ["punto", "puntos"],
    "recta": ["recta", "rectas"],
    "plano": ["plano", "planos"],
    "segmento": ["segmento", "segmentos"],
    "angulo": ["ángulo", "ángulos", "angulo", "angulos"],
    "triangulo": ["triángulo", "triángulos", "triangulo", "triangulos"],
    "axioma": ["axioma", "axiomas"],
    "teorema": ["teorema", "teoremas"],
    "congruencia": ["congruencia", "congruente", "congruentes"],
    "perpendicular": ["perpendicular", "perpendiculares"],
    "paralelas": ["paralela", "paralelas"],
    "poligono": ["polígono", "polígonos", "poligono", "poligonos"],
    "euclides": ["euclides", "euclidiana", "euclidiano"],
    "hilbert": ["hilbert"],
    "incidencia": ["incidencia"],
    "dimension": ["dimensión", "dimension"],
    "superficie": ["superficie", "superficies"],
    "mediana": ["mediana", "medianas"],
    "mediatriz": ["mediatriz", "mediatrices"],
    "altura": ["altura", "alturas"],
    "bisectriz": ["bisectriz", "bisectrices"],
    "semirrecta": ["semirrecta", "semirrectas"],
    "circunferencia": ["circunferencia", "circunferencias"],
    "area": ["área", "area"],
    "volumen": ["volumen", "volúmenes"],
    "longitud": ["longitud", "longitudes"],
    "colineal": ["colineal", "colineales"],
    "coplanares": ["coplanar", "coplanares"],
    "geometria": ["geometría", "geometria"],
    "postulado": ["postulado", "postulados"],
    "corolario": ["corolario", "corolarios"],
    "lema": ["lema", "lemas"],
    "demostracion": ["demostración", "demostraciones"],
}

# Build a single regex pattern for all words
all_words = []
word_to_target = {}
for targetId, words in terms_map.items():
    for word in words:
        all_words.append(re.escape(word))
        word_to_target[word.lower()] = targetId

# Sort by length descending to match longest first (e.g. "geometría" before "geometria")
all_words.sort(key=len, reverse=True)
master_pattern = re.compile(r'\b(' + '|'.join(all_words) + r')\b', re.IGNORECASE)

def process_text(text):
    tokens = re.split(r'(<[^>]+>|\$\$[^$]+\$\$|\$[^$]+\$)', text)
    for i in range(len(tokens)):
        if i % 2 == 0:
            def repl(m):
                word = m.group(1)
                target = word_to_target[word.lower()]
                return f'<ConceptLink targetId="{target}">{word}</ConceptLink>'
            tokens[i] = master_pattern.sub(repl, tokens[i])
    return "".join(tokens)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Fix highlight -> target
    content = re.sub(r'<InteractiveElement([^>]*)highlight=', r'<InteractiveElement\1target=', content)

    # Protect imports
    imports = []
    def import_repl(m):
        imports.append(m.group(0))
        return f"__IMPORT_{len(imports)-1}__"
    content = re.sub(r'^import\s+.*?;?\s*$', import_repl, content, flags=re.MULTILINE)

    # 2. Extract YAML metadata block to not touch it
    # MDX metadata usually is export const metadata = { ... };
    meta_match = re.search(r'export const metadata = \{.*?\};', content, re.DOTALL)
    if meta_match:
        meta_str = meta_match.group(0)
        body = content[meta_match.end():]
        body = process_text(body)
        content = content[:meta_match.start()] + meta_str + body
    else:
        content = process_text(content)

    # Clean up double wraps if any
    content = re.sub(r'<ConceptLink targetId="[^"]+"><ConceptLink targetId="([^"]+)">([^<]+)</ConceptLink></ConceptLink>', r'<ConceptLink targetId="\1">\2</ConceptLink>', content)

    # Restore imports
    for i, imp in enumerate(imports):
        content = content.replace(f"__IMPORT_{i}__", imp)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src/content'):
    for file in files:
        if file.endswith('.mdx'):
            process_file(os.path.join(root, file))
