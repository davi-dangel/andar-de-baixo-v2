import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { createServer } from 'node:http';
import test from 'node:test';
import sharp from 'sharp';
import { createVariants, loadSource } from './optimize-images.mjs';

test('creates responsive WebP files with oriented dimensions and no metadata', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'gallery-variants-'));
  t.after(() => rm(directory, { recursive: true }));
  const input = await sharp({
    create: { width: 2400, height: 1800, channels: 3, background: '#597063' }
  }).jpeg().withMetadata({ orientation: 6 }).toBuffer();

  const result = await createVariants(input, directory);
  assert.equal(result.width, 1600);
  assert.equal(result.height, 2133);
  const candidates = result.srcset.split(', ');
  assert.deepEqual(candidates.map(candidate => Number(candidate.split(' ')[1].slice(0, -1))), [360, 720, 1600]);
  assert.equal(result.thumbnailSrc, candidates[1].split(' ')[0]);
  assert.equal(result.src, candidates[2].split(' ')[0]);

  for (const candidate of candidates) {
    const [src, descriptor] = candidate.split(' ');
    const data = await readFile(join(directory, basename(src)));
    const metadata = await sharp(data).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, Number(descriptor.slice(0, -1)));
    assert.equal(metadata.height, Math.round(metadata.width * 4 / 3));
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.orientation, undefined);
    assert.ok(data.length < input.length, 'variant should be smaller than the original');
  }
});

test('does not upscale small images and versions changed image content', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'gallery-small-'));
  t.after(() => rm(directory, { recursive: true }));
  const input = background => sharp({
    create: { width: 240, height: 160, channels: 3, background }
  }).png().toBuffer();
  const first = await createVariants(await input('red'), directory);
  assert.equal(first.width, 240);
  assert.equal(first.height, 160);
  assert.equal(first.srcset, `${first.src} 240w`);
  assert.equal(first.thumbnailSrc, first.src);
  assert.equal((await readdir(directory)).length, 1);
  assert.deepEqual(await createVariants(await input('red'), directory), first);
  assert.notEqual((await createVariants(await input('blue'), directory)).src, first.src);
  await assert.rejects(createVariants(Buffer.from('not an image'), directory));
});

test('retries transient downloads, caches successes, and reports missing sources', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'gallery-download-'));
  t.after(() => rm(directory, { recursive: true }));
  let requests = 0;
  const server = createServer((request, response) => {
    requests++;
    if (request.url === '/missing') {
      response.writeHead(404).end();
    } else if (requests === 1) {
      response.writeHead(503).end();
    } else {
      response.end('image bytes');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const source = `http://127.0.0.1:${address.port}/photo`;
  assert.equal((await loadSource(source, directory)).toString(), 'image bytes');
  assert.equal(requests, 2);
  assert.equal((await loadSource(source, directory)).toString(), 'image bytes');
  assert.equal(requests, 2, 'cached sources should not be downloaded again');
  await assert.rejects(loadSource(`http://127.0.0.1:${address.port}/missing`, directory), /HTTP 404/);
  assert.equal(requests, 3, 'missing sources should not be retried');
});
