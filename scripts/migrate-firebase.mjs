import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

process.loadEnvFile(new URL('../.env.local', import.meta.url));
const root = new URL('../', import.meta.url);
const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const requestedProject = process.argv[process.argv.indexOf('--project') + 1];
const apply = process.argv.includes('--apply');
if (!project || !key || requestedProject !== project) throw Error('Pass --project with the exact configured project ID. Add --apply to upload.');
const base = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`;
const prefix = base.replace('https://firestore.googleapis.com/v1/', '');
const assets = JSON.parse(await readFile(new URL('src/data/image-assets.json', root), 'utf8'));
const starter = JSON.parse(await readFile(new URL('src/data/hair-content.json', root), 'utf8'));
const now = new Date().toISOString();
const limit = 700 * 1024;
const images = {};
const media = new Map();
let originalBytes = 0;
for (const asset of assets) {
  const source = await readFile(new URL(asset.path, root));
  if (createHash('sha256').update(source).digest('hex') !== asset.sha256) throw Error(`Source checksum mismatch: ${asset.path}`);
  originalBytes += source.length;
  let bytes = source;
  let metadata = await sharp(source).metadata();
  if (metadata.format !== 'webp' || source.length > limit || metadata.width > 2400 || metadata.height > 2400) {
    for (const quality of [90, 82, 74, 64, 52]) {
      bytes = await sharp(source).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality, lossless: source.length < 50000 }).toBuffer();
      if (bytes.length <= limit) break;
    }
    metadata = await sharp(bytes).metadata();
  }
  if (bytes.length > limit || !metadata.width || !metadata.height || metadata.width > 2400 || metadata.height > 2400) throw Error(`Image exceeds Firestore rules: ${asset.path}`);
  const hash = createHash('sha256').update(bytes).digest('hex');
  const id = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
  images[asset.url] = `/api/media/${id}`;
  media.set(id, { bytes, hash, width: metadata.width, height: metadata.height });
}
const compressedBytes = [...media.values()].reduce((sum, item) => sum + item.bytes.length, 0);
console.log(`${assets.length} asset paths → ${media.size} unique WebP documents. ${(originalBytes / 1048576).toFixed(2)} MiB → ${(compressedBytes / 1048576).toFixed(2)} MiB. Largest: ${Math.max(...[...media.values()].map(item => item.bytes.length))} bytes.`);
const report = { project, sourceAssets: assets.length, mediaDocuments: media.size, originalBytes, compressedBytes, images, media: [...media].map(([id, item]) => ({ id, sha256: item.hash, bytes: item.bytes.length, width: item.width, height: item.height })) };
await mkdir(new URL('artifacts/', root), { recursive: true });
await writeFile(new URL('artifacts/firebase-media-prepared.json', root), JSON.stringify(report, null, 2));
if (!apply) process.exit(0);

const credentialsPath = new URL('artifacts/sacekim-admin-login.json', root);
if ((await stat(credentialsPath)).mode & 0o077) throw Error('Credential file must be private (chmod 600).');
const credentials = JSON.parse(await readFile(credentialsPath, 'utf8'));
if (credentials.projectId !== project) throw Error('Credential project mismatch.');
const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(key)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: credentials.email, password: credentials.password, returnSecureToken: true }), signal: AbortSignal.timeout(20000) });
const auth = await authResponse.json();
if (!authResponse.ok || !auth.idToken || auth.localId !== credentials.uid) throw Error(`Firebase login failed: ${auth.error?.message || authResponse.status}`);
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.idToken}` };
async function request(path, init = {}) {
  const response = await fetch(`${base}${path}?key=${encodeURIComponent(key)}`, { ...init, headers, signal: AbortSignal.timeout(60000) });
  const body = await response.json();
  if (!response.ok && response.status !== 404) throw Error(`Firestore ${path}: ${response.status} ${body.error?.message || ''}`);
  return response.status === 404 ? null : body;
}
const admin = await request(`/admins/${credentials.uid}`);
if (admin?.fields?.isAdmin?.booleanValue !== true) throw Error('The new account needs its admins/<uid>.isAdmin role before bulk import.');
function encode(value) {
  if (Buffer.isBuffer(value)) return { bytesValue: value.toString('base64') };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (value === null) return { nullValue: null };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([name, child]) => [name, encode(child)])) } };
}
function create(path, data) { return { update: { name: `${prefix}/${path}`, fields: encode(data).mapValue.fields }, currentDocument: { exists: false } }; }
async function commitChunks(writes) {
  let chunk = []; let size = 0;
  async function flush() { if (!chunk.length) return; await request(':commit', { method: 'POST', body: JSON.stringify({ writes: chunk }) }); console.log(`Committed ${chunk.length} records.`); chunk = []; size = 0; }
  for (const write of writes) {
    const length = Buffer.byteLength(JSON.stringify(write));
    if (size + length > 5 * 1024 * 1024 || chunk.length >= 100) await flush();
    chunk.push(write); size += length;
  }
  await flush();
}
const existingMedia = await Promise.all([...media].map(async ([id, item]) => {
  const existing = await request(`/media/${id}`);
  if (existing && createHash('sha256').update(Buffer.from(existing.fields.data.bytesValue, 'base64')).digest('hex') !== item.hash) throw Error(`Immutable media differs: ${id}`);
  return { id, item, existing };
}));
await commitChunks(existingMedia.filter(row => !row.existing).map(({ id, item }) => create(`media/${id}`, { data: item.bytes, contentType: 'image/webp', width: item.width, height: item.height, createdAt: now })));
// Publish content only after every referenced image exists. Existing edits are preserved.
const entries = Object.entries(starter).flatMap(([collection, records]) => records.map(({ id, ...data }) => ({ path: `${collection}/${id}`, data })));
entries.push({ path: 'haberler/yakup-cakan-content-state-v1', data: { brand: 'yakup-cakan', isActive: true, contentKind: 'site-state' } });
const writes = [];
let added = 0; let linked = 0;
for (const { path, data } of entries) {
  const existing = await request(`/${path}`);
  const mapped = Object.fromEntries(Object.entries(data).map(([name, value]) => [name, typeof value === 'string' && images[value] ? images[value] : value]));
  if (!existing) { writes.push(create(path, mapped)); added++; continue; }
  const patch = Object.fromEntries(Object.entries(data).filter(([name, value]) => typeof value === 'string' && images[value] && existing.fields?.[name]?.stringValue === value).map(([name, value]) => [name, images[value]]));
  if (Object.keys(patch).length) {
    writes.push({ update: { name: `${prefix}/${path}`, fields: encode(patch).mapValue.fields }, updateMask: { fieldPaths: Object.keys(patch) }, currentDocument: { updateTime: existing.updateTime } }); linked++;
  }
}
for (const [path, data] of [
  ['contact_info/yakup-cakan-media-manifest-v1', { brand: 'yakup-cakan', images, updatedAt: now }],
  ['admins/yakup-cakan-content-seed-v1', { kind: 'initial-content', completedAt: now }],
]) {
  const existing = await request(`/${path}`);
  if (!existing) writes.push(create(path, data));
  else if (path.startsWith('contact_info/')) {
    const previous = existing.fields?.images?.mapValue?.fields || {};
    const merged = { ...images, ...Object.fromEntries(Object.entries(previous).map(([name, value]) => [name, value.stringValue])) };
    writes.push({ update: { name: `${prefix}/${path}`, fields: encode({ ...data, images: merged }).mapValue.fields }, currentDocument: { updateTime: existing.updateTime } });
  }
}
await commitChunks(writes);
// Re-read every binary and validate its exact checksum after upload.
await Promise.all([...media].map(async ([id, item]) => {
  const stored = await request(`/media/${id}`);
  if (!stored || createHash('sha256').update(Buffer.from(stored.fields.data.bytesValue, 'base64')).digest('hex') !== item.hash) throw Error(`Uploaded media verification failed: ${id}`);
}));
for (const collection of Object.keys(starter)) {
  const result = await request(':runQuery', { method: 'POST', body: JSON.stringify({ structuredQuery: { from: [{ collectionId: collection }], where: { fieldFilter: { field: { fieldPath: 'isActive' }, op: 'EQUAL', value: { booleanValue: true } } } } }) });
  console.log(`${collection}: ${result.filter(row => row.document).length} published documents.`);
}
await writeFile(new URL('artifacts/firebase-migration-result.json', root), JSON.stringify({ ...report, completedAt: new Date().toISOString(), addedContent: added, linkedExistingContent: linked, uploadedMedia: existingMedia.filter(row => !row.existing).length, verifiedMedia: media.size }, null, 2));
console.log(`Completed ${project}: ${added} content documents created; ${linked} existing image records linked; all ${media.size} media checksums verified.`);
