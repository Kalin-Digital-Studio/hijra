import assert from 'node:assert/strict';
globalThis.__DEV__ = true;
const { request } = await import('../src/services/islamic/client.ts');
const { parseQuranTranslations, quranTranslations } = await import('../src/services/islamic/myquran.ts');
const envelope = (value) => new globalThis.Response(JSON.stringify({status:true,data:value}));
const signal = () => new globalThis.AbortController().signal;
const ayah = (number) => ({ surah_number: 1, ayah_number: number, translation: 'Fixture ' + number });
const surah = { surah: 1, start: 1, end: 2, ayahs: [ayah(2), ayah(1)] };
assert.equal(parseQuranTranslations(surah, 1, 1, 2).get(1), 'Fixture 1');
for (const ayahs of [[ayah(1)], [ayah(1), ayah(1)], [ayah(1), ayah(3)],
  [ayah(1), { ...ayah(2), surah_number: 2 }], [ayah(1), { ...ayah(2), translation: '' }]]) {
  assert.throws(() => parseQuranTranslations({ ...surah, ayahs }, 1, 1, 2), { reason: 'schema' });
}
assert.throws(() => parseQuranTranslations(surah, 2, 1, 2), { reason: 'schema' });
assert.throws(() => parseQuranTranslations(surah, 1, 2, 3), { reason: 'schema' });
globalThis.fetch = async (url) => {
  assert.equal(url, 'https://api.myquran.com/v3/quran/1/ayat/range/1/2');
  return envelope(surah);
};
assert.equal((await quranTranslations(1, 1, 2, signal())).get(2), 'Fixture 2');
globalThis.__DEV__ = false;
// The client snapshots the development flag at module load.
const productionClient = await import('../src/services/islamic/client.ts?production');
await assert.rejects(productionClient.request('quran', '/v3/quran/1/ayat/range/1/2', signal()), { reason: 'blocked' });
globalThis.__DEV__ = true;
console.log('Quran surah request, explicit ayah mapping, invalid payload rejection and production gate passed.');
let count=0;
globalThis.fetch=async () => { count++; return envelope([1]); };
const url='/v3/calendar/test';
assert.deepEqual(await Promise.all([request('calendar',url,signal()),request('calendar',url,signal())]),[[1],[1]]);
assert.equal(count,1);
globalThis.fetch=async () => new globalThis.Response('invalid JSON');
await assert.rejects(request('calendar',url,signal()),{reason:'schema'});
globalThis.fetch=async () => new globalThis.Response(JSON.stringify({status:false,data:[]}));
await assert.rejects(request('calendar',url,signal()),{reason:'schema'});
count=0;
globalThis.fetch=async () => ++count===1 ? new globalThis.Response('',{status:503}) : envelope(true);
assert.equal(await request('calendar',url,signal()),true);
assert.equal(count,2);
globalThis.fetch=async (_url,{signal:transport}) => new Promise((_,reject)=>{
  const aborted=()=>reject(new Error('abort'));
  if (transport.aborted) aborted();
  else transport.addEventListener('abort',aborted,{once:true});
});
const user=new globalThis.AbortController();
const pending=request('calendar',url,user.signal);
user.abort();
await assert.rejects(pending,{reason:'aborted'});
await assert.rejects(request('calendar',url,signal()),{reason:'timeout'});
count=0;
globalThis.fetch=async () => {
  count++;
  return new globalThis.Response('',{status:429,headers:{'Retry-After':'30'}});
};
await assert.rejects(request('calendar',url,signal()),{status:429});
await assert.rejects(request('calendar',url,signal()),{status:429});
assert.equal(count,1);
console.log('MyQuran client deduplication, invalid responses, bounded retry, cancellation and Retry-After passed.');
