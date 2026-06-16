import React, { useEffect, useState, useRef, useCallback } from 'react';
import { parseMDX, stringifyMDX } from '../../utils/mdxParser';
import Editor from '@monaco-editor/react';

interface FileNode {
  path: string;
  name: string;
  type: string;
}

/**
 * EditorPage
 *
 * Página principal del entorno de edición en vivo.
 * Permite seleccionar archivos MDX, separarlos en frontmatter, imports y cuerpo 
 * usando `mdxParser`, editarlos mediante Monaco Editor y previsualizar los
 * cambios en tiempo real en la mitad derecha de la pantalla.
 */
export const EditorPage: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  
  // Editor State
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [imports, setImports] = useState('');
  const [body, setBody] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Timer for draft preview
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [leftWidth, setLeftWidth] = useState(50); // percentage 10-90
  const isDragging = useRef(false);
  
  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'imports'>('content');
  const [searchQuery, setSearchQuery] = useState('');

  // Monaco Editor Ref
  const editorRef = useRef<unknown>(null);

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkSelection, setLinkSelection] = useState({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
  const [linkModalText, setLinkModalText] = useState('');
  const [linkTarget, setLinkTarget] = useState('');

  // Ref Modal State
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [refSelection, setRefSelection] = useState({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
  const [refText, setRefText] = useState('');
  const [refTarget, setRefTarget] = useState('');
  const [refColor, setRefColor] = useState('salvia');
  const availableColors = ['carbon', 'salvia', 'terracota', 'dorado', 'pizarra'];

  // Component Gallery State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [blocksModalOpen, setBlocksModalOpen] = useState(false);

  // New File Wizard State
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [wizardData, setWizardData] = useState({
    type: 'theorems',
    id: '',
    title: '',
    description: '',
    era: '',
    birth: '',
    death: '',
    color: 'terracota',
    authors: '',
    tags: '',
    corollaries: '',
    demos: '',
    parentTheorem: '',
    proofMethod: '',
    lemmas: ''
  });

  const getPreviewUrl = () => {
    if (!currentFile || (!metadata.id && currentFile.endsWith('.mdx'))) return '';
    if (currentFile.startsWith('content/theorems')) return `/teorema/${metadata.id}`;
    if (currentFile.startsWith('content/definitions')) return `/definicion/${metadata.id}`;
    if (currentFile.startsWith('content/lessons')) {
      const slug = currentFile.split('/').pop()?.replace('.mdx', '').replace(/Demo$/, '').toLowerCase();
      return `/${slug}`;
    }
    if (currentFile.startsWith('content/demonstrations')) return `/demo/${metadata.id}`;
    if (currentFile.startsWith('content/mathematicians')) {
      const slug = currentFile.split('/').pop()?.replace('.mdx', '').toLowerCase();
      return `/bio/${slug}`;
    }
    return '';
  };

  const loadFileList = async () => {
    try {
      const res = await fetch('/api/list-content');
      const data = await res.json();
      setFiles(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFileList();
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 10 && newWidth < 90) {
        setLeftWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      // Mantenemos los iframes clicables
      const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
      if (iframe) iframe.style.pointerEvents = 'auto';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const saveDraft = useCallback(async (meta: Record<string, unknown>, imp: string, bod: string, file: string) => {
    if (file === 'nuevo_archivo.mdx') return; // Don't preview unsaved new files easily
    try {
      const content = file.endsWith('.mdx') ? stringifyMDX(meta, imp, bod) : bod;
      await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file, content })
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const scheduleDraft = (newMeta: Record<string, unknown>, newImp: string, newBod: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (currentFile) saveDraft(newMeta, newImp, newBod, currentFile);
    }, 400); // Fast update for live preview without saving to disk
  };

  const openFile = async (path: string) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
      const text = await res.text();
      if (path.endsWith('.mdx')) {
        const parsed = parseMDX(text);
        setMetadata(parsed.metadata);
        setImports(parsed.imports);
        setBody(parsed.body);
      } else {
        // Plain text for tsx
        setMetadata({});
        setImports('');
        setBody(text);
      }
      setCurrentFile(path);
      // reload iframe to get latest changes properly
      const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
         iframe.contentWindow.location.reload();
      }
    } catch (e) {
      console.error(e);
      setMessage('Error cargando el archivo');
    }
    setLoading(false);
  };

  const handleNewFile = () => {
    setWizardData({
      type: 'theorems',
      id: '',
      title: '',
      description: '',
      era: '',
      birth: '',
      death: '',
      color: 'terracota',
      authors: '',
      tags: '',
      corollaries: '',
      demos: '',
      parentTheorem: '',
      proofMethod: '',
      lemmas: ''
    });
    setWizardModalOpen(true);
  };

  const confirmNewFile = async () => {
    if (!wizardData.id || !wizardData.title) {
        alert("ID y Título son obligatorios");
        return;
    }
    
    const path = `content/${wizardData.type}/${wizardData.id}.mdx`;
    let templateName = wizardData.type.slice(0, -1); // mathematicians -> mathematician
    if (wizardData.type === 'lessons') templateName = 'lesson';
    
    try {
      const res = await fetch(`/api/content?path=${encodeURIComponent(`templates/${templateName}.template.mdx`)}`);
      let templateText = await res.text();

      // Basic replacements
      templateText = templateText.replace(/\{\{ID\}\}/g, wizardData.id);
      templateText = templateText.replace(/\{\{TITLE\}\}/g, wizardData.title);
      templateText = templateText.replace(/\{\{FIRST_LETTER\}\}/g, wizardData.title.charAt(0));
      templateText = templateText.replace(/\{\{DESCRIPTION\}\}/g, wizardData.description);
      templateText = templateText.replace(/\{\{COLOR\}\}/g, wizardData.color);
      templateText = templateText.replace(/\{\{ERA\}\}/g, wizardData.era);
      templateText = templateText.replace(/\{\{BIRTH\}\}/g, wizardData.birth);
      templateText = templateText.replace(/\{\{DEATH\}\}/g, wizardData.death);

      const parsed = parseMDX(templateText);
      const meta = parsed.metadata;

      // Add dynamic fields
      const parseArray = (str: string) => str.split(',').map(s => s.trim()).filter(s => s);

      if (wizardData.type === 'theorems' || wizardData.type === 'definitions') {
        if (wizardData.authors) meta.authors = parseArray(wizardData.authors);
        if (wizardData.tags) meta.tags = parseArray(wizardData.tags);
        if (wizardData.corollaries) meta.corollaries = parseArray(wizardData.corollaries);
        if (wizardData.demos) meta.demos = parseArray(wizardData.demos);
      } else if (wizardData.type === 'demonstrations') {
        if (wizardData.parentTheorem) meta.parentTheorem = wizardData.parentTheorem;
        if (wizardData.proofMethod) meta.proofMethod = wizardData.proofMethod;
        if (wizardData.authors) meta.authors = parseArray(wizardData.authors);
        if (wizardData.tags) meta.tags = parseArray(wizardData.tags);
        if (wizardData.lemmas) meta.lemmas = parseArray(wizardData.lemmas);
      } else if (wizardData.type === 'lessons') {
        if (wizardData.tags) meta.tags = parseArray(wizardData.tags);
      }

      setCurrentFile(path);
      setMetadata(meta);
      setImports(parsed.imports);
      setBody(parsed.body);
      setMessage('¡Plantilla cargada!');
      setWizardModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Error cargando la plantilla');
    }
  };

  const handleSave = async () => {
    if (!currentFile) return;
    setSaving(true);
    setMessage('');
    try {
      // Si es "nuevo_archivo.mdx", preguntamos la ruta final
      let finalPath = currentFile;
      if (currentFile === 'nuevo_archivo.mdx') {
        const typeFolder = prompt('¿En qué carpeta? (theorems, lessons, mathematicians, demonstrations)', 'theorems');
        const fileName = prompt('Nombre del archivo (ej: mi_teorema.mdx)', metadata.id + '.mdx');
        if (!typeFolder || !fileName) {
          setSaving(false);
          return;
        }
        finalPath = `content/${typeFolder}/${fileName}`;
      }

      const content = finalPath.endsWith('.mdx') ? stringifyMDX(metadata, imports, body) : body;
      
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: finalPath, content })
      });
      
      if (res.ok) {
        setMessage('¡Guardado con éxito!');
        setCurrentFile(finalPath);
        loadFileList(); // recargar lista
        // reload iframe
        const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
           iframe.contentWindow.location.reload();
        }
      } else {
        setMessage('Error al guardar: ' + await res.text());
      }
    } catch (e: unknown) {
      console.error(e);
      setMessage('Error al guardar: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000); // clear message after 3s
    }
  };

  const updateMetadata = (key: string, value: unknown) => {
    const newMeta = { ...metadata, [key]: value };
    setMetadata(newMeta);
    scheduleDraft(newMeta, imports, body);
  };

  const updateBody = (newBody: string) => {
    setBody(newBody);
    scheduleDraft(metadata, imports, newBody);
  };

  const updateImports = (newImports: string) => {
    setImports(newImports);
    scheduleDraft(metadata, newImports, body);
  };

  const autoGenerateImports = () => {
    if (!currentFile || !currentFile.endsWith('.mdx')) return;
    const regex = /<([A-Z][a-zA-Z0-9]*)/g;
    const matches = Array.from(body.matchAll(regex)).map(m => m[1]);
    const uniqueTags = [...new Set(matches)];
    
    let currentImportsStr = imports;
    let added = 0;

    // Calculamos profundidad para saltar "content/theorems/..." -> "../../"
    const parts = currentFile.split('/');
    const depth = parts.length - 1;
    const backPath = Array(depth).fill('..').join('/');

    for (const tag of uniqueTags) {
      // Ignorar componentes nativos/estándar o ya importados
      if (currentImportsStr.includes(tag)) continue;
      
      const componentFile = files.find(f => f.name === `${tag}.tsx`);
      if (componentFile) {
        // componentFile.path is e.g. "diagrams/Pitagoras/PitagorasDemo.tsx"
        // remove extension
        const importPath = componentFile.path.replace('.tsx', '');
        const statement = `import { ${tag} } from '${backPath}/${importPath}';`;
        if (!currentImportsStr.includes(statement)) {
          currentImportsStr += (currentImportsStr ? '\n' : '') + statement;
          added++;
        }
      }
    }

    if (added > 0) {
      updateImports(currentImportsStr);
      setMessage(`Se auto-importaron ${added} componentes.`);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configurar scroll sync si es necesario en el futuro
    editor.onDidScrollChange(() => {
      const scrollHeight = editor.getScrollHeight();
      const scrollTop = editor.getScrollTop();
      const height = editor.getLayoutInfo().height;
      const percentage = scrollTop / (scrollHeight - height);
      
      const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'scroll', percentage }, '*');
      }
    });
  };

  const insertAtCursor = (text: string) => {
    const editor = editorRef.current as any;
    if (!editor) return;
    const selection = editor.getSelection();
    editor.executeEdits('', [{
      range: selection,
      text: text,
      forceMoveMarkers: true
    }]);
    editor.focus();
  };

  const wrapSelectedText = (prefix: string, suffix: string) => {
    const editor = editorRef.current as any;
    if (!editor) return;
    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    editor.executeEdits('', [{
      range: selection,
      text: prefix + text + suffix,
      forceMoveMarkers: true
    }]);
    editor.focus();
  };

  const openLinkModal = () => {
    const editor = editorRef.current as any;
    if (!editor) return;
    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    setLinkSelection(selection); // Guardo la seleccion de Monaco
    setLinkModalText(text);
    setLinkModalOpen(true);
    setLinkTarget('');
  };

  const applyLink = () => {
    if (!linkTarget || !editorRef.current) return;
    const editor = editorRef.current as any;
    const linkText = linkModalText || 'enlace';
    const insertion = `[${linkText}](${linkTarget})`;
    
    editor.executeEdits('', [{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      range: linkSelection as any,
      text: insertion,
      forceMoveMarkers: true
    }]);
    
    setLinkModalOpen(false);
    editor.focus();
  };

  const insertBlock = (type: string) => {
    let block = '';
    switch (type) {
      case 'caja-formula':
        block = `\n<Formula>\n  $$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$\n</Formula>\n`;
        break;
      case 'caja-nota':
        block = `\n<Nota>\n  Añade aquí una aclaración histórica o curiosidad.\n</Nota>\n`;
        break;
      case 'caja-demostracion':
        block = `\n<Demostracion>\n  Escribe aquí los pasos de la demostración lógica.\n</Demostracion>\n`;
        break;
      case 'medieval-step':
        block = `\n<MedievalStep number={1} title="Título del Paso" />\n`;
        break;
      case 'caja-definicion':
        block = `\n<Definicion title="Nueva Definición">\n  Explica el concepto formalmente aquí.\n</Definicion>\n`;
        break;
      case 'caja-corolario':
        block = `\n<Corolario>\n  Consecuencia directa del teorema anterior.\n</Corolario>\n`;
        break;
      case 'cita':
        block = `\n<Cita author="Pitágoras">\n  Todo es número.\n</Cita>\n`;
        break;
      case 'separador':
        block = `\n<Separador />\n`;
        break;
      case 'capitular':
        block = `\n<Capitular letra="E" />n un lugar de la Mancha...\n`;
        break;
      case 'lista':
        block = `\n- Elemento 1\n- Elemento 2\n- Elemento 3\n`;
        break;
    }
    if (block) insertAtCursor(block);
  };

  const openRefModal = () => {
    const editor = editorRef.current as any;
    if (!editor) return;
    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    setRefSelection(selection);
    setRefText(text);
    setRefModalOpen(true);
    setRefTarget('');
  };

  const applyRef = () => {
    if (!refTarget || !editorRef.current) return;
    const editor = editorRef.current as any;
    const insertion = `<InteractiveElement target="${refTarget}" color="${refColor}">${refText}</InteractiveElement>`;
    
    editor.executeEdits('', [{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      range: refSelection as any,
      text: insertion,
      forceMoveMarkers: true
    }]);
    
    setRefModalOpen(false);
    editor.focus();
  };

  const insertLatex = (type: string) => {
    let latex = '';
    switch(type) {
      case 'frac': latex = '\\frac{numerador}{denominador}'; break;
      case 'sqrt': latex = '\\sqrt{x}'; break;
      case 'int': latex = '\\int_{a}^{b} x \\, dx'; break;
      case 'sum': latex = '\\sum_{i=1}^{n} i'; break;
      case 'lim': latex = '\\lim_{x \\to \\infty} f(x)'; break;
      case 'alpha': latex = '\\alpha'; break;
      case 'beta': latex = '\\beta'; break;
      case 'gamma': latex = '\\gamma'; break;
      case 'theta': latex = '\\theta'; break;
      case 'pi': latex = '\\pi'; break;
    }
    if (latex) insertAtCursor(latex);
  };

  const insertComponent = (componentName: string) => {
    insertAtCursor(`\n<${componentName} />\n`);
    setGalleryModalOpen(false);
  };

  const getLinkOptions = () => {
    return files
      .filter(f => ['content'].includes(f.path.split('/')[0]) && ['theorems', 'lessons', 'demonstrations', 'mathematicians'].includes(f.type))
      .map(f => {
        const id = f.name.replace('.mdx', '');
        let url = '';
        if (f.type === 'theorems') url = `/teorema/${id}`;
        else if (f.type === 'lessons') url = `/${id}`;
        else if (f.type === 'demonstrations') url = `/demo/${id}`;
        else if (f.type === 'mathematicians') url = `/bio/${id.toLowerCase()}`;
        return { label: `${f.type} - ${id}`, url };
      });
  };

  const addNewField = () => {
    const key = prompt('Nombre del nuevo campo (ej. color, tags):');
    if (!key) return;
    const isArray = confirm('¿Es una lista (array)? (Aceptar=Sí, Cancelar=No)');
    updateMetadata(key, isArray ? [] : '');
  };

  const removeField = (key: string) => {
    if (confirm(`¿Eliminar el campo "${key}"?`)) {
      const newMeta = { ...metadata };
      delete newMeta[key];
      setMetadata(newMeta);
    }
  };

  return (
    <div className="flex h-screen bg-lienzo text-carbon font-sans overflow-hidden">
      {/* Sidebar: File Explorer */}
      <div 
        className={`bg-white/50 flex flex-col h-full transition-all duration-300 overflow-hidden shrink-0 relative ${isSidebarOpen ? 'w-64 border-r border-carbon/20' : 'w-0 border-r-0'}`}
        style={{ opacity: isSidebarOpen ? 1 : 0 }}
      >
        <div className="p-4 border-b border-carbon/10 flex justify-between items-center sticky top-0 bg-white/90">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-lg whitespace-nowrap">Archivos</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-carbon/40 hover:text-carbon/80 text-xs px-1"
              title="Ocultar panel"
            >
              ◀
            </button>
          </div>
          <button 
            onClick={handleNewFile}
            className="text-xs bg-salvia text-white px-2 py-1 rounded hover:bg-salvia/80 flex-shrink-0"
          >
            + Nuevo
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-carbon/10 bg-white/50 sticky top-[65px] z-10 backdrop-blur-sm">
          <input 
            type="text"
            placeholder="Buscar fichero..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm p-2 bg-carbon/5 border border-transparent focus:border-carbon/20 rounded focus:outline-none transition-colors"
          />
        </div>
        
        <div className="p-4 flex-1 whitespace-nowrap overflow-y-auto overflow-x-hidden">
          {['theorems', 'definitions', 'lessons', 'demonstrations', 'mathematicians', 'diagrams', 'components'].map(type => {
            const typeFiles = files.filter(f => f.type === type && f.name.toLowerCase().includes(searchQuery.toLowerCase()));
            if (typeFiles.length === 0 && type !== 'definitions') return null;
            return (
              <div key={type} className="mb-4">
                <h3 className="text-xs uppercase tracking-widest text-carbon/50 font-bold mb-2">{type}</h3>
                <ul className="space-y-1">
                  {typeFiles.map(f => (
                    <li key={f.path}>
                      <button 
                        onClick={() => openFile(f.path)}
                        className={`text-sm w-full text-left px-2 py-1 rounded truncate transition-colors ${currentFile === f.path ? 'bg-carbon/10 font-bold' : 'hover:bg-carbon/5'}`}
                        title={f.path}
                      >
                        {f.name}
                      </button>
                    </li>
                  ))}
                  {typeFiles.length === 0 && <li className="text-xs text-carbon/30 italic px-2">Vacío</li>}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Area: Editor */}
      <div className="flex-1 flex flex-col h-full bg-lienzo relative overflow-y-auto">
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white border border-carbon/20 border-l-0 rounded-r py-4 px-1 text-carbon/50 hover:text-carbon hover:bg-carbon/5 shadow-sm"
            title="Mostrar archivos"
          >
            ▶
          </button>
        )}
        {loading ? (
          <div className="flex-1 flex items-center justify-center italic text-carbon/50">Cargando archivo...</div>
        ) : !currentFile ? (
          <div className="flex-1 flex items-center justify-center font-serif text-carbon/40 text-xl">Selecciona o crea un archivo</div>
        ) : (
          <div className="flex-1 flex w-full overflow-hidden relative">
          <div 
            className="flex flex-col h-full p-8 overflow-y-auto" 
            style={{ width: `${leftWidth}%` }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-serif font-bold">{currentFile}</h1>
                {message && <span className="text-salvia text-sm font-bold ml-2">{message}</span>}
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-carbon text-white px-6 py-2 tracking-widest uppercase text-sm hover:bg-carbon/80 disabled:opacity-50 transition-colors shrink-0"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>

            {/* Tabs for MDX files */}
            {currentFile.endsWith('.mdx') && (
              <div className="flex gap-4 border-b border-carbon/10 mb-4">
                <button onClick={() => setActiveTab('content')} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'content' ? 'border-b-2 border-carbon text-carbon' : 'text-carbon/40 hover:text-carbon/80'}`}>Contenido</button>
                <button onClick={() => setActiveTab('metadata')} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'metadata' ? 'border-b-2 border-carbon text-carbon' : 'text-carbon/40 hover:text-carbon/80'}`}>Metadatos</button>
                <button onClick={() => setActiveTab('imports')} className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'imports' ? 'border-b-2 border-carbon text-carbon' : 'text-carbon/40 hover:text-carbon/80'}`}>Imports</button>
              </div>
            )}

            {currentFile.endsWith('.mdx') && activeTab === 'metadata' && (
              <div className="bg-white p-6 border border-carbon/10 rounded shadow-sm overflow-y-auto flex-1">
                <div className="flex justify-between items-center border-b border-carbon/10 pb-2 mb-4">
                  <h3 className="font-serif font-bold text-lg">Metadatos</h3>
                  <button onClick={addNewField} className="text-xs bg-carbon/10 hover:bg-carbon/20 px-2 py-1 rounded transition-colors">+ Añadir</button>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(metadata).map(([key, value]) => {
                    const isArray = Array.isArray(value);
                    return (
                      <div key={key} className="relative group">
                        <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">{key}</label>
                        <button 
                          onClick={() => removeField(key)}
                          className="absolute right-0 top-0 text-salvia opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                          title="Eliminar campo"
                        >
                          ✕
                        </button>
                        {isArray ? (
                          <input 
                            type="text"
                            placeholder="Valores separados por coma..."
                            className="w-full bg-carbon/5 p-2 text-sm border border-transparent focus:border-carbon/30 rounded focus:outline-none transition-colors"
                            value={(value as string[]).join(', ')}
                            onChange={(e) => {
                              const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              updateMetadata(key, arr.length === 0 && e.target.value.includes(',') ? [''] : arr);
                            }}
                          />
                        ) : (
                          <input 
                            type="text"
                            className="w-full bg-carbon/5 p-2 text-sm border border-transparent focus:border-carbon/30 rounded focus:outline-none transition-colors"
                            value={value as string || ''}
                            onChange={(e) => updateMetadata(key, e.target.value)}
                          />
                        )}
                        {isArray && <p className="text-[10px] text-carbon/40 mt-1">Valores separados por coma (,)</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentFile.endsWith('.mdx') && activeTab === 'imports' && (
              <div className="bg-white p-6 border border-carbon/10 rounded shadow-sm flex flex-col flex-1">
                <div className="flex justify-between items-center border-b border-carbon/10 pb-2 mb-4">
                  <h3 className="font-serif font-bold text-lg">Imports (Componentes)</h3>
                  <button 
                    onClick={autoGenerateImports}
                    className="text-xs bg-salvia text-white px-2 py-1 rounded hover:bg-salvia/80"
                  >
                    ⚡ Escanear Imports
                  </button>
                </div>
                <textarea
                  className="w-full flex-1 bg-carbon/5 p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-carbon border-none rounded"
                  value={imports}
                  onChange={(e) => updateImports(e.target.value)}
                  placeholder="import { Component } from '../../...';"
                />
              </div>
            )}

            {/* Markdown Body */}
            {currentFile.endsWith('.mdx') && activeTab === 'content' && (
              <div className="flex-1 bg-white border border-carbon/10 rounded shadow-sm flex flex-col overflow-hidden">
                <div className="bg-carbon/5 border-b border-carbon/10 p-2 flex flex-wrap gap-2 items-center shrink-0">
                    {/* Botones de Estilo de Texto */}
                    <div className="flex gap-1 border-r border-carbon/10 pr-2 mr-1">
                      <button onClick={() => wrapSelectedText('**', '**')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded font-bold" title="Negrita (Cmd+B)">B</button>
                      <button onClick={() => wrapSelectedText('*', '*')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded italic" title="Cursiva (Cmd+I)">I</button>
                      <button onClick={() => wrapSelectedText('### ', '')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded font-bold" title="Título (H3)">H3</button>
                    </div>
                    {/* Botones Matemáticos y Snippets */}
                    <div className="flex gap-1 border-r border-carbon/10 pr-2 mr-1 items-center">
                      <button onClick={() => wrapSelectedText('$', '$')} className="text-xs font-serif bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-1 rounded" title="Fórmula Inline">$x$</button>
                      <button onClick={() => wrapSelectedText('\n$$\n', '\n$$\n')} className="text-xs font-serif bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-1 rounded" title="Fórmula en Bloque">$$...$$</button>
                      <select 
                        className="text-xs bg-carbon/5 border-none p-1 rounded font-serif text-salvia cursor-pointer hover:bg-carbon/10 ml-1"
                        onChange={(e) => {
                          insertLatex(e.target.value);
                          e.target.value = '';
                        }}
                      >
                        <option value="">+ LaTeX</option>
                        <option value="frac">Fracción (a/b)</option>
                        <option value="sqrt">Raíz (√)</option>
                        <option value="int">Integral (∫)</option>
                        <option value="sum">Sumatorio (Σ)</option>
                        <option value="lim">Límite (lim)</option>
                        <option disabled>──────</option>
                        <option value="alpha">α (Alpha)</option>
                        <option value="beta">β (Beta)</option>
                        <option value="gamma">γ (Gamma)</option>
                        <option value="theta">θ (Theta)</option>
                        <option value="pi">π (Pi)</option>
                      </select>
                    </div>
                    {/* Elementos Especiales */}
                    <button 
                      onClick={() => setBlocksModalOpen(true)}
                      className="text-xs bg-carbon/5 font-bold hover:bg-carbon/10 px-2 py-1 rounded"
                    >
                      + Bloque
                    </button>
                    
                    <button 
                      onClick={() => setGalleryModalOpen(true)}
                      className="text-xs bg-salvia/20 text-salvia font-bold hover:bg-salvia/30 px-2 py-1 rounded flex items-center gap-1 ml-auto"
                    >
                      🧩 Galería
                    </button>
                    
                    <button 
                      onClick={openRefModal}
                      className="text-xs bg-terracota/10 text-terracota hover:bg-terracota/20 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-terracota inline-block"></span> Ref
                    </button>
                    <button 
                      onClick={openLinkModal}
                      className="text-xs bg-carbon/10 hover:bg-carbon/20 px-2 py-1 rounded"
                    >
                      + Enlace
                    </button>
                  </div>
                <div className="flex-1 w-full relative">
                  <Editor
                    height="100%"
                    language="markdown"
                    value={body}
                    onChange={(val) => updateBody(val || '')}
                    onMount={handleEditorDidMount}
                    theme="vs-light"
                    options={{
                      minimap: { enabled: true },
                      wordWrap: 'on',
                      fontSize: 14,
                      fontFamily: "'Fira Code', 'Courier New', monospace",
                      lineHeight: 24,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      renderWhitespace: 'none',
                    }}
                  />
                </div>
              </div>
            )}
            
            {!currentFile.endsWith('.mdx') && (
              <div className="flex-1 bg-carbon/90 text-white rounded shadow-sm flex flex-col overflow-hidden">
                <textarea
                  className="w-full flex-1 p-6 font-mono text-sm focus:outline-none resize-none bg-transparent"
                  value={body}
                  onChange={(e) => updateBody(e.target.value)}
                  placeholder="Edita el código..."
                />
              </div>
            )}
          </div>
          
          {/* Resizer Handle */}
          <div 
            className="w-1.5 bg-carbon/10 hover:bg-salvia cursor-col-resize z-20 transition-colors flex flex-col justify-center items-center"
            onMouseDown={() => {
              isDragging.current = true;
              document.body.style.cursor = 'col-resize';
              // Prevenir que el iframe capture los eventos del ratón durante el drag
              const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
              if (iframe) iframe.style.pointerEvents = 'none';
            }}
          >
            <div className="h-8 w-1 bg-carbon/30 rounded-full"></div>
          </div>

          {/* Live Preview Iframe */}
          <div 
            className="border-l border-carbon/20 bg-white relative flex-1"
            style={{ width: `${100 - leftWidth}%` }}
          >
            <div className="absolute top-0 left-0 w-full bg-carbon/5 border-b border-carbon/10 p-2 text-xs text-carbon/50 font-mono text-center z-10 flex justify-between px-4">
              <span>Live Preview</span>
              <span>{getPreviewUrl()}</span>
            </div>
            {getPreviewUrl() ? (
              <iframe 
                id="preview-iframe"
                src={getPreviewUrl()} 
                className="w-full h-full pt-8"
                title="Live Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full italic text-carbon/40">Sin previsualización</div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Link Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h3 className="text-xl font-serif font-bold mb-4">Insertar Enlace</h3>
            
            <label className="block text-sm font-bold mb-1 mt-4">Texto del enlace:</label>
            <input 
              type="text"
              className="w-full p-2 border border-carbon/20 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-carbon"
              value={linkModalText}
              onChange={(e) => setLinkModalText(e.target.value)}
              placeholder="Texto visible"
            />
            
            <label className="block text-sm font-bold mb-1 mt-4">Destino (Ruta):</label>
            <select 
              className="w-full p-2 border border-carbon/20 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-carbon"
              value={linkTarget}
              onChange={(e) => setLinkTarget(e.target.value)}
            >
              <option value="">-- Selecciona una página --</option>
              {getLinkOptions().map(opt => (
                <option key={opt.url} value={opt.url}>{opt.label}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 text-sm text-carbon hover:bg-carbon/5 rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={applyLink}
                disabled={!linkTarget}
                className="px-4 py-2 text-sm bg-carbon text-white rounded hover:bg-carbon/80 disabled:opacity-50"
              >
                Insertar Enlace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reference Modal */}
      {refModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h3 className="text-xl font-serif font-bold mb-4">Añadir Referencia Interactiva</h3>
            <p className="text-xs text-carbon/60 mb-4">Esta etiqueta resalta elementos en el texto que se sincronizan con los diagramas interactivos.</p>
            
            <label className="block text-sm font-bold mb-1 mt-4">Texto a mostrar:</label>
            <input 
              type="text"
              className="w-full p-2 border border-carbon/20 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-carbon"
              value={refText}
              onChange={(e) => setRefText(e.target.value)}
              placeholder="Ej: **$c$**, hipotenusa..."
            />
            
            <label className="block text-sm font-bold mb-1 mt-4">ID del elemento (Target):</label>
            <input 
              type="text"
              className="w-full p-2 border border-carbon/20 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-carbon font-mono"
              value={refTarget}
              onChange={(e) => setRefTarget(e.target.value)}
              placeholder="Ej: ladoC, puntoA"
            />
            
            <label className="block text-sm font-bold mb-1 mt-4">Color de Resalte:</label>
            <div className="flex gap-2 mb-2">
              {availableColors.map(c => (
                <button
                  key={c}
                  onClick={() => setRefColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${refColor === c ? 'border-carbon scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: `var(--color-${c})` }}
                  title={c}
                />
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setRefModalOpen(false)}
                className="px-4 py-2 text-sm text-carbon hover:bg-carbon/5 rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={applyRef}
                disabled={!refTarget || !refText}
                className="px-4 py-2 text-sm bg-terracota text-white rounded hover:bg-terracota/80 disabled:opacity-50"
              >
                Añadir Referencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Component Gallery Modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-carbon/10 flex justify-between items-center bg-white/90 sticky top-0 rounded-t-lg">
              <div>
                <h3 className="text-2xl font-serif font-bold">Galería de Componentes</h3>
                <p className="text-sm text-carbon/60">Haz clic en un componente para insertarlo en el editor.</p>
              </div>
              <button onClick={() => setGalleryModalOpen(false)} className="text-carbon/50 hover:text-carbon text-2xl font-bold">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-carbon/5">
              {['diagrams', 'components'].map(type => {
                const compFiles = files.filter(f => f.type === type && f.name.endsWith('.tsx'));
                if (compFiles.length === 0) return null;
                return (
                  <div key={type} className="mb-8">
                    <h4 className="text-lg font-bold font-serif mb-4 capitalize">{type}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {compFiles.map(f => {
                        const name = f.name.replace('.tsx', '');
                        return (
                          <button
                            key={f.path}
                            onClick={() => insertComponent(name)}
                            className="bg-white p-4 rounded shadow-sm border border-carbon/10 hover:border-salvia hover:shadow-md transition-all text-left flex flex-col items-start group"
                          >
                            <span className="font-mono text-salvia font-bold text-sm mb-2 group-hover:underline">{`<${name} />`}</span>
                            <span className="text-xs text-carbon/50 truncate w-full">{f.path}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Blocks Gallery Modal */}
      {blocksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-carbon/10 flex justify-between items-center bg-white/90 sticky top-0 rounded-t-lg">
              <div>
                <h3 className="text-2xl font-serif font-bold">Galería de Bloques Semánticos</h3>
                <p className="text-sm text-carbon/60">Haz clic en un bloque para insertarlo en tu documento.</p>
              </div>
              <button onClick={() => setBlocksModalOpen(false)} className="text-carbon/50 hover:text-carbon text-2xl font-bold">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-carbon/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <button onClick={() => { insertBlock('caja-formula'); setBlocksModalOpen(false); }} className="text-left group">
                  <div className="mb-2 text-sm font-mono text-terracota group-hover:underline">&lt;Formula&gt;</div>
                  <div className="pointer-events-none my-4 py-4 px-4 w-full flex flex-col items-center justify-center gap-2 text-lg font-serif border border-carbon/20 bg-carbon/[0.02]">
                    <span className="text-sm italic text-carbon/60">Texto explicativo</span>
                    {"$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$"}
                  </div>
                </button>

                <button onClick={() => { insertBlock('caja-definicion'); setBlocksModalOpen(false); }} className="text-left group">
                  <div className="mb-2 text-sm font-mono text-carbon group-hover:underline">&lt;Definicion&gt;</div>
                  <div className="pointer-events-none my-4 py-4 border-t-4 border-b border-carbon/90 font-serif">
                    <div className="font-bold text-carbon tracking-widest uppercase text-xs mb-2">Definición</div>
                    <div className="italic text-carbon/90 text-sm">Un concepto formal expuesto con claridad y rigor.</div>
                  </div>
                </button>

                <button onClick={() => { insertBlock('caja-demostracion'); setBlocksModalOpen(false); }} className="text-left group">
                  <div className="mb-2 text-sm font-mono text-carbon/50 group-hover:underline">&lt;Demostracion&gt;</div>
                  <div className="pointer-events-none my-4 pl-6 font-serif text-sm text-carbon/90">
                    <span className="italic font-bold mr-2">Demostración.</span>
                    Pasos lógicos expuestos con rigor...
                    <div className="text-right mt-2 text-carbon font-bold">$\blacksquare$</div>
                  </div>
                </button>

                <button onClick={() => { insertBlock('caja-nota'); setBlocksModalOpen(false); }} className="text-left group">
                  <div className="mb-2 text-sm font-mono text-carbon group-hover:underline">&lt;Nota&gt;</div>
                  <div className="pointer-events-none my-4 pl-4 border-l-[1px] border-carbon/30 font-serif text-xs text-carbon/70">
                    <span className="font-bold uppercase tracking-wider mr-2">Nota.</span>
                    Aclaración histórica o corolario menor.
                  </div>
                </button>

                <button onClick={() => { insertBlock('caja-corolario'); setBlocksModalOpen(false); }} className="text-left group">
                  <div className="mb-2 text-sm font-mono text-carbon group-hover:underline">&lt;Corolario&gt;</div>
                  <div className="pointer-events-none my-4 py-4 border-t-2 border-b border-carbon/70 font-serif">
                    <div className="font-bold text-carbon/80 tracking-widest uppercase text-xs mb-2">Corolario</div>
                    <div className="text-carbon/90 text-sm">Consecuencia directa del teorema anterior.</div>
                  </div>
                </button>

                <button onClick={() => { insertBlock('cita'); setBlocksModalOpen(false); }} className="text-left group">
                  <div className="mb-2 text-sm font-mono text-carbon/50 group-hover:underline">&lt;Cita&gt;</div>
                  <blockquote className="pointer-events-none my-4 mx-8 font-serif italic text-sm text-carbon/80 text-center leading-relaxed">
                    Todo es número.<br/>
                    <div className="text-xs font-bold mt-2 not-italic font-sans text-carbon/60 uppercase tracking-widest">— Pitágoras</div>
                  </blockquote>
                </button>

                <button onClick={() => { insertBlock('medieval-step'); setBlocksModalOpen(false); }} className="text-left group">
                  <div className="mb-2 text-sm font-mono text-terracota group-hover:underline">&lt;MedievalStep&gt;</div>
                  <div className="pointer-events-none flex items-center gap-4 my-4 scale-75 origin-left">
                    <div className="relative w-20 h-20 flex items-center justify-center border border-carbon rounded-sm bg-[#FDFBF7] overflow-hidden">
                      <span className="font-serif italic font-bold text-4xl text-terracota z-10">1</span>
                    </div>
                    <h3 className="text-2xl font-serif text-carbon m-0 border-b-2 border-carbon/20 pb-1 italic">Título del Paso</h3>
                  </div>
                </button>

                <button onClick={() => { insertBlock('separador'); setBlocksModalOpen(false); }} className="text-left group flex flex-col justify-center">
                  <div className="mb-2 text-sm font-mono text-carbon/50 group-hover:underline">&lt;Separador /&gt;</div>
                  <div className="pointer-events-none flex justify-center items-center my-4 opacity-40">
                    <div className="w-12 border-t border-carbon"></div>
                    <div className="mx-2 text-carbon text-[10px]">♦</div>
                    <div className="w-12 border-t border-carbon"></div>
                  </div>
                </button>

                <button onClick={() => { insertBlock('capitular'); setBlocksModalOpen(false); }} className="text-left group">
                  <div className="mb-2 text-sm font-mono text-terracota group-hover:underline">&lt;Capitular&gt;</div>
                  <div className="pointer-events-none font-serif text-sm">
                    <span className="float-left text-3xl text-terracota font-bold pr-1 leading-none mt-1">E</span>n un lugar...
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* New File Wizard Modal */}
      {wizardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-carbon/10 bg-white/90 shrink-0">
              <h3 className="text-2xl font-serif font-bold text-carbon">Nuevo Documento</h3>
              <p className="text-sm text-carbon/60 mt-1">Configura la estructura inicial de tu página.</p>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 bg-carbon/5 flex-1">
              <div>
                <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Tipo de Documento</label>
                <select 
                  className="w-full bg-white p-2 border border-carbon/20 rounded focus:outline-none focus:border-salvia"
                  value={wizardData.type}
                  onChange={(e) => setWizardData({...wizardData, type: e.target.value})}
                >
                  <option value="theorems">Teorema</option>
                  <option value="definitions">Definición</option>
                  <option value="lessons">Lección</option>
                  <option value="demonstrations">Demostración</option>
                  <option value="mathematicians">Biografía (Matemático)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">ID (slug del archivo) *</label>
                <input 
                  type="text"
                  placeholder="ej: mi-nuevo-teorema"
                  className="w-full bg-white p-2 border border-carbon/20 rounded focus:outline-none focus:border-salvia"
                  value={wizardData.id}
                  onChange={(e) => setWizardData({...wizardData, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Título *</label>
                <input 
                  type="text"
                  placeholder="ej: Teorema de Tales"
                  className="w-full bg-white p-2 border border-carbon/20 rounded focus:outline-none focus:border-salvia"
                  value={wizardData.title}
                  onChange={(e) => setWizardData({...wizardData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Breve Descripción</label>
                <textarea 
                  className="w-full bg-white p-2 border border-carbon/20 rounded focus:outline-none focus:border-salvia resize-none h-20"
                  value={wizardData.description}
                  onChange={(e) => setWizardData({...wizardData, description: e.target.value})}
                />
              </div>

              {/* DYNAMIC FIELDS based on type */}
              <div className="border-t border-carbon/10 pt-4 mt-4">
                <h4 className="text-xs uppercase tracking-widest text-carbon/50 font-bold mb-4">Campos Opcionales</h4>
                
                {wizardData.type === 'mathematicians' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Época (Era)</label>
                      <input type="text" placeholder="ej: 300 a.C." className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.era} onChange={(e) => setWizardData({...wizardData, era: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Nacimiento</label>
                      <input type="text" placeholder="ej: c. 325 a.C., Alejandría" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.birth} onChange={(e) => setWizardData({...wizardData, birth: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Fallecimiento</label>
                      <input type="text" placeholder="ej: c. 265 a.C." className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.death} onChange={(e) => setWizardData({...wizardData, death: e.target.value})} />
                    </div>
                  </div>
                )}

                {(wizardData.type === 'theorems' || wizardData.type === 'definitions') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Color Temático</label>
                      <select className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.color} onChange={(e) => setWizardData({...wizardData, color: e.target.value})}>
                        <option value="terracota">Terracota (Teoremas, Default)</option>
                        <option value="salvia">Salvia (Lógica, Análisis)</option>
                        <option value="dorado">Dorado (Corolarios, Especial)</option>
                        <option value="carbon">Carbón (Definiciones)</option>
                        <option value="pizarra">Pizarra (Auxiliar)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Autores (separados por coma)</label>
                      <input type="text" placeholder="ej: euclides, pitagoras" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.authors} onChange={(e) => setWizardData({...wizardData, authors: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Tags (separados por coma)</label>
                      <input type="text" placeholder="ej: geometria, aritmetica" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.tags} onChange={(e) => setWizardData({...wizardData, tags: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Corolarios</label>
                        <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.corollaries} onChange={(e) => setWizardData({...wizardData, corollaries: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Demostraciones (IDs)</label>
                        <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.demos} onChange={(e) => setWizardData({...wizardData, demos: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {wizardData.type === 'demonstrations' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Teorema Padre (ID)</label>
                        <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.parentTheorem} onChange={(e) => setWizardData({...wizardData, parentTheorem: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Método de Prueba</label>
                        <select className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.proofMethod} onChange={(e) => setWizardData({...wizardData, proofMethod: e.target.value})}>
                          <option value="">Selecciona Método...</option>
                          <option value="directo">Directo</option>
                          <option value="contradiccion">Por Contradicción</option>
                          <option value="induccion">Inducción</option>
                          <option value="contraposicion">Contraposición</option>
                          <option value="visual">Visual / Geométrica</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Lemas (separados por coma)</label>
                      <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.lemmas} onChange={(e) => setWizardData({...wizardData, lemmas: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Autores (separados por coma)</label>
                      <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.authors} onChange={(e) => setWizardData({...wizardData, authors: e.target.value})} />
                    </div>
                  </div>
                )}

                {wizardData.type === 'lessons' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Tags (separados por coma)</label>
                      <input type="text" placeholder="ej: algebra, logica" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.tags} onChange={(e) => setWizardData({...wizardData, tags: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-carbon/10 flex justify-end gap-2">
              <button onClick={() => setWizardModalOpen(false)} className="px-4 py-2 text-carbon/60 hover:text-carbon font-bold text-sm">Cancelar</button>
              <button onClick={confirmNewFile} className="px-6 py-2 bg-salvia text-white rounded font-bold text-sm hover:bg-salvia/80 shadow-md">Crear Plantilla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
