import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
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
  assert.equal(v2.prepare('PRAGMA user_version').get().user_version, 5);
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
  assert.equal(old.prepare('PRAGMA user_version').get().user_version, 5);
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
  assert.equal(v4.prepare('PRAGMA user_version').get().user_version, 5);
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
  console.log('Database v5, v1/v2/v4 upgrades, Phase 01–03 regression, Sunnah preferences, ownership, history, idempotency, sessions, summaries and local dates passed.');
} finally {
  for (const db of dbs) if (db.isOpen) db.close();
  await rm(directory, { recursive: true });
}
