import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

process.loadEnvFile(new URL('../.env.local', import.meta.url));
const base = process.argv[2] || 'http://localhost:3000';
const report = JSON.parse(await readFile(new URL('../artifacts/firebase-migration-result.json', import.meta.url), 'utf8'));
assert.equal(report.project, process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
const rows = [...report.media];
// Bounded concurrency: check the actual public API, bytes and image dimensions.
const sharp = (await import('sharp')).default;
for (let offset = 0; offset < rows.length; offset += 5) await Promise.all(rows.slice(offset, offset + 5).map(async row => {
  const response = await fetch(`${base}/api/media/${row.id}`);
  assert.equal(response.status, 200, `Media ${row.id}`);
  assert.equal(response.headers.get('content-type'), 'image/webp');
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(createHash('sha256').update(bytes).digest('hex'), row.sha256);
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, row.width); assert.equal(metadata.height, row.height);
  assert(bytes.length <= 700 * 1024);
}));
for (const path of ['/', '/hakkimizda', '/galeri', '/blog', '/protez-sac-bakimi', '/iletisim']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, `Page ${path}`);
  const html = await response.text();
  const tags = [...html.matchAll(/<img\b[^>]+>/g)].map(match => match[0]);
  assert(tags.length > 0, `No images on ${path}`);
  assert(tags.every(tag => !/\b(?:src|srcSet)="\/(?:brand|images)\//.test(tag)), `Local image still displayed on ${path}`);
  assert(html.includes('/api/media/') || html.includes('%2Fapi%2Fmedia%2F'), `DB media missing on ${path}`);
}
const credentials = JSON.parse(await readFile(new URL('../artifacts/sacekim-admin-login.json', import.meta.url), 'utf8'));
const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: credentials.email, password: credentials.password, returnSecureToken: true }) });
assert.equal(response.status, 200, 'Firebase sign-in');
const identity = await response.json();
assert.equal(identity.localId, credentials.uid);
const login = await fetch(base + '/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: identity.idToken }) });
assert.equal(login.status, 200, 'Application login');
const account = await login.json();
assert.equal(account.user.uid, credentials.uid);
assert.equal(account.user.setupError, false);
const cookie = login.headers.get('set-cookie');
assert(cookie?.includes('HttpOnly')); assert(cookie?.includes('SameSite=strict'));
assert.equal((await fetch(base + '/api/admin/session', { headers: { Cookie: cookie.split(';')[0] } })).status, 200);
assert.equal((await fetch(base + '/api/admin/session')).status, 401);
await writeFile(new URL('../artifacts/firebase-migration-verification.json', import.meta.url), JSON.stringify({ project: report.project, verifiedAt: new Date().toISOString(), publicMedia: rows.length, pages: 6, authenticatedAdmin: credentials.uid, unauthenticatedDenied: true }, null, 2));
console.log(`PASS: ${rows.length} public media checksums and dimensions, 6 public pages using DB images, new administrator login, httpOnly session and anonymous denial.`);
