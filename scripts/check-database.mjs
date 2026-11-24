import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { initializeDatabase } from '../src/database/initialize.ts';
import { readSettings, writeSetting } from '../src/database/repositories/settings.ts';
import { readTypes } from '../src/database/repositories/master.ts';

function adapter(db) {
  return {
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
  };
}

const directory = await mkdtemp(join(tmpdir(), 'hijrah-db-'));
let db;
try {
  const filename = join(directory, 'hijrah.db');
  db = new DatabaseSync(filename);
  await initializeDatabase(adapter(db));
  assert.deepEqual(await readSettings(adapter(db)), { language: 'id', theme: 'system' });
  await writeSetting(adapter(db), 'language', 'en');
  await writeSetting(adapter(db), 'theme', 'dark');
  db.prepare('INSERT INTO user_profiles (id, display_name) VALUES (?, ?)').run('saved', 'Local');
  db.close();
  db = new DatabaseSync(filename);
  await initializeDatabase(adapter(db));
  await initializeDatabase(adapter(db));
  assert.equal(db.prepare('PRAGMA user_version').get().user_version, 1);
  assert.equal(db.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM ibadah_categories').get().count, 4);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM ibadah_types').get().count, 23);
  assert.deepEqual((await readTypes(adapter(db), 'prayer')).map(({ id }) => id), ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']);
  assert.equal(db.prepare('SELECT display_name FROM user_profiles WHERE id = ?').get('saved').display_name, 'Local');
  assert.deepEqual(await readSettings(adapter(db)), { language: 'en', theme: 'dark' });
  assert.throws(() => db.prepare('INSERT INTO ibadah_types VALUES (?, ?, ?)').run('invalid', 'missing', 0), /FOREIGN KEY/);
  console.log('SQLite v1, foreign keys, 4 categories, 23 types, seed idempotency and reopen persistence passed.');
} finally {
  try { db?.close(); } finally { await rm(directory, { recursive: true }); }
}
