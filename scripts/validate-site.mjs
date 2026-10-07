#!/usr/bin/env node
// Checks the built site in out/ for problems a static host will not report: broken links and anchors,
// missing assets, third-party requests, metadata, heading order, ARIA references and malformed SVG or XML.
// Usage: node scripts/validate-site.mjs [directory]   (defaults to out/)
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DomUtils, Parser, parseDocument } from 'htmlparser2';

const ORIGIN = 'https://withso.com';
const MAX_DESCRIPTION = 165;
const out = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('../out/', import.meta.url));

if (!existsSync(out)) {
  console.error(`${out} does not exist. Run \`npm run build\` first.`);
  process.exit(1);
}

const errors = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
const files = walk(out).map((path) => relative(out, path).split(sep).join('/'));
const fileSet = new Set(files);
const read = (file) => readFileSync(join(out, file), 'utf8');

/** about/index.html → /about, index.html → /, 404.html → /404 */
const pageUrl = (file) => {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'/index.html'.length)}`;
  return `/${file.replace(/\.html$/, '')}`;
};

/** Maps a root-relative URL path to a file in out/, the way a static host would. */
const resolveFile = (path) => {
  let clean;
  try {
    clean = decodeURIComponent(path).replace(/^\/+/, '');
  } catch {
    return undefined;
  }
  const candidates =
    clean === '' ? ['index.html'] : clean.endsWith('/') ? [`${clean}index.html`] : [clean, `${clean}/index.html`, `${clean}.html`];
  return candidates.find((candidate) => fileSet.has(candidate));
};

const isElement = (node) => node.type === 'tag' || node.type === 'script' || node.type === 'style';
const all = (doc, test) => DomUtils.findAll(test, doc.children);
const one = (doc, test) => DomUtils.findOne(test, doc.children);
const tokens = (value) => (value ?? '').trim().split(/\s+/).filter(Boolean);

/** Text a screen reader would use, skipping aria-hidden subtrees. */
const textOf = (node) => {
  if (node.type === 'text') return node.data;
  if (!isElement(node) || node.attribs['aria-hidden'] === 'true') return '';
  if (node.name === 'script' || node.name === 'style' || node.name === 'template') return '';
  if (node.name === 'img') return node.attribs.alt ?? '';
  if (node.name === 'svg') {
    const title = node.children.find((child) => isElement(child) && child.name === 'title');
    return title ? DomUtils.textContent(title) : '';
  }
  return node.children.map(textOf).join('');
};

const accessibleName = (el, ids) => {
  const labelledby = tokens(el.attribs['aria-labelledby']);
  if (labelledby.length) return labelledby.map((id) => (ids.has(id) ? textOf(ids.get(id)) : '')).join(' ').trim();
  if (el.attribs['aria-label']?.trim()) return el.attribs['aria-label'].trim();
  return textOf(el).replace(/\s+/g, ' ').trim() || (el.attribs.title ?? '').trim();
};

/**
 * Well-formed XML check. htmlparser2 is lenient, so this detects its repairs instead: an implied close that is not
 * a self-closing tag means broken nesting, and closing tags it never reported were stray.
 */
const checkXml = (file, source, rootName) => {
  let root;
  let depth = 0;
  let broken = false;
  let explicitCloses = 0;
  const parser = new Parser(
    {
      onopentag(name) {
        if (depth === 0) {
          if (root) broken = true;
          root = name;
        }
        depth += 1;
      },
      onclosetag(_name, implied) {
        depth -= 1;
        if (!implied) explicitCloses += 1;
        else if (source[parser.endIndex - 1] !== '/') broken = true;
      },
    },
    { xmlMode: true },
  );
  parser.end(source);
  const closingTags = source.replace(/<!--[\s\S]*?-->/g, '').match(/<\/[^>]*>/g)?.length ?? 0;
  if (broken || closingTags !== explicitCloses) fail(file, 'is not well-formed XML');
  if (root !== rootName) fail(file, `root element should be <${rootName}>, found <${root ?? 'none'}>`);
};

// Parse every page first so links can be checked against the ids of the page they point to.
const pages = new Map();
for (const file of files.filter((name) => name.endsWith('.html'))) {
  const doc = parseDocument(read(file));
  const ids = new Map();
  for (const el of all(doc, (node) => node.attribs.id !== undefined)) {
    if (ids.has(el.attribs.id)) fail(file, `duplicate id "${el.attribs.id}"`);
    ids.set(el.attribs.id, el);
  }
  pages.set(file, { doc, ids, url: pageUrl(file) });
}

const meta = (doc, attr, value) => one(doc, (el) => el.name === 'meta' && el.attribs[attr] === value)?.attribs.content;
const indexable = new Map();
let linkCount = 0;
let assetCount = 0;

const checkLocalTarget = (file, raw, kind) => {
  const url = new URL(raw, `${ORIGIN}${pages.get(file)?.url ?? '/'}`);
  const target = resolveFile(url.pathname);
  if (!target) return fail(file, `${kind} "${raw}" does not resolve to a file in out/`);
  if (url.hash && url.hash !== '#') {
    const page = pages.get(target);
    const id = decodeURIComponent(url.hash.slice(1));
    if (page && !page.ids.has(id)) fail(file, `${kind} "${raw}" points to a missing anchor`);
  }
};

for (const [file, { doc, ids, url }] of pages) {
  const html = one(doc, (el) => el.name === 'html');
  if (!html?.attribs.lang) fail(file, 'missing <html lang>');
  if (!one(doc, (el) => el.name === 'meta' && el.attribs.charset)) fail(file, 'missing <meta charset>');
  if (!meta(doc, 'name', 'viewport')) fail(file, 'missing viewport meta tag');

  const title = one(doc, (el) => el.name === 'title');
  if (!title || !DomUtils.textContent(title).trim()) fail(file, 'missing <title>');
  const description = meta(doc, 'name', 'description')?.trim();
  if (!description) fail(file, 'missing meta description');
  else if (description.length > MAX_DESCRIPTION)
    fail(file, `meta description is ${description.length} characters (limit ${MAX_DESCRIPTION})`);

  const noindex = tokens(meta(doc, 'name', 'robots')?.replace(/,/g, ' ')).includes('noindex');
  const canonical = one(doc, (el) => el.name === 'link' && el.attribs.rel === 'canonical')?.attribs.href;
  if (!noindex) {
    if (!canonical?.startsWith(`${ORIGIN}/`)) fail(file, `canonical URL must start with ${ORIGIN}/`);
    else {
      const target = resolveFile(new URL(canonical).pathname);
      if (!target) fail(file, `canonical "${canonical}" does not resolve to a page`);
      if (meta(doc, 'property', 'og:url') !== canonical) fail(file, 'og:url must match the canonical URL');
      if (canonical === `${ORIGIN}${url}`) indexable.set(canonical, file);
    }
  }

  const mains = all(doc, (el) => el.name === 'main');
  if (mains.length !== 1 || mains[0].attribs.id !== 'main') fail(file, 'needs exactly one <main id="main"> for the skip link');

  const headings = all(doc, (el) => /^h[1-6]$/.test(el.name));
  if (headings.filter((el) => el.name === 'h1').length !== 1) fail(file, 'needs exactly one <h1>');
  if (headings[0] && headings[0].name !== 'h1') fail(file, `first heading is <${headings[0].name}>, expected <h1>`);
  headings.reduce((previous, el) => {
    const level = Number(el.name[1]);
    if (level > previous + 1) fail(file, `heading level skips from h${previous} to h${level}: "${textOf(el).trim()}"`);
    if (!textOf(el).trim()) fail(file, `empty <${el.name}>`);
    return level;
  }, 1);

  for (const el of all(doc, () => true)) {
    const { attribs: a } = el;

    for (const attr of ['aria-controls', 'aria-labelledby', 'aria-describedby', 'aria-owns', 'aria-activedescendant']) {
      for (const id of tokens(a[attr])) if (!ids.has(id)) fail(file, `${attr}="${id}" on <${el.name}> has no matching id`);
    }
    if (el.name === 'label' && a.for && !ids.has(a.for)) fail(file, `<label for="${a.for}"> has no matching control`);

    if (a.role === 'tab') {
      const panel = ids.get(a['aria-controls']);
      if (!panel || panel.attribs.role !== 'tabpanel') fail(file, `tab "${textOf(el).trim()}" must control a role="tabpanel"`);
    }

    if (el.name === 'a') {
      const href = a.href;
      if (href === undefined) continue;
      linkCount += 1;
      if (!href.trim() || /^javascript:/i.test(href)) fail(file, `link "${textOf(el).trim()}" has an empty or script href`);
      if (!accessibleName(el, ids)) fail(file, `link to "${href}" has no accessible name`);
      if (a.target === '_blank' && !tokens(a.rel).includes('noopener')) fail(file, `link to "${href}" opens a new tab without rel="noopener"`);
      if (href.startsWith(ORIGIN)) fail(file, `link "${href}" should be root-relative`);
      else if (!/^(https?:|mailto:|tel:)/i.test(href)) checkLocalTarget(file, href, 'link');
    }

    if (el.name === 'button') {
      if (!a.type) fail(file, `<button> "${textOf(el).trim()}" needs an explicit type`);
      if (!accessibleName(el, ids)) fail(file, 'button has no accessible name');
    }

    if (['input', 'select', 'textarea'].includes(el.name) && !['hidden', 'submit', 'button', 'reset'].includes(a.type)) {
      let labelled = Boolean(a['aria-label'] || a['aria-labelledby'] || (a.id && all(doc, (n) => n.name === 'label' && n.attribs.for === a.id).length));
      for (let node = el.parent; node && !labelled; node = node.parent) if (node.name === 'label') labelled = true;
      if (!labelled) fail(file, `<${el.name} name="${a.name ?? ''}"> has no label`);
    }

    if (el.name === 'img') {
      if (a.alt === undefined) fail(file, `<img src="${a.src}"> is missing alt`);
      if (!a.width || !a.height) fail(file, `<img src="${a.src}"> needs width and height`);
    }
    if (el.name === 'iframe' && !a.title) fail(file, '<iframe> needs a title');

    // Everything the page loads must come from this site: the privacy policy promises no third-party scripts.
    const resources = [];
    if (['img', 'script', 'source', 'video', 'audio', 'iframe'].includes(el.name) && a.src) resources.push(a.src);
    if (el.name === 'video' && a.poster) resources.push(a.poster);
    if (a.srcset) resources.push(...a.srcset.split(',').map((part) => part.trim().split(/\s+/)[0]));
    if (el.name === 'link' && a.href && tokens(a.rel).some((rel) => /^(stylesheet|icon|preload|modulepreload|apple-touch-icon|manifest)$/.test(rel)))
      resources.push(a.href);
    // Islands fail silently in the browser when their scripts are missing.
    if (el.name === 'astro-island') resources.push(a['component-url'], a['renderer-url']);
    for (const src of resources.filter(Boolean)) {
      assetCount += 1;
      if (/^(https?:)?\/\//i.test(src)) fail(file, `<${el.name}> loads third-party resource "${src}"`);
      else if (!src.startsWith('data:')) checkLocalTarget(file, src, `<${el.name}> resource`);
    }
  }
}

// Stylesheets: fonts and images referenced from CSS must exist.
for (const file of files.filter((name) => name.endsWith('.css'))) {
  for (const [, , ref] of read(file).matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
    if (ref.startsWith('data:') || ref.startsWith('#')) continue;
    assetCount += 1;
    if (/^(https?:)?\/\//i.test(ref)) fail(file, `loads third-party resource "${ref}"`);
    else if (!resolveFile(new URL(ref, `${ORIGIN}/${file}`).pathname)) fail(file, `url(${ref}) does not resolve`);
  }
}

for (const file of files.filter((name) => name.endsWith('.svg'))) checkXml(file, read(file), 'svg');

if (!pages.has('404.html')) fail('404.html', 'is missing');
else if (!tokens(meta(pages.get('404.html').doc, 'name', 'robots')).includes('noindex')) fail('404.html', 'must be noindex');

// Sitemap must list exactly the pages whose canonical URL is their own address.
if (!fileSet.has('sitemap.xml')) fail('sitemap.xml', 'is missing');
else {
  const xml = read('sitemap.xml');
  checkXml('sitemap.xml', xml, 'urlset');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  for (const loc of locs) if (!indexable.has(loc)) fail('sitemap.xml', `${loc} is not an indexable page`);
  for (const canonical of indexable.keys()) if (!locs.includes(canonical)) fail('sitemap.xml', `missing ${canonical}`);
}

if (!fileSet.has('robots.txt')) fail('robots.txt', 'is missing');
else if (!read('robots.txt').includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt', 'must reference the sitemap');

if (!fileSet.has('llms.txt')) fail('llms.txt', 'is missing');
else {
  const llms = read('llms.txt');
  if (!llms.startsWith('# Withso\n')) fail('llms.txt', 'must start with "# Withso"');
  if (!/^> \S/m.test(llms)) fail('llms.txt', 'needs a "> " summary line');
  for (const [, href] of llms.matchAll(/\]\((https:\/\/withso\.com[^)\s]*)\)/g)) {
    const url = new URL(href);
    const target = resolveFile(url.pathname);
    if (!target) fail('llms.txt', `${href} does not resolve to a page`);
    else if (url.hash && !pages.get(target)?.ids.has(url.hash.slice(1))) fail('llms.txt', `${href} points to a missing anchor`);
  }
}

for (const file of files) {
  const name = file.split('/').pop();
  if (name.startsWith('.') || /\.(map|env|log|zip|tar|gz|tgz|bak|tmp)$/i.test(name)) fail(file, 'should not be published');
}

if (errors.length) {
  console.error(`Site validation failed with ${errors.length} problem${errors.length === 1 ? '' : 's'}:`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `Site validation passed: ${pages.size} pages, ${indexable.size} in the sitemap, ${linkCount} links and ${assetCount} asset references checked.`,
);
