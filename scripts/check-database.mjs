import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readVerses, readQuranFontSize, saveQuranFontSize } from '../src/database/repositories/quranReader.ts';
import { quranSchema } from '../src/database/migrations/quran.ts';
import { sunnahSchema } from '../src/database/migrations/sunnah.ts';
import { deleteReading, readBookmark, readReading, readSurahs, saveBookmark, saveReading } from '../src/database/repositories/quran.ts';
import { countAyat, nextPosition, searchSurahs, summarizeReading } from '../src/services/quranRules.ts';
import { quran as enQuran } from '../src/locales/en/quran.ts';
import { quran as idQuran } from '../src/locales/id/quran.ts';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { initializeDatabase } from '../src/database/initialize.ts';
import { initialSchema } from '../src/database/migrations/schema.ts';
import { profileSchema } from '../src/database/migrations/profile.ts';
import { prayerSchema } from '../src/database/migrations/prayer.ts';
import { readSettings, writeSetting } from '../src/database/repositories/settings.ts';
import { readTypes } from '../src/database/repositories/master.ts';
import { readLocalProfile } from '../src/database/repositories/profile.ts';
import { persistProfile } from '../src/services/profile.ts';
import { readPrayerLogs, readPrayerTypes } from '../src/database/repositories/prayer.ts';
import { savePrayer } from '../src/services/prayer.ts';
import { applyPrayerChange, emptyPrayer, prayerSlots, summarizePrayers } from '../src/services/prayerRules.ts';
import { addDays, localDate, parseLocalDate, weekDates } from '../src/utils/localDate.ts';
import { readSunnahActivities, readSunnahSessions } from '../src/database/repositories/sunnah.ts';
import { ensureSunnahPreferences, newSunnahId, quickRecordSunnah, removeSunnahSession, saveSunnahPreferences, saveSunnahSession } from '../src/services/sunnah.ts';
import { measureSunnahActivity, optionalRakaat, summarizeSunnah } from '../src/services/sunnahRules.ts';

function adapter(db) {
  const api = {
    execAsync: async (sql) => db.exec(sql),
    getFirstAsync: async (sql, ...values) => db.prepare(sql).get(...values),
    getAllAsync: async (sql, ...values) => db.prepare(sql).all(...values),
    runAsync: async (sql, ...values) => db.prepare(sql).run(...values),
    withTransactionAsync: async (operation) => {
      db.exec('BEGIN');
      try {
        await operation();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    withExclusiveTransactionAsync: (operation) => api.withTransactionAsync(() => operation(api)),
  };
  return api;
}

const directory = await mkdtemp(join(tmpdir(), 'hijra-db-'));
const dbs = [];
const open = (name) => {
  const db = new DatabaseSync(join(directory, name));
  dbs.push(db);
  return db;
};
const clean = { displayName: '  أحمد Éka  ', gender: null, avatarUri: null };
try {
  const fresh = open('fresh.db');
  const freshApi = adapter(fresh);
  await initializeDatabase(freshApi);
  assert.deepEqual(await readSettings(freshApi), { language: 'id', theme: 'system', week_start: 'monday', completed: false });
  assert.equal((await readLocalProfile(freshApi)).profile, null);
  await assert.rejects(persistProfile(freshApi, null, { ...clean, displayName: '  ' }), /Invalid profile/);
  await assert.rejects(persistProfile(freshApi, null, { ...clean, gender: 'other' }), /Invalid profile/);
  await assert.rejects(persistProfile(freshApi, null, { ...clean, avatarUri: 'file:///cache/photo.png' }), /avatar/);
  fresh.exec("CREATE TRIGGER fail_completion BEFORE UPDATE ON app_settings WHEN NEW.key = 'onboarding_completed' BEGIN SELECT RAISE(ABORT, 'forced failure'); END;");
  await assert.rejects(persistProfile(freshApi, null, clean, { language: 'en', theme: 'dark', week_start: 'sunday' }), /forced failure/);
  assert.equal((await readLocalProfile(freshApi)).profile, null);
  assert.equal((await readSettings(freshApi)).completed, false);
  assert.equal((await readSettings(freshApi)).language, 'id');
  fresh.exec('DROP TRIGGER fail_completion;');
  const created = await persistProfile(freshApi, null, clean, { language: 'en', theme: 'dark', week_start: 'sunday' });
  assert.equal(created.profile.displayName, 'أحمد Éka');
  assert.equal(created.profile.gender, null);
  assert.equal(created.settings.completed, true);
  const v2 = open('phase02.db');
  v2.exec(initialSchema + profileSchema + ' PRAGMA user_version = 2;');
  const v2Api = adapter(v2);
  v2.prepare('INSERT INTO user_profiles (id, display_name) VALUES (?, ?)').run(created.profile.id, created.profile.displayName);
  await writeSetting(v2Api, 'language', 'en');
  await writeSetting(v2Api, 'theme', 'dark');
  await writeSetting(v2Api, 'week_start', 'sunday');
  await writeSetting(v2Api, 'onboarding_completed', 'true');
  await initializeDatabase(v2Api);
  assert.deepEqual(await readSettings(v2Api), { language: 'id', theme: 'dark', week_start: 'sunday', completed: true });
  assert.equal((await readLocalProfile(v2Api)).profile.id, created.profile.id);
  await writeSetting(v2Api, 'language', 'en');
  await initializeDatabase(v2Api);
  assert.equal((await readSettings(v2Api)).language, 'en');
  assert.equal(v2.prepare('PRAGMA user_version').get().user_version, 8);
  await assert.rejects(persistProfile(freshApi, created.profile.id, clean, { language: 'id', theme: 'system', week_start: 'monday' }), /already completed/);
  assert.ok(fresh.prepare("SELECT value FROM app_settings WHERE key = 'onboarding_completed_at'").get().value);

  const old = open('existing.db');
  old.exec(initialSchema + ' PRAGMA user_version = 1;');
  old.prepare('INSERT INTO user_profiles VALUES (?, ?)').run('saved', 'Local');
  old.prepare('INSERT INTO app_settings VALUES (?, ?)').run('language', 'en');
  old.prepare('INSERT INTO app_settings VALUES (?, ?)').run('theme', 'dark');
  old.prepare('INSERT INTO ibadah_categories VALUES (?, ?)').run('prayer', 0);
  old.prepare('INSERT INTO ibadah_types VALUES (?, ?, ?)').run('fajr', 'prayer', 0);

  const oldApi = adapter(old);
  await initializeDatabase(oldApi);
  await initializeDatabase(oldApi);
  const existing = await readLocalProfile(oldApi);
  assert.equal(existing.profile.id, 'saved');
  assert.equal(existing.profile.displayName, 'Local');
  assert.ok(existing.profile.createdAt);
  assert.deepEqual(await readSettings(oldApi), { language: 'id', theme: 'dark', week_start: 'monday', completed: false });
  assert.equal(old.prepare('PRAGMA user_version').get().user_version, 8);
  assert.equal(old.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  assert.equal(old.prepare('SELECT COUNT(*) AS count FROM ibadah_categories').get().count, 4);
  assert.equal(old.prepare('SELECT COUNT(*) AS count FROM ibadah_types').get().count, 31);
  assert.deepEqual((await readTypes(oldApi, 'prayer')).map(({ id }) => id), ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']);
  assert.throws(() => old.prepare('INSERT INTO ibadah_types (id, category_id, sort_order) VALUES (?, ?, ?)').run('invalid', 'missing', 0), /FOREIGN KEY/);
  const avatar = 'profiles/avatars/123-test.jpg';
  const edited = await persistProfile(oldApi, 'saved', { ...clean, avatarUri: avatar });
  assert.equal(edited.profile.id, 'saved');
  assert.equal(edited.profile.createdAt, existing.profile.createdAt);
  assert.equal(edited.settings.language, 'id');
  await writeSetting(oldApi, 'week_start', 'friday');
  old.close();
  const reopened = open('existing.db');
  assert.equal((await readSettings(adapter(reopened))).week_start, 'friday');
  assert.equal((await readLocalProfile(adapter(reopened))).profile.avatarUri, avatar);
  const prayerDate = localDate();
  const target = { userId: 'saved', prayerId: 'fajr', date: prayerDate };
  const api = adapter(reopened);
  const ids = await readPrayerTypes(api);
  assert.deepEqual(ids, ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']);
  assert.equal(summarizePrayers(prayerSlots(ids, await readPrayerLogs(api, 'saved', prayerDate), prayerDate).map(x => x.record)).notLogged, 5);
  assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM prayer_logs').get().count, 0);
  assert.equal(await savePrayer(api, target, { type: 'status', value: 'NOT_LOGGED' }), null);
  const noted = await savePrayer(api, target, { type: 'notes', value: '  Private  ' });
  assert.equal(noted.status, 'NOT_LOGGED');
  assert.equal(noted.notes, 'Private');
  const [, , details] = await Promise.all([
    savePrayer(api, target, { type: 'status', value: 'COMPLETED' }),
    savePrayer(api, target, { type: 'attribute', field: 'onTime', value: false }),
    savePrayer(api, target, { type: 'attribute', field: 'congregational', value: true }),
  ]);
  assert.equal(details.id, noted.id);
  assert.equal(details.createdAt, noted.createdAt);
  assert.equal(details.onTime, false);
  assert.equal(details.congregational, true);
  const transitioned = await savePrayer(api, target, { type: 'status', value: 'MISSED' });
  assert.equal(transitioned.notes, 'Private');
  assert.equal(transitioned.onTime, null);
  assert.equal(transitioned.congregational, null);
  await assert.rejects(savePrayer(api, target, { type: 'attribute', field: 'onTime', value: true }), /attribute/);
  await assert.rejects(savePrayer(api, { ...target, date: addDays(prayerDate, 1) }, { type: 'status', value: 'EXEMPT' }), /future/);
  await assert.rejects(savePrayer(api, { ...target, date: '2025-02-29' }, { type: 'status', value: 'COMPLETED' }), /calendar/);
  await assert.rejects(savePrayer(api, { ...target, prayerId: 'duha' }, { type: 'status', value: 'COMPLETED' }), /prayer type/);
  await assert.rejects(savePrayer(api, { ...target, userId: 'missing' }, { type: 'status', value: 'COMPLETED' }), /profile/);
  await assert.rejects(savePrayer(api, target, { type: 'notes', value: 'x'.repeat(501) }), /too long/);
  const previous = addDays(prayerDate, -1);
  await Promise.all([
    savePrayer(api, { ...target, date: previous }, { type: 'status', value: 'EXEMPT' }),
    savePrayer(api, target, { type: 'notes', value: '' }),
  ]);
  const logs = await readPrayerLogs(api, 'saved', previous, prayerDate);
  assert.equal(logs.length, 2);
  assert.equal(logs.find(x => x.date === prayerDate).notes, null);
  assert.equal((await readPrayerLogs(api, 'missing', previous, prayerDate)).length, 0);
  assert.throws(() => reopened.prepare('UPDATE prayer_logs SET is_on_time = 1 WHERE id = ?').run(noted.id), /CHECK/);
  reopened.exec("CREATE TRIGGER fail_prayer BEFORE UPDATE ON prayer_logs WHEN NEW.status = 'COMPLETED' BEGIN SELECT RAISE(ABORT, 'simulated prayer failure'); END;");
  await assert.rejects(savePrayer(api, target, { type: 'status', value: 'COMPLETED' }), /simulated prayer failure/);
  assert.equal((await readPrayerLogs(api, 'saved', prayerDate))[0].status, 'MISSED');
  reopened.exec('DROP TRIGGER fail_prayer;');
  assert.equal((await savePrayer(api, target, { type: 'status', value: 'COMPLETED' })).status, 'COMPLETED');
  await initializeDatabase(api);
  assert.equal((await readPrayerLogs(api, 'saved', previous, prayerDate)).length, 2);

  const completedSlot = applyPrayerChange(emptyPrayer, { type: 'status', value: 'COMPLETED' });
  const exempt = applyPrayerChange(emptyPrayer, { type: 'status', value: 'EXEMPT' });
  const missed = applyPrayerChange(emptyPrayer, { type: 'status', value: 'MISSED' });
  const weekly = summarizePrayers([
    ...Array.from({ length: 28 }, (_, i) => ({ ...completedSlot, onTime: i < 24 ? true : null, congregational: i < 20 })),
    ...Array(5).fill(exempt), missed, emptyPrayer,
  ]);
  assert.equal(weekly.totalSlots, 35);
  assert.equal(weekly.applicableSlots, 30);
  assert.equal(weekly.completionPercentage.toFixed(1), '93.3');
  assert.equal(weekly.onTimePercentage.toFixed(1), '85.7');
  assert.equal(weekly.congregationalPercentage.toFixed(1), '71.4');
  assert.equal(weekly.onTimeUnspecified, 4);
  assert.equal(weekly.congregationalNo, 8);
  assert.equal(summarizePrayers(Array(5).fill(exempt)).completionPercentage, null);
  assert.equal(summarizePrayers([emptyPrayer]).onTimePercentage, null);
  assert.deepEqual(weekDates('2026-11-25', 'monday').slice(0, 3), ['2026-11-23', '2026-11-24', '2026-11-25']);
  assert.equal(weekDates('2026-11-25', 'sunday')[0], '2026-11-22');
  assert.equal(weekDates('2026-11-25', 'monday').filter(day => day <= '2026-11-25').length * ids.length, 15);
  assert.equal(addDays('2024-02-28', 1), '2024-02-29');
  assert.equal(addDays('2025-12-31', 1), '2026-01-01');
  assert.equal(parseLocalDate('2025-02-29'), null);

  const v4 = open('phase03.db');
  v4.exec(initialSchema + profileSchema + prayerSchema + ' PRAGMA user_version = 4;');
  const v4Api = adapter(v4);
  v4.prepare('INSERT INTO user_profiles (id, display_name, avatar_uri) VALUES (?, ?, ?)').run('v4-user', 'Existing', avatar);
  v4.prepare('INSERT INTO ibadah_categories VALUES (?, ?)').run('prayer', 0);
  v4.prepare('INSERT INTO ibadah_types VALUES (?, ?, ?)').run('fajr', 'prayer', 0);
  v4.prepare('INSERT INTO prayer_logs (id, user_id, ibadah_type_id, prayer_date, status) VALUES (?, ?, ?, ?, ?)').run('old-prayer', 'v4-user', 'fajr', prayerDate, 'COMPLETED');
  await writeSetting(v4Api, 'language', 'en');
  await initializeDatabase(v4Api);
  assert.equal((await readPrayerLogs(v4Api, 'v4-user', prayerDate))[0].id, 'old-prayer');
  assert.equal((await readLocalProfile(v4Api)).profile.avatarUri, avatar);
  assert.equal((await readSettings(v4Api)).language, 'en');
  assert.equal(v4.prepare('PRAGMA user_version').get().user_version, 8);
  assert.equal((await readSunnahSessions(v4Api, 'v4-user', prayerDate)).length, 0);
  v4.exec("CREATE TRIGGER fail_default BEFORE INSERT ON user_sunnah_preferences WHEN NEW.ibadah_type_id = 'before-fajr' BEGIN SELECT RAISE(ABORT, 'simulated preference failure'); END;");
  await assert.rejects(ensureSunnahPreferences(v4Api, 'v4-user'), /simulated preference failure/);
  assert.equal(v4.prepare('SELECT COUNT(*) AS count FROM user_sunnah_preferences').get().count, 0);
  v4.exec('DROP TRIGGER fail_default;');
  await Promise.all([ensureSunnahPreferences(v4Api, 'v4-user'), ensureSunnahPreferences(v4Api, 'v4-user')]);
  const activities = await readSunnahActivities(v4Api, 'v4-user');
  assert.equal(activities.length, 17);
  assert.deepEqual(activities.filter(x => x.active).map(x => x.id), ['tahajjud', 'witr', 'duha', 'before-fajr', 'after-dhuhr']);
  const duha = activities.find(x => x.id === 'duha');
  await saveSunnahPreferences(v4Api, 'v4-user', [{ ...duha, defaultRakaat: 2, order: 0 }]);
  const sunnahTarget = { date: prayerDate, userId: 'v4-user', activityId: 'duha' };
  const quick = await Promise.all([quickRecordSunnah(v4Api, sunnahTarget), quickRecordSunnah(v4Api, sunnahTarget)]);
  assert.equal(quick[0].id, quick[1].id);
  assert.equal(quick[0].rakaat, null);
  assert.equal(quick[0].prayerTime, null);
  const detail = { rakaat: 3, prayerTime: '08:15', notes: '  private  ' };
  const intent = newSunnahId('session');
  const third = newSunnahId('session');
  await Promise.all([
    saveSunnahSession(v4Api, sunnahTarget, intent, detail, false),
    saveSunnahSession(v4Api, sunnahTarget, intent, detail, false),
    saveSunnahSession(v4Api, sunnahTarget, third, detail, false),
  ]);
  await assert.rejects(removeSunnahSession(v4Api, sunnahTarget, quick[0].id, true), /changed/);
  const sessionSummary = summarizeSunnah(await readSunnahSessions(v4Api, 'v4-user', prayerDate));
  assert.deepEqual(sessionSummary, { distinctActivities: 1, totalSessions: 3, activeDays: 1, recordedRakaat: 6, sessionsWithRakaat: 2, sessionsWithoutRakaat: 1 });
  await removeSunnahSession(v4Api, sunnahTarget, third);
  await removeSunnahSession(v4Api, sunnahTarget, quick[0].id);
  await assert.rejects(removeSunnahSession(v4Api, sunnahTarget, intent, true), /changed/);
  await saveSunnahPreferences(v4Api, 'v4-user', activities.map(x => ({ ...x, active: false })));
  await ensureSunnahPreferences(v4Api, 'v4-user');
  assert.equal((await readSunnahActivities(v4Api, 'v4-user')).filter(x => x.active).length, 0);
  await assert.rejects(saveSunnahSession(v4Api, sunnahTarget, newSunnahId('session'), detail, false), /inactive/);
  const editedSunnah = await saveSunnahSession(v4Api, sunnahTarget, intent, { rakaat: null, prayerTime: '', notes: '' }, true);
  assert.equal(editedSunnah.rakaat, null);
  assert.equal(editedSunnah.prayerTime, null);
  assert.equal(editedSunnah.notes, null);
  assert.equal(measureSunnahActivity([editedSunnah], 'duha', 'RAKAAT_COUNT').value, null);
  const customId = newSunnahId('activity');
  const custom = { id: customId, name: 'Ibadah pribadi', description: ' Lokal ', custom: true, active: true, order: 1, defaultRakaat: 5 };
  await assert.rejects(saveSunnahPreferences(v4Api, 'v4-user', [{ ...custom, name: ' BEFORE FAJR ' }]), /duplicate/);
  await saveSunnahPreferences(v4Api, 'v4-user', [custom]);
  const customSession = await saveSunnahSession(v4Api, { ...sunnahTarget, activityId: customId, date: previous }, newSunnahId('session'), detail, false);
  await saveSunnahPreferences(v4Api, 'v4-user', [{ ...custom, name: 'Ibadah saya', active: false }]);
  assert.equal((await readSunnahActivities(v4Api, 'v4-user')).find(x => x.id === customId).name, 'Ibadah saya');
  assert.equal((await readSunnahSessions(v4Api, 'v4-user', previous, prayerDate, customId))[0].id, customSession.id);
  assert.equal((await readTypes(v4Api, 'sunnah')).some(x => x.id === customId), false);
  v4.prepare('INSERT INTO user_profiles (id, display_name) VALUES (?, ?)').run('other', 'Other');
  assert.equal((await readSunnahActivities(v4Api, 'other')).some(x => x.id === customId), false);
  await assert.rejects(quickRecordSunnah(v4Api, { ...sunnahTarget, userId: 'other', activityId: customId }), /activity/);
  await assert.rejects(quickRecordSunnah(v4Api, { ...sunnahTarget, date: addDays(prayerDate, 1) }), /future/);
  await assert.rejects(saveSunnahSession(v4Api, sunnahTarget, intent, { ...detail, prayerTime: '24:01' }, true), /time/);
  assert.throws(() => optionalRakaat('2.5'), /rakaat/);
  assert.throws(() => optionalRakaat('0'), /rakaat/);
  assert.throws(() => optionalRakaat('1000'), /rakaat/);
  assert.equal(optionalRakaat(''), null);
  const sampleDaily = [['tahajjud', 2], ['witr', 3], ['duha', 2], ['duha', 4]].map(([activityId, rakaat]) =>
    ({ ...editedSunnah, activityId, rakaat }));
  assert.deepEqual(summarizeSunnah(sampleDaily), {
    distinctActivities: 3, totalSessions: 4, activeDays: 1, recordedRakaat: 11, sessionsWithRakaat: 4, sessionsWithoutRakaat: 0,
  });
  const sampleWeekly = [
    ['tahajjud', 5, [2, 2, 2, 2, 2]], ['witr', 7, [3, 3, 3, 3, 3, 3, 3]], ['duha', 6, [3, 3, 3, 3, 3, 3, 3, 3]],
    ['before-fajr', 6, [2, 2, 2, 2, 2, 2]], ['after-dhuhr', 4, [2, 2, 2, 2]],
  ].flatMap(([activityId, days, rakaat]) => rakaat.map((value, index) =>
    ({ ...editedSunnah, activityId, date: addDays(prayerDate, -(index % days)), rakaat: value })));
  assert.deepEqual(summarizeSunnah(sampleWeekly), {
    distinctActivities: 5, totalSessions: 30, activeDays: 7, recordedRakaat: 75, sessionsWithRakaat: 30, sessionsWithoutRakaat: 0,
  });
  assert.deepEqual(measureSunnahActivity(sampleWeekly, 'duha', 'ACTIVE_DAYS'), { value: 6, sessionsWithoutRakaat: 0 });
  v4.close();
  const v4Reopened = adapter(open('phase03.db'));
  await initializeDatabase(v4Reopened);
  assert.equal((await readSunnahSessions(v4Reopened, 'v4-user', previous, prayerDate)).length, 2);
  assert.equal((await readPrayerLogs(v4Reopened, 'v4-user', prayerDate))[0].id, 'old-prayer');
  reopened.prepare('INSERT INTO user_profiles (id, display_name) VALUES (?, ?)').run('unexpected', 'Retained');
  assert.deepEqual(await readLocalProfile(adapter(reopened)), { profile: null, conflict: true });
  await assert.rejects(persistProfile(adapter(reopened), 'saved', clean), /Unexpected local profile/);
  assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM user_profiles').get().count, 2);

  const broken = open('broken.db');
  broken.exec(initialSchema + ' PRAGMA user_version = 1; ALTER TABLE user_profiles ADD COLUMN avatar_uri TEXT;');
  await assert.rejects(initializeDatabase(adapter(broken)), /duplicate column/);
  assert.equal(broken.prepare('PRAGMA user_version').get().user_version, 1);
  assert.ok(!broken.prepare('PRAGMA table_info(user_profiles)').all().some((column) => column.name === 'gender'));
  assert.deepEqual(Object.keys(enQuran).sort(), Object.keys(idQuran).sort());
  for (const key of Object.keys(enQuran)) {
    const params = (text) => [...text.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort();
    assert.deepEqual(params(enQuran[key]), params(idQuran[key]));
  }

  // Use the production catalog with test-only users and sessions.
  const v5 = open('phase05-upgrade.db');
  v5.exec(initialSchema + profileSchema + prayerSchema + sunnahSchema + ' PRAGMA user_version = 5;');
  v5.exec("INSERT INTO user_profiles (id, display_name, avatar_uri) VALUES ('q-user', 'Q', 'file:///avatar.png'), ('other', 'Other', NULL);");
  v5.exec("INSERT INTO app_settings (key, value) VALUES ('language', 'en');");
  v5.exec("INSERT INTO ibadah_categories VALUES ('sunnah', 1), ('prayer', 0);");
  v5.exec("INSERT INTO ibadah_types (id, category_id, sort_order) VALUES ('duha', 'sunnah', 0), ('fajr', 'prayer', 0);");
  v5.exec("INSERT INTO sunnah_prayer_logs (id, user_id, ibadah_type_id, prayer_date, rakaat) VALUES ('prior', 'q-user', 'duha', '2024-07-01', 2);");
  const qa = adapter(v5);
  await initializeDatabase(qa);
  assert.equal(v5.prepare('PRAGMA user_version').get().user_version, 8);
  assert.equal(v5.prepare("SELECT avatar_uri FROM user_profiles WHERE id='q-user'").get().avatar_uri, 'file:///avatar.png');
  assert.equal(v5.prepare("SELECT rakaat FROM sunnah_prayer_logs WHERE id='prior'").get().rakaat, 2);
  assert.equal((await readSettings(qa)).language, 'en');
  const catalog = await readSurahs(qa);
  assert.equal(catalog.size, 114);
  assert.equal([...catalog.values()].reduce((sum, row) => sum + row.verses, 0), 6236);
  assert([...catalog.values()].every((row, index) => row.number === index + 1 && row.arabic && row.latin && row.id === null && row.en === null));
  const dataset = await readFile(new URL('../assets/data/quran/tanzil-surahs.json', import.meta.url));
  assert.equal(createHash('sha256').update(dataset.toString('utf8').replace(/\r\n/g, '\n')).digest('hex'), 'f68bf6abb0525f6fe7f1e332a2ab21500bee93e9409fcfaef5aa4612d732255f');

  const legacyQuran = open('legacy-quran-v6.db');
  legacyQuran.exec(initialSchema + profileSchema + prayerSchema + sunnahSchema + quranSchema + ' PRAGMA user_version = 6;');
  legacyQuran.exec(`
    INSERT INTO user_profiles (id, display_name) VALUES ('legacy', 'Legacy');
    INSERT INTO quran_surahs VALUES (2, 'Legacy AR', 'Legacy Latin', 'Legacy ID', 'Legacy EN', 286);
    INSERT INTO quran_reading_logs (id, user_id, reading_date, start_surah, start_ayah, end_surah, end_ayah) VALUES ('legacy-session', 'legacy', '2024-07-01', 2, 1, 2, 4);
    INSERT INTO quran_bookmarks (id, user_id, surah_number, ayah_number) VALUES ('legacy-mark', 'legacy', 2, 4);
  `);
  const legacyApi = adapter(legacyQuran);
  await initializeDatabase(legacyApi);
  assert.equal(legacyQuran.prepare('PRAGMA user_version').get().user_version, 8);
  assert.equal((await readSurahs(legacyApi)).get(2).id, 'Legacy ID');
  assert.equal((await readReading(legacyApi, 'legacy', '2024-07-01'))[0].id, 'legacy-session');
  assert.deepEqual({ ...await readBookmark(legacyApi, 'legacy') }, { surah: 2, ayah: 4 });
  assert.deepEqual(legacyQuran.prepare('PRAGMA foreign_key_check').all(), []);
  const pos = (surah, ayah) => ({ surah, ayah });
  assert.equal(countAyat(catalog, pos(1, 1), pos(1, 7)), 7);
  assert.equal(countAyat(catalog, pos(2, 21), pos(2, 35)), 15);
  assert.equal(countAyat(catalog, pos(2, 280), pos(3, 10)), 17);
  assert.equal(countAyat(catalog, pos(1, 5), pos(3, 3)), 292);
  assert.equal(countAyat(catalog, pos(112, 2), pos(112, 2)), 1);
  for (const pair of [[pos(2, 50), pos(2, 20)], [pos(1, 1), pos(1, 8)], [pos(1, 0), pos(1, 1)], [pos(1, 1.5), pos(1, 2)], [pos(3, 1), pos(2, 1)], [pos(115, 1), pos(114, 1)]]) {
    assert.equal(countAyat(catalog, ...pair), null);
  }
  for (const query of ['1', 'Al-Faatiha', 'الفاتحة']) {
    const matches = searchSurahs(catalog, query);
    assert(matches.some((surah) => surah.number === 1));
  }
  assert.deepEqual(nextPosition(catalog, pos(2, 35)), pos(2, 36));
  assert.deepEqual(nextPosition(catalog, pos(1, 7)), pos(2, 1));
  assert.equal(nextPosition(catalog, pos(114, 6)), 'restart');
  const day = '2024-07-01';
  const repeated = { date: day, start: pos(112, 1), end: pos(112, 4), duration: null, notes: 'Private fixture' };
  const log = (id, value = repeated, edit = false, bookmark = false) => saveReading(qa, 'q-user', id, value, edit, bookmark);
  await saveBookmark(qa, 'q-user', pos(2, 100));
  assert.equal((await readReading(qa, 'q-user', day)).length, 0);
  await Promise.all([log('one'), log('one'), log('two')]);
  const stored = await readReading(qa, 'q-user', day);
  assert.equal(stored.length, 2);
  assert.equal(stored[0].notes, repeated.notes);
  assert.deepEqual(summarizeReading(catalog, stored), { ayat: 8, sessions: 2, activeDays: 1,
    recordedMinutes: null, withDuration: 0, withoutDuration: 2 });
  assert.equal((await readReading(qa, 'other', day)).length, 0);
  assert.deepEqual({ ...await readBookmark(qa, 'q-user') }, pos(2, 100));
  await assert.rejects(log('future', { ...repeated, date: '9999-01-01' }), /future/);
  await assert.rejects(log('duration', { ...repeated, duration: 0 }), /duration/);
  await assert.rejects(log('duration', { ...repeated, duration: 1441 }), /duration/);
  await log('one', { ...repeated, duration: 15 }, true);
  assert.equal(summarizeReading(catalog, await readReading(qa, 'q-user', day)).recordedMinutes, 15);
  v5.exec("CREATE TRIGGER fail_bookmark BEFORE UPDATE ON quran_bookmarks BEGIN SELECT RAISE(ABORT, 'bookmark failed'); END;");
  await assert.rejects(log('atomic', repeated, false, true), /bookmark failed/);
  await assert.rejects(log('one', { ...repeated, notes: 'Edit' }, true, true), /bookmark failed/);
  assert.equal((await readReading(qa, 'q-user', day)).length, 2);
  assert.equal((await readReading(qa, 'q-user', day)).find((session) => session.id === 'one').notes, repeated.notes);
  assert.deepEqual({ ...await readBookmark(qa, 'q-user') }, pos(2, 100));
  v5.exec('DROP TRIGGER fail_bookmark;');
  await log('atomic', { ...repeated, date: '2024-07-02', duration: 10 }, false, true);
  assert.deepEqual({ ...await readBookmark(qa, 'q-user') }, pos(112, 4));
  await deleteReading(qa, 'other', 'one');
  assert.equal((await readReading(qa, 'q-user', day)).length, 2);
  await deleteReading(qa, 'q-user', 'one');
  assert.deepEqual({ ...await readBookmark(qa, 'q-user') }, pos(112, 4));
  await saveBookmark(qa, 'q-user', null);
  const again = adapter(open('phase05-upgrade.db'));
  await initializeDatabase(again);
  assert.equal((await readReading(again, 'q-user', day, '2024-07-07')).length, 2);
  assert.equal((await readBookmark(again, 'q-user')) ?? null, null);
  const grouped = [
    { ...repeated, end: pos(112, 2), duration: null },
    { ...repeated, date: '2024-07-01', start: pos(2, 1), end: pos(2, 20), duration: 15 },
    { ...repeated, date: '2024-07-02', start: pos(2, 1), end: pos(2, 15), duration: 10 },
  ];
  assert.deepEqual(summarizeReading(catalog, grouped.slice(1).concat(repeated)), {
    ayat: 39, sessions: 3, activeDays: 2, recordedMinutes: 25, withDuration: 2, withoutDuration: 1,
  });
  assert.equal(summarizeReading(catalog, grouped.concat({ ...repeated, date: '2024-07-04' })).activeDays, 3);
  const today = localDate();
  const baqara = (start, end) => ({ date: today, start: pos(2, start), end: pos(2, end), duration: null, notes: null });
  await saveReading(qa, 'other', 'baqara-1', baqara(1, 5), false, true);
  assert.deepEqual({ ...await readBookmark(qa, 'other') }, pos(2, 5));
  assert.deepEqual(nextPosition(catalog, pos(2, 5)), pos(2, 6));
  assert.equal(summarizeReading(catalog, await readReading(qa, 'other', today)).ayat, 5);
  await saveReading(qa, 'other', 'baqara-2', baqara(6, 10), false, true);
  const dashboardTotals = summarizeReading(await readSurahs(again), await readReading(again, 'other', today));
  assert.equal(dashboardTotals.ayat, 10);
  assert.equal(dashboardTotals.sessions, 2);
  assert.deepEqual({ ...await readBookmark(again, 'other') }, pos(2, 10));
  const packedText = await readFile(new URL('../assets/data/quran/tanzil-uthmani.json', import.meta.url), 'utf8');
  const canonicalText = packedText.replace(/\r\n/g, '\n');
  assert.equal(createHash('sha256').update(canonicalText).digest('hex'),
    'f8ddeb66df064d38579d37ecbae1ddd833ff5088b595f2329e8b77d7b1864f51');
  const { raw } = JSON.parse(packedText);
  assert.equal(createHash('sha256').update(raw).digest('hex'),
    'bf4f57b968d03f4131c070b1e285da9be0e0a108a21c910e872801ca273312c8');
  const sourceRows = raw.split(/\r?\n/).filter((line) => /^\d/.test(line));
  const offlineRows = [];
  for (const surah of catalog.values()) {
    const verses = await readVerses(qa, surah.number);
    assert.equal(verses.length, surah.verses);
    offlineRows.push(...verses.map(({ surah, ayah, arabic }) => [surah, ayah, arabic].join('|')));
  }
  assert.equal(offlineRows.length, 6236);
  assert.deepEqual(offlineRows, sourceRows);
  const opening = await readVerses(qa, 1);
  const second = await readVerses(qa, 2);
  const ninth = await readVerses(qa, 9);
  assert(second[0].arabic.startsWith(opening[0].arabic + ' '));
  assert(!ninth[0].arabic.startsWith(opening[0].arabic));
  assert.equal(await readQuranFontSize(qa), 30);
  await saveQuranFontSize(qa, 46);

  const offlineReopen = adapter(open('phase05-upgrade.db'));
  await initializeDatabase(offlineReopen);
  assert.equal(await readQuranFontSize(offlineReopen), 46);
  assert.deepEqual(await readVerses(offlineReopen, 1), opening);
  v5.exec("INSERT INTO user_profiles (id, display_name) VALUES ('reader-profile', 'Reader');");
  const recordReader = (id, start, end) => saveReading(qa, 'reader-profile', id, {
    date: today, start, end, duration: null, notes: null,
  }, false, true);
  await recordReader('opening-1', pos(1, 1), pos(1, 5));
  assert.equal(summarizeReading(catalog, await readReading(offlineReopen, 'reader-profile', today)).ayat, 5);
  assert.deepEqual(nextPosition(catalog, await readBookmark(offlineReopen, 'reader-profile')), pos(1, 6));
  await recordReader('opening-2', pos(1, 6), pos(1, 7));
  const readerTotals = summarizeReading(catalog, await readReading(offlineReopen, 'reader-profile', today));
  assert.equal(readerTotals.ayat, 7);
  assert.equal(readerTotals.sessions, 2);
  assert.deepEqual(nextPosition(catalog, await readBookmark(offlineReopen, 'reader-profile')), pos(2, 1));
  // Emulate an already deployed v7 database populated with reading records.
  v5.exec('DROP TABLE quran_verses; PRAGMA user_version = 7;');
  await initializeDatabase(qa);
  assert.equal(v5.prepare('PRAGMA user_version').get().user_version, 8);
  assert.deepEqual(await readVerses(qa, 1), opening);
  assert.deepEqual(await readBookmark(qa, 'reader-profile'), await readBookmark(offlineReopen, 'reader-profile'));
  assert.equal((await readReading(qa, 'reader-profile', today)).length, 2);
  assert.deepEqual(v5.prepare('PRAGMA foreign_key_check').all(), []);
  const brokenQuran = open('broken-quran.db');
  brokenQuran.exec(initialSchema + profileSchema + prayerSchema + sunnahSchema + ' PRAGMA user_version = 5; CREATE TABLE quran_bookmarks (id TEXT);');
  await assert.rejects(initializeDatabase(adapter(brokenQuran)), /already exists/);
  assert.equal(brokenQuran.prepare('PRAGMA user_version').get().user_version, 5);
  assert.equal(brokenQuran.prepare("SELECT count(*) AS count FROM sqlite_master WHERE name = 'quran_surahs'").get().count, 0);
  console.log('Quran migration to v8, verbatim text integrity, font persistence, reader recording, production catalog calculations, bookmark transitions, atomic rollback, duplicate submission and localization parity passed.');

  console.log('Database v8, v1/v2/v4 upgrades, Phase 01–03 regression, Sunnah preferences, ownership, history, idempotency, sessions, summaries and local dates passed.');
} finally {
  for (const db of dbs) if (db.isOpen) db.close();
  await rm(directory, { recursive: true });
}
