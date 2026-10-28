#!/usr/bin/env node
// Looks up a term in the Elhuyar dictionary, the Elhuyar science and technology dictionary
// (ZTH) and Wikipedia, and prints only the useful text, so the review agent can settle a
// Basque term without reading whole web pages.
// Usage: node scripts/daily-review/euskara.mjs <es|en|eu> "<término>"
//   es/en: Elhuyar <lang>→eu, and the Basque Wikipedia article linked from <lang> Wikipedia.
//   eu:    Elhuyar eu→es, the ZTH entry (definition and equivalents), and Basque Wikipedia.
const [lang, ...words] = process.argv.slice(2);
const term = words.join(' ').trim();
if (!['es', 'en', 'eu'].includes(lang) || !term) {
  console.error('Uso: euskara.mjs <es|en|eu> "<término>"');
  process.exit(2);
}

const UA = { 'User-Agent': 'Matematika-daily-review/1.0 (diccionario para revisión editorial)' };
const get = async (url, as = 'text') => {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return as === 'json' ? res.json() : res.text();
};

const ENTITIES = { nbsp: ' ', '#160': ' ', times: '×', gt: '>', lt: '<', amp: '&', quot: '"', rsaquo: '›', '#39': "'" };
const pageText = (html) => html
  .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? m)
  .replace(/-->/g, ' ')
  .replace(/\s+/g, ' ')
  .replace(/ ([,.;:)\]])/g, '$1')
  .replace(/([(\[]) /g, '$1')
  .trim();
const between = (text, from, toList) => {
  const i = text.indexOf(from);
  if (i === -1) return null;
  const rest = text.slice(i + from.length);
  const ends = toList.map((t) => rest.indexOf(t)).filter((j) => j !== -1);
  return rest.slice(0, ends.length ? Math.min(...ends) : 1500).trim();
};
const clip = (s, n = 1500) => (s.length > n ? `${s.slice(0, n)} […]` : s);
const out = [];
const section = (title, url, body) => out.push(`## ${title}\n${url}\n\n${body}\n`);

async function elhuyar() {
  const url = `https://hiztegiak.elhuyar.eus/${lang}/${encodeURIComponent(term)}`;
  try {
    const text = pageText(await get(url));
    const entry = between(text, 'Partekatu sareetan:', ['Adibide elebidun', 'Adibide gehiago', 'Hitz-jolasa', 'Onuradunen']);
    section(`Elhuyar hiztegia (${lang}→${lang === 'eu' ? 'es' : 'eu'}): ${term}`, url,
      entry ? clip(entry) : 'Sin entrada.');
  } catch (e) {
    section(`Elhuyar hiztegia: ${term}`, url, `No se pudo consultar (${e.message}).`);
  }
}

async function zth(eu) {
  const url = `https://zthiztegia.elhuyar.eus/terminoa/eu/${encodeURIComponent(eu)}`;
  try {
    const text = pageText(await get(url));
    const entry = text.includes('Bilatu duzun hitza ez da hiztegian agertzen') ? null
      : between(text, 'Archive', ['Emaitza', 'Azken Aldaketak']);
    section(`ZTH, Zientzia eta Teknologiaren Hiztegi Entziklopedikoa: ${eu}`, url, entry ? clip(entry) : 'Sin entrada.');
  } catch (e) {
    section(`ZTH: ${eu}`, url, `No se pudo consultar (${e.message}).`);
  }
}

const api = (wiki, params) => `https://${wiki}.wikipedia.org/w/api.php?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;

async function wikipedia() {
  const search = { generator: 'search', gsrsearch: term, gsrlimit: '3' };
  try {
    let euTitles;
    const lines = [];
    if (lang === 'eu') {
      const r = await get(api('eu', { action: 'query', ...search, prop: 'langlinks', lllang: 'es' }), 'json');
      const pages = (r.query?.pages ?? []).sort((a, b) => a.index - b.index);
      euTitles = pages.map((p) => p.title);
      for (const p of pages) lines.push(`- eu «${p.title}» ↔ es «${p.langlinks?.[0]?.title ?? '—'}»`);
    } else {
      const r = await get(api(lang, { action: 'query', ...search, prop: 'langlinks', lllang: 'eu' }), 'json');
      const pages = (r.query?.pages ?? []).sort((a, b) => a.index - b.index);
      euTitles = pages.map((p) => p.langlinks?.[0]?.title).filter(Boolean);
      for (const p of pages) lines.push(`- ${lang} «${p.title}» → eu «${p.langlinks?.[0]?.title ?? 'sin artículo en euskera'}»`);
    }
    if (euTitles.length) {
      const r = await get(api('eu', {
        action: 'query', titles: euTitles.join('|'), prop: 'extracts', exintro: '1', explaintext: '1', exsentences: '2', redirects: '1',
      }), 'json');
      for (const p of r.query?.pages ?? []) {
        if (p.extract) lines.push(`\n**${p.title}** (https://eu.wikipedia.org/wiki/${encodeURIComponent(p.title.replaceAll(' ', '_'))}): ${clip(p.extract.replace(/\s+/g, ' '), 600)}`);
      }
    }
    section(`Wikipedia (búsqueda en ${lang}): ${term}`, `https://${lang}.wikipedia.org/w/index.php?search=${encodeURIComponent(term)}`,
      lines.join('\n') || 'Sin resultados.');
  } catch (e) {
    section(`Wikipedia: ${term}`, `https://${lang}.wikipedia.org`, `No se pudo consultar (${e.message}).`);
  }
}

await Promise.all([elhuyar(), wikipedia(), ...(lang === 'eu' ? [zth(term)] : [])]);
process.stdout.write(out.join('\n'));
