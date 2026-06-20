import glob
import re
import json

files = glob.glob('src/content/**/*.mdx', recursive=True)

analysis = []
for f in files:
    with open(f, 'r') as fp:
        content = fp.read()
    
    # Extract metadata block
    meta_match = re.search(r'export const metadata = (\{.*?\});', content, re.DOTALL)
    meta = {}
    if meta_match:
        try:
            # simple regex to extract keys
            id_m = re.search(r'"id":\s*"([^"]+)"', meta_match.group(1))
            type_m = re.search(r'"type":\s*"([^"]+)"', meta_match.group(1))
            authors_m = re.search(r'"authors":\s*\[(.*?)\]', meta_match.group(1))
            
            meta['id'] = id_m.group(1) if id_m else None
            meta['type'] = type_m.group(1) if type_m else None
            if authors_m and authors_m.group(1).strip():
                meta['authors'] = [a.strip('"\' ') for a in authors_m.group(1).split(',')]
            else:
                meta['authors'] = []
        except Exception:
            pass
            
    # Count ConceptLinks
    concept_links = len(re.findall(r'<ConceptLink', content))
    interactive_elements = len(re.findall(r'<InteractiveElement', content))
    
    analysis.append({
        'path': f,
        'id': meta.get('id'),
        'type': meta.get('type'),
        'authors': meta.get('authors', []),
        'concept_links': concept_links,
        'interactive_elements': interactive_elements
    })

print(json.dumps(analysis, indent=2))
