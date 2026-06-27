import { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorState } from '@/features/editor/hooks/useEditorState';
import { useEditorActions } from '@/features/editor/hooks/useEditorActions';
import { EditorSidebar } from '@/features/editor/ui/EditorSidebar';
import { LinkModal } from '@/features/editor/ui/modals/LinkModal';
import { ReferenceModal } from '@/features/editor/ui/modals/ReferenceModal';
import { ComponentGalleryModal } from '@/features/editor/ui/modals/ComponentGalleryModal';
import { BlocksGalleryModal } from '@/features/editor/ui/modals/BlocksGalleryModal';
import { NewFileWizardModal } from '@/features/editor/ui/modals/NewFileWizardModal';

export const EditorPage: React.FC = () => {
  const state = useEditorState();
  const actions = useEditorActions({
    files: state.files,
    currentFile: state.currentFile,
    metadata: state.metadata,
    imports: state.imports,
    body: state.body,
    editorRef: state.editorRef,
    linkSelection: state.linkSelection,
    refSelection: state.refSelection,
    setCurrentFile: state.setCurrentFile,
    setMetadata: state.setMetadata,
    setImports: state.setImports,
    setBody: state.setBody,
    setMessage: state.setMessage,
    setSaving: state.setSaving,
    setLinkModalOpen: state.setLinkModalOpen,
    setLinkModalText: state.setLinkModalText,
    setLinkTarget: state.setLinkTarget,
    setLinkSelection: state.setLinkSelection,
    setRefModalOpen: state.setRefModalOpen,
    setRefText: state.setRefText,
    setRefTarget: state.setRefTarget,
    setRefSelection: state.setRefSelection,
    setWizardModalOpen: state.setWizardModalOpen,
    loadFileList: state.loadFileList,
    updateImports: state.updateImports,
  });

  const {
    files, loading, currentFile,
    metadata, imports, body,
    saving, message,
    leftWidth, setLeftWidth, isDraggingRef, isSidebarOpen, setIsSidebarOpen,
    activeTab, setActiveTab, searchQuery, setSearchQuery,
    linkModalOpen, setLinkModalOpen, linkModalText, setLinkModalText, linkTarget, setLinkTarget,
    refModalOpen, setRefModalOpen, refText, setRefText, refTarget, setRefTarget, refColor, setRefColor,
    galleryModalOpen, setGalleryModalOpen, blocksModalOpen, setBlocksModalOpen,
    wizardModalOpen, setWizardModalOpen, wizardData, setWizardData,
    getPreviewUrl, openFile, updateMetadata, updateBody, updateImports,
    setMetadata,
  } = state;

  const {
    handleSave, loadFileList, confirmNewFile, autoGenerateImports,
    wrapSelectedText, openLinkModal, applyLink, openRefModal, applyRef,
    insertLatex, insertBlock, insertComponent, getLinkOptions,
    addNewField, removeField, handleEditorDidMount,
  } = actions;

  const availableColors = ['carbon', 'salvia', 'terracota', 'dorado', 'pizarra'];

  useEffect(() => {
    loadFileList();

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 10 && newWidth < 90) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
      if (iframe) iframe.style.pointerEvents = 'auto';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [loadFileList, isDraggingRef, setLeftWidth]);

  if (import.meta.env.PROD) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lienzo p-8">
        <div className="bg-white p-8 rounded shadow text-center max-w-md">
          <h2 className="text-2xl font-serif font-bold text-carbon mb-4">Editor Desactivado</h2>
          <p className="text-carbon/70 font-sans text-sm">El editor de contenido solo está disponible en el entorno de desarrollo local.</p>
        </div>
      </div>
    );
  }

  const handleNewFile = () => {
    setWizardData({
      type: 'theorems', id: '', title: '', description: '',
      era: '', birth: '', death: '', color: 'terracota',
      authors: '', tags: '', corollaries: '', demos: '',
      parentTheorem: '', proofMethod: '', lemmas: '',
      satisfies: '', axioms_verified: '', hasDiagram: false,
    });
    setWizardModalOpen(true);
  };

  const handleAddNewField = () => {
    const result = addNewField();
    if (result) updateMetadata(result.key, result.value);
  };

  const handleRemoveField = (key: string) => {
    const result = removeField(key);
    if (result) {
      const newMeta = { ...metadata };
      delete newMeta[result];
      setMetadata(newMeta);
    }
  };

  const handleApplyLink = () => {
    applyLink(linkTarget, linkModalText);
  };

  const handleApplyRef = () => {
    applyRef(refTarget, refColor, refText);
  };

  const handleInsertComponent = (name: string) => {
    insertComponent(name);
    setGalleryModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-lienzo text-carbon font-sans overflow-hidden">
      <EditorSidebar
        files={files}
        currentFile={currentFile}
        searchQuery={searchQuery}
        isSidebarOpen={isSidebarOpen}
        onSearchChange={setSearchQuery}
        onFileClick={openFile}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewFile={handleNewFile}
      />

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
        {loading && (
          <div className="flex-1 flex items-center justify-center italic text-carbon/50">Cargando archivo...</div>
        )}
        {!loading && !currentFile && (
          <div className="flex-1 flex items-center justify-center font-serif text-carbon/40 text-xl">Selecciona o crea un archivo</div>
        )}
        {!loading && currentFile && (
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
                    <button onClick={handleAddNewField} className="text-xs bg-carbon/10 hover:bg-carbon/20 px-2 py-1 rounded transition-colors">+ Añadir</button>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(metadata).map(([key, value]) => {
                      const isArray = Array.isArray(value);
                      return (
                        <div key={key} className="relative group">
                          <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">{key}</label>
                          <button
                            onClick={() => handleRemoveField(key)}
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
                    <button onClick={autoGenerateImports} className="text-xs bg-salvia text-white px-2 py-1 rounded hover:bg-salvia/80">
                      ⚡ Escanear Imports
                    </button>
                  </div>
                  <textarea
                    className="w-full flex-1 bg-carbon/5 p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-carbon border-none rounded"
                    value={imports}
                    onChange={(e) => updateImports(e.target.value)}
                    placeholder="import { Component } from '@/...';"
                  />
                </div>
              )}

              {currentFile.endsWith('.mdx') && activeTab === 'content' && (
                <div className="flex-1 bg-white border border-carbon/10 rounded shadow-sm flex flex-col overflow-hidden">
                  <div className="bg-carbon/5 border-b border-carbon/10 p-2 flex flex-wrap gap-2 items-center shrink-0">
                    <div className="flex gap-1 border-r border-carbon/10 pr-2 mr-1">
                      <button onClick={() => wrapSelectedText('**', '**')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded font-bold" title="Negrita (Cmd+B)">B</button>
                      <button onClick={() => wrapSelectedText('*', '*')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded italic" title="Cursiva (Cmd+I)">I</button>
                      <button onClick={() => wrapSelectedText('### ', '')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded font-bold" title="Título (H3)">H3</button>
                    </div>
                    <div className="flex gap-1 border-r border-carbon/10 pr-2 mr-1 items-center">
                      <button onClick={() => wrapSelectedText('$', '$')} className="text-xs font-serif bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-1 rounded" title="Fórmula Inline">$x$</button>
                      <button onClick={() => wrapSelectedText('\n$$\n', '\n$$\n')} className="text-xs font-serif bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-1 rounded" title="Fórmula en Bloque">$$...$$</button>
                      <select
                        className="text-xs bg-carbon/5 border-none p-1 rounded font-serif text-salvia cursor-pointer hover:bg-carbon/10 ml-1"
                        onChange={(e) => { insertLatex(e.target.value); e.target.value = ''; }}
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
                    <button onClick={() => setBlocksModalOpen(true)} className="text-xs bg-carbon/5 font-bold hover:bg-carbon/10 px-2 py-1 rounded">
                      + Bloque
                    </button>
                    <button onClick={() => setGalleryModalOpen(true)} className="text-xs bg-salvia/20 text-salvia font-bold hover:bg-salvia/30 px-2 py-1 rounded flex items-center gap-1 ml-auto">
                      🧩 Galería
                    </button>
                    <button onClick={openRefModal} className="text-xs bg-terracota/10 text-terracota hover:bg-terracota/20 px-2 py-1 rounded flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-terracota inline-block"></span> Ref
                    </button>
                    <button onClick={openLinkModal} className="text-xs bg-carbon/10 hover:bg-carbon/20 px-2 py-1 rounded">
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
                isDraggingRef.current = true;
                document.body.style.cursor = 'col-resize';
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

      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        linkText={linkModalText}
        setLinkText={setLinkModalText}
        linkTarget={linkTarget}
        setLinkTarget={setLinkTarget}
        options={getLinkOptions()}
        onApply={handleApplyLink}
      />

      <ReferenceModal
        isOpen={refModalOpen}
        onClose={() => setRefModalOpen(false)}
        refText={refText}
        setRefText={setRefText}
        refTarget={refTarget}
        setRefTarget={setRefTarget}
        refColor={refColor}
        setRefColor={setRefColor}
        availableColors={availableColors}
        onApply={handleApplyRef}
      />

      <ComponentGalleryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        files={files}
        onInsertComponent={handleInsertComponent}
      />

      <BlocksGalleryModal
        isOpen={blocksModalOpen}
        onClose={() => setBlocksModalOpen(false)}
        onInsertBlock={(blockId) => {
          insertBlock(blockId);
          setBlocksModalOpen(false);
        }}
      />

      <NewFileWizardModal
        isOpen={wizardModalOpen}
        onClose={() => setWizardModalOpen(false)}
        wizardData={wizardData}
        setWizardData={setWizardData}
        onConfirm={confirmNewFile}
      />
    </div>
  );
};
