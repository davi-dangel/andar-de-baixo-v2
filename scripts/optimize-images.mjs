import { createHash } from 'node:crypto';
import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const widths = [360, 720, 1600];
const quality = 78;
const hash = data => createHash('sha256').update(data).digest('hex').slice(0, 20);
const recipe = hash(JSON.stringify({ widths, quality, autoOrient: true, sharp: sharp.versions.sharp }));

class UnavailableSourceError extends Error {}
class RetryableDownloadError extends Error {}

async function writeAtomic(path, data) {
  await writeFile(`${path}.tmp`, data);
  await rename(`${path}.tmp`, path);
}

async function readOptional(path) {
  try {
    return await readFile(path);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

export async function createVariants(input, outputDirectory) {
  const variants = [];
  for (const target of widths) {
    const { data, info } = await sharp(input)
      .autoOrient()
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer({ resolveWithObject: true });
    if (variants.some(variant => variant.width === info.width)) continue;
    const filename = `${hash(data)}.webp`;
    await writeAtomic(resolve(outputDirectory, filename), data);
    variants.push({ src: `gallery/${filename}`, width: info.width, height: info.height });
  }
  const largest = variants.at(-1);
  const thumbnail = variants.find(variant => variant.width >= 720) ?? largest;
  return {
    width: largest.width,
    height: largest.height,
    src: largest.src,
    thumbnailSrc: thumbnail.src,
    srcset: variants.map(variant => `${variant.src} ${variant.width}w`).join(', ')
  };
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export async function loadSource(source, cacheDirectory) {
  if (!/^https?:\/\//i.test(source)) {
    const publicRoot = resolve(root, 'public');
    const path = resolve(publicRoot, source.replace(/^\/+/, ''));
    if (!path.startsWith(`${publicRoot}${sep}`)) {
      throw new Error(`Image must be inside public: ${source}`);
    }
    return readFile(path);
  }
  const cachePath = resolve(cacheDirectory, hash(source));
  const cached = await readOptional(cachePath);
  if (cached) return cached;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(source, { signal: AbortSignal.timeout(120000) });
      if (response.status === 404 || response.status === 410) {
        throw new UnavailableSourceError(`HTTP ${response.status} loading ${source}`);
      }
      if (response.status >= 500 || response.status === 408 || response.status === 429) {
        throw new RetryableDownloadError(`HTTP ${response.status} loading ${source}`);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status} loading ${source}`);
      const input = Buffer.from(await response.arrayBuffer());
      await writeAtomic(cachePath, input);
      return input;
    } catch (error) {
      const retryable = error instanceof RetryableDownloadError ||
        error instanceof TypeError || error.name === 'TimeoutError' || error.name === 'AbortError';
      if (!retryable || attempt === 3) throw error;
      console.warn(`Download attempt ${attempt} failed for ${source}: ${error.message}. Retrying...`);
      await setTimeout(attempt * 1000);
    }
  }
}

async function main() {
  const articles = JSON.parse(await readFile(resolve(root, 'src/assets/articles.db.json'), 'utf8'));
  const sources = [...new Set(articles.flatMap(article =>
    article.pages.flatMap(page => page.content
      .filter(block => block.type === 'GALLERY')
      .flatMap(block => (block.value ?? []).flatMap(image =>
        [image.src, image.thumbnailSrc].filter(Boolean))))))].sort();
  const outputDirectory = resolve(root, 'public/gallery');
  const cacheDirectory = resolve(root, '.cache/gallery');
  const manifestPath = resolve(root, 'src/assets/gallery-images.json');
  await mkdir(outputDirectory, { recursive: true });
  await mkdir(cacheDirectory, { recursive: true });
  const manifest = {};
  let next = 0;
  let generated = 0;
  let unavailable = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (next < sources.length) {
      const source = sources[next++];
      const metadataPath = resolve(cacheDirectory, `${hash(source)}.json`);
      const metadata = JSON.parse((await readOptional(metadataPath))?.toString() ?? 'null');
      const entry = metadata?.recipe === recipe ? metadata.image : undefined;
      const files = entry?.srcset.split(', ').map(candidate => candidate.split(' ')[0]) ?? [];
      if (/^https?:\/\//i.test(source) && files.length &&
          (await Promise.all(files.map(file => exists(resolve(root, 'public', file))))).every(Boolean)) {
        manifest[source] = entry;
        continue;
      }
      try {
        manifest[source] = await createVariants(await loadSource(source, cacheDirectory), outputDirectory);
        await writeAtomic(metadataPath, JSON.stringify({ recipe, image: manifest[source] }));
      } catch (error) {
        if (error instanceof UnavailableSourceError) {
          console.warn(`${error.message}; retaining the original URL (image unavailable).`);
          unavailable++;
          continue;
        }
        throw new Error(`Could not optimize ${source}`, { cause: error });
      }
      generated++;
      if (generated % 25 === 0) console.log(`Optimized ${generated} images...`);
    }
  }));
  const ordered = Object.fromEntries(sources
    .filter(source => manifest[source])
    .map(source => [source, manifest[source]]));
  await writeAtomic(manifestPath, `${JSON.stringify(ordered, null, 2)}\n`);
  console.log(`Gallery ready: ${Object.keys(ordered).length} optimized sources, ${generated} regenerated, ${unavailable} unavailable.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
