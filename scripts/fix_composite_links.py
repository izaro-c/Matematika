import re
import glob

# Tuples of (regex_pattern, targetId_array_string)
# We want to match variations including already wrapped words.
# To do this safely, we will use a helper function to match phrases while allowing optional tags inside.
def build_pattern(phrase):
    words = phrase.split()
    parts = []
    for w in words:
        # allow case and accent variations
        w = w.replace('a', '[aá]').replace('e', '[eé]').replace('i', '[ií]').replace('o', '[oó]').replace('u', '[uú]')
        part = rf'(?:<ConceptLink[^>]*>)?(?:\*\*)?{w}(?:\*\*)?(?:</ConceptLink>)?'
        parts.append(part)
    
    # join with whitespace, allowing any tags between words
    pattern = r'\s*(?:<[^>]+>\s*)*\s*'.join(parts)
    # wrap with negative lookaround to prevent matching inside other words
    # and consume any opening ConceptLinks immediately before, and closing ConceptLinks immediately after
    return rf'(?<![A-Za-z])(?:<ConceptLink[^>]*>\s*)*(?:{pattern})(?:\s*</ConceptLink>)*(?![A-Za-z])'

# Pairs of (phrase_pattern, clean_phrase, targetId_string)
mappings = [
    (build_pattern('teorema de pitagoras'), 'Teorema de Pitágoras', '{["teorema-pitagoras", "teorema", "pitagoras"]}'),
    (build_pattern('teorema pitagoras'), 'Teorema de Pitágoras', '{["teorema-pitagoras", "teorema", "pitagoras"]}'),
    (build_pattern('teorema de tales'), 'Teorema de Tales', '{["teorema-tales", "teorema", "tales"]}'),
    (build_pattern('teorema tales'), 'Teorema de Tales', '{["teorema-tales", "teorema", "tales"]}'),
    (build_pattern('axioma de las paralelas'), 'Axioma de las paralelas', '{["axioma-paralelas-euclides", "axioma", "paralelas"]}'),
    (build_pattern('quinto postulado'), 'quinto postulado', '{["axioma-paralelas-euclides", "postulado", "paralelas"]}'),
    (build_pattern('geometria euclidea'), 'geometría euclídea', '{["sistema-euclidiano", "geometria", "euclides"]}'),
    (build_pattern('geometria euclidiana'), 'geometría euclidiana', '{["sistema-euclidiano", "geometria", "euclides"]}'),
    (build_pattern('geometria hiperbolica'), 'geometría hiperbólica', '{["sistema-hiperbolico", "geometria"]}'),
    (build_pattern('geometria absoluta'), 'geometría absoluta', '{["sistema-absoluto", "geometria"]}'),
    (build_pattern('geometria neutral'), 'geometría neutral', '{["sistema-absoluto", "geometria"]}'),
    (build_pattern('sistema de incidencia'), 'sistema de incidencia', '{["sistema-incidencia", "axioma", "incidencia"]}'),
    (build_pattern('axiomas de incidencia'), 'axiomas de incidencia', '{["sistema-incidencia", "axioma", "incidencia"]}'),
    (build_pattern('plano de fano'), 'plano de Fano', '{["modelo-fano", "plano"]}'),
    (build_pattern('modelo de fano'), 'modelo de Fano', '{["modelo-fano", "plano"]}'),
    (build_pattern('modelo de poincare'), 'modelo de Poincaré', '{["modelo-poincare", "plano"]}'),
    (build_pattern('disco de poincare'), 'disco de Poincaré', '{["modelo-poincare", "plano"]}'),
    (build_pattern('desigualdad triangular'), 'desigualdad triangular', '{["teorema-desigualdad-triangular", "triangulo"]}'),
    (build_pattern('triangulo isosceles'), 'triángulo isósceles', '{["teorema-triangulo-isosceles", "triangulo"]}'),
    (build_pattern('punto medio'), 'punto medio', '{["lema-punto-medio", "punto"]}'),
    (build_pattern('axioma de arquimedes'), 'axioma de Arquímedes', '{["axioma-arquimedes", "axioma", "arquimedes"]}'),
    (build_pattern('axioma de completitud'), 'axioma de completitud', '{["axioma-completitud", "axioma"]}'),
    (build_pattern('plano proyectivo'), 'plano proyectivo', '{["plano-proyectivo", "plano"]}'),
    (build_pattern('axiomas de orden'), 'axiomas de orden', '{["axioma-orden-1", "axioma"]}'),
    (build_pattern('axiomas de congruencia'), 'axiomas de congruencia', '{["congruencia", "axioma"]}')
]

files = glob.glob('src/content/**/*.mdx', recursive=True)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Temporarily remove imports to protect them
    imports = []
    def import_repl(m):
        imports.append(m.group(0))
        return f"__IMPORT_{len(imports)-1}__"
    content = re.sub(r'^import\s+.*?;?\s*$', import_repl, content, flags=re.MULTILINE)

    # Protect metadata block
    meta_str = ""
    meta_match = re.search(r'export const metadata = \{.*?\};', content, re.DOTALL)
    if meta_match:
        meta_str = meta_match.group(0)
        content = content[:meta_match.start()] + "__METADATA_BLOCK__" + content[meta_match.end():]

    # Protect all XML/JSX attributes: name="value" or name={value}
    # To be safe, we just protect any string starting with ="..." or ={...}
    attrs = []
    def attr_repl(m):
        attrs.append(m.group(0))
        return f'="__ATTR_{len(attrs)-1}__"'
    
    content = re.sub(r'="[^"]+"', attr_repl, content)

    # Also protect ={...} if it does not contain newlines (like arrays in targetId)
    # Actually, targetId={["a", "b"]} is nested. We can just protect targetId=...
    def attr_jsx_repl(m):
        attrs.append(m.group(0))
        return f'={{"__ATTR_{len(attrs)-1}__"}}'
    
    content = re.sub(r'=\{[^}]+\}', attr_jsx_repl, content)

    # Replace using regex
    for pattern, clean_text, target in mappings:
        def repl(m):
            raw = m.group(0)
            text_inside = re.sub(r'<[^>]+>', '', raw)
            return f'<ConceptLink targetId={target}>{text_inside}</ConceptLink>'

        content = re.sub(pattern, repl, content, flags=re.IGNORECASE)

    # Clean up double wraps if any are left
    # (We removed the regex-based cleanup here. We will use a separate stack-based flattening script)


    # Restore attributes
    for i, attr in enumerate(attrs):
        content = content.replace(f'="__ATTR_{i}__"', attr)
        content = content.replace(f'={{"__ATTR_{i}__"}}', attr)

    # Restore metadata block
    if meta_str:
        content = content.replace("__METADATA_BLOCK__", meta_str)

    # Restore imports
    for i, imp in enumerate(imports):
        content = content.replace(f"__IMPORT_{i}__", imp)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
