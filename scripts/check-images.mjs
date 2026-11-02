import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base = process.argv[2] || 'http://localhost:3000';
const assets = JSON.parse(readFileSync(new URL('../src/data/image-assets.json', import.meta.url), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (let start = 0; start < assets.length; start += 6) {
  await Promise.all(assets.slice(start, start + 6).map(async asset => {
    const bytes = readFileSync(new URL(`../${asset.path}`, import.meta.url));
    assert.equal(hash(bytes), asset.sha256, `${asset.path}: must match the ZIP original`);
    const response = await fetch(base + asset.url);
    assert.equal(response.status, 200, `${asset.url}: HTTP status`);
    assert.match(response.headers.get('content-type') || '', /^image\//, `${asset.url}: image MIME type`);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), asset.sha256, `${asset.url}: served bytes`);
  }));
}
console.log(`PASS: all ${assets.length} ZIP image assets, including original PNGs, match their source checksums and load over HTTP.`);
