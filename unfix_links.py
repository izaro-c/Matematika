import os
import glob
import re

files = glob.glob('src/content/**/*.mdx', recursive=True)

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # 1. Fix imports: import { <ConceptLink...>Word</ConceptLink> } from '...<ConceptLink...>Word</ConceptLink>...'
    # We just strip all ConceptLink tags inside import statements.
    def clean_import(match):
        text = match.group(0)
        text = re.sub(r'<ConceptLink[^>]*>', '', text)
        text = re.sub(r'</ConceptLink>', '', text)
        return text

    content = re.sub(r'^import\s+.*?;', clean_import, content, flags=re.MULTILINE | re.DOTALL)

    # 2. Fix export const Simulation = <ConceptLink...>Word</ConceptLink>
    def clean_export(match):
        text = match.group(0)
        text = re.sub(r'<ConceptLink[^>]*>', '', text)
        text = re.sub(r'</ConceptLink>', '', text)
        return text

    content = re.sub(r'^export const Simulation\s*=.*?;', clean_export, content, flags=re.MULTILINE)

    # 3. Fix <InteractiveElement target="foo"><ConceptLink...>bar</ConceptLink></InteractiveElement> -> <InteractiveElement target="foo">bar</InteractiveElement>
    def clean_interactive(match):
        text = match.group(0)
        inner = re.sub(r'<ConceptLink[^>]*>', '', text)
        inner = re.sub(r'</ConceptLink>', '', inner)
        return inner

    content = re.sub(r'<InteractiveElement[^>]*>.*?</InteractiveElement>', clean_interactive, content, flags=re.DOTALL)

    # 4. Fix nested ConceptLinks: <ConceptLink targetId="foo"><ConceptLink targetId="foo">foo</ConceptLink></ConceptLink> -> <ConceptLink targetId="foo">foo</ConceptLink>
    # Actually, simpler: replace <ConceptLink...><ConceptLink...>(.*?)</ConceptLink></ConceptLink> with <ConceptLink...>\1</ConceptLink>
    content = re.sub(r'<ConceptLink([^>]*)><ConceptLink[^>]*>(.*?)</ConceptLink></ConceptLink>', r'<ConceptLink\1>\2</ConceptLink>', content)

    with open(file, 'w') as f:
        f.write(content)

print(f"Cleaned {len(files)} files.")
