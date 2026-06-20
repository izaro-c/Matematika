import re
def flatten_links(content):
    tokens = re.split(r'(</?ConceptLink[^>]*>)', content)
    output = []
    stack = 0
    
    for token in tokens:
        if token.startswith('<ConceptLink'):
            stack += 1
            if stack == 1:
                output.append(token)
        elif token.startswith('</ConceptLink>'):
            if stack == 1:
                output.append(token)
                stack -= 1
            elif stack > 1:
                stack -= 1
        else:
            output.append(token)
            
    return "".join(output)

print(flatten_links('<ConceptLink targetId="demo-punto-medio"><ConceptLink targetId="demostracion">Demostración</ConceptLink>: Existencia y unicidad del <ConceptLink targetId="punto">punto</ConceptLink> medio</ConceptLink>.'))
