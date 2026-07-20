const fs = require('fs');
const file = 'tests/features/editor/diagrams/DiagramInfoPanelEditor.test.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /render\(<Harness \/>\);/g,
  `render(<Harness />);
    const openBtn = screen.getByRole('button', { name: /Configurar Panel Informativo/i });
    if (openBtn) fireEvent.click(openBtn);`
);

fs.writeFileSync(file, content);
