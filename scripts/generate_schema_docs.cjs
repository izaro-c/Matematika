const fs = require('fs');
const path = require('path');

const schemasPath = path.join(__dirname, '../src/store/schemas.ts');
const outputPath = path.join(__dirname, '../docs/DEVELOPER_GUIDE.md');

const content = fs.readFileSync(schemasPath, 'utf-8');

const regex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*export const (\w+) = z\.object\({([\s\S]*?)}\);/g;

let markdown = `# Developer Guide: Estructura de Datos (Frontmatter MDX)

Este archivo es generado automáticamente por \`npm run docs:generate\`. Documenta los esquemas de metadatos requeridos para cada tipo de contenido en Matematika.

`;

let match;
while ((match = regex.exec(content)) !== null) {
  const commentBlock = match[1];
  const schemaName = match[2];
  const fieldsBlock = match[3];

  // Extraer la descripción principal del bloque de comentarios
  const descriptionLines = commentBlock.split('\n').map(line => line.replace(/^\s*\*\s?/, '')).filter(line => line.trim() !== '');
  const title = descriptionLines[0];
  const description = descriptionLines.slice(1).join(' ');

  markdown += `## ${title || schemaName}\n\n`;
  if (description) {
    markdown += `${description}\n\n`;
  }

  markdown += `| Campo | Tipo | Requerido | Descripción |\n`;
  markdown += `|-------|------|-----------|-------------|\n`;

  // Parsear campos
  const fieldRegex = /(?:\/\*\*([\s\S]*?)\*\/)?\s*(\w+):\s*z\.([a-zA-Z]+)\(([^)]*)\)(?:\.([a-zA-Z]+)\(\))?,?/g;
  let fieldMatch;
  while ((fieldMatch = fieldRegex.exec(fieldsBlock)) !== null) {
    let fieldDesc = fieldMatch[1] ? fieldMatch[1].replace(/\*/g, '').trim() : '-';
    const fieldName = fieldMatch[2];
    const fieldType = fieldMatch[3];
    const fieldArgs = fieldMatch[4];
    const modifier = fieldMatch[5];

    const isOptional = modifier === 'optional';
    let typeDisplay = fieldType;
    if (fieldType === 'array') typeDisplay = `array`;
    if (fieldType === 'enum') typeDisplay = `enum(${fieldArgs.replace(/['"]/g, '')})`;

    // Limpiar saltos de linea en descripciones
    fieldDesc = fieldDesc.replace(/\n/g, ' ');

    markdown += `| \`${fieldName}\` | \`${typeDisplay}\` | ${isOptional ? '❌' : '✅'} | ${fieldDesc} |\n`;
  }
  markdown += `\n---\n\n`;
}

fs.writeFileSync(outputPath, markdown);
console.log('✅ Documentación generada exitosamente en docs/DEVELOPER_GUIDE.md');
