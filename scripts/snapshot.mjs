/**
 * `npm run snapshot -- <config.json>` — a static preview of the site from ONE captured document.
 *
 * Builds with `output: export`, then lays the result out so it works from any static host and
 * any base path: Arabic pages at the root, English under `en/`, every page directory carrying its
 * own copy of `_next/` (the export references assets relatively), and every internal link made
 * relative. The result is `site/`. Forms and the assistant's log are previews here; the live site
 * talks to Aamer.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const file = process.argv[2];
if (!file || !existsSync(file)) { console.error('usage: npm run snapshot -- <captured config.json>'); process.exit(1); }

// The middleware and the catch-all route are live-only; a static export has neither.
const aside = [['src/middleware.ts', '.snapshot-aside/middleware.ts'], ['src/app/[lang]/[...rest]', '.snapshot-aside/rest']];
// The article route: the live file answers any slug; the export needs the slugs, so its variant takes the file's place.
const ARTICLE = 'src/app/[lang]/blog/[slug]/page.tsx', ARTICLE_SNAPSHOT = 'src/app/[lang]/blog/[slug]/page.snapshot.tsx', ARTICLE_ASIDE = '.snapshot-aside/article-page.tsx';
mkdirSync(join(root, '.snapshot-aside'), { recursive: true });
for (const [a, b] of aside) if (existsSync(join(root, a))) renameSync(join(root, a), join(root, b));
renameSync(join(root, ARTICLE), join(root, ARTICLE_ASIDE)); cpSync(join(root, ARTICLE_SNAPSHOT), join(root, ARTICLE));
try {
  rmSync(join(root, 'out'), { recursive: true, force: true });
  execSync('npx next build', { stdio: 'inherit', env: { ...process.env, STOREFRONT_SNAPSHOT: '1', STOREFRONT_SNAPSHOT_FILE: join(root, file), NEXT_PUBLIC_SNAPSHOT: '1' } });
} finally {
  for (const [a, b] of aside) if (existsSync(join(root, b))) renameSync(join(root, b), join(root, a));
  if (existsSync(join(root, ARTICLE_ASIDE))) { rmSync(join(root, ARTICLE), { force: true }); renameSync(join(root, ARTICLE_ASIDE), join(root, ARTICLE)); }
}

const out = join(root, 'out'), site = join(root, 'site');
rmSync(site, { recursive: true, force: true }); mkdirSync(site);
cpSync(join(out, 'ar'), site, { recursive: true });
cpSync(join(out, 'en'), join(site, 'en'), { recursive: true });

// Some static hosts reserve top-level names starting with `_`, so the export's `_next` is published
// as `nx`; every reference (HTML, CSS and webpack's public path) is rewritten to match below.
const ASSETS = 'nx';
const walk = (dir) => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(site).filter((p) => p.endsWith('.html'));
for (const page of pages) {
  const dir = dirname(page);
  const up = relative(dir, site) === '' ? './' : `${relative(dir, site).split('/').map(() => '..').join('/')}/`;
  // Assets: each page directory carries the export's `_next` and the icon, so `./_next/...` resolves.
  if (!existsSync(join(dir, ASSETS))) cpSync(join(out, '_next'), join(dir, ASSETS), { recursive: true });
  if (!existsSync(join(dir, 'icon.svg'))) cpSync(join(out, 'icon.svg'), join(dir, 'icon.svg'));
  let html = readFileSync(page, 'utf8');
  // Links: /ar/x → x (root), /en/x → en/x, both relative to this page; /icon.svg → icon.svg here.
  html = html.replace(/(href|src)="\/ar(\/[^"#?]*)?(\/)?([#?][^"]*)?"/g, (_, attr, path = '', _slash, tail = '') => `${attr}="${up}${path.replace(/^\//, '')}${path && !path.endsWith('/') ? '/' : ''}${tail}"`.replace(`"${up}"`, `"${up}"`))
    .replace(/(href|src)="\/en(\/[^"#?]*)?(\/)?([#?][^"]*)?"/g, (_, attr, path = '', _slash, tail = '') => `${attr}="${up}en${path}${path && !path.endsWith('/') ? '/' : path ? '' : '/'}${tail}"`)
    .replace(/href="\/icon\.svg"/g, 'href="./icon.svg"');
  writeFileSync(page, html);
}
// Rename the asset path in every text file, and spell U+FFFD (a literal inside Next's polyfills)
// as a JS escape: the same string at runtime, and acceptable to hosts that reject the raw character.
for (const f of walk(site).filter((p) => /\.(html|js|css|txt)$/.test(p))) {
  const before = readFileSync(f, 'utf8');
  const after = before.replaceAll('_next/', `${ASSETS}/`).replaceAll('\uFFFD', '\\uFFFD');
  if (after !== before) writeFileSync(f, after);
}
console.log(`snapshot ready: ${pages.length} pages under site/ (${walk(site).length} files)`);
