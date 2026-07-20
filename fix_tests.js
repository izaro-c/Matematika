const fs = require('fs');
const file = 'tests/features/editor/diagrams/Phase3Inspector.test.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /render\(<DiagramInspector model=\{model\} selectedId="panelA" (.*?)\/>\);/g,
  `render(<DiagramInspector model={model} selectedId="panelA" $1/>);
    const openBtn = screen.getByRole('button', { name: /Configurar Panel Informativo/i });
    if (openBtn) fireEvent.click(openBtn);`
);

fs.writeFileSync(file, content);
