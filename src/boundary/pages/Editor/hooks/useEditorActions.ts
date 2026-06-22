import { useCallback } from 'react';
import { parseMDX, stringifyMDX } from '@/controller/lib/mdxParser';
import type { FileNode, WizardData } from '@/boundary/pages/Editor/hooks/useEditorState';

// ─── Helpers: template + metadata ─────────────────────────────────────────

function applyTemplateReplacements(template: string, w: WizardData): string {
  return template
    .replace(/\{\{ID\}\}/g, w.id)
    .replace(/\{\{TITLE\}\}/g, w.title)
    .replace(/\{\{FIRST_LETTER\}\}/g, w.title.charAt(0))
    .replace(/\{\{DESCRIPTION\}\}/g, w.description)
    .replace(/\{\{COLOR\}\}/g, w.color)
    .replace(/\{\{ERA\}\}/g, w.era)
    .replace(/\{\{BIRTH\}\}/g, w.birth)
    .replace(/\{\{DEATH\}\}/g, w.death);
}

function parseCSV(str: string): string[] {
  return str.split(',').map(s => s.trim()).filter(s => s);
}

const COMMON_FIELDS = ['authors', 'tags'] as const;

function applyFieldIfPresent(meta: Record<string, unknown>, w: WizardData, field: string): void {
  const value = (w as unknown as Record<string, unknown>)[field];
  if (value) meta[field] = parseCSV(String(value));
}

function applyTypeSpecificMetadata(w: WizardData, meta: Record<string, unknown>): void {
  const typeHandlers: Record<string, () => void> = {
    theorems: () => {
      for (const f of [...COMMON_FIELDS, 'corollaries', 'demos'] as const) {
        applyFieldIfPresent(meta, w, f);
      }
    },
    definitions: () => {
      for (const f of COMMON_FIELDS) applyFieldIfPresent(meta, w, f);
    },
    demonstrations: () => {
      if (w.parentTheorem) meta.parentTheorem = w.parentTheorem;
      if (w.proofMethod) meta.proofMethod = w.proofMethod;
      for (const f of COMMON_FIELDS) applyFieldIfPresent(meta, w, f);
      if (w.lemmas) meta.lemmas = parseCSV(String(w.lemmas));
    },
    lessons: () => {
      if (w.tags) meta.tags = parseCSV(String(w.tags));
    },
    models: () => {
      if (w.satisfies) meta.satisfies = w.satisfies;
      if (w.axioms_verified) meta.axioms_verified = parseCSV(String(w.axioms_verified));
      if (w.hasDiagram) meta.hasDiagram = w.hasDiagram;
    },
  };
  typeHandlers[w.type]?.();
}

interface EditorActionsProps {
  files: FileNode[];
  currentFile: string | null;
  metadata: Record<string, unknown>;
  imports: string;
  body: string;
  editorRef: React.MutableRefObject<unknown>;
  linkSelection: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number };
  refSelection: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number };
  setCurrentFile: (path: string | null) => void;
  setMetadata: (meta: Record<string, unknown>) => void;
  setImports: (imp: string) => void;
  setBody: (body: string) => void;
  setMessage: (msg: string) => void;
  setSaving: (s: boolean) => void;
  setLinkModalOpen: (o: boolean) => void;
  setLinkModalText: (t: string) => void;
  setLinkTarget: (t: string) => void;
  setLinkSelection: (s: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number }) => void;
  setRefModalOpen: (o: boolean) => void;
  setRefText: (t: string) => void;
  setRefTarget: (t: string) => void;
  setRefSelection: (s: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number }) => void;
  setWizardModalOpen: (o: boolean) => void;
  loadFileList: () => Promise<void>;
  updateImports: (imp: string) => void;
}

export const useEditorActions = ({
  files, currentFile, metadata, imports, body, editorRef,
  linkSelection, refSelection,
  setCurrentFile, setMetadata, setImports, setBody,
  setMessage, setSaving,
  setLinkModalOpen, setLinkModalText, setLinkTarget, setLinkSelection,
  setRefModalOpen, setRefText, setRefTarget, setRefSelection,
  setWizardModalOpen, loadFileList,
  updateImports
}: EditorActionsProps) => {

  const handleSave = useCallback(async () => {
    if (!currentFile) return;
    setSaving(true);
    setMessage('');
    try {
      let finalPath = currentFile;
      if (currentFile === 'nuevo_archivo.mdx') {
        const typeFolder = prompt('¿En qué carpeta? (theorems, lessons, mathematicians, demonstrations)', 'theorems');
        const fileName = prompt('Nombre del archivo (ej: mi_teorema.mdx)', (metadata.id as string) + '.mdx');
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
        loadFileList();
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
      setTimeout(() => setMessage(''), 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFile, metadata, imports, body]);

  const confirmNewFile = useCallback(async (wizardData: WizardData) => {
    if (!wizardData.id || !wizardData.title) {
        alert("ID y Título son obligatorios");
        return;
    }
    
    const path = `content/${wizardData.type}/${wizardData.id}.mdx`;
    const templateName = wizardData.type === 'lessons' ? 'lesson' : wizardData.type.slice(0, -1);
    
    try {
      const res = await fetch(`/api/content?path=${encodeURIComponent(`templates/${templateName}.template.mdx`)}`);
      const templateText = applyTemplateReplacements(await res.text(), wizardData);
      const parsed = parseMDX(templateText);
      const meta = parsed.metadata;

      applyTypeSpecificMetadata(wizardData, meta);

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
  }, [setCurrentFile, setMetadata, setImports, setBody, setMessage, setWizardModalOpen]);

  const autoGenerateImports = useCallback(() => {
    if (!currentFile || !currentFile.endsWith('.mdx')) return;
    const regex = /<([A-Z][a-zA-Z0-9]*)/g;
    const matches = Array.from(body.matchAll(regex)).map(m => m[1]);
    const uniqueTags = [...new Set(matches)];
    
    let currentImportsStr = imports;
    let added = 0;

    const parts = currentFile.split('/');
    const depth = parts.length - 1;
    const backPath = Array(depth).fill('..').join('/');

    for (const tag of uniqueTags) {
      if (currentImportsStr.includes(tag)) continue;
      
      const componentFile = files.find(f => f.name === `${tag}.tsx`);
      if (componentFile) {
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
  }, [currentFile, body, imports, files, updateImports, setMessage]);

  const insertAtCursor = useCallback((text: string) => {
    const editor = editorRef.current as any;
    if (!editor) return;
    const selection = editor.getSelection();
    editor.executeEdits('', [{
      range: selection,
      text: text,
      forceMoveMarkers: true
    }]);
    editor.focus();
  }, [editorRef]);

  const wrapSelectedText = useCallback((prefix: string, suffix: string) => {
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
  }, [editorRef]);

  const openLinkModal = useCallback(() => {
    const editor = editorRef.current as any;
    if (!editor) return;
    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    setLinkSelection(selection);
    setLinkModalText(text);
    setLinkModalOpen(true);
    setLinkTarget('');
  }, [editorRef, setLinkSelection, setLinkModalText, setLinkModalOpen, setLinkTarget]);

  const applyLink = useCallback((targetLink: string, linkText: string) => {
    if (!targetLink || !editorRef.current) return;
    const editor = editorRef.current as any;
    const text = linkText || 'enlace';
    const insertion = `[${text}](${targetLink})`;
    
    editor.executeEdits('', [{
      range: linkSelection as any,
      text: insertion,
      forceMoveMarkers: true
    }]);
    
    setLinkModalOpen(false);
    editor.focus();
  }, [editorRef, linkSelection, setLinkModalOpen]);

  const openRefModal = useCallback(() => {
    const editor = editorRef.current as any;
    if (!editor) return;
    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    setRefSelection(selection);
    setRefText(text);
    setRefModalOpen(true);
    setRefTarget('');
  }, [editorRef, setRefSelection, setRefText, setRefModalOpen, setRefTarget]);

  const applyRef = useCallback((target: string, color: string, refTextValue: string) => {
    if (!target || !editorRef.current) return;
    const editor = editorRef.current as any;
    const insertion = `<InteractiveElement target="${target}" color="${color}">${refTextValue}</InteractiveElement>`;
    
    editor.executeEdits('', [{
      range: refSelection as any,
      text: insertion,
      forceMoveMarkers: true
    }]);
    
    setRefModalOpen(false);
    editor.focus();
  }, [editorRef, refSelection, setRefModalOpen]);

  const insertLatex = useCallback((type: string) => {
    const latexSnippets: Record<string, string> = {
      frac: '\\frac{numerador}{denominador}',
      sqrt: '\\sqrt{x}',
      int: '\\int_{a}^{b} x \\, dx',
      sum: '\\sum_{i=1}^{n} i',
      lim: '\\lim_{x \\to \\infty} f(x)',
      alpha: '\\alpha', beta: '\\beta', gamma: '\\gamma', theta: '\\theta', pi: '\\pi',
    };
    const latex = latexSnippets[type];
    if (latex) insertAtCursor(latex);
  }, [insertAtCursor]);

  const insertBlock = useCallback((type: string) => {
    const blockSnippets: Record<string, string> = {
      'caja-formula': `\n<Formula>\n  $$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$\n</Formula>\n`,
      'caja-nota': `\n<Nota>\n  Añade aquí una aclaración histórica o curiosidad.\n</Nota>\n`,
      'caja-demostracion': `\n<Demostracion>\n  Escribe aquí los pasos de la demostración lógica.\n</Demostracion>\n`,
      'medieval-step': `\n<MedievalStep number={1} title="Título del Paso" />\n`,
      'caja-definicion': `\n<Definicion title="Nueva Definición">\n  Explica el concepto formalmente aquí.\n</Definicion>\n`,
      'caja-corolario': `\n<Corolario>\n  Consecuencia directa del teorema anterior.\n</Corolario>\n`,
      cita: `\n<Cita author="Pitágoras">\n  Todo es número.\n</Cita>\n`,
      separador: `\n<Separador />\n`,
      capitular: `\n<Capitular letra="E" />n un lugar de la Mancha...\n`,
      lista: `\n- Elemento 1\n- Elemento 2\n- Elemento 3\n`,
    };
    const block = blockSnippets[type];
    if (block) insertAtCursor(block);
  }, [insertAtCursor]);

  const insertComponent = useCallback((componentName: string) => {
    insertAtCursor(`\n<${componentName} />\n`);
  }, [insertAtCursor]);

  const getLinkOptions = useCallback(() => {
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
  }, [files]);

  const addNewField = useCallback(() => {
    const key = prompt('Nombre del nuevo campo (ej. color, tags):');
    if (!key) return;
    const isArray = confirm('¿Es una lista (array)? (Aceptar=Sí, Cancelar=No)');
    return { key, value: isArray ? [] : '' };
  }, []);

  const removeField = useCallback((key: string) => {
    if (confirm(`¿Eliminar el campo "${key}"?`)) {
      return key;
    }
    return null;
  }, []);

  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor;
    
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
  }, [editorRef]);

  return {
    handleSave,
    loadFileList,
    confirmNewFile,
    autoGenerateImports,
    insertAtCursor,
    wrapSelectedText,
    openLinkModal,
    applyLink,
    openRefModal,
    applyRef,
    insertLatex,
    insertBlock,
    insertComponent,
    getLinkOptions,
    addNewField,
    removeField,
    handleEditorDidMount,
  };
};
