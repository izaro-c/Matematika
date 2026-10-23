#!/usr/bin/env node
// Prints the reviewer's system prompt: prompt.md followed by the content skill's rules,
// read fresh from .agents/skills so the agent never drifts from them. The output is
// identical for every page, which lets consecutive runs reuse the prompt cache.
// Usage: node scripts/daily-review/system-prompt.mjs > system.md
import fs from 'fs';
import path from 'path';
import { ROOT, TOOL_DIR, extractSection } from './lib.mjs';

const skillDir = path.join(ROOT, '.agents/skills/matematika-content-generator');
const read = (rel) => fs.readFileSync(path.join(skillDir, rel), 'utf8').trim();
const skill = read('SKILL.md');

const parts = [
  fs.readFileSync(path.join(TOOL_DIR, 'prompt.md'), 'utf8').trim(),
  read('references/review-rubric.md'),
  extractSection(skill, '## Los Tres Pilares Innegociables'),
  extractSection(skill, '## Reglas de Redacción'),
  extractSection(skill, '## Tabla de Tipos de Contenido'),
  extractSection(skill, '## Golden Rules (resumen ejecutivo)'),
  read('references/convenciones-proyecto.md'),
  read('references/editorial-epistemology.md'),
  read('references/dag-and-hyperlinks.md'),
  read('references/katex-notation.md'),
  read('references/euskara-glossary.md'),
];

process.stdout.write(parts.join('\n\n---\n\n') + '\n');
