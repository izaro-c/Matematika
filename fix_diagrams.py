import os
import glob
import re

files_to_fix = glob.glob('src/diagrams/Definiciones/*.tsx') + glob.glob('src/diagrams/Teoremas/*.tsx')

import_pattern = re.compile(r"import JXGBoard from '\.\./core/JXGBoard';")
use_store_pattern = re.compile(r"const isHighlight = useMathStore\(\(state\) => state\.isHighlight\);")

new_import = "import JXGBoard from '../../components/core/JXGBoard';"
new_use_store = """  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as string[]).includes(id) : highlight === id;"""

# For the theorems, the path is actually also ../../components/core/JXGBoard because it's src/diagrams/Teoremas
# Wait, from src/diagrams/Teoremas to src/components/core is ../../components/core !

for file in files_to_fix:
    with open(file, 'r') as f:
        content = f.read()
    
    # Fix import
    content = content.replace("import JXGBoard from '../core/JXGBoard';", "import JXGBoard from '../../components/core/JXGBoard';")
    
    # Fix isHighlight
    old_use_store = "const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as string[]).includes(id) : highlight === id;"
    new_use_store_fixed = "const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;"
    content = content.replace(old_use_store, new_use_store_fixed)
    
    # Also fix 'React' unused import warning
    content = content.replace("import React from 'react';", "import React from 'react'; // eslint-disable-next-line")
    content = content.replace("import React, { useRef } from 'react';", "import React, { useRef } from 'react'; // eslint-disable-next-line")

    with open(file, 'w') as f:
        f.write(content)

print(f"Fixed {len(files_to_fix)} files.")
