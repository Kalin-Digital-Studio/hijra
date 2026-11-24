import { readFile, writeFile } from 'node:fs/promises';

const lockPath = process.argv[2] ?? 'package-lock.json';
const directory = process.argv[3] ?? '.expo/license-review';
const filename = directory + '/evidence.json';
const evidence = JSON.parse(await readFile(filename, 'utf8'));
const upstream = new Map();
const lock = JSON.parse(await readFile(lockPath, 'utf8'));
const sdk = lock.packages[''].dependencies.expo.split('.')[0];
const sdkBranch = 'sdk-' + sdk;

function repoPath(url) {
  const match = String(url).match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?(?:\/|$)/i);
  return match?.[1];
}

async function fetchText(url) {
  if (!upstream.has(url)) {
    upstream.set(url, fetch(url, { signal: AbortSignal.timeout(15000) })
      .then(async (response) => response.ok ? response.text() : null)
      .catch(() => null));
  }
  return upstream.get(url);
}

const pending = evidence.filter(({ notices = {}, name }) => !Object.keys(notices).length || name === 'expo-router');
const upstreamRepos = {
  'fb-dotslash': 'meta/dotslash',
  'client-only': 'facebook/react',
  'server-only': 'facebook/react',
};
await Promise.all(Array.from({ length: 10 }, async () => {
  while (pending.length) {
    const item = pending.pop();
    const repo = upstreamRepos[item.name] ?? repoPath(item.officialSource);
    if (!repo) continue;
    const registry = 'https://registry.npmjs.org/' + encodeURIComponent(item.name) + '/' + item.version;
    const data = await fetchText(registry);
    const metadata = data ? JSON.parse(data) : {};
    const refs = [
      metadata.gitHead,
      repo === 'expo/expo' ? sdkBranch : undefined,
      repo === 'facebook/react-native' || repo === 'facebook/metro' ? 'v' + item.version : undefined,
      'v' + item.version,
      item.version,
      'main',
      'master',
    ].filter(Boolean);
    for (const ref of new Set(refs)) {
      const root = 'https://raw.githubusercontent.com/' + repo + '/' + ref + '/';
      const directory = metadata.repository?.directory;
      const files = [
        ...(directory ? ['LICENSE', 'LICENSE.md', 'LICENSE.txt'].map((name) => directory + '/' + name) : []),
        'LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE-MIT', 'COPYING', 'UNLICENSE',
      ];
      for (const file of files) {
        const url = root + file;
        const text = await fetchText(url);
        if (text?.trim()) {
          item.upstreamNotice = { url, text, ref, exact: ![sdkBranch, 'main', 'master'].includes(ref) };
          break;
        }
      }
      if (item.upstreamNotice) break;
    }
  }
}));

await writeFile(directory + '/upstream-evidence.json', JSON.stringify(evidence, null, 2));
const direct = { ...lock.packages[''].dependencies, ...lock.packages[''].devDependencies };
const missing = evidence.filter((item) => !Object.keys(item.notices ?? {}).length && !item.upstreamNotice);
console.log('Upstream notices recovered:', evidence.filter((item) => item.upstreamNotice).length);
console.log('No notice found by automated lookup:', missing.map((item) => item.name + '@' + item.version).join(', '));
console.log('Direct candidate versions:', Object.keys(direct).length);
