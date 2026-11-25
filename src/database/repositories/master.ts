import type { SQLiteDatabase } from 'expo-sqlite';
import type { CategoryId } from '../seeds/master';

export function readTypes(db: SQLiteDatabase, category: CategoryId) {
  return db.getAllAsync<{ id: string }>(
    'SELECT id FROM ibadah_types WHERE category_id = ? AND is_custom = 0 ORDER BY sort_order, id',
    category,
  );
}
