import type { SQLiteDatabase } from 'expo-sqlite';
import { initialSchema } from './migrations/schema.ts';
import { profileSchema } from './migrations/profile.ts';
import { prayerSchema } from './migrations/prayer.ts';
import { sunnahSchema } from './migrations/sunnah.ts';
import { seedSettings, writeSetting } from './repositories/settings.ts';
import { categories, categoryIds } from './seeds/master.ts';

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON');
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.withTransactionAsync(async () => {
    const version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    if (!version || version.user_version > 5) throw new Error('Unsupported database schema');
    if (version.user_version === 0) {
      await db.execAsync(initialSchema);
      await db.execAsync('PRAGMA user_version = 1');
    }
    if (version.user_version < 2) {
      await db.execAsync(profileSchema);
      const migratedAt = new Date().toISOString();
      await db.runAsync('UPDATE user_profiles SET created_at = ?, updated_at = ? WHERE created_at = ? AND updated_at = ?', migratedAt, migratedAt, '', '');
      await db.execAsync('PRAGMA user_version = 2');
    }
    await seedSettings(db);
    if (version.user_version < 3) {
      await writeSetting(db, 'language', 'id');
      await db.execAsync('PRAGMA user_version = 3');
    }
    if (version.user_version < 4) {
      await db.execAsync(prayerSchema);
      await db.execAsync('PRAGMA user_version = 4');
    }
    if (version.user_version < 5) {
      await db.execAsync(sunnahSchema);
      await db.execAsync('PRAGMA user_version = 5');
    }
    const categorySql = 'INSERT INTO ibadah_categories (id, sort_order) VALUES (?, ?) ON CONFLICT(id) DO NOTHING';
    const typeSql = 'INSERT INTO ibadah_types (id, category_id, sort_order) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING';
    for (const [categoryOrder, category] of categoryIds.entries()) {
      await db.runAsync(categorySql, category, categoryOrder);
      for (const [typeOrder, type] of categories[category].entries()) {
        await db.runAsync(typeSql, type, category, typeOrder);
      }
    }
  });
}
