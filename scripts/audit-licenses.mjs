import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';

const lockPath = process.argv[2] ?? 'package-lock.json';
const cache = '.expo/license-review';
const outputDirectory = process.argv[3] ?? cache;
const lock = JSON.parse(await readFile(lockPath, 'utf8'));
await mkdir(cache, { recursive: true });
await mkdir(outputDirectory, { recursive: true });

function readArchive(compressed) {
  const archive = gunzipSync(compressed);
  const files = new Map();
  for (let offset = 0; offset + 512 <= archive.length;) {
    const header = archive.subarray(offset, offset + 512);
    const field = (start, length) => header.toString('utf8', start, start + length).split('\0')[0].trim();
    const name = field(0, 100);
    if (!name) break;
    const size = Number.parseInt(field(124, 12) || '0', 8);
    if (!Number.isSafeInteger(size) || size < 0) throw new Error('Invalid tar size');
    const prefix = field(345, 155);
    const path = prefix ? prefix + '/' + name : name;
    if (/^[^/]+\/package\.json$/.test(path) || /(?:^|\/)(?:(?:open.source.|third.party.)?(?:licen[cs]es?|notices?)|apache license|copying|copyright|patents)(?:$|[_. -])/i.test(path)) {
      files.set(path, archive.toString('utf8', offset + 512, offset + 512 + size));
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
}

async function inspect({ name, version, resolved, integrity }) {
  if (!resolved?.startsWith('https://registry.npmjs.org/') || !integrity) {
    throw new Error('Missing registry source or integrity');
  }
  const [algorithm, digest] = integrity.split('-', 2);
  const filename = cache + '/v2-' + createHash('sha256').update(integrity).digest('hex') + '.json';
  try {
    return JSON.parse(await readFile(filename, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const response = await fetch(resolved, { signal: AbortSignal.timeout(90000) });
  if (!response.ok) throw new Error('Registry response ' + response.status);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (createHash(algorithm).update(buffer).digest('base64') !== digest) throw new Error('Integrity mismatch');
  const files = readArchive(buffer);
  const manifestPath = [...files.keys()].find((path) => /^[^/]+\/package\.json$/.test(path));
  const metadata = JSON.parse(files.get(manifestPath));
  if (metadata.name !== name || metadata.version !== version) throw new Error('Unexpected package identity');
  files.delete(manifestPath);
  const record = {
    name, version, resolved,
    officialSource: metadata.repository?.url ?? metadata.repository ?? metadata.homepage ?? resolved,
    license: metadata.license ?? metadata.licenses ?? null,
    notices: Object.fromEntries(files),
  };
  await writeFile(filename, JSON.stringify(record));
  return record;
}

const versions = new Map();
for (const [path, entry] of Object.entries(lock.packages)) {
  if (!path || !path.includes('node_modules/') || entry.link) continue;
  const name = entry.name ?? path.split('node_modules/').at(-1);
  versions.set(name + '@' + entry.version, { ...entry, name });
}
const entries = [...versions];
const results = [];
await Promise.all(Array.from({ length: 12 }, async () => {
  while (entries.length) {
    const [key, entry] = entries.pop();
    try {
      results.push(await inspect(entry));
    } catch (error) {
      results.push({ name: entry.name, version: entry.version, error: error.message });
      console.error(key, error.message);
    }
  }
}));
results.sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version));
await writeFile(outputDirectory + '/evidence.json', JSON.stringify(results, null, 2));
const missing = results.filter((item) => !item.notices || !Object.keys(item.notices).length || !item.license);
console.log('Registry artifacts reviewed for evidence:', results.length);
console.log('Entries requiring additional source or notice review:', missing.length);
for (const item of missing) console.log(item.name, item.version, JSON.stringify(item.license), item.error ?? '');
if (results.some((item) => item.error)) process.exitCode = 1;
