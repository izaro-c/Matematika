import json
import re
import os
import glob

# Load terms from index
with open('src/store/contentIndex.json', 'r') as f:
    index = json.load(f)

IGNORE_TERMS = {'punto', 'puntos', 'recta', 'rectas', 'plano', 'planos', 
  'espacio', 'incidencia', 'orden', 'congruencia', 'modelo',
  'sistema', 'matemática', 'demostración', 'axioma', 'lema',
  'teorema', 'corolario', 'definición', 'geometría', 'teoría',
  'conjunto', 'elemento', 'elementos', 'relación', 'ángulo'}

terms = {}

for entry in index.values():
    if 'metadata' in entry:
        if 'title' in entry['metadata']:
            title = re.sub(r'[^\wáéíóúüñ\s-]', '', entry['metadata']['title'].lower()).strip()
            if len(title) > 4 and title not in IGNORE_TERMS:
                terms[title] = entry['id']
        if 'name' in entry['metadata']:
            name = re.sub(r'[^\wáéíóúüñ\s-]', '', entry['metadata']['name'].lower()).strip()
            if len(name) > 4 and name not in IGNORE_TERMS:
                terms[name] = entry['id']

# Special hardcoded terms mapping for missing ones from the output
# Also we can add common synonyms
terms['geometría euclídea'] = 'sistema-euclidiano'
terms['geometría hiperbólica'] = 'sistema-hiperbolico'
terms['geometría absoluta'] = 'sistema-absoluto'
terms['euclides'] = 'euclides'
terms['arquímedes'] = 'arquimedes'
terms['segmento'] = 'segmento'
terms['axioma de arquímedes'] = 'axioma-arquimedes'
terms['moritz pasch'] = 'pasch'
terms['jános bolyai'] = 'bolyai'
terms['nikolái lobachevski'] = 'lobachevski'

# Sort terms by length descending to avoid partial matches
sorted_terms = sorted(terms.keys(), key=lambda x: len(x), reverse=True)

files = glob.glob('src/content/**/*.mdx', recursive=True)

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Split to avoid touching metadata
    parts = re.split(r'(export const metadata = \{.*?\};)', content, maxsplit=1, flags=re.DOTALL)
    if len(parts) == 3:
        header, meta, body = parts
    else:
        meta = ""
        body = content

    original_body = body

    for term in sorted_terms:
        # Match word boundaries, but don't match if it's already inside a tag
        # Negative lookahead/behind is complex for HTML tags, let's use a simpler approach:
        # split body by tags and only replace in text nodes
        
        def replace_in_text(match):
            text = match.group(0)
            if text.startswith('<') or text.startswith('$'): # very naive tag/math skipper
                return text
            # replace term case-insensitively
            # we need a regex that matches the term exactly as word boundaries
            pattern = re.compile(r'\b(' + re.escape(term) + r')\b', re.IGNORECASE)
            return pattern.sub(f'<ConceptLink targetId="{terms[term]}">\g<1></ConceptLink>', text)
        
        # We split the body into chunks of <...>, $$...$$, $...$, and text
        # This regex matches HTML tags, block math, inline math, and text
        tokens = re.split(r'(<[^>]+>|\$\$[\s\S]*?\$\$|\$[^\$]+\$)', body)
        for i in range(0, len(tokens), 2): # Even indices are text
            # Replace occurrences
            pattern = re.compile(r'\b(' + re.escape(term) + r')\b', re.IGNORECASE)
            # Only replace if the word is found, to avoid processing if not needed
            if pattern.search(tokens[i]):
                # Be careful not to replace it if it's already part of a link we just injected
                # Wait, since we are doing it sequentially, a previous term might have injected <ConceptLink>
                # But the re.split ignores tags, so tokens[i] has NO tags!
                # Wait, if we replace, we introduce tags into tokens[i].
                # So we should just replace and then rejoin.
                tokens[i] = pattern.sub(f'<ConceptLink targetId="{terms[term]}">\g<1></ConceptLink>', tokens[i])
        
        body = "".join(tokens)

    if body != original_body:
        with open(file, 'w') as f:
            if meta:
                f.write(parts[0] + meta + body)
            else:
                f.write(body)

print("Linked injected.")
