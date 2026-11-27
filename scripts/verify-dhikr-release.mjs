import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const [directory = 'dist', mode = 'release'] = process.argv.slice(2);
assert(['release', 'preview'].includes(mode), 'Expected release or preview');
const marker = 'HIJRA_DHIKR_REVIEW_DRAFTS_V1';

for (const platform of ['android', 'ios']) {
  const root = join(directory, '_expo', 'static', 'js', platform);
  const files = await readdir(root);
  const bundles = files.filter((file) => /\.(?:hbc|js)$/.test(file));
  assert(bundles.length > 0, `Missing ${platform} bundle`);
  const maps = files.filter((file) => file.endsWith('.map'));
  assert(maps.length > 0, `Missing ${platform} source maps. Export with --source-maps external.`);
  const hasDrafts = (buffer) => buffer.includes(marker) || buffer.includes(Buffer.from(marker, 'utf16le'))
    || buffer.includes('review-drafts.dev.json') || buffer.includes('dhikrReviewContent.dev.ts');
  for (const file of [...bundles, ...maps]) {
    const data = await readFile(join(root, file));
    assert.equal(hasDrafts(data), mode === 'preview', `${platform}/${file}: unexpected review draft inclusion`);
  }
}
console.log(`Dhikr ${mode} bundle check passed on Android and iOS.`);
