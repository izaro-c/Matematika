const fs = require('fs');
const file = 'src/features/editor/diagrams/ui/DiagramToolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove OpenMenu type and useEffect
content = content.replace(/type OpenMenu = 'objects' \| 'view' \| null;\n/, '');
content = content.replace(/const \[openMenu, setOpenMenu\] = useState<OpenMenu>\(null\);\n/, '');
content = content.replace(/const toolbarRef = useRef<HTMLDivElement>\(null\);\n/, `const closePopover = (id: string) => {
    const el = document.getElementById(id);
    if (el && 'hidePopover' in el) {
      (el as any).hidePopover();
    }
  };\n`);
content = content.replace(/  useEffect\(\(\) => {[\s\S]*?\}, \[openMenu\]\);\n\n  const toggleMenu =[^\n]*\n/, '');

// 2. Toolbar wrapper
content = content.replace(
  /className="relative flex flex-wrap items-center gap-2 rounded border border-carbon\/15 bg-carbon\/5 p-2"/,
  'className="flex flex-wrap items-center gap-2 rounded-xl border border-carbon/15 bg-lienzo shadow-md p-2"'
);
content = content.replace(/ref={toolbarRef} /, '');

// 3. Select tools click handler
content = content.replace(
  /onClick=\{\(\) => \{\n\s*setOpenMenu\(null\);\n\s*onSetCanvasTool\(tool\);\n\s*\}\}/g,
  `onClick={() => {\n            onSetCanvasTool(tool);\n          }}`
);

// 4. Objects Menu
content = content.replace(
  /<div className="relative">\n\s*<button\n\s*type="button"\n\s*aria-haspopup="menu"\n\s*aria-expanded=\{openMenu === 'objects'\}\n\s*onClick=\{\(\) => toggleMenu\('objects'\)\}\n\s*className="min-h-11 rounded border border-carbon\/15 bg-lienzo px-3 text-xs font-bold text-carbon\/70 hover:bg-carbon\/5"\n\s*>\n\s*Añadir objeto <span aria-hidden="true">▾<\/span>\n\s*<\/button>\n\s*\{openMenu === 'objects' && \(\n\s*<div className="absolute left-0 top-full z-30 mt-2 w-\[min\(34rem,calc\(100vw-2rem\)\)\] overflow-hidden rounded border border-carbon\/15 bg-lienzo shadow-xl">/,
  `<div>
        <button
          type="button"
          popovertarget="diagram-menu-add-objects"
          style={{ anchorName: '--diagram-add-objects' } as React.CSSProperties}
          className="min-h-11 rounded border border-carbon/15 bg-lienzo px-3 text-xs font-bold text-carbon/70 hover:bg-carbon/5"
        >
          Añadir objeto <span aria-hidden="true">▾</span>
        </button>
        <div
          id="diagram-menu-add-objects"
          popover="auto"
          className="z-50 m-0 w-[min(34rem,calc(100vw-2rem))] overflow-hidden rounded border border-carbon/15 bg-lienzo shadow-xl"
          style={{ positionAnchor: '--diagram-add-objects', inset: 'auto', top: 'calc(anchor(bottom) + 8px)', left: 'anchor(left)' } as React.CSSProperties}
        >`
);
// replace closing for objects menu
content = content.replace(/<\/div> : <div className="max-h-\[min\(31rem,65vh\)\] overflow-y-auto p-3">\{guidedConstructions \?\? <p className="text-xs text-carbon\/50">No hay construcciones guiadas disponibles\.<\/p>\}<\/div>\}\n\s*<\/div>\n\s*\)/, `</div> : <div className="max-h-[min(31rem,65vh)] overflow-y-auto p-3">{guidedConstructions ?? <p className="text-xs text-carbon/50">No hay construcciones guiadas disponibles.</p>}</div>}
          </div>`);

// 5. Replace setOpenMenu(null) inside objects menu
content = content.replace(/setOpenMenu\(null\);/g, `closePopover('diagram-menu-add-objects');`);

// 6. View Menu
content = content.replace(
  /<div className="relative">\n\s*<button type="button" aria-haspopup="menu" aria-expanded=\{openMenu === 'view'\} onClick=\{\(\) => toggleMenu\('view'\)\} className="min-h-11 rounded border border-carbon\/15 bg-lienzo px-3 text-xs font-bold text-carbon\/70 hover:bg-carbon\/5">\n\s*Vista <span aria-hidden="true">▾<\/span>\n\s*<\/button>\n\s*\{openMenu === 'view' && \(\n\s*<div role="menu" className="absolute right-0 top-full z-30 mt-2 w-48 space-y-2 rounded border border-carbon\/15 bg-lienzo p-3 shadow-xl">/,
  `<div>
        <button
          type="button"
          popovertarget="diagram-menu-view"
          style={{ anchorName: '--diagram-view' } as React.CSSProperties}
          className="min-h-11 rounded border border-carbon/15 bg-lienzo px-3 text-xs font-bold text-carbon/70 hover:bg-carbon/5"
        >
          Vista <span aria-hidden="true">▾</span>
        </button>
        <div
          id="diagram-menu-view"
          popover="auto"
          className="z-50 m-0 w-48 space-y-2 rounded border border-carbon/15 bg-lienzo p-3 shadow-xl"
          style={{ positionAnchor: '--diagram-view', inset: 'auto', top: 'calc(anchor(bottom) + 8px)', right: 'anchor(right)' } as React.CSSProperties}
        >`
);

content = content.replace(
  /closePopover\('diagram-menu-add-objects'\);\s*\}\} \/>Cuadrícula/g,
  `closePopover('diagram-menu-view'); }} />Cuadrícula`
);
content = content.replace(
  /closePopover\('diagram-menu-add-objects'\);\s*\}\} \/>Ejes/g,
  `closePopover('diagram-menu-view'); }} />Ejes`
);
content = content.replace(
  /closePopover\('diagram-menu-add-objects'\);\s*\}\} \/>Etiquetas/g,
  `closePopover('diagram-menu-view'); }} />Etiquetas`
);
content = content.replace(
  /onClick=\{\(\) => \{\n\s*closePopover\('diagram-menu-add-objects'\);\n\s*onSetCanvasTool\(tool\);\n\s*\}\}/g,
  `onClick={() => {\n            onSetCanvasTool(tool);\n          }}`
);
content = content.replace(
  /onClick=\{\(\) => \{ closePopover\('diagram-menu-add-objects'\); onAddAllLabels\?\.\(\); \}\}/g,
  `onClick={() => { closePopover('diagram-menu-view'); onAddAllLabels?.(); }}`
);
content = content.replace(
  /onClick=\{\(\) => \{ closePopover\('diagram-menu-add-objects'\); onRemoveAllLabels\?\.\(\); \}\}/g,
  `onClick={() => { closePopover('diagram-menu-view'); onRemoveAllLabels?.(); }}`
);
content = content.replace(/<\/div>\n\s*\)\}\n\s*<\/div>/, `</div>\n      </div>`);


fs.writeFileSync(file, content);
