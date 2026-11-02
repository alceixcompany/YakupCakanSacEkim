const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
require.extensions['.ts'] = (module, filename) => {
  const original = module.require;
  module.require = function(id) {
    if (id === 'react') return { cache: fn => fn };
    if (id === 'next/navigation') return { unstable_rethrow() {} };
    return original.call(this, id.startsWith('@/') ? path.join(root, 'src', id.slice(2) + (id.endsWith('.json') ? '' : '.ts')) : id);
  };
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, filename);
};
process.env.NEXT_PUBLIC_CONTENT_SOURCE = 'firebase';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'demo-ui-migration';
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
const content = require('../src/lib/publicContent.ts');
const starter = require('../src/data/hair-content.json');
let collections = {}; let fail = false;
function encode(value) {
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return { integerValue: String(value) };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([key, child]) => [key, encode(child)])) } };
}
global.fetch = async (url, options) => {
  assert.equal(options.method, 'POST');
  assert.equal(options.cache, 'no-store');
  assert(!options.headers.Authorization, 'Public content must use published-only access');
  const query = JSON.parse(options.body).structuredQuery;
  assert.equal(query.where.fieldFilter.field.fieldPath, 'isActive');
  assert.equal(query.where.fieldFilter.value.booleanValue, true);
  if (fail) return Response.json({}, { status: 503 });
  return Response.json((collections[query.from[0].collectionId] || []).filter(row => row.isActive).map(({id, ...data}) => ({ document: { name: `projects/demo/databases/(default)/documents/collection/${id}`, fields: encode(data).mapValue.fields } })));
};
const state = { id: content.PUBLIC_CONTENT_STATE_ID, brand: 'yakup-cakan', contentKind: 'site-state', isActive: true };
(async () => {
  assert.equal((await content.getPublishedPosts()).length, 3, 'Initial template posts');
  assert.equal((await content.getPublishedGallery()).length, 4, 'Initial template gallery');
  collections = { haberler: [state] };
  assert.deepEqual(await content.getPublishedPosts(), [], 'Deleted/unpublished cloud posts must not return from template');
  assert.deepEqual(await content.getPublishedGallery(), [], 'Deleted/unpublished cloud gallery must not return from template');
  const post = { ...starter.haberler[0], title: 'Yönetim panelinden güncel başlık', imageUrl: '/api/media/12345678-1234-1234-1234-123456789abc' };
  collections = { haberler: [state, post, { ...starter.haberler[1], isActive: false }, { ...starter.haberler[2], brand: 'parfum-bahari' }], gallery_items: starter.gallery_items, gallery_categories: starter.gallery_categories };
  const posts = await content.getPublishedPosts();
  assert.equal(posts.length, 1); assert.equal(posts[0].title, post.title); assert.equal(posts[0].image, post.imageUrl);
  assert.equal((await content.getPublishedGallery()).length, 4);
  collections.gallery_categories = [];
  assert.deepEqual(await content.getPublishedGallery(), [], 'Unpublished categories hide their photos');
  fail = true;
  const warning = console.warn; console.warn = () => {};
  try { assert.deepEqual(await content.getPublishedPosts(), [], 'Cloud failure must not resurrect template'); } finally { console.warn = warning; }
  assert.equal(content.safeImage('javascript:alert(1)'), '/images/editorial/portrait-1600.webp');
  assert.equal(content.safeImage('/images/editorial/atelier-1190.webp'), '/images/editorial/atelier-1190.webp');
  process.env.NEXT_PUBLIC_CONTENT_SOURCE = 'static';
  delete require.cache[require.resolve('../src/lib/publicContent.ts')];
  delete require.cache[require.resolve('../src/lib/contentSource.ts')];
  const offline = require('../src/lib/publicContent.ts');
  assert.equal((await offline.getPublishedPosts()).length, 3, 'Explicit offline mode');
  assert.equal((await offline.getPublishedGallery()).length, 4);
  const adapted = await require('../src/lib/hair/content.ts').getHairArticles();
  const original = require('../src/lib/hair/blog.ts').articles;
  assert.deepEqual(adapted.map(article => article.sections), original.map(article => article.sections), 'The backend adapter must preserve every supplied article section and paragraph');
  const gallery = await require('../src/lib/hair/content.ts').getHairGallery();
  assert.deepEqual(gallery.map(photo => photo.id), require('../src/lib/hair/media.ts').photos.map(photo => photo.id), 'Reference image filenames must remain valid after adapting record IDs');
  console.log('PASS: initial template, Firebase edits and uploads, brand isolation, hidden/deleted content, hidden categories, cloud failures, image validation and offline mode. No remote writes.');
})().catch(error => { console.error(error); process.exitCode = 1; });
