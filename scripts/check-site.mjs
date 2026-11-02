import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
const base = process.argv[2] || 'http://localhost:3000';
const starter = JSON.parse(readFileSync(new URL('../src/data/hair-content.json', import.meta.url)));
const pages = ['/', '/hakkimizda', '/galeri', '/protez-sac-bakimi', '/blog', '/iletisim', '/gizlilik-politikasi', ...starter.haberler.map(post => `/blog/${post.slug}`)];
const images = new Set(['/brand/wordmark.png', '/brand/monogram.png', '/brand/logo-original.png']);
for (const folder of ['editorial', 'results']) for (const file of readdirSync(new URL(`../public/images/${folder}/`, import.meta.url))) images.add(`/images/${folder}/${file}`);
for (const row of [...starter.haberler, ...starter.gallery_items]) images.add(row.imageUrl);
for (const image of images) assert(existsSync(new URL(`../public${image}`, import.meta.url)), `Missing asset ${image}`);
const links = new Set(); let schemas = 0;
for (const path of pages) {
  const response = await fetch(base + path); assert.equal(response.status, 200, `${path} status`);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="tr"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one H1`);
  assert.match(html, /<title>[^<]*Yakup Çakan[^<]*<\/title>/);
  assert.match(html, /<meta name="description"/); assert.match(html, /<link rel="canonical"/);
  assert(!/Parfum Bahari|Fleur de Bahar|Santal Noir|Koku Günlüğü/.test(html), `${path}: previous public brand`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { JSON.parse(match[1]); schemas++; }
  for (const match of html.matchAll(/<a\b[^>]*href="([^"#]+)"/g)) {
    const target = match[1].replaceAll('&amp;', '&').split('#')[0];
    if (target.startsWith('/')) links.add(target);
  }
}
for (const path of links) if (!pages.includes(path)) assert.equal((await fetch(base + path)).status, 200, `Broken link ${path}`);
for (const image of images) assert.equal((await fetch(base + image)).status, 200, `Asset ${image}`);
for (const path of ['/blog/no-such-story', '/missing-page']) assert.equal((await fetch(base + path)).status, 404, `Missing route ${path}`);
const redirects = { '/about': '/hakkimizda', '/services': '/#hizmetler', '/gallery': '/galeri', '/contact': '/iletisim', '/haberler': '/blog', '/hizmetlerimiz': '/#hizmetler', '/teknik-servis': '/protez-sac-bakimi', '/urun-katalogu': '/iletisim', '/hizmet-bolgelerimiz': '/iletisim', '/haberler/ilk-gorusme-rehberi': '/blog/ilk-gorusme-rehberi', '/urun-katalogu/old-product': '/iletisim' };
for (const [old, target] of Object.entries(redirects)) { const response = await fetch(base + old, { redirect: 'manual' }); assert.equal(response.status, 308, old); assert.equal(response.headers.get('location'), target, old); }
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
for (const path of pages) if (path !== '/') assert(sitemap.includes(path), `Sitemap ${path}`);
assert(!sitemap.includes('/urun-katalogu'), 'Sitemap must only list current pages');
const manifest = await (await fetch(base + '/manifest.webmanifest')).json(); assert.equal(manifest.name, 'Yakup Çakan'); assert.equal(manifest.lang, 'tr');
const admin = await fetch(base + '/admin', { redirect: 'manual' }); assert([200, 307].includes(admin.status));
if (admin.status === 307) { assert.equal(new URL(admin.headers.get('location'), base).pathname, '/admin/login'); const login = await (await fetch(base + '/admin/login')).text(); assert(login.includes('Yakup Çakan')); assert(!login.includes('class="topbar"'), 'Public shell must not leak into admin'); }
assert.equal((await fetch(base + '/api/admin/session')).status, 401);
console.log(`PASS: ${pages.length} public pages, ${links.size} internal targets, ${images.size} assets, ${schemas} valid JSON-LD blocks, ${Object.keys(redirects).length} redirects, 404s, sitemap, manifest and admin boundary.`);
