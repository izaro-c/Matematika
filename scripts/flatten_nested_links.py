import os
import re

def flatten_links(content):
    tokens = re.split(r'(</?ConceptLink[^>]*>)', content)
    output = []
    stack = 0
    
    for token in tokens:
        if token.startswith('<ConceptLink'):
            stack += 1
            if stack == 1:
                output.append(token) # keep outer
        elif token.startswith('</ConceptLink>'):
            if stack == 1:
                output.append(token) # keep outer
                stack -= 1
            elif stack > 1:
                stack -= 1
            # if stack == 0, there is an unbalanced closing tag. we should probably omit it.
        else:
            output.append(token)
            
    return "".join(output)

count = 0
for root, _, files in os.walk('src/content'):
    for file in files:
        if file.endswith('.mdx'):
            fpath = os.path.join(root, file)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = flatten_links(content)
            if new_content != content:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Flattened {fpath}")
                count += 1
print(f"Flattened {count} files.")
