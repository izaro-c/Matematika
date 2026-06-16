import fs from 'fs';
fetch('http://localhost:5173/api/draft', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ path: 'content/theorems/teorema_pitagoras.mdx', content: 'test' })
}).then(res => res.json()).then(console.log);
