import { useCallback } from 'react';
import type { editor, IRange } from 'monaco-editor';
import { parseMDX, stringifyMDX } from '@/shared/lib/mdxParser';
import type { FileNode, WizardData } from '@/features/editor/hooks/useEditorState';
import { applyTemplateReplacements, applyTypeSpecificMetadata } from '@/features/editor/lib/editorUtils';
import {
  buildContentPath,
  buildTemplatePath,
  getContentId,
  getInternalLinkUrl,
  getTemplateName,
} from '@/features/editor/lib/editorPaths';
import {
  buildConceptLink,
  buildInteractiveReference,
  ensureProofStepJustifications,
  getBlockSnippet,
  getLatexSnippet,
  normalizeWizardData,
} from '@/features/editor/lib/editorContracts';
import { generateMissingComponentImports } from '@/features/editor/lib/editorImports';

// ─── Types ──────────────────────────────────────────────────────────────────
interface EditorActionsProps {
  files: FileNode[];
  currentFile: string | null;
  metadata: Record<string, unknown>;
  imports: string;
  body: string;
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  linkSelection: IRange;
  refSelection: IRange;
  setCurrentFile: (path: string | null) => void;
  setMetadata: (meta: Record<string, unknown>) => void;
  setImports: (imp: string) => void;
  setBody: (body: string) => void;
  setMessage: (msg: string) => void;
  setSaving: (s: boolean) => void;
  setLinkModalOpen: (o: boolean) => void;
  setLinkModalText: (t: string) => void;
  setLinkTarget: (t: string) => void;
  setLinkSelection: (s: IRange) => void;
  setRefModalOpen: (o: boolean) => void;
  setRefText: (t: string) => void;
  setRefTarget: (t: string) => void;
  setRefSelection: (s: IRange) => void;
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
        const fileName = prompt('Nombre del archivo (ej: mi-teorema.mdx)', (metadata.id as string) + '.mdx');
        if (!typeFolder || !fileName) {
          setSaving(false);
          return;
        }
        finalPath = buildContentPath(typeFolder, fileName);
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
    const normalizedWizardData = normalizeWizardData(wizardData);
    if (!normalizedWizardData.id || !normalizedWizardData.title) {
        alert("ID y Título son obligatorios");
        return;
    }
    
    const path = buildContentPath(normalizedWizardData.type, `${normalizedWizardData.id}.mdx`);
    const templateName = getTemplateName(normalizedWizardData.type);
    const templatePath = buildTemplatePath(templateName);
    
    try {
      const res = await fetch(`/api/content?path=${encodeURIComponent(templatePath)}`);
      const templateText = applyTemplateReplacements(await res.text(), normalizedWizardData);
      const parsed = parseMDX(templateText);
      const meta = applyTypeSpecificMetadata(normalizedWizardData, parsed.metadata);

      setCurrentFile(path);
      setMetadata(meta);
      setImports(parsed.imports);
      setBody(ensureProofStepJustifications(parsed.body));
      setMessage('¡Plantilla cargada!');
      setWizardModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Error cargando la plantilla');
    }
  }, [setCurrentFile, setMetadata, setImports, setBody, setMessage, setWizardModalOpen]);

  const autoGenerateImports = useCallback(() => {
    if (!currentFile || !currentFile.endsWith('.mdx')) return;
    const result = generateMissingComponentImports({
      body,
      currentImports: imports,
      currentFile,
      files,
    });

    if (result.added > 0) {
      updateImports(result.imports);
      setMessage(`Se auto-importaron ${result.added} componentes.`);
    }
  }, [currentFile, body, imports, files, updateImports, setMessage]);

  const insertAtCursor = useCallback((text: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = editor.getSelection();
    if (!selection) return;
    editor.executeEdits('', [{
      range: selection,
      text: text,
      forceMoveMarkers: true
    }]);
    editor.focus();
  }, [editorRef]);

  const wrapSelectedText = useCallback((prefix: string, suffix: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = editor.getSelection();
    if (!selection) return;
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValueInRange(selection);
    
    editor.executeEdits('', [{
      range: selection,
      text: prefix + text + suffix,
      forceMoveMarkers: true
    }]);
    editor.focus();
  }, [editorRef]);

  const openLinkModal = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = editor.getSelection();
    if (!selection) return;
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValueInRange(selection);
    
    setLinkSelection(selection);
    setLinkModalText(text);
    setLinkModalOpen(true);
    setLinkTarget('');
  }, [editorRef, setLinkSelection, setLinkModalText, setLinkModalOpen, setLinkTarget]);

  const applyLink = useCallback((targetId: string, linkText: string) => {
    if (!targetId || !editorRef.current) return;
    const editor = editorRef.current;
    const text = linkText || 'enlace';
    const insertion = buildConceptLink(targetId, text);
    
    editor.executeEdits('', [{
      range: linkSelection,
      text: insertion,
      forceMoveMarkers: true
    }]);
    
    setLinkModalOpen(false);
    editor.focus();
  }, [editorRef, linkSelection, setLinkModalOpen]);

  const openRefModal = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = editor.getSelection();
    if (!selection) return;
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValueInRange(selection);
    
    setRefSelection(selection);
    setRefText(text);
    setRefModalOpen(true);
    setRefTarget('');
  }, [editorRef, setRefSelection, setRefText, setRefModalOpen, setRefTarget]);

  const applyRef = useCallback((target: string, color: string, refTextValue: string) => {
    if (!target || !editorRef.current) return;
    const editor = editorRef.current;
    const insertion = buildInteractiveReference(target, color, refTextValue);
    
    editor.executeEdits('', [{
      range: refSelection,
      text: insertion,
      forceMoveMarkers: true
    }]);
    
    setRefModalOpen(false);
    editor.focus();
  }, [editorRef, refSelection, setRefModalOpen]);

  const insertLatex = useCallback((type: string) => {
    const latex = getLatexSnippet(type);
    if (latex) insertAtCursor(latex);
  }, [insertAtCursor]);

  const insertBlock = useCallback((type: string) => {
    const block = getBlockSnippet(type);
    if (block) insertAtCursor(block);
  }, [insertAtCursor]);

  const insertComponent = useCallback((componentName: string) => {
    insertAtCursor(`\n<${componentName} />\n`);
  }, [insertAtCursor]);

  const getLinkOptions = useCallback(() => {
    return files
      .filter(f => f.path.startsWith('database/content/') && ['theorems', 'lessons', 'demonstrations', 'mathematicians'].includes(f.type))
      .map(f => {
        const targetId = getContentId(f);
        return {
          label: `${f.type} - ${targetId}`,
          targetId,
          url: getInternalLinkUrl(f),
        };
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

  const handleEditorDidMount = useCallback((editor: editor.IStandaloneCodeEditor) => {
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
