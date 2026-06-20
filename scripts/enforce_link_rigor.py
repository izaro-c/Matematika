import os
import re
import json

def parse_metadata_links(metadata_str):
    """Extracts 'links' array and 'parentTheorem' from the JS metadata block."""
    links = []
    # Match links: ["a", "b"]
    links_match = re.search(r'links\s*:\s*\[(.*?)\]', metadata_str, re.DOTALL)
    if links_match:
        items = links_match.group(1).split(',')
        for item in items:
            item = item.strip().strip('"').strip("'")
            if item:
                links.append(item)
    
    parent_match = re.search(r'parentTheorem\s*:\s*["\']([^"\']+)["\']', metadata_str)
    if parent_match:
        links.append(parent_match.group(1))
        
    return set(links)

def parse_target_ids(target_id_attr):
    """Parses targetId string like '"punto"' or '{["a", "b"]}' into a tuple of strings."""
    # If array syntax
    if target_id_attr.startswith('{') and target_id_attr.endswith('}'):
        inner = target_id_attr[1:-1].strip()
        if inner.startswith('[') and inner.endswith(']'):
            inner = inner[1:-1]
            parts = [p.strip().strip('"').strip("'") for p in inner.split(',')]
            return tuple(p for p in parts if p)
    # If simple string
    val = target_id_attr.strip('"').strip("'")
    return (val,) if val else ()

def enforce_rigor(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    meta_match = re.search(r'export const metadata = \{.*?\};', content, re.DOTALL)
    if not meta_match:
        return
    
    meta_str = meta_match.group(0)
    true_deps = parse_metadata_links(meta_str)
    
    body = content[meta_match.end():]
    
    seen_targets = set()
    
    # We will find all <ConceptLink ...>...</ConceptLink> tags
    # The regex needs to handle nested ConceptLinks? Wait, fix_composite_links removed nested links mostly.
    # If there are any nested links left, a simple regex might fail. 
    # But let's assume they are not nested anymore.
    
    # regex for <ConceptLink ...>...</ConceptLink>
    # Group 1: attributes inside the opening tag
    # Group 2: the inner text
    # We use a custom replacement function
    
    def repl(m):
        attrs_str = m.group(1)
        inner_text = m.group(2)
        
        # Extract targetId
        target_match = re.search(r'targetId\s*=\s*(\{.*?\}|"[^"]*"|\'[^\']*\')', attrs_str)
        if not target_match:
            return m.group(0)
            
        target_attr = target_match.group(1)
        target_tuple = parse_target_ids(target_attr)
        
        # Deduplication check
        if target_tuple in seen_targets:
            # We've seen this concept! Return just the inner text (unwrap it)
            return inner_text
            
        # First time seeing it!
        seen_targets.add(target_tuple)
        
        # Check if it's a true dependency
        # A concept is a true dependency if ANY of its targetIds are in the true_deps list
        is_true_dep = any(t in true_deps for t in target_tuple)
        
        # Reconstruct the tag
        # Remove existing isDependency if any
        attrs_str_clean = re.sub(r'\s*isDependency\s*=\s*\{[^}]+\}', '', attrs_str)
        
        if is_true_dep:
            # It's a true dependency. We can omit isDependency (defaults to true)
            new_tag = f'<ConceptLink {attrs_str_clean.strip()}>{inner_text}</ConceptLink>'
        else:
            # Not a dependency. Must add isDependency={false}
            new_tag = f'<ConceptLink {attrs_str_clean.strip()} isDependency={{false}}>{inner_text}</ConceptLink>'
            
        return new_tag

    # To process safely without touching JSX inside MedievalStep properties (e.g. title="..."), 
    # we first extract the title and target properties to protect them.
    protected = []
    def protect_repl(m):
        protected.append(m.group(0))
        return f"__PROTECTED_{len(protected)-1}__"
    
    # Protect JSX attributes that are strings or arrays
    # E.g. title="..." or target={["..."]}
    body = re.sub(r'([a-zA-Z0-9_]+)\s*=\s*("[^"]*"|\{[^}]*\})', lambda m: protect_repl(m) if m.group(1) != 'targetId' and m.group(1) != 'isDependency' else m.group(0), body)

    # Now replace ConceptLinks
    body = re.sub(r'<ConceptLink([^>]*)>(.*?)</ConceptLink>', repl, body, flags=re.DOTALL)
    
    # Restore protected
    for i, p in enumerate(protected):
        body = body.replace(f"__PROTECTED_{i}__", p)

    new_content = content[:meta_match.end()] + body
    
    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Enforced rigor in {filepath}")

for root, _, files in os.walk('src/content'):
    for file in files:
        if file.endswith('.mdx'):
            enforce_rigor(os.path.join(root, file))
