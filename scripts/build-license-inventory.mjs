import { readFile, readdir, writeFile } from 'node:fs/promises';

const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const evidence = JSON.parse(await readFile('.expo/license-review/upstream-evidence.json', 'utf8'));
const versionKey = (name, version) => name + '@' + version;
const byPackage = new Map(evidence.map((item) => [versionKey(item.name, item.version), item]));
const resolved = new Map();
const installed = new Set();
const direct = new Map(Object.entries({
  ...lock.packages[''].dependencies, ...lock.packages[''].devDependencies,
}));
const purposes = {
  '@expo/metro-runtime': 'Metro runtime',
  '@types/react': 'Tipe TypeScript untuk React',
  eslint: 'Lint',
  'eslint-config-expo': 'Aturan lint Expo',
  expo: 'SDK, tooling, dan runtime Expo',
  'expo-constants': 'Metadata aplikasi',
  'expo-doctor': 'Pemeriksaan kompatibilitas proyek',
  'expo-file-system': 'Penyimpanan avatar lokal',
  'expo-image-picker': 'Pemilih foto profil perangkat',
  'expo-linking': 'Deep linking untuk Expo Router',
  'expo-router': 'Navigasi berbasis route',
  'expo-sqlite': 'Database lokal',
  'expo-splash-screen': 'Splash native dan kontrol startup',
  'expo-status-bar': 'Tampilan status bar',
  'expo-system-ui': 'Preferensi tampilan sistem',
  i18next: 'Resource dan fallback terjemahan',
  react: 'Komponen dan state UI',
  'react-dom': 'Peer dependency Expo Router dan Metro yang dipatok sesuai SDK',
  'react-i18next': 'Integrasi React dan i18next',
  'react-native': 'Runtime dan komponen mobile',
  'react-native-gesture-handler': 'Peer native Expo Router, sesuai versi Expo Go',
  'react-native-reanimated': 'Peer native Expo Router, sesuai versi Expo Go',
  'react-native-safe-area-context': 'Safe area',
  'react-native-screens': 'Integrasi layar native',
  'react-native-worklets': 'Peer native Reanimated, sesuai versi Expo Go',
  typescript: 'Pemeriksaan tipe',
  zustand: 'State pengaturan runtime',
};

for (const [path, pkg] of Object.entries(lock.packages)) {
  if (!path.includes('node_modules/') || pkg.link) continue;
  const name = pkg.name ?? path.split('node_modules/').at(-1);
  const key = versionKey(name, pkg.version);
  resolved.set(path, key);
  if (!byPackage.has(key)) throw new Error('License evidence missing for ' + key);
  try {
    const manifest = JSON.parse(await readFile(path + '/package.json', 'utf8'));
    if (manifest.name !== name || manifest.version !== pkg.version) {
      throw new Error('Installed package differs from reviewed lockfile: ' + key);
    }
    installed.add(key);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
if (new Set(resolved.values()).size !== byPackage.size) {
  throw new Error('License evidence does not match the current lockfile');
}

function sources(map) {
  return [...(map.sources ?? []), ...(map.sections ?? []).flatMap(({ map: section }) => sources(section))];
}

const bundlePath = process.argv[2] ?? 'dist';
const bundles = (await readdir(bundlePath, { recursive: true })).filter((file) => file.endsWith('.map'));
if (!bundles.length) throw new Error('Expo export must include source maps');
const runtime = new Set();
const missing = new Set();

function packageLocation(path) {
  const parts = path.replaceAll('\\', '/').split('/');
  const start = parts.indexOf('node_modules');
  if (start < 0) return;
  const end = parts.lastIndexOf('node_modules');
  const nameParts = parts[end + 1]?.startsWith('@') ? 2 : 1;
  return parts.slice(start, end + nameParts + 1).join('/');
}

for (const bundle of bundles) {
  const map = JSON.parse(await readFile(bundlePath + '/' + bundle, 'utf8'));
  for (const path of sources(map)) {
    const location = packageLocation(path);
    if (!location) continue;
    const key = resolved.get(location);
    if (key) runtime.add(key);
    else missing.add(location);
  }
}
if (missing.size) throw new Error('Unresolved bundle paths: ' + [...missing].join(', '));

const materialSource = 'https://raw.githubusercontent.com/google/material-design-icons/10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7/';
const navigationNotice = 'https://raw.githubusercontent.com/react-navigation/react-navigation/77fad70cd6d9ed492d7ce30177efa923e95294cb/packages/elements/LICENSE';
const materialIcons = { 'arrow_right.xml': 'chevron_right', 'checkmark.xml': 'check' };
const assetMap = JSON.parse(await readFile(bundlePath + '/assetmap.json', 'utf8'));
const assets = new Map();
const localArtwork = new Set(['introduction.png', 'daily-worship.png', 'personal-growth.png']);
for (const { httpServerLocation, name, type } of Object.values(assetMap)) {
  const filename = name + '.' + type;
  const path = httpServerLocation + '/' + filename;
  const key = resolved.get(packageLocation(path));
  if (!key && /\/assets\/onboarding$/.test(httpServerLocation) && localArtwork.has(filename)) continue;
  if (!key && /\/assets\/branding$/.test(httpServerLocation) && filename === 'logo_hijra.png') continue;
  if (!key) throw new Error('Asset requires explicit license evidence: ' + path);
  const item = byPackage.get(key);
  const asset = { item, license: item.license, notice: null, origin: null };
  if (httpServerLocation === '/assets/node_modules/expo-router/assets' && Object.hasOwn(materialIcons, filename)) {
    asset.license = 'Apache-2.0';
    asset.origin = materialSource + 'src/navigation/' + materialIcons[filename] + '/materialicons/24px.svg';
    asset.notice = { name: 'Google Material Icons (Expo Router)', url: materialSource + 'LICENSE' };
  } else if (httpServerLocation === '/assets/node_modules/expo-router/assets/react-navigation/elements') {
    asset.license = 'MIT';
    asset.origin = 'https://registry.npmjs.org/@react-navigation/elements/-/elements-2.9.46.tgz';
    asset.notice = { name: 'React Navigation elements assets (Expo Router)', url: navigationNotice };
  }
  runtime.add(key);
  assets.set(path.replace(/^\/assets\/node_modules\//, ''), asset);
}

// Native modules used by this app may contribute no JS source map entry.
for (const name of [
  'expo', 'expo-constants', 'expo-linking', 'expo-sqlite', 'expo-system-ui', 'react-native',
  'react-native-gesture-handler', 'react-native-reanimated', 'react-native-safe-area-context',
  'react-native-screens', 'react-native-worklets',
]) {
  if (direct.has(name)) runtime.add(resolved.get('node_modules/' + name));
}
const imageLoader = resolved.get('node_modules/expo-image-loader');
if (direct.has('expo-image-picker') && imageLoader) runtime.add(imageLoader);

const notices = {};
for (const key of [...runtime].sort()) {
  const item = byPackage.get(key);
  if (!item) throw new Error('License evidence missing for ' + key);
  const texts = Object.entries(item.notices ?? {});
  if (item.upstreamNotice) texts.unshift([item.upstreamNotice.url, item.upstreamNotice.text]);
  if (!texts.length) throw new Error('Notice missing for a distributed dependency: ' + key);
  notices[key] = item.resolved + '\n\n' + texts.map(([source, text]) => source + '\n\n' + text.trim()).join('\n\n');
}
const sqliteHeader = await readFile('node_modules/expo-sqlite/vendor/sqlite3/sqlite3.h', 'utf8');
const sqliteVersion = /^#define SQLITE_VERSION\s+"([^"]+)"/m.exec(sqliteHeader)?.[1];
if (!sqliteVersion) throw new Error('SQLite version missing from the vendor header');
notices['SQLite ' + sqliteVersion] = 'SQLite source code is in the public domain.\nhttps://www.sqlite.org/copyright.html';
const assetNotices = new Map();
for (const { notice, origin } of assets.values()) {
  if (!notice) continue;
  const entry = assetNotices.get(notice.name) ?? { url: notice.url, origins: new Set() };
  entry.origins.add(origin);
  assetNotices.set(notice.name, entry);
}
for (const [name, { url, origins }] of assetNotices) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Could not retrieve asset license: ' + url);
  const text = await response.text();
  notices[name] = [...origins, url, '', text.trim()].join('\n');
}
await writeFile('src/constants/licenseNotices.ts',
  '// Generated from the license audit and native bundle source maps.\n' +
    'export const licenseNotices: Record<string, string> = ' + JSON.stringify(notices, null, 2) + ';\n');

const report = [
  '# Inventaris lisensi pihak ketiga',
  '',
  'Audit Phase 02 · 25 November 2026 · Expo ' + direct.get('expo') + '. Lockfile memuat ' + evidence.length + ' versi paket registry. ' + installed.size + ' versi registry terpasang di Windows. Paket yang khusus untuk platform lain tetap dicantumkan. Riwayat audit Phase 01 tercatat di [Development Progress](DEVELOPMENT_PROGRESS.md).',
  '',
  'Teks untuk dependensi yang dirujuk bundle Android dan iOS tersedia di **Profil > Tentang Aplikasi > Lisensi Pihak Ketiga**. Ikon tab memakai karakter Unicode dengan font sistem. Aplikasi tidak menambahkan paket ikon, font eksternal, atau dataset eksternal.',
  '',
  'Product Owner menyetujui penggunaan [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/) khusus Lightning CSS dan binari platformnya sebagai build tooling pada 24 November 2026. Audit SDK 58 menggunakan opsi BSD-3-Clause untuk node-forge dan opsi MIT untuk fb-dotslash serta type-fest.',
  '',
  'Expo CLI memakai modul LAN-only lokal untuk tunnel WebContainer. Resolusi untuk jimp-compact menunjuk ke distribusi npm Jimp 0.16.13 agar dependensi image tooling muncul di lockfile. Font Open Sans yang ikut di arsip Jimp adalah aset build tooling dan tidak dibundel ke aplikasi.',
  '',
  'Untuk build store mandiri, audit lagi komponen native, artefak CocoaPods/Gradle, aset, dan notice pada hasil build aktual. Expo Go menyediakan binary native pengujian.',
  '',
  '| Paket atau aset | Versi | Tujuan | Sumber resmi dan bukti | Lisensi | Komersial | Redistribusi | Atribusi dan notice | Status |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
];

for (const item of evidence) {
  const key = versionKey(item.name, item.version);
  const license = item.name === 'exif-parser' ? 'MIT' : item.name === 'qrcode-terminal' ? 'Apache-2.0' :
    Array.isArray(item.license) ? item.license.map(({ type }) => type).join(', ') : item.license;
  if (!license) throw new Error('License not mapped for ' + key);
  const kind = purposes[item.name] ? 'Langsung · ' + purposes[item.name] : 'Transitif';
  const source = '[Tarball resmi](' + item.resolved + ')' +
    (item.upstreamNotice ? ' · [Notice upstream](' + item.upstreamNotice.url + ')' : '');
  const isRuntime = runtime.has(key);
  const archived = Object.keys(item.notices ?? {}).length;
  let attribution = archived ? 'Notice pada arsip' : 'Ketentuan lisensi pada manifest resmi';
  if (item.upstreamNotice) attribution += ' dan notice upstream';
  if (isRuntime) attribution += ' · disertakan di aplikasi';
  if (item.name === 'caniuse-lite') attribution = '[Can I Use](https://caniuse.com/) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) · data tooling, tidak didistribusikan';
  if (license === 'MPL-2.0') attribution += ' · file-level copyleft, tooling';
  const status = (installed.has(key) ? 'Terpasang' : 'Terkunci, tidak terpasang di host') +
    (license === 'MPL-2.0' ? ' · disetujui Product Owner' : ' · lisensi ditinjau');
  report.push('| ' + [item.name, item.version, kind, source, license, 'Ya', 'Ya, sesuai ketentuan', attribution, status].join(' | ') + ' |');
}
for (const [path, { item, license, origin, notice }] of [...assets.entries()].sort()) {
  const source = '[Tarball resmi](' + item.resolved + ')' + (origin ? ' · [Aset asal](' + origin + ')' : '');
  const attribution = notice ? 'Notice aset tersedia di aplikasi' : 'Notice paket tersedia di aplikasi';
  report.push('| `' + path + '` | ' + item.version + ' | Aset UI paket ' + item.name +
    ' | ' + source + ' | ' + license +
    ' | Ya | Ya, sesuai ketentuan | ' + attribution + ' | Diverifikasi, dibundel |');
}
report.push(
  '| SQLite | ' + sqliteVersion + ' | Mesin database native | [SQLite](https://www.sqlite.org/copyright.html) | Public domain | Ya | Ya | Pernyataan public domain tersedia di aplikasi | Diverifikasi |',
  '| Open Sans | Aset arsip Jimp 0.16.13 | Font internal tooling gambar | [Arsip resmi Jimp](https://registry.npmjs.org/jimp/-/jimp-0.16.13.tgz) | Apache-2.0 | Ya | Ya, sesuai ketentuan | Apache License.txt di arsip | Terpasang sebagai aset tooling |',
  '',
  '## Aset lokal Phase 02',
  '',
  'Ilustrasi sementara untuk onboarding dibuat dari bentuk geometris khusus untuk proyek. Logo diberikan oleh Product Owner. Konfirmasi asal pembuatan dan hak distribusi logo perlu dicatat sebelum publikasi.',
  '',
  '| Berkas | Penggunaan | Provenans | Status |',
  '| --- | --- | --- | --- |',
  '| `assets/branding/logo_hijra.png` | Startup, onboarding, splash native dan ikon aplikasi | Logo yang diberikan Product Owner untuk Hijra | Terpasang. Asal pembuatan dan hak distribusi komersial belum terdokumentasi. |',
  '| `assets/onboarding/introduction.png` | Slide pendamping ibadah | Ilustrasi orisinal proyek | Sementara |',
  '| `assets/onboarding/daily-worship.png` | Slide ibadah harian | Ilustrasi orisinal proyek | Sementara |',
  '| `assets/onboarding/personal-growth.png` | Slide jurnal dan kebiasaan | Ilustrasi orisinal proyek | Sementara |',
  '',
  'Modul LAN-only di `tools/lan-only-ws-tunnel/` adalah kode proyek lokal. Nama dependensi pada lockfile mengikuti nama modul yang diimpor Expo CLI.',
  '',
);
await writeFile('docs/THIRD_PARTY_LICENSES.md', report.join('\n'));
console.log('Recorded ' + evidence.length + ' dependency versions, ' + installed.size + ' installed versions, ' + assets.size + ' bundled asset families and ' + Object.keys(notices).length + ' in-app notices.');
